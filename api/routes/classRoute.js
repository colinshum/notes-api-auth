'use strict';

module.exports = function(app) {
  var cls = require('../controllers/classController');

  app.route('/class')
    .get(cls.listClasses)
    .post(cls.addClass)

  app.route('/class/:classId/students')
    .get(cls.studentsInClass)
    //.put(cls.addStudentToClass)
}
