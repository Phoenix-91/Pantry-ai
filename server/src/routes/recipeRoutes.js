import express from 'express';
import {
  getRecipes,
  getRecipeBySlug,
  getCuisines,
  getFeaturedRecipes,
  createRecipe
} from '../controllers/recipeController.js';
import { getReviews, addReview } from '../controllers/reviewController.js';
import { requireAuth, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', optionalAuth, getRecipes);
router.get('/cuisines', getCuisines);
router.get('/featured', getFeaturedRecipes);
router.get('/:slug', optionalAuth, getRecipeBySlug);
router.post('/', requireAuth, createRecipe);

// Reviews sub-routes
router.get('/:recipeId/reviews', getReviews);
router.post('/:recipeId/reviews', requireAuth, addReview);

export default router;
