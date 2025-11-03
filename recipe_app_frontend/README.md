# Recipe Explorer (Tizen Web Frontend)

A modern, accessible recipe browsing experience for Tizen TVs using React + Vite.

Features:
- Home screen with a responsive grid of recipes (8+ mock items) showing image, title, and short description.
- Debounced search by title and ingredients.
- Detail view with hero image, ingredients, and step-by-step instructions.
- Lightweight hash-based router (#/ and #/recipe/:id).
- Ocean Professional theme with rounded corners, subtle shadows, and smooth transitions.
- Keyboard navigation support (arrow keys, Enter, Back).
- No external APIs; uses local mock data.

Run locally (port 3000):
1. npm install
2. npm run dev
3. Open http://localhost:3000

Build for Tizen:
- npm run build:tizen
- npm run package:tizen
This generates app.wgt (packaged with config.xml) one level above dist (see script path).

Navigation:
- Arrow keys to move focus on the recipe grid (4 columns).
- Enter to open a selected recipe.
- Back to return from detail to home.

Accessibility:
- Focus-visible styles, ARIA roles/labels on grid, cards, and detail sections, alt text for images.

Theme colors:
- Primary #2563EB, Secondary/Success #F59E0B, Error #EF4444, Background #f9fafb, Surface #ffffff, Text #111827.

Project structure:
- src/App.jsx: Router, pages (HomePage, RecipeDetail), mock data, and lightweight store.
- src/index.css: Theme variables and global styles (Ocean Professional).
- src/hooks/useTizenKeys.js: Remote key handling for Tizen.

Notes:
- Viewport is locked to 1920x1080 in index.html for Tizen TV layout.
- Dev server is configured on port 3000 in vite.config.js to align with container expectations.
