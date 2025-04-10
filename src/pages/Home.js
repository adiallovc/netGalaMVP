import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import VideoCarousel from '../components/VideoCarousel';

function Home() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [timeFilter, setTimeFilter] = useState('last24hours');
  const [targetVideoId, setTargetVideoId] = useState(null);
  
  const timeFilters = [
    { id: 'last24hours', name: 'Last 24 Hours' },
    { id: 'alltime', name: 'All Time Videos' }
  ];
  
  // Parse URL parameters on component mount
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const urlTimeFilter = searchParams.get('timeFilter');
    const videoId = searchParams.get('videoId');
    
    // If timeFilter parameter exists and is valid, update state
    if (urlTimeFilter && timeFilters.some(filter => filter.id === urlTimeFilter)) {
      setTimeFilter(urlTimeFilter);
    }
    
    // If videoId parameter exists, set it in state
    if (videoId) {
      setTargetVideoId(videoId);
    }
  }, [location]);
  
  const handleTimeFilterChange = (e) => {
    const newFilter = e.target.value;
    setTimeFilter(newFilter);
    
    // Update URL with new filter but keep videoId if it exists
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('timeFilter', newFilter);
    
    const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
    window.history.replaceState({}, '', newUrl);
  };

  if (loading) {
    return React.createElement(
      "div", 
      { className: "text-center py-5" },
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

  return React.createElement(
    "div",
    { className: "home-page" },
    React.createElement(
      "div",
      { className: "container" },
      React.createElement(
        "div",
        { className: "row mb-4" },
        React.createElement(
          "div",
          { className: "col-md-6 mx-auto" },
          React.createElement(
            "div",
            { className: "d-flex justify-content-center" },
            // Time filter dropdown only
            React.createElement(
              "select",
              {
                className: "form-select",
                value: timeFilter,
                onChange: handleTimeFilterChange,
                style: {
                  maxWidth: '200px',
                  borderColor: '#e0e0e0',
                  borderRadius: '4px'
                }
              },
              timeFilters.map(filter => 
                React.createElement(
                  "option",
                  { key: filter.id, value: filter.id },
                  filter.name
                )
              )
            )
          )
        )
      ),
      React.createElement(VideoCarousel, {
        categoryId: 'trending', // Default to trending videos
        timeFilter: timeFilter,
        targetVideoId: targetVideoId
      })
    )
  );
}

export default Home;
