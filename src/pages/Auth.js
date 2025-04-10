import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
// import { login, register } from '../services/auth';

function Auth({ setCurrentUser }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    // Check if signup parameter is in the URL
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('signup') === 'true') {
      setIsSignUp(true);
    }
  }, [location]);
  
  const validateForm = () => {
    if (!email || !password) {
      setError('Email and password are required');
      return false;
    }
    
    if (isSignUp) {
      if (!username) {
        setError('Username is required');
        return false;
      }
      
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
      
      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        return false;
      }
    }
    
    return true;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Mock authentication for now
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Create a mock user
      const user = {
        id: 'user1',
        username: username || 'demo_user',
        email: email
      };
      setCurrentUser(user);
      navigate('/');
    }, 1000);
  };
  
  // Create form inputs based on sign up state
  const createFormInputs = () => {
    const inputs = [];
    
    // Username input (only for sign up)
    if (isSignUp) {
      inputs.push(
        React.createElement(
          "div",
          { className: "mb-3", key: "username-field" },
          React.createElement(
            "label",
            { htmlFor: "username", className: "form-label" },
            "Username"
          ),
          React.createElement(
            "input",
            {
              type: "text",
              className: "form-control",
              id: "username",
              value: username,
              onChange: (e) => setUsername(e.target.value),
              required: true
            }
          )
        )
      );
    }
    
    // Email input (always)
    inputs.push(
      React.createElement(
        "div",
        { className: "mb-3", key: "email-field" },
        React.createElement(
          "label",
          { htmlFor: "email", className: "form-label" },
          "Email"
        ),
        React.createElement(
          "input",
          {
            type: "email",
            className: "form-control",
            id: "email",
            value: email,
            onChange: (e) => setEmail(e.target.value),
            required: true
          }
        )
      )
    );
    
    // Password input (always)
    inputs.push(
      React.createElement(
        "div",
        { className: "mb-3", key: "password-field" },
        React.createElement(
          "label",
          { htmlFor: "password", className: "form-label" },
          "Password"
        ),
        React.createElement(
          "input",
          {
            type: "password",
            className: "form-control",
            id: "password",
            value: password,
            onChange: (e) => setPassword(e.target.value),
            required: true
          }
        )
      )
    );
    
    // Confirm password input (only for sign up)
    if (isSignUp) {
      inputs.push(
        React.createElement(
          "div",
          { className: "mb-4", key: "confirm-password-field" },
          React.createElement(
            "label",
            { htmlFor: "confirmPassword", className: "form-label" },
            "Confirm Password"
          ),
          React.createElement(
            "input",
            {
              type: "password",
              className: "form-control",
              id: "confirmPassword",
              value: confirmPassword,
              onChange: (e) => setConfirmPassword(e.target.value),
              required: true
            }
          )
        )
      );
    }
    
    return inputs;
  };
  
  // Create submit button with loading state
  const createSubmitButton = () => {
    return React.createElement(
      "div",
      { className: "d-grid mb-4" },
      React.createElement(
        "button",
        {
          type: "submit",
          className: "btn btn-primary py-2",
          disabled: loading,
          style: { backgroundColor: '#6f42c1', borderColor: '#6f42c1' }
        },
        loading 
          ? "Processing..." 
          : (isSignUp ? "Create Account" : "Sign In")
      )
    );
  };

  return React.createElement(
    "div",
    { className: "auth-page py-5" },
    React.createElement(
      "div",
      { className: "container" },
      React.createElement(
        "div",
        { className: "row justify-content-center" },
        React.createElement(
          "div",
          { className: "col-md-6 col-lg-5" },
          React.createElement(
            "div",
            { className: "card shadow" },
            React.createElement(
              "div",
              { className: "card-body p-5" },
              // Logo and header
              React.createElement(
                "div",
                { className: "text-center mb-4" },
                React.createElement(
                  "div",
                  { 
                    className: "brand-logo mb-3 mx-auto d-flex align-items-center justify-content-center",
                    style: { width: "60px", height: "60px", backgroundColor: "#6f42c1", borderRadius: "50%" }
                  },
                  React.createElement(
                    "span",
                    { className: "text-white fw-bold", style: { fontSize: "24px" } },
                    "n"
                  )
                ),
                React.createElement(
                  "h3",
                  null,
                  isSignUp ? "Create your account" : "Welcome back"
                ),
                React.createElement(
                  "p",
                  { className: "text-muted" },
                  isSignUp ? "Join our video community" : "Sign in to continue"
                )
              ),
              
              // Error message if any
              error && React.createElement(
                "div",
                { className: "alert alert-danger", role: "alert" },
                error
              ),
              
              // Auth form
              React.createElement(
                "form",
                { onSubmit: handleSubmit },
                // Form inputs based on sign up state
                ...createFormInputs(),
                // Submit button
                createSubmitButton()
              ),
              
              // Toggle between signup and signin
              React.createElement(
                "div",
                { className: "text-center" },
                React.createElement(
                  "p",
                  { className: "mb-0" },
                  isSignUp ? "Already have an account? " : "Don't have an account? ",
                  React.createElement(
                    "a",
                    { 
                      href: "#",
                      onClick: (e) => { 
                        e.preventDefault();
                        setIsSignUp(!isSignUp);
                      },
                      style: { color: '#6f42c1' }
                    },
                    isSignUp ? "Sign in" : "Sign up"
                  )
                )
              )
            )
          )
        )
      )
    )
  );
}

export default Auth;
