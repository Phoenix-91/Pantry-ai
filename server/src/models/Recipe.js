import mongoose from 'mongoose';

const ingredientSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  quantity: { type: Number, required: true },
  unit: { type: String, default: '' },
  notes: { type: String, default: '' },
  category: { 
    type: String, 
    enum: ['Produce', 'Meat & Seafood', 'Dairy & Eggs', 'Pantry & Grains', 'Spices & Seasonings', 'Baking & Sweeteners', 'Bakery', 'Other'],
    default: 'Pantry & Grains'
  }
}, { _id: false });

const instructionSchema = new mongoose.Schema({
  stepNumber: { type: Number, required: true },
  title: { type: String, default: '' },
  instruction: { type: String, required: true },
  timerMinutes: { type: Number, default: null },
  temperature: { type: String, default: '' }
}, { _id: false });

const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  description: { type: String, required: true },
  cuisine: { type: String, required: true, index: true },
  country: { type: String, required: true },
  mealType: [{ 
    type: String, 
    enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert', 'Soup', 'Salad', 'Beverage'],
    index: true 
  }],
  prepTime: { type: Number, required: true }, // in minutes
  cookTime: { type: Number, required: true }, // in minutes
  totalTime: { type: Number, required: true },
  servings: { type: Number, required: true, default: 4 },
  difficulty: { 
    type: String, 
    enum: ['Easy', 'Medium', 'Hard'], 
    default: 'Medium',
    index: true 
  },
  ingredients: [ingredientSchema],
  instructions: [instructionSchema],
  dietary: [{ type: String, index: true }], // 'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'High-Protein', 'Keto'
  allergens: [{ type: String }], // 'Dairy', 'Gluten', 'Eggs', 'Nuts', 'Soy', 'Shellfish'
  cookingTips: [{ type: String }],
  variations: [{ type: String }],
  nutrition: {
    calories: { type: Number, default: 0 },
    protein: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fat: { type: Number, default: 0 },
    fiber: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: true }
  },
  image: {
    url: { type: String, required: true },
    alt: { type: String, default: '' },
    attribution: { type: String, default: 'Unsplash' },
    creditUrl: { type: String, default: 'https://unsplash.com' }
  },
  rating: { type: Number, default: 4.8, min: 1, max: 5 },
  reviewsCount: { type: Number, default: 15 },
  isFeatured: { type: Boolean, default: false, index: true },
  isSeasonal: { type: Boolean, default: false, index: true },
  isEditorPick: { type: Boolean, default: false, index: true },
  isAiGenerated: { type: Boolean, default: false }
}, {
  timestamps: true
});

// Text index for title, description, cuisine, ingredients
recipeSchema.index({
  title: 'text',
  description: 'text',
  cuisine: 'text',
  'ingredients.name': 'text'
});

export const Recipe = mongoose.model('Recipe', recipeSchema);
