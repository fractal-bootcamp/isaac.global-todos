// src/pages/Home.tsx (renamed to TaskView.tsx)
import { StatusTabs } from '../components/StatusTabs';
import { ThemeSelector } from '../components/ThemeSelector';

function TaskView() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Task Overview</h2>
        <ThemeSelector />
      </div>

      <div className="mt-8">
        <StatusTabs />
      </div>
    </div>
  );
}

export default TaskView;