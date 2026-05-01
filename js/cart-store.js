// Tiny localStorage-backed cart store. Other scripts use the methods on
// `CartStore` and listen to the `cart:change` event for live updates.
(function () {
  const STORAGE_KEY = 'novatech_cart_v1';

  function read() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed.filter(
        (line) =>
          line &&
          typeof line.id === 'string' &&
          Number.isFinite(line.qty) &&
          line.qty > 0
      );
    } catch (err) {
      return [];
    }
  }

  function write(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    document.dispatchEvent(new CustomEvent('cart:change', { detail: { items } }));
  }

  function getItems() {
    return read();
  }

  function findProduct(id) {
    return PRODUCTS.find((p) => p.id === id) || null;
  }

  function add(productId, qty) {
    const amount = Number.isFinite(qty) && qty > 0 ? Math.floor(qty) : 1;
    const items = read();
    const existing = items.find((line) => line.id === productId);
    if (existing) {
      existing.qty += amount;
    } else {
      items.push({ id: productId, qty: amount });
    }
    write(items);
  }

  function setQty(productId, qty) {
    const items = read();
    const idx = items.findIndex((line) => line.id === productId);
    if (idx === -1) return;
    if (qty <= 0) {
      items.splice(idx, 1);
    } else {
      items[idx].qty = Math.floor(qty);
    }
    write(items);
  }

  function remove(productId) {
    const items = read().filter((line) => line.id !== productId);
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
      const lineTotal = product.price * line.qty;
      count += line.qty;
      subtotal += lineTotal;
      lines.push({ product, qty: line.qty, lineTotal });
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
