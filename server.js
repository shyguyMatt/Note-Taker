const express = require('express');
const path = require('path');
const fs = require('fs')


// importing helper functions
const { readFromFile, readAndAppend } = require('./helpers/fsUtils');

// port for heroku and localhost
const PORT = process.env.PORT || 3001;

const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.use(express.static('public'));

// route for homepage
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

// route for notes page
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
)

// catch all route redirects to homepage
app.get('*', (req, res) => 
    res.sendFile(path.join(__dirname, 'public/index.html'))
)

// api returns db.json
app.get('/api/notes', (req, res) => {
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)))
});

// api writes to db.json
app.post('/api/notes', (req, res) => {
    const { title, text } = req.body;

    if (req.body) {
        const newNote = {
            title,
            text
        };

        readAndAppend(newNote, './db/db.json');
        res.json('successfuly saved')
    } else {
        res.error('Error adding new note')
    }
})

// listening port
app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT}`)
);