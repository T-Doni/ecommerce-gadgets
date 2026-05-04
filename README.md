# NovaTech — Gadgets E-commerce

Group project for **Web Development I**. A small, fully-static e-commerce
website for premium gadgets, built with **vanilla HTML, CSS, and JavaScript** —
no frameworks, no libraries.

## Features

- Catalogue page with 8 products (image, name, price, description, quantity)
- Cart page with live totals (subtotal, shipping, total)
  - Increase / decrease quantity per line
  - Remove a single item or clear the whole cart
  - Free shipping over $99 with a progress hint
- Cart state persisted in `localStorage` and synchronised across tabs
- Header cart badge updates live whenever the cart changes
- Responsive layout for **desktop**, **tablet**, and **mobile**
  - `< 640 px` — single-column, compact navigation
  - `640–1023 px` — two-column product grid
  - `≥ 1024 px` — four-column grid + horizontal nav
- Light, minimal design with subtle animations and a toast for feedback

## Project structure

```
ecommerce-gadgets/
├── index.html         Catalogue page
├── cart.html          Cart page
├── css/
│   └── styles.css     Mobile-first stylesheet (3 breakpoints)
├── js/
│   ├── data.js        Product list (8 items)
│   ├── cart-store.js  localStorage cart store + totals
│   ├── header.js      Header badge + toast helper
│   ├── catalog.js     Renders the catalogue page
│   └── cart.js        Renders the cart page
└── assets/images/     Product photos
```

## Running locally

The project is fully static. Either open `index.html` directly in a browser,
or serve the folder with any static server, for example:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Constraints respected

- No frameworks or external libraries (no React/Vue/jQuery/Bootstrap/etc.)
- All HTML, CSS, and JavaScript is original code written for this project
- Product photos are royalty-free (Unsplash)
