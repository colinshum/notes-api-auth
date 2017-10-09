module.exports = function(apiRoutes) {

  var jwt = require('jsonwebtoken');
  var User = require('../models/userModel');
  var app = apiRoutes;
  var config = require('../../config/db');
  var Class = require('../models/classModel');
  //var secretKey = config.secretKey;

  apiRoutes.use(function(req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (token) {
      jwt.verify(token, app.get('secretKey'), function(err, decoded) {
        if (err) {
          return res.json({ success: false,
            status: 'Failed to authenticate token.' });
        } else {
          req.decoded = decoded;
          next();
        }
      });

    } else {
      return res.status(403).send({
          success: false,
          status: 'No token provided.'
      });

    }
  });

  apiRoutes.get('/admin/users', function(req, res) {
    var decoded = req.decoded;
    if (decoded.user_class === 'admin') {
      User.find({}, function(err, user) {
        res.json(user);
      });
    } else {
      res.send({success: false, message: 'Wrong user class: ' + decoded.user_class});
    }
  });

  var notes = require('../routes/notesRoute');
  notes(app);
  var cls = require('../routes/classRoute');
  cls(app);
};
