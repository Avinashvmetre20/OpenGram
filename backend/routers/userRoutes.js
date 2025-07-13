// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  loginUser,
  getCurrentUser,
  updateUserDetails,
  updatePassword,
  followUser,
  unfollowUser
} = require('../controllers/userController');
const {
  createAdmin,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} = require('../controllers/adminController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes (require authentication)
router.use(protect); // All routes below this will use the protect middleware

router.get('/me', getCurrentUser);
router.put('/updatedetails', updateUserDetails);
router.put('/updatepassword', updatePassword);

// Follow/Unfollow routes
router.post('/follow/:id', followUser);
router.delete('/follow/:id', unfollowUser);
router.get('/:id/followers', require('../controllers/userController').getFollowers);
router.get('/:id/following', require('../controllers/userController').getFollowing);
router.get('/:id/follow-status', require('../controllers/userController').getFollowStatus);

// Protect all routes and require admin role
router.use(authorize('admin'));
router.post('/admin', createAdmin);
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router; 