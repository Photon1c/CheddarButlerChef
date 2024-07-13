import React, { useState } from 'react';

function IngredientInput({ setRecipes }) {
  const [ingredients, setIngredients] = useState('');

  const handleInputChange = (e) => {
    setIngredients(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/generate-recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ingredients }),
      });
      const data = await response.json();
      console.log('Received recipes:', data.recipes);  // Log the received data
      setRecipes(data.recipes);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>Enter Ingredients:</label>
        <textarea
          value={ingredients}
          onChange={handleInputChange}
          placeholder="Enter your ingredients here..."
        />
        <button type="submit">Get Recipes</button>
      </form>
    </div>
  );
}

export default IngredientInput;
