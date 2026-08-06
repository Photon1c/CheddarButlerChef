import React from 'react';

function Header({ activeTab, onTabChange }) {
  return (
    <header className="app-header">
      <div className="header-content">
        <div className="logo">
          <span className="logo-icon">🍳</span>
          <h1>My Chef App</h1>
        </div>
        <nav className="nav-tabs">
          <button 
            className={`nav-tab ${activeTab === 'search' ? 'active' : ''}`}
            onClick={() => onTabChange('search')}
          >
            🔍 Find Recipes
          </button>
          <button 
            className={`nav-tab ${activeTab === 'library' ? 'active' : ''}`}
            onClick={() => onTabChange('library')}
          >
            📚 My Library
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Header;