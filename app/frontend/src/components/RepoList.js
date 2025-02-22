import React, { useState, useEffect } from 'react';
import axios from 'axios';

function RepoList() {
  const [repos, setRepos] = useState([]);
  const [source, setSource] = useState('github');

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const response = await axios.get(`/api/repos?source=${source}`);
        setRepos(response.data);
      } catch (error) {
        console.error('Error fetching repositories:', error);
      }
    };

    fetchRepos();
  }, [source]);

  return (
    <div>
      <h2>Repositories</h2>
      <select onChange={(e) => setSource(e.target.value)}>
        <option value="github">GitHub</option>
        <option value="gitea">Gitea</option>
      </select>
      <ul>
        {repos.map((repo) => (
          <li key={repo.id}>{repo.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default RepoList;
