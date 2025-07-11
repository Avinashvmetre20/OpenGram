import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import ProfileSide from '../../pages/profile/ProfileSide';
// import "./Navbar.css"
const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.nav 
      className="navbar"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="navbar-brand">
        <Link to="/">
          <span className="logo-text">OpenGram</span>
        </Link>
      </div>
      
      <div className="navbar-links">
        {isAuthenticated ? (
          <>
            {user?.role === 'admin' && (
              <Link to="/admin" className="nav-link admin-link">
                <i className="fas fa-crown"></i> 
                <span>Admin</span>
              </Link>
            )}
            <ProfileSide />
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link login-link">
              <i className="fas fa-sign-in-alt"></i> 
              <span>Login</span>
            </Link>
            <Link to="/register" className="nav-link register-link">
              <i className="fas fa-user-plus"></i> 
              <span>Join Free</span>
            </Link>
          </>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;