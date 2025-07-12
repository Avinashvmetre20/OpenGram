// controllers/postController.js
const Post = require('../models/Post');
const User = require('../models/User');
const Comment = require('../models/Comment');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');

// @desc    Create a post
// @route   POST /api/posts
// @access  Private
exports.createPost = asyncHandler(async (req, res, next) => {
  // Extract media data from Cloudinary upload
  const media = req.files?.map(file => ({
    url: file.path,
    publicId: file.filename,
    mediaType: file.mimetype.startsWith('image') ? 'image' : 
               file.mimetype.startsWith('video') ? 'video' : 'gif',
    width: file.width,
    height: file.height
  }));

  // Extract hashtags from content
  const hashtags = req.body.content?.match(/#\w+/g)?.map(tag => tag.substring(1).toLowerCase()) || [];

  const post = await Post.create({
    user: req.user.id,
    content: req.body.content,
    media,
    hashtags,
    visibility: req.body.visibility || 'public'
  });

  // Populate user data before sending response
  await post.populate('user', 'username profilePicture');

  res.status(201).json({
    success: true,
    data: post
  });
});

// @desc    Get all visible posts (with pagination)
// @route   GET /api/posts
// @access  Private
exports.getAllPosts = asyncHandler(async (req, res, next) => {
  // Pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Base query
  const query = {
    $or: [
      { visibility: 'public' },
      { visibility: 'followers', user: { $in: req.user.following } },
      { user: req.user.id }
    ]
  };

  // Count total documents for pagination info
  const total = await Post.countDocuments(query);

  const posts = await Post.find(query)
    .sort('-createdAt')
    .skip(skip)
    .limit(limit)
    .populate({
      path: 'user',
      select: 'username profilePicture'
    })
    .populate({
      path: 'comments',
      options: { limit: 2, sort: { createdAt: -1 } },
      populate: {
        path: 'user',
        select: 'username profilePicture'
      }
    })
    .populate({
      path: 'likes',
      select: 'username profilePicture',
      options: { limit: 5 }
    });

  res.status(200).json({
    success: true,
    count: posts.length,
    total,
    pages: Math.ceil(total / limit),
    currentPage: page,
    data: posts
  });
});

// @desc    Get single post
// @route   GET /api/posts/:id
// @access  Private
exports.getPostById = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id)
    .populate('user', 'username profilePicture')
    .populate({
      path: 'comments',
      populate: {
        path: 'user',
        select: 'username profilePicture'
      }
    })
    .populate('likes', 'username profilePicture')
    .populate('mentions', 'username profilePicture');

  if (!post) {
    return next(new ErrorResponse(`Post not found with id of ${req.params.id}`, 404));
  }

  // Check post visibility
  if (post.visibility === 'private' && post.user._id.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to view this post', 401));
  }

  if (post.visibility === 'followers' && 
      !req.user.following.includes(post.user._id) && 
      post.user._id.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to view this post', 401));
  }

  res.status(200).json({
    success: true,
    data: post
  });
});

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private
exports.updatePost = asyncHandler(async (req, res, next) => {
  let post = await Post.findById(req.params.id);

  if (!post) {
    return next(new ErrorResponse(`Post not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is post owner
  if (post.user.toString() !== req.user.id) {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this post`, 401));
  }

  // Handle media updates
  const media = req.files?.map(file => ({
    url: file.path,
    publicId: file.filename,
    mediaType: file.mimetype.startsWith('image') ? 'image' : 
               file.mimetype.startsWith('video') ? 'video' : 'gif',
    width: file.width,
    height: file.height
  })) || post.media;

  // Extract hashtags from content
  const hashtags = req.body.content?.match(/#\w+/g)?.map(tag => tag.substring(1).toLowerCase()) || [];

  post = await Post.findByIdAndUpdate(req.params.id, {
    content: req.body.content || post.content,
    media,
    hashtags,
    visibility: req.body.visibility || post.visibility
  }, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: post
  });
});

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private
exports.deletePost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(new ErrorResponse(`Post not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is post owner or admin
  if (post.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this post`, 401));
  }

  // Delete media from Cloudinary
  if (post.media && post.media.length > 0) {
    for (const mediaItem of post.media) {
      await cloudinary.uploader.destroy(mediaItem.publicId);
    }
  }

  await post.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Like a post
// @route   PUT /api/posts/:id/like
// @access  Private
exports.likePost = asyncHandler(async (req, res, next) => {
  const post = await Post.findByIdAndUpdate(
    req.params.id,
    {
      $addToSet: { likes: req.user.id },
      $inc: { likeCount: 1 }
    },
    { new: true }
  );

  res.status(200).json({
    success: true,
    data: post
  });
});

// @desc    Unlike a post
// @route   DELETE /api/posts/:id/like
// @access  Private
exports.unlikePost = asyncHandler(async (req, res, next) => {
  const post = await Post.findByIdAndUpdate(
    req.params.id,
    {
      $pull: { likes: req.user.id },
      $inc: { likeCount: -1 }
    },
    { new: true }
  );

  res.status(200).json({
    success: true,
    data: post
  });
});

