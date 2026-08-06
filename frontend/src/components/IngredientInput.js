import React, { useState } from 'react';

function IngredientInput({ setRecipes }) {
  const [ingredients, setIngredients] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newIngredient = inputValue.trim();
      if (newIngredient && !ingredients.includes(newIngredient)) {
        setIngredients([...ingredients, newIngredient]);
        setInputValue('');
      }
    }
  };

  const removeIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    setIngredients([]);
    setInputValue('');
    setRecipes([]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (ingredients.length === 0) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/generate-recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ingredients: ingredients.join(', ') }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setRecipes(data.recipes || []);
    } catch (error) {
      console.error('Fetch error:', error.message);
      alert(`Failed to fetch recipes: ${error.message}`);
      setRecipes([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ingredient-input">
      <h2>What's in your kitchen?</h2>
      <p className="hint">Add ingredients one at a time (press Enter or comma to add)</p>
      
      <div className="input-container">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Type an ingredient..."
          className="ingredient-field"
        />
        <button type="button" onClick={clearAll} className="clear-btn" title="Clear all">
          ✕
        </button>
      </div>

      <div className="ingredients-list">
        {ingredients.map((ing, index) => (
          <span key={index} className="ingredient-chip">
            {ing}
            <button type="button" onClick={() => removeIngredient(index)}>✕</button>
          </span>
        ))}
      </div>

      <button 
        onClick={handleSubmit} 
        className={`search-btn ${isLoading ? 'loading' : ''}`}
        disabled={ingredients.length === 0 || isLoading}
      >
        {isLoading ? (
          <span className="loading-content">
            <span className="spinner"></span>
            <span>Finding recipes...</span>
          </span>
        ) : '🔍 Find Recipes'}
      </button>

      {isLoading && (
        <div className="loading-animation">
          <div className="chef-sprite"></div>
          <p>Chef is cooking up some ideas...</p>
        </div>
      )}
    </div>
  );
}

export default IngredientInput;