const express = require('express');
const cors = require('cors');
const { v4: uuid, validate: isUuid, v4 } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get('/repositories', (request, response) => {
  response.status(200).json({
    data: repositories,
  });
});

app.post('/repositories', (request, response) => {
  const { title, url, techs } = request.body;
  if (!title || !url || !techs) {
    return response.status(400).json({
      message: 'Missing arguments',
    });
  }
  const newRepo = {
    id: v4(),
    title,
    url,
    techs: [...techs],
    likes: 0,
  };

  repositories.push(newRepo);
  return response.status(201).json({
    data: newRepo,
  });
});

app.put('/repositories/:id', (request, response) => {
  const repoIndex = repositories.findIndex(
    repo => repo.id === request.params.id
  );

  if (repoIndex < 0) {
    return response.status(404).json({
      message: 'Repository not found',
    });
  }
  const { title, url, techs } = request.body;

  repositories[repoIndex] = {
    id: repositories[repoIndex].id,
    title,
    url,
    techs,
    likes: repositories[repoIndex].likes,
  };

  return response.status(200).json({
    data: repositories[repoIndex],
  });
});

app.delete('/repositories/:id', (request, response) => {
  const repoIndex = repositories.findIndex(
    repo => repo.id === request.params.id
  );

  if (repoIndex < 0) {
    return response.status(404).json({
      message: 'Repository not found',
    });
  }
  repositories.splice(repoIndex, 1);

  return response.status(203).json({});
});

app.post('/repositories/:id/like', (request, response) => {
  const repoIndex = repositories.findIndex(
    repo => repo.id === request.params.id
  );

  if (repoIndex < 0) {
    return response.status(404).json({
      message: 'Repository not found',
    });
  }
  repositories[repoIndex].likes += 1;

  return response.status(200).json({
    data: repositories[repoIndex],
  });
});

module.exports = app;
