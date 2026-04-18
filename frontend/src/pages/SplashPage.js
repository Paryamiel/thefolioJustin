// src/pages/SplashPage.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Add this import

function SplashPage() {
  const navigate = useNavigate(); // Initialize the hook

  useEffect(() => {
    const timer1 = setTimeout(() => {
      const ring1 = document.querySelector('.ring1');
      const ring2 = document.querySelector('.ring2');
      const ring3 = document.querySelector('.ring3');
      const logo = document.getElementById('main-logo');
      const spinner = document.getElementById('main-spinner');

      if (spinner) spinner.style.opacity = '0';

      setTimeout(() => {
        if (ring1) ring1.classList.add('animate1');
        if (ring2) ring2.classList.add('animate2');
        if (ring3) ring3.classList.add('animate3');
        if (logo) logo.classList.add('hexagon-shrink');
        
        setTimeout(() => {
          navigate("/home"); // Replace window.location.href with this!
        }, 1500);
      }, 500);
    }, 2500);

    return () => clearTimeout(timer1);
  }, [navigate]); // Add navigate to the dependency array

  // ... rest of the component stays exactly the same

  return (
    <div className="loader-container" id="loader-content">
      <div className="ripple-ring ring1"></div>
      <div className="ripple-ring ring2"></div>
      <div className="ripple-ring ring3"></div>

      <div className="hexagon" id="main-logo">
        <span>J</span>
      </div>

      <div className="spinner" id="main-spinner"></div>
    </div>
  );
}

export default SplashPage;