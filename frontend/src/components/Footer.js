// src/components/Footer.js
import { useLocation } from 'react-router-dom';

function Footer() {
  const location = useLocation();

  // If the user is on the Splash Page ("/"), don't show the footer
  if (location.pathname === '/') {
    return null;
  }

  return (
    <footer>
      <div style={{ textAlign: 'center', padding: '20px' }}>
          <p>Contact: myemail@gmail.com | Phone: 0123 456 8910</p>
          <p>&copy; 2026 Justin Portfolio</p>
      </div>
    </footer>
  );
}

export default Footer;