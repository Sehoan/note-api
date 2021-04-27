const express = require('express');
const logger = require('./middleware/logger');
const app = express();

app.use(express.json());
app.use(logger);

let notes = [
    {
        id: 1,
        content: "HTML is easy",
        date: "2019-05-30T17:30:31.098Z",
        important: true
    },
    {
        id: 2,
        content: "Browser can execute only Javascript",
        date: "2019-05-30T18:39:34.091Z",
        important: false
    },
    {
        id: 3,
        content: "GET and POST are the most important methods of HTTP protocol",
        date: "2019-05-30T19:20:14.298Z",
        important: true
    }
];

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>');
});

app.get('/api/notes', (request, response) => {
    response.json(notes);
});

app.get('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id);
    const note = notes.find(note => note.id === id);

    if (note) {
        response.json(note);
    } else {
        response.status(404).end();
    }
});

app.delete('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id);
    notes = notes.filter(note => note.id !== id);
    response.status(204);
});

const generateId = () => {
    const maxId = notes.length > 0
        ? Math.max(...notes.map(note => note.id))
        : 0;
    return maxId + 1;
}

app.post('/api/notes', (request, response) => {
    const body = request.body;

    if (!body.content) {
        // calling return to stop executing the code after this if statement
        return response.status(400).json({
            error: 'content missing'
        });
    }

    const note = {
        id: generateId(),
        content: body.content,
        date: new Date(),
        /*
         *setting default value for important when the request.body doesn't
         *have important (undefined)
         */
        important: body.important || false,
    };

    notes = notes.concat(note);
    response.json(body);
})

/*
 * if the HTTP request from the client/browser is not handled by any routes 
 * defined above, this middleware will be used
 */

const unknownEndpoint = (request, response) => {
    response.status(404).send({
        error: 'unknown endpoint'
    })
};
app.use(unknownEndpoint);

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
