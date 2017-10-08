'use strict';

module.exports = function(app) {
  var notes = require('../controllers/notesController');

  app.route('/notes')
    .get(notes.listNotes)
    .post(notes.createNote);

  app.route('/notes/:noteId')
    .get(notes.readNote)
    .put(notes.updateNote)
    .delete(notes.deleteNote)
};
