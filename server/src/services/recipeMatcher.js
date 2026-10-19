import { Recipe } from '../models/Recipe.js';

/**
 * Normalizes an ingredient name for fuzzy matching (e.g. "garlic cloves" -> "garlic")
 */
export const normalizeName = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\b(clove|cloves|teaspoon|tablespoon|tsp|tbsp|cup|cups|gram|grams|g|ml|pinch|sliced|diced|chopped|fresh|minced|finely|thinly|roughly|grated|crushed|peeled|boneless|skinon|whole)\b/g, '')
    .replace(/\s+/g, ' ')
    .trim();
};

/**
 * Checks if a user ingredient matches a recipe ingredient
 */
export const doesIngredientMatch = (userIng, recipeIngName) => {
  const normUser = normalizeName(userIng);
  const normRecipe = normalizeName(recipeIngName);

  if (!normUser || !normRecipe) return false;

  // Direct inclusion or substring matching
  if (normRecipe.includes(normUser) || normUser.includes(normRecipe)) {
    return true;
  }

  // Word token overlap (e.g. "chicken" matches "boneless chicken thighs")
  const userTokens = normUser.split(/\s+/).filter(t => t.length > 2);
  const recipeTokens = normRecipe.split(/\s+/).filter(t => t.length > 2);

  return userTokens.some(uToken => recipeTokens.some(rToken => rToken.includes(uToken) || uToken.includes(rToken)));
};

/**
 * Matches database recipes against user ingredients and preferences
 */
export const matchRecipesFromDB = async ({
  ingredients = [],
  cuisine = '',
  dietary = [],
  maxTime = 0,
  difficulty = '',
  allergies = []
}) => {
  const query = {};

  if (cuisine && cuisine !== 'All') {
    query.cuisine = new RegExp(`^${cuisine}$`, 'i');
  }

  if (dietary && dietary.length > 0) {
    query.dietary = { $all: dietary };
  }

  if (difficulty && difficulty !== 'All') {
    query.difficulty = difficulty;
  }

  if (maxTime && Number(maxTime) > 0) {
    query.totalTime = { $lte: Number(maxTime) };
  }

  // Exclude allergens if specified
  if (allergies && allergies.length > 0) {
    query.allergens = { $nin: allergies };
  }

  const candidateRecipes = await Recipe.find(query).lean();

  if (ingredients.length === 0) {
    return candidateRecipes.map(r => ({
      ...r,
      matchPercentage: 100,
      matchedIngredients: r.ingredients.map(i => i.name),
      missingIngredients: [],
      matchExplanation: 'Showing recipe matching your dietary and cuisine filters.'
    }));
  }

  const scoredRecipes = candidateRecipes.map(recipe => {
    const matched = [];
    const missing = [];

    recipe.ingredients.forEach(item => {
      const isMatched = ingredients.some(userItem => doesIngredientMatch(userItem, item.name));
      if (isMatched) {
        matched.push(item.name);
      } else {
        missing.push(item.name);
      }
    });

    const totalIngs = recipe.ingredients.length || 1;
    const matchScore = Math.round((matched.length / totalIngs) * 100);

    let explanation = '';
    if (matchScore === 100) {
      explanation = `Perfect match! You have all ${matched.length} ingredients ready to cook.`;
    } else if (matchScore >= 70) {
      explanation = `Excellent match! You have ${matched.length} of ${totalIngs} ingredients (${matchScore}%). You only need: ${missing.slice(0, 3).join(', ')}${missing.length > 3 ? '...' : ''}.`;
    } else if (matchScore >= 40) {
      explanation = `Great foundation! You have ${matched.length} key ingredients (${matchScore}%). Missing: ${missing.slice(0, 3).join(', ')}.`;
    } else {
      explanation = `Partial match (${matchScore}%). You have ${matched.length} items (${matched.slice(0, 2).join(', ')}).`;
    }

    return {
      ...recipe,
      matchPercentage: matchScore,
      matchedIngredients: matched,
      missingIngredients: missing,
      matchExplanation: explanation
    };
  });

  // Filter to only those with at least 1 matching ingredient, and sort by highest match
  return scoredRecipes
    .filter(r => r.matchedIngredients.length > 0)
    .sort((a, b) => b.matchPercentage - a.matchPercentage);
};
