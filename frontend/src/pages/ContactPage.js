// src/pages/ContactPage.js
import { useState } from 'react';
import axios from 'axios'; // ADD THIS LINE

function ContactPage({ theme, toggleTheme }) {
  // 1. Set up our state variables to track inputs
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  
  // 2. Track validation errors and modal visibility
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);

  // 3. Handle the form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevents the default page reload
    
    let newErrors = {};
    let isValid = true;

    // Validation Logic (copied from your vanilla JS)
    if (name.trim() === '') {
      newErrors.name = '*Name is required.';
      isValid = false;
    }

    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    if (email.trim() === '') {
      newErrors.email = '*Email is required.';
      isValid = false;
    } else if (!email.match(emailPattern)) {
      newErrors.email = '*Enter a valid email.';
      isValid = false;
    }

    if (message.trim() === '') {
      newErrors.message = '*Message is required.';
      isValid = false;
    } else if (message.length < 10) {
      newErrors.message = '*Message must be at least 10 characters.';
      isValid = false;
    }

    setErrors(newErrors); // Update the errors state

    if (isValid) {
      // 1. Send the data to your backend
      axios.post('/api/contacts', { name, email, message })
        .then((response) => {
          // 2. If successful, show the modal and clear the form!
          setShowModal(true);
          setName('');
          setEmail('');
          setMessage('');
        })
        .catch((error) => {
          // 3. If the backend throws an error, log it
          console.error("Failed to send message:", error);
          alert("Sorry, there was an error sending your message.");
        });
    }
  };

  return (
    <>
     

      <section className="contact-container">
        <div className="contact-header">
          <h2 className="section-title">Get in Touch</h2>
          <p>If you would like to reach out, share music interests, or ask questions, feel free to send a message. This form is for learning purposes only.</p>
        </div>

        {/* 4. Connect the form to our handleSubmit function */}
        <form className="dark-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label>Full Name</label>
            <input 
              type="text" 
              placeholder="Your Name" 
              value={name}
              onChange={(e) => setName(e.target.value)} // Update state on every keystroke
            />
            {/* Conditionally render the error if it exists */}
            {errors.name && <span className="error">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="text" 
              placeholder="youremail@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label>Message</label>
            <textarea 
              rows="5" 
              placeholder="Your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
            {errors.message && <span className="error">{errors.message}</span>}
          </div>

          <button type="submit" className="primary-btn" style={{ width: '100%', marginTop: '10px' }}>
            Send Message
          </button>
        </form>
      </section>

      {/* 5. Dynamically display the modal based on showModal state */}
      <div style={{ display: showModal ? 'flex' : 'none' }} id="successModal">
        <div className="modal-content">
          <h2>Message Sent!</h2>
          <p>Thank you! Your message has been sent successfully.</p>
          <button className="close-btn" onClick={() => setShowModal(false)}>Awesome</button>
        </div>
      </div>
    </>
  );
}

export default ContactPage;