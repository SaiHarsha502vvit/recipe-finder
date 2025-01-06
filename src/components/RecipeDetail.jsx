// src/components/RecipeDetail.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function RecipeDetail() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRecipeDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const apiKey = import.meta.env.VITE_MEALDB_API_KEY || '1';
      const response = await axios.get(
        `https://www.themealdb.com/api/json/v1/${apiKey}/lookup.php`,
        {
          params: {
            i: id,
          },
        }
      );
      setRecipe(response.data.meals ? response.data.meals[0] : null);
      if (!response.data.meals) {
        setError('Recipe not found.');
      }
    } catch (error) {
      console.error('Error fetching recipe details:', error);
      setError('Failed to fetch recipe details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipeDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Extract ingredients and measures
  const getIngredients = () => {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = recipe[`strIngredient${i}`];
      const measure = recipe[`strMeasure${i}`];
      if (ingredient && ingredient.trim() !== '') {
        ingredients.push(`${measure} ${ingredient}`);
      }
    }
    return ingredients;
  };

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500 text-center mt-10">{error}</p>;
  }

  if (!recipe) {
    return null;
  }

  return (
    <motion.div
      className="min-h-screen bg-gray-100 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Link to="/" className="text-blue-500 underline mb-4 inline-block">
        &larr; Back to Home
      </Link>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-3xl font-bold mb-4">{recipe.strMeal}</h2>
        <img
          src={recipe.strMealThumb}
          alt={recipe.strMeal}
          className="w-full h-64 object-cover rounded-md mb-4"
        />
        <h3 className="text-2xl font-semibold mb-2">Ingredients</h3>
        <ul className="list-disc list-inside mb-4">
          {getIngredients().map((ing, index) => (
            <li key={index}>{ing}</li>
          ))}
        </ul>
        <h3 className="text-2xl font-semibold mb-2">Instructions</h3>
        <div
          className="prose lg:prose-xl"
          dangerouslySetInnerHTML={{ __html: formatInstructions(recipe.strInstructions) }}
        ></div>
        {recipe.strYoutube && (
          <div className="mt-4">
            <h3 className="text-2xl font-semibold mb-2">Video Tutorial</h3>
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                src={`https://www.youtube.com/embed/${extractYouTubeID(recipe.strYoutube)}`}
                title="YouTube video player"
                frameBorder="0"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Helper function to format instructions (optional)
const formatInstructions = (instructions) => {
  if (!instructions) return 'No instructions available.';
  return instructions.replace(/\r\n/g, '<br />');
};

// Helper function to extract YouTube ID from URL
const extractYouTubeID = (url) => {
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

export default RecipeDetail;