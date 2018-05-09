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
  Post.find({}, function(err, posts) {
    res.render('index', {
      username: req.user.username,
      name: req.user.name,
      posts: posts,
      false: 'false',
      true: 'true'
    });
  });
});

// Get Private Catches
router.get('/private', ensureAuthenticated, function(req, res) {
  Post.find({}, function(err, posts) {
    res.render('private', {
      username: req.user.username,
      name: req.user.name,
      posts: posts,
      false: "false",
      true: "true"
    });
  });
});

// Get thumbs up
router.get('/thumbs/:_id/:like', ensureAuthenticated, function(req, res) {
  var _id = req.params._id;
  var like = req.params.like;
  Post.findAndUpdateLikes(_id, like, function(err, call) {
    if (err) {
    req.flash('error_msg', 'Something went wrong!');
    res.redirect("/");
    }

    console.log(call);
    req.flash('success_msg', 'You have like this post!');
    res.redirect("/");
  });
});

// Get Delete Post
router.get('/deletePost/:_id', ensureAuthenticated, function(req, res) {
  var _id = req.params._id;
  Post.findAndDeletePost(_id, function(err, call) {
    if (err) {
    req.flash('error_msg', 'Something went wrong!');
    res.redirect("/");
    }

    console.log(call);
    req.flash('success_msg', 'You have deleted your post!');
    res.redirect("/");
  });
});

// Get Delete Post
router.get('/deleteComment/:_id/:postid', ensureAuthenticated, function(req, res) {
  var _id = req.params._id;
  var postid = req.params.postid;
  console.log(_id);
  console.log(postid);
  Post.findAndDeleteComment(_id, postid, function(err, call) {
    if (err) {
    req.flash('error_msg', 'Something went wrong!');
    res.redirect("/");
    }

    console.log(call);
    req.flash('success_msg', 'You have deleted your comment!');
    res.redirect("/");
  });
});

// Post a comment
router.post('/comment/:_id', ensureAuthenticated, function(req, res, done) {
  var _id = req.params._id;
  var comment = req.body.comment.toString();
  comment = comment.replace(",,,", "");
  var user = req.user.username;
  console.log(user);
  console.log(_id);
  Post.findAndUpdateComments(_id, comment, user, function(err, call) {
    if (err) {
    req.flash('error_msg', 'Something went wrong!');
    res.redirect("/");
    }

    console.log(call);
    req.flash('success_msg', 'You have posted a comment!');
    res.redirect("/");
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

// Get best day page
router.get('/bestDay', ensureAuthenticated, function(req, res) {
  res.render('patternPredictor');
});

// Get tench page
router.get('/tench', ensureAuthenticated, function(req, res) {
  res.render('tench');
});

// Get pike page
router.get('/pike', ensureAuthenticated, function(req, res) {
  res.render('pike');
});

// Get carp page
router.get('/carp', ensureAuthenticated, function(req, res) {
  res.render('carp');
});

// Get perch page
router.get('/perch', ensureAuthenticated, function(req, res) {
  res.render('perch');
});

// Get roach page
router.get('/roach', ensureAuthenticated, function(req, res) {
  res.render('roach');
});

// Get bream page
router.get('/bream', ensureAuthenticated, function(req, res) {
  res.render('bream');
});

// Get trout page
router.get('/trout', ensureAuthenticated, function(req, res) {
  res.render('trout');
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
