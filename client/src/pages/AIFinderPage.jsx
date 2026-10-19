import React, { useState } from 'react';
import { 
  Sparkles, 
  Plus, 
  X, 
  Clock, 
  Search, 
  ChefHat, 
  AlertTriangle, 
  CheckCircle2, 
  Bookmark, 
  ArrowRight,
  Flame,
  Info
} from 'lucide-react';
import { api } from '../services/api.js';
import { RecipeCard } from '../components/recipes/RecipeCard.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useFavorites } from '../context/FavoritesContext.jsx';

export const AIFinderPage = ({ onSelectRecipe }) => {
  // Ingredients list (chips)
  const [ingredients, setIngredients] = useState(['Garlic', 'Chicken', 'Olive Oil', 'Tomatoes']);
  const [currentInput, setCurrentInput] = useState('');

  // Preference filters
  const [cuisine, setCuisine] = useState('All');
  const [dietary, setDietary] = useState([]);
  const [maxTime, setMaxTime] = useState(45);
  const [difficulty, setDifficulty] = useState('All');
  const [allergies, setAllergies] = useState([]);
  const [allergyInput, setAllergyInput] = useState('');

  // Results state
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [savedAiStatus, setSavedAiStatus] = useState({});

  const { isAuthenticated } = useAuth();
  const { toggleFavorite } = useFavorites();

  // Popular pantry staples for 1-click addition
  const popularStaples = [
    'Garlic', 'Onion', 'Tomatoes', 'Olive Oil', 'Eggs', 'Chicken', 
    'Rice', 'Butter', 'Spinach', 'Cheddar Cheese', 'Potatoes', 
    'Pasta', 'Lemon', 'Ginger', 'Soy Sauce', 'Mushrooms', 'Chickpeas'
  ];

  const handleAddIngredient = (item) => {
    const trimmed = item.trim();
    if (trimmed && !ingredients.some(i => i.toLowerCase() === trimmed.toLowerCase())) {
      setIngredients(prev => [...prev, trimmed]);
    }
    setCurrentInput('');
  };

  const handleRemoveIngredient = (itemToRemove) => {
    setIngredients(prev => prev.filter(i => i !== itemToRemove));
  };

  const handleAddAllergy = (item) => {
    const trimmed = item.trim();
    if (trimmed && !allergies.some(a => a.toLowerCase() === trimmed.toLowerCase())) {
      setAllergies(prev => [...prev, trimmed]);
    }
    setAllergyInput('');
  };

  const handleRemoveAllergy = (item) => {
    setAllergies(prev => prev.filter(a => a !== item));
  };

  const toggleDietary = (diet) => {
    setDietary(prev => prev.includes(diet) ? prev.filter(d => d !== diet) : [...prev, diet]);
  };

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (ingredients.length === 0) {
      alert('Please add at least 1 ingredient from your kitchen.');
      return;
    }

    setLoading(true);
    setResults(null);

    try {
      const res = await api.getAiRecommendations({
        ingredients,
        cuisine: cuisine !== 'All' ? cuisine : '',
        dietary,
        maxTime: Number(maxTime),
        difficulty: difficulty !== 'All' ? difficulty : '',
        allergies,
        generateNewIfFew: true
      });

      setResults(res.data);
    } catch (err) {
      console.error('AI Recommendation Error:', err);
      alert('Failed to obtain AI recommendations. Please check network connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAiRecipe = async (aiRecipe) => {
    try {
      const res = await api.saveAiRecipe(aiRecipe);
      toggleFavorite(res.data);
      setSavedAiStatus(prev => ({ ...prev, [aiRecipe.slug]: true }));
    } catch (err) {
      alert(err.message || 'Please log in to save AI recipes.');
    }
  };

  const cuisineOptions = ['All', 'Indian', 'Italian', 'Japanese', 'Chinese', 'Mexican', 'Thai', 'Korean', 'Mediterranean', 'French', 'American'];
  const dietaryOptions = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'High-Protein', 'Keto'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Editorial Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-olive-100 text-olive-800 text-xs font-semibold tracking-wider uppercase">
          <Sparkles className="w-3.5 h-3.5 text-olive-600" />
          <span>Intelligent Culinary Engine</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-charcoal-900 leading-tight">
          AI Ingredient-Based Recipe Finder
        </h1>
        <p className="text-sm sm:text-base text-charcoal-600 font-light leading-relaxed">
          Tell us what's currently in your pantry and fridge. We'll cross-reference authentic recipes from our 60+ database and formulate bespoke AI creations tailored to your available items.
        </p>
      </div>

      {/* Main Interactive Form Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-cream-200 shadow-editorial space-y-8 max-w-4xl mx-auto">
        
        {/* Section 1: Pantry Ingredients (Chips) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-lg font-bold text-charcoal-900">1. What Ingredients Do You Have?</h2>
              <p className="text-xs text-charcoal-500">Add everything currently in your fridge, cupboard, or spice rack.</p>
            </div>
            <span className="text-xs font-bold text-olive-700 bg-olive-50 px-3 py-1 rounded-full border border-olive-200">
              {ingredients.length} items added
            </span>
          </div>

          {/* Interactive Input with Enter Key */}
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Type an ingredient (e.g. Bell peppers, Cumin, Basmati rice) and press Enter..."
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddIngredient(currentInput);
                  }
                }}
                className="w-full px-4 py-2.5 bg-cream-50 border border-cream-200 rounded-2xl text-xs sm:text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-olive-500/20"
              />
            </div>
            <button
              type="button"
              onClick={() => handleAddIngredient(currentInput)}
              className="px-5 py-2.5 rounded-2xl bg-olive-700 hover:bg-olive-800 text-cream-50 font-semibold text-xs tracking-wider uppercase transition-colors shrink-0 flex items-center space-x-1"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </div>

          {/* Active Ingredients Chips */}
          <div className="flex flex-wrap gap-2 min-h-12 p-3 bg-cream-50/70 border border-cream-200 rounded-2xl items-center">
            {ingredients.length === 0 ? (
              <span className="text-xs text-charcoal-400 italic">No ingredients added yet. Tap popular staples below or type above.</span>
            ) : (
              ingredients.map((ing) => (
                <span
                  key={ing}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white border border-cream-300 text-charcoal-800 shadow-sm animate-in fade-in"
                >
                  <span>{ing}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveIngredient(ing)}
                    className="p-0.5 hover:text-red-600 rounded-full transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))
            )}
          </div>

          {/* Quick-Add Popular Staples */}
          <div className="pt-2 space-y-2">
            <span className="text-[11px] font-bold text-charcoal-500 uppercase tracking-wider block">
              Quick Add Common Kitchen Staples:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {popularStaples.map((staple) => {
                const isSelected = ingredients.some(i => i.toLowerCase() === staple.toLowerCase());
                return (
                  <button
                    key={staple}
                    type="button"
                    onClick={() => isSelected ? handleRemoveIngredient(staple) : handleAddIngredient(staple)}
                    className={`px-2.5 py-1 rounded-full text-xs transition-all ${
                      isSelected
                        ? 'bg-olive-700 text-cream-50 font-semibold shadow-sm'
                        : 'bg-cream-100 hover:bg-cream-200 text-charcoal-700 font-medium'
                    }`}
                  >
                    {isSelected ? `✓ ${staple}` : `+ ${staple}`}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Section 2: Culinary Preferences */}
        <div className="pt-6 border-t border-cream-200 space-y-5">
          <h2 className="font-serif text-lg font-bold text-charcoal-900">2. Refine Your Culinary Preferences</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {/* Cuisine */}
            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1">Cuisine Style</label>
              <select
                value={cuisine}
                onChange={(e) => setCuisine(e.target.value)}
                className="w-full px-3 py-2 bg-cream-50 border border-cream-200 rounded-xl text-xs font-medium text-charcoal-900"
              >
                {cuisineOptions.map(c => <option key={c} value={c}>{c === 'All' ? 'Any World Cuisine' : c}</option>)}
              </select>
            </div>

            {/* Max Cooking Time */}
            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                Max Cooking Time: <strong className="text-olive-700">{maxTime} mins</strong>
              </label>
              <input
                type="range"
                min="15"
                max="90"
                step="15"
                value={maxTime}
                onChange={(e) => setMaxTime(Number(e.target.value))}
                className="w-full accent-olive-700 h-2 bg-cream-200 rounded-lg cursor-pointer mt-2"
              />
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1">Difficulty Level</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-3 py-2 bg-cream-50 border border-cream-200 rounded-xl text-xs font-medium text-charcoal-900"
              >
                <option value="All">Any Difficulty</option>
                <option value="Easy">Easy (Under 30 mins)</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard (Culinary Project)</option>
              </select>
            </div>
          </div>

          {/* Dietary Options Pills */}
          <div>
            <label className="block text-xs font-semibold text-charcoal-700 mb-2">Dietary Restrictions</label>
            <div className="flex flex-wrap gap-2">
              {dietaryOptions.map((diet) => {
                const active = dietary.includes(diet);
                return (
                  <button
                    key={diet}
                    type="button"
                    onClick={() => toggleDietary(diet)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      active
                        ? 'bg-olive-700 text-cream-50 shadow-soft'
                        : 'bg-cream-100 text-charcoal-700 hover:bg-cream-200'
                    }`}
                  >
                    {active ? `✓ ${diet}` : diet}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Allergy Exclusions */}
          <div>
            <label className="block text-xs font-semibold text-charcoal-700 mb-1">Allergies & Exclusions to Avoid</label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="e.g. Peanuts, Shellfish, Gluten..."
                value={allergyInput}
                onChange={(e) => setAllergyInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddAllergy(allergyInput);
                  }
                }}
                className="w-full px-4 py-2 bg-cream-50 border border-cream-200 rounded-xl text-xs text-charcoal-900"
              />
              <button
                type="button"
                onClick={() => handleAddAllergy(allergyInput)}
                className="px-4 py-2 rounded-xl bg-charcoal-800 text-cream-50 text-xs font-semibold"
              >
                Exclude
              </button>
            </div>
            {allergies.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {allergies.map(a => (
                  <span key={a} className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] bg-red-100 text-red-800 font-semibold">
                    <span>Avoid: {a}</span>
                    <button type="button" onClick={() => handleRemoveAllergy(a)} className="hover:text-red-950">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="button"
            onClick={handleSearch}
            disabled={loading || ingredients.length === 0}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-olive-700 via-olive-800 to-olive-900 hover:from-olive-800 hover:to-charcoal-900 text-cream-50 font-bold text-sm uppercase tracking-wider transition-all shadow-lifted flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center space-x-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Consulting AI Culinary Model & Database...</span>
              </span>
            ) : (
              <span className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span>Find Matching Recipes & Formulate Custom Dishes</span>
              </span>
            )}
          </button>
        </div>

      </div>

      {/* Results Section */}
      {results && (
        <div className="space-y-12 animate-in fade-in">
          
          {/* Summary Banner */}
          <div className="bg-olive-50 border border-olive-200 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-olive-800">Recommendation Report</span>
              <h3 className="font-serif text-2xl font-bold text-charcoal-900 mt-1">
                Found {results.totalMatched} Recipes for Your Ingredients
              </h3>
              <p className="text-xs text-charcoal-600 mt-1">
                Pantry staples evaluated: <strong className="text-charcoal-900">{results.criteria?.ingredients.join(', ')}</strong>
              </p>
            </div>
            <div className="text-right">
              <span className="inline-block px-3 py-1 bg-white border border-olive-300 rounded-xl text-xs font-semibold text-olive-800">
                {results.databaseMatches.length} from Catalog • {results.aiGeneratedRecipes.length} Bespoke AI
              </span>
            </div>
          </div>

          {/* 1. Database Matches (Prioritized first) */}
          {results.databaseMatches.length > 0 && (
            <div className="space-y-6">
              <div>
                <h3 className="font-serif text-2xl font-bold text-charcoal-900">
                  Catalog Recipes Matching Your Pantry
                </h3>
                <p className="text-xs text-charcoal-600">
                  Ranked by highest percentage of ingredients already in your kitchen.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.databaseMatches.map((recipe) => (
                  <div key={recipe._id} className="space-y-3">
                    <RecipeCard
                      recipe={recipe}
                      onSelect={onSelectRecipe}
                      matchBadge={{
                        percentage: recipe.matchPercentage,
                        missingCount: recipe.missingIngredients?.length || 0
                      }}
                    />

                    {/* Match Explanation & Missing List */}
                    <div className="p-3.5 bg-white rounded-2xl border border-cream-200 shadow-soft space-y-1 text-xs">
                      <p className="font-medium text-olive-800">{recipe.matchExplanation}</p>
                      {recipe.missingIngredients?.length > 0 && (
                        <p className="text-charcoal-500 text-[11px]">
                          <strong>Missing to buy:</strong> {recipe.missingIngredients.slice(0, 4).join(', ')}
                          {recipe.missingIngredients.length > 4 && ` (+${recipe.missingIngredients.length - 4} more)`}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. Bespoke AI Generated Recipes */}
          {results.aiGeneratedRecipes?.length > 0 && (
            <div className="space-y-6 pt-6 border-t border-cream-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-amber-700">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>AI-Synthesized Creations</span>
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-charcoal-900 mt-1">
                    Bespoke Recipe Crafted Just for You
                  </h3>
                </div>
              </div>

              {/* Food Safety & Allergen Notice */}
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start space-x-3 text-xs text-amber-900">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-semibold">AI Culinary Safety Notice:</strong>
                  <span>{results.aiGeneratedRecipes[0]?.foodSafetyNotice || 'Please verify internal meat temperatures (chicken 75°C / 165°F) and exercise food safety judgment.'}</span>
                </div>
              </div>

              {/* Generated Recipe Detailed Card */}
              {results.aiGeneratedRecipes.map((aiRecipe, i) => (
                <div key={i} className="bg-white rounded-3xl border border-cream-200 shadow-editorial overflow-hidden">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-10">
                    
                    {/* Left: Metadata & Ingredients */}
                    <div className="lg:col-span-5 space-y-5 border-b lg:border-b-0 lg:border-r border-cream-200 pb-6 lg:pb-0 lg:pr-8">
                      <div className="flex items-center space-x-2">
                        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-olive-700 text-cream-50">
                          {aiRecipe.cuisine}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cream-100 text-charcoal-700">
                          {aiRecipe.totalTime} mins total
                        </span>
                      </div>

                      <h4 className="font-serif text-2xl font-bold text-charcoal-900 leading-snug">
                        {aiRecipe.title}
                      </h4>

                      <p className="text-xs text-charcoal-600 leading-relaxed font-light">
                        {aiRecipe.description}
                      </p>

                      <div className="space-y-2">
                        <h5 className="text-xs font-bold uppercase tracking-wider text-charcoal-800">Ingredients</h5>
                        <ul className="space-y-1.5 text-xs text-charcoal-700">
                          {aiRecipe.ingredients.map((ing, idx) => (
                            <li key={idx} className="flex justify-between py-1 border-b border-cream-50 last:border-none">
                              <span className="font-medium">{ing.name}</span>
                              <span className="text-olive-800 font-semibold">{ing.quantity} {ing.unit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Save to Collection Button */}
                      <div className="pt-2">
                        <button
                          onClick={() => handleSaveAiRecipe(aiRecipe)}
                          disabled={savedAiStatus[aiRecipe.slug]}
                          className="w-full py-2.5 rounded-xl bg-olive-700 hover:bg-olive-800 text-cream-50 text-xs font-semibold transition-all shadow-soft flex items-center justify-center space-x-2 disabled:bg-emerald-700"
                        >
                          <Bookmark className="w-4 h-4" />
                          <span>{savedAiStatus[aiRecipe.slug] ? '✓ Saved to Your Collection' : 'Save to My Recipe Collection'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Right: Step Instructions & Tips */}
                    <div className="lg:col-span-7 space-y-6">
                      <h5 className="text-xs font-bold uppercase tracking-wider text-charcoal-800">
                        Preparation & Cooking Steps
                      </h5>

                      <div className="space-y-4">
                        {aiRecipe.instructions.map((step, idx) => (
                          <div key={idx} className="flex items-start space-x-3 text-xs leading-relaxed">
                            <span className="w-6 h-6 rounded-full bg-olive-100 text-olive-800 font-bold flex items-center justify-center shrink-0 mt-0.5">
                              {step.stepNumber}
                            </span>
                            <div>
                              <strong className="block font-semibold text-charcoal-900">{step.title}</strong>
                              <span className="text-charcoal-700">{step.instruction}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {aiRecipe.cookingTips?.length > 0 && (
                        <div className="p-4 bg-cream-50 rounded-2xl border border-cream-200 text-xs space-y-1">
                          <strong className="text-olive-800 font-semibold block">Chef's Advice:</strong>
                          <p className="text-charcoal-700">{aiRecipe.cookingTips[0]}</p>
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      )}

    </div>
  );
};
