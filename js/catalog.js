(function () {
  const grid = document.getElementById('product-grid');
  if (!grid) return;

  function formatPrice(value) {
    return '$' + value.toFixed(2);
  }

  function renderCard(product) {
    const card = document.createElement('article');
    card.className = 'product-card';
    card.dataset.id = product.id;

    const badgeMarkup = product.badge
      ? `<span class="product-badge">${product.badge}</span>`
      : '';

    card.innerHTML = `
      <div class="product-media">
        ${badgeMarkup}
        <img
          class="product-image"
          src="${product.image}"
          alt="${product.name}"
          loading="lazy"
        />
      </div>
      <div class="product-body">
        <h3 class="product-name">${product.name}</h3>
        <p class="product-desc">${product.description}</p>
        <div class="product-foot">
          <span class="product-price">${formatPrice(product.price)}</span>
          <div class="qty-control" data-qty="1" aria-label="Quantity">
            <button type="button" class="qty-btn" data-action="dec" aria-label="Decrease quantity">−</button>
            <span class="qty-value" data-role="qty">1</span>
            <button type="button" class="qty-btn" data-action="inc" aria-label="Increase quantity">+</button>
          </div>
        </div>
        <button type="button" class="button button-primary button-block add-btn">
          Add to cart
        </button>
      </div>
    `;

    const qtyControl = card.querySelector('.qty-control');
    const qtyValue = card.querySelector('[data-role="qty"]');
    const decBtn = card.querySelector('[data-action="dec"]');
    const incBtn = card.querySelector('[data-action="inc"]');
    const addBtn = card.querySelector('.add-btn');

    function getQty() {
      return Math.max(1, parseInt(qtyControl.dataset.qty, 10) || 1);
    }
    function setQty(value) {
      const next = Math.max(1, Math.min(99, value));
      qtyControl.dataset.qty = String(next);
      qtyValue.textContent = String(next);
    }

    decBtn.addEventListener('click', () => setQty(getQty() - 1));
    incBtn.addEventListener('click', () => setQty(getQty() + 1));
    addBtn.addEventListener('click', () => {
      const qty = getQty();
      CartStore.add(product.id, qty);
      addBtn.textContent = 'Added ✓';
      addBtn.disabled = true;
      window.showToast &&
        window.showToast(
          qty === 1
            ? `Added ${product.name} to cart`
            : `Added ${qty} × ${product.name} to cart`
        );
      setTimeout(() => {
        addBtn.textContent = 'Add to cart';
        addBtn.disabled = false;
        setQty(1);
      }, 1200);
    });

    return card;
  }

  const fragment = document.createDocumentFragment();
  PRODUCTS.forEach((product) => fragment.appendChild(renderCard(product)));
  grid.appendChild(fragment);
})();
