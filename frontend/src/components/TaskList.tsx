// src/components/TaskList.tsx
import { useState } from 'react';
import { useTaskStore } from '../store/taskStore';
import { TaskEditSubview } from './TaskEditSubview';
import { TaskStatus, TASK_STATUSES, getStatusBadgeColor } from '../types/task';

interface TaskListProps {
    status: TaskStatus;
}

export const TaskList = ({ status }: TaskListProps) => {
    const { tasks, moveTask, deleteTask } = useTaskStore();
    const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
    const filteredTasks = tasks.filter(task => task.status === status);

    return (
        <div>
            <div className="mb-4 flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                    {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''}
                </span>
            </div>

            <div className="space-y-3">
                {filteredTasks.map(task => (
                    <div
                        key={task.id}
                        onClick={() => setEditingTaskId(task.id)}
                        className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 transition-all hover:shadow-md cursor-pointer"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-medium text-gray-900 dark:text-gray-100">
                                {task.title}
                            </h3>
                            <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeColor(task.status)}`}>
                                {task.status}
                            </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                            {task.description}
                        </p>
                        <div className="flex justify-between items-center" onClick={e => e.stopPropagation()}>
                            <select
                                value={task.status}
                                onChange={(e) => moveTask(task.id, e.target.value as TaskStatus)}
                                className="text-sm rounded-md border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                            >
                                {TASK_STATUSES.map(({ value, label }) => (
                                    <option key={value} value={value}>
                                        {label}
                                    </option>
                                ))}
                            </select>
                            <button
                                onClick={() => deleteTask(task.id)}
                                className="text-sm px-3 py-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}

                {filteredTasks.length === 0 && (
                    <div className="text-center py-12 bg-gray-50 dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700">
                        <p className="text-gray-500 dark:text-gray-400">
                            No tasks in this status
                        </p>
                    </div>
                )}
            </div>

            {editingTaskId && (
                <TaskEditSubview
                    taskId={editingTaskId}
                    onClose={() => setEditingTaskId(null)}
                />
            )}
        </div>
    );
};