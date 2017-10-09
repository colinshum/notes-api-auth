// Require modules and config files
var jwt = require('jsonwebtoken');
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var db = require('./config/db');
var User = require('./api/models/userModel');
var Note = require('./api/models/notesModel');


// Instantiate Express and router
var app = express();
var apiRoutes = express.Router();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.set('secretKey', db.secretKey);

// Connect to MongoDB
mongoose.connect(db.uri, { useMongoClient: true });

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
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    } else if (user) {
      if (user.password != req.body.password) {
        res.json({ success: false, message: 'Authentication failed. User not found.' });
      } else {
        const payload = {username: user.username, email: user.email, user_class: user.user_class};
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

var apiRoute = require('./api/routes/apiRoute');
apiRoute(app);

app.listen(3000, () => {
  console.log('App is running on port 3000...');
});
