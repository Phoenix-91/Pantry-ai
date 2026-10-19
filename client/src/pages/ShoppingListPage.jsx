import React, { useState } from 'react';
import { ShoppingCart, Check, Trash2, Plus, Copy, CheckCircle2, RotateCcw } from 'lucide-react';
import { useShoppingList } from '../context/ShoppingListContext.jsx';

export const ShoppingListPage = ({ setView }) => {
  const { 
    items, 
    itemsCount, 
    toggleCheck, 
    removeItem, 
    clearChecked, 
    clearAll,
    addCustomItem 
  } = useShoppingList();

  const [newItemName, setNewItemName] = useState('');
  const [newItemQty, setNewItemQty] = useState(1);
  const [newItemUnit, setNewItemUnit] = useState('item');
  const [newItemCategory, setNewItemCategory] = useState('Produce');
  const [copied, setCopied] = useState(false);

  const handleAdd = (e) => {
    e.preventDefault();
    if (newItemName.trim()) {
      addCustomItem(newItemName, newItemQty, newItemUnit, newItemCategory);
      setNewItemName('');
    }
  };

  const handleCopy = () => {
    const text = items
      .map(i => `${i.checked ? '[x]' : '[ ]'} ${i.quantity} ${i.unit} ${i.name} (${i.category})`)
      .join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Group items by category
  const categories = ['Produce', 'Meat & Seafood', 'Dairy & Eggs', 'Pantry & Grains', 'Spices & Seasonings', 'Bakery', 'Other'];
  const grouped = categories.reduce((acc, cat) => {
    const inCat = items.filter(i => (i.category || 'Other') === cat);
    if (inCat.length > 0) acc[cat] = inCat;
    return acc;
  }, {});

  const checkedCount = items.filter(i => i.checked).length;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-cream-200 pb-6 gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-olive-700">Grocery Assistant</span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-900 mt-1">
            Kitchen Shopping List
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-600 mt-1">
            Organized by aisle department with automatic serving scaling from your favorite recipes.
          </p>
        </div>

        {itemsCount > 0 && (
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-white border border-cream-300 rounded-xl text-xs font-semibold text-charcoal-800 hover:bg-cream-100 flex items-center space-x-1.5 transition-colors shadow-soft"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy to Clipboard'}</span>
            </button>
            <button
              onClick={clearChecked}
              disabled={checkedCount === 0}
              className="px-3.5 py-2 bg-white border border-cream-300 rounded-xl text-xs font-semibold text-charcoal-700 hover:bg-cream-100 disabled:opacity-40 transition-colors shadow-soft"
            >
              Clear Checked
            </button>
            <button
              onClick={clearAll}
              className="p-2 bg-white border border-cream-300 rounded-xl text-terracotta-600 hover:bg-terracotta-50 transition-colors shadow-soft"
              title="Clear entire list"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Add Custom Item Card */}
      <form onSubmit={handleAdd} className="bg-white p-5 rounded-3xl border border-cream-200 shadow-soft">
        <h2 className="text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-3">Add Custom Grocery Item</h2>
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          <input
            type="text"
            required
            placeholder="Item name (e.g. Greek yogurt, Fresh rosemary)..."
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            className="sm:col-span-6 px-3.5 py-2 bg-cream-50 border border-cream-200 rounded-xl text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-olive-500/20"
          />
          <input
            type="number"
            min="0.1"
            step="any"
            value={newItemQty}
            onChange={(e) => setNewItemQty(e.target.value)}
            className="sm:col-span-2 px-3 py-2 bg-cream-50 border border-cream-200 rounded-xl text-xs text-charcoal-900 focus:outline-none"
          />
          <input
            type="text"
            placeholder="Unit (g, ml, bunch)"
            value={newItemUnit}
            onChange={(e) => setNewItemUnit(e.target.value)}
            className="sm:col-span-2 px-3 py-2 bg-cream-50 border border-cream-200 rounded-xl text-xs text-charcoal-900 focus:outline-none"
          />
          <button
            type="submit"
            className="sm:col-span-2 py-2 px-4 bg-olive-700 hover:bg-olive-800 text-cream-50 text-xs font-semibold rounded-xl transition-colors shadow-soft flex items-center justify-center space-x-1"
          >
            <Plus className="w-4 h-4" />
            <span>Add Item</span>
          </button>
        </div>
      </form>

      {/* Empty State */}
      {itemsCount === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-cream-200 p-8 space-y-4 shadow-soft">
          <div className="w-16 h-16 mx-auto rounded-full bg-cream-100 flex items-center justify-center text-charcoal-400">
            <ShoppingCart className="w-8 h-8 text-olive-600" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-charcoal-900">Your Shopping List is Empty</h3>
          <p className="text-xs text-charcoal-600 max-w-sm mx-auto leading-relaxed">
            Browse our recipe catalog or open any recipe detail page and click "Add All to Shopping List" to assemble your grocery list with scaled measurements.
          </p>
          <button
            onClick={() => setView('explore')}
            className="px-6 py-2.5 rounded-full bg-olive-700 text-cream-50 font-semibold text-xs shadow-soft"
          >
            Explore Recipes
          </button>
        </div>
      ) : (
        /* Grouped Items List */
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs text-charcoal-500 px-1">
            <span>{itemsCount} total items ({checkedCount} checked off)</span>
          </div>

          {Object.entries(grouped).map(([category, catItems]) => (
            <div key={category} className="bg-white rounded-3xl border border-cream-200 shadow-soft overflow-hidden">
              <div className="bg-cream-100/70 px-6 py-3 border-b border-cream-200 flex items-center justify-between">
                <h3 className="font-serif text-base font-bold text-charcoal-900">{category}</h3>
                <span className="text-[11px] font-semibold text-charcoal-500 bg-white px-2.5 py-0.5 rounded-full border border-cream-200">
                  {catItems.length} {catItems.length === 1 ? 'item' : 'items'}
                </span>
              </div>

              <div className="divide-y divide-cream-100">
                {catItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => toggleCheck(item.id)}
                    className={`px-6 py-3.5 flex items-center justify-between hover:bg-cream-50 cursor-pointer transition-colors ${
                      item.checked ? 'bg-cream-50/50 opacity-60' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                        item.checked ? 'bg-olive-700 border-olive-700 text-white' : 'border-cream-300'
                      }`}>
                        {item.checked && <Check className="w-3.5 h-3.5" />}
                      </div>
                      <div>
                        <span className={`text-sm font-medium ${item.checked ? 'line-through text-charcoal-400' : 'text-charcoal-900'}`}>
                          {item.name}
                        </span>
                        {item.recipeTitle && (
                          <span className="text-[11px] text-charcoal-500 block">
                            from {item.recipeTitle}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <span className="font-mono font-semibold text-xs text-olive-800">
                        {item.quantity} {item.unit}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); removeItem(item.id); }}
                        className="p-1 text-charcoal-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
