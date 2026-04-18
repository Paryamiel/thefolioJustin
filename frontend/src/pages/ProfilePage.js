// src/pages/ProfilePage.js
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // NEW: States for editing mode
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editFile, setEditFile] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get('/api/auth/me', config);
        
        setUser(response.data);
        
        // Pre-fill the edit form with the user's current info
        setEditName(response.data.name);
        setEditBio(response.data.bio || '');
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile", error);
        localStorage.removeItem('token');
        navigate('/login');
      }
    };

    fetchProfile();
  }, [navigate]);

  // NEW: Function to handle saving the updated profile
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      
      // Because we might be sending a file, we MUST use FormData instead of a standard JSON object
      const formData = new FormData();
      formData.append('name', editName);
      formData.append('bio', editBio);
      if (editFile) {
        formData.append('profilePic', editFile);
      }

      // We need to tell the backend we are sending multipart/form-data
      const config = {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      };

      // Call your existing PUT route!
      const response = await axios.put('/api/auth/profile', formData, config);
      
      // Update the screen with the fresh data and close the edit form
      setUser(response.data);
      setIsEditing(false);
      
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to update profile");
    }
  };

  if (loading) return <p style={{ textAlign: 'center', marginTop: '50px' }}>Loading profile...</p>;
  if (!user) return <p style={{ textAlign: 'center', marginTop: '50px' }}>Failed to load profile.</p>;
  
const handleDeleteAccount = async () => {
    const isConfirmed = window.confirm(
      "WARNING: Are you sure you want to permanently delete your account? This action cannot be undone."
    );
    
    if (!isConfirmed) return;

    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      // Tell the backend to delete the account
      await axios.delete('/api/auth/me', config);
      
      // Clear the local storage and kick them to the home page
      localStorage.removeItem('token');
      alert("Your account has been successfully deleted.");
      navigate('/');
      window.location.reload(); // Refresh to update the navbar state
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete account");
    }
  };

  return (
    <main style={{ padding: '40px 20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '30px' }}>My Profile</h2>
      
      <div className="dark-form" style={{ padding: '30px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
        
        {/* Toggle between Edit Mode and View Mode */}
        {isEditing ? (
          <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <div>
              <label>Name</label>
              <input 
                type="text" value={editName} onChange={(e) => setEditName(e.target.value)}
                style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px', background: 'rgba(0,0,0,0.3)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}
                required
              />
            </div>

            <div>
              <label>Bio</label>
              <textarea 
                value={editBio} onChange={(e) => setEditBio(e.target.value)} rows="3"
                style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px', background: 'rgba(0,0,0,0.3)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}
              />
            </div>

            <div>
              <label>Profile Picture</label>
              <input 
                type="file" accept="image/*" onChange={(e) => setEditFile(e.target.files[0])}
                style={{ width: '100%', padding: '10px', marginTop: '5px' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button type="submit" className="primary-btn">Save Changes</button>
              <button type="button" onClick={() => setIsEditing(false)} style={{ padding: '10px 20px', borderRadius: '5px', background: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.3)', cursor: 'pointer' }}>Cancel</button>
            </div>
            
          </form>
        ) : (
          <>
            {/* View Mode (Your original profile UI) */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
                <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(0, 180, 216, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', color: '#00B4D8', overflow: 'hidden' }}>
                  {user.profilePic ? (
                     <img src={`http://localhost:5000/uploads/${user.profilePic}`} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                     user.name.charAt(0).toUpperCase()
                  )}
                </div>
                <div>
                  <h3 style={{ color: '#00B4D8', fontSize: '1.8rem', margin: 0 }}>{user.name}</h3>
                  <p style={{ margin: '5px 0 0 0', opacity: 0.7, textTransform: 'capitalize' }}>{user.role} Account</p>
                </div>
              </div>
              
              {/* The Edit Button */}
              <button onClick={() => setIsEditing(true)} style={{ padding: '8px 16px', borderRadius: '5px', background: 'rgba(0, 180, 216, 0.2)', color: '#00B4D8', border: '1px solid #00B4D8', cursor: 'pointer' }}>
                Edit Profile
              </button>
            </div>

            <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid rgba(255,100,100,0.3)' }}>
                <button 
                  onClick={handleDeleteAccount} 
                  style={{ background: 'transparent', color: '#ff4d4d', border: '1px solid #ff4d4d', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
                  onMouseOver={(e) => { e.target.style.background = '#ff4d4d'; e.target.style.color = 'white'; }}
                  onMouseOut={(e) => { e.target.style.background = 'transparent'; e.target.style.color = '#ff4d4d'; }}
                >
                  Delete Account
                </button>
              </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ fontSize: '12px', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '1px' }}>Email Address</label>
                <div style={{ padding: '12px', background: 'rgba(0,0,0,0.2)', borderRadius: '5px', marginTop: '5px', fontSize: '1.1rem' }}>{user.email}</div>
              </div>
              <div>
                <label style={{ fontSize: '12px', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '1px' }}>Bio</label>
                <div style={{ padding: '12px', background: 'rgba(0,0,0,0.2)', borderRadius: '5px', marginTop: '5px', minHeight: '80px', lineHeight: '1.5' }}>
                  {user.bio ? user.bio : <span style={{ fontStyle: 'italic', opacity: 0.5 }}>No bio added yet.</span>}
                </div>
              </div>
              <div>
                <label style={{ fontSize: '12px', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '1px' }}>Member Since</label>
                <div style={{ padding: '12px', background: 'rgba(0,0,0,0.2)', borderRadius: '5px', marginTop: '5px' }}>
                  {new Date(user.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </>
        )}

      </div>
    </main>
  );
}

export default ProfilePage;