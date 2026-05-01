(function () {
  const layout = document.getElementById('cart-layout');
  const list = document.getElementById('cart-items');
  const emptyState = document.getElementById('cart-empty');
  const summaryLine = document.getElementById('cart-summary-line');
  const summaryItems = document.getElementById('summary-items');
  const summarySubtotal = document.getElementById('summary-subtotal');
  const summaryShipping = document.getElementById('summary-shipping');
  const summaryTotal = document.getElementById('summary-total');
  const shippingNote = document.getElementById('shipping-note');
  const checkoutBtn = document.getElementById('checkout-btn');
  const clearBtn = document.getElementById('clear-btn');

  if (!layout || !list) return;

  function fmt(value) {
    return '$' + value.toFixed(2);
  }

  function renderRow(line) {
    const { product, qty, lineTotal } = line;
    const row = document.createElement('article');
    row.className = 'cart-row';
    row.dataset.id = product.id;
    row.innerHTML = `
      <a class="cart-row-media" href="index.html#catalogue" tabindex="-1">
        <img src="${product.image}" alt="${product.name}" loading="lazy" />
      </a>
      <div class="cart-row-info">
        <h3 class="cart-row-name">${product.name}</h3>
        <p class="cart-row-desc">${product.description}</p>
        <button type="button" class="link-btn" data-action="remove">Remove</button>
      </div>
      <div class="cart-row-qty" aria-label="Quantity">
        <button type="button" class="qty-btn" data-action="dec" aria-label="Decrease quantity">−</button>
        <span class="qty-value" data-role="qty">${qty}</span>
        <button type="button" class="qty-btn" data-action="inc" aria-label="Increase quantity">+</button>
      </div>
      <div class="cart-row-price">
        <div class="cart-row-line-total">${fmt(lineTotal)}</div>
        <div class="cart-row-unit">${fmt(product.price)} each</div>
      </div>
    `;

    row.querySelector('[data-action="dec"]').addEventListener('click', () => {
      CartStore.setQty(product.id, qty - 1);
    });
    row.querySelector('[data-action="inc"]').addEventListener('click', () => {
      CartStore.setQty(product.id, qty + 1);
    });
    row.querySelector('[data-action="remove"]').addEventListener('click', () => {
      CartStore.remove(product.id);
      window.showToast && window.showToast(`Removed ${product.name}`);
    });

    return row;
  }

  function render() {
    const t = CartStore.totals();
    list.innerHTML = '';

    if (t.lines.length === 0) {
      layout.hidden = true;
      emptyState.hidden = false;
      summaryLine.textContent = 'Your cart is currently empty.';
      return;
    }

    layout.hidden = false;
    emptyState.hidden = true;

    const fragment = document.createDocumentFragment();
    t.lines.forEach((line) => fragment.appendChild(renderRow(line)));
    list.appendChild(fragment);

    summaryLine.textContent =
      t.count === 1 ? '1 item in your cart.' : `${t.count} items in your cart.`;
    summaryItems.textContent = String(t.count);
    summarySubtotal.textContent = fmt(t.subtotal);
    summaryShipping.textContent = t.shipping === 0 ? 'Free' : fmt(t.shipping);
    summaryTotal.textContent = fmt(t.total);

    if (t.subtotal >= t.freeShippingThreshold) {
      shippingNote.textContent = 'You qualify for free shipping.';
      shippingNote.dataset.tone = 'positive';
    } else {
      const remaining = t.freeShippingThreshold - t.subtotal;
      shippingNote.textContent = `Add ${fmt(remaining)} more for free shipping.`;
      shippingNote.dataset.tone = 'neutral';
    }
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      const t = CartStore.totals();
      if (t.lines.length === 0) return;
      const ok = window.confirm('Clear the cart?');
      if (ok) {
        CartStore.clear();
        window.showToast && window.showToast('Cart cleared');
      }
    });
  }

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      const t = CartStore.totals();
      if (t.lines.length === 0) return;
      window.showToast &&
        window.showToast(
          `Order placed: ${t.count} item${t.count === 1 ? '' : 's'} for ${fmt(t.total)}.`
        );
      CartStore.clear();
    });
  }

  document.addEventListener('cart:change', render);
  render();
})();
