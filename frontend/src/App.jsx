import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import PostPage from './pages/profile/PostPage';
// import PostList from './pages/profile/PostList';
import ProfileSide from './pages/profile/ProfileSide';
import EditProfile from './pages/profile/EditProfile';
import Home from './pages/Home';
import AdminDashboard from './pages/admin/Dashboard';
import EditUser from './pages/admin/EditUser';
import Navbar from './components/common/Navbar';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected User Routes */}
          <Route
            path="/PostPage"
            element={
              <ProtectedRoute>
                <PostPage />
              </ProtectedRoute>
            }
          />

            <Route
            path="/ProfileSide"
            element={
              <ProtectedRoute>
                <ProfileSide />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile/edit"
            element={
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users/:id"
            element={
              <ProtectedRoute adminOnly>
                <EditUser />
              </ProtectedRoute>
            }
          />

          {/* 404 Page - Optional */}
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;