// src/components/Header.js
import { Link, useLocation, useNavigate } from 'react-router-dom';

function Header({ theme, toggleTheme }) {
  const location = useLocation();
  const navigate = useNavigate();

  // Check if a user is currently logged in by looking for their token
  const token = localStorage.getItem('token');
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  // The Logout Function
  const handleLogout = () => {
    // 1. Remove the user's data from the browser
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    
    // 2. Alert the user
    alert("You have been logged out!");
    
    // 3. Send them back to the login page (or home page)
    navigate('/login');
  };

  // If the user is on the Splash Page ("/"), don't show the header at all
  if (location.pathname === '/') {
    return null;
  }

  return (
    <header>
      <nav className="nav">
        <div className="logo-container">
          <span className="logo-text"><span className="logo-j">J</span>ustin</span>
        </div>
        <ul className="nav-links">
          <li><Link to="/home">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/contact">Contact</Link></li>
          <li><Link to="/profile">Profile</Link></li>

          {/* Conditional Rendering: What to show based on Auth status */}
          {token ? (
            // IF LOGGED IN: Show Logout and welcome message
            <>
              <li><Link to="/create-post" style={{ color: '#E0A96D', fontWeight: 'bold' }}>+ Create Post</Link></li>
              <li style={{ color: '#00B4D8', fontWeight: 'bold', marginLeft: '15px' }}>
                Hi, {userInfo?.name?.split(' ')[0]}!
              </li>
              <li>
                <button onClick={handleLogout} className="theme-btn" style={{ fontSize: '16px', marginLeft: '10px' }}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            // IF NOT LOGGED IN: Show Login and Register
            <>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
            </>
          )}

          <li>
            <button onClick={toggleTheme} className="theme-btn" style={{ marginLeft: '15px' }}>
              <span>{theme === 'light' ? '🌑' : '🌕'}</span>
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;