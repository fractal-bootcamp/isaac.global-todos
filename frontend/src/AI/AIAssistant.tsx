import { useState } from 'react';
import { useTaskStore } from '../store/taskStore';
import { Message, TaskStore } from './schemas';
import { createAIMessage, handleAIResponse } from './service';

export const AIAssistant = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const taskStore = useTaskStore() as TaskStore;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        setMessages(prev => [...prev, { role: 'user', content: input }]);
        setInput('');
        setError(null);
        setIsLoading(true);

        try {
            const aiResponse = await createAIMessage(input);
            const resultMessage = await handleAIResponse(aiResponse, taskStore);
            setMessages(prev => [...prev, { role: 'assistant', content: resultMessage }]);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
            console.error('Error:', error);
            setError(errorMessage);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'Sorry, there was an error processing your request.'
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-4 right-4 bg-blue-500 text-white p-3 rounded-full shadow-lg z-50"
            >
                {isOpen ? '✨ Close Chat' : '✨ Open Chat'}
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-40">
                    <div className="bg-white max-w-2xl w-full mx-auto p-6 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold mb-6">AI Assistant</h2>

                        {error && (
                            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
                                {error}
                            </div>
                        )}

                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4 max-h-80 overflow-y-auto">
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
                                placeholder="Type your message..."
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Sending...' : 'Send'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};