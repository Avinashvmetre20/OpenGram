import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await register(formData);
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-form">
      <div className="auth-form__header">
        <h1 className="auth-form__title">Create your account</h1>
      </div>
      
      <form onSubmit={handleSubmit} noValidate>
        {error && (
          <div className="auth-form__error" role="alert">
            <svg className="auth-form__error-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}
        
        <div className="auth-form__group">
          <label htmlFor="username" className="auth-form__label">Username</label>
          <input
            id="username"
            type="text"
            name="username"
            className="auth-form__input"
            value={formData.username}
            onChange={handleChange}
            required
            minLength="3"
            autoComplete="username"
          />
        </div>
        
        <div className="auth-form__group">
          <label htmlFor="email" className="auth-form__label">Email address</label>
          <input
            id="email"
            type="email"
            name="email"
            className="auth-form__input"
            value={formData.email}
            onChange={handleChange}
            required
            autoComplete="email"
          />
        </div>
        
        <div className="auth-form__group">
          <label htmlFor="password" className="auth-form__label">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            className="auth-form__input"
            value={formData.password}
            onChange={handleChange}
            required
            minLength="6"
            autoComplete="new-password"
          />
        </div>
        
        <div className="auth-form__footer">
          <button 
            type="submit" 
            className="btn btn-primary auth-form__submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="auth-form__spinner"></span>
                Creating account...
              </>
            ) : (
              'Register'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;