// models/Comment.js
const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  text: {
    type: String,
    required: [true, 'Please add comment text'],
    maxlength: [1000, 'Comment cannot exceed 1000 characters'],
    trim: true
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  likeCount: {
    type: Number,
    default: 0
  },
  replies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  replyCount: {
    type: Number,
    default: 0
  },
  isReply: {
    type: Boolean,
    default: false
  },
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  timestamps: true
});

// Indexes
CommentSchema.index({ user: 1 });
CommentSchema.index({ post: 1 });
CommentSchema.index({ createdAt: -1 });

// Update counts before save
CommentSchema.pre('save', function(next) {
  this.likeCount = this.likes.length;
  this.replyCount = this.replies.length;
  next();
});

//pre('remove') hook to delete nested replies
CommentSchema.pre('remove', async function(next) {
  await this.model('Comment').deleteMany({ replyTo: this._id });
  next();
});

//virtual for reply depth (to prevent infinite nesting)
CommentSchema.virtual('depth').get(function() {
  return this.isReply ? 1 : 0; // Custom logic for thread depth
});

module.exports = mongoose.model('Comment', CommentSchema);