// src/pages/RegisterPage.js
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function RegisterPage({ theme, toggleTheme }) {
  // 1. Set up state for all form fields
  const [fullname, setFullname] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [level, setLevel] = useState('');
  const [terms, setTerms] = useState(false);

  const navigate = useNavigate();

  // 2. Set up state for errors and password visibility
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 3. Handle the form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};
    let isValid = true;

    // Validation Logic
    if (fullname.trim() === "") { newErrors.fullname = "*Full name is required"; isValid = false; }
    if (username.trim() === "") { newErrors.username = "*Username is required"; isValid = false; }
    
    let emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    if (email.trim() === "") { 
        newErrors.email = "*Email is required"; isValid = false; 
    } else if (!email.match(emailPattern)) {
        newErrors.email = "*Enter a valid email"; isValid = false;
    }

    // Age Calculation & Validation
    if (age === "") { 
        newErrors.age = "*Age is required"; isValid = false; 
    } else {
        const birthDate = new Date(age);
        const today = new Date();
        let calculatedAge = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            calculatedAge--;
        }
        if (calculatedAge < 18 || calculatedAge > 100) { 
            newErrors.age = "*For 18 and above only"; isValid = false; 
        }
    }

    if (password === "") { newErrors.password = "*Password is required"; isValid = false; }
    else if (password.length < 8) { newErrors.password = "*Min 8 characters"; isValid = false; }

    if (confirmPassword === "") { newErrors.confirmPassword = "*Confirm password"; isValid = false; }
    else if (confirmPassword !== password) { newErrors.confirmPassword = "*No match"; isValid = false; }

    if (!level) { newErrors.level = "*Select skill level"; isValid = false; }
    if (!terms) { newErrors.terms = "*Agree to terms"; isValid = false; }

    setErrors(newErrors);

    if (isValid) {
      try {
        // Send data to the backend
        const response = await axios.post('/api/auth/register', {
            name: fullname,
            email: email,
            password: password
        });

        // Save token
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userInfo', JSON.stringify(response.data));

        alert("Registration Successful!");
        navigate('/home'); // Send them to the home page!

      } catch (error) {
        const errorMsg = error.response ? error.response.data.message : error.message;
        alert("Registration failed: " + errorMsg);
      }
    }
  };

  return (
    <>
      

      <section className="register-section">
        <div className="register-container">

          <div className="register-left">
            <h2>Let’s Get Started</h2>
            <p>
              By signing up, you will receive music learning tips, practice motivation,
              and recommended resources.
            </p>

            <form className="dark-form" onSubmit={handleSubmit} noValidate>
              
              <input 
                type="text" 
                placeholder="Full Name" 
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
              />
              {errors.fullname && <span className="error">{errors.fullname}</span>}

              <input 
                type="text" 
                placeholder="Preferred Username" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              {errors.username && <span className="error">{errors.username}</span>}

              <input 
                type="email" 
                placeholder="Email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <span className="error">{errors.email}</span>}

              <input 
                type="date" 
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
              {errors.age && <span className="error">{errors.age}</span>}

              {/* Password with React toggle */}
              <div className="password-container">
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span className="toggle-text" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? "Hide" : "Show"}
                </span>
              </div>
              {errors.password && <span className="error">{errors.password}</span>}

              {/* Confirm Password with React toggle */}
              <div className="password-container">
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  placeholder="Confirm Password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <span className="toggle-text" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? "Hide" : "Show"}
                </span>
              </div>
              {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}

              {/* Radio buttons controlled by React state */}
              <p className="skill-title">Select your skill level:</p>
              <div className="radio-group">
                <label className="radio-item">
                  <input type="radio" name="level" value="Beginner" onChange={(e) => setLevel(e.target.value)} /> Beginner
                </label>
                <label className="radio-item">
                  <input type="radio" name="level" value="Intermediate" onChange={(e) => setLevel(e.target.value)} /> Intermediate
                </label>
                <label className="radio-item">
                  <input type="radio" name="level" value="Expert" onChange={(e) => setLevel(e.target.value)} /> Expert
                </label>
              </div>
              {errors.level && <span className="error">{errors.level}</span>}

              {/* Checkbox controlled by React state */}
              <label className="checkbox" style={{ marginTop: '10px', display: 'block' }}>
                <input 
                  type="checkbox" 
                  checked={terms}
                  onChange={(e) => setTerms(e.target.checked)}
                /> I agree to the terms and conditions.
              </label>
              {errors.terms && <span className="error">{errors.terms}</span>}

              <button type="submit" className="primary-btn" style={{ marginTop: '15px' }}>Register</button>

            </form>
          </div>

          <div className="register-right">
            <img src="/images/pin.jpg" alt="Decorative registration pin" />
          </div>

        </div>
      </section>

      
    </>
  );
}

export default RegisterPage;