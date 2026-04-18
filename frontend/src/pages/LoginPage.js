// src/pages/LoginPage.js
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function LoginPage({ theme, toggleTheme }) {
  // 1. Set up state for form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // 2. Set up state for errors and password visibility
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // 3. Set up navigation for redirecting after login
  const navigate = useNavigate();

  // 4. Handle the form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};

    // Basic Validation
    if (email.trim() === "") newErrors.email = "*Email is required";
    if (password === "") newErrors.password = "*Password is required";

    setErrors(newErrors);

    // If no errors, send request to backend
    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await axios.post('/api/auth/login', {
          email: email,
          password: password
        });

        // Save token to localStorage so the user stays logged in
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userInfo', JSON.stringify(response.data));

        alert("Login successful! Welcome back, " + response.data.name);
        
        // Redirect to the Home page
        navigate('/home');

      } catch (error) {
        // Handle incorrect password or email
        const errorMsg = error.response ? error.response.data.message : error.message;
        setErrors({ submit: errorMsg });
      }
    }
  };

  return (
    <>
      

      {/* We reuse the register classes so the layout matches perfectly! */}
      <section className="register-section">
        <div className="register-container">

          <div className="register-left">
            <h2>Welcome Back</h2>
            <p>Log in to access your dashboard, connect with others, and continue your musical journey.</p>

            <form className="dark-form" onSubmit={handleSubmit} noValidate>
              
              <input 
                type="email" 
                placeholder="Email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <span className="error">{errors.email}</span>}

              {/* Password with React toggle */}
              <div className="password-container">
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span className="toggle-text" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? "Hide" : "Show"}
                </span>
              </div>
              {errors.password && <span className="error">{errors.password}</span>}

              {/* Display backend errors (like "Invalid email or password") */}
              {errors.submit && <div className="error" style={{marginTop: '10px'}}>{errors.submit}</div>}

              <button type="submit" className="primary-btn" style={{ marginTop: '20px', width: '100%' }}>Log In</button>

              <p style={{ marginTop: '20px', textAlign: 'center', opacity: 0.8 }}>
                Don't have an account? <Link to="/register" style={{ color: '#00B4D8', textDecoration: 'none', fontWeight: 'bold' }}>Register here</Link>
              </p>

            </form>
          </div>

          <div className="register-right">
            {/* You can change this image to something else if you want! */}
            <img src="/images/pin.jpg" alt="Decorative login graphic" />
          </div>

        </div>
      </section>

      
    </>
  );
}

export default LoginPage;