// src/pages/TaskView.tsx
import { PageLayout } from '../components/layout/PageLayout';
import { StatusTabs } from '../components/StatusTabs';

function TaskView() {
  return (
    <PageLayout title="Task Overview">
      <div className="mt-8">
        <StatusTabs />
      </div>
    </PageLayout>
  );
}

export default TaskView;