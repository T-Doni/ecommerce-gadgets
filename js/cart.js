/* ==========================================================================
   cart.js — рендер корзины (cart.html)
   --------------------------------------------------------------------------
   Что делает:
     1. Берёт itогом из CartStore (count, subtotal, lines).
     2. Если корзина пустая — показывает блок "Cart is empty".
     3. Иначе для каждой строки рисует карточку с фото / именем / цветом /
        кнопками + и − / суммой.
     4. Подписывается на событие 'cart:change' и автоматически
        перерисовывается, когда что-то меняется.
   ========================================================================== */

(function () {
  // Все элементы, с которыми работаем, заранее находим один раз.
  const layout = document.getElementById('cart-layout');
  const list = document.getElementById('cart-items');
  const emptyState = document.getElementById('cart-empty');
  const summaryItems = document.getElementById('summary-items');
  const summarySubtotal = document.getElementById('summary-subtotal');
  const summaryTotal = document.getElementById('summary-total');
  const clearBtn = document.getElementById('clear-btn');
  const checkoutBtn = document.getElementById('checkout-btn');

  if (!layout || !list) return;

  function fmt(v) {
    return '$' + v.toFixed(2);
  }

  // Создать DOM-элемент для одной строки корзины.
  function renderRow(line) {
    // Деструктуризация: достаём product, color, qty, lineTotal из объекта.
    const { product, color, qty, lineTotal } = line;
    const colorId = color ? color.id : '';
    // Если у цвета есть своя картинка — берём её, иначе — основную.
    const image = (color && color.image) || product.image;

    // Блок с цветом (кружок + имя). Показываем только если цвет есть.
    const colorRow = color
      ? `<div class="cart-row-color">
           <span class="swatch swatch--inline" style="--swatch-color: ${color.hex}"></span>
           <span>${color.name}</span>
         </div>`
      : '';

    const row = document.createElement('article');
    row.className = 'cart-row';
    row.innerHTML = `
      <div class="cart-row-media">
        <img src="${image}" alt="${product.name}" loading="lazy" />
      </div>
      <div class="cart-row-info">
        <h3 class="cart-row-name">${product.name}</h3>
        ${colorRow}
        <button type="button" class="link-btn" data-action="remove">Remove</button>
      </div>
      <div class="cart-row-qty" aria-label="Quantity">
        <button type="button" class="qty-btn" data-action="dec">−</button>
        <span class="qty-value">${qty}</span>
        <button type="button" class="qty-btn" data-action="inc">+</button>
      </div>
      <div class="cart-row-price">
        <div class="cart-row-line-total">${fmt(lineTotal)}</div>
        <div class="cart-row-unit">${fmt(product.price)} each</div>
      </div>
    `;

    // Обработчики на кнопки этой строки.
    // Передаём colorId, чтобы CartStore знал какую именно строку менять
    // (один товар в разных цветах = разные строки).
    row.querySelector('[data-action="dec"]').addEventListener('click', () => CartStore.setQty(product.id, qty - 1, colorId));
    row.querySelector('[data-action="inc"]').addEventListener('click', () => CartStore.setQty(product.id, qty + 1, colorId));
    row.querySelector('[data-action="remove"]').addEventListener('click', () => CartStore.remove(product.id, colorId));

    return row;
  }

  // Перерисовать всю корзину с нуля.
  function render() {
    const t = CartStore.totals();
    list.innerHTML = ''; // очищаем старые строки

    // Сначала всегда обновляем цифры в summary — даже если корзина пуста.
    // (Иначе после Clear cart старые суммы остаются в DOM до перезагрузки.)
    summaryItems.textContent = String(t.count);
    summarySubtotal.textContent = fmt(t.subtotal);
    summaryTotal.textContent = fmt(t.total);

    // Пустая корзина — показываем заглушку, прячем layout.
    if (t.lines.length === 0) {
      layout.hidden = true;
      emptyState.hidden = false;
      return;
    }

    layout.hidden = false;
    emptyState.hidden = true;

    // Рендерим все строки в DocumentFragment, потом разом вставляем
    // в DOM (один reflow вместо нескольких).
    const fragment = document.createDocumentFragment();
    t.lines.forEach((line) => fragment.appendChild(renderRow(line)));
    list.appendChild(fragment);
  }

  // Кнопка "Clear cart" (с подтверждением).
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (CartStore.totals().lines.length === 0) return;
      // window.confirm — встроенный модальный диалог.
      if (window.confirm('Clear the cart?')) CartStore.clear();
    });
  }

  // Кнопка "Checkout" — имитация оформления заказа.
  // (Это демо-проект, реальной оплаты нет.)
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      const t = CartStore.totals();
      if (t.lines.length === 0) {
        window.alert('Your cart is empty.');
        return;
      }
      // Показываем сообщение и очищаем корзину.
      window.alert(
        'Order placed! 🎉\n\n' +
          'Items: ' +
          t.count +
          '\n' +
          'Total: ' +
          fmt(t.total) +
          '\n\nThis is a demo project, no real payment was processed.'
      );
      CartStore.clear();
    });
  }

  // Перерисовывать каждый раз, когда CartStore меняет данные.
  document.addEventListener('cart:change', render);
  // Первый рендер при загрузке страницы.
  render();
})();
