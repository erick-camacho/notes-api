const express = require('express');
const cors = require('cors');

const logger = require('./middleware/logger');

const app = express();

// middleware
app.use(cors());
app.use(express.json());

app.use(logger);

let notes = [
  {
    'id': 1,
    'name': 'erick'
  },
  {
    'id': 2,
    'name': 'javier'
  }
];

app.get('/', (request, response) => {
  response.send('<h1>Hello World</h1>');
});

app.get('/api/notes', (request, response) => {
  response.json(notes);
});

app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id);
  const note = notes.find(note => note.id === id);
  if (note) {
    response.status(200).json(note);
  } else {
    response.status(404).end();
  }
});

app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id);
  const note = notes.filter(note => note.id !== id);
  response.status(204).json(note);
});

app.post('/api/notes', (request, response) => {
  const note = request.body;

  const ids = notes.map(note => note.id);
  const maxId = Math.max(...ids);

  const newNote = {
    id: maxId + 1,
    content: note.content,
    important: typeof note.important !== 'undefined' ? note.important : false,
    date: new Date().toISOString()
  };

  notes = [...notes, newNote];

  response.status(201).json(newNote);
});

app.use((request, response) => {
  response.status(404).json({
    error: 'Not found'
  });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/`);
});
