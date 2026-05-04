// Tiny localStorage-backed cart store. Other scripts use the methods on
// `CartStore` and listen to the `cart:change` event for live updates.
//
// A cart line is identified by (productId, colorId). The same product in two
// different colors becomes two separate lines.
(function () {
  const STORAGE_KEY = 'novatech_cart_v2';

  function defaultColorId(product) {
    return product && product.colors && product.colors.length > 0
      ? product.colors[0].id
      : '';
  }

  function findProduct(id) {
    return PRODUCTS.find((p) => p.id === id) || null;
  }

  function findColor(product, colorId) {
    if (!product || !product.colors || product.colors.length === 0) return null;
    return (
      product.colors.find((c) => c.id === colorId) || product.colors[0] || null
    );
  }

  function read() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed
        .filter(
          (line) =>
            line &&
            typeof line.id === 'string' &&
            Number.isFinite(line.qty) &&
            line.qty > 0
        )
        .map((line) => ({
          id: line.id,
          color: typeof line.color === 'string' ? line.color : '',
          qty: Math.floor(line.qty),
        }));
    } catch (err) {
      return [];
    }
  }

  function write(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    document.dispatchEvent(new CustomEvent('cart:change', { detail: { items } }));
  }

  function normaliseColor(productId, colorId) {
    const product = findProduct(productId);
    if (!product) return colorId || '';
    const color = findColor(product, colorId);
    return color ? color.id : defaultColorId(product);
  }

  function getItems() {
    return read();
  }

  function add(productId, qty, colorId) {
    const amount = Number.isFinite(qty) && qty > 0 ? Math.floor(qty) : 1;
    const color = normaliseColor(productId, colorId);
    const items = read();
    const existing = items.find(
      (line) => line.id === productId && line.color === color
    );
    if (existing) {
      existing.qty += amount;
    } else {
      items.push({ id: productId, color, qty: amount });
    }
    write(items);
  }

  function setQty(productId, qty, colorId) {
    const color = normaliseColor(productId, colorId);
    const items = read();
    const idx = items.findIndex(
      (line) => line.id === productId && line.color === color
    );
    if (idx === -1) return;
    if (qty <= 0) {
      items.splice(idx, 1);
    } else {
      items[idx].qty = Math.floor(qty);
    }
    write(items);
  }

  function remove(productId, colorId) {
    const color = normaliseColor(productId, colorId);
    const items = read().filter(
      (line) => !(line.id === productId && line.color === color)
    );
    write(items);
  }

  function clear() {
    write([]);
  }

  function totals() {
    const items = read();
    let count = 0;
    let subtotal = 0;
    const lines = [];
    for (const line of items) {
      const product = findProduct(line.id);
      if (!product) continue;
      const color = findColor(product, line.color);
      const lineTotal = product.price * line.qty;
      count += line.qty;
      subtotal += lineTotal;
      lines.push({ product, color, qty: line.qty, lineTotal });
    }
    const FREE_SHIPPING_THRESHOLD = 99;
    const SHIPPING_FEE = 9.99;
    const shipping =
      lines.length === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
    return {
      count,
      subtotal,
      shipping,
      total: subtotal + shipping,
      lines,
      freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
    };
  }

  window.CartStore = {
    getItems,
    add,
    setQty,
    remove,
    clear,
    totals,
  };
})();
