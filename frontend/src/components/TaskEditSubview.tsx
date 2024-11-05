// src/components/TaskEditSubview.tsx
import React from 'react';
import { useTaskStore } from '../store/taskStore';
import { TASK_STATUSES } from '../types/task';

interface TaskEditSubviewProps {
    taskId: string;
    onClose: () => void;
}

export const TaskEditSubview = ({ taskId, onClose }: TaskEditSubviewProps) => {
    const {
        tasks,
        epics,
        updateTask,
        assignTaskToEpic,
        removeTaskFromEpic
    } = useTaskStore();

    const task = tasks.find(t => t.id === taskId);

    if (!task) return null;

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        // Update task details
        updateTask(taskId, {
            title: formData.get('title') as string,
            description: formData.get('description') as string,
            status: formData.get('status') as any, // TaskStatus type will be enforced by select options
        });

        // Handle epic assignment
        const newEpicId = formData.get('epicId') as string;
        if (newEpicId) {
            assignTaskToEpic(taskId, newEpicId);
        } else {
            removeTaskFromEpic(taskId);
        }

        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">
                        Edit Task
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500"
                    >
                        <span className="sr-only">Close</span>
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                            Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            defaultValue={task.title}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            defaultValue={task.description}
                            rows={3}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                            Status
                        </label>
                        <select
                            id="status"
                            name="status"
                            defaultValue={task.status}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                            {TASK_STATUSES.map(({ value, label }) => (
                                <option key={value} value={value}>
                                    {label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="epicId" className="block text-sm font-medium text-gray-700">
                            Epic
                        </label>
                        <select
                            id="epicId"
                            name="epicId"
                            defaultValue={task.epicId || ''}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                            <option value="">No Epic</option>
                            {epics.map(epic => (
                                <option key={epic.id} value={epic.id}>
                                    {epic.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-end space-x-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};