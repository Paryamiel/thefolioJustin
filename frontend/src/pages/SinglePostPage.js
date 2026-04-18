import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

// Helper function to peek inside the JWT token and get the logged-in user's ID
const getCurrentUserId = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    // A JWT token has 3 parts separated by dots. The middle part (index 1) contains the user data!
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.id;
  } catch (e) {
    return null;
  }
};

function SinglePostPage() {
  const { id } = useParams();
  
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");

  // Get the ID of the person currently looking at the screen
  const currentUserId = getCurrentUserId();

  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        const postRes = await axios.get(`/api/posts/${id}`);
        const commentsRes = await axios.get(`/api/comments/${id}`);
        setPost(postRes.data);
        setComments(commentsRes.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setLoading(false);
      }
    };
    fetchPostAndComments();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const response = await axios.post(`/api/comments/${id}`, { body: newComment }, config);
      setComments([...comments, response.data]);
      setNewComment(""); 
    } catch (error) {
      alert(error.response?.data?.message || "Failed to post comment");
    }
  };

  // NEW: Function to handle deleting a comment
  const handleDeleteComment = async (commentId) => {
    // Double-check with the user before deleting!
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      // Tell the backend to delete it
      await axios.delete(`/api/comments/${commentId}`, config);
      
      // Instantly remove it from the screen by filtering it out of our state
      setComments(comments.filter(comment => comment._id !== commentId));
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete comment");
    }
  };

  if (loading) return <p style={{ textAlign: 'center', marginTop: '50px' }}>Loading post...</p>;
  if (!post) return <p style={{ textAlign: 'center', marginTop: '50px' }}>Post not found.</p>;

  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <main style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto' }}>
      <Link to="/" style={{ color: '#00B4D8', textDecoration: 'none', marginBottom: '20px', display: 'inline-block' }}>
        &larr; Back to Home
      </Link>
      
      <article className="dark-form" style={{ padding: '30px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '40px' }}>
        {post.image && (
          <img src={`${process.env.REACT_APP_API_URL?.replace('/api','') || ''}/uploads/${post.image}`} alt={post.title} style={{ width: '100%', maxHeight: '500px', objectFit: 'cover', borderRadius: '8px', marginBottom: '20px' }} />
        )}
        <h1 style={{ color: '#00B4D8', marginBottom: '10px', fontSize: '2.5rem' }}>{post.title}</h1>
        <div style={{ fontSize: '14px', opacity: 0.7, marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          By {post.author?.name || 'Unknown'} • {new Date(post.createdAt).toLocaleDateString()}
        </div>
        <p style={{ lineHeight: '1.8', whiteSpace: 'pre-wrap', fontSize: '1.1rem' }}>{post.body}</p>
      </article>

      <section className="comments-section" style={{ padding: '20px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)' }}>
        <h3 style={{ marginBottom: '20px', color: '#00B4D8' }}>Comments ({comments.length})</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px' }}>
          {comments.length === 0 ? (
            <p style={{ opacity: 0.7, fontStyle: 'italic' }}>No comments yet. Be the first!</p>
          ) : (
            comments.map(comment => {
              // Extract the author ID safely (sometimes it's an object, sometimes a string depending on backend population)
              const commentAuthorId = comment.author?._id || comment.author;
              
              return (
                <div key={comment._id} style={{ padding: '15px', background: 'rgba(0,0,0,0.2)', borderRadius: '5px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ fontSize: '12px', color: '#00B4D8', fontWeight: 'bold' }}>
                      {comment.author?.name || 'Anonymous'} • {new Date(comment.createdAt).toLocaleDateString()}
                    </div>
                    
                    {/* ONLY show the delete button if currentUserId matches commentAuthorId! */}
                    {currentUserId === commentAuthorId && (
                      <button 
                        onClick={() => handleDeleteComment(comment._id)}
                        style={{ background: 'none', color: '#ff4d4d', border: 'none', cursor: 'pointer', fontSize: '12px', opacity: 0.8 }}
                        onMouseOver={(e) => e.target.style.opacity = 1}
                        onMouseOut={(e) => e.target.style.opacity = 0.8}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                  <p style={{ margin: 0, lineHeight: '1.5', fontSize: '14px' }}>{comment.body}</p>
                </div>
              );
            })
          )}
        </div>

        {isLoggedIn ? (
          <form onSubmit={handleCommentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <textarea 
              value={newComment} onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..." rows="3" required
              style={{ padding: '10px', borderRadius: '5px', background: 'rgba(0,0,0,0.3)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}
            />
            <button type="submit" className="primary-btn" style={{ alignSelf: 'flex-start' }}>Post Comment</button>
          </form>
        ) : (
          <p style={{ opacity: 0.7, fontStyle: 'italic' }}>
            <Link to="/login" style={{ color: '#00B4D8' }}>Log in</Link> to join the conversation.
          </p>
        )}
      </section>
    </main>
  );
}

export default SinglePostPage;