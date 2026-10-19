import express from 'express';
import {
  toggleFavorite,
  getFavorites,
  getCollections,
  createCollection,
  getMealPlan,
  saveMealPlan
} from '../controllers/userController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.use(requireAuth);

router.post('/favorites/:recipeId', toggleFavorite);
router.get('/favorites', getFavorites);
router.get('/collections', getCollections);
router.post('/collections', createCollection);
router.get('/meal-plan', getMealPlan);
router.post('/meal-plan', saveMealPlan);

export default router;
