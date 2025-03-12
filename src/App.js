import React, { useEffect, useState } from 'react';
import ChangelogList from './components/ChangelogList';
import './App.css';

function App() {
  const [changelog, setChangelog] = useState({
    id: '',
    owner: '',
    repo: '',
    commits: [],
    prs: [],
    diffs: null
  });

  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const parseJson = (envVar) => {
      try {
        return JSON.parse(envVar);
      } catch (error) {
        console.error('Failed to parse env var:', error);
        return null;
      }
    };

    setLoading(true);
    console.log("Hello from the App component!", process.env);
    setChangelog({
      id: process.env.REACT_APP_CHANGELOG_ID || 'N/A',
      owner: process.env.REACT_APP_CHANGELOG_OWNER || 'N/A',
      repo: process.env.REACT_APP_CHANGELOG_REPO || 'N/A',
      commits: parseJson(process.env.REACT_APP_COMMITS) || [],
      prs: parseJson(process.env.REACT_APP_PRS) || [],
      diffs: parseJson(process.env.REACT_APP_DIFFS) || null
    });
    setLoading(false);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark-mode', !darkMode);
  };

  console.log("Here's the changelog", changelog);
  return (
    <div className={`app ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <div className="container">
        <div className="header">
          <h1>AutoLog Report: {changelog.owner}/{changelog.repo}</h1>
          <button onClick={toggleDarkMode} className="mode-toggle">
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
        
        <div className="content">
          {loading ? (
            <div className="loading-container">Loading changelog data...</div>
          ) : (
            <ChangelogList changelog={changelog} />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;