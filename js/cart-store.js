// localStorage-backed cart. A line = (productId, colorId).
(function () {
  const STORAGE_KEY = 'novatech_cart';

  function findProduct(id) {
    return PRODUCTS.find((p) => p.id === id) || null;
  }

  function findColor(product, colorId) {
    if (!product || !product.colors || !product.colors.length) return null;
    return product.colors.find((c) => c.id === colorId) || product.colors[0];
  }

  function defaultColorId(product) {
    return product && product.colors && product.colors[0]
      ? product.colors[0].id
      : '';
  }

  function read() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(parsed)) return [];
      return parsed
        .filter((l) => l && typeof l.id === 'string' && l.qty > 0)
        .map((l) => ({
          id: l.id,
          color: typeof l.color === 'string' ? l.color : '',
          qty: Math.floor(l.qty),
        }));
    } catch (e) {
      return [];
    }
  }

  function write(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    document.dispatchEvent(new CustomEvent('cart:change'));
  }

  function normaliseColor(productId, colorId) {
    const product = findProduct(productId);
    if (!product) return colorId || '';
    const color = findColor(product, colorId);
    return color ? color.id : defaultColorId(product);
  }

  function add(productId, qty, colorId) {
    const amount = qty > 0 ? Math.floor(qty) : 1;
    const color = normaliseColor(productId, colorId);
    const items = read();
    const existing = items.find((l) => l.id === productId && l.color === color);
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
    const idx = items.findIndex((l) => l.id === productId && l.color === color);
    if (idx === -1) return;
    if (qty <= 0) items.splice(idx, 1);
    else items[idx].qty = Math.floor(qty);
    write(items);
  }

  function remove(productId, colorId) {
    const color = normaliseColor(productId, colorId);
    write(read().filter((l) => !(l.id === productId && l.color === color)));
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
    return { count, subtotal, total: subtotal, lines };
  }

  window.CartStore = { add, setQty, remove, clear, totals };
})();
