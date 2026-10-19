import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext.jsx';
import { FavoritesProvider } from './context/FavoritesContext.jsx';
import { ShoppingListProvider } from './context/ShoppingListContext.jsx';
import { Navbar } from './components/layout/Navbar.jsx';
import { Footer } from './components/layout/Footer.jsx';
import { ScrollProgress } from './components/layout/ScrollProgress.jsx';
import { AuthModal } from './components/ui/AuthModal.jsx';

// Pages
import { HomePage } from './pages/HomePage.jsx';
import { ExplorePage } from './pages/ExplorePage.jsx';
import { RecipeDetailPage } from './pages/RecipeDetailPage.jsx';
import { AIFinderPage } from './pages/AIFinderPage.jsx';
import { MealPlannerPage } from './pages/MealPlannerPage.jsx';
import { ShoppingListPage } from './pages/ShoppingListPage.jsx';
import { ProfilePage } from './pages/ProfilePage.jsx';

function MainApp() {
  const [currentView, setCurrentView] = useState('home');
  const [activeRecipeSlug, setActiveRecipeSlug] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Sync with browser URL / hash for shareable links
  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash.startsWith('/recipes/')) {
        const slug = hash.replace('/recipes/', '');
        setActiveRecipeSlug(slug);
        setCurrentView('recipe-detail');
      } else if (hash) {
        setCurrentView(hash.replace('/', '') || 'home');
      }
    };

    handlePopState();
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (view, slug = '') => {
    setCurrentView(view);
    if (slug) {
      setActiveRecipeSlug(slug);
      window.location.hash = `/recipes/${slug}`;
    } else {
      window.location.hash = `/${view === 'home' ? '' : view}`;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectRecipe = (slug) => {
    navigateTo('recipe-detail', slug);
  };

  const handleSelectCuisine = (cuisineName) => {
    setSelectedCuisine(cuisineName);
    navigateTo('explore');
  };

  const handleSearchSubmit = (query) => {
    setSearchQuery(query);
    navigateTo('explore');
  };

  return (
    <div className="min-h-screen flex flex-col bg-cream-50 text-charcoal-900 font-sans selection:bg-olive-200 selection:text-olive-900">
      
      {/* Scroll-driven narrative progress bar from skill.md */}
      <ScrollProgress />

      {/* Top Navigation */}
      <Navbar
        currentView={currentView}
        setView={navigateTo}
        onOpenAuth={() => setAuthModalOpen(true)}
        onSearchSubmit={handleSearchSubmit}
      />

      {/* Main Page Content Body */}
      <main className="flex-1">
        {currentView === 'home' && (
          <HomePage
            setView={navigateTo}
            onSelectRecipe={handleSelectRecipe}
            onSelectCuisine={handleSelectCuisine}
            setSearchQuery={handleSearchSubmit}
          />
        )}

        {currentView === 'explore' && (
          <ExplorePage
            onSelectRecipe={handleSelectRecipe}
            initialCuisine={selectedCuisine}
            initialSearch={searchQuery}
          />
        )}

        {currentView === 'recipe-detail' && (
          <RecipeDetailPage
            slug={activeRecipeSlug}
            onBack={() => navigateTo('explore')}
            onSelectRecipe={handleSelectRecipe}
          />
        )}

        {currentView === 'ai-finder' && (
          <AIFinderPage
            onSelectRecipe={handleSelectRecipe}
          />
        )}

        {currentView === 'meal-planner' && (
          <MealPlannerPage
            setView={navigateTo}
            onSelectRecipe={handleSelectRecipe}
          />
        )}

        {currentView === 'shopping-list' && (
          <ShoppingListPage
            setView={navigateTo}
          />
        )}

        {currentView === 'profile' && (
          <ProfilePage
            setView={navigateTo}
            onSelectRecipe={handleSelectRecipe}
            onOpenAuth={() => setAuthModalOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        setView={navigateTo}
        onSelectCuisine={handleSelectCuisine}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <ShoppingListProvider>
          <MainApp />
        </ShoppingListProvider>
      </FavoritesProvider>
    </AuthProvider>
  );
}
