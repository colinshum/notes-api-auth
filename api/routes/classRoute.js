'use strict';

module.exports = function(app) {
  var cls = require('../controllers/classController');

  app.route('/class')
    .get(cls.listClasses)
    .post(cls.addClass)

  app.route('/class/:classId')
    .delete(cls.deleteClass)

  app.route('/class/:classId/students')
    .get(cls.studentsInClass)

  app.route('/class/:classId/students/add')
    .post(cls.addStudent)

  app.route('/class/:classId/students/delete')
    .post(cls.deleteStudent)
}
