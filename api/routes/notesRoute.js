'use strict';

module.exports = function(app) {
  var notes = require('../controllers/notesController');

  app.route('/notes')
    .get(notes.listNotes)
    .post(notes.createNote)

  app.route('/notes/pinned')
      .get(notes.getPinned)

  app.route('/notes/id/:noteId')
    .get(notes.readNote)
    .put(notes.updateNote)
    .delete(notes.deleteNote)

  app.route('/notes/class/:class')
    .get(notes.getClass)
};
