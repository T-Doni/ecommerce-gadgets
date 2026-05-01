(function () {
  const paymentSection = document.getElementById('cart-payment');
  if (!paymentSection) return;

  const tabs = Array.from(paymentSection.querySelectorAll('.payment-method'));
  const panels = Array.from(paymentSection.querySelectorAll('.payment-panel'));
  const amountSlots = Array.from(paymentSection.querySelectorAll('[data-pay-amount]'));

  function fmt(value) {
    return '$' + value.toFixed(2);
  }

  function syncAmount() {
    const t = CartStore.totals();
    const text = fmt(t.total);
    amountSlots.forEach((slot) => {
      slot.textContent = text;
    });
    // Disable submit / pay buttons when cart is empty
    const isEmpty = t.lines.length === 0;
    paymentSection.classList.toggle('is-disabled', isEmpty);
    paymentSection.querySelectorAll('.pay-btn').forEach((btn) => {
      btn.disabled = isEmpty;
    });
  }

  function activate(method) {
    tabs.forEach((tab) => {
      const isActive = tab.dataset.method === method;
      tab.classList.toggle('is-active', isActive);
      tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
    panels.forEach((panel) => {
      panel.hidden = panel.dataset.panel !== method;
    });
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => activate(tab.dataset.method));
  });

  // --- Card form ---
  const cardForm = document.getElementById('card-form');
  if (cardForm) {
    const numberInput = cardForm.querySelector('input[name="number"]');
    const monthInput = cardForm.querySelector('input[name="month"]');
    const yearInput = cardForm.querySelector('input[name="year"]');
    const cvvInput = cardForm.querySelector('input[name="cvv"]');
    const nameInput = cardForm.querySelector('input[name="name"]');
    const previewNumber = document.getElementById('card-pre-number');
    const previewName = document.getElementById('card-pre-name');
    const previewExp = document.getElementById('card-pre-exp');

    function formatCardNumber(value) {
      const digits = value.replace(/\D+/g, '').slice(0, 19);
      return digits.replace(/(.{4})/g, '$1 ').trim();
    }

    numberInput.addEventListener('input', () => {
      const formatted = formatCardNumber(numberInput.value);
      numberInput.value = formatted;
      const digits = formatted.replace(/\s+/g, '');
      const tail = digits.slice(-4).padStart(4, '•');
      const padded = '•••• •••• •••• ' + tail;
      previewNumber.textContent = digits.length === 0 ? '•••• •••• •••• ••••' : padded;
    });

    nameInput.addEventListener('input', () => {
      previewName.textContent = nameInput.value.trim() || 'Your Name';
    });

    function updateExp() {
      const m = monthInput.value.replace(/\D+/g, '').slice(0, 2);
      const y = yearInput.value.replace(/\D+/g, '').slice(0, 4);
      monthInput.value = m;
      yearInput.value = y;
      const yy = y.length >= 2 ? y.slice(-2) : '';
      previewExp.textContent =
        (m || 'MM') + '/' + (yy || 'YY');
    }
    monthInput.addEventListener('input', updateExp);
    yearInput.addEventListener('input', updateExp);

    cvvInput.addEventListener('input', () => {
      cvvInput.value = cvvInput.value.replace(/\D+/g, '').slice(0, 4);
    });

    cardForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const t = CartStore.totals();
      if (t.lines.length === 0) return;

      const digits = numberInput.value.replace(/\s+/g, '');
      const month = parseInt(monthInput.value, 10);
      const year = parseInt(yearInput.value, 10);
      const cvv = cvvInput.value;
      const name = nameInput.value.trim();

      if (!name) return showError(nameInput, 'Enter the cardholder name');
      if (digits.length < 13) return showError(numberInput, 'Enter a valid card number');
      if (!month || month < 1 || month > 12) return showError(monthInput, 'Invalid month');
      if (!year || year < 2024 || year > 2099) return showError(yearInput, 'Invalid year');
      if (cvv.length < 3) return showError(cvvInput, 'CVV must be 3–4 digits');

      const tail = digits.slice(-4);
      window.showToast &&
        window.showToast(
          `Card ending ${tail} charged ${fmt(t.total)} — order confirmed`
        );
      CartStore.clear();
      cardForm.reset();
      updateExp();
      previewNumber.textContent = '•••• •••• •••• ••••';
      previewName.textContent = 'Your Name';
    });
  }

  // --- Kaspi form ---
  const kaspiForm = document.getElementById('kaspi-form');
  if (kaspiForm) {
    const phoneInput = kaspiForm.querySelector('input[name="phone"]');

    function formatKaspiPhone(raw) {
      let digits = raw.replace(/\D+/g, '');
      if (digits.startsWith('8')) digits = '7' + digits.slice(1);
      digits = digits.slice(0, 11);
      const parts = [];
      if (digits.length > 0) parts.push('+' + digits.slice(0, 1));
      if (digits.length > 1) parts.push(' (' + digits.slice(1, 4));
      if (digits.length >= 4) parts[parts.length - 1] += ')';
      if (digits.length >= 4) parts.push(' ' + digits.slice(4, 7));
      if (digits.length >= 7) parts.push('-' + digits.slice(7, 9));
      if (digits.length >= 9) parts.push('-' + digits.slice(9, 11));
      return parts.join('');
    }

    phoneInput.addEventListener('input', () => {
      const cursor = phoneInput.selectionStart;
      const before = phoneInput.value;
      phoneInput.value = formatKaspiPhone(phoneInput.value);
      // Best-effort cursor restore
      const diff = phoneInput.value.length - before.length;
      try {
        phoneInput.setSelectionRange(cursor + diff, cursor + diff);
      } catch (_) {}
    });

    kaspiForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const t = CartStore.totals();
      if (t.lines.length === 0) return;

      const digits = phoneInput.value.replace(/\D+/g, '');
      if (digits.length !== 11) {
        return showError(phoneInput, 'Enter your Kaspi phone number');
      }

      const masked = '+7 *** *** ' + digits.slice(7, 9) + ' ' + digits.slice(9, 11);
      window.showToast &&
        window.showToast(
          `Kaspi.kz request sent to ${masked} — confirm in the app to pay ${fmt(t.total)}`
        );
      CartStore.clear();
      kaspiForm.reset();
    });
  }

  // --- Apple Pay button ---
  const applePayBtn = document.getElementById('apple-pay-btn');
  if (applePayBtn) {
    applePayBtn.addEventListener('click', () => {
      const t = CartStore.totals();
      if (t.lines.length === 0) return;
      window.showToast &&
        window.showToast(`Apple Pay confirmed ${fmt(t.total)} — order placed`);
      CartStore.clear();
    });
  }

  function showError(input, message) {
    input.focus();
    input.classList.add('payment-field-error');
    setTimeout(() => input.classList.remove('payment-field-error'), 1500);
    window.showToast && window.showToast(message);
  }

  document.addEventListener('cart:change', syncAmount);
  syncAmount();
})();
