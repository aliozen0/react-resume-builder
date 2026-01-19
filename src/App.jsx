import React, { useState } from 'react';
import './App.css';
import ResumePreview from './components/ResumePreview';
import EditorPanel from './components/EditorPanel';
import { initialResumeState } from './initialState';

function App() {
  const [resumeData, setResumeData] = useState(initialResumeState);

  const handleDownload = () => {
    window.print();
  };

  return (
    <div className="app-container">
      {/* Editor Panel - Hidden when printing */}
      <div className="editor-pane">
        <EditorPanel data={resumeData} setData={setResumeData} />
      </div>

      {/* Main Content Area */}
      <div className="main-pane">
        <button className="download-btn" onClick={handleDownload}>
          <i className="fas fa-download"></i> CV'yi PDF Olarak İndir
        </button>

        <ResumePreview data={resumeData} />
      </div>
    </div>
  );
}

export default App;
