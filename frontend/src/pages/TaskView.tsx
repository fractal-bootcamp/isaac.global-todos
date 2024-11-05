// src/pages/TaskView.tsx
import { TaskStatusView } from '../components/TaskStatusView';

function TaskView() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Task Overview</h1>
      <div className="mt-8">
        <TaskStatusView />
      </div>
    </div>
  );
}

export default TaskView;