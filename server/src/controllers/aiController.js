import { matchRecipesFromDB } from '../services/recipeMatcher.js';
import { generateAIRecipes } from '../services/aiService.js';
import { Recipe } from '../models/Recipe.js';

/**
 * POST /api/ai/recommend
 * Matches pantry ingredients against MongoDB recipes first,
 * and supplements with synthesized AI recipes if requested or if DB matches are limited.
 */
export const recommendRecipes = async (req, res, next) => {
  try {
    const {
      ingredients = [],
      cuisine = '',
      dietary = [],
      maxTime = 0,
      difficulty = '',
      allergies = [],
      generateNewIfFew = true
    } = req.body;

    // Validate inputs
    const cleanIngredients = Array.isArray(ingredients)
      ? ingredients.map(i => String(i).trim()).filter(Boolean)
      : [];

    console.log(`[AI Controller] Finding recipes for ingredients: [${cleanIngredients.join(', ')}], Cuisine: ${cuisine || 'Any'}`);

    // Step 1: Match against database
    const databaseMatches = await matchRecipesFromDB({
      ingredients: cleanIngredients,
      cuisine,
      dietary,
      maxTime,
      difficulty,
      allergies
    });

    let aiGeneratedRecipes = [];

    // Step 2: If few database matches (< 2) or if user has custom ingredients, generate bespoke AI recipe
    if (generateNewIfFew && (databaseMatches.length < 2 || cleanIngredients.length > 0)) {
      try {
        aiGeneratedRecipes = await generateAIRecipes({
          ingredients: cleanIngredients,
          cuisine: cuisine && cuisine !== 'All' ? cuisine : 'International',
          dietary,
          maxTime: maxTime > 0 ? Number(maxTime) : 40,
          difficulty: difficulty && difficulty !== 'All' ? difficulty : 'Medium',
          allergies
        });
      } catch (aiErr) {
        console.warn('[AI Controller] AI generation non-critical error:', aiErr.message);
        // Continue with database matches alone rather than failing
      }
    }

    res.json({
      success: true,
      data: {
        databaseMatches,
        aiGeneratedRecipes,
        totalMatched: databaseMatches.length + aiGeneratedRecipes.length,
        criteria: {
          ingredients: cleanIngredients,
          cuisine,
          dietary,
          maxTime,
          difficulty,
          allergies
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/ai/save-generated
 * Persist an AI generated recipe to the database so it can be bookmarked or shared
 */
export const saveAiRecipe = async (req, res, next) => {
  try {
    const recipeData = req.body;
    recipeData.isAiGenerated = true;

    // Generate unique slug
    let baseSlug = (recipeData.title || 'ai-recipe')
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
    let slug = baseSlug;
    let count = 1;

    while (await Recipe.findOne({ slug })) {
      slug = `${baseSlug}-${count}`;
      count++;
    }

    recipeData.slug = slug;
    const saved = await Recipe.create(recipeData);

    res.status(201).json({
      success: true,
      data: saved,
      message: 'AI recipe saved to library successfully!'
    });
  } catch (error) {
    next(error);
  }
};
