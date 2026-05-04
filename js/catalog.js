(function () {
  const grid = document.getElementById('product-grid');
  if (!grid) return;

  const categoryList = document.getElementById('category-list');
  const resultCount = document.getElementById('catalog-result-count');
  const emptyMsg = document.getElementById('catalog-empty');

  const url = new URL(window.location.href);
  let activeCategory = url.searchParams.get('category') || 'all';
  if (!CATEGORIES.some((c) => c.id === activeCategory)) {
    activeCategory = 'all';
  }

  function formatPrice(value) {
    return '$' + value.toFixed(2);
  }

  function categoryCount(catId) {
    if (catId === 'all') return PRODUCTS.length;
    return PRODUCTS.filter((p) => p.category === catId).length;
  }

  function categoryLabel(catId) {
    const c = CATEGORIES.find((cat) => cat.id === catId);
    return c ? c.name : 'Products';
  }

  function renderCategoryList() {
    if (!categoryList) return;
    categoryList.innerHTML = CATEGORIES.map((cat) => {
      const count = categoryCount(cat.id);
      const isActive = cat.id === activeCategory;
      return `
        <li class="category-item">
          <button
            type="button"
            class="category-link${isActive ? ' is-active' : ''}"
            data-category="${cat.id}"
            aria-pressed="${isActive ? 'true' : 'false'}"
          >
            <span class="category-name">${cat.name}</span>
            <span class="category-count">${count}</span>
          </button>
        </li>
      `;
    }).join('');

    categoryList.querySelectorAll('.category-link').forEach((btn) => {
      btn.addEventListener('click', () => {
        const catId = btn.dataset.category;
        if (catId === activeCategory) return;
        activeCategory = catId;
        const nextUrl = new URL(window.location.href);
        if (catId === 'all') {
          nextUrl.searchParams.delete('category');
        } else {
          nextUrl.searchParams.set('category', catId);
        }
        window.history.replaceState({}, '', nextUrl);
        renderCategoryList();
        renderGrid();
      });
    });
  }

  function renderCard(product) {
    const card = document.createElement('article');
    card.className = 'product-card';
    card.dataset.id = product.id;

    const badgeMarkup = product.badge
      ? `<span class="product-badge">${product.badge}</span>`
      : '';

    const productHref = 'product.html?id=' + encodeURIComponent(product.id);

    const colors = Array.isArray(product.colors) ? product.colors : [];
    const swatchMarkup = colors.length > 1
      ? `<div class="product-colors" aria-label="Available colors">
           ${colors
             .slice(0, 5)
             .map(
               (c) =>
                 `<span class="swatch swatch--xs" style="--swatch-color: ${c.hex}" title="${c.name}"></span>`
             )
             .join('')}
           ${colors.length > 5 ? `<span class="product-colors-more">+${colors.length - 5}</span>` : ''}
         </div>`
      : '';

    card.innerHTML = `
      <a class="product-media" href="${productHref}" aria-label="${product.name}">
        ${badgeMarkup}
        <img
          class="product-image"
          src="${product.image}"
          alt="${product.name}"
          loading="lazy"
        />
      </a>
      <div class="product-body">
        <h3 class="product-name"><a href="${productHref}">${product.name}</a></h3>
        <p class="product-desc">${product.description}</p>
        ${swatchMarkup}
        <div class="product-foot">
          <span class="product-price">${formatPrice(product.price)}</span>
          <div class="qty-control" data-qty="1" aria-label="Quantity">
            <button type="button" class="qty-btn" data-action="dec" aria-label="Decrease quantity">−</button>
            <span class="qty-value" data-role="qty">1</span>
            <button type="button" class="qty-btn" data-action="inc" aria-label="Increase quantity">+</button>
          </div>
        </div>
        <div class="product-actions">
          <a class="button button-ghost button-block" href="${productHref}">View details</a>
          <button type="button" class="button button-primary button-block add-btn">
            Add to cart
          </button>
        </div>
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
      const defaultColor = colors.length > 0 ? colors[0] : null;
      CartStore.add(product.id, qty, defaultColor ? defaultColor.id : '');
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

  function renderGrid() {
    const items =
      activeCategory === 'all'
        ? PRODUCTS
        : PRODUCTS.filter((p) => p.category === activeCategory);

    grid.innerHTML = '';
    if (items.length === 0) {
      grid.hidden = true;
      if (emptyMsg) emptyMsg.hidden = false;
    } else {
      grid.hidden = false;
      if (emptyMsg) emptyMsg.hidden = true;
      const fragment = document.createDocumentFragment();
      items.forEach((product) => fragment.appendChild(renderCard(product)));
      grid.appendChild(fragment);
    }

    if (resultCount) {
      const label = categoryLabel(activeCategory);
      const noun = items.length === 1 ? 'product' : 'products';
      resultCount.textContent =
        activeCategory === 'all'
          ? `${items.length} ${noun}`
          : `${items.length} ${noun} in ${label}`;
    }
  }

  renderCategoryList();
  renderGrid();
})();
