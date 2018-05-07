var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// Post Schema
var PostSchema = mongoose.Schema({
	specie: {
		type: String
	},
	weight: {
		type: Number
	},
	method: {
		type: String
	},
	description: {
		type: String
	},
	img_name: {
		type: String
	},
	location: {
		type: String
	},
	privacy: {
		type: Boolean
	},
});


var Post = module.exports = mongoose.model('Post', PostSchema);


module.exports.createPost = function(newPost, callback){
	        newPost.save(callback);
}
