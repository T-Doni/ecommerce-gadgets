(function () {
  const layout = document.getElementById('cart-layout');
  const list = document.getElementById('cart-items');
  const emptyState = document.getElementById('cart-empty');
  const summaryItems = document.getElementById('summary-items');
  const summarySubtotal = document.getElementById('summary-subtotal');
  const summaryTotal = document.getElementById('summary-total');
  const clearBtn = document.getElementById('clear-btn');

  if (!layout || !list) return;

  function fmt(v) {
    return '$' + v.toFixed(2);
  }

  function renderRow(line) {
    const { product, color, qty, lineTotal } = line;
    const colorId = color ? color.id : '';
    const image = (color && color.image) || product.image;
    const colorRow = color
      ? `<div class="cart-row-color">
           <span class="swatch swatch--inline" style="--swatch-color: ${color.hex}"></span>
           <span>${color.name}</span>
         </div>`
      : '';

    const row = document.createElement('article');
    row.className = 'cart-row';
    row.innerHTML = `
      <div class="cart-row-media">
        <img src="${image}" alt="${product.name}" loading="lazy" />
      </div>
      <div class="cart-row-info">
        <h3 class="cart-row-name">${product.name}</h3>
        ${colorRow}
        <button type="button" class="link-btn" data-action="remove">Remove</button>
      </div>
      <div class="cart-row-qty" aria-label="Quantity">
        <button type="button" class="qty-btn" data-action="dec">−</button>
        <span class="qty-value">${qty}</span>
        <button type="button" class="qty-btn" data-action="inc">+</button>
      </div>
      <div class="cart-row-price">
        <div class="cart-row-line-total">${fmt(lineTotal)}</div>
        <div class="cart-row-unit">${fmt(product.price)} each</div>
      </div>
    `;

    row.querySelector('[data-action="dec"]').addEventListener('click', () => CartStore.setQty(product.id, qty - 1, colorId));
    row.querySelector('[data-action="inc"]').addEventListener('click', () => CartStore.setQty(product.id, qty + 1, colorId));
    row.querySelector('[data-action="remove"]').addEventListener('click', () => CartStore.remove(product.id, colorId));

    return row;
  }

  function render() {
    const t = CartStore.totals();
    list.innerHTML = '';

    if (t.lines.length === 0) {
      layout.hidden = true;
      emptyState.hidden = false;
      return;
    }

    layout.hidden = false;
    emptyState.hidden = true;

    const fragment = document.createDocumentFragment();
    t.lines.forEach((line) => fragment.appendChild(renderRow(line)));
    list.appendChild(fragment);

    summaryItems.textContent = String(t.count);
    summarySubtotal.textContent = fmt(t.subtotal);
    summaryTotal.textContent = fmt(t.total);
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (CartStore.totals().lines.length === 0) return;
      if (window.confirm('Clear the cart?')) CartStore.clear();
    });
  }

  document.addEventListener('cart:change', render);
  render();
})();
