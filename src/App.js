import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Upload from './pages/Upload';
import Create from './pages/Create';
import Channel from './pages/Channel';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import Auth from './pages/Auth';
// import { getCurrentUser } from './services/auth';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [followedUsers, setFollowedUsers] = useState([]);

  // Load current user from localStorage
  useEffect(() => {
    const checkUser = () => {
      try {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
          setCurrentUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error("Error retrieving user from localStorage:", error);
      } finally {
        setLoading(false);
      }
    };
    
    checkUser();
  }, []);
  
  // Load followed users from localStorage
  useEffect(() => {
    try {
      const savedFollowedUsers = localStorage.getItem('followedUsers');
      if (savedFollowedUsers) {
        setFollowedUsers(JSON.parse(savedFollowedUsers));
      }
    } catch (error) {
      console.error("Error retrieving followed users from localStorage:", error);
    }
  }, []);
  
  // Create a global function for following/unfollowing users
  const handleFollowUser = (userId, shouldFollow) => {
    try {
      // Create a new array based on current followed users
      let updatedFollowedUsers = [...followedUsers];
      
      if (shouldFollow) {
        // Add to followed users if not already following
        if (!updatedFollowedUsers.includes(userId)) {
          updatedFollowedUsers.push(userId);
        }
      } else {
        // Remove from followed users
        updatedFollowedUsers = updatedFollowedUsers.filter(id => id !== userId);
      }
      
      // Update state
      setFollowedUsers(updatedFollowedUsers);
      
      // Update localStorage
      localStorage.setItem('followedUsers', JSON.stringify(updatedFollowedUsers));
      
      return true; // Success
    } catch (error) {
      console.error("Error updating followed users:", error);
      return false; // Failure
    }
  };

  if (loading) {
    return React.createElement(
      "div", 
      { 
        className: "d-flex justify-content-center align-items-center", 
        style: { height: '100vh' } 
      },
      React.createElement(
        "div",
        { className: "spinner-border text-primary", role: "status" },
        React.createElement(
          "span",
          { className: "visually-hidden" },
          "Loading..."
        )
      )
    );
  }

  // Protected route component
  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return React.createElement(Navigate, { to: "/auth" });
    }
    return children;
  };

  return React.createElement(
    "div",
    { className: "app-container" },
    React.createElement(Navbar, { 
      currentUser: currentUser,
      followedUsers: followedUsers
    }),
    React.createElement(
      "main",
      { className: "container py-4" },
      React.createElement(
        Routes,
        null,
        React.createElement(Route, { 
          path: "/", 
          element: React.createElement(Home, { 
            currentUser: currentUser,
            followedUsers: followedUsers,
            handleFollowUser: handleFollowUser
          }) 
        }),
        React.createElement(Route, { 
          path: "/auth", 
          element: React.createElement(Auth, { 
            setCurrentUser: setCurrentUser 
          }) 
        }),
        React.createElement(Route, { 
          path: "/upload", 
          element: React.createElement(
            ProtectedRoute,
            null,
            React.createElement(Upload, { 
              currentUser: currentUser 
            })
          )
        }),
        React.createElement(Route, { 
          path: "/create", 
          element: React.createElement(
            ProtectedRoute,
            null,
            React.createElement(Create, { 
              currentUser: currentUser 
            })
          )
        }),
        React.createElement(Route, { 
          path: "/channel/:userId", 
          element: React.createElement(Channel, { 
            currentUser: currentUser,
            followedUsers: followedUsers,
            handleFollowUser: handleFollowUser
          })
        }),
        React.createElement(Route, { 
          path: "/profile/:userId", 
          element: React.createElement(Profile, { 
            currentUser: currentUser,
            followedUsers: followedUsers,
            handleFollowUser: handleFollowUser 
          }) 
        }),
        React.createElement(Route, {
          path: "/edit-profile/:userId",
          element: React.createElement(
            ProtectedRoute,
            null,
            React.createElement(EditProfile, { 
              currentUser: currentUser, 
              setCurrentUser: setCurrentUser 
            })
          )
        }),
        React.createElement(Route, { 
          path: "/following",
          element: React.createElement(
            ProtectedRoute,
            null,
            React.createElement(Home, { 
              currentUser: currentUser,
              followedUsers: followedUsers,
              handleFollowUser: handleFollowUser,
              showOnlyFollowed: true 
            })
          )
        }),
        React.createElement(Route, { 
          path: "*", 
          element: React.createElement(Navigate, { to: "/" }) 
        })
      )
    )
  );
}

export default App;
