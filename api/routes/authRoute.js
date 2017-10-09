module.exports = function(app) {
  var jwt = require('jsonwebtoken');
  var User = ('../models/userModel');
  app.post('/authenticate', function(req, res) {
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
}
