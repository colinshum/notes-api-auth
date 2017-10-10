// Require modules and config files
var jwt = require('jsonwebtoken');
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var db = require('./config/db');
var User = require('./api/models/userModel');
var Note = require('./api/models/notesModel');
var Cls = require('./api/models/classModel');


// Instantiate Express and router
var app = express();
var apiRoutes = express.Router();

// Middleware

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.set('secretKey', db.secretKey);

// Connect to MongoDB
mongoose.connect(db.uri, { useMongoClient: true });

// Define unprotected user routes
app.post('/register', function(req, res) {
  var newUser = new User(req.body);

  newUser.save(function(err, user) {
    if (err) throw err;
    return res.json(user);
  });
});

app.post('/login', function(req, res) {
  User.findOne({username: req.body.username.toLowerCase()}, function(err, user) {
    if (err) throw err;

    if (!user) {
      // If user doesn't exist in DB
      res.json({ success: false, message: 'Authentication failed. Invalid details.' });
    } else if (user) {
      // If user is found, compare password hash defined in userModel
      user.comparePassword(req.body.password, function(err, match) {
        if (err) throw err;
        //console.log('ismatch: ' + isMatch);
        if (!match) {
          // Wrong password
          return res.json({ success: false, message: 'Authentication failed. Invalid details.' });
        } else {
          // Use JWT to sign and return authentication token
          const payload = {username: user.username, email: user.email, user_class: user.user_class};
          var token = jwt.sign(payload, app.get('secretKey'), {expiresIn: '1440m'});

          return res.json({
            success: true,
            message: 'Authenticated',
            token: token
          });
        }
      });
    }
  });
});

// Authenticated routes
var apiRoute = require('./api/routes/apiRoute');
apiRoute(app);

// Start Node on port 3000
app.listen(3000, function() {
  console.log('App is running on port 3000...');
});
