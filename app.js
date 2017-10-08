// Require modules and config files
var jwt = require('jsonwebtoken');
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var db = require('./config/db');
var User = require('./api/models/userModel');
var Note = require('./api/models/notesModel');


// Instantiate Express and modules
var app = express();
var apiRoutes = express.Router();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.set('secretKey', db.secretKey);


// Connect to MongoDB
mongoose.connect(db.uri, { useMongoClient: true });

apiRoutes.post('/register', function(req, res) {
  var newUser = new User(req.body);

  newUser.save(function(err, user) {
    if (err) throw err;
    return res.json(user);
  })
});

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

  // decode token
  if (token) {

    jwt.verify(token, app.get('secretKey'), function(err, decoded) {
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        // if everything is good, save to request for use in other routes
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

app.use('/api', apiRoutes);
var routes = require('./api/routes/notesRoute');
routes(app);

app.listen(3000, () => {
  console.log('App is running on port 3000...');
});
