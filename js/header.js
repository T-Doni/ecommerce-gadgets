(function () {
  const yearNode = document.getElementById('year');
  if (yearNode) yearNode.textContent = String(new Date().getFullYear());

  const countNode = document.getElementById('cart-count');

  function refreshCount() {
    if (!countNode) return;
    const { count } = CartStore.totals();
    countNode.textContent = String(count);
    countNode.dataset.empty = count === 0 ? 'true' : 'false';
  }

  refreshCount();
  document.addEventListener('cart:change', refreshCount);
  // Update across tabs.
  window.addEventListener('storage', (e) => {
    if (e.key === 'novatech_cart_v1') refreshCount();
  });

  // Lightweight toast helper, exposed for catalog/cart scripts.
  const toastNode = document.getElementById('toast');
  let toastTimer = null;
  window.showToast = function (message) {
    if (!toastNode) return;
    toastNode.textContent = message;
    toastNode.dataset.visible = 'true';
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastNode.dataset.visible = 'false';
    }, 1800);
  };
})();
