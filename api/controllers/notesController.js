'use strict';

var mongoose = require('mongoose');
//var Note = mongoose.model('Notes');
var Note = require('../models/notesModel');

// listNotes() returns a JSON object of all notes at
// GET /notes
// TODO: Implement notes only for classes a student is in.
//       Array in userSchema (i.e. ['CS246', 'MATH239'])
//       and only return those.

exports.listNotes = function(req, res) {
  Note.find({}, function(err, note) {
    if (err) return res.send(err);
    res.json(note);
  });
};

// getPinned() returns a JSON object of pinned notes
// regardless of classes at GET /notes/pinned

exports.getPinned = function(req, res) {
  Note.find({'pinned': true}, function(err, note) {
    if (err) return res.send(err);
    res.json(note);
  });
};

// createNote() creates a new note at POST /notes
// Requires: name: String,
//           content: String,
//           class: String,
//           pinned: Boolean (default: false)

exports.createNote = function(req, res) {
  var newNote = new Note(req.body);
  newNote.save(function(err, note) {
    if (err) return res.send(err);
    res.json(note);
  });
};

// readNote() retrieves a note at GET /notes/id/:noteId
exports.readNote = function(req, res) {
  Note.find({_id: req.params.noteId}, function(err, note) {
    if (err) return res.send(err);
    res.json(note);
  });
};

// updateNote() updates a given Note at PUT /notes/id/:noteId
// It does not require the entire object to be redefined.
// Requires: at least one existing field to have a new value

exports.updateNote = function(req, res) {
  Note.findOneAndUpdate({_id: req.params.noteId}, req.body, {new: true}, function(err, note) {
    if (err) return res.send(err);
    res.json(note);
  });
};

// deleteNote() removes a given Note at DELETE /notes/id/:noteId
// TODO: Implement user perms, and Note owners

exports.deleteNote = function(req, res) {
  Note.remove({_id: req.params.noteId}, function(err, note) {
    if (err) return res.send({status: 'Note does not exist.'});
    res.json({status: 'deleted note'});
  });
};

// getClass() returns a JSON object for a given Class name
// at GET /notes/class/:className. Pinned posts will automatically
// be sorted chronologically to the top of the returned object,
// regardless of when it was posted compared to non-pinned posts.

exports.getClass = function(req, res) {
  Note.find({'class': req.params.class}, function(err, notes) {
    if (err) return res.send({status: 'error'});
    res.json(notes);
  }).sort({'pinned': -1})
}
