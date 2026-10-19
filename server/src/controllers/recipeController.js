import { Recipe } from '../models/Recipe.js';

/**
 * GET /api/recipes
 * Filter, search, sort, and paginate recipes
 */
export const getRecipes = async (req, res, next) => {
  try {
    const {
      search,
      cuisine,
      mealType,
      dietary,
      difficulty,
      maxTime,
      sort = 'popularity',
      page = 1,
      limit = 12
    } = req.query;

    const query = {};

    // Text search or regex title matching
    if (search && search.trim()) {
      const trimmed = search.trim();
      query.$or = [
        { title: { $regex: trimmed, $options: 'i' } },
        { description: { $regex: trimmed, $options: 'i' } },
        { cuisine: { $regex: trimmed, $options: 'i' } },
        { 'ingredients.name': { $regex: trimmed, $options: 'i' } }
      ];
    }

    if (cuisine && cuisine !== 'All') {
      query.cuisine = new RegExp(`^${cuisine}$`, 'i');
    }

    if (mealType && mealType !== 'All') {
      query.mealType = mealType;
    }

    if (dietary && dietary !== 'All') {
      const dietArr = dietary.split(',').map(d => d.trim()).filter(Boolean);
      if (dietArr.length > 0) {
        query.dietary = { $all: dietArr };
      }
    }

    if (difficulty && difficulty !== 'All') {
      query.difficulty = difficulty;
    }

    if (maxTime && Number(maxTime) > 0) {
      query.totalTime = { $lte: Number(maxTime) };
    }

    // Sorting
    let sortOptions = {};
    if (sort === 'popularity') {
      sortOptions = { reviewsCount: -1, rating: -1 };
    } else if (sort === 'rating') {
      sortOptions = { rating: -1 };
    } else if (sort === 'newest') {
      sortOptions = { createdAt: -1 };
    } else if (sort === 'time-asc') {
      sortOptions = { totalTime: 1 };
    } else if (sort === 'time-desc') {
      sortOptions = { totalTime: -1 };
    } else if (sort === 'title') {
      sortOptions = { title: 1 };
    } else {
      sortOptions = { reviewsCount: -1 };
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;

    const [recipes, total] = await Promise.all([
      Recipe.find(query).sort(sortOptions).skip(skip).limit(limitNum).lean(),
      Recipe.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: recipes,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/recipes/cuisines
 * Returns distinct cuisines with counts and hero thumbnails
 */
export const getCuisines = async (req, res, next) => {
  try {
    const cuisinesAgg = await Recipe.aggregate([
      {
        $group: {
          _id: '$cuisine',
          count: { $sum: 1 },
          image: { $first: '$image.url' },
          country: { $first: '$country' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const formatted = cuisinesAgg.map(c => ({
      name: c._id,
      count: c.count,
      image: c.image,
      country: c.country
    }));

    res.json({ success: true, data: formatted });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/recipes/featured
 * Returns Editor's picks, seasonal recipes, and trending
 */
export const getFeaturedRecipes = async (req, res, next) => {
  try {
    const [editorPicks, seasonal, trending] = await Promise.all([
      Recipe.find({ isEditorPick: true }).limit(6).lean(),
      Recipe.find({ isSeasonal: true }).limit(6).lean(),
      Recipe.find().sort({ rating: -1, reviewsCount: -1 }).limit(6).lean()
    ]);

    res.json({
      success: true,
      data: {
        editorPicks,
        seasonal,
        trending
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/recipes/:slug
 * Dedicated shareable recipe detail page with related recipes
 */
export const getRecipeBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const recipe = await Recipe.findOne({ slug }).lean();

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: `Recipe not found for slug: ${slug}`
      });
    }

    // Fetch up to 4 related recipes based on cuisine or meal type
    const related = await Recipe.find({
      _id: { $ne: recipe._id },
      $or: [
        { cuisine: recipe.cuisine },
        { mealType: { $in: recipe.mealType } }
      ]
    }).limit(4).lean();

    res.json({
      success: true,
      data: {
        recipe,
        related
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/recipes
 * Create user submitted recipe
 */
export const createRecipe = async (req, res, next) => {
  try {
    const recipeData = req.body;

    // Generate unique slug
    let baseSlug = (recipeData.title || 'untitled-recipe')
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
    const newRecipe = await Recipe.create(recipeData);

    res.status(201).json({
      success: true,
      data: newRecipe
    });
  } catch (error) {
    next(error);
  }
};
