// Product detail page: renders one product based on ?id= and ?color= in the
// URL, lets the user pick a color, choose a quantity, and add to cart.
(function () {
  const layout = document.getElementById('product-layout');
  const notFound = document.getElementById('product-not-found');
  const specsSection = document.getElementById('product-specs-section');
  if (!layout || !notFound || !specsSection) return;

  const params = new URLSearchParams(window.location.search);
  const productId = params.get('id') || '';
  const initialColorId = params.get('color') || '';

  const product = PRODUCTS.find((p) => p.id === productId);
  if (!product) {
    notFound.hidden = false;
    layout.hidden = true;
    specsSection.hidden = true;
    document.title = 'Product not found — NovaTech';
    return;
  }

  document.title = `${product.name} — NovaTech`;

  const breadcrumbCurrent = document.getElementById('breadcrumb-current');
  if (breadcrumbCurrent) breadcrumbCurrent.textContent = product.name;

  const badgeEl = document.getElementById('product-badge');
  if (product.badge) {
    badgeEl.textContent = product.badge;
    badgeEl.hidden = false;
  } else {
    badgeEl.hidden = true;
  }

  document.getElementById('product-name').textContent = product.name;
  document.getElementById('product-desc').textContent = product.description;
  document.getElementById('product-price').textContent =
    '$' + product.price.toFixed(2);

  const imageEl = document.getElementById('product-image');
  imageEl.alt = product.name;

  const colors = Array.isArray(product.colors) ? product.colors : [];
  const colorSection = document.getElementById('product-color-section');
  const swatchesEl = document.getElementById('product-swatches');
  const selectedColorNameEl = document.getElementById('selected-color-name');

  let activeColor =
    colors.find((c) => c.id === initialColorId) || colors[0] || null;

  function applyColor(color) {
    activeColor = color;
    if (!color) {
      imageEl.src = product.image;
      return;
    }
    imageEl.src = color.image || product.image;
    selectedColorNameEl.textContent = color.name;
    swatchesEl.querySelectorAll('.swatch').forEach((node) => {
      const isActive = node.dataset.colorId === color.id;
      node.classList.toggle('is-active', isActive);
      node.setAttribute('aria-checked', isActive ? 'true' : 'false');
    });
    const next = new URL(window.location.href);
    next.searchParams.set('color', color.id);
    window.history.replaceState(null, '', next.toString());
  }

  if (colors.length > 0) {
    colorSection.hidden = false;
    swatchesEl.innerHTML = '';
    colors.forEach((color) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'swatch swatch--lg';
      btn.style.setProperty('--swatch-color', color.hex);
      btn.dataset.colorId = color.id;
      btn.setAttribute('role', 'radio');
      btn.setAttribute('aria-checked', 'false');
      btn.title = color.name;
      btn.setAttribute('aria-label', color.name);
      btn.addEventListener('click', () => applyColor(color));
      swatchesEl.appendChild(btn);
    });
    applyColor(activeColor);
  } else {
    colorSection.hidden = true;
    imageEl.src = product.image;
  }

  // Specs
  const specsEl = document.getElementById('product-specs');
  const specs = Array.isArray(product.specs) ? product.specs : [];
  if (specs.length > 0) {
    specsEl.innerHTML = '';
    specs.forEach((row) => {
      const dt = document.createElement('dt');
      dt.textContent = row.label;
      const dd = document.createElement('dd');
      dd.textContent = row.value;
      specsEl.appendChild(dt);
      specsEl.appendChild(dd);
    });
    specsSection.hidden = false;
  } else {
    specsSection.hidden = true;
  }

  // Quantity
  const qtyControl = document.getElementById('detail-qty');
  const qtyValue = qtyControl.querySelector('[data-role="qty"]');
  function getQty() {
    return Math.max(1, parseInt(qtyControl.dataset.qty, 10) || 1);
  }
  function setQty(value) {
    const next = Math.max(1, Math.min(99, value));
    qtyControl.dataset.qty = String(next);
    qtyValue.textContent = String(next);
  }
  qtyControl
    .querySelector('[data-action="dec"]')
    .addEventListener('click', () => setQty(getQty() - 1));
  qtyControl
    .querySelector('[data-action="inc"]')
    .addEventListener('click', () => setQty(getQty() + 1));

  // Add to cart
  const addBtn = document.getElementById('add-to-cart');
  addBtn.addEventListener('click', () => {
    const qty = getQty();
    const colorId = activeColor ? activeColor.id : '';
    CartStore.add(product.id, qty, colorId);
    const colorLabel = activeColor ? ` (${activeColor.name})` : '';
    addBtn.textContent = 'Added ✓';
    addBtn.disabled = true;
    window.showToast &&
      window.showToast(
        qty === 1
          ? `Added ${product.name}${colorLabel} to cart`
          : `Added ${qty} × ${product.name}${colorLabel} to cart`
      );
    setTimeout(() => {
      addBtn.textContent = 'Add to cart';
      addBtn.disabled = false;
    }, 1200);
  });

  layout.hidden = false;
})();
