import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  recipe: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Recipe', 
    required: true, 
    index: true 
  },
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  userName: { type: String, required: true },
  userAvatar: { type: String, default: '' },
  rating: { 
    type: Number, 
    required: true, 
    min: 1, 
    max: 5 
  },
  comment: { type: String, required: true, trim: true },
  helpfulCount: { type: Number, default: 0 }
}, {
  timestamps: true
});

export const Review = mongoose.model('Review', reviewSchema);
