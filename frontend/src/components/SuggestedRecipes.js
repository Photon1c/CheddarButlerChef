import React from 'react';

function SuggestedRecipes({ recipes = [] }) {
  console.log('SuggestedRecipes received recipes:', recipes);
  
  return (
    <div>
      <label>Suggested Recipes:</label>
      <div>
        {recipes.length === 0 ? (
          <p>No recipes found</p>
        ) : (
          recipes.map((recipe, index) => (
            <p key={index}>
              <a href={recipe.url} target="_blank" rel="noopener noreferrer">{recipe.name}</a>
            </p>
          ))
        )}
      </div>
    </div>
  );
}

export default SuggestedRecipes;
