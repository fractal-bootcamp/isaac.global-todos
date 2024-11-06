
import { useState } from 'react';
import { useTaskStore } from '../store/taskStore';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export const AIAssistant = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const { createTask, createEpic } = useTaskStore();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        // Add user message
        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');

        // For now, just echo back a simple response
        const response = {
            role: 'assistant',
            content: `I received your message: "${input}". AI integration coming soon!`
        };
        setMessages(prev => [...prev, response]);
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