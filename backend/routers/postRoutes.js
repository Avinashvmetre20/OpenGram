const express = require('express');
const postRouter = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const upload = require('../utils/cloudinary'); // Cloudinary config
const {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
  commentOnPost,
  retweetPost,
  deleteRetweet,
  getPostReplies,
  getPostLikes,
  getPostRetweets,
  togglePinPost,
  getFeedPosts
} = require('../controllers/postController');

// Apply authentication middleware to all routes
postRouter.use(protect);

// Post CRUD operations
postRouter.route('/')
  .get(getAllPosts) // Get all posts (with pagination/filters)
  .post(upload.array('media', 4), createPost); // Create post with multiple media (max 4)

postRouter.route('/:id')
  .get(getPostById) // Get single post with replies
  .put(upload.array('media', 4), updatePost) // Update post (with media)
  .delete(deletePost); // Delete post

// Engagement actions
postRouter.route('/:id/like')
  .put(likePost) // Like post
  .delete(unlikePost); // Unlike post

postRouter.route('/:id/retweet')
  .post(retweetPost) // Retweet
  .delete(deleteRetweet); // Remove retweet

postRouter.route('/:id/comment')
  .post(commentOnPost); // Add comment

// Additional post features
postRouter.route('/:id/pin')
  .put(togglePinPost); // Toggle pin status

// Post analytics
postRouter.route('/:id/replies')
  .get(getPostReplies); // Get post replies

postRouter.route('/:id/likes')
  .get(getPostLikes); // Get users who liked

postRouter.route('/:id/retweets')
  .get(getPostRetweets); // Get retweet info

// Personalized feed
postRouter.get('/feed', getFeedPosts);

module.exports = postRouter;