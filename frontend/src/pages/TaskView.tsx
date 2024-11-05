// src/pages/TaskView.tsx
import { PageLayout } from '../components/layout/PageLayout';
import { TaskStatusView } from '../components/TaskStatusView';

function TaskView() {
  return (
    <PageLayout title="Task Overview">
      <div className="mt-8">
        <TaskStatusView />
      </div>
    </PageLayout>
  );
}

export default TaskView;