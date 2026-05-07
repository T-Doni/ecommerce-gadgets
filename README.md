# NovaTech — Gadgets Shop (slim version)

A small e-commerce site for a group project. Built with **vanilla HTML, CSS, and JavaScript** — no frameworks or libraries.

## Pages

- `index.html` — catalogue of 8 gadgets
- `product.html` — single product page with color picker and specs
- `cart.html` — shopping cart with quantities and total

## Files

```
index.html        # catalogue
product.html      # product detail page
cart.html         # cart page
css/styles.css    # all styles + 3 responsive breakpoints
js/data.js        # product data (array of objects)
js/cart-store.js  # cart logic (add / remove / total) + localStorage
js/header.js      # cart badge in the header
js/catalog.js     # renders product cards on the catalogue
js/product.js     # renders the product page + color switching
js/cart.js        # renders the cart + quantity controls
assets/images/    # product photos
```

## How to run

Open `index.html` in a browser, OR run a local server:

```
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## What does each JS module do?

| File | Job |
|---|---|
| `data.js` | List of products (just data, no logic) |
| `cart-store.js` | Add/remove/update items, save to `localStorage`, calculate total |
| `header.js` | Update the number badge on the cart icon |
| `catalog.js` | Build product cards on the catalogue page |
| `product.js` | Build the product detail page, switch image when you pick a color |
| `cart.js` | Build the cart rows and the order summary |

The cart fires a custom `cart:change` event whenever it changes, and the header / cart page listen to it to re-render automatically.
