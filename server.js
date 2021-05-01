// Dependencies
const http = require('http');
const fs = require('fs');
const express = require('express');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
var PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'))

// displays the index.html at the root level
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/public/index.html')));

// displays the notes.html at the /notes/ level
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, '/public/notes.html')));

// sets the routing to get to the saved notes in db.json
app.get('/api/notes', (req, res) => {
    let allNotes = fs.readFileSync(path.join(__dirname, './db/db.json'), 'utf-8');
    allNotes = JSON.parse(allNotes);
    res.json(allNotes);
})

// sets the routing to post a new note using what is in req.body
app.post('/api/notes', (req, res) => {
    let allNotes = fs.readFileSync(path.join(__dirname, './db/db.json'), 'utf-8');
    allNotes = JSON.parse(allNotes);
    req.body.id = uuidv4(); 
    let userInput = req.body;
    allNotes.push(userInput);
    fs.writeFileSync(path.join(__dirname, './db/db.json'), JSON.stringify(allNotes), 'utf-8');
    allNotes = JSON.parse(allNotes);
    res.json(allNotes);
})

// sets the routing to delete a note from db.json
app.delete('/api/notes/:id', (req, res) => {
    let allNotes = fs.readFileSync(path.join(__dirname, './db/db.json'), 'utf-8');
    allNotes = JSON.parse(allNotes);
    allNotes = allNotes.filter(note => {
        return note.id != req.params.id;
    })
    fs.writeFileSync(path.join(__dirname, './db/db.json'), JSON.stringify(allNotes), 'utf-8');
    allNotes = JSON.parse(allNotes);
    res.json(allNotes);
})

app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));

