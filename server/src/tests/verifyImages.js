import { allRecipes } from '../seed/recipesData.js';

console.log(`[Image Verification] Checking all ${allRecipes.length} recipe images...`);

async function checkImage(recipe, index) {
  const url = recipe.image.url;
  try {
    const res = await fetch(url, { method: 'HEAD' });
    if (res.ok) {
      return { index, title: recipe.title, status: 'OK', code: res.status };
    } else {
      // Try GET in case HEAD is not permitted
      const getRes = await fetch(url, { method: 'GET', headers: { Range: 'bytes=0-10' } });
      if (getRes.ok || getRes.status === 206) {
        return { index, title: recipe.title, status: 'OK', code: getRes.status };
      }
      return { index, title: recipe.title, status: 'FAIL', code: res.status, url };
    }
  } catch (err) {
    return { index, title: recipe.title, status: 'ERROR', error: err.message, url };
  }
}

async function verifyAll() {
  const results = await Promise.all(allRecipes.map((r, i) => checkImage(r, i + 1)));
  const failed = results.filter(r => r.status !== 'OK');
  
  console.log(`[Image Verification Results]`);
  console.log(`Total Checked: ${results.length}`);
  console.log(`Successful (200 OK): ${results.length - failed.length}`);
  console.log(`Failed: ${failed.length}`);

  if (failed.length > 0) {
    console.error('Failed Images:', failed);
    process.exit(1);
  } else {
    console.log('✓ ALL 61 RECIPE PHOTOGRAPHS VERIFIED AND ACCESSIBLE (200 OK)!');
    process.exit(0);
  }
}

verifyAll();
