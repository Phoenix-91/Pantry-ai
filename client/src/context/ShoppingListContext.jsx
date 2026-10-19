import React, { createContext, useContext, useState, useEffect } from 'react';

const ShoppingListContext = createContext(null);

export const ShoppingListProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('savorcraft_shopping_list');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('savorcraft_shopping_list', JSON.stringify(items));
  }, [items]);

  const addItemsFromRecipe = (recipe, scaledServings) => {
    const scaleFactor = scaledServings ? scaledServings / (recipe.servings || 4) : 1;
    
    const newItems = recipe.ingredients.map(ing => ({
      id: `${recipe._id}-${ing.name}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: ing.name,
      quantity: Math.round((ing.quantity * scaleFactor) * 10) / 10,
      unit: ing.unit,
      category: ing.category || 'Pantry & Grains',
      recipeTitle: recipe.title,
      checked: false
    }));

    setItems(prev => [...newItems, ...prev]);
    return newItems.length;
  };

  const addCustomItem = (name, quantity = 1, unit = 'item', category = 'Produce') => {
    if (!name.trim()) return;
    const newItem = {
      id: `custom-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: name.trim(),
      quantity: Number(quantity) || 1,
      unit: unit.trim(),
      category,
      recipeTitle: 'Custom Entry',
      checked: false
    };
    setItems(prev => [newItem, ...prev]);
  };

  const toggleCheck = (id) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const removeItem = (id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const clearChecked = () => {
    setItems(prev => prev.filter(item => !item.checked));
  };

  const clearAll = () => {
    setItems([]);
  };

  return (
    <ShoppingListContext.Provider value={{
      items,
      itemsCount: items.length,
      addItemsFromRecipe,
      addCustomItem,
      toggleCheck,
      removeItem,
      clearChecked,
      clearAll
    }}>
      {children}
    </ShoppingListContext.Provider>
  );
};

export const useShoppingList = () => {
  const context = useContext(ShoppingListContext);
  if (!context) throw new Error('useShoppingList must be used within ShoppingListProvider');
  return context;
};