// @desc    Comment on a post
// @route   POST /api/posts/:id/comment
// @access  Private
exports.commentOnPost = asyncHandler(async (req, res, next) => {
  const comment = await Comment.create({
    user: req.user.id,
    post: req.params.id,
    text: req.body.text
  });

  // Update post's comment count
  await Post.findByIdAndUpdate(req.params.id, {
    $push: { comments: comment._id },
    $inc: { commentCount: 1 }
  });

  res.status(201).json({
    success: true,
    data: comment
  });
});

// @desc    Retweet a post
// @route   POST /api/posts/:id/retweet
// @access  Private
exports.retweetPost = asyncHandler(async (req, res, next) => {
  const originalPost = await Post.findById(req.params.id);

  if (!originalPost) {
    return next(new ErrorResponse(`Post not found with id of ${req.params.id}`, 404));
  }

  // Check if already retweeted
  const existingRetweet = await Post.findOne({
    user: req.user.id,
    originalPost: req.params.id
  });

  if (existingRetweet) {
    return next(new ErrorResponse('You have already retweeted this post', 400));
  }

  const retweet = await Post.create({
    user: req.user.id,
    originalPost: req.params.id,
    isRetweet: true,
    visibility: req.body.visibility || 'public'
  });

  // Update original post's retweet count
  await Post.findByIdAndUpdate(req.params.id, {
    $push: { retweets: { user: req.user.id } },
    $inc: { retweetCount: 1 }
  });

  res.status(201).json({
    success: true,
    data: retweet
  });
});

// @desc    Delete a retweet
// @route   DELETE /api/posts/:id/retweet
// @access  Private
exports.deleteRetweet = asyncHandler(async (req, res, next) => {
  const retweet = await Post.findOneAndDelete({
    user: req.user.id,
    originalPost: req.params.id,
    isRetweet: true
  });

  if (!retweet) {
    return next(new ErrorResponse('No retweet found to delete', 404));
  }

  // Update original post's retweet count
  await Post.findByIdAndUpdate(req.params.id, {
    $pull: { retweets: { user: req.user.id } },
    $inc: { retweetCount: -1 }
  });

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Toggle pin post
// @route   PUT /api/posts/:id/pin
// @access  Private
exports.togglePinPost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(new ErrorResponse(`Post not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is post owner
  if (post.user.toString() !== req.user.id) {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to pin this post`, 401));
  }

  // Unpin any currently pinned post
  await Post.updateMany(
    { user: req.user.id, isPinned: true, _id: { $ne: req.params.id } },
    { isPinned: false }
  );

  // Toggle pin status
  post.isPinned = !post.isPinned;
  await post.save();

  res.status(200).json({
    success: true,
    data: post
  });
});

// @desc    Get personalized feed (posts from followed users + own posts)
// @route   GET /api/posts/feed
// @access  Private
exports.getFeedPosts = asyncHandler(async (req, res, next) => {
  // Pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Get users you're following + yourself
  const followingUsers = [...req.user.following, req.user._id];

  // Base query
  const query = {
    user: { $in: followingUsers },
    $or: [
      { visibility: 'public' },
      { visibility: 'followers' },
      { user: req.user._id } // Always show user's own private posts
    ]
  };

  // Count total documents for pagination info
  const total = await Post.countDocuments(query);

  const posts = await Post.find(query)
    .sort('-createdAt')
    .skip(skip)
    .limit(limit)
    .populate({
      path: 'user',
      select: 'username profilePicture'
    })
    .populate({
      path: 'comments',
      options: { limit: 3, sort: { createdAt: -1 } },
      populate: {
        path: 'user',
        select: 'username profilePicture'
      }
    })
    .populate({
      path: 'likes',
      select: 'username profilePicture',
      options: { limit: 5 }
    });

  res.status(200).json({
    success: true,
    count: posts.length,
    total,
    pages: Math.ceil(total / limit),
    currentPage: page,
    data: posts
  });
});

// @desc    Get post replies
// @route   GET /api/posts/:id/replies
// @access  Private
exports.getPostReplies = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  
  if (!post) {
    return next(new ErrorResponse(`Post not found with id of ${req.params.id}`, 404));
  }

  const replies = await Comment.find({ 
    post: req.params.id,
    isReply: true 
  })
  .sort('-createdAt')
  .populate('user', 'username profilePicture');

  res.status(200).json({
    success: true,
    count: replies.length,
    data: replies
  });
});

// @desc    Get users who liked a post
// @route   GET /api/posts/:id/likes
// @access  Private
exports.getPostLikes = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id)
    .populate('likes', 'username profilePicture');

  if (!post) {
    return next(new ErrorResponse(`Post not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    count: post.likes.length,
    data: post.likes
  });
});

// @desc    Get retweet information
// @route   GET /api/posts/:id/retweets
// @access  Private
exports.getPostRetweets = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id)
    .populate('retweets.user', 'username profilePicture');

  if (!post) {
    return next(new ErrorResponse(`Post not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    count: post.retweets.length,
    data: post.retweets
  });
});