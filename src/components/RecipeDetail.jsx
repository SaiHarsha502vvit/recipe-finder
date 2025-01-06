// src/components/RecipeDetail.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function RecipeDetail() {
  const detailVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -50, transition: { duration: 0.5 } },
  };

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
        { params: { i: id } }
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
    return <p className="text-center mt-10 animate-pulse">Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500 text-center mt-10">{error}</p>;
  }

  if (!recipe) {
    return null;
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-r from-green-200 to-blue-400 p-6"
      variants={detailVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <Link
        to="/"
        className="text-white underline mb-6 inline-block hover:text-gray-200 transition"
      >
        &larr; Back to Home
      </Link>
      <motion.div
        className="bg-white bg-opacity-90 rounded-3xl shadow-2xl p-8 flex flex-col md:flex-row"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.img
          src={recipe.strMealThumb}
          alt={recipe.strMeal}
          className="w-full md:w-1/2 rounded-xl object-cover shadow-lg"
          whileHover={{ scale: 1.05, rotate: 2 }}
          transition={{ duration: 0.3 }}
        />
        <div className="mt-6 md:mt-0 md:ml-8 flex-1">
          <h2 className="text-5xl font-extrabold mb-4 text-gray-800 animate-pulse">
            {recipe.strMeal}
          </h2>
          <h3 className="text-2xl font-semibold mb-2 text-green-700">Ingredients</h3>
          <ul className="list-disc list-inside mb-4">
            {getIngredients().map((ing, index) => (
              <motion.li
                key={index}
                className="text-gray-700"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {ing}
              </motion.li>
            ))}
          </ul>
          <h3 className="text-2xl font-semibold mb-2 text-green-700">Instructions</h3>
          <motion.div
            className="prose lg:prose-xl text-gray-800 mb-4"
            dangerouslySetInnerHTML={{ __html: formatInstructions(recipe.strInstructions) }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          ></motion.div>
          {recipe.strYoutube && (
            <motion.div
              className="mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <h3 className="text-2xl font-semibold mb-2 text-green-700">Video Tutorial</h3>
              <div className="aspect-w-16 aspect-h-9">
                <iframe
                  src={`https://www.youtube.com/embed/${extractYouTubeID(recipe.strYoutube)}`}
                  title="YouTube video player"
                  frameBorder="0"
                  allowFullScreen
                  className="w-full h-64 md:h-80 rounded-xl shadow-lg"
                ></iframe>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

const formatInstructions = (instructions) => {
  if (!instructions) return 'No instructions available.';
  return instructions.replace(/\r\n/g, '<br />');
};

const extractYouTubeID = (url) => {
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

export default RecipeDetail;
// No additional code needed.


