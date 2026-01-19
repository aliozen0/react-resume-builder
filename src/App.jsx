import React, { useState, useRef, useEffect } from 'react';
import ResumePreview from './components/ResumePreview';
import EditorPanel from './components/EditorPanel';
import { initialResumeState } from './initialState';
import './App.css';
import { Sun, Moon } from 'lucide-react';

function App() {
  const [resumeData, setResumeData] = useState(initialResumeState);

  // Layout State
  const [sidebarWidth, setSidebarWidth] = useState(550); // Wider editor by default
  const [zoomLevel, setZoomLevel] = useState(0.65); // Smaller preview by default
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef(null);

  // Theme State
  const [theme, setTheme] = useState('dark'); // 'dark' or 'light' for the UI

  const handleDownloadPDF = () => {
    window.print();
  };

  // --- Resizing Logic ---
  const startResizing = (e) => {
    setIsResizing(true);
  };

  const stopResizing = () => {
    setIsResizing(false);
  };

  const resize = (e) => {
    if (isResizing) {
      const newWidth = e.clientX;
      if (newWidth > 300 && newWidth < 800) {
        setSidebarWidth(newWidth);
      }
    }
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    window.addEventListener('mousemove', resize);
    window.addEventListener('mouseup', stopResizing);
    // Set data attribute for CSS
    document.documentElement.setAttribute('data-theme', theme);
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [isResizing, theme]);

  return (
    <div className={`app-container ${theme}-theme`}>
      {/* Resizable Sidebar */}
      <div
        className="editor-pane"
        style={{ width: `${sidebarWidth}px` }}
        ref={sidebarRef}
      >
        <EditorPanel
          data={resumeData}
          setData={setResumeData}
          theme={theme}
        />
      </div>

      {/* Resize Handle */}
      <div className="resizer" onMouseDown={startResizing}>
        <div className="resizer-line"></div>
      </div>

      {/* Main Content Area */}
      <div className="main-pane">
        {/* Controls Overlay */}
        <div className="workspace-controls">
          <button className="theme-toggle" onClick={toggleTheme} title="Toggle Theme">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <div className="divider-v"></div>
          <button onClick={() => setZoomLevel(z => Math.max(0.3, z - 0.1))}>-</button>
          <span className="zoom-label">{Math.round(zoomLevel * 100)}%</span>
          <button onClick={() => setZoomLevel(z => Math.min(1.5, z + 0.1))}>+</button>
        </div>

        <div className="preview-wrapper" style={{ transform: `scale(${zoomLevel})` }}>
          <ResumePreview data={resumeData} />
        </div>

        <button className="download-btn" onClick={handleDownloadPDF}>
          <i className="fas fa-download"></i> Download PDF
        </button>
      </div>
    </div>
  );
}

export default App;
