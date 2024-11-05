// src/components/epic/EpicList.tsx
import { Link } from 'react-router-dom';
import { useTaskStore } from '../../store/taskStore';

export const EpicList = () => {
    const { epics, getTasksByEpicId } = useTaskStore();

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Epics</h2>
                <Link
                    to="/epics/new"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Create Epic
                </Link>
            </div>

            <div className="space-y-4">
                {epics.map(epic => {
                    const epicTasks = getTasksByEpicId(epic.id);
                    return (
                        <Link
                            key={epic.id}
                            to={`/epics/${epic.id}`}
                            className="block p-4 border rounded hover:border-blue-500"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-medium">{epic.title}</h3>
                                    <p className="text-gray-600 text-sm mt-1">{epic.description}</p>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <span className="text-sm text-gray-500">
                                        {epicTasks.length} tasks
                                    </span>
                                    <span className={`px-2 py-1 text-sm rounded ${epic.status === 'completed'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-blue-100 text-blue-800'
                                        }`}>
                                        {epic.status}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    );
                })}

                {epics.length === 0 && (
                    <div className="text-center py-8 border rounded bg-gray-50">
                        <p className="text-gray-500">No epics created yet</p>
                    </div>
                )}
            </div>
        </div>
    );
};