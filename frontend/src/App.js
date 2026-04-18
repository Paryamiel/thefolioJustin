// src/App.js
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';
import SplashPage from './pages/SplashPage';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import CreatePostPage from './pages/CreatePostPage';
import SinglePostPage from './pages/SinglePostPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import EditPostPage from './pages/EditPostPage';

function App() {
  // 1. Create the theme state (defaulting to dark)
  const [theme, setTheme] = useState('dark');

  // 2. Create the toggle function
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // 3. Update the body tag whenever the theme changes
  useEffect(() => {
    if (theme === 'light') {
      document.body.setAttribute('data-theme', 'light');
    } else {
      document.body.removeAttribute('data-theme');
    }
  }, [theme]);

  return (
    <BrowserRouter>
      {/* 1. Place the Header here and pass the theme props to it */}
      <Header theme={theme} toggleTheme={toggleTheme} />

      <Routes>
        <Route path="/" element={<SplashPage />} />
        {/* 4. Pass the theme and toggleTheme function as props to each page */}
        <Route path="/home" element={<HomePage theme={theme} toggleTheme={toggleTheme} />} />
        <Route path="/about" element={<AboutPage theme={theme} toggleTheme={toggleTheme} />} />
        <Route path="/contact" element={<ContactPage theme={theme} toggleTheme={toggleTheme} />} />
        <Route path="/register" element={<RegisterPage theme={theme} toggleTheme={toggleTheme} />} />
        <Route path="/login" element={<LoginPage theme={theme} toggleTheme={toggleTheme} />} /> 
        <Route path="/create-post" element={<CreatePostPage theme={theme} />} />   
        <Route path="/posts/:id" element={<SinglePostPage theme={theme} />} />
        <Route path="/profile" element={<ProfilePage theme={theme} />} />
        <Route path="/admin" element={<AdminDashboardPage theme={theme} />} />
        <Route path="/edit-post/:id" element={<EditPostPage theme={theme} />} />
      </Routes>

      {/* 2. Place the Footer at the bottom */}
      <Footer />
    </BrowserRouter>
  );
}

export default App;