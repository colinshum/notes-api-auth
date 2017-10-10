'use strict';

var mongoose = require('mongoose');
var Class = mongoose.model('Class');
var User = mongoose.model('User');
var jwt = require('jsonwebtoken');
var config = require('../../config/db');
var secretKey = config.secretKey;
var writeAccess = ['admin', 'instructor'];

exports.addClass = function(req, res) {
  var newClass = new Class(req.body);
  newClass.save(function(err, cls) {
    if (err) {
      return res.send(err);
    }
    return res.json(cls);
  });
};

exports.deleteClass = function(req, res) {
  var decoded = req.decoded;
  if (writeAccess.indexOf(decoded.user_class) != -1) {
    Class.find({_id: req.params.classId}, function(err, cls) {
      if (err) {
        return res.send(err);
      } else if (!cls) {
        return res.send({success: false, message: 'Class does not exist.'});
      } else {
        Class.remove({_id: req.params.classId}, function(err, cls) {
          if (err) {
            return res.send(err);
          } else {
            return res.json({success: true, message: 'Class ' + req.params.classId + ' deleted.' });
          }
        });
      }
    });
  } else {
    return res.send({success: false, message: 'You are not authorized to delete a class.'});
  }
}

exports.listClasses = function(req, res) {
  Class.find({}, function(err, cls) {
    if (err) {
      return res.send(err);
    }
    return res.json(cls);
  });
};

exports.studentsInClass = function(req, res) {
  Class.findById(req.params.classId, function(err, cls) {
    if (err) {
      return res.send(err);
    } else if (!cls) {
      return res.send({ success: false, message: 'Invalid class'});
    }
    res.json(cls.students);
  });
};

exports.addStudent = function(req, res) {
  Class.findById(req.params.classId, function(err, cls) {
    if (err) {
      res.send(err);
    } else if (!cls) {
      // If class isn't found
      res.send({success: false, message: 'Class not found'});
    } else {
      var students = cls.students;
      User.find({username: req.body.username}, function(err, user) {
        if (err) {
          res.send(err);
        } else if (students.indexOf(req.body.username) > -1) {
          // If username already exists in cls.students
          res.send({success: false, message: 'User already exists in class.'});
        } else if ( students.length >= cls.maxStudents ) {
          // If array is already at capacity
          res.send({success: false, message: 'Max students reached.'});
        } else {
          students.push(req.body.username);
          Class.findOneAndUpdate({_id: req.params.classId}, {$set: {students: students}}, function(err, cls) {
            if (err) return res.send(err);
            return res.send({success: true, message: 'added ' + req.body.username + ' to class.'});
          });
        }
      });
    }
  });
};

exports.deleteStudent = function(req, res) {
  Class.findById(req.params.classId, function(err, cls) {
    if (err) {
      res.send(err);
    } else if (!cls) {
      // If class isn't found
      res.send({success: false, message: 'Class not found'});
    } else {
      var students = cls.students;
      User.find({username: req.body.username}, function(err, user) {
        if (err) {
          res.send(err);
        } else if (students.indexOf(req.body.username) === -1) {
          // If username already exists in cls.students
          res.send({success: false, message: 'User does not exist in class.'});
        } else if ( students.length <= 0 ) {
          // If array is already at capacity
          res.send({success: false, message: 'Invalid length.'});
        } else {
          students.splice(students.indexOf(req.body.username), 1);
          Class.findOneAndUpdate({_id: req.params.classId}, {$set: {students: students}}, function(err, cls) {
            if (err) return res.send(err);
            return res.send({success: true, message: 'removed ' + req.body.username + ' from class.'});
          });
        }
      });
    }
  });
};
