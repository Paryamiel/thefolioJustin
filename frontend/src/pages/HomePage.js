// src/pages/HomePage.js
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import PostCard from '../components/PostCard';

function HomePage({ theme, toggleTheme }) {
  // 1. Your existing static portfolio data
  const portfolioData = [
    {
      id: 1,
      title: "MY STORY",
      description: "Learn more about my background in music, how I started, and what inspires my creativity.",
      link: "/about",
      linkText: "Read More"
    },
    {
      id: 2,
      title: "CONNECT",
      description: "Discover useful music learning resources and ways to get in touch for collaborations.",
      link: "/contact",
      linkText: "Get in Touch"
    },
    {
      id: 3,
      title: "JOIN US",
      description: "Sign up to receive updates, exclusive tips, and learning resources related to music.",
      link: "/register",
      linkText: "Register Now"
    }
  ];

  // 2. NEW: State to hold your dynamic database posts
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 3. NEW: Fetch posts from backend when the page loads
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('/api/posts');
        setPosts(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <>
      <main>
        {/* --- YOUR ORIGINAL HERO SECTION --- */}
        <section className="hero">
          <div className="hero-content">
            <div className="hero-text centered">
              <h1>Hello</h1>
              <h2>I'm Justin</h2>
              <p>Music has always been a meaningful part of my life. Playing instruments allows me to express my emotions, relax, and enjoy learning something new.</p>
              <div className="key-highlights">
                <h3>Musical Journey Highlights</h3>
                <ul className="highlights-list">
                  <li>Started learning acoustic guitar out of curiosity</li>
                  <li>Explored electric guitar to broaden skills</li>
                  <li>Enjoys creating music as a form of relaxation</li>
                </ul>
              </div>
              <br />
              <Link to="/about" className="primary-btn">Read My Story</Link>
            </div>
          </div>
        </section>

        {/* --- YOUR ORIGINAL STATIC PORTFOLIO GRID --- */}
        <section className="previews">
          <h2 className="section-title">Explore My Portfolio</h2>
          <div className="highlights-grid"> 
            {portfolioData.map((item) => (
              <PostCard 
                key={item.id} 
                title={item.title} 
                description={item.description} 
                link={item.link} 
                linkText={item.linkText} 
              />
            ))}
          </div>
        </section>

        {/* --- NEW: DYNAMIC POSTS FEED FROM MONGODB --- */}
        {/* --- NEW: DYNAMIC POSTS FEED FROM MONGODB --- */}
        {/* I increased the maxWidth from 800px to 1200px so they have room to spread out! */}
        <section className="dynamic-posts" style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
          <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '30px' }}>Latest Updates</h2>
          
          {loading ? (
            <p style={{ textAlign: 'center' }}>Loading the latest updates...</p>
          ) : posts.length === 0 ? (
            <p style={{ textAlign: 'center' }}>No posts found. You should create one!</p>
          ) : (
            
            // CHANGED THIS DIV: Now using CSS Grid to automatically create responsive columns!
            <div className="post-feed" style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
              gap: '30px' 
            }}>
              
              {posts.map((post) => (
                <div key={post._id} className="post-card dark-form" style={{ 
                  padding: '20px', 
                  borderRadius: '8px', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  display: 'flex',
                  flexDirection: 'column' // Keeps the content inside the card neatly stacked
                }}>
                  
                  {/* Display Image if one exists */}
                  {post.image && (
                    <img 
                      src={`${process.env.REACT_APP_API_URL?.replace('/api','') || ''}/uploads/${post.image}`} 
                      alt={post.title} 
                      // Fixed the height to 200px so all images match and don't break the grid!
                      style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '5px', marginBottom: '15px' }}
                    />
                  )}
                  
                  <h3 style={{ color: '#00B4D8', marginBottom: '10px' }}>{post.title}</h3>
                  
                  <div style={{ fontSize: '12px', opacity: 0.7, marginBottom: '15px' }}>
                    By {post.author?.name || 'Unknown'} • {new Date(post.createdAt).toLocaleDateString()}
                  </div>
                  
                  {/* Truncate the body text to 100 characters */}
                  <p style={{ lineHeight: '1.6', flexGrow: 1 }}>
                    {post.body.length > 100 ? `${post.body.substring(0, 100)}...` : post.body}
                  </p>
                  
                  {/* Read More Link */}
                  <Link 
                    to={`/posts/${post._id}`} 
                    style={{ color: '#00B4D8', textDecoration: 'none', fontWeight: 'bold', marginTop: '10px', display: 'inline-block' }}
                  >
                    Read More &rarr;
                  </Link>
                </div>
              ))}
              
            </div>
          )}
        </section>

      </main>
    </>
  );
}

export default HomePage;