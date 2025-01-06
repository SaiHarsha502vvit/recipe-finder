// src/components/RecipeList.jsx
import React from 'react';
import RecipeCard from './RecipeCard';
import { motion } from 'framer-motion';

function RecipeList({ recipes }) {
  if (recipes.length === 0) {
    return null;
  }

  const listVariants = {
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
    hidden: {},
  };
  

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
    >
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.idMeal} recipe={recipe} />
      ))}
    </motion.div>
  );
}

export default RecipeList;