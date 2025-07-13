// models/Like.js
const mongoose = require('mongoose');

const LikeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Like must belong to a user']
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: [true, 'Like must belong to a post']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound index to ensure a user can only like a post once
LikeSchema.index({ user: 1, post: 1 }, { unique: true });

// Indexes for better performance
LikeSchema.index({ post: 1 });
LikeSchema.index({ user: 1 });
LikeSchema.index({ createdAt: -1 });

// Static method to get like count for a post
LikeSchema.statics.getLikeCount = function(postId) {
  return this.countDocuments({ post: postId });
};

// Static method to check if user liked a post
LikeSchema.statics.hasUserLiked = function(userId, postId) {
  return this.exists({ user: userId, post: postId });
};

// Static method to get like counts for multiple posts
LikeSchema.statics.getLikeCounts = function(postIds) {
  return this.aggregate([
    { $match: { post: { $in: postIds } } },
    { $group: { _id: '$post', count: { $sum: 1 } } }
  ]);
};

// Static method to get user's liked posts
LikeSchema.statics.getUserLikedPosts = function(userId, postIds) {
  return this.find({
    user: userId,
    post: { $in: postIds }
  }).select('post');
};

const Like = mongoose.model('Like', LikeSchema);

module.exports = Like; 