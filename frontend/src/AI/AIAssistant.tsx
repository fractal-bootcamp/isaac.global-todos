import { useState } from 'react';
import Anthropic from '@anthropic-ai/sdk';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

// Initialize the Anthropic client with the API key from the environment variable
const anthropic = new Anthropic({
    apiKey: import.meta.env.VITE_CLAUDE_API_KEY,
    dangerouslyAllowBrowser: true,
});

export const AIAssistant = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        // Add user message
        const userMessage: Message = { role: 'user', content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');

        try {
            // Build the prompt from the conversation history
            const conversation = [...messages, userMessage];
            let prompt = '';

            for (const msg of conversation) {
                if (msg.role === 'user') {
                    prompt += `\n\nHuman: ${msg.content}`;
                } else {
                    prompt += `\n\nAssistant: ${msg.content}`;
                }
            }

            // Add the assistant's prompt prefix
            prompt += `\n\nAssistant:`;

            // Send the prompt to Claude
            const apiResponse = await anthropic.messages.create({
                model: 'claude-3-5-sonnet-20241022',
                max_tokens: 1024,
                messages: [{
                    role: 'user',
                    content: input
                }]
            });

            // Add assistant's response to the messages
            const assistantMessage: Message = {
                role: 'assistant',
                content: apiResponse.content[0].type === 'text'
                    ? apiResponse.content[0].text
                    : 'Unsupported response type',
            };
            setMessages((prev) => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Error communicating with AI assistant:', error);
            // Optionally, display an error message in the chat
            const errorMessage: Message = {
                role: 'assistant',
                content: 'Sorry, there was an error processing your request.',
            };
            setMessages((prev) => [...prev, errorMessage]);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">AI Assistant</h2>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4 h-96 overflow-y-auto">
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'
                            }`}
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
                    placeholder="Type your message..."
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