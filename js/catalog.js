(function () {
  const grid = document.getElementById('product-grid');
  if (!grid) return;

  function formatPrice(value) {
    return '$' + value.toFixed(2);
  }

  function renderCard(product) {
    const card = document.createElement('article');
    card.className = 'product-card';

    const productHref = 'product.html?id=' + encodeURIComponent(product.id);
    const colors = product.colors || [];
    const swatchMarkup = colors.length > 1
      ? `<div class="product-colors" aria-label="Available colors">
           ${colors
             .map(
               (c) =>
                 `<span class="swatch swatch--xs" style="--swatch-color: ${c.hex}" title="${c.name}"></span>`
             )
             .join('')}
         </div>`
      : '';

    card.innerHTML = `
      <a class="product-media" href="${productHref}" aria-label="${product.name}">
        <img class="product-image" src="${product.image}" alt="${product.name}" loading="lazy" />
      </a>
      <div class="product-body">
        <h3 class="product-name"><a href="${productHref}">${product.name}</a></h3>
        <p class="product-desc">${product.description}</p>
        ${swatchMarkup}
        <div class="product-foot">
          <span class="product-price">${formatPrice(product.price)}</span>
          <div class="qty-control" data-qty="1" aria-label="Quantity">
            <button type="button" class="qty-btn" data-action="dec" aria-label="Decrease">−</button>
            <span class="qty-value" data-role="qty">1</span>
            <button type="button" class="qty-btn" data-action="inc" aria-label="Increase">+</button>
          </div>
        </div>
        <div class="product-actions">
          <a class="button button-ghost button-block" href="${productHref}">View details</a>
          <button type="button" class="button button-primary button-block add-btn">Add to cart</button>
        </div>
      </div>
    `;

    const qtyControl = card.querySelector('.qty-control');
    const qtyValue = card.querySelector('[data-role="qty"]');
    const addBtn = card.querySelector('.add-btn');

    function getQty() {
      return Math.max(1, parseInt(qtyControl.dataset.qty, 10) || 1);
    }
    function setQty(v) {
      const n = Math.max(1, Math.min(99, v));
      qtyControl.dataset.qty = String(n);
      qtyValue.textContent = String(n);
    }

    card.querySelector('[data-action="dec"]').addEventListener('click', () => setQty(getQty() - 1));
    card.querySelector('[data-action="inc"]').addEventListener('click', () => setQty(getQty() + 1));
    addBtn.addEventListener('click', () => {
      const qty = getQty();
      const colorId = colors[0] ? colors[0].id : '';
      CartStore.add(product.id, qty, colorId);
      addBtn.textContent = 'Added ✓';
      addBtn.disabled = true;
      setTimeout(() => {
        addBtn.textContent = 'Add to cart';
        addBtn.disabled = false;
        setQty(1);
      }, 1200);
    });

    return card;
  }

  const fragment = document.createDocumentFragment();
  PRODUCTS.forEach((p) => fragment.appendChild(renderCard(p)));
  grid.appendChild(fragment);
})();
