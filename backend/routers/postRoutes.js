// routes/postRoutes.js
const express = require('express');
const postRouter = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  likePost,
  commentOnPost
} = require('../controllers/postController');

postRouter.use(protect);

postRouter.route('/')
  .get(getAllPosts)
  .post(createPost);

postRouter.route('/:id')
  .get(getPostById)
  .put(updatePost)
  .delete(deletePost);

postRouter.route('/:id/like').put(likePost);
postRouter.route('/:id/comment').post(commentOnPost);

module.exports = postRouter;