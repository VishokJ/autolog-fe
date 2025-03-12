import React, { useState, useEffect } from 'react';
import ChangelogEntry from './ChangelogEntry';

function ChangelogList({ changelog }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analyzedPRs, setAnalyzedPRs] = useState([]);

  useEffect(() => {
    const fetchAnalyzedPRs = async () => {
      try {
        setLoading(true);
        
        // Extract the necessary data from the changelog prop
        const { owner, repo, prs, diffs } = changelog;
        
        // Prepare the data for the batch-analysis endpoint
        const batchRequestData = {
          owner,
          repo,
          prs: prs.map((pr, index) => ({
            title: pr.title,
            body: pr.body || '',
            diff: diffs && diffs[index] ? diffs[index] : ''
          }))
        };
        
        // Call the batch-analysis endpoint
        const response = await fetch('http://localhost:8000/ai/full-summary', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(batchRequestData),
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        setAnalyzedPRs(data);
        setLoading(false);
      } catch (err) {
        setError(`Failed to analyze PRs: ${err.message}`);
        setLoading(false);
      }
    };
    
    if (changelog && changelog.prs && changelog.prs.length > 0) {
      fetchAnalyzedPRs();
    } else {
      setLoading(false);
    }
  }, [changelog]);

  // Group analyzed PRs by their category
  const groupPRsByCategory = () => {
    const groups = {
      feature: [],
      bugfix: [],
      improvement: [],
      documentation: [],
      other: []
    };
    
    // Only include PRs that are marked as relevant
    analyzedPRs.forEach((pr, index) => {
      if (pr.relevant) {
        // Use the original PR data and combine with analysis results
        const originalPR = changelog.prs[index];
        const enrichedPR = {
          ...originalPR,
          analysis: pr
        };
        
        // Add to appropriate category group
        if (pr.category in groups) {
          groups[pr.category].push(enrichedPR);
        } else {
          groups.other.push(enrichedPR);
        }
      }
    });
    
    return groups;
  };
  
  // Render loading state
  if (loading) {
    return <div className="loading-state">Analyzing pull requests...</div>;
  }
  
  // Render error state
  if (error) {
    return <div className="error-state">{error}</div>;
  }
  
  // Render empty state if no PRs or none are relevant
  const relevantPRsCount = analyzedPRs.filter(pr => pr.relevant).length;
  if (relevantPRsCount === 0) {
    return <div className="empty-state">No relevant pull requests found for this changelog</div>;
  }
  
  // Group PRs by category
  const prGroups = groupPRsByCategory();
  
  // Map of category keys to their display names and icons
  const categoryConfig = {
    feature: { title: "✨ New Features", key: "feature" },
    bugfix: { title: "🐛 Bug Fixes", key: "bugfix" },
    improvement: { title: "🚀 Improvements", key: "improvement" },
    documentation: { title: "📚 Documentation", key: "documentation" },
    other: { title: "🔄 Other Changes", key: "other" }
  };
  
  return (
    <div className="changelog-list">
      {Object.values(categoryConfig).map(category => {
        const prs = prGroups[category.key];
        if (!prs || prs.length === 0) return null;
        
        return (
          <div className="changelog-section" key={category.key}>
            <h2 className="section-title">{category.title}</h2>
            <div className="entries-container">
              {prs.map(pr => (
                <ChangelogEntry 
                  key={pr.number}
                  number={pr.number}
                  title={pr.analysis.changelogTitle}
                  excerpt={pr.analysis.excerpt}
                  category={pr.analysis.category}
                  author={pr.user?.login}
                  url={pr.html_url}
                  createdAt={pr.created_at}
                  mergedAt={pr.merged_at}
                  labels={pr.labels}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ChangelogList;