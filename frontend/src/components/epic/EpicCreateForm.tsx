// src/components/epic/EpicCreateForm.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTaskStore } from '../../store/taskStore';

export const EpicCreateForm = () => {
    const navigate = useNavigate();
    const { createEpic } = useTaskStore();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        createEpic(
            formData.get('title') as string,
            formData.get('description') as string
        );
        navigate('/epics');
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-6">
                <button
                    onClick={() => navigate('/epics')}
                    className="text-blue-500 hover:underline"
                >
                    ← Back to Epics
                </button>
            </div>

            <h2 className="text-2xl font-bold mb-6">Create New Epic</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium mb-1">
                        Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        className="block w-full border rounded p-2"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium mb-1">
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        rows={3}
                        className="block w-full border rounded p-2"
                        required
                    />
                </div>

                <div className="flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={() => navigate('/epics')}
                        className="px-4 py-2 border rounded"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Create Epic
                    </button>
                </div>
            </form>
        </div>
    );
};