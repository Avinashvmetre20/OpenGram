import React, { useEffect, useState } from 'react';
import { postService } from '../../services/postService';
import authService from '../../services/authService';
import { PostCard, Pagination, PostStats, LikesModal } from '../../components/posts';
import './PostPage.css';

const PostPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [likeLoading, setLikeLoading] = useState({}); // { [postId]: boolean }
  const [showLikesModal, setShowLikesModal] = useState(false);
  const [currentPostLikes, setCurrentPostLikes] = useState([]);
  const [loadingLikes, setLoadingLikes] = useState(false);
  const [currentPostId, setCurrentPostId] = useState(null);
  const [modalPosition, setModalPosition] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1
  });

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = await authService.getMe();
        setCurrentUser(user);
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };
    fetchCurrentUser();
  }, []);

  const fetchPosts = async (page = 1) => {
    try {
      setLoading(true);
      const data = await postService.getPosts(page, pagination.limit);
      if (data.success) {
        setPosts(data.data);
        setPagination({
          page: data.currentPage,
          limit: pagination.limit,
          total: data.total,
          pages: data.pages
        });
      }
    } catch (err) {
      console.error('Error fetching posts:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [currentUser]);

  const handleLike = async (postId, isLiked) => {
    if (!currentUser) return;
    setLikeLoading(prev => ({ ...prev, [postId]: true }));
    setPosts(prevPosts => prevPosts.map(post =>
      post._id === postId
        ? {
            ...post,
            isLiked: !isLiked,
            likeCount: isLiked ? post.likeCount - 1 : post.likeCount + 1
          }
        : post
    ));
    try {
      if (isLiked) {
        await postService.unlikePost(postId);
      } else {
        await postService.likePost(postId);
      }
    } catch (err) {
      // Revert UI on error
      setPosts(prevPosts => prevPosts.map(post =>
        post._id === postId
          ? {
              ...post,
              isLiked: isLiked,
              likeCount: isLiked ? post.likeCount + 1 : post.likeCount - 1
            }
          : post
      ));
      alert('Failed to update like.');
    } finally {
      setLikeLoading(prev => ({ ...prev, [postId]: false }));
    }
  };

  const handleShowLikes = async (postId, position) => {
    setCurrentPostId(postId);
    setModalPosition(position);
    setShowLikesModal(true);
    setLoadingLikes(true);
    
    try {
      const response = await postService.getPostLikes(postId);
      if (response.success) {
        setCurrentPostLikes(response.data);
      }
    } catch (error) {
      console.error('Error fetching likes:', error);
      setCurrentPostLikes([]);
    } finally {
      setLoadingLikes(false);
    }
  };

  const handleCloseLikesModal = () => {
    setShowLikesModal(false);
    setCurrentPostLikes([]);
    setCurrentPostId(null);
    setModalPosition(null);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      fetchPosts(newPage);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="post-list">
      {posts.length === 0 ? (
        <div className="no-posts">No posts found</div>
      ) : (
        <>
          {posts.map(post => (
            <PostCard
              key={post._id}
              post={post}
              currentUser={currentUser}
              statsComponent={
                <PostStats
                  post={post}
                  isLiked={post.isLiked}
                  likeCount={post.likeCount}
                  onLike={() => handleLike(post._id, post.isLiked)}
                  loadingLike={!!likeLoading[post._id]}
                  onShowLikes={(position) => handleShowLikes(post._id, position)}
                />
              }
            />
          ))}
          
          <LikesModal
            isOpen={showLikesModal}
            onClose={handleCloseLikesModal}
            likes={currentPostLikes}
            loading={loadingLikes}
            postId={currentPostId}
            position={modalPosition}
          />
          
          <Pagination
            pagination={pagination}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default PostPage;