module.exports = function(app) {
  apiRoutes = express.Router();

  apiRoutes.post('/authenticate', function(req, res) {
    User.findOne({username: req.body.username}, function(err, user) {
      if (err) throw err;

      if (!user) {
        res.json({ success: false, message: 'Authentication failed. User not found.' });
      } else if (user) {
        if (user.password != req.body.password) {
          res.json({ success: false, message: 'Authentication failed. User not found.' });
        } else {
          const payload = {email: user.email};
          var token = jwt.sign(payload, app.get('secretKey'), {expiresIn: '1440m'});

          res.json({
            success: true,
            message: 'Authenticated',
            token: token
          });
        }
      }
    });
  });

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
};
