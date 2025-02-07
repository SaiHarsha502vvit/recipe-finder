// src/components/Home.jsx
import React, { useState, useRef } from 'react';
import axios from 'axios';
import SearchBar from './SearchBar';
import RecipeList from './RecipeList';
import { motion } from 'framer-motion';

function Home() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const searchCache = useRef({}); // Cache for full search results

  const searchRecipes = async (query) => {
    if (!query.trim()) {
      setError('Please enter a search term.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Check if this query result is already cached
      if (searchCache.current[query]) {
        setRecipes(searchCache.current[query]);
        setLoading(false);
        return;
      }
      const apiKey = import.meta.env.VITE_MEALDB_API_KEY || '1';
      const response = await axios.get(
        `https://www.themealdb.com/api/json/v1/${apiKey}/search.php`,
        {
          params: { s: query },
        }
      );
      const meals = response.data.meals || [];
      // Save to cache for future queries
      searchCache.current[query] = meals;
      setRecipes(meals);
      if (meals.length === 0) {
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
      <section className="text-center mb-12">
        <h1 className="text-5xl font-bold text-green-600 mb-4">Welcome to Recipe Finder</h1>
        <p className="text-lg text-gray-700">
          Discover delicious recipes and explore the art of cooking. Enhance your culinary skills with our curated collection.
        </p>
      </section>

      <SearchBar onSearch={searchRecipes} />

      {loading && <p className="text-center text-xl">Loading...</p>}
      {error && <p className="text-red-500 text-center text-xl">{error}</p>}
      
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <RecipeList recipes={recipes} />
      </motion.div>

      <section className="mt-16 text-center">
        <h2 className="text-3xl font-semibold text-green-700 mb-4">Why Cooking Matters</h2>
        <motion.p
          className="text-gray-600 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
        >
          Cooking is not just about preparing food; it's a way to bring people together, express creativity, and maintain a healthy lifestyle. Explore recipes that nourish both body and soul.
        </motion.p>
      </section>
    </motion.div>
  );
}

export default Home;
