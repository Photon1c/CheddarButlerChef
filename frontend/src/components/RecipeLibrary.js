import React, { useState } from 'react';

function RecipeLibrary({ recipes = [], onRemove, onUpdateTags }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');

  const allTags = [...new Set(recipes.flatMap(r => r.tags || []))];

  const filteredRecipes = recipes
    .filter(r => r.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(r => {
      if (!tagFilter) return true;
      return (r.tags || []).includes(tagFilter);
    })
    .sort((a, b) => {
      if (sortOrder === 'newest') {
        return new Date(b.savedAt) - new Date(a.savedAt);
      }
      return a.name.localeCompare(b.name);
    });

  if (recipes.length === 0) {
    return (
      <div className="recipe-library empty">
        <div className="empty-state">
          <span className="empty-icon">📚</span>
          <p>Your recipe library is empty.</p>
          <p className="sub">Save recipes from your searches to build your collection!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="recipe-library">
      <div className="library-header">
        <h2>My Recipe Library</h2>
        <div className="library-controls">
          <input
            type="text"
            placeholder="Search recipes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select 
            value={tagFilter} 
            onChange={(e) => setTagFilter(e.target.value)}
            className="tag-filter-select"
          >
            <option value="">All Tags</option>
            {allTags.map(tag => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
          <select 
            value={sortOrder} 
            onChange={(e) => setSortOrder(e.target.value)}
            className="sort-select"
          >
            <option value="newest">Newest First</option>
            <option value="alpha">A-Z</option>
          </select>
        </div>
      </div>

      <div className="recipes-grid">
        {filteredRecipes.map((recipe, index) => (
          <RecipeCard 
            key={index} 
            recipe={recipe} 
            onRemove={onRemove}
            onUpdateTags={onUpdateTags}
          />
        ))}
      </div>

      {filteredRecipes.length === 0 && searchTerm && (
        <p className="no-results">No recipes match "{searchTerm}"</p>
      )}
    </div>
  );
}

function RecipeCard({ recipe, onRemove, onUpdateTags }) {
  const [tagInput, setTagInput] = useState('');
  const [showTagInput, setShowTagInput] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const tags = recipe.tags || [];

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      if (!tags.includes(tagInput.trim())) {
        onUpdateTags(recipe.name, [...tags, tagInput.trim()]);
      }
      setTagInput('');
      setShowTagInput(false);
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    onUpdateTags(recipe.name, tags.filter(t => t !== tagToRemove));
  };

  return (
    <div className={`recipe-card saved ${expanded ? 'expanded' : ''}`}>
      <div className="recipe-content">
        <h3 
          className="recipe-name" 
          onClick={() => setExpanded(!expanded)}
          style={{ cursor: 'pointer' }}
        >
          {recipe.name} {expanded ? '▲' : '▼'}
        </h3>
        
        <div className="tags-container">
          {tags.map((tag, i) => (
            <span key={i} className="tag-chip">
              {tag}
              <button onClick={() => handleRemoveTag(tag)}>×</button>
            </span>
          ))}
          <button 
            className="add-tag-btn"
            onClick={() => setShowTagInput(!showTagInput)}
          >
            + Tag
          </button>
        </div>

        {showTagInput && (
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
            onBlur={() => setShowTagInput(false)}
            placeholder="Add tag..."
            className="tag-input"
            autoFocus
          />
        )}

        {recipe.savedAt && (
          <span className="saved-date">
            Saved {new Date(recipe.savedAt).toLocaleDateString()}
          </span>
        )}

        {expanded && (
          <div className="recipe-details">
            {recipe.ingredients && (
              <div className="detail-section">
                <strong>Ingredients:</strong>
                <p>{recipe.ingredients}</p>
              </div>
            )}
            {recipe.steps && (
              <div className="detail-section">
                <strong>Steps:</strong>
                <p>{recipe.steps}</p>
              </div>
            )}
          </div>
        )}

        {recipe.url && (
          <a 
            href={recipe.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="recipe-link"
          >
            View Recipe →
          </a>
        )}
      </div>
      <button 
        className="remove-btn"
        onClick={() => onRemove(recipe.name)}
        title="Remove from library"
      >
        🗑️
      </button>
    </div>
  );
}

export default RecipeLibrary;