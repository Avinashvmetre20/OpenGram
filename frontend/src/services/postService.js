import axios from 'axios';

const API_URL = 'http://localhost:8080/post';

const getPosts = async (page = 1, limit = 10) => {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.get(`${API_URL}/`, {
      params: { page, limit },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};

const likePost = async (postId) => {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.put(`${API_URL}/${postId}/like`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error liking post:', error);
    throw error;
  }
};

const unlikePost = async (postId) => {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.delete(`${API_URL}/${postId}/like`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error unliking post:', error);
    throw error;
  }
};

const getPostLikes = async (postId) => {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.get(`${API_URL}/${postId}/likes`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching post likes:', error);
    throw error;
  }
};

export const postService = {
  getPosts,
  likePost,
  unlikePost,
  getPostLikes,
};