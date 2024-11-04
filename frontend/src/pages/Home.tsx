import { CreateTaskForm } from '../components/CreateTaskForm';
import { TaskList } from '../components/TaskList';
import { ThemeSelector } from '../components/ThemeSelector';

function Home() {
  return (
    <div>
      <h2 className="text-2xl font-bold">Task Management</h2>
      <div className="mb-4">
        <ThemeSelector />
      </div>
      <div className="mb-4">
        <h3>Create New Task</h3>
        <CreateTaskForm />
      </div>
      <div>
        <h3>Pending Tasks</h3>
        <TaskList status="pending" />

        <h3>In Progress Tasks</h3>
        <TaskList status="in-progress" />

        <h3>Completed Tasks</h3>
        <TaskList status="completed" />

        <h3>Archived Tasks</h3>
        <TaskList status="archived" />
      </div>
    </div>
  );
}

export default Home;