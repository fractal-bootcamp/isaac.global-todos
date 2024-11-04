// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import { useTaskStore } from './store/taskStore.ts';

function App() {
  const { themes, activeTheme } = useTaskStore();
  const currentTheme = themes.find(theme => theme.id === activeTheme);

  return (
    <Router>
      <div style={{
        backgroundColor: currentTheme?.colors.background,
        color: currentTheme?.colors.text
      }}>
        <nav className="p-4 bg-gray-200">
          <Link to="/" className="mr-4">Home</Link>
          <Link to="/about">About</Link>
        </nav>
        <div className="p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;