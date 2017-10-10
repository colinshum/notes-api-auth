'use strict';

var mongoose = require('mongoose');
var Class = mongoose.model('Class');
var User = mongoose.model('User');
var jwt = require('jsonwebtoken');
var config = require('../../config/db');
var secretKey = config.secretKey;
var writeAccess = ['admin', 'instructor'];

// addClass() inserts a Class into the database @ POST /class
// Requires user_class to be in writeAccess
exports.addClass = function(req, res) {
  var decoded = req.decoded;
  if (writeAccess.indexOf(decoded.user_class) != -1) {
    var newClass = new Class(req.body);
    newClass.save(function(err, cls) {
      if (err) {
        return res.send(err);
      }
      return res.json(cls);
    });
  } else {
    return res.send({success: false,
      message: 'You are not authorized to add a class.'});
  }
};

// addClass() deletes a Class from the database @ DELETE /class
// Requires user_class to be in writeAccess
exports.deleteClass = function(req, res) {
  var decoded = req.decoded;
  if (writeAccess.indexOf(decoded.user_class) != -1) {
    Class.find({_id: req.params.classId}, function(err, cls) {
      if (err) {
        return res.send(err);
      } else if (!cls) {
        return res.send({success: false,
          message: 'Class does not exist.'});
      } else {
        Class.remove({_id: req.params.classId}, function(err, cls) {
          if (err) {
            return res.send(err);
          } else {
            return res.json({success: true,
              message: 'Class ' + req.params.classId + ' deleted.' });
          }
        });
      }
    });
  } else {
    return res.send({success: false,
      message: 'You are not authorized to delete a class.'});
  }
}

// listClasses() lists all classes @ GET /class
exports.listClasses = function(req, res) {
  Class.find({}, function(err, cls) {
    if (err) {
      return res.send(err);
    }
    return res.json(cls);
  });
};

// studentsInClass() lists all students in a class @ GET /class/:classId/students
exports.studentsInClass = function(req, res) {
  Class.findById(req.params.classId, function(err, cls) {
    if (err) {
      return res.send(err);
    } else if (!cls) {
      return res.send({ success: false,
        message: 'Invalid class'});
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
      res.send({success: false,
        message: 'Class not found'});
    } else {
      var students = cls.students;
      User.find({username: req.body.username}, function(err, user) {
        if (err) {
          res.send(err);
        } else if (students.indexOf(req.body.username) > -1) {
          // If username already exists in cls.students
          res.send({success: false,
            message: 'User already exists in class.'});
        } else if ( students.length >= cls.maxStudents ) {
          // If array is already at capacity
          res.send({success: false,
            message: 'Max students reached.'});
        } else {
          var userClasses = [];

          User.find({username: req.body.username}, function(err, user) {
            if (err) throw err;
            userClasses = user.classes;
          });

          userClasses.push(cls.name);

          User.findOneAndUpdate({username: req.body.username},
            {$set: {classes: userClasses}}, function(err, user) {
              if (err) return res.send(err);
          });

          students.push(req.body.username);

          Class.findOneAndUpdate({_id: req.params.classId},
            {$set: {students: students}}, function(err, cls) {
              if (err) return res.send(err);
              return res.send({success: true,
                message: 'added ' + req.body.username + ' to class.'
              });
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
          var userClasses = [];

          User.find({username: req.body.username}, function(err, user) {
            if (err) throw err;
            userClasses = user.classes;
          });

          // Remove class from user's class list
          userClasses.splice(userClasses.indexOf(req.body.username), 1);
          User.findOneAndUpdate({username: req.body.username}, {$set: {classes: userClasses}}, function(err, user) {
            if (err) return res.send(err);
          });

          // Remove user from class' student list
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
