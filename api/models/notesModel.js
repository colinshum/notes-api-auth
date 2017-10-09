'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var NoteSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  class: {
    type: String,
  },
  pinned: {
    type: Boolean,
    default: false
  },
  created: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Notes', NoteSchema)
