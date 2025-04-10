import React, { useState, useEffect } from 'react';
import VideoCarousel from '../components/VideoCarousel';
// import { getCategories } from '../services/api';

function Home() {
  const [categories, setCategories] = useState([
    { id: 'trending', name: 'Trending Videos' },
    { id: 'music', name: 'Music Videos' },
    { id: 'tutorials', name: 'Tutorials' }
  ]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('trending');
  const [timeFilter, setTimeFilter] = useState('last24hours');
  
  const timeFilters = [
    { id: 'last24hours', name: 'Last 24 Hours' },
    { id: 'alltime', name: 'All Time Videos' }
  ];
  
  useEffect(() => {
    // For now, we'll use the hardcoded categories above instead of fetching
    // This would be replaced with an API call in a full implementation
  }, []);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };
  
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
            { className: "d-flex justify-content-center gap-3" },
            // Category dropdown
            React.createElement(
              "select",
              {
                className: "form-select",
                value: selectedCategory || '',
                onChange: handleCategoryChange,
                style: {
                  maxWidth: '200px',
                  borderColor: '#e0e0e0',
                  borderRadius: '4px'
                }
              },
              categories.map(category => 
                React.createElement(
                  "option",
                  { key: category.id, value: category.id },
                  category.name
                )
              )
            ),
            // Time filter dropdown
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
        categoryId: selectedCategory,
        timeFilter: timeFilter
      })
    )
  );
}

export default Home;
