var express = require('express');
var router = express.Router();

// Get Homepage
router.get('/', ensureAuthenticated, function(req, res){
	res.render('index', { username: req.user.username });
});
// Get Post Catch Page
router.get('/catch', ensureAuthenticated, function(req, res){
	res.render('catch');
});
// Get Best day Page
router.get('/bestDay', ensureAuthenticated, function(req, res){
	res.render('patternPredictor');
});


function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
}

module.exports = router;
