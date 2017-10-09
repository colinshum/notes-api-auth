'use strict';

var mongoose = require('mongoose');
var Class = mongoose.model('Class');
var User = mongoose.model('User');
var jwt = require('jsonwebtoken');
var config = require('../../config/db');
var secretKey = config.secretKey;

exports.addClass = function(req, res) {
  var newClass = new Class(req.body);
  newClass.save(function(err, cls) {
    if (err) return res.send(err);
    return res.json(cls);
  });
};

exports.listClasses = function(req, res) {
  Class.find({}, function(err, cls) {
    if (err) return res.send(err);
    return res.json(cls);
  });
};

exports.studentsInClass = function(req, res) {
  Class.findById(req.params.classId, function(err, cls) {
    if (err) return res.send(err);
    else if (!cls) return res.send({ success: false, message: 'Invalid class'});
    res.json(cls.students);
  });
};

/*
exports.addStudentToClass = function(req, res) {
  Class.findById(req.params.classId, function(err, cls) {
    if (err) {
      return res.send(err);
    } else if (!cls) {
      return res.send({
        success: false,
        message: 'Invalid class'
      });
    } else {
      User.find({username: req.params.username}, function(err, user) {
        var students = cls.students;
        if (user) {
          if (cls.students.includes(user.username)) {
            students.splice(students.indexOf(user.username), 1);
          } else {
              if (cls.students.length >= cls.maxStudents) {
                return res.send({
                  success: false,
                  message: 'Student limit reached'
                });
              } else {
                students.push(user.username);
              }
            });
          Class.update({_id: cls._id}, {$set: {students: students}}, function(err, cls) {
            if (err) return res.send(err);
            return res.json(cls);
          }
        } else {
          return res.send({
            success: false,
            message: 'Wrong user class:'
          });
        }
      });
    }
  });
};
*/
