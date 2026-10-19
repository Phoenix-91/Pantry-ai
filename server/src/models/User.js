import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  password: { type: String, required: true, minlength: 6 },
  avatar: { type: String, default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' },
  bio: { type: String, default: 'Passionate home cook exploring world cuisines.' },
  dietaryPreferences: [{ type: String }], // 'Vegetarian', 'Vegan', etc.
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }],
  collections: [{
    name: { type: String, required: true },
    description: { type: String, default: '' },
    recipes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }],
    createdAt: { type: Date, default: Date.now }
  }],
  recentlyViewed: [{
    recipe: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' },
    viewedAt: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

// Pre-save password hashing
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to verify password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model('User', userSchema);
