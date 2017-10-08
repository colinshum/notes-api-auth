'use strict';

var mongoose = require('mongoose');
var Note = mongoose.model('Notes');

exports.listNotes = function(req, res) {
  Note.find({}, function(err, note) {
    if (err) return res.send(err);
    res.json(note);
  });
};

exports.createNote = function(req, res) {
  var newNote = new Note(req.body);
  newNote.save(function(err, note) {
    if (err) return res.send(err);
    res.json(note);
  });
};

exports.readNote = function(req, res) {
  Note.findbyId(req.params.noteId, function(err, note) {
    if (err) return res.send(err);
    res.json(note);
  });
};

exports.updateNote = function(req, res) {
  Note.findOneAndUpdate({_id: req.params.noteId}, req.body, {new: true}, function(err, note) {
    if (err) return res.send(err);
    res.json(note);
  });
};

exports.deleteNote = function(req, res) {
  Note.remove({_id: req.params.noteId}, function(err, note) {
    if (err) return res.send({status: 'Note does not exist.'});
    res.json({status: 'deleted note'});
  });
};