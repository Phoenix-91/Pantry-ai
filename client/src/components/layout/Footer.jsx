import React, { useState } from 'react';
import { ChefHat, Heart, Mail, Sparkles, ArrowRight } from 'lucide-react';

export const Footer = ({ setView, onSelectCuisine }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  const cuisines = [
    'Indian', 'Italian', 'Japanese', 'Chinese', 'Mexican', 
    'Thai', 'Korean', 'Mediterranean', 'French', 'Middle Eastern', 'American'
  ];

  const dietary = [
    'Vegetarian', 'Vegan', 'Gluten-Free', 'High-Protein', 'Dairy-Free'
  ];

  return (
    <footer className="bg-charcoal-900 text-cream-100 pt-16 pb-12 border-t border-charcoal-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-charcoal-800">
          
          {/* Brand & Editorial Manifesto */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-olive-600 flex items-center justify-center text-cream-50">
                <ChefHat className="w-5 h-5" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-cream-50">SavorCraft</span>
            </div>
            <p className="text-charcoal-300 text-sm leading-relaxed max-w-sm">
              An editorial culinary journal celebrating authentic international recipes, master-level cooking techniques, and intelligent AI-powered pantry guidance.
            </p>
            <div className="pt-2 flex items-center space-x-2 text-xs text-olive-300">
              <Sparkles className="w-4 h-4 text-olive-400" />
              <span>AI Culinary Engine & Verified Photography</span>
            </div>
          </div>

          {/* Cuisines Directory */}
          <div>
            <h4 className="font-serif text-base font-semibold text-cream-50 mb-3 tracking-wide">World Cuisines</h4>
            <ul className="space-y-2 text-xs text-charcoal-300">
              {cuisines.slice(0, 6).map((c) => (
                <li key={c}>
                  <button
                    onClick={() => {
                      if (onSelectCuisine) onSelectCuisine(c);
                      setView('explore');
                    }}
                    className="hover:text-olive-300 transition-colors"
                  >
                    {c} Recipes
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Dietary Filters */}
          <div>
            <h4 className="font-serif text-base font-semibold text-cream-50 mb-3 tracking-wide">Dietary Styles</h4>
            <ul className="space-y-2 text-xs text-charcoal-300">
              {dietary.map((d) => (
                <li key={d}>
                  <button
                    onClick={() => {
                      setView('explore');
                    }}
                    className="hover:text-olive-300 transition-colors"
                  >
                    {d} Selections
                  </button>
                </li>
              ))}
              <li>
                <button onClick={() => setView('ai-finder')} className="text-olive-400 font-semibold hover:underline">
                  AI Pantry Matching →
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter Section */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-semibold text-cream-50 tracking-wide">The Weekly Dispatch</h4>
            <p className="text-xs text-charcoal-300 leading-relaxed">
              Curated recipes, seasonal ingredients, and culinary storytelling delivered directly to your inbox every Sunday morning.
            </p>
            {subscribed ? (
              <div className="p-3 bg-olive-900/60 border border-olive-700/50 rounded-xl text-xs text-olive-200">
                ✓ Welcome! You've joined our community of culinary enthusiasts.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-charcoal-800 border border-charcoal-700 rounded-xl text-xs text-cream-100 placeholder:text-charcoal-500 focus:outline-none focus:border-olive-500"
                  />
                  <Mail className="w-4 h-4 text-charcoal-500 absolute right-3 top-2.5 pointer-events-none" />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-olive-700 hover:bg-olive-600 text-cream-50 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center space-x-1.5"
                >
                  <span>Subscribe to Journal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Bottom Legal & Ethics Notice */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-charcoal-400 gap-4">
          <p>© {new Date().getFullYear()} SavorCraft Culinary Journal. All recipes verified with authentic photography.</p>
          <div className="flex items-center space-x-1 text-charcoal-400">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-terracotta-500 fill-terracotta-500 inline" />
            <span>for authentic gastronomy worldwide.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
