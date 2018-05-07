var express = require('express');
const https = require('https');
var bodyParser = require('body-parser');
var router = express.Router();
var request = require('request');
var http = require('http');
var multer = require('multer');
var GridFsStorage = require('multer-gridfs-storage');
var Grid = require('gridfs-stream');
var methodOverride = require('method-override');
var fs = require('fs');
var upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      now = Date.now().toString();
      require('fs').mkdir('uploads/' + now, err => {
        cb(null, 'uploads/' + now);
      });
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname.split('/').pop().trim());
    }
  })
});
var type = upload.single('file')
var Post = require('../models/post');

// Get Homepage
router.get('/', ensureAuthenticated, function(req, res) {
  res.render('index', {
    username: req.user.username
  });
});

// Get PostList
router.get('/postList', ensureAuthenticated, function(req, res) {
  Post.find({}, function(err, posts) {
    res.json(posts);
  });
});

// Get Post Catch Page
router.get('/catch', ensureAuthenticated, function(req, res) {
  res.render('catch');
});

// Get Image Recognition Page
router.get('/imageRec', ensureAuthenticated, function(req, res) {
  res.render('imageRecognition');
});

// Get Best day Page
router.get('/bestDay', ensureAuthenticated, function(req, res) {
  res.render('patternPredictor');
});

// Get Best day Page
router.get('/tench', ensureAuthenticated, function(req, res) {
  res.render('tench');
});

// Get Best day Page
router.get('/pike', ensureAuthenticated, function(req, res) {
  res.render('pike');
});

// Get Best day Page
router.get('/carp', ensureAuthenticated, function(req, res) {
  res.render('carp');
});

// Get Best day Page
router.get('/perch', ensureAuthenticated, function(req, res) {
  res.render('perch');
});

// Get Best day Page
router.get('/roach', ensureAuthenticated, function(req, res) {
  res.render('roach');
});

// Get Best day Page
router.get('/trout', ensureAuthenticated, function(req, res) {
  res.render('trout');
});

// Upload Image and send binary post request to image classification API
router.post('/upload', type, function(req, res, next) {
  // console.log(req.file.path);
  // console.log(req.file.mimetype);
  var file = req.file.path;
  var source = fs.createReadStream(file)
  source.pipe(request
    .post("http://localhost:5000/classify")
    .on('response', function(response) {
      response.setEncoding("UTF-8");
      response.once("data", function(chunk) {
        //console.log(chunk);
        var jsonString = chunk.toString('utf8');
        var json = JSON.parse(jsonString);
        console.log(json.predictions);
        if (jsonString.includes("tench")) {
          var accuracy = json.predictions.tench.toFixed(2).toString();
          accuracy = accuracy.replace("0.","");
          res.render('tench', {
          accuracy: accuracy
        });
        } else if (jsonString.includes("carp")) {
          var accuracy = json.predictions.carp.toFixed(2).toString();
          accuracy = accuracy.replace("0.","");
          res.render('carp', {
          accuracy: accuracy
        });
        } else if (jsonString.includes("pike")) {
          var accuracy = json.predictions.pike.toFixed(2).toString();
          accuracy = accuracy.replace("0.","");
          res.render('pike', {
            accuracy: accuracy
          });
        } else if (jsonString.includes("roach")) {
          var accuracy = json.predictions.roach.toFixed(2).toString();
          accuracy = accuracy.replace("0.","");
          res.render('roach', {
          accuracy: accuracy
        });
        } else if (jsonString.includes("perch")) {
          var accuracy = json.predictions.perch.toFixed(2).toString();
          accuracy = accuracy.replace("0.","");
          res.render('perch', {
          accuracy: accuracy
        });
        } else if (jsonString.includes("trout")) {
          var accuracy = json.predictions.trout.toFixed(2).toString();
          accuracy = accuracy.replace("0.","");
          res.render('trout', {
          accuracy: accuracy
        });
        }

      })
      fs.unlink(file, (err) => {
        if (err) throw err;
        console.log('file deleted');
      });
    })
    .on('error', function(err) {
      console.log(err);
    }));
});


function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash('error_msg', 'You are not logged in');
    res.redirect('/users/login');
  }
}

module.exports = router;
