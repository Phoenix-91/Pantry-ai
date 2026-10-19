import React, { useState } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Calendar, 
  ShoppingCart, 
  Heart, 
  Search, 
  Menu, 
  X, 
  User as UserIcon, 
  LogOut,
  ChefHat
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useFavorites } from '../../context/FavoritesContext.jsx';
import { useShoppingList } from '../../context/ShoppingListContext.jsx';

export const Navbar = ({ currentView, setView, onOpenAuth, onSearchSubmit }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navSearch, setNavSearch] = useState('');
  const [userDropdown, setUserDropdown] = useState(false);

  const { user, isAuthenticated, logout } = useAuth();
  const { favoritesCount } = useFavorites();
  const { itemsCount } = useShoppingList();

  const handleSearchKey = (e) => {
    if (e.key === 'Enter' && navSearch.trim()) {
      if (onSearchSubmit) onSearchSubmit(navSearch.trim());
      setView('explore');
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { id: 'explore', label: 'Explore Recipes', icon: BookOpen },
    { id: 'ai-finder', label: 'AI Pantry Finder', icon: Sparkles, badge: 'Smart' },
    { id: 'meal-planner', label: 'Meal Planner', icon: Calendar },
    { id: 'shopping-list', label: 'Shopping List', icon: ShoppingCart, count: itemsCount }
  ];

  return (
    <header className="sticky top-0 z-40 bg-cream-50/90 backdrop-blur-md border-b border-cream-200 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand Identity */}
          <div 
            onClick={() => { setView('home'); setMobileMenuOpen(false); }}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-full bg-olive-700 flex items-center justify-center text-cream-50 shadow-soft group-hover:bg-olive-800 transition-colors">
              <ChefHat className="w-6 h-6" />
            </div>
            <div>
              <span className="font-serif text-2xl font-bold tracking-tight text-charcoal-900 flex items-center gap-1.5">
                SavorCraft
                <span className="text-xs font-sans tracking-widest uppercase bg-olive-100 text-olive-800 px-2 py-0.5 rounded-full font-semibold">
                  Editorial
                </span>
              </span>
              <p className="text-[11px] text-charcoal-500 font-sans tracking-wider uppercase">Culinary Journal & AI Kitchen</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = currentView === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setView(link.id)}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-full text-sm font-medium transition-all ${
                    isActive 
                      ? 'bg-olive-700 text-cream-50 shadow-soft' 
                      : 'text-charcoal-700 hover:text-charcoal-900 hover:bg-cream-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cream-50' : 'text-olive-600'}`} />
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-full ${isActive ? 'bg-olive-600 text-cream-100' : 'bg-terracotta-100 text-terracotta-700'}`}>
                      {link.badge}
                    </span>
                  )}
                  {link.count > 0 && (
                    <span className="ml-1 bg-olive-600 text-white text-[11px] font-bold px-1.5 py-0.2 rounded-full min-w-5 text-center">
                      {link.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Search, Favorites & User Account */}
          <div className="hidden sm:flex items-center space-x-3">
            
            {/* Quick Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search 60+ recipes..."
                value={navSearch}
                onChange={(e) => setNavSearch(e.target.value)}
                onKeyDown={handleSearchKey}
                className="w-48 xl:w-56 pl-9 pr-3 py-1.5 bg-cream-100/80 border border-cream-200 rounded-full text-xs placeholder:text-charcoal-400 focus:outline-none focus:ring-2 focus:ring-olive-500/30 focus:border-olive-500 transition-all"
              />
              <Search className="w-4 h-4 text-charcoal-400 absolute left-3 top-2 pointer-events-none" />
            </div>

            {/* Saved Favorites Icon Button */}
            <button
              onClick={() => setView('profile')}
              title="Saved Favorites"
              className="relative p-2 text-charcoal-700 hover:text-charcoal-900 hover:bg-cream-100 rounded-full transition-colors"
            >
              <Heart className="w-5 h-5 text-terracotta-600 fill-terracotta-500/20" />
              {favoritesCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-terracotta-600 text-cream-50 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* User Account / Profile Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdown(!userDropdown)}
                  className="flex items-center space-x-2 p-1 pl-2 pr-3 bg-cream-100 border border-cream-200 rounded-full hover:bg-cream-200 transition-colors"
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                    alt={user.name}
                    className="w-7 h-7 rounded-full object-cover border border-olive-500"
                  />
                  <span className="text-xs font-semibold text-charcoal-800 max-w-24 truncate">{user.name}</span>
                </button>

                {userDropdown && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-editorial border border-cream-200 py-2 z-50 animate-in fade-in zoom-in-95">
                    <div className="px-4 py-2 border-b border-cream-100">
                      <p className="text-xs font-bold text-charcoal-900 truncate">{user.name}</p>
                      <p className="text-[11px] text-charcoal-500 truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={() => { setView('profile'); setUserDropdown(false); }}
                      className="w-full text-left px-4 py-2 text-xs text-charcoal-700 hover:bg-cream-50 flex items-center space-x-2"
                    >
                      <UserIcon className="w-4 h-4 text-olive-600" />
                      <span>My Profile & Collections</span>
                    </button>
                    <button
                      onClick={() => { logout(); setUserDropdown(false); }}
                      className="w-full text-left px-4 py-2 text-xs text-terracotta-600 hover:bg-terracotta-50 flex items-center space-x-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-4 py-2 rounded-full text-xs font-semibold bg-olive-700 text-cream-50 hover:bg-olive-800 transition-all shadow-soft"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-charcoal-700 hover:text-charcoal-900 rounded-lg hover:bg-cream-100"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-cream-50 border-b border-cream-200 px-4 pt-2 pb-6 space-y-3">
          <div className="relative mb-3">
            <input
              type="text"
              placeholder="Search recipes & ingredients..."
              value={navSearch}
              onChange={(e) => setNavSearch(e.target.value)}
              onKeyDown={handleSearchKey}
              className="w-full pl-9 pr-3 py-2 bg-cream-100 border border-cream-200 rounded-full text-sm"
            />
            <Search className="w-4 h-4 text-charcoal-400 absolute left-3 top-3 pointer-events-none" />
          </div>

          <div className="grid grid-cols-1 gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <button
                  key={link.id}
                  onClick={() => { setView(link.id); setMobileMenuOpen(false); }}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium ${
                    currentView === link.id ? 'bg-olive-700 text-cream-50' : 'text-charcoal-800 hover:bg-cream-100'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-5 h-5 text-olive-600" />
                    <span>{link.label}</span>
                  </div>
                  {link.count > 0 && (
                    <span className="bg-olive-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                      {link.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-cream-200 flex items-center justify-between">
            {isAuthenticated ? (
              <div className="flex items-center justify-between w-full">
                <div 
                  onClick={() => { setView('profile'); setMobileMenuOpen(false); }}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                  <div>
                    <p className="text-xs font-bold text-charcoal-900">{user.name}</p>
                    <p className="text-[10px] text-charcoal-500">View Profile</p>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="text-xs text-terracotta-600 font-semibold p-2"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => { onOpenAuth(); setMobileMenuOpen(false); }}
                className="w-full py-2.5 rounded-xl text-sm font-semibold bg-olive-700 text-cream-50 text-center"
              >
                Sign In / Register
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
