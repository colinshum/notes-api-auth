'use strict';

module.exports = function(app) {
  var notes = require('../controllers/notesController');

  app.route('/api/notes')
    .get(notes.listNotes)
    .post(notes.createNote)

  app.route('/api/notes/:noteId')
    .get(notes.readNote)
    .put(notes.updateNote)
    .delete(notes.deleteNote)

  app.route('/api/pinned')
    .get(notes.getPinned)
};
