import { User } from '../models/User.js';
import { MealPlan } from '../models/MealPlan.js';
import { Recipe } from '../models/Recipe.js';

/**
 * POST /api/users/favorites/:recipeId
 * Toggle favorite recipe
 */
export const toggleFavorite = async (req, res, next) => {
  try {
    const { recipeId } = req.params;
    const user = await User.findById(req.user._id);

    const isFav = user.favorites.some(id => id.toString() === recipeId);

    if (isFav) {
      user.favorites = user.favorites.filter(id => id.toString() !== recipeId);
    } else {
      user.favorites.push(recipeId);
    }

    await user.save();
    const updated = await User.findById(req.user._id).populate('favorites');

    res.json({
      success: true,
      isFavorite: !isFav,
      data: updated.favorites
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/users/favorites
 */
export const getFavorites = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('favorites');
    res.json({
      success: true,
      data: user.favorites || []
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/users/collections
 */
export const getCollections = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('collections.recipes');
    res.json({
      success: true,
      data: user.collections || []
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/users/collections
 */
export const createCollection = async (req, res, next) => {
  try {
    const { name, description = '', recipeId } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Collection name is required' });
    }

    const user = await User.findById(req.user._id);
    const newCollection = {
      name,
      description,
      recipes: recipeId ? [recipeId] : []
    };

    user.collections.push(newCollection);
    await user.save();

    res.status(201).json({
      success: true,
      data: user.collections
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/users/meal-plan
 */
export const getMealPlan = async (req, res, next) => {
  try {
    const mealPlan = await MealPlan.findOne({ user: req.user._id })
      .populate('days.meals.recipe')
      .lean();

    res.json({
      success: true,
      data: mealPlan || null
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/users/meal-plan
 */
export const saveMealPlan = async (req, res, next) => {
  try {
    const { weekStartDate, days } = req.body;

    let mealPlan = await MealPlan.findOne({ user: req.user._id });

    if (mealPlan) {
      mealPlan.weekStartDate = weekStartDate || mealPlan.weekStartDate;
      mealPlan.days = days;
      await mealPlan.save();
    } else {
      mealPlan = await MealPlan.create({
        user: req.user._id,
        weekStartDate: weekStartDate || new Date(),
        days
      });
    }

    const populated = await MealPlan.findById(mealPlan._id).populate('days.meals.recipe');

    res.json({
      success: true,
      data: populated
    });
  } catch (error) {
    next(error);
  }
};
