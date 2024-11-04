// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useTaskStore } from './store/taskStore';
import TaskView from './pages/TaskView';
import TaskManagement from './pages/TaskManagement';
import About from './pages/About';

function App() {
  const { themes, activeTheme } = useTaskStore();
  const currentTheme = themes.find(theme => theme.id === activeTheme);

  return (
    <Router>
      <div style={{
        backgroundColor: currentTheme?.colors.background,
        color: currentTheme?.colors.text,
        minHeight: '100vh'
      }}>
        <nav className="bg-white dark:bg-slate-800 shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex space-x-6">
              <Link
                to="/"
                className="text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
              >
                Task Overview
              </Link>
              <Link
                to="/manage"
                className="text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
              >
                Manage Tasks
              </Link>
              <Link
                to="/about"
                className="text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
              >
                About
              </Link>
            </div>
          </div>
        </nav>
        <main className="p-4 sm:p-6 md:p-8">
          <Routes>
            <Route path="/" element={<TaskView />} />
            <Route path="/manage" element={<TaskManagement />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;