// src/pages/TaskManagement.tsx
import { CreateTaskForm } from '../components/CreateTaskForm';
import { ThemeSelector } from '../components/ThemeSelector';
import { useTaskStore } from '../store/taskStore';

function TaskManagement() {
    const { tasks, moveTask, deleteTask } = useTaskStore();

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Task Management</h2>
                <ThemeSelector />
            </div>

            {/* Create Task Section */}
            <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Create New Task</h3>
                <CreateTaskForm />
            </div>

            {/* All Tasks List */}
            <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">All Tasks</h3>
                <div className="space-y-3">
                    {tasks.map(task => (
                        <div
                            key={task.id}
                            className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 transition-all hover:shadow-md"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-medium text-gray-900 dark:text-gray-100">{task.title}</h3>
                                <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 dark:bg-slate-700 dark:text-gray-300">
                                    {task.status}
                                </span>
                            </div>
                            <div className="flex justify-between items-center mt-2">
                                <select
                                    value={task.status}
                                    onChange={(e) => moveTask(task.id, e.target.value as any)}
                                    className="text-sm rounded-md border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="in-progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                    <option value="archived">Archived</option>
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

                    {tasks.length === 0 && (
                        <div className="text-center py-12 bg-gray-50 dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700">
                            <p className="text-gray-500 dark:text-gray-400">No tasks created yet</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default TaskManagement;