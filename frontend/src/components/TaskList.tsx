// src/components/TaskList.tsx
import { useTaskStore } from '../store/taskStore.ts';

export const TaskList = ({ status }: { status: string }) => {
    const { tasks, moveTask, deleteTask } = useTaskStore();
    const filteredTasks = tasks.filter(task => task.status === status);

    return (
        <div className="space-y-2">
            {filteredTasks.map(task => (
                <div key={task.id} className="p-2 border rounded">
                    <h3>{task.title}</h3>
                    <p>{task.description}</p>
                    <select
                        value={task.status}
                        onChange={(e) => moveTask(task.id, e.target.value as any)}
                    >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="archived">Archived</option>
                    </select>
                    <button onClick={() => deleteTask(task.id)}>Delete</button>
                </div>
            ))}
        </div>
    );
};
