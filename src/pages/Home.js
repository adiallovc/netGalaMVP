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
  const [filter, setFilter] = useState('recent');
  
  useEffect(() => {
    // For now, we'll use the hardcoded categories above instead of fetching
    // const fetchCategories = async () => {
    //   try {
    //     setLoading(true);
    //     const data = await getCategories();
    //     setCategories(data);
    //     if (data.length > 0) {
    //       setSelectedCategory(data[0].id);
    //     }
    //   } catch (error) {
    //     console.error("Failed to fetch categories:", error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    
    // fetchCategories();
  }, []);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
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
            React.createElement(
              "select",
              {
                className: "form-select",
                value: selectedCategory || '',
                onChange: handleCategoryChange,
                style: {
                  maxWidth: '400px',
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
            )
          )
        )
      ),
      React.createElement(VideoCarousel, {
        categoryId: selectedCategory,
        filter: filter
      })
    )
  );
}

export default Home;
