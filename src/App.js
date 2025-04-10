import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Upload from './pages/Upload';
import Create from './pages/Create';
import Channel from './pages/Channel';
import Profile from './pages/Profile';
import Auth from './pages/Auth';
// import { getCurrentUser } from './services/auth';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Comment out the user fetch for now to get the app running
    // const checkUser = async () => {
    //   try {
    //     const user = await getCurrentUser();
    //     setCurrentUser(user);
    //   } catch (error) {
    //     console.error("Error fetching current user:", error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // checkUser();
    
    // Set loading to false directly for now
    setLoading(false);
  }, []);

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
    React.createElement(Navbar, { currentUser: currentUser }),
    React.createElement(
      "main",
      { className: "container py-4" },
      React.createElement(
        Routes,
        null,
        React.createElement(Route, { path: "/", element: React.createElement(Home, null) }),
        React.createElement(Route, { path: "/auth", element: React.createElement(Auth, { setCurrentUser: setCurrentUser }) }),
        React.createElement(Route, { 
          path: "/upload", 
          element: React.createElement(
            ProtectedRoute,
            null,
            React.createElement(Upload, null)
          )
        }),
        React.createElement(Route, { 
          path: "/create", 
          element: React.createElement(
            ProtectedRoute,
            null,
            React.createElement(Create, null)
          )
        }),
        React.createElement(Route, { 
          path: "/channel", 
          element: React.createElement(
            ProtectedRoute,
            null,
            React.createElement(Channel, null)
          )
        }),
        React.createElement(Route, { 
          path: "/profile/:userId", 
          element: React.createElement(Profile, { currentUser: currentUser }) 
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
