const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongo = require('mongodb');
const mongoose = require('mongoose');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');
const crypto = require('crypto');
var fs = require('fs');
const https = require('https');
const http = require('http');
var request = require('request');

//MongoDB Connection
mongourl = 'mongodb://dangil:12345qwerty@ds119160.mlab.com:19160/total-fishing';
mongoose.connect(mongourl);
var db = mongoose.connection;
// Create mongo connection
const conn = mongoose.createConnection(mongourl);

//Declaring Routes
var routes = require('./routes/index');
var users = require('./routes/users');

// Init App
var app = express();


// Init gfs
let gfs;

// Init stream
conn.once('open', () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
})

// Create storage engine
const storage = new GridFsStorage({
  url: mongourl,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        };
        resolve(fileInfo);
      });
    });
  }
});
const upload = multer({
  storage
});
const type = upload.single('file')

var Post = require('./models/post');


// @route Get /files
// @desc Display all files in jsonString
app.get('/files', (req, res) => {
  gfs.files.find().toArray((err, files) => {
    // Check if files
    if (!files || files.length === 0) {
      return res.status(404).json({
        err: 'No files exist'
      });
    }
    // Files exist
    return res.json(files);
  });
});

// @route Get /file/:filename
// @desc Display file  in jsonString
app.get('/file/:filename', (req, res) => {
  gfs.files.findOne({
    filename: req.params.filename
  }, (err, file) => {
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists'
      });
    }
    // File exists
    return res.json(file);
  });
});

// @route Get /image/:filename
// @desc Display image
app.get('/image/:filename', (req, res) => {
  gfs.files.findOne({
    filename: req.params.filename
  }, (err, file) => {
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists'
      });
    }
    //check image
    if (file.contentType === 'image/jpeg' || file.contentType === 'image/png' || file.contentType === 'image/gif') {
      // Read the output
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    } else {
      res.status(404).json({
        err: 'Not an image'
      });
    }
  });
});

// @route Get /images
// @desc Display all files in jsonString
app.get('/files', (req, res) => {
  gfs.files.find().toArray((err, files) => {
    // Check if files
    if (!files || files.length === 0) {
      return res.status(404).json({
        err: 'No files exist'
      });
    }
    // Files exist
    return res.json(files);
  });
});


// View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({
  defaultLayout: 'layout',
  helpers: require('./config/handlebars-helpers'),
}));
app.set('view engine', 'handlebars');

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(methodOverride('_method'));
app.use(cookieParser());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
    var namespace = param.split('.'),
      root = namespace.shift(),
      formParam = root;

    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    };
  }
}));

// Connect Flash
app.use(flash());

// Global Vars
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

// @route POST /
// @desc
app.post('/post', type, function(req, res) {
  var specie = req.body.specie;
  var weight = req.body.weight;
  var method = req.body.method;
  var description = req.body.description;
  var location = req.body.location;
  var privacy = req.body.privacy;
  var id = Math.floor((Math.random() * 999999999) + 1);


  // Validation
  req.checkBody('specie', 'specie is required').notEmpty();
  req.checkBody('weight', 'weight is required').notEmpty();
  req.checkBody('privacy', 'privacy is required').notEmpty();
  req.checkBody('method', 'method is required').notEmpty();

  var errors = req.validationErrors();

  if (errors) {
    res.render('catch', {
      errors: errors
    });
  } else {
    var newPost = new Post({
      creator: req.user.username,
      specie: specie,
      weight: weight,
      method: method,
      description: description,
      img_name: req.file.filename,
      location: location,
      privacy: privacy,
      likes: 0,
      id: Math.floor((Math.random() * 100) + 1)
    });

    Post.createPost(newPost, function(err, post) {
      if (err) throw err;
      console.log(post);
    });

    req.flash('success_msg', 'Post Submitted Succesfully');


    res.redirect('/catch');
  }
});

// Upload Image and send binary post request to image classification API
app.post('/upload', type, function(req, res, next) {

  // console.log(req.file.mimetype);
  var file = req.file.filename;
  gfs.files.findOne({ filename: req.file.filename}, function (err, file) {
    console.log(file);
    if (err) {
      console.log(err);
    }
      var readstream = gfs.createReadStream(file.filename);
      readstream.pipe(request
        .post("http://35.164.132.68/classify")
        .on('response', function(response) {
          response.setEncoding("UTF-8");
          response.on('data', function(data) {
            console.log(data);
            var jsonString = data.toString('utf8');
            if (jsonString.includes("tench")) {
              var json = JSON.parse(jsonString);
              var accuracy = json.predictions.tench;
              accuracy = Math.floor(accuracy* 100)
              accuracy = accuracy.toString().replace("0.", "");
              res.render('tench', {
                accuracy: accuracy
              });
            } else if (jsonString.includes("carp")) {
              var json = JSON.parse(jsonString);
              var accuracy = json.predictions.carp;
              accuracy = Math.floor(accuracy* 100)
              accuracy = accuracy.toString().replace("0.", "");
              res.render('carp', {
                accuracy: accuracy
              });
            } else if (jsonString.includes("pike")) {
              var json = JSON.parse(jsonString);
              var accuracy = json.predictions.pike;
              accuracy = Math.floor(accuracy* 100)
              accuracy = accuracy.toString().replace("0.", "");
              res.render('pike', {
                accuracy: accuracy
              });
            } else if (jsonString.includes("roach")) {
              var json = JSON.parse(jsonString);
              var accuracy = json.predictions.roach;
              accuracy = Math.floor(accuracy* 100)
              accuracy = accuracy.toString().replace("0.", "");
              res.render('roach', {
                accuracy: accuracy
              });
            } else if (jsonString.includes("perch")) {
              var json = JSON.parse(jsonString);
              var accuracy = json.predictions.perch;
              accuracy = Math.floor(accuracy* 100)
              accuracy = accuracy.toString().replace("0.", "");
              res.render('perch', {
                accuracy: accuracy
              });
            } else if (jsonString.includes("bream")) {
              var json = JSON.parse(jsonString);
              var accuracy = json.predictions.bream;
              accuracy = Math.floor(accuracy* 100)
              accuracy = accuracy.toString().replace("0.", "");
              res.render('bream', {
                accuracy: accuracy
              });
            } else if (jsonString.includes("trout")) {
              var json = JSON.parse(jsonString);
              var accuracy = json.predictions.trout;
              accuracy = Math.floor(accuracy* 100)
              accuracy = accuracy.toString().replace("0.", "");
              res.render('trout', {
                accuracy: accuracy
              });
            }else {
              req.flash('error_msg', 'Something went wrong!');
              res.redirect("/");
            }

          })
        })
        .on('error', function(err) {
          console.log(err);
        }));

      });
    });




app.use('/', routes);
app.use('/users', users);

// Set Port
app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function() {
  console.log('Server started on port ' + app.get('port'));
});
