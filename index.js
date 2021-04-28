require('dotenv').config();
const express = require('express');
const app = express();
const logger = require('./middleware/logger');
const Note = require('./models/note');

app.use(express.json());
//app.use(logger);

app.get('/', (request, response) => {
    Note
        .find({})
        .then(notes => {
            //response.json(notes);
            response.send(notes);
        })
});

app.get('/api/notes', (request, response, next) => {
    Note
        .find({})
        .then(notes => {
            //response.json(notes);
            response.send(notes);
        })
        .catch(error => next(error));
});

app.get('/api/notes/:id', (request, response, next) => {
    Note
        .findById(request.params.id)
        .then(note => {
            if (note) {
                response.json(note);
            } else {
                response.status(400).end();
            }
        })
        .catch(error => next(error));
});


app.delete('/api/notes/:id', (request, response, next) => {
    Note.
        findByIdAndRemove(request.params.id)
        .then(removedNote => {
            console.log('removed note: \n', removedNote);
            response.status(204).end();
        })
        .catch(error => next(error));
});

app.put('/api/notes/:id', (request, response, next) => {
    const body = request.body;
    const note = {
        content: body.content,
        important: body.important,
    }

    Note.
        findByIdAndUpdate(request.params.id, note, { new: true } )
        .then(updatedNote => {
            console.log('updated note: \n', updatedNote);
            response.json(updatedNote);
        })
        .catch(error => next(error));
})

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

const errorHandler = (error, request, response, next) => {
    console.error(error.message);

    if (error.name === 'CastError') {
        return response.status(400).send({
            error: 'malformatted id'
        });
    }

    next(error)
} 

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
