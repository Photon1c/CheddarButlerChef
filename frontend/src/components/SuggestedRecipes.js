import React, { useState } from 'react';

function SuggestedRecipes({ recipes = [], onSave, savedRecipes = [] }) {
  const [hoveredRecipe, setHoveredRecipe] = useState(null);
  const isSaved = (recipeName) => savedRecipes.some(r => r.name === recipeName);

  if (recipes.length === 0) {
    return (
      <div className="suggested-recipes empty">
        <div className="empty-state">
          <span className="empty-icon">🍽️</span>
          <p>Add ingredients and click "Find Recipes" to discover delicious ideas!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="suggested-recipes">
      <h2>Suggested Recipes</h2>
      <div className="recipes-grid">
        {recipes.map((recipe, index) => (
          <div 
            key={index} 
            className="recipe-card"
            onMouseEnter={() => setHoveredRecipe(index)}
            onMouseLeave={() => setHoveredRecipe(null)}
          >
            <div className="recipe-content">
              <h3 className="recipe-name">{recipe.name}</h3>
              {recipe.url && (
                <a 
                  href={recipe.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="recipe-link"
                >
                  Go to URL
                </a>
              )}
            </div>
            {hoveredRecipe === index && (recipe.ingredients || recipe.steps) && (
              <div className="recipe-hover-card">
                {recipe.ingredients && <p><strong>Ingredients:</strong> {recipe.ingredients}</p>}
                {recipe.steps && <p><strong>Steps:</strong> {recipe.steps}</p>}
              </div>
            )}
            <button 
              className={`save-btn ${isSaved(recipe.name) ? 'saved' : ''}`}
              onClick={() => !isSaved(recipe.name) && onSave(recipe)}
              disabled={isSaved(recipe.name)}
            >
              {isSaved(recipe.name) ? '✓ Saved' : '💾 Save'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SuggestedRecipes;