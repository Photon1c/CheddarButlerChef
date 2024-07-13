import React, { useState } from 'react';
import Header from './components/Header';
import IngredientInput from './components/IngredientInput';
import SuggestedRecipes from './components/SuggestedRecipes';
import Footer from './components/Footer';

function App() {
  const [recipes, setRecipes] = useState([]);

  return (
    <div className="App">
      <Header />
      <IngredientInput setRecipes={setRecipes} />
      <SuggestedRecipes recipes={recipes} />
      <Footer />
    </div>
  );
}

export default App;
