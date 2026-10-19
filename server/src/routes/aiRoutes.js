import express from 'express';
import { recommendRecipes, saveAiRecipe } from '../controllers/aiController.js';
import { requireAuth, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/recommend', optionalAuth, recommendRecipes);
router.post('/save-generated', requireAuth, saveAiRecipe);

export default router;
