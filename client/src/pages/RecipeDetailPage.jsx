import React, { useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Clock, 
  Users, 
  Star, 
  Heart, 
  Share2, 
  Printer, 
  ChefHat, 
  Flame, 
  AlertCircle, 
  Check, 
  ShoppingCart, 
  Sparkles, 
  ArrowLeft,
  Minus,
  Plus,
  Copy,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { api } from '../services/api.js';
import { useFavorites } from '../context/FavoritesContext.jsx';
import { useShoppingList } from '../context/ShoppingListContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { CookingModeModal } from '../components/recipes/CookingModeModal.jsx';
import { RecipeCard } from '../components/recipes/RecipeCard.jsx';

gsap.registerPlugin(ScrollTrigger);

export const RecipeDetailPage = ({ slug, onBack, onSelectRecipe }) => {
  const [recipe, setRecipe] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Dynamic Serving Scaler state
  const [servings, setServings] = useState(4);
  const [baseServings, setBaseServings] = useState(4);

  // Completed steps checklist
  const [checkedSteps, setCheckedSteps] = useState(new Set());

  // Interactive UI states
  const [cookingModeOpen, setCookingModeOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [shoppingAddedNotice, setShoppingAddedNotice] = useState(false);

  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [userRating, setUserRating] = useState(5);
  const [userComment, setUserComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const { isFavorite, toggleFavorite } = useFavorites();
  const { addItemsFromRecipe } = useShoppingList();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const loadRecipe = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.getRecipeBySlug(slug);
        const data = res.data.recipe;
        setRecipe(data);
        setRelated(res.data.related || []);
        setServings(data.servings || 4);
        setBaseServings(data.servings || 4);

        // Fetch reviews
        if (data._id) {
          api.getReviews(data._id).then(rRes => setReviews(rRes.data || [])).catch(() => {});
        }
      } catch (err) {
        setError('Recipe not found or failed to load.');
      } finally {
        setLoading(false);
      }
    };

    if (slug) loadRecipe();
  }, [slug]);

  // GSAP ScrollTrigger for Recipe Detail Page
  useEffect(() => {
    if (!recipe) return;

    const mm = gsap.matchMedia();

    mm.add(
      {
        isDesktop: "(min-width: 640px)",
        reduceMotion: "(prefers-reduced-motion: reduce)"
      },
      (context) => {
        const { reduceMotion } = context.conditions;
        if (reduceMotion) {
          gsap.set(".recipe-hero-image, .related-card-reveal", { autoAlpha: 1, y: 0 });
          return;
        }

        // 1. Recipe Hero Image Scrubbed Parallax
        gsap.to(".recipe-hero-image", {
          yPercent: 12,
          ease: "none",
          scrollTrigger: {
            trigger: ".recipe-hero-container",
            start: "top top",
            end: "bottom top",
            scrub: 1
          }
        });

        // 2. Related Recipes Batch Reveal on Scroll
        ScrollTrigger.batch(".related-card-reveal", {
          interval: 0.1,
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
  }, [recipe]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-full bg-olive-100 flex items-center justify-center animate-spin">
          <ChefHat className="w-8 h-8 text-olive-700" />
        </div>
        <p className="text-sm font-semibold text-charcoal-600">Gathering ingredients and culinary notes...</p>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-3xl font-bold text-charcoal-900">Recipe Not Found</h2>
        <p className="text-xs text-charcoal-600">{error || 'The requested recipe could not be located.'}</p>
        <button
          onClick={onBack}
          className="px-6 py-2.5 rounded-full bg-olive-700 text-cream-50 text-xs font-semibold"
        >
          Return to Explore
        </button>
      </div>
    );
  }

  const scaleFactor = servings / (baseServings || 4);

  const handleServingChange = (delta) => {
    setServings(prev => Math.max(1, Math.min(24, prev + delta)));
  };

  const toggleStep = (idx) => {
    setCheckedSteps(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const handleShareClick = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleAddAllToShopping = () => {
    const count = addItemsFromRecipe(recipe, servings);
    setShoppingAddedNotice(true);
    setTimeout(() => setShoppingAddedNotice(false), 3000);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!userComment.trim()) return;

    setSubmittingReview(true);
    try {
      const res = await api.addReview(recipe._id, {
        rating: userRating,
        comment: userComment
      });

      setReviews(prev => [res.data, ...prev]);
      setRecipe(prev => ({
        ...prev,
        rating: res.newRating,
        reviewsCount: res.newReviewsCount
      }));
      setUserComment('');
    } catch (err) {
      alert(err.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const isFav = isFavorite(recipe._id);

  return (
    <article className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Top Breadcrumb & Action Bar */}
      <div className="flex items-center justify-between no-print">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-xs font-semibold text-charcoal-600 hover:text-charcoal-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalog</span>
        </button>

        <div className="flex items-center space-x-2">
          {/* Favorite Button */}
          <button
            onClick={() => toggleFavorite(recipe)}
            className={`p-2.5 rounded-full border transition-all ${
              isFav ? 'bg-terracotta-50 border-terracotta-300 text-terracotta-600' : 'bg-white border-cream-200 text-charcoal-700 hover:bg-cream-100'
            }`}
            title="Save to Favorites"
          >
            <Heart className={`w-4 h-4 ${isFav ? 'fill-terracotta-600' : ''}`} />
          </button>

          {/* Share Button */}
          <button
            onClick={handleShareClick}
            className="p-2.5 rounded-full bg-white border border-cream-200 text-charcoal-700 hover:bg-cream-100 transition-colors relative"
            title="Copy Shareable Link"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            {copiedLink && (
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-charcoal-900 text-cream-50 text-[10px] font-semibold px-2 py-0.5 rounded shadow-soft whitespace-nowrap">
                Link Copied!
              </span>
            )}
          </button>

          {/* Print Button */}
          <button
            onClick={handlePrint}
            className="p-2.5 rounded-full bg-white border border-cream-200 text-charcoal-700 hover:bg-cream-100 transition-colors"
            title="Print Recipe Card"
          >
            <Printer className="w-4 h-4" />
          </button>

          {/* Start Cooking Mode Button */}
          <button
            onClick={() => setCookingModeOpen(true)}
            className="px-4 py-2 rounded-full bg-olive-700 hover:bg-olive-800 text-cream-50 text-xs font-semibold tracking-wide uppercase transition-colors shadow-soft flex items-center space-x-1.5"
          >
            <ChefHat className="w-4 h-4" />
            <span>Cooking Mode</span>
          </button>
        </div>
      </div>

      {/* Hero Visual Section */}
      <div className="recipe-hero-container relative rounded-3xl overflow-hidden aspect-[16/9] md:aspect-[21/9] bg-cream-200 shadow-lifted border border-cream-200">
        <img
          src={recipe.image?.url}
          alt={recipe.title}
          className="recipe-hero-image w-full h-full object-cover scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/80 via-charcoal-900/20 to-transparent" />
        
        {/* Photo Attribution Watermark */}
        <div className="absolute bottom-4 right-4 text-[10px] text-cream-200/80 bg-charcoal-900/60 backdrop-blur-md px-2.5 py-1 rounded-full">
          Photo via {recipe.image?.attribution || 'Unsplash'}
        </div>

        {/* Origin Pill on Photo */}
        <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/90 backdrop-blur-md text-charcoal-900 shadow-soft">
            {recipe.country || recipe.cuisine} Cuisine
          </span>
          {recipe.isAiGenerated && (
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-olive-700 text-cream-50 shadow-soft flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>AI Recipe Formulation</span>
            </span>
          )}
        </div>
      </div>

      {/* Recipe Header & Story */}
      <div className="space-y-4 max-w-3xl">
        <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-charcoal-900 leading-tight">
          {recipe.title}
        </h1>

        <p className="text-base sm:text-lg text-charcoal-700 font-light leading-relaxed">
          {recipe.description}
        </p>

        {/* Essential Metrics Ribbon */}
        <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-charcoal-600 border-y border-cream-200 py-4">
          <div className="flex items-center space-x-1.5">
            <Clock className="w-4 h-4 text-olive-600" />
            <span>Prep: <strong className="text-charcoal-900">{recipe.prepTime}m</strong></span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Flame className="w-4 h-4 text-terracotta-500" />
            <span>Cook: <strong className="text-charcoal-900">{recipe.cookTime}m</strong></span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Clock className="w-4 h-4 text-olive-700" />
            <span>Total: <strong className="text-charcoal-900">{recipe.totalTime}m</strong></span>
          </div>
          <div className="flex items-center space-x-1.5 text-amber-600">
            <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
            <span className="font-bold">{recipe.rating}</span>
            <span className="text-charcoal-400">({recipe.reviewsCount} reviews)</span>
          </div>
          <div className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-olive-100 text-olive-800">
            {recipe.difficulty}
          </div>
        </div>

        {/* Dietary & Allergen Alerts */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {recipe.dietary?.map(d => (
            <span key={d} className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-cream-100 text-charcoal-700 border border-cream-200">
              {d}
            </span>
          ))}
          {recipe.allergens && recipe.allergens.length > 0 && (
            <div className="flex items-center space-x-1 text-xs text-amber-800 bg-amber-50 border border-amber-200 px-3 py-0.5 rounded-full">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>Contains: {recipe.allergens.join(', ')}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Two-Column Layout: Ingredients (Left) vs Instructions (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Column: Ingredients & Servings Scaler (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-cream-200 shadow-soft space-y-6 sticky top-24">
          
          <div className="flex items-center justify-between pb-4 border-b border-cream-100">
            <div>
              <h2 className="font-serif text-xl font-bold text-charcoal-900">Ingredients</h2>
              <p className="text-[11px] text-charcoal-500">Scaled for desired yield</p>
            </div>

            {/* Dynamic Serving Size Scaler */}
            <div className="flex items-center space-x-2 bg-cream-100 border border-cream-200 rounded-full px-2 py-1">
              <button
                onClick={() => handleServingChange(-1)}
                disabled={servings <= 1}
                aria-label="Decrease servings"
                className="w-6 h-6 rounded-full bg-white text-charcoal-700 flex items-center justify-center hover:bg-cream-200 disabled:opacity-30 disabled:pointer-events-none transition-colors shadow-sm"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="text-xs font-bold text-charcoal-800 px-1 min-w-8 text-center">
                {servings} {servings === 1 ? 'serving' : 'servings'}
              </span>
              <button
                onClick={() => handleServingChange(1)}
                disabled={servings >= 24}
                aria-label="Increase servings"
                className="w-6 h-6 rounded-full bg-white text-charcoal-700 flex items-center justify-center hover:bg-cream-200 disabled:opacity-30 disabled:pointer-events-none transition-colors shadow-sm"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Scaled Ingredients List */}
          <ul className="space-y-3">
            {recipe.ingredients?.map((ing, idx) => {
              const scaledQty = Math.round((ing.quantity * scaleFactor) * 10) / 10;
              return (
                <li key={idx} className="flex items-start justify-between text-xs sm:text-sm py-1 border-b border-cream-50 last:border-none">
                  <div className="flex-1 pr-4">
                    <span className="font-medium text-charcoal-900">{ing.name}</span>
                    {ing.notes && <span className="text-charcoal-500 italic block text-xs">({ing.notes})</span>}
                  </div>
                  <div className="text-right shrink-0 font-semibold text-olive-800 font-mono">
                    {scaledQty} {ing.unit}
                  </div>
                </li>
              );
            })}
          </ul>

          {/* Add to Shopping List Button */}
          <div className="pt-2">
            <button
              onClick={handleAddAllToShopping}
              className="w-full py-2.5 px-4 rounded-xl bg-cream-100 hover:bg-cream-200 text-charcoal-800 border border-cream-300 text-xs font-semibold transition-colors flex items-center justify-center space-x-2"
            >
              <ShoppingCart className="w-4 h-4 text-olive-700" />
              <span>Add All to Shopping List</span>
            </button>
            {shoppingAddedNotice && (
              <p className="text-[11px] text-emerald-700 text-center font-medium mt-2">
                ✓ All {recipe.ingredients?.length} ingredients added to your Shopping List!
              </p>
            )}
          </div>

          {/* Nutrition Panel */}
          {recipe.nutrition && (
            <div className="pt-4 border-t border-cream-100 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-700">Nutrition per Serving</h4>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${recipe.nutrition.isVerified ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                  {recipe.nutrition.isVerified ? '✓ Verified Data' : 'Estimated Data'}
                </span>
              </div>
              <div className="grid grid-cols-5 gap-2 text-center text-xs">
                <div className="p-2 bg-cream-50 rounded-xl">
                  <p className="font-bold text-charcoal-900">{recipe.nutrition.calories}</p>
                  <p className="text-[10px] text-charcoal-500 uppercase">Cals</p>
                </div>
                <div className="p-2 bg-cream-50 rounded-xl">
                  <p className="font-bold text-charcoal-900">{recipe.nutrition.protein}g</p>
                  <p className="text-[10px] text-charcoal-500 uppercase">Protein</p>
                </div>
                <div className="p-2 bg-cream-50 rounded-xl">
                  <p className="font-bold text-charcoal-900">{recipe.nutrition.carbs}g</p>
                  <p className="text-[10px] text-charcoal-500 uppercase">Carbs</p>
                </div>
                <div className="p-2 bg-cream-50 rounded-xl">
                  <p className="font-bold text-charcoal-900">{recipe.nutrition.fat}g</p>
                  <p className="text-[10px] text-charcoal-500 uppercase">Fat</p>
                </div>
                <div className="p-2 bg-cream-50 rounded-xl">
                  <p className="font-bold text-charcoal-900">{recipe.nutrition.fiber}g</p>
                  <p className="text-[10px] text-charcoal-500 uppercase">Fiber</p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Step-by-Step Cooking Instructions (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl font-bold text-charcoal-900">
              Step-by-Step Instructions
            </h2>
            <span className="text-xs text-charcoal-500">
              {checkedSteps.size} of {recipe.instructions?.length} completed
            </span>
          </div>

          <div className="space-y-6">
            {recipe.instructions?.map((step, idx) => {
              const isChecked = checkedSteps.has(idx);
              return (
                <div
                  key={idx}
                  onClick={() => toggleStep(idx)}
                  className={`p-6 rounded-3xl border transition-all cursor-pointer ${
                    isChecked 
                      ? 'bg-cream-100/50 border-cream-200 opacity-60' 
                      : 'bg-white border-cream-200 shadow-soft hover:shadow-editorial'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <button
                      type="button"
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 border transition-colors ${
                        isChecked 
                          ? 'bg-olive-700 border-olive-700 text-cream-50' 
                          : 'border-cream-300 text-charcoal-400 hover:border-olive-600'
                      }`}
                    >
                      {isChecked ? <Check className="w-4 h-4" /> : <span className="text-xs font-bold">{step.stepNumber}</span>}
                    </button>

                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className={`font-serif text-base font-bold text-charcoal-900 ${isChecked ? 'line-through text-charcoal-500' : ''}`}>
                          {step.title}
                        </h3>

                        {/* Timing and Temperature tags */}
                        <div className="flex items-center space-x-2 text-xs">
                          {step.timerMinutes && (
                            <span className="flex items-center space-x-1 text-olive-700 bg-olive-50 px-2.5 py-0.5 rounded-full font-medium">
                              <Clock className="w-3 h-3" />
                              <span>{step.timerMinutes}m</span>
                            </span>
                          )}
                          {step.temperature && (
                            <span className="text-terracotta-700 bg-terracotta-50 px-2 py-0.5 rounded-full text-[11px] font-medium">
                              {step.temperature}
                            </span>
                          )}
                        </div>
                      </div>

                      <p className={`text-sm leading-relaxed text-charcoal-700 ${isChecked ? 'text-charcoal-500' : ''}`}>
                        {step.instruction}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Chef's Cooking Tips & Variations */}
          {(recipe.cookingTips?.length > 0 || recipe.variations?.length > 0) && (
            <div className="bg-cream-100/70 p-6 rounded-3xl border border-cream-200 space-y-4">
              <h3 className="font-serif text-lg font-bold text-charcoal-900 flex items-center space-x-2">
                <ChefHat className="w-5 h-5 text-olive-700" />
                <span>Chef's Culinary Insights & Variations</span>
              </h3>

              {recipe.cookingTips?.length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs font-bold text-charcoal-800 uppercase tracking-wider">Pro Tips</p>
                  <ul className="list-disc list-inside text-xs text-charcoal-700 space-y-1">
                    {recipe.cookingTips.map((tip, i) => (
                      <li key={i}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}

              {recipe.variations?.length > 0 && (
                <div className="space-y-1 pt-2 border-t border-cream-200">
                  <p className="text-xs font-bold text-charcoal-800 uppercase tracking-wider">Variations & Substitutions</p>
                  <ul className="list-disc list-inside text-xs text-charcoal-700 space-y-1">
                    {recipe.variations.map((v, i) => (
                      <li key={i}>{v}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Reviews & Ratings Section */}
          <div className="pt-8 border-t border-cream-200 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-2xl font-bold text-charcoal-900">Reader Reviews</h3>
                <p className="text-xs text-charcoal-500">Shared by the culinary community</p>
              </div>

              <div className="text-right">
                <div className="flex items-center space-x-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < Math.round(recipe.rating) ? 'fill-amber-400 text-amber-400' : 'text-cream-300'}`} />
                  ))}
                  <span className="font-bold text-charcoal-900 text-sm ml-1">{recipe.rating}</span>
                </div>
                <p className="text-[11px] text-charcoal-500">{recipe.reviewsCount} verified reviews</p>
              </div>
            </div>

            {/* Submit Review Box */}
            <form onSubmit={handleReviewSubmit} className="bg-white p-6 rounded-3xl border border-cream-200 shadow-soft space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-700">Leave Your Review</h4>

              {/* Star selector */}
              <div className="flex items-center space-x-2">
                <span className="text-xs text-charcoal-600 font-medium">Your Rating:</span>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setUserRating(star)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star className={`w-5 h-5 ${star <= userRating ? 'fill-amber-400 text-amber-400' : 'text-cream-300'}`} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment text */}
              <textarea
                required
                rows={3}
                placeholder="Share your experience cooking this dish, substitutions made, or tasting notes..."
                value={userComment}
                onChange={(e) => setUserComment(e.target.value)}
                className="w-full p-3 bg-cream-50 border border-cream-200 rounded-2xl text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-olive-500/20"
              />

              <button
                type="submit"
                disabled={submittingReview}
                className="px-6 py-2 rounded-full bg-olive-700 hover:bg-olive-800 text-cream-50 text-xs font-semibold transition-colors disabled:opacity-50"
              >
                {submittingReview ? 'Submitting...' : 'Post Community Review'}
              </button>
            </form>

            {/* Existing Reviews List */}
            <div className="space-y-4">
              {reviews.map((rev) => (
                <div key={rev._id} className="p-5 bg-white rounded-2xl border border-cream-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-7 h-7 rounded-full bg-olive-100 flex items-center justify-center font-bold text-xs text-olive-800">
                        {rev.userName?.charAt(0) || 'U'}
                      </div>
                      <span className="text-xs font-bold text-charcoal-900">{rev.userName}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-cream-300'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-charcoal-700 leading-relaxed">{rev.comment}</p>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>

      {/* Related Recipes Section */}
      {related.length > 0 && (
        <section className="pt-12 border-t border-cream-200 space-y-6 no-print">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-olive-700">Culinary Pairings</span>
              <h3 className="font-serif text-2xl font-bold text-charcoal-900 mt-1">You May Also Savor</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((relRecipe) => (
              <div key={relRecipe._id} className="related-card-reveal h-full">
                <RecipeCard
                  recipe={relRecipe}
                  onSelect={onSelectRecipe}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Cooking Mode Modal */}
      <CookingModeModal
        recipe={recipe}
        isOpen={cookingModeOpen}
        onClose={() => setCookingModeOpen(false)}
      />

    </article>
  );
};
