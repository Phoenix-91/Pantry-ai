import { Review } from '../models/Review.js';
import { Recipe } from '../models/Recipe.js';

/**
 * GET /api/recipes/:recipeId/reviews
 */
export const getReviews = async (req, res, next) => {
  try {
    const { recipeId } = req.params;
    const reviews = await Review.find({ recipe: recipeId })
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      data: reviews
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/recipes/:recipeId/reviews
 */
export const addReview = async (req, res, next) => {
  try {
    const { recipeId } = req.params;
    const { rating, comment } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Rating (1-5) and comment are required.'
      });
    }

    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found.'
      });
    }

    const review = await Review.create({
      recipe: recipeId,
      user: req.user._id,
      userName: req.user.name,
      userAvatar: req.user.avatar || '',
      rating: Number(rating),
      comment: comment.trim()
    });

    // Recalculate average rating
    const allReviews = await Review.find({ recipe: recipeId });
    const avgRating = allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length;

    recipe.rating = parseFloat(avgRating.toFixed(1));
    recipe.reviewsCount = allReviews.length;
    await recipe.save();

    res.status(201).json({
      success: true,
      data: review,
      newRating: recipe.rating,
      newReviewsCount: recipe.reviewsCount
    });
  } catch (error) {
    next(error);
  }
};
