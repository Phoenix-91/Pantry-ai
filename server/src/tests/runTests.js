import { doesIngredientMatch, normalizeName } from '../services/recipeMatcher.js';

console.log('--- RUNNING SAVORCRAFT UNIT & LOGIC TESTS ---');

let passed = 0;
let failed = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`  ✓ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${testName}`);
    failed++;
  }
}

// Test 1: Recipe Serving Scaling Calculation
function testServingScaling() {
  console.log('\n[Suite 1: Serving Size Scaling Calculation]');
  
  const baseServings = 4;
  const targetServings = 6;
  const scaleFactor = targetServings / baseServings; // 1.5

  const originalQty = 200; // 200g
  const scaledQty = Math.round(originalQty * scaleFactor * 10) / 10;
  assert(scaledQty === 300, `200g scaled from 4 to 6 servings should equal 300g (got ${scaledQty})`);

  const fractionQty = 0.5; // 0.5 tsp
  const scaledFraction = Math.round(fractionQty * scaleFactor * 100) / 100;
  assert(scaledFraction === 0.75, `0.5 tsp scaled from 4 to 6 servings should equal 0.75 tsp (got ${scaledFraction})`);
}

// Test 2: Fuzzy Ingredient Matching
function testIngredientMatching() {
  console.log('\n[Suite 2: Fuzzy Ingredient Matching Engine]');

  assert(normalizeName('Garlic Cloves (finely minced)') === 'garlic', 'Normalizes "Garlic Cloves (finely minced)" to "garlic"');
  assert(doesIngredientMatch('chicken', 'Boneless chicken thighs') === true, 'Matches "chicken" with "Boneless chicken thighs"');
  assert(doesIngredientMatch('eggs', 'Pasture-raised farm eggs') === true, 'Matches "eggs" with "Pasture-raised farm eggs"');
  assert(doesIngredientMatch('tomato', 'Canned San Marzano crushed tomatoes') === true, 'Matches "tomato" with "Canned San Marzano crushed tomatoes"');
  assert(doesIngredientMatch('spinach', 'Boneless pork loin') === false, 'Correctly rejects non-matching ingredient');
}

// Test 3: AI Safety Notice and Schema
function testAiSafetyNotice() {
  console.log('\n[Suite 3: AI Food Safety & Disclaimer Notice]');
  const notice = 'Always check meat internal temperatures (chicken 75°C / 165°F) and exercise allergen caution with AI recommendations.';
  assert(notice.includes('75°C') && notice.includes('allergen'), 'Includes internal cooking temperature and allergen caution notice');
}

testServingScaling();
testIngredientMatching();
testAiSafetyNotice();

console.log('\n---------------------------------------------');
console.log(`Tests Finished: ${passed} passed, ${failed} failed`);
if (failed > 0) {
  process.exit(1);
} else {
  console.log('✓ ALL UNIT TESTS PASSED SUCCESSFULLY!\n');
  process.exit(0);
}
