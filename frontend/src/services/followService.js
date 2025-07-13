import API from './api';

const followService = {
  // Follow a user
  followUser: async (userId) => {
    const response = await API.post(`/auth/follow/${userId}`);
    return response.data;
  },
  // Unfollow a user
  unfollowUser: async (userId) => {
    const response = await API.delete(`/auth/follow/${userId}`);
    return response.data;
  },
  // Get user's followers
  getFollowers: async (userId) => {
    const response = await API.get(`/auth/${userId}/followers`);
    return response.data;
  },
  // Get user's following
  getFollowing: async (userId) => {
    const response = await API.get(`/auth/${userId}/following`);
    return response.data;
  },
  // Check if current user is following another user
  isFollowing: async (userId) => {
    const response = await API.get(`/auth/${userId}/follow-status`);
    return response.data;
  }
};

export default followService; 