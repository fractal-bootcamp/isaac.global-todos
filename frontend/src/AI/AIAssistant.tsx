import { useState } from 'react';
import Anthropic from '@anthropic-ai/sdk';
import { useTaskStore } from '../store/taskStore';
import { z } from 'zod';
import { TaskStatus, EpicStatus } from '../types/task';

// Zod Schemas
const taskStatusSchema = z.enum(["pending", "in-progress", "completed", "archived"] as const);
const epicStatusSchema = z.enum(["active", "completed"] as const);

const taskSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    status: taskStatusSchema.optional().default("pending"),
    epicId: z.string().optional(),
});

const epicSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    status: epicStatusSchema.optional().default("active"),
});

const aiResponseSchema = z.object({
    type: z.enum(["tasks", "epic"]),
    data: z.union([
        z.object({ tasks: z.array(taskSchema) }),
        z.object({ epic: epicSchema, tasks: z.array(taskSchema).optional() })
    ])
});

type AIResponse = z.infer<typeof aiResponseSchema>;

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

const anthropic = new Anthropic({
    apiKey: import.meta.env.VITE_CLAUDE_API_KEY,
    dangerouslyAllowBrowser: true,
});

export const AIAssistant = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [error, setError] = useState<string | null>(null);

    const {
        createTask,
        createEpic,
        assignTaskToEpic
    } = useTaskStore();

    const handleAIResponse = async (response: AIResponse): Promise<string> => {
        try {
            if (response.type === "tasks") {
                const { tasks } = response.data as { tasks: z.infer<typeof taskSchema>[] };
                for (const task of tasks) {
                    createTask(task.title, task.description);
                }
                return `Created ${tasks.length} tasks successfully.`;
            } else {
                const { epic, tasks } = response.data as {
                    epic: z.infer<typeof epicSchema>,
                    tasks?: z.infer<typeof taskSchema>[]
                };

                // Create the epic first
                const epicId = await createEpic(epic.title, epic.description);

                // Create and assign tasks if they exist
                if (tasks && tasks.length > 0) {
                    for (const task of tasks) {
                        const taskId = await createTask(task.title, task.description);
                        await assignTaskToEpic(taskId, epicId);
                    }
                }

                return `Created epic "${epic.title}" with ${tasks?.length || 0} associated tasks.`;
            }
        } catch (error) {
            console.error('Error handling AI response:', error);
            throw new Error('Failed to create tasks/epic');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setError(null);

        try {
            const apiResponse = await anthropic.messages.create({
                model: 'claude-3-5-sonnet-20241022',
                max_tokens: 1024,
                messages: [{
                    role: 'user',
                    content: `You are a task management assistant. Based on the user's request, generate a JSON response that follows this format:
                    For tasks: { "type": "tasks", "data": { "tasks": [{ "title": "", "description": "" }] }}
                    For epics: { "type": "epic", "data": { "epic": { "title": "", "description": "" }, "tasks": [] }}
                    
                    User request: ${input}`
                }]
            });

            const content = apiResponse.content[0].type === 'text'
                ? apiResponse.content[0].text
                : 'Unsupported response type';

            const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('No valid JSON found in response');
            }

            const jsonData = JSON.parse(jsonMatch[1] || jsonMatch[0]);
            const validatedResponse = aiResponseSchema.parse(jsonData);
            const resultMessage = await handleAIResponse(validatedResponse);

            setMessages(prev => [...prev, { role: 'assistant', content: resultMessage }]);
        } catch (error) {
            console.error('Error:', error);
            setError('An error occurred while processing your request.');
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'Sorry, there was an error processing your request.'
            }]);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">AI Assistant</h2>

            {error && (
                <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
                    {error}
                </div>
            )}

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4 h-96 overflow-y-auto">
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}
                    >
                        <div
                            className={`inline-block p-3 rounded-lg ${message.role === 'user'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-100 text-gray-800'
                                }`}
                        >
                            {message.content}
                        </div>
                    </div>
                ))}
            </div>

            <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 p-2 border rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Type your message... (e.g., 'Create a new epic for frontend tasks')"
                />
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Send
                </button>
            </form>
        </div>
    );
};