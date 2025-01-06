import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function RecipeDetail() {
  const detailVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.5, when: "beforeChildren", staggerChildren: 0.3 } 
    },
    exit: { opacity: 0, y: -50, transition: { duration: 0.5 } },
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.5 } 
    },
  };

  const listItemVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: { 
      opacity: 1, 
      x: 0, 
      transition: { duration: 0.3 } 
    },
  };

  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [steps, setSteps] = useState([]); // New state for steps
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [unit, setUnit] = useState('metric');
  const [currentStep, setCurrentStep] = useState(0);

  const formatSteps = (instructions) => {
    if (!instructions) return [];
    return instructions
      .split(/[\r\n]+/) // Split by line breaks
      .map((step) => step.trim())
      .filter((step) => step !== ''); // Remove empty steps
  };

  const fetchRecipeDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const apiKey = import.meta.env.VITE_MEALDB_API_KEY || '1';
      const response = await axios.get(
        `https://www.themealdb.com/api/json/v1/${apiKey}/lookup.php`,
        { params: { i: id } }
      );
      if (response.data.meals && response.data.meals[0]) {
        setRecipe(response.data.meals[0]);
        setSteps(formatSteps(response.data.meals[0].strInstructions));
      } else {
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

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // Implement favorite functionality (e.g., save to localStorage or backend)
  };

  const toggleUnit = () => {
    setUnit(unit === 'metric' ? 'imperial' : 'metric');
    // Implement unit conversion logic if necessary
  };

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (loading) {
    return <p className="text-center mt-10 animate-pulse text-xl">Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500 text-center mt-10 text-xl">{error}</p>;
  }

  if (!recipe) {
    return null;
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-r from-green-100 to-blue-100 p-6"
      variants={detailVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <Link
        to="/"
        className="text-blue-600 underline mb-6 inline-block hover:text-blue-800 transition-colors"
      >
        &larr; Back to Home
      </Link>
      <motion.div
        className="bg-white bg-opacity-95 rounded-3xl shadow-2xl p-8 flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-8"
        variants={sectionVariants}
      >
        <motion.img
          src={recipe.strMealThumb}
          alt={recipe.strMeal}
          className="w-full md:w-1/2 rounded-xl object-cover shadow-lg"
          whileHover={{ scale: 1.05, rotate: 1 }}
          transition={{ duration: 0.3 }}
        />
        <div className="flex-1">
          <motion.h2
            className="text-4xl font-extrabold mb-4 text-gray-800"
            variants={sectionVariants}
          >
            {recipe.strMeal}
          </motion.h2>
          <motion.div variants={sectionVariants}>
            <h3 className="text-2xl font-semibold mb-2 text-green-700">Ingredients</h3>
            <ul className="list-disc list-inside mb-4">
              {getIngredients().map((ing, index) => (
                <motion.li
                  key={index}
                  className="text-gray-700 mb-1"
                  variants={listItemVariants}
                >
                  {ing}
                </motion.li>
              ))}
            </ul>
            <button
              onClick={toggleUnit}
              className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition-colors"
            >
              Toggle to {unit === 'metric' ? 'Imperial' : 'Metric'}
            </button>
          </motion.div>
          <h3 className="text-2xl font-semibold mb-2 text-green-700 mt-6">Instructions</h3>
          <div className="bg-gray-50 p-4 rounded-md shadow-inner">
            <div className="flex items-center mb-2">
              <span className="text-gray-600 mr-2">Step {currentStep + 1} of {steps.length}</span>
              <div className="w-full bg-gray-300 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                ></div>
              </div>
            </div>
            <motion.p
              className="text-gray-800 mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {steps[currentStep]}
            </motion.p>
            <div className="flex justify-between">
              <button
                onClick={handlePrevStep}
                disabled={currentStep === 0}
                className={`px-4 py-2 rounded-full ${
                  currentStep === 0
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                } transition-colors`}
              >
                Previous
              </button>
              <button
                onClick={handleNextStep}
                disabled={currentStep === steps.length - 1}
                className={`px-4 py-2 rounded-full ${
                  currentStep === steps.length - 1
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                } transition-colors`}
              >
                Next
              </button>
            </div>
          </div>
          {recipe.strYoutube && extractYouTubeID(recipe.strYoutube) && (
            <motion.div
              className="mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <h3 className="text-2xl font-semibold mb-2 text-green-700">Video Tutorial</h3>
              <div className="aspect-video relative rounded-xl shadow-lg overflow-hidden">
                <iframe
                  src={`https://www.youtube.com/embed/${extractYouTubeID(recipe.strYoutube)}`}
                  title="YouTube video player"
                  frameBorder="0"
                  allowFullScreen
                  className="absolute top-0 left-0 w-full h-full"
                ></iframe>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Nutritional Information Section */}
      <motion.div
        className="mt-8 bg-white bg-opacity-95 rounded-3xl shadow-2xl p-8"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-3xl font-bold mb-4 text-green-700">Nutritional Information</h2>
        <div className="flex flex-wrap justify-around">
          <motion.div
            className="m-4 p-4 bg-green-100 rounded-lg shadow-md w-48 text-center"
            variants={listItemVariants}
          >
            <span className="block text-xl font-semibold">Calories</span>
            <span className="block text-2xl">200 kcal</span>
          </motion.div>
          <motion.div
            className="m-4 p-4 bg-green-100 rounded-lg shadow-md w-48 text-center"
            variants={listItemVariants}
          >
            <span className="block text-xl font-semibold">Protein</span>
            <span className="block text-2xl">50g</span>
          </motion.div>
          <motion.div
            className="m-4 p-4 bg-green-100 rounded-lg shadow-md w-48 text-center"
            variants={listItemVariants}
          >
            <span className="block text-xl font-semibold">Carbs</span>
            <span className="block text-2xl">100g</span>
          </motion.div>
          <motion.div
            className="m-4 p-4 bg-green-100 rounded-lg shadow-md w-48 text-center"
            variants={listItemVariants}
          >
            <span className="block text-xl font-semibold">Fats</span>
            <span className="block text-2xl">30g</span>
          </motion.div>
        </div>
      </motion.div>

      {/* Reviews Section */}
      <motion.div
        className="mt-8 bg-white bg-opacity-95 rounded-3xl shadow-2xl p-8"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-3xl font-bold mb-4 text-green-700">Reviews</h2>
        <div className="space-y-4">
          {/* Example Review */}
          <motion.div
            className="p-4 bg-gray-100 rounded-lg shadow"
            variants={listItemVariants}
          >
            <div className="flex items-center mb-2">
              {[...Array(5)].map((star, index) => (
                <svg
                  key={index}
                  className={`w-6 h-6 ${index < 4 ? 'text-yellow-400' : 'text-gray-300'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.95a1 1 0 00.95.69h4.163c.969 0 1.371 1.24.588 1.81l-3.37 2.447a1 1 0 00-.364 1.118l1.286 3.95c.3.921-.755 1.688-1.54 1.118l-3.37-2.447a1 1 0 00-1.176 0l-3.37 2.447c-.784.57-1.838-.197-1.54-1.118l1.286-3.95a1 1 0 00-.364-1.118L2.98 9.377c-.783-.57-.38-1.81.588-1.81h4.163a1 1 0 00.95-.69l1.286-3.95z" />
                </svg>
              ))}
              <span className="ml-2 text-gray-700">4 out of 5</span>
            </div>
            <p className="text-gray-800">
              Delicious recipe! The instructions were clear and easy to follow. My family loved it.
            </p>
            <span className="text-sm text-gray-500">- Jane Doe</span>
          </motion.div>
          {/* Add more reviews as needed */}
        </div>
      </motion.div>
    </motion.div>
  );
}

const formatSteps = (instructions) => {
  if (!instructions) return [];
  return instructions
    .split(/[\r\n]+/) // Split by line breaks
    .map((step) => step.trim())
    .filter((step) => step !== ''); // Remove empty steps
};

const extractYouTubeID = (url) => {
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

export default RecipeDetail;
// No additional code needed.