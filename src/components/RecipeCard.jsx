// src/components/RecipeCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function RecipeCard({ recipe }) {


  
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
    hover: {
      scale: 1.05,
      rotate: 2,
      boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.2)',
      transition: {
        duration: 0.3,
      },
    },
  };
  
  return (
    <motion.div
    className="bg-white rounded-lg shadow-md overflow-hidden"
    variants={cardVariants}
    initial="hidden"
    animate="visible"
    whileHover="hover"
  >
      <Link to={`/recipe/${recipe.idMeal}`}>
        <img
          src={recipe.strMealThumb}
          alt={recipe.strMeal}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h3 className="text-lg font-semibold">{recipe.strMeal}</h3>
        </div>
      </Link>
    </motion.div>
  );
}

export default RecipeCard;