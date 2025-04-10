import React, { useState, useEffect } from 'react';
import VideoCarousel from '../components/VideoCarousel';

function Home() {
  const [loading, setLoading] = useState(false);
  const [timeFilter, setTimeFilter] = useState('last24hours');
  
  const timeFilters = [
    { id: 'last24hours', name: 'Last 24 Hours' },
    { id: 'alltime', name: 'All Time Videos' }
  ];
  
  const handleTimeFilterChange = (e) => {
    setTimeFilter(e.target.value);
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
        timeFilter: timeFilter
      })
    )
  );
}

export default Home;
