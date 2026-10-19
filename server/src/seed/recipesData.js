import { asianRecipes } from './recipesAsian.js';
import { westernRecipes } from './recipesWestern.js';

export const allRecipes = [...asianRecipes, ...westernRecipes];
export { asianRecipes, westernRecipes };
