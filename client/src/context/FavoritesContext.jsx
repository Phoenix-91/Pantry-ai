import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api.js';
import { useAuth } from './AuthContext.jsx';

const FavoritesContext = createContext(null);

export const FavoritesProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('savorcraft_guest_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync favorites when user logs in
  useEffect(() => {
    if (isAuthenticated) {
      api.getFavorites()
        .then(res => setFavorites(res.data || []))
        .catch(err => console.warn('Could not sync user favorites:', err));
    }
  }, [isAuthenticated, user]);

  // Keep guest storage updated
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('savorcraft_guest_favorites', JSON.stringify(favorites));
    }
  }, [favorites, isAuthenticated]);

  const isFavorite = (recipeId) => {
    return favorites.some(r => (r._id || r) === recipeId);
  };

  const toggleFavorite = async (recipe) => {
    const recipeId = recipe._id || recipe;
    const currentlyFav = isFavorite(recipeId);

    if (isAuthenticated) {
      try {
        const res = await api.toggleFavorite(recipeId);
        setFavorites(res.data || []);
        return !currentlyFav;
      } catch (err) {
        console.error('Failed to toggle server favorite:', err);
      }
    }

    // Guest mode fallback
    if (currentlyFav) {
      setFavorites(prev => prev.filter(r => (r._id || r) !== recipeId));
      return false;
    } else {
      setFavorites(prev => [recipe, ...prev]);
      return true;
    }
  };

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, toggleFavorite, favoritesCount: favorites.length }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error('useFavorites must be used within a FavoritesProvider');
  return context;
};
