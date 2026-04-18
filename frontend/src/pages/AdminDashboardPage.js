// src/pages/AdminDashboardPage.js
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('posts');
  
  // Data States
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]); // For Contact Form Submissions
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const config = { headers: { Authorization: `Bearer ${token}` } };

        // 1. Verify user is actually an admin before fetching everything
        const meRes = await axios.get('/api/auth/me', config);
        if (meRes.data.role !== 'admin') {
          alert('Access Denied: Admins only!');
          navigate('/');
          return;
        }

        // 2. Fetch all the data! (We use Promise.all to fetch them simultaneously for speed)
        // NOTE: We will verify you have these backend routes in the next step!
        const [postsRes, commentsRes, usersRes, messagesRes] = await Promise.all([
          axios.get('/api/posts'),
          axios.get('/api/comments/all', config), // Need an 'all comments' admin route
          axios.get('/api/auth/users', config),   // Need a 'get all users' admin route
          axios.get('/api/contacts', config)      // Need a 'get all messages' admin route
        ].map(p => p.catch(e => ({ data: [] })))); // If one fails (e.g., route not built yet), don't crash the others

        setPosts(postsRes.data);
        setComments(commentsRes.data);
        setUsers(usersRes.data);
        setMessages(messagesRes.data);
        setLoading(false);

      } catch (error) {
        console.error("Admin Dashboard Error:", error);
        navigate('/');
      }
    };

    fetchAdminData();
  }, [navigate]);

  // --- DELETE HANDLERS ---
  const handleDeletePost = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
      await axios.delete(`/api/posts/${id}`, config);
      setPosts(posts.filter(post => post._id !== id));
    } catch (err) { alert("Failed to delete post"); }
  };

  const handleDeleteComment = async (id) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    try {
      const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
      await axios.delete(`/api/comments/${id}`, config);
      setComments(comments.filter(comment => comment._id !== id));
    } catch (err) { alert("Failed to delete comment"); }
  };

  if (loading) return <p style={{ textAlign: 'center', marginTop: '50px' }}>Loading Admin Dashboard...</p>;

  // --- TAB BUTTON STYLES ---
  const tabStyle = (tabName) => ({
    padding: '10px 20px', cursor: 'pointer', background: activeTab === tabName ? 'rgba(0, 180, 216, 0.2)' : 'transparent',
    color: activeTab === tabName ? '#00B4D8' : 'white', border: `1px solid ${activeTab === tabName ? '#00B4D8' : 'rgba(255,255,255,0.2)'}`,
    borderRadius: '5px', fontWeight: 'bold'
  });

  return (
    <main style={{ padding: '40px 20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '30px' }}>Admin Dashboard</h2>
      
      {/* Tabs Navigation */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button style={tabStyle('posts')} onClick={() => setActiveTab('posts')}>Manage Posts ({posts.length})</button>
        <button style={tabStyle('comments')} onClick={() => setActiveTab('comments')}>Manage Comments ({comments.length})</button>
        <button style={tabStyle('users')} onClick={() => setActiveTab('users')}>Registered Users ({users.length})</button>
        <button style={tabStyle('messages')} onClick={() => setActiveTab('messages')}>Contact Form Concerns ({messages.length})</button>
      </div>

      <div className="dark-form" style={{ padding: '30px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
        
        {/* POSTS TAB */}
        {activeTab === 'posts' && (
          <div>
            <h3 style={{ color: '#00B4D8', marginBottom: '20px' }}>All Posts</h3>
            <Link to="/create-post" className="primary-btn" style={{ display: 'inline-block', marginBottom: '20px' }}>+ Create New Post</Link>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {posts.map(post => (
                <div key={post._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', background: 'rgba(0,0,0,0.3)', borderRadius: '5px' }}>
                  <div>
                    <h4 style={{ margin: '0 0 5px 0' }}>{post.title}</h4>
                    <small style={{ opacity: 0.6 }}>By {post.author?.name || 'Unknown'} • {new Date(post.createdAt).toLocaleDateString()}</small>
                  </div>
                  
                  {/* NEW: Flex container holding both Edit and Delete buttons */}
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <Link 
                      to={`/edit-post/${post._id}`} 
                      style={{ background: '#00B4D8', color: 'white', textDecoration: 'none', padding: '8px 15px', borderRadius: '5px', fontSize: '14px' }}
                    >
                      Edit
                    </Link>
                    <button 
                      onClick={() => handleDeletePost(post._id)} 
                      style={{ background: '#ff4d4d', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer' }}
                    >
                      Delete
                    </button>
                  </div>

                </div>
              ))}
            </div>
          </div>
        )}

        {/* COMMENTS TAB */}
        {activeTab === 'comments' && (
          <div>
            <h3 style={{ color: '#00B4D8', marginBottom: '20px' }}>All Comments</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {comments.map(comment => (
                <div key={comment._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', background: 'rgba(0,0,0,0.3)', borderRadius: '5px' }}>
                  <div>
                    <p style={{ margin: '0 0 5px 0', fontSize: '14px' }}>"{comment.body}"</p>
                    <small style={{ opacity: 0.6 }}>By {comment.author?.name || 'Unknown'} • {new Date(comment.createdAt).toLocaleDateString()}</small>
                  </div>
                  <button onClick={() => handleDeleteComment(comment._id)} style={{ background: '#ff4d4d', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer' }}>Delete</button>
                </div>
              ))}
              {comments.length === 0 && <p style={{ opacity: 0.6 }}>No comments found. Check your backend Admin routes!</p>}
            </div>
          </div>
        )}

        {/* USERS TAB */}
        {activeTab === 'users' && (
          <div>
            <h3 style={{ color: '#00B4D8', marginBottom: '20px' }}>Registered Accounts</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              {users.map(user => (
                <div key={user._id} style={{ padding: '15px', background: 'rgba(0,0,0,0.3)', borderRadius: '5px' }}>
                  <h4 style={{ margin: '0 0 5px 0' }}>{user.name} <span style={{ fontSize: '10px', padding: '3px 6px', background: user.role === 'admin' ? '#00B4D8' : 'rgba(255,255,255,0.2)', borderRadius: '10px', marginLeft: '5px' }}>{user.role}</span></h4>
                  <p style={{ margin: 0, fontSize: '14px', opacity: 0.8 }}>{user.email}</p>
                </div>
              ))}
              {users.length === 0 && <p style={{ opacity: 0.6 }}>No users found. Check your backend Admin routes!</p>}
            </div>
          </div>
        )}

        {/* MESSAGES TAB */}
        {activeTab === 'messages' && (
          <div>
            <h3 style={{ color: '#00B4D8', marginBottom: '20px' }}>Contact Form Submissions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {messages.map(msg => (
                <div key={msg._id} style={{ padding: '15px', background: 'rgba(0,0,0,0.3)', borderRadius: '5px', borderLeft: '4px solid #00B4D8' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <h4 style={{ margin: 0 }}>From: {msg.name} ({msg.email})</h4>
                    <small style={{ opacity: 0.6 }}>{new Date(msg.createdAt).toLocaleDateString()}</small>
                  </div>
                  <p style={{ margin: 0, lineHeight: '1.5', fontSize: '14px' }}>{msg.message}</p>
                </div>
              ))}
              {messages.length === 0 && <p style={{ opacity: 0.6 }}>No messages yet. (Ensure you have a Contact model and route built!)</p>}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}

export default AdminDashboardPage;