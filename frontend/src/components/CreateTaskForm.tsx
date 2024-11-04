// src/components/CreateTaskForm.tsx
import React, { useState } from 'react';
import { useTaskStore } from '../store/taskStore.ts';

export const CreateTaskForm = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const { createTask } = useTaskStore();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createTask(title, description);
        setTitle('');
        setDescription('');
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-2">
            <div>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Task title"
                    required
                />
            </div>
            <div>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Task description"
                    required
                />
            </div>
            <button type="submit">Create Task</button>
        </form>
    );
};
