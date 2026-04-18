// src/pages/CreatePostPage.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function CreatePostPage({ theme }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Because we are uploading an image file, we must use FormData instead of standard JSON
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (image) {
      formData.append('image', image); // This is picked up by your backend Multer setup!
    }

    try {
      // 1. Get the user's token from localStorage
      const token = localStorage.getItem('token');

      // 2. Send the request to the backend with the token in the headers
      await axios.post('/api/posts', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data' // Tells the server to expect a file
        }
      });

      alert('Post created successfully!');
      navigate('/home'); // Send them back to the home page

    } catch (err) {
      const errorMsg = err.response ? err.response.data.message : err.message;
      setError("Failed to create post: " + errorMsg);
    }
  };

  return (
    <section className="register-section" style={{ minHeight: '80vh' }}>
      <div className="register-container" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div className="register-left" style={{ width: '100%' }}>
          <h2>Create a New Post</h2>
          <p>Share your musical journey, tips, or latest performance.</p>

          <form className="dark-form" onSubmit={handleSubmit}>
            <input 
              type="text" 
              placeholder="Post Title" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <textarea 
              placeholder="Write your post content here..." 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              style={{ width: '100%', padding: '12px', marginTop: '15px', borderRadius: '5px', minHeight: '150px' }}
            />

            <div style={{ marginTop: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', opacity: 0.8 }}>Upload an Image:</label>
              <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => setImage(e.target.files[0])}
                style={{ padding: '10px 0' }}
              />
            </div>

            {error && <div className="error" style={{ marginTop: '10px' }}>{error}</div>}

            <button type="submit" className="primary-btn" style={{ marginTop: '20px', width: '100%' }}>
              Publish Post
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default CreatePostPage;