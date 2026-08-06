import React from 'react';

function Footer({ recipeCount = 0 }) {
  return (
    <footer className="app-footer">
      <p>🍳 My Chef App — {recipeCount} recipe{recipeCount !== 1 ? 's' : ''} saved</p>
    </footer>
  );
}

export default Footer;