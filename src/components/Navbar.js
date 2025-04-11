import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import { logout } from '../services/auth';

function Navbar({ currentUser }) {
  const navigate = useNavigate();
  const [showFollowing, setShowFollowing] = useState(false);

  const handleLogout = async () => {
    try {
      // await logout();
      window.location.href = '/'; // Full page refresh to clear all states
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Toggle following page view
  const handleFollowingClick = () => {
    setShowFollowing(!showFollowing);
    console.log('Switch to following view');
    // In a real app, this would navigate or filter content
  };

  // Create navigation links
  const createNavLinks = () => {
    let links = [
      { to: "/", text: "Discover" },
      { to: "/upload", text: "Upload" },
      { to: "/create", text: "Create" }
    ];
    
    // Add channel link that points to user's channel if logged in
    if (currentUser) {
      links.push({ to: `/channel/${currentUser.id || '1'}`, text: "My Channel" });
      links.push({ to: `/following/${currentUser.id || '1'}`, text: "Following" });
    } else {
      links.push({ to: "/channels", text: "Channels" });
    }

    return links.map((link, index) => 
      React.createElement(
        "li",
        { className: "nav-item", key: index },
        React.createElement(
          Link,
          { className: "nav-link", to: link.to },
          link.text
        )
      )
    );
  };

  // Create a link to Following page instead of a button
  const createFollowingLink = () => {
    return React.createElement(
      Link,
      {
        className: "btn me-3",
        to: `/following/${currentUser?.id || '1'}`,
        style: {
          backgroundColor: "transparent",
          color: "#6f42c1",
          border: "1px solid #6f42c1",
          fontWeight: 500
        }
      },
      "My Following"
    );
  };

  // Create user dropdown or auth buttons
  const createUserSection = () => {
    if (currentUser) {
      return React.createElement(
        React.Fragment,
        null,
        // No button here, we've moved it to the navigation links
        // User dropdown
        React.createElement(
          "div",
          { className: "dropdown" },
          React.createElement(
            "button",
            {
              className: "btn btn-light dropdown-toggle d-flex align-items-center",
              type: "button",
              id: "userDropdown",
              "data-bs-toggle": "dropdown",
              "aria-expanded": "false"
            },
            React.createElement(
              "span",
              { className: "me-2" },
              currentUser.username || "User"
            )
          ),
          React.createElement(
            "ul",
            { 
              className: "dropdown-menu dropdown-menu-end", 
              "aria-labelledby": "userDropdown" 
            },
            React.createElement(
              "li",
              null,
              React.createElement(
                Link,
                { 
                  className: "dropdown-item", 
                  to: `/profile/${currentUser.id || 'me'}` 
                },
                "Profile"
              )
            ),
            React.createElement(
              "li",
              null,
              React.createElement("hr", { className: "dropdown-divider" })
            ),
            React.createElement(
              "li",
              null,
              React.createElement(
                "button",
                { className: "dropdown-item", onClick: handleLogout },
                "Log out"
              )
            )
          )
        )
      );
    } else {
      return React.createElement(
        "div",
        { className: "auth-buttons" },
        React.createElement(
          Link,
          { to: "/auth", className: "btn me-2" },
          "Log in"
        ),
        React.createElement(
          Link,
          { 
            to: "/auth?signup=true", 
            className: "btn btn-primary",
            style: { backgroundColor: "#6f42c1", borderColor: "#6f42c1" }
          },
          "Sign up"
        )
      );
    }
  };

  return React.createElement(
    "nav",
    { className: "navbar navbar-expand-lg navbar-light bg-white py-3 shadow-sm" },
    React.createElement(
      "div",
      { className: "container" },
      // Brand logo
      React.createElement(
        Link,
        { className: "navbar-brand d-flex align-items-center", to: "/" },
        React.createElement(
          "div",
          { 
            className: "brand-logo me-2 d-flex align-items-center justify-content-center",
            style: { width: "30px", height: "30px", backgroundColor: "#6f42c1", borderRadius: "50%" }
          },
          React.createElement(
            "span",
            { className: "text-white fw-bold", style: { fontSize: "16px" } },
            "n"
          )
        )
      ),
      // Navbar toggle button
      React.createElement(
        "button",
        {
          className: "navbar-toggler",
          type: "button",
          "data-bs-toggle": "collapse",
          "data-bs-target": "#navbarNav"
        },
        React.createElement("span", { className: "navbar-toggler-icon" })
      ),
      // Navbar content
      React.createElement(
        "div",
        { className: "collapse navbar-collapse", id: "navbarNav" },
        React.createElement(
          "ul",
          { className: "navbar-nav me-auto" },
          createNavLinks()
        ),
        React.createElement(
          "div",
          { className: "d-flex align-items-center" },
          createUserSection()
        )
      )
    )
  );
}

export default Navbar;
