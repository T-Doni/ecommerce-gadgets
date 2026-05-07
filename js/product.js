(function () {
  const layout = document.getElementById('product-layout');
  const notFound = document.getElementById('product-not-found');
  if (!layout || !notFound) return;

  const params = new URLSearchParams(window.location.search);
  const product = PRODUCTS.find((p) => p.id === params.get('id'));

  if (!product) {
    notFound.hidden = false;
    layout.hidden = true;
    return;
  }

  document.title = `${product.name} — NovaTech`;
  document.getElementById('product-name').textContent = product.name;
  document.getElementById('product-desc').textContent = product.description;
  document.getElementById('product-price').textContent = '$' + product.price.toFixed(2);

  const imageEl = document.getElementById('product-image');
  imageEl.alt = product.name;

  const colors = product.colors || [];
  const swatchesEl = document.getElementById('product-swatches');
  const selectedColorNameEl = document.getElementById('selected-color-name');
  let activeColor = colors.find((c) => c.id === params.get('color')) || colors[0];

  function applyColor(color) {
    activeColor = color;
    imageEl.src = color.image || product.image;
    selectedColorNameEl.textContent = color.name;
    swatchesEl.querySelectorAll('.swatch').forEach((node) => {
      node.classList.toggle('is-active', node.dataset.colorId === color.id);
    });
  }

  if (colors.length > 0) {
    colors.forEach((color) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'swatch swatch--lg';
      btn.style.setProperty('--swatch-color', color.hex);
      btn.dataset.colorId = color.id;
      btn.title = color.name;
      btn.addEventListener('click', () => applyColor(color));
      swatchesEl.appendChild(btn);
    });
    applyColor(activeColor);
  } else {
    imageEl.src = product.image;
  }

  // Specs
  const specsEl = document.getElementById('product-specs');
  (product.specs || []).forEach((row) => {
    const dt = document.createElement('dt');
    dt.textContent = row.label;
    const dd = document.createElement('dd');
    dd.textContent = row.value;
    specsEl.appendChild(dt);
    specsEl.appendChild(dd);
  });

  // Quantity
  const qtyControl = document.getElementById('detail-qty');
  const qtyValue = qtyControl.querySelector('.qty-value');
  function getQty() {
    return Math.max(1, parseInt(qtyControl.dataset.qty, 10) || 1);
  }
  function setQty(v) {
    const n = Math.max(1, Math.min(99, v));
    qtyControl.dataset.qty = String(n);
    qtyValue.textContent = String(n);
  }
  qtyControl.querySelector('[data-action="dec"]').addEventListener('click', () => setQty(getQty() - 1));
  qtyControl.querySelector('[data-action="inc"]').addEventListener('click', () => setQty(getQty() + 1));

  // Add to cart
  const addBtn = document.getElementById('add-to-cart');
  addBtn.addEventListener('click', () => {
    CartStore.add(product.id, getQty(), activeColor ? activeColor.id : '');
    addBtn.textContent = 'Added ✓';
    addBtn.disabled = true;
    setTimeout(() => {
      addBtn.textContent = 'Add to cart';
      addBtn.disabled = false;
    }, 1200);
  });

  layout.hidden = false;
})();
