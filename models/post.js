var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// Post Schema
var PostSchema = mongoose.Schema({
  creator: {
    type: String
  },
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
  likes: {
    type: Number
  },
  comments: [{
    body: String,
    user: String,
    date: Date
  }]

});


var Post = module.exports = mongoose.model('Post', PostSchema);


module.exports.createPost = function(newPost, callback) {
  newPost.save(callback);
}

module.exports.findAndUpdateLikes = function(_id, likes, callback) {
  var query = {
    _id: _id
  };
  var numlike = parseInt(likes);
  numlike = numlike + 1;
  Post.findOneAndUpdate(query, {
    $set: {
      likes: numlike
    }
  }, callback)
}

module.exports.findAndUpdateComments = function(_id, comment, user, callback) {
  var query = {
    _id: _id
  };
  var date = new Date();
  var comments = {
    "body": comment,
    "user": user,
    "date" : date
  };
  Post.findOneAndUpdate(query, {
    $push: {
      comments: comments
    }
  }, callback);
}
module.exports.findAndDeleteComment = function(_id, postid, callback) {

  Post.update({
    _id: postid
  }, {
    "$pull": {
      "comments": {
        "_id": _id
      }
    }
  }, callback);

}


module.exports.findAndDeletePost = function(_id, callback) {
  var query = {
    _id: _id
  };
  Post.findOne(query).remove(callback);
}
