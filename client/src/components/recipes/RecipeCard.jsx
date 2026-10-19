import React, { useState } from 'react';
import { Clock, Star, Heart, Flame, Sparkles } from 'lucide-react';
import { useFavorites } from '../../context/FavoritesContext.jsx';

export const RecipeCard = ({ recipe, onSelect, matchBadge }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [imgError, setImgError] = useState(false);

  const fav = isFavorite(recipe._id);

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    toggleFavorite(recipe);
  };

  const getDifficultyColor = (diff) => {
    switch (diff) {
      case 'Easy': return 'bg-emerald-100 text-emerald-800';
      case 'Medium': return 'bg-amber-100 text-amber-800';
      case 'Hard': return 'bg-terracotta-100 text-terracotta-800';
      default: return 'bg-cream-200 text-charcoal-700';
    }
  };

  return (
    <article
      onClick={() => onSelect(recipe.slug)}
      className="group bg-white rounded-3xl overflow-hidden border border-cream-200 shadow-soft hover:shadow-editorial transition-all duration-300 cursor-pointer flex flex-col h-full relative"
    >
      {/* Recipe Photo Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-cream-100">
        <img
          src={imgError ? 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=800&q=80' : recipe.image?.url}
          alt={recipe.title}
          loading="lazy"
          onError={() => setImgError(true)}
          className="w-full h-full object-cover recipe-image-zoom group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Favorite Bookmark Button */}
        <button
          onClick={handleFavoriteClick}
          aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-md shadow-soft hover:bg-white transition-all text-charcoal-700 z-10"
        >
          <Heart className={`w-4 h-4 transition-colors ${fav ? 'text-terracotta-600 fill-terracotta-600' : 'text-charcoal-700 hover:text-terracotta-600'}`} />
        </button>

        {/* Cuisine Badge */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide uppercase bg-charcoal-900/80 backdrop-blur-md text-cream-50 shadow-sm">
            {recipe.cuisine}
          </span>
          {recipe.isAiGenerated && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-olive-700/90 backdrop-blur-md text-cream-50 flex items-center space-x-1 shadow-sm">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>AI Recipe</span>
            </span>
          )}
        </div>

        {/* Match Percentage Overlay (If passed from AI finder) */}
        {matchBadge && (
          <div className="absolute bottom-3 left-3 right-3 z-10">
            <div className="bg-olive-900/90 backdrop-blur-md text-cream-50 px-3 py-1.5 rounded-2xl flex items-center justify-between text-xs font-semibold shadow-soft">
              <span className="flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>{matchBadge.percentage}% Pantry Match</span>
              </span>
              <span className="text-[11px] font-normal text-olive-200">
                {matchBadge.missingCount === 0 ? 'All items in kitchen!' : `${matchBadge.missingCount} missing`}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata Row */}
          <div className="flex items-center justify-between text-xs text-charcoal-500 mb-2">
            <div className="flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-olive-600" />
              <span>{recipe.totalTime || (recipe.prepTime + recipe.cookTime)} mins</span>
            </div>
            <div className="flex items-center space-x-1 text-amber-600 font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{recipe.rating || 4.8}</span>
              <span className="text-charcoal-400 font-normal">({recipe.reviewsCount || 15})</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-serif text-lg font-bold text-charcoal-900 leading-snug group-hover:text-olive-800 transition-colors line-clamp-2 mb-2">
            {recipe.title}
          </h3>

          {/* Short Description */}
          <p className="text-xs text-charcoal-600 line-clamp-2 leading-relaxed">
            {recipe.description}
          </p>
        </div>

        {/* Dietary & Difficulty Footer */}
        <div className="pt-4 mt-3 border-t border-cream-100 flex items-center justify-between">
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${getDifficultyColor(recipe.difficulty)}`}>
            {recipe.difficulty}
          </span>

          <div className="flex items-center space-x-1">
            {recipe.dietary?.slice(0, 2).map((d) => (
              <span key={d} className="text-[10px] bg-cream-100 text-charcoal-600 px-2 py-0.5 rounded-full font-medium">
                {d}
              </span>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
};
