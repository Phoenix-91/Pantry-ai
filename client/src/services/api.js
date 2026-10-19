const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

/**
 * Helper to include Authorization header if token exists in localStorage
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem('savorcraft_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const api = {
  // Recipes
  async getRecipes(params = {}) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        searchParams.append(key, val);
      }
    });

    const res = await fetch(`${API_BASE}/recipes?${searchParams.toString()}`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error(`Failed to fetch recipes: ${res.statusText}`);
    return res.json();
  },

  async getRecipeBySlug(slug) {
    const res = await fetch(`${API_BASE}/recipes/${slug}`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error(`Recipe not found`);
    return res.json();
  },

  async getCuisines() {
    const res = await fetch(`${API_BASE}/recipes/cuisines`);
    if (!res.ok) throw new Error(`Failed to fetch cuisines`);
    return res.json();
  },

  async getFeaturedRecipes() {
    const res = await fetch(`${API_BASE}/recipes/featured`);
    if (!res.ok) throw new Error(`Failed to fetch featured recipes`);
    return res.json();
  },

  async createRecipe(recipeData) {
    const res = await fetch(`${API_BASE}/recipes`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(recipeData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to create recipe');
    }
    return res.json();
  },

  // Reviews
  async getReviews(recipeId) {
    const res = await fetch(`${API_BASE}/recipes/${recipeId}/reviews`);
    if (!res.ok) throw new Error(`Failed to fetch reviews`);
    return res.json();
  },

  async addReview(recipeId, { rating, comment }) {
    const res = await fetch(`${API_BASE}/recipes/${recipeId}/reviews`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ rating, comment })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to submit review');
    }
    return res.json();
  },

  // AI Recommendation
  async getAiRecommendations(payload) {
    const res = await fetch(`${API_BASE}/ai/recommend`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'AI recommendation failed');
    }
    return res.json();
  },

  async saveAiRecipe(recipeData) {
    const res = await fetch(`${API_BASE}/ai/save-generated`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(recipeData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to save AI recipe');
    }
    return res.json();
  },

  // Auth
  async login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Login failed');
    }
    return res.json();
  },

  async register(name, email, password, dietaryPreferences = []) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, dietaryPreferences })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Registration failed');
    }
    return res.json();
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Not authenticated');
    return res.json();
  },

  // User features
  async toggleFavorite(recipeId) {
    const res = await fetch(`${API_BASE}/users/favorites/${recipeId}`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to toggle favorite');
    return res.json();
  },

  async getFavorites() {
    const res = await fetch(`${API_BASE}/users/favorites`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch favorites');
    return res.json();
  },

  async getCollections() {
    const res = await fetch(`${API_BASE}/users/collections`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch collections');
    return res.json();
  },

  async createCollection(name, description, recipeId) {
    const res = await fetch(`${API_BASE}/users/collections`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ name, description, recipeId })
    });
    if (!res.ok) throw new Error('Failed to create collection');
    return res.json();
  },

  async getMealPlan() {
    const res = await fetch(`${API_BASE}/users/meal-plan`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch meal plan');
    return res.json();
  },

  async saveMealPlan(planData) {
    const res = await fetch(`${API_BASE}/users/meal-plan`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(planData)
    });
    if (!res.ok) throw new Error('Failed to save meal plan');
    return res.json();
  }
};
