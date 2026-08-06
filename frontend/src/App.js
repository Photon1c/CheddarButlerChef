import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import IngredientInput from './components/IngredientInput';
import SuggestedRecipes from './components/SuggestedRecipes';
import RecipeLibrary from './components/RecipeLibrary';
import Footer from './components/Footer';

const STORAGE_KEY = 'my-chef-app-recipes';

function App() {
  const [activeTab, setActiveTab] = useState('search');
  const [recipes, setRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setSavedRecipes(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse saved recipes:', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedRecipes));
  }, [savedRecipes]);

  const handleSaveRecipe = (recipe) => {
    if (!savedRecipes.find(r => r.name === recipe.name)) {
      setSavedRecipes([...savedRecipes, { ...recipe, savedAt: new Date().toISOString() }]);
    }
  };

  const handleRemoveRecipe = (recipeName) => {
    setSavedRecipes(savedRecipes.filter(r => r.name !== recipeName));
  };

  const handleUpdateTags = (recipeName, tags) => {
    setSavedRecipes(savedRecipes.map(r => 
      r.name === recipeName ? { ...r, tags } : r
    ));
  };

  return (
    <div className="App">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="main-content">
        {activeTab === 'search' && (
          <>
            <IngredientInput setRecipes={setRecipes} />
            <SuggestedRecipes recipes={recipes} onSave={handleSaveRecipe} savedRecipes={savedRecipes} />
          </>
        )}
        {activeTab === 'library' && (
          <RecipeLibrary recipes={savedRecipes} onRemove={handleRemoveRecipe} onUpdateTags={handleUpdateTags} />
        )}
      </main>
      <Footer recipeCount={savedRecipes.length} />
    </div>
  );
}

export default App;
