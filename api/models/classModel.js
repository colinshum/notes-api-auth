'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var classSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  instructor: {
    type: String,
    default: 'admin'
  },
  students: {
    type: Array,
    default: []
  },
  maxStudents: {
    type: Number,
    default: 30
  },
  created: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Class', classSchema)
