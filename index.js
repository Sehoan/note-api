require('dotenv').config();
const express = require('express');
const app = express();
const logger = require('./middleware/logger');
const Note = require('./models/note');

app.use(express.json());
//app.use(logger);

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
    Note
        .find({})
        .then(notes => {
            //response.json(notes);
            response.send(notes);
        })
});

app.get('/api/notes', (request, response) => {
    Note
        .find({})
        .then(notes => {
            //response.json(notes);
            response.send(notes);
        })
});

app.get('/api/notes/:id', (request, response) => {
    Note
        .findById(request.params.id)
        .then(note => {
            response.json(note);
        });
});

/*
 *app.delete('/api/notes/:id', (request, response) => {
 *    const id = Number(request.params.id);
 *    notes = notes.filter(note => note.id !== id);
 *    response.status(204);
 *});
 */

app.post('/api/notes', (request, response) => {
    const body = request.body;

    if (!body.content) {
        // calling return to stop executing the code after this if statement
        return response.status(400).json({
            error: 'content missing'
        });
    }

    const note = new Note({
        content: body.content,
        date: new Date(),
        important: body.important || false,
    });

    note
        .save()
        .then(addedNote => {
            console.log(addedNote);
            response.json(body);
        });
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

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
