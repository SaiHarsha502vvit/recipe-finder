// src/components/Home.jsx
import React, { useState } from 'react';
import axios from 'axios';
import SearchBar from './SearchBar';
import RecipeList from './RecipeList';
import { motion } from 'framer-motion';

function Home() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchRecipes = async (query) => {
    if (!query.trim()) {
      setError('Please enter a search term.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const apiKey = import.meta.env.VITE_MEALDB_API_KEY || '1'; // Default to '1' if not set
      const response = await axios.get(
        `https://www.themealdb.com/api/json/v1/${apiKey}/search.php`,
        {
          params: {
            s: query,
          },
        }
      );
      setRecipes(response.data.meals || []);
      if (!response.data.meals) {
        setError('No recipes found. Please try a different search term.');
      }
    } catch (error) {
      console.error('Error fetching recipes:', error);
      setError('Failed to fetch recipes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-100 p-4"
    >
      <h1 className="text-4xl font-bold text-center mb-8">Recipe Finder</h1>
      <SearchBar onSearch={searchRecipes} />
      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}
      <RecipeList recipes={recipes} />
    </motion.div>
  );
}

export default Home;