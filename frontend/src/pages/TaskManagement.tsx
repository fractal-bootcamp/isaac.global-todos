// src/pages/TaskManagement.tsx
import { useState } from 'react';
import { CreateTaskForm } from '../components/CreateTaskForm';
import { useTaskStore } from '../store/taskStore';
import { TaskStatus, TASK_STATUSES } from '../types/task';
import { TaskEditSubview } from '../components/TaskEditSubview';

function TaskManagement() {
    const {
        tasks,
        epics,
        moveTask,
        deleteTask,
        assignTaskToEpic,
        removeTaskFromEpic,
        getEpicById
    } = useTaskStore();

    // Filter states
    const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
    const [epicFilter, setEpicFilter] = useState<string>('all');

    // Add edit state
    const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

    // Apply filters
    const filteredTasks = tasks.filter(task => {
        const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
        const matchesEpic = epicFilter === 'all' ||
            (epicFilter === 'none' && !task.epicId) ||
            task.epicId === epicFilter;
        return matchesStatus && matchesEpic;
    });

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Task Management</h2>

            {/* Filters */}
            <div className="mb-6 flex space-x-4 items-center">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status Filter
                    </label>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as TaskStatus | 'all')}
                        className="block w-40 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                        <option value="all">All Statuses</option>
                        {TASK_STATUSES.map(({ value, label }) => (
                            <option key={value} value={value}>
                                {label}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Epic Filter
                    </label>
                    <select
                        value={epicFilter}
                        onChange={(e) => setEpicFilter(e.target.value)}
                        className="block w-40 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                        <option value="all">All Epics</option>
                        <option value="none">No Epic</option>
                        {epics.map(epic => (
                            <option key={epic.id} value={epic.id}>
                                {epic.title}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Create Task Section */}
            <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Create New Task</h3>
                <CreateTaskForm />
            </div>

            {/* Tasks List */}
            <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                    All Tasks ({filteredTasks.length})
                </h3>
                <div className="space-y-3">
                    {filteredTasks.map(task => {
                        const taskEpic = task.epicId ? getEpicById(task.epicId) : null;

                        return (
                            <div
                                key={task.id}
                                onClick={() => setEditingTaskId(task.id)}
                                className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 transition-all hover:shadow-md cursor-pointer"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h4 className="font-medium text-gray-900">{task.title}</h4>
                                        <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        {taskEpic && (
                                            <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">
                                                {taskEpic.title}
                                            </span>
                                        )}
                                        <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                                            {task.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center mt-3">
                                    <div className="flex items-center space-x-3">
                                        {/* Status Selection */}
                                        <select
                                            value={task.status}
                                            onChange={(e) => moveTask(task.id, e.target.value as TaskStatus)}
                                            className="text-sm rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            {TASK_STATUSES.map(({ value, label }) => (
                                                <option key={value} value={value}>
                                                    {label}
                                                </option>
                                            ))}
                                        </select>

                                        {/* Epic Assignment */}
                                        <select
                                            value={task.epicId || ''}
                                            onChange={(e) => {
                                                const epicId = e.target.value;
                                                if (epicId) {
                                                    assignTaskToEpic(task.id, epicId);
                                                } else {
                                                    removeTaskFromEpic(task.id);
                                                }
                                            }}
                                            className="text-sm rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="">No Epic</option>
                                            {epics.map(epic => (
                                                <option key={epic.id} value={epic.id}>
                                                    {epic.title}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <button
                                        onClick={() => deleteTask(task.id)}
                                        className="text-sm px-3 py-1 text-red-600 hover:text-red-800 transition-colors"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        );
                    })}

                    {/* Add TaskEditSubview */}
                    {editingTaskId && (
                        <TaskEditSubview
                            taskId={editingTaskId}
                            onClose={() => setEditingTaskId(null)}
                        />
                    )}

                    {filteredTasks.length === 0 && (
                        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                            <p className="text-gray-500">No tasks found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default TaskManagement;