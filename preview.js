// Static comparison snapshot: prevent backend requests from the order form.
document.addEventListener('submit', event => {
  if (event.target.id !== 'direct-order-form') return;
  event.preventDefault();
  event.stopImmediatePropagation();
  const status = document.getElementById('form-status');
  if (status) {
    status.classList.remove('hidden');
    status.setAttribute('role', 'status');
    status.textContent = 'Это сохранённая версия сайта для сравнения. Заявки здесь не отправляются.';
  }
}, true);
