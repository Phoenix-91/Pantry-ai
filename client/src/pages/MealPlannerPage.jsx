import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Trash2, ShoppingCart, Sparkles, ChefHat, Clock, Check } from 'lucide-react';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useShoppingList } from '../context/ShoppingListContext.jsx';

export const MealPlannerPage = ({ setView, onSelectRecipe }) => {
  const { isAuthenticated } = useAuth();
  const { addItemsFromRecipe } = useShoppingList();

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const mealTypes = ['Breakfast', 'Lunch', 'Dinner'];

  const [mealPlan, setMealPlan] = useState(() => {
    try {
      const saved = localStorage.getItem('savorcraft_meal_plan');
      return saved ? JSON.parse(saved) : daysOfWeek.map(day => ({ dayOfWeek: day, meals: [] }));
    } catch {
      return daysOfWeek.map(day => ({ dayOfWeek: day, meals: [] }));
    }
  });

  // Recipe picker modal state
  const [pickerOpen, setPickerOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState({ day: 'Monday', mealType: 'Dinner' });
  const [availableRecipes, setAvailableRecipes] = useState([]);
  const [pickerSearch, setPickerSearch] = useState('');
  const [shoppingNotice, setShoppingNotice] = useState(false);

  useEffect(() => {
    api.getRecipes({ limit: 40 }).then(res => setAvailableRecipes(res.data || [])).catch(() => {});
  }, []);

  useEffect(() => {
    localStorage.setItem('savorcraft_meal_plan', JSON.stringify(mealPlan));
  }, [mealPlan]);

  const openPicker = (day, mealType) => {
    setSelectedSlot({ day, mealType });
    setPickerOpen(true);
  };

  const handleSelectRecipeForSlot = (recipe) => {
    setMealPlan(prev => prev.map(d => {
      if (d.dayOfWeek === selectedSlot.day) {
        // filter out existing of same mealType or append
        const filtered = d.meals.filter(m => m.mealType !== selectedSlot.mealType);
        return {
          ...d,
          meals: [...filtered, { recipe, mealType: selectedSlot.mealType, servings: 2 }]
        };
      }
      return d;
    }));
    setPickerOpen(false);
  };

  const handleRemoveMeal = (day, mealType) => {
    setMealPlan(prev => prev.map(d => {
      if (d.dayOfWeek === day) {
        return {
          ...d,
          meals: d.meals.filter(m => m.mealType !== mealType)
        };
      }
      return d;
    }));
  };

  const handleAddPlanToShoppingList = () => {
    let totalAdded = 0;
    mealPlan.forEach(d => {
      d.meals.forEach(m => {
        if (m.recipe?.ingredients) {
          totalAdded += addItemsFromRecipe(m.recipe, m.servings || 2);
        }
      });
    });

    setShoppingNotice(true);
    setTimeout(() => setShoppingNotice(false), 3500);
  };

  const filteredRecipes = availableRecipes.filter(r => 
    r.title.toLowerCase().includes(pickerSearch.toLowerCase()) ||
    r.cuisine.toLowerCase().includes(pickerSearch.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-cream-200 pb-6 gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-olive-700">Culinary Organization</span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-900 mt-1">
            Weekly Meal Planner
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-600 mt-1">
            Map out breakfast, lunch, and dinner for the week ahead with automatic grocery list generation.
          </p>
        </div>

        <button
          onClick={handleAddPlanToShoppingList}
          className="px-5 py-2.5 rounded-2xl bg-olive-700 hover:bg-olive-800 text-cream-50 font-semibold text-xs tracking-wider uppercase transition-colors shadow-soft flex items-center space-x-2 shrink-0"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Export Week to Shopping List</span>
        </button>
      </div>

      {shoppingNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 font-medium flex items-center space-x-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>All ingredients from your scheduled weekly recipes have been added to your Shopping List!</span>
        </div>
      )}

      {/* 7-Day Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
        {daysOfWeek.map((day) => {
          const dayData = mealPlan.find(d => d.dayOfWeek === day) || { dayOfWeek: day, meals: [] };

          return (
            <div key={day} className="bg-white rounded-3xl border border-cream-200 shadow-soft p-4 flex flex-col justify-between space-y-4">
              
              {/* Day Heading */}
              <div className="border-b border-cream-100 pb-2">
                <h3 className="font-serif text-base font-bold text-charcoal-900">{day}</h3>
                <span className="text-[10px] text-charcoal-400 uppercase font-semibold">
                  {dayData.meals.length} {dayData.meals.length === 1 ? 'meal planned' : 'meals planned'}
                </span>
              </div>

              {/* Meal Slots (Breakfast, Lunch, Dinner) */}
              <div className="space-y-3 flex-1">
                {mealTypes.map((type) => {
                  const meal = dayData.meals.find(m => m.mealType === type);

                  return (
                    <div key={type} className="p-2.5 bg-cream-50 rounded-2xl border border-cream-200/80 space-y-1.5 relative group">
                      <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-charcoal-500">
                        <span>{type}</span>
                        {meal && (
                          <button
                            onClick={() => handleRemoveMeal(day, type)}
                            className="text-charcoal-400 hover:text-red-600 p-0.5"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>

                      {meal ? (
                        <div
                          onClick={() => onSelectRecipe(meal.recipe.slug)}
                          className="cursor-pointer hover:opacity-80 transition-opacity"
                        >
                          <img
                            src={meal.recipe.image?.url}
                            alt={meal.recipe.title}
                            className="w-full h-16 object-cover rounded-xl mb-1.5"
                          />
                          <p className="font-serif text-xs font-bold text-charcoal-900 line-clamp-1">
                            {meal.recipe.title}
                          </p>
                          <span className="text-[10px] text-olive-700 font-semibold">
                            {meal.recipe.totalTime}m • {meal.recipe.cuisine}
                          </span>
                        </div>
                      ) : (
                        <button
                          onClick={() => openPicker(day, type)}
                          className="w-full py-3 border border-dashed border-cream-300 rounded-xl text-xs text-charcoal-400 hover:text-olive-700 hover:border-olive-400 hover:bg-cream-100/60 transition-colors flex items-center justify-center space-x-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Plan {type}</span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

            </div>
          );
        })}
      </div>

      {/* Recipe Picker Modal */}
      {pickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-editorial border border-cream-200 overflow-hidden flex flex-col max-h-[80vh]">
            
            <div className="p-6 bg-cream-100/70 border-b border-cream-200 flex items-center justify-between">
              <div>
                <h3 className="font-serif text-xl font-bold text-charcoal-900">
                  Select Recipe for {selectedSlot.day} ({selectedSlot.mealType})
                </h3>
                <p className="text-xs text-charcoal-600">Choose from 60+ authenticated recipes in your library.</p>
              </div>
              <button
                onClick={() => setPickerOpen(false)}
                className="p-2 text-charcoal-400 hover:text-charcoal-800 rounded-full"
              >
                ✕
              </button>
            </div>

            {/* Modal Search Bar */}
            <div className="p-4 border-b border-cream-100">
              <input
                type="text"
                placeholder="Search recipe catalog..."
                value={pickerSearch}
                onChange={(e) => setPickerSearch(e.target.value)}
                className="w-full px-4 py-2 bg-cream-50 border border-cream-200 rounded-xl text-xs text-charcoal-900 focus:outline-none"
              />
            </div>

            {/* Recipes List */}
            <div className="p-6 overflow-y-auto divide-y divide-cream-100 flex-1">
              {filteredRecipes.map((r) => (
                <div
                  key={r._id}
                  onClick={() => handleSelectRecipeForSlot(r)}
                  className="py-3 flex items-center justify-between hover:bg-cream-50 px-2 rounded-xl cursor-pointer transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <img src={r.image?.url} alt={r.title} className="w-12 h-12 rounded-xl object-cover" />
                    <div>
                      <h4 className="font-serif text-sm font-bold text-charcoal-900">{r.title}</h4>
                      <p className="text-[11px] text-charcoal-500">{r.cuisine} • {r.totalTime} mins • {r.difficulty}</p>
                    </div>
                  </div>
                  <button className="px-3 py-1 bg-olive-700 text-cream-50 text-xs font-semibold rounded-lg">
                    Select
                  </button>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
