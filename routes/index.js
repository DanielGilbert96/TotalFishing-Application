var express = require('express');
const https = require('https');
var router = express.Router();
var request = require('request')
var http = require('http')
var multer = require('multer')
var fs = require('fs')
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

// Get Homepage
router.get('/', ensureAuthenticated, function(req, res) {
  res.render('index', {
    username: req.user.username
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
         if (jsonString.indexOf("tench")) {
           res.redirect('/tench');
         } else if (jsonString.indexOf("carp")) {
           res.redirect('/carp');
         } else if (jsonString.indexOf("pike")) {
           res.redirect('/pike');
         } else if (jsonString.indexOf("roach")) {
           res.redirect('/roach');
         } else if (jsonString.indexOf("perch")) {
           res.redirect('/perch');
         } else if (jsonString.indexOf("trout")) {
           res.redirect('/trout');
         }

      })
    })
    .on('error', function(err) {
      console.log(err);
    }));

  // fs.createReadStream(file).pipe(request.post('http://127.0.0.1:5000/classify'));

  // var path = req.file.path+'.jpg';
  // res.setHeader('Content-Type', req.file.mimetype)
  // fs.createReadStream(path.join(req.file.path, req.params.id)).pipe(res)

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
