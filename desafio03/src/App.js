import React, { useEffect, useState } from 'react';
import api from './services/api';

import './styles.css';

function App() {
  const [repos, setRepos] = useState([]);

  useEffect(() => {
    const getRepos = async () => {
      try {
        const response = await api.get('/repositories');
        setRepos(response.data.data);
      } catch (err) {
        console.log(err);
      }
    };
    getRepos();
  }, []);

  console.log(repos);

  async function handleAddRepository() {
    const newRepo = {
      title: `New Repo ${new Date().getTime()}`,
      url: 'www.google.com',
      techs: ['javascript', 'nodejs'],
    };

    try {
      const response = await api.post('/repositories', newRepo);
      setRepos(prevState => [...prevState, response.data.data]);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleRemoveRepository(id) {
    try {
      await api.delete(`/repositories/${id}`);
      setRepos(prevState => prevState.filter(repo => repo.id !== id));
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div>
      <ul data-testid="repository-list">
        {repos.length > 0 &&
          repos.map(repo => (
            <li key={repo.id}>
              {repo.title}
              <button onClick={() => handleRemoveRepository(repo.id)}>
                Remover
              </button>
            </li>
          ))}
      </ul>

      <button onClick={handleAddRepository}>Adicionar</button>
    </div>
  );
}

export default App;
