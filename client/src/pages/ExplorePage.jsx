import React, { useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Search, 
  Filter, 
  SlidersHorizontal, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Sparkles,
  BookOpen
} from 'lucide-react';
import { api } from '../services/api.js';
import { RecipeCard } from '../components/recipes/RecipeCard.jsx';

gsap.registerPlugin(ScrollTrigger);

export const ExplorePage = ({ onSelectRecipe, initialCuisine = 'All', initialSearch = '' }) => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(initialSearch);
  const [cuisine, setCuisine] = useState(initialCuisine);
  const [dietary, setDietary] = useState('All');
  const [difficulty, setDifficulty] = useState('All');
  const [mealType, setMealType] = useState('All');
  const [maxTime, setMaxTime] = useState(0);
  const [sort, setSort] = useState('popularity');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, totalPages: 1 });
  const [cuisinesList, setCuisinesList] = useState([]);

  useEffect(() => {
    api.getCuisines().then(res => setCuisinesList(res.data || [])).catch(() => {});
  }, []);

  useEffect(() => {
    if (initialCuisine && initialCuisine !== 'All') {
      setCuisine(initialCuisine);
    }
    if (initialSearch) {
      setSearch(initialSearch);
    }
  }, [initialCuisine, initialSearch]);

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const res = await api.getRecipes({
        search,
        cuisine: cuisine !== 'All' ? cuisine : '',
        dietary: dietary !== 'All' ? dietary : '',
        difficulty: difficulty !== 'All' ? difficulty : '',
        mealType: mealType !== 'All' ? mealType : '',
        maxTime: maxTime > 0 ? maxTime : '',
        sort,
        page,
        limit: 12
      });

      setRecipes(res.data || []);
      setPagination(res.pagination || { page: 1, limit: 12, total: 0, totalPages: 1 });
    } catch (err) {
      console.error('Failed to fetch recipes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, [cuisine, dietary, difficulty, mealType, maxTime, sort, page]);

  // GSAP ScrollTrigger batch reveal for filtered recipes
  useEffect(() => {
    if (loading || recipes.length === 0) return;

    const mm = gsap.matchMedia();

    mm.add(
      {
        isDesktop: "(min-width: 640px)",
        reduceMotion: "(prefers-reduced-motion: reduce)"
      },
      (context) => {
        const { reduceMotion } = context.conditions;
        if (reduceMotion) {
          gsap.set(".explore-card-reveal", { autoAlpha: 1, y: 0 });
          return;
        }

        ScrollTrigger.batch(".explore-card-reveal", {
          interval: 0.08,
          batchMax: 4,
          onEnter: (batch) => gsap.fromTo(
            batch,
            { autoAlpha: 0, y: 25 },
            { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power2.out", overwrite: true }
          ),
          start: "top 90%"
        });
      }
    );

    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 120);

    return () => {
      clearTimeout(refreshTimer);
      mm.revert();
    };
  }, [loading, recipes]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchRecipes();
  };

  const handleResetFilters = () => {
    setSearch('');
    setCuisine('All');
    setDietary('All');
    setDifficulty('All');
    setMealType('All');
    setMaxTime(0);
    setSort('popularity');
    setPage(1);
  };

  const dietaryOptions = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'High-Protein', 'Keto'];
  const difficultyOptions = ['Easy', 'Medium', 'Hard'];
  const mealTypeOptions = ['Breakfast', 'Lunch', 'Dinner', 'Soup', 'Snack', 'Dessert'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Banner */}
      <div className="border-b border-cream-200 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-olive-700">Recipe Catalog</span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-900 mt-1">
            Explore 60+ Authentic Recipes
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-600 mt-1">
            Carefully curated culinary gems spanning 11 international traditions.
          </p>
        </div>

        {/* Total Results Count */}
        <div className="text-xs text-charcoal-500 font-medium">
          Showing <span className="font-bold text-charcoal-800">{recipes.length}</span> of{' '}
          <span className="font-bold text-charcoal-800">{pagination.total}</span> recipes
        </div>
      </div>

      {/* Search & Sorting Top Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
          <input
            type="text"
            placeholder="Search by recipe title or ingredient..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-cream-300 rounded-2xl text-xs sm:text-sm text-charcoal-900 placeholder:text-charcoal-400 focus:outline-none focus:ring-2 focus:ring-olive-500/20 focus:border-olive-500 shadow-soft"
          />
          <Search className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-3 pointer-events-none" />
        </form>

        {/* Sorting Dropdown */}
        <div className="flex items-center space-x-2 shrink-0 w-full sm:w-auto">
          <span className="text-xs text-charcoal-600 font-medium whitespace-nowrap">Sort By:</span>
          <select
            value={sort}
            onChange={(e) => { setSort(e.target.value); setPage(1); }}
            className="px-3 py-2.5 bg-white border border-cream-300 rounded-2xl text-xs font-medium text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-olive-500/20 shadow-soft"
          >
            <option value="popularity">Most Popular</option>
            <option value="rating">Highest Rated</option>
            <option value="newest">Newest Added</option>
            <option value="time-asc">Cooking Time (Fastest)</option>
            <option value="title">Alphabetical (A-Z)</option>
          </select>
        </div>

      </div>

      {/* Multi-faceted Filters Bar */}
      <div className="bg-white p-5 rounded-3xl border border-cream-200 shadow-soft space-y-4">
        
        {/* Cuisine Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
          <span className="text-xs font-semibold text-charcoal-700 shrink-0 mr-1">Cuisine:</span>
          <button
            onClick={() => { setCuisine('All'); setPage(1); }}
            className={`px-3 py-1 rounded-full text-xs font-medium shrink-0 transition-colors ${
              cuisine === 'All' ? 'bg-olive-700 text-cream-50' : 'bg-cream-100 text-charcoal-700 hover:bg-cream-200'
            }`}
          >
            All Cuisines
          </button>
          {cuisinesList.map((c) => (
            <button
              key={c.name}
              onClick={() => { setCuisine(c.name); setPage(1); }}
              className={`px-3 py-1 rounded-full text-xs font-medium shrink-0 transition-colors ${
                cuisine === c.name ? 'bg-olive-700 text-cream-50' : 'bg-cream-100 text-charcoal-700 hover:bg-cream-200'
              }`}
            >
              {c.name} ({c.count})
            </button>
          ))}
        </div>

        {/* Dietary & Difficulty & MealType Selectors */}
        <div className="pt-2 border-t border-cream-100 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-center">
          
          {/* Dietary */}
          <div>
            <label className="block text-[11px] font-semibold text-charcoal-600 mb-1">Dietary Preference</label>
            <select
              value={dietary}
              onChange={(e) => { setDietary(e.target.value); setPage(1); }}
              className="w-full px-3 py-1.5 bg-cream-50 border border-cream-200 rounded-xl text-xs font-medium text-charcoal-800"
            >
              <option value="All">All Dietary Styles</option>
              {dietaryOptions.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          {/* Meal Type */}
          <div>
            <label className="block text-[11px] font-semibold text-charcoal-600 mb-1">Meal Type</label>
            <select
              value={mealType}
              onChange={(e) => { setMealType(e.target.value); setPage(1); }}
              className="w-full px-3 py-1.5 bg-cream-50 border border-cream-200 rounded-xl text-xs font-medium text-charcoal-800"
            >
              <option value="All">All Meals</option>
              {mealTypeOptions.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-[11px] font-semibold text-charcoal-600 mb-1">Difficulty</label>
            <select
              value={difficulty}
              onChange={(e) => { setDifficulty(e.target.value); setPage(1); }}
              className="w-full px-3 py-1.5 bg-cream-50 border border-cream-200 rounded-xl text-xs font-medium text-charcoal-800"
            >
              <option value="All">All Difficulties</option>
              {difficultyOptions.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          {/* Max Time Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-charcoal-600 mb-1">
              Max Time: {maxTime > 0 ? `${maxTime} mins` : 'Any Time'}
            </label>
            <input
              type="range"
              min="0"
              max="120"
              step="15"
              value={maxTime}
              onChange={(e) => { setMaxTime(Number(e.target.value)); setPage(1); }}
              className="w-full accent-olive-700 h-1.5 bg-cream-200 rounded-lg cursor-pointer"
            />
          </div>

        </div>

        {/* Active Filters Reset Button */}
        {(cuisine !== 'All' || dietary !== 'All' || difficulty !== 'All' || mealType !== 'All' || maxTime > 0 || search) && (
          <div className="pt-2 flex items-center justify-between text-xs border-t border-cream-100">
            <span className="text-charcoal-500">Filtered view active</span>
            <button
              onClick={handleResetFilters}
              className="text-terracotta-600 hover:text-terracotta-800 font-semibold flex items-center space-x-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          </div>
        )}

      </div>

      {/* Recipe Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-3xl border border-cream-200 overflow-hidden shadow-soft animate-pulse">
              <div className="aspect-[4/3] bg-cream-200" />
              <div className="p-5 space-y-3">
                <div className="h-4 bg-cream-200 rounded w-1/3" />
                <div className="h-6 bg-cream-200 rounded w-3/4" />
                <div className="h-3 bg-cream-200 rounded w-full" />
                <div className="h-3 bg-cream-200 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : recipes.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-cream-200 shadow-soft p-8 space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 mx-auto rounded-full bg-cream-100 flex items-center justify-center text-charcoal-400">
            <BookOpen className="w-8 h-8 text-olive-600" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-charcoal-900">No Recipes Matched</h3>
          <p className="text-xs text-charcoal-600 leading-relaxed">
            No recipes matched your exact combination of filters. Try broadening your criteria or resetting filters to explore our full 60+ collection.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-6 py-2.5 rounded-full bg-olive-700 text-cream-50 font-semibold text-xs transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {recipes.map((recipe) => (
            <div key={recipe._id} className="explore-card-reveal h-full">
              <RecipeCard
                recipe={recipe}
                onSelect={onSelectRecipe}
              />
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {pagination.totalPages > 1 && (
        <div className="pt-6 border-t border-cream-200 flex items-center justify-center space-x-3">
          <button
            onClick={() => setPage(prev => Math.max(1, prev - 1))}
            disabled={page === 1}
            className="p-2.5 rounded-2xl bg-white border border-cream-300 text-charcoal-700 disabled:opacity-40 disabled:pointer-events-none hover:bg-cream-100 transition-colors shadow-soft"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <span className="text-xs font-semibold text-charcoal-800 px-3">
            Page {pagination.page} of {pagination.totalPages}
          </span>

          <button
            onClick={() => setPage(prev => Math.min(pagination.totalPages, prev + 1))}
            disabled={page === pagination.totalPages}
            className="p-2.5 rounded-2xl bg-white border border-cream-300 text-charcoal-700 disabled:opacity-40 disabled:pointer-events-none hover:bg-cream-100 transition-colors shadow-soft"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

    </div>
  );
};
