# Post Components

This directory contains the refactored post-related components that were extracted from the large `PostPage` component to improve readability and maintainability.

## Component Structure

### Main Components

- **PostCard** - The main container component that orchestrates all post sub-components
- **PostHeader** - Displays user information and pinned badge
- **PostContent** - Shows post text content and hashtags
- **MediaCarousel** - Handles media display with navigation controls
- **PostStats** - Displays like, comment, and retweet counts with interaction buttons
- **CommentsPreview** - Shows recent comments with user avatars
- **PostMeta** - Displays creation date and visibility settings
- **LikesModal** - Modal for showing who liked a post
- **Pagination** - Page navigation controls

### Usage

```jsx
import { PostCard, LikesModal, Pagination } from '../../components/posts';

// In your component
<PostCard
  post={postData}
  currentUser={currentUser}
  onLike={handleLike}
  onShowLikes={handleShowLikes}
  onNavClick={handleNavClick}
/>

<LikesModal
  isOpen={showLikesModal}
  onClose={() => setShowLikesModal(false)}
  likes={currentPostLikes}
  loading={loadingLikes}
/>

<Pagination
  pagination={pagination}
  onPageChange={handlePageChange}
/>
```

## Benefits of Refactoring

1. **Improved Readability** - Each component has a single responsibility
2. **Better Maintainability** - Changes to specific features are isolated
3. **Reusability** - Components can be reused in other parts of the application
4. **Easier Testing** - Each component can be tested independently
5. **Reduced Complexity** - The main PostPage component is now much simpler

## Component Props

### PostCard
- `post` - Post data object
- `currentUser` - Current authenticated user
- `onLike` - Function to handle like/unlike
- `onShowLikes` - Function to show likes modal
- `onNavClick` - Function to handle media navigation

### PostHeader
- `user` - User object with profile information
- `isPinned` - Boolean indicating if post is pinned

### PostContent
- `content` - Post text content
- `hashtags` - Array of hashtags

### MediaCarousel
- `media` - Array of media objects
- `postId` - Post ID for navigation
- `onNavClick` - Function to handle navigation

### PostStats
- `post` - Post data object
- `currentUser` - Current authenticated user
- `onLike` - Function to handle like/unlike
- `onShowLikes` - Function to show likes modal

### CommentsPreview
- `comments` - Array of comment objects
- `commentCount` - Total number of comments

### PostMeta
- `createdAt` - Post creation timestamp
- `visibility` - Post visibility setting

### LikesModal
- `isOpen` - Boolean to control modal visibility
- `onClose` - Function to close modal
- `likes` - Array of users who liked the post
- `loading` - Boolean for loading state

### Pagination
- `pagination` - Pagination state object
- `onPageChange` - Function to handle page changes 