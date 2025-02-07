// src/components/SearchBar.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceTimeout = useRef(null);
  const suggestionsCache = useRef({}); // Cache for auto-suggestions

  const apiKey = import.meta.env.VITE_MEALDB_API_KEY || '1';

  // Function to fetch suggestions based on the query
  const fetchSuggestions = async (searchTerm) => {
    // Return cached suggestions if available
    if (suggestionsCache.current[searchTerm]) {
      setSuggestions(suggestionsCache.current[searchTerm]);
      return;
    }
    try {
      const response = await axios.get(
        `https://www.themealdb.com/api/json/v1/${apiKey}/search.php`,
        { params: { s: searchTerm } }
      );
      const meals = response.data.meals || [];
      // Create a minimal suggestion list (you can include more info as needed)
      const suggestionList = meals.map((meal) => ({
        id: meal.idMeal,
        name: meal.strMeal,
      }));
      suggestionsCache.current[searchTerm] = suggestionList;
      setSuggestions(suggestionList);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    }
  };

  // Debounce the API call as the user types
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    setShowSuggestions(true);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      fetchSuggestions(query);
    }, 300);

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [query]);

  // When a suggestion is clicked, update the input and trigger search
  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.name);
    setShowSuggestions(false);
    onSearch(suggestion.name);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSuggestions(false);
    onSearch(query);
  };

  return (
    <div className="relative flex justify-center mb-8">
      <motion.form
        onSubmit={handleSubmit}
        className="w-1/2"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1.0 }}
        whileHover={{ scale: 1.05 }}
      >
        <div className="flex">
          <input
            type="text"
            placeholder="Search for recipes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query && setShowSuggestions(true)}
            className="w-full px-4 py-2 border rounded-l-md focus:outline-none"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600"
          >
            Find Recipes
          </button>
        </div>
      </motion.form>
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full mt-1 w-1/2 bg-white border rounded-md shadow-lg z-10">
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
