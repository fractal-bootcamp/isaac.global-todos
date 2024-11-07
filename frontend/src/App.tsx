// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import TaskManagement from './pages/TaskManagement';
import About from './pages/About';
import { EpicList } from './components/epic/EpicList';
import { EpicDetail } from './components/epic/EpicDetail';
import { EpicCreateForm } from './components/epic/EpicCreateForm';
import { AIAssistant } from './AI/AIAssistant';

function App() {
  return (
    <Router>
      <div>
        <nav className="bg-white shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex space-x-6">
              <Link
                to="/"
                className="text-gray-700 hover:text-blue-500"
              >
                Tasks
              </Link>
              <Link
                to="/epics"
                className="text-gray-700 hover:text-blue-500"
              >
                Epics
              </Link>
              <Link
                to="/about"
                className="text-gray-700 hover:text-blue-500"
              >
                About
              </Link>
            </div>
          </div>
        </nav>
        <main className="p-4 sm:p-6 md:p-8">
          <Routes>
            <Route path="/" element={<TaskManagement />} />
            <Route path="/about" element={<About />} />
            <Route path="/epics" element={<EpicList />} />
            <Route path="/epics/new" element={<EpicCreateForm />} />
            <Route path="/epics/:id" element={<EpicDetail />} />
          </Routes>
        </main>
        <AIAssistant />
      </div>
    </Router>
  );
}

export default App;