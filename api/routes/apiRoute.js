module.exports = function(apiRoutes) {
  //apiRoutes = express.Router();

  var jwt = require('jsonwebtoken');
  var User = ('../models/userModel');

  //apiRoutes

  var app = apiRoutes;

  apiRoutes.use(function(req, res, next) {

    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (token) {
      jwt.verify(token, app.get('secretKey'), function(err, decoded) {
        if (err) {
          return res.json({ success: false, message: 'Failed to authenticate token.' });
        } else {
          req.decoded = decoded;
          next();
        }
      });

    } else {
      return res.status(403).send({
          success: false,
          message: 'No token provided.'
      });

    }
  });

  apiRoutes.get('/users', function(req, res) {
    User.find({}, function(err, user) {
      res.json(user);
    });
  });
  var routes = require('../routes/notesRoute');
  routes(app);
};
