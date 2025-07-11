import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData);
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="login-form">
      <div className="login-form__header">
        <h1 className="login-form__title">Welcome back</h1>
        <p className="login-form__subtitle">Please enter your credentials to login</p>
      </div>
      
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="login-form__error">
            <svg className="login-form__error-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}
        
        <div className="login-form__group">
          <label htmlFor="email" className="login-form__label">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            className="login-form__input"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="login-form__group">
          <label htmlFor="password" className="login-form__label">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            className="login-form__input"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="login-form__footer">
          <button type="submit" className="btn btn-primary login-form__submit">
            Login
          </button>
          <a href="/forgot-password" className="login-form__link">
            Forgot password?
          </a>
          
          <div className="login-form__divider">OR</div>
          
          <button type="button" className="btn btn-outline login-form__submit">
            Continue with Google
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;