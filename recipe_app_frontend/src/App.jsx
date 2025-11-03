import { useEffect, useMemo, useState, useCallback } from 'react'
import { useTizenKeys } from './hooks/useTizenKeys'
import './index.css'

/**
 * PUBLIC_INTERFACE
 * A light store implemented with React Context-less pattern.
 * We pass state down via props to keep it lightweight and explicit for a TV app.
 */
function useStore() {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  return {
    query,
    setQuery,
    selectedIndex,
    setSelectedIndex,
  };
}

/**
 * PUBLIC_INTERFACE
 * Minimal hash router.
 * Supports routes: "#/" and "#/recipe/:id"
 */
function useHashRoute() {
  const getRoute = () => {
    const hash = window.location.hash || '#/';
    const parts = hash.replace(/^#/, '').split('/').filter(Boolean);
    if (parts.length === 0) return { name: 'home', params: {} };
    if (parts[0] === 'recipe' && parts[1]) return { name: 'detail', params: { id: parts[1] } };
    return { name: 'home', params: {} };
  };

  const [route, setRoute] = useState(getRoute);

  useEffect(() => {
    const onChange = () => setRoute(getRoute());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  return route;
}

/**
 * Mock data
 */
const RECIPES = [
  {
    id: '1',
    title: 'Grilled Salmon with Lemon',
    description: 'Juicy salmon with bright lemon and herbs.',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop',
    time: '25m',
    serves: 2,
    ingredients: [
      '2 salmon fillets',
      '1 lemon (sliced)',
      '2 tbsp olive oil',
      'Salt & pepper',
      'Fresh dill'
    ],
    steps: [
      'Preheat grill to medium-high.',
      'Brush salmon with olive oil; season with salt and pepper.',
      'Grill skin-side down for 6–8 minutes.',
      'Top with lemon slices and dill; rest 2 minutes and serve.'
    ]
  },
  {
    id: '2',
    title: 'Creamy Mushroom Pasta',
    description: 'Silky sauce with garlic and parmesan.',
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=1200&auto=format&fit=crop',
    time: '30m',
    serves: 3,
    ingredients: [
      '200g pasta',
      '200g mushrooms, sliced',
      '2 cloves garlic',
      '150ml cream',
      'Parmesan, salt & pepper'
    ],
    steps: [
      'Cook pasta until al dente.',
      'Sauté mushrooms and garlic in butter until golden.',
      'Add cream and simmer; fold in pasta.',
      'Finish with parmesan and pepper.'
    ]
  },
  {
    id: '3',
    title: 'Avocado Toast Deluxe',
    description: 'Crunchy toast with creamy avocado.',
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=1200&auto=format&fit=crop',
    time: '10m',
    serves: 1,
    ingredients: ['2 slices bread', '1 ripe avocado', 'Chili flakes', 'Lemon', 'Salt'],
    steps: [
      'Toast bread.',
      'Mash avocado with lemon and salt.',
      'Spread on toast and add chili flakes.'
    ]
  },
  {
    id: '4',
    title: 'Colorful Buddha Bowl',
    description: 'Wholesome bowl with veggies and grains.',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1200&auto=format&fit=crop',
    time: '20m',
    serves: 2,
    ingredients: ['Cooked quinoa', 'Roasted veggies', 'Greens', 'Hummus', 'Seeds'],
    steps: [
      'Arrange quinoa with roasted veggies and greens.',
      'Top with hummus and seeds; drizzle olive oil.'
    ]
  },
  {
    id: '5',
    title: 'Classic Margherita Pizza',
    description: 'Tomato, mozzarella, and basil.',
    image: 'https://images.unsplash.com/photo-1548365328-9f547fb09530?q=80&w=1200&auto=format&fit=crop',
    time: '15m',
    serves: 2,
    ingredients: ['Pizza dough', 'Tomato sauce', 'Mozzarella', 'Fresh basil', 'Olive oil'],
    steps: [
      'Preheat oven to highest setting.',
      'Spread sauce, add mozzarella.',
      'Bake until crust is golden; finish with basil and oil.'
    ]
  },
  {
    id: '6',
    title: 'Berry Smoothie',
    description: 'Refreshing and vitamin-rich blend.',
    image: 'https://images.unsplash.com/photo-1526318472351-c75fcf070305?q=80&w=1200&auto=format&fit=crop',
    time: '5m',
    serves: 1,
    ingredients: ['Mixed berries', 'Banana', 'Yogurt', 'Honey'],
    steps: [
      'Blend berries, banana, and yogurt.',
      'Sweeten with honey to taste.'
    ]
  },
  {
    id: '7',
    title: 'Chicken Stir-fry',
    description: 'Quick wok-tossed chicken and veggies.',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop',
    time: '18m',
    serves: 2,
    ingredients: ['Chicken strips', 'Mixed veggies', 'Soy sauce', 'Garlic', 'Ginger'],
    steps: [
      'Sear chicken until browned.',
      'Add veggies, garlic, ginger; stir-fry.',
      'Splash soy sauce; serve hot.'
    ]
  },
  {
    id: '8',
    title: 'Chocolate Chip Cookies',
    description: 'Chewy center with crisp edges.',
    image: 'https://images.unsplash.com/photo-1542834369-f10ebf06d3cb?q=80&w=1200&auto=format&fit=crop',
    time: '20m',
    serves: 4,
    ingredients: ['Flour', 'Butter', 'Sugar', 'Egg', 'Choc chips', 'Baking soda'],
    steps: [
      'Cream butter and sugar; add egg.',
      'Fold in dry ingredients and chocolate chips.',
      'Scoop and bake until edges set.'
    ]
  }
];

/**
 * PUBLIC_INTERFACE
 * Debounce hook for search input
 */
function useDebounced(value, delay = 250) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

/**
 * PUBLIC_INTERFACE
 * HomePage: grid of recipes with search
 */
function HomePage({ recipes, query, setQuery, onOpen, selectedIndex, setSelectedIndex }) {
  const debouncedQuery = useDebounced(query, 250);

  const filtered = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    if (!q) return recipes;
    return recipes.filter(r =>
      r.title.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      r.ingredients.join(' ').toLowerCase().includes(q)
    );
  }, [debouncedQuery, recipes]);

  useEffect(() => {
    // reset selection when list changes
    setSelectedIndex(0);
  }, [debouncedQuery, setSelectedIndex]);

  // Keyboard navigation for grid
  useTizenKeys({
    onLeft: () => setSelectedIndex(i => Math.max(0, i - 1)),
    onRight: () => setSelectedIndex(i => Math.min(filtered.length - 1, i + 1)),
    onUp: () => setSelectedIndex(i => Math.max(0, i - 4)),
    onDown: () => setSelectedIndex(i => Math.min(filtered.length - 1, i + 4)),
    onEnter: () => {
      const item = filtered[selectedIndex];
      if (item) onOpen(item.id);
    }
  });

  return (
    <div className="app-shell" role="application" aria-label="Recipe Explorer">
      <header className="app-header" aria-label="Header">
        <div className="brand" aria-label="Brand">
          <span className="brand-title">Recipe Explorer</span>
          <span className="brand-subtitle">Ocean Professional</span>
          <span className="badge" aria-label="items count">
            <span className="mono">{filtered.length}</span> recipes
          </span>
        </div>
        <div className="searchbar" role="search">
          <span className="icon" aria-hidden="true">🔎</span>
          <input
            aria-label="Search recipes"
            placeholder="Search by title or ingredient"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </header>

      <main className="grid" role="grid" aria-label="Recipes">
        {filtered.map((r, idx) => (
          <button
            key={r.id}
            role="gridcell"
            className="card"
            aria-label={`${r.title}. ${r.description}`}
            onClick={() => onOpen(r.id)}
            tabIndex={idx === selectedIndex ? 0 : -1}
            autoFocus={idx === selectedIndex}
            style={{ textAlign: 'left' }}
          >
            <img className="card-img" src={r.image} alt={`${r.title} image`} />
            <div className="card-body">
              <div className="card-title">{r.title}</div>
              <div className="card-desc">{r.description}</div>
              <div style={{ marginTop: 10, display: 'flex', gap: 10 }}>
                <span className="badge" aria-label="time">
                  ⏱ {r.time}
                </span>
                <span className="badge" aria-label="serves">
                  🍽 {r.serves}
                </span>
              </div>
            </div>
          </button>
        ))}
      </main>

      <footer className="app-footer small">
        <div className="text-muted">Use arrow keys to navigate, Enter to open, and Back to exit section.</div>
        <div className="text-muted">Theme: Ocean Professional</div>
      </footer>
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * Recipe detail page
 */
function RecipeDetail({ recipe, onBack }) {
  useTizenKeys({
    onBack,
    onLeft: undefined,
    onRight: undefined,
  });

  return (
    <div className="app-shell" role="application" aria-label={`${recipe.title} details`}>
      <header className="app-header">
        <button className="btn ghost" onClick={onBack} aria-label="Back to list">← Back</button>
        <div className="brand">
          <span className="brand-title">{recipe.title}</span>
          <span className="badge">⏱ {recipe.time}</span>
          <span className="badge">🍽 {recipe.serves}</span>
        </div>
      </header>

      <main className="detail-container">
        <section className="detail-media">
          <img className="detail-img" src={recipe.image} alt={`${recipe.title} main image`} />
          <div className="detail-meta small text-muted">
            <span>Modern, rounded UI with subtle shadows and gradients</span>
          </div>
        </section>

        <section className="detail-content">
          <div className="detail-header">
            <div className="detail-title">{recipe.title}</div>
            <div className="detail-subtitle">Ingredients and step-by-step instructions</div>
          </div>
          <div className="detail-sections scrollable" aria-label="Recipe sections">
            <div className="panel" aria-label="Ingredients">
              <h3>Ingredients</h3>
              <ul className="list" aria-label="Ingredients list">
                {recipe.ingredients.map((ing, i) => (
                  <li key={i}>{ing}</li>
                ))}
              </ul>
            </div>
            <div className="panel" aria-label="Instructions">
              <h3>Instructions</h3>
              <div aria-label="Step by step">
                {recipe.steps.map((s, i) => (
                  <div key={i} className="step">
                    <span className="step-index">{i + 1}</span>
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="app-footer small">
        <div className="text-muted">Press Back to return to recipes.</div>
        <div className="text-muted">Ocean Professional</div>
      </footer>
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * Root App ties together store, router, and pages
 */
function App() {
  const store = useStore();
  const route = useHashRoute();

  const openRecipe = useCallback((id) => {
    window.location.hash = `#/recipe/${id}`;
  }, []);

  const goHome = useCallback(() => {
    window.location.hash = '#/';
  }, []);

  const recipe = useMemo(
    () => RECIPES.find(r => r.id === route.params.id),
    [route]
  );

  // Global back behavior: in home do nothing, in detail go back to home
  useTizenKeys({
    onBack: () => {
      if (route.name === 'detail') goHome();
    }
  });

  return route.name === 'detail' && recipe ? (
    <RecipeDetail recipe={recipe} onBack={goHome} />
  ) : (
    <HomePage
      recipes={RECIPES}
      query={store.query}
      setQuery={store.setQuery}
      onOpen={openRecipe}
      selectedIndex={store.selectedIndex}
      setSelectedIndex={store.setSelectedIndex}
    />
  );
}

export default App
