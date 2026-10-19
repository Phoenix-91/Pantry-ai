import mongoose from 'mongoose';

const mealItemSchema = new mongoose.Schema({
  recipe: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe', required: true },
  mealType: { 
    type: String, 
    enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack'], 
    required: true 
  },
  servings: { type: Number, default: 2 },
  notes: { type: String, default: '' }
}, { _id: true });

const dayPlanSchema = new mongoose.Schema({
  dayOfWeek: { 
    type: String, 
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], 
    required: true 
  },
  meals: [mealItemSchema]
}, { _id: false });

const mealPlanSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  weekStartDate: { type: Date, required: true },
  days: [dayPlanSchema]
}, {
  timestamps: true
});

export const MealPlan = mongoose.model('MealPlan', mealPlanSchema);
