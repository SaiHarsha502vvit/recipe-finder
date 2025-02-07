# Recipe Finder

## Introduction

Recipe Finder is your go-to web application for discovering a world of recipes! Built with React.js and powered by the TheMealDB API, it offers detailed information on countless meals, from ingredients to nutritional facts. Whether you're a seasoned chef or just looking for inspiration, Recipe Finder provides an intuitive and engaging experience.

## Features

### Interactive Search

- **Smart Suggestions:** Get real-time suggestions as you type, making it faster and easier to find the perfect recipe.
- **Debounced API Calls:** Ensures a smooth search experience without overwhelming the server.
- **Client-Side Caching:** Recent searches are stored locally, reducing API calls and speeding up results.

### Recipe Listings

- **Visually Appealing:** Each recipe is displayed with a mouth-watering image and the dish's name.
- **Easy Browsing:** Quickly scan through the list to find what catches your eye.

### Detailed Recipe View

- **Comprehensive Information:** Dive deep into each recipe with complete lists of ingredients, step-by-step instructions, and nutritional information.
- **Video Tutorials:** Watch helpful video tutorials for select recipes to guide you through the cooking process.

### Enhanced User Experience

- **Interactive UI:** Enjoy smooth animations and transitions powered by Framer Motion.
- **Responsive Design:** Seamlessly browse recipes on any device, from desktop to mobile.
- **Favorites:** Save your favorite recipes for easy access later.

### Performance Optimization

- **Reduced API Response Time:** Client-side caching and debouncing significantly improve search speed.
- **Seamless Experience:** Enjoy a fast and responsive interface.

## Technologies Used

- **React.js**: Front-end library for building user interfaces.
- **Vite**: Fast build tool for development and production.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Framer Motion**: Library for animations and transitions.
- **Axios**: Promise-based HTTP client for API requests.
- **React Router DOM**: Routing library for React applications.
- **Netlify**: Deployment and hosting platform.

## Usage

### Search for Recipes

Enter a keyword related to the recipe you're interested in using the search bar on the home page.

### View Recipe Listings

Browse through the list of recipes that match your search query. Each recipe card displays an image and the name of the dish.

### Explore Recipe Details

Click on a recipe card to view detailed information, including ingredients, instructions, nutritional information, and video tutorials.

### Manage Favorites

Mark recipes as favorites to easily access them later from the favorites section.

## Images

### Home Page

![Home Page](./public/Home-Page.jpg)

### Search Results

![Search Results](./public/Search-Results.jpg)

### Recipe Details

![Recipe Details](./public/Recipe-With-Step-By-Step-Guidence.jpg)

### Youtube Video

![Recipe With Youtube Video](./public/Recipe-With-Yt-and-Nutrients.jpg)

## Getting Started

To get started with the project, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/recipe-finder.git
   ```

2. Navigate to the project directory:

   ```bash
   cd recipe-finder
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm start
   ```

5. Open your browser and navigate to `http://localhost:3000` to view the application.

## Contributing

We welcome contributions to the project. If you would like to contribute, please fork the repository and submit a pull request.

## Deployment

The application is deployed and can be accessed at [Recipe Finder](/).
