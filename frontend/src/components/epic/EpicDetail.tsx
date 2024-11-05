// src/components/epic/EpicDetail.tsx
import { useParams, useNavigate } from 'react-router-dom';
import { useTaskStore } from '../../store/taskStore';

export const EpicDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const {
        getEpicById,
        getTasksByEpicId,
        completeEpic,
        assignTaskToEpic,
        removeTaskFromEpic,
        tasks
    } = useTaskStore();

    const epic = getEpicById(id!);
    const epicTasks = getTasksByEpicId(id!);
    const availableTasks = tasks.filter(t => !t.epicId);

    if (!epic) {
        return <div>Epic not found</div>;
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6">
                <button
                    onClick={() => navigate('/epics')}
                    className="text-blue-500 hover:underline"
                >
                    ← Back to Epics
                </button>
            </div>

            <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-2xl font-bold">{epic.title}</h2>
                    <p className="text-gray-600 mt-1">{epic.description}</p>
                </div>
                <button
                    onClick={() => completeEpic(epic.id)}
                    className={`px-4 py-2 rounded ${epic.status === 'completed'
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-green-500 text-white hover:bg-green-600'
                        }`}
                    disabled={epic.status === 'completed'}
                >
                    {epic.status === 'completed' ? 'Completed' : 'Mark Complete'}
                </button>
            </div>

            <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">Add Task to Epic</h3>
                <select
                    onChange={(e) => assignTaskToEpic(e.target.value, epic.id)}
                    className="block w-full p-2 border rounded"
                    value=""
                >
                    <option value="">Select a task...</option>
                    {availableTasks.map(task => (
                        <option key={task.id} value={task.id}>
                            {task.title}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <h3 className="text-lg font-medium mb-3">Epic Tasks</h3>
                <div className="space-y-3">
                    {epicTasks.map(task => (
                        <div
                            key={task.id}
                            className="p-4 border rounded flex justify-between items-center"
                        >
                            <div>
                                <h4 className="font-medium">{task.title}</h4>
                                <p className="text-sm text-gray-600">{task.status}</p>
                            </div>
                            <button
                                onClick={() => removeTaskFromEpic(task.id)}
                                className="text-red-500 hover:text-red-600"
                            >
                                Remove
                            </button>
                        </div>
                    ))}

                    {epicTasks.length === 0 && (
                        <div className="text-center py-8 border rounded bg-gray-50">
                            <p className="text-gray-500">No tasks in this epic</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

