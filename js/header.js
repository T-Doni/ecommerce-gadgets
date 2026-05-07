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
})();
