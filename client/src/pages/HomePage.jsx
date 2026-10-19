import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Search, 
  Sparkles, 
  ArrowRight, 
  Flame, 
  Award, 
  Calendar, 
  Clock, 
  Star, 
  ChefHat,
  Compass,
  UtensilsCrossed
} from 'lucide-react';
import { api } from '../services/api.js';
import { RecipeCard } from '../components/recipes/RecipeCard.jsx';

// Register ScrollTrigger once before usage as per GSAP best practices
gsap.registerPlugin(ScrollTrigger);

export const HomePage = ({ setView, onSelectRecipe, onSelectCuisine, setSearchQuery }) => {
  const [featuredData, setFeaturedData] = useState({ editorPicks: [], seasonal: [], trending: [] });
  const [cuisines, setCuisines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroSearch, setHeroSearch] = useState('');
  const containerRef = useRef(null);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [featRes, cuisRes] = await Promise.all([
          api.getFeaturedRecipes(),
          api.getCuisines()
        ]);
        setFeaturedData(featRes.data);
        setCuisines(cuisRes.data || []);
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  // GSAP Core & ScrollTrigger integration
  useEffect(() => {
    if (loading) return;

    const mm = gsap.matchMedia();

    mm.add(
      {
        isDesktop: "(min-width: 640px)",
        reduceMotion: "(prefers-reduced-motion: reduce)"
      },
      (context) => {
        const { reduceMotion } = context.conditions;
        
        // Strict adherence to prefers-reduced-motion
        if (reduceMotion) {
          gsap.set(
            ".hero-element, .ai-pantry-banner, .cuisine-item-card, .recipe-card-reveal, .section-heading-reveal", 
            { autoAlpha: 1, y: 0 }
          );
          return;
        }

        // 1. Initial Hero Intro Animation
        gsap.from(".hero-element", {
          y: 25,
          autoAlpha: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "power2.out"
        });

        // 2. Hero Background Parallax Scrub (ease: "none" required for scrub sync)
        gsap.to(".hero-bg-img", {
          yPercent: 18,
          ease: "none",
          scrollTrigger: {
            trigger: ".hero-section",
            start: "top top",
            end: "bottom top",
            scrub: 1
          }
        });

        // 3. AI Pantry Banner Entrance
        gsap.from(".ai-pantry-banner", {
          y: 35,
          autoAlpha: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".ai-pantry-banner",
            start: "top 85%",
            toggleActions: "play none none none"
          }
        });

        // Ambient banner background image parallax
        gsap.to(".ai-pantry-banner-bg", {
          yPercent: 15,
          ease: "none",
          scrollTrigger: {
            trigger: ".ai-pantry-banner",
            start: "top bottom",
            end: "bottom top",
            scrub: 1
          }
        });

        // 4. Section Headings Batch Reveal
        ScrollTrigger.batch(".section-heading-reveal", {
          interval: 0.1,
          onEnter: (batch) => gsap.fromTo(
            batch,
            { autoAlpha: 0, y: 20 },
            { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power2.out", overwrite: true }
          ),
          start: "top 90%"
        });

        // 5. Cuisines Batch Reveal
        ScrollTrigger.batch(".cuisine-item-card", {
          interval: 0.08,
          batchMax: 6,
          onEnter: (batch) => gsap.fromTo(
            batch,
            { autoAlpha: 0, y: 25 },
            { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power2.out", overwrite: true }
          ),
          start: "top 90%"
        });

        // 6. Recipe Cards Staggered Batch Reveal
        ScrollTrigger.batch(".recipe-card-reveal", {
          interval: 0.1,
          batchMax: 3,
          onEnter: (batch) => gsap.fromTo(
            batch,
            { autoAlpha: 0, y: 35 },
            { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.12, ease: "power2.out", overwrite: true }
          ),
          start: "top 90%"
        });
      },
      containerRef
    );

    // Refresh ScrollTrigger positions after content settles in DOM
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 120);

    return () => {
      clearTimeout(refreshTimer);
      mm.revert();
    };
  }, [loading]);

  const handleHeroSearchSubmit = (e) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      if (setSearchQuery) setSearchQuery(heroSearch.trim());
      setView('explore');
    }
  };

  return (
    <div ref={containerRef} className="space-y-20 pb-20">
      
      {/* Editorial Hero Section */}
      <section className="hero-section relative min-h-[580px] lg:min-h-[640px] flex items-center justify-center bg-cream-100 overflow-hidden border-b border-cream-200">
        
        {/* Ambient Food Photography Background Overlay with ScrollTrigger Parallax */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1543353071-10c8ba85a904?auto=format&fit=crop&w=2000&q=85"
            alt="Artisanal culinary feast with fresh ingredients and olive oil"
            className="hero-bg-img w-full h-full object-cover opacity-25 filter saturate-150 scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-cream-50 via-cream-50/70 to-cream-50/40" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8 pb-16 space-y-6">
          <div className="hero-element inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-olive-100/90 border border-olive-200 text-olive-800 text-xs font-semibold tracking-wider uppercase shadow-soft">
            <Sparkles className="w-3.5 h-3.5 text-olive-600" />
            <span>The International Culinary Journal & AI Kitchen</span>
          </div>

          <h1 className="hero-element font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-charcoal-900 leading-[1.1]">
            Discover your next <br />
            <span className="italic font-normal font-display text-olive-800">favorite meal.</span>
          </h1>

          <p className="hero-element max-w-2xl mx-auto text-base sm:text-lg text-charcoal-600 font-light leading-relaxed">
            Authentic, verified recipes from 11+ world cuisines. Match what's in your pantry using our intelligent AI recipe engine or explore masterclass classics.
          </p>

          {/* Hero Search Box */}
          <form onSubmit={handleHeroSearchSubmit} className="max-w-2xl mx-auto pt-2">
            <div className="relative flex items-center shadow-editorial rounded-full overflow-hidden bg-white border border-cream-300 p-1.5 focus-within:ring-2 focus-within:ring-olive-600/30">
              <Search className="w-5 h-5 text-charcoal-400 ml-4 shrink-0" />
              <input
                type="text"
                placeholder="Search by recipe, cuisine, or ingredient (e.g., Butter Chicken, Saffron, Tacos)..."
                value={heroSearch}
                onChange={(e) => setHeroSearch(e.target.value)}
                className="w-full px-4 py-3 bg-transparent text-sm text-charcoal-900 placeholder:text-charcoal-400 focus:outline-none"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-full bg-olive-700 hover:bg-olive-800 text-cream-50 text-xs font-semibold tracking-wide uppercase transition-colors shrink-0 shadow-soft"
              >
                Search
              </button>
            </div>
          </form>

          {/* Quick Dietary Tags Under Search */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs text-charcoal-500">
            <span className="font-medium text-charcoal-700">Popular:</span>
            {['Italian', 'Indian', 'Japanese', 'Vegetarian', 'Quick (<30m)', 'Gluten-Free'].map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  if (setSearchQuery) setSearchQuery(tag);
                  setView('explore');
                }}
                className="px-3 py-1 rounded-full bg-white/70 hover:bg-white text-charcoal-700 border border-cream-200 transition-colors shadow-sm"
              >
                {tag}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* Prominent AI Pantry Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="ai-pantry-banner relative rounded-3xl overflow-hidden bg-gradient-to-r from-olive-800 via-olive-900 to-charcoal-900 text-cream-50 p-8 sm:p-12 shadow-lifted">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-20 pointer-events-none hidden md:block overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80"
              alt="Culinary ingredients"
              className="ai-pantry-banner-bg w-full h-full object-cover scale-110"
            />
          </div>

          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-olive-700/60 border border-olive-500/40 text-amber-300 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI-Powered Recipe Matcher</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
              Cook with what you already have in your kitchen.
            </h2>

            <p className="text-sm text-cream-200 leading-relaxed font-light">
              Don't know what to make tonight? Enter the ingredients in your fridge or pantry. Our AI matches authentic recipes from our 60+ catalog and suggests custom dishes complete with missing ingredients analysis.
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => setView('ai-finder')}
                className="px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-charcoal-900 font-bold text-xs uppercase tracking-wider transition-all shadow-soft flex items-center space-x-2"
              >
                <Sparkles className="w-4 h-4 text-charcoal-900" />
                <span>Launch AI Pantry Finder</span>
              </button>
              
              <button
                onClick={() => setView('explore')}
                className="px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-cream-50 font-semibold text-xs tracking-wider transition-colors border border-white/20"
              >
                Browse All 60+ Recipes
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Popular International Cuisines */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="section-heading-reveal flex items-end justify-between border-b border-cream-200 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-olive-700">Global Gastronomy</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-900 mt-1">
              Explore by Origin & Cuisine
            </h2>
          </div>
          <button
            onClick={() => setView('explore')}
            className="text-xs font-semibold text-olive-700 hover:text-olive-900 flex items-center space-x-1"
          >
            <span>View All Cuisines</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {cuisines.slice(0, 6).map((c) => (
            <div
              key={c.name}
              onClick={() => {
                if (onSelectCuisine) onSelectCuisine(c.name);
                setView('explore');
              }}
              className="cuisine-item-card group relative rounded-2xl overflow-hidden aspect-[4/5] bg-cream-200 border border-cream-300 shadow-soft cursor-pointer hover:shadow-editorial transition-all"
            >
              <img
                src={c.image}
                alt={c.name}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/90 via-charcoal-900/30 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-cream-50">
                <p className="font-serif text-base font-bold text-white group-hover:text-amber-200 transition-colors">
                  {c.name}
                </p>
                <p className="text-[11px] text-cream-200 font-sans">
                  {c.count} authentic recipes
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Editor's Picks Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="section-heading-reveal flex items-end justify-between border-b border-cream-200 pb-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-terracotta-600">
              <Award className="w-4 h-4" />
              <span>Curated Selection</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-900 mt-1">
              Editor's Essential Picks
            </h2>
          </div>
          <button
            onClick={() => setView('explore')}
            className="text-xs font-semibold text-olive-700 hover:text-olive-900 flex items-center space-x-1"
          >
            <span>See More</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredData.editorPicks.slice(0, 3).map((recipe) => (
            <div key={recipe._id} className="recipe-card-reveal h-full">
              <RecipeCard
                recipe={recipe}
                onSelect={onSelectRecipe}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Seasonal Recommendations */}
      <section className="bg-cream-100/60 py-16 border-y border-cream-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="section-heading-reveal flex items-end justify-between border-b border-cream-200 pb-4">
            <div>
              <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-olive-700">
                <Calendar className="w-4 h-4" />
                <span>In Season Now</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-900 mt-1">
                Warm & Comforting Seasonal Dishes
              </h2>
            </div>
            <button
              onClick={() => setView('explore')}
              className="text-xs font-semibold text-olive-700 hover:text-olive-900 flex items-center space-x-1"
            >
              <span>Explore Seasonal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredData.seasonal.slice(0, 3).map((recipe) => (
              <div key={recipe._id} className="recipe-card-reveal h-full">
                <RecipeCard
                  recipe={recipe}
                  onSelect={onSelectRecipe}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending & Highest Rated Recipes */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="section-heading-reveal flex items-end justify-between border-b border-cream-200 pb-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-amber-600">
              <Flame className="w-4 h-4 text-amber-600" />
              <span>Reader Favorites</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-900 mt-1">
              Trending International Masterpieces
            </h2>
          </div>
          <button
            onClick={() => setView('explore')}
            className="text-xs font-semibold text-olive-700 hover:text-olive-900 flex items-center space-x-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredData.trending.slice(0, 3).map((recipe) => (
            <div key={recipe._id} className="recipe-card-reveal h-full">
              <RecipeCard
                recipe={recipe}
                onSelect={onSelectRecipe}
              />
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
