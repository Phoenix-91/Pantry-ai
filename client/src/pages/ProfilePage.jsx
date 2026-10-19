import React, { useState } from 'react';
import { 
  User as UserIcon, 
  Heart, 
  Bookmark, 
  FolderPlus, 
  Settings, 
  LogOut, 
  ChefHat, 
  Sparkles 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useFavorites } from '../context/FavoritesContext.jsx';
import { RecipeCard } from '../components/recipes/RecipeCard.jsx';

export const ProfilePage = ({ setView, onSelectRecipe, onOpenAuth }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { favorites, favoritesCount } = useFavorites();
  const [activeTab, setActiveTab] = useState('favorites');
  const [collectionName, setCollectionName] = useState('');
  const [showAddCollection, setShowAddCollection] = useState(false);
  const [customCollections, setCustomCollections] = useState([
    { name: 'Weeknight Dinners', description: 'Quick under-40 minute authentic meals', count: 3 },
    { name: 'Weekend Culinary Projects', description: 'Slow-braised stews and dim sum', count: 2 }
  ]);

  const handleCreateCollection = (e) => {
    e.preventDefault();
    if (collectionName.trim()) {
      setCustomCollections(prev => [...prev, { name: collectionName.trim(), description: 'Personal recipe collection', count: 0 }]);
      setCollectionName('');
      setShowAddCollection(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-cream-200 shadow-editorial flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 text-center sm:text-left">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
            alt="User profile"
            className="w-24 h-24 rounded-full object-cover border-4 border-cream-100 shadow-soft"
          />
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-900">
                {isAuthenticated ? user?.name : 'Guest Culinary Explorer'}
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-widest bg-olive-100 text-olive-800 px-2.5 py-0.5 rounded-full">
                {isAuthenticated ? 'Master Member' : 'Guest Mode'}
              </span>
            </div>

            <p className="text-xs text-charcoal-600 max-w-md leading-relaxed">
              {isAuthenticated ? user?.bio : 'Sign in to synchronize your saved favorites, weekly meal plans, and customized collections across all your devices.'}
            </p>

            <div className="pt-1 flex flex-wrap gap-2 justify-center sm:justify-start">
              <span className="text-xs font-semibold text-charcoal-700 bg-cream-100 px-3 py-1 rounded-full">
                ❤️ {favoritesCount} Saved Recipes
              </span>
              <span className="text-xs font-semibold text-charcoal-700 bg-cream-100 px-3 py-1 rounded-full">
                📂 {customCollections.length} Collections
              </span>
            </div>
          </div>
        </div>

        {/* Auth CTA */}
        <div className="shrink-0 flex items-center space-x-3">
          {isAuthenticated ? (
            <button
              onClick={logout}
              className="px-5 py-2.5 bg-cream-100 hover:bg-red-50 text-terracotta-700 text-xs font-semibold rounded-2xl border border-cream-300 transition-colors flex items-center space-x-1.5"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-6 py-2.5 bg-olive-700 hover:bg-olive-800 text-cream-50 text-xs font-semibold rounded-2xl shadow-soft transition-all"
            >
              Sign In or Register
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-3 border-b border-cream-200 pb-2">
        <button
          onClick={() => setActiveTab('favorites')}
          className={`flex items-center space-x-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
            activeTab === 'favorites' ? 'bg-olive-700 text-cream-50 shadow-soft' : 'text-charcoal-700 hover:bg-cream-100'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Saved Favorites ({favoritesCount})</span>
        </button>

        <button
          onClick={() => setActiveTab('collections')}
          className={`flex items-center space-x-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
            activeTab === 'collections' ? 'bg-olive-700 text-cream-50 shadow-soft' : 'text-charcoal-700 hover:bg-cream-100'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>My Collections ({customCollections.length})</span>
        </button>
      </div>

      {/* Favorites Gallery */}
      {activeTab === 'favorites' && (
        <div className="space-y-6">
          {favorites.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-cream-200 p-8 space-y-4 shadow-soft max-w-md mx-auto">
              <div className="w-14 h-14 mx-auto rounded-full bg-cream-100 flex items-center justify-center text-charcoal-400">
                <Heart className="w-7 h-7 text-terracotta-500" />
              </div>
              <h3 className="font-serif text-xl font-bold text-charcoal-900">No Favorites Saved Yet</h3>
              <p className="text-xs text-charcoal-600 leading-relaxed">
                Click the heart icon on any recipe in our catalog or AI generator to bookmark it to your personal culinary collection.
              </p>
              <button
                onClick={() => setView('explore')}
                className="px-6 py-2.5 rounded-full bg-olive-700 text-cream-50 font-semibold text-xs"
              >
                Browse Recipes
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favorites.map((recipe) => (
                <RecipeCard
                  key={recipe._id}
                  recipe={recipe}
                  onSelect={onSelectRecipe}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Collections Tab */}
      {activeTab === 'collections' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-2xl font-bold text-charcoal-900">Custom Recipe Collections</h3>
              <p className="text-xs text-charcoal-500">Group your dishes for holidays, weeknights, or entertaining.</p>
            </div>
            <button
              onClick={() => setShowAddCollection(true)}
              className="px-4 py-2 bg-olive-700 text-cream-50 rounded-xl text-xs font-semibold flex items-center space-x-1.5 shadow-soft"
            >
              <FolderPlus className="w-4 h-4" />
              <span>New Collection</span>
            </button>
          </div>

          {showAddCollection && (
            <form onSubmit={handleCreateCollection} className="p-4 bg-white rounded-2xl border border-cream-200 shadow-soft flex items-center space-x-3">
              <input
                type="text"
                required
                placeholder="Collection title (e.g. Italian Feast, Summer BBQs)..."
                value={collectionName}
                onChange={(e) => setCollectionName(e.target.value)}
                className="flex-1 px-4 py-2 bg-cream-50 border border-cream-200 rounded-xl text-xs"
              />
              <button type="submit" className="px-4 py-2 bg-olive-700 text-cream-50 text-xs font-semibold rounded-xl">
                Create
              </button>
              <button type="button" onClick={() => setShowAddCollection(false)} className="px-3 py-2 text-xs text-charcoal-500">
                Cancel
              </button>
            </form>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {customCollections.map((col, idx) => (
              <div key={idx} className="bg-white p-6 rounded-3xl border border-cream-200 shadow-soft space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-olive-700 bg-olive-50 px-2.5 py-0.5 rounded-full">
                  {col.count} recipes inside
                </span>
                <h4 className="font-serif text-lg font-bold text-charcoal-900">{col.name}</h4>
                <p className="text-xs text-charcoal-600 leading-relaxed">{col.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
