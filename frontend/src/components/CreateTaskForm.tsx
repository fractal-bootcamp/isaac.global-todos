// src/components/CreateTaskForm.tsx
import React, { useState } from 'react';
import { useTaskStore } from '../store/taskStore';
import { useApiTaskStore } from '../store/apiTaskStore';

export const CreateTaskForm = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    // Get both create functions (API version is primary, local store as backup)
    const createTaskApi = useApiTaskStore(state => state.createTask);
    const createTaskLocal = useTaskStore(state => state.createTask);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Try API version first
            const taskId = await createTaskApi(title, description);
            console.log('Task created with API:', taskId);
        } catch (error) {
            // Fallback to local store if API fails
            console.warn('API create failed, using local store:', error);
            createTaskLocal(title, description);
        }

        // Clear form regardless of which store was used
        setTitle('');
        setDescription('');
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700">
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Task Title
                </label>
                <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter task title"
                    className="w-full rounded-md border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                />
            </div>
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                </label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter task description"
                    rows={3}
                    className="w-full rounded-md border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                />
            </div>
            <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
                Create Task
            </button>
        </form>
    );
};
