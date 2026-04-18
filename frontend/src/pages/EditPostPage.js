import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function EditPostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch the post data when the page loads to pre-fill the form
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`/api/posts/${id}`);
        setTitle(response.data.title);
        setBody(response.data.body);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch post", error);
        navigate('/admin');
      }
    };
    fetchPost();
  }, [id, navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('title', title);
      formData.append('body', body);
      if (file) formData.append('image', file);

      const config = {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      };

      await axios.put(`/api/posts/${id}`, formData, config);
      navigate(`/posts/${id}`); // Send them to look at their newly updated post!
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update post");
    }
  };

  if (loading) return <p style={{ textAlign: 'center', marginTop: '50px' }}>Loading post data...</p>;

  return (
    <main style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '30px' }}>Edit Post</h2>
      <form onSubmit={handleUpdate} className="dark-form" style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '30px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
        
        <div>
          <label>Post Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required style={{ width: '100%', padding: '10px', marginTop: '5px' }} />
        </div>

        <div>
          <label>Post Body</label>
          <textarea value={body} onChange={(e) => setBody(e.target.value)} rows="10" required style={{ width: '100%', padding: '10px', marginTop: '5px', whiteSpace: 'pre-wrap' }}></textarea>
        </div>

        <div>
          <label>Update Image (Optional)</label>
          <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} style={{ width: '100%', padding: '10px', marginTop: '5px' }} />
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="submit" className="primary-btn">Save Changes</button>
          <button type="button" onClick={() => navigate(-1)} style={{ padding: '10px 20px', background: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '5px', cursor: 'pointer' }}>Cancel</button>
        </div>
      </form>
    </main>
  );
}

export default EditPostPage; 