// «Местный сад» — Сады Роберта Валиева (с. Дменис)
// Client Interactions & Order Handling

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }

  // 2. Filter Tabs
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('active-filter');
        b.classList.add('bg-white', 'text-orchard-pine', 'border', 'border-orchard-pine/10');
      });

      btn.classList.add('active-filter');
      btn.classList.remove('bg-white', 'text-orchard-pine', 'border-orchard-pine/10');

      const filter = btn.getAttribute('data-filter');

      productCards.forEach(card => {
        const categories = (card.getAttribute('data-category') || '').split(' ');
        if (filter === 'all' || categories.includes(filter)) {
          card.classList.remove('hidden');
          card.classList.add('fade-in');
        } else {
          card.classList.add('hidden');
          card.classList.remove('fade-in');
        }
      });
    });
  });

  // 3. Calculator State & Logic
  let currentWeight = 5;
  let currentPrice = 750;
  let currentVariety = 'Яблоко «Голден Делишес» (десертное)';
  const FARMER_PHONE = '79298078683';
  const FARMER_PHONE_DISPLAY = '+7 (929) 807-86-83';

  const boxBtns = document.querySelectorAll('.box-size-btn');
  const varietySelect = document.getElementById('variety-select');
  const summaryTitle = document.getElementById('calc-summary-title');
  const priceDisplay = document.getElementById('calc-price-display');
  const whatsappBtn = document.getElementById('order-whatsapp-btn');
  const formWeight = document.getElementById('form-weight');
  const formVariety = document.getElementById('form-variety');

  function productKey(name) {
    const normalized = name.toLowerCase().replace(/ё/g, 'е');
    const varieties = [
      ['голден', 'golden'], ['бродск', 'brodsky'], ['броцк', 'brodsky'],
      ['крынк', 'krinka'], ['кринк', 'krinka'], ['банан', 'banana'],
      ['вильямс', 'williams'], ['дюшес', 'williams'], ['боск', 'bosc'],
      ['лампочк', 'bosc'], ['жозефин', 'josephine'], ['александр', 'alexander'],
      ['темн', 'dark-plum'], ['слив', 'plum']
    ];
    return varieties.find(([word]) => normalized.includes(word))?.[1];
  }

  function syncOrderForm() {
    if (formWeight) {
      const option = [...formWeight.options].find(option =>
        option.value === `${currentWeight} кг (${currentPrice} ₽)`);
      if (option) formWeight.value = option.value;
    }
    if (formVariety) {
      const key = productKey(currentVariety);
      const option = [...formVariety.options].find(option =>
        key && productKey(option.value) === key);
      if (option) formVariety.value = option.value;
    }
  }

  function updateOrderLinks() {
    syncOrderForm();
    if (summaryTitle) {
      summaryTitle.textContent = `Ящик ${currentWeight} кг • ${currentVariety}`;
    }
    if (priceDisplay) {
      priceDisplay.textContent = `${currentPrice.toLocaleString('ru-RU')} ₽`;
    }

    const message = `Здравствуйте! Хочу заказать ящик фруктов из хозяйства «Местный сад» (с. Дменис):
— Размер ящика: ${currentWeight} кг
— Сорт: ${currentVariety}
— Стоимость: ${currentPrice} ₽
Подскажите, пожалуйста, по наличию, доставке по Цхинвалу или самовывозу!`;

    const encodedMsg = encodeURIComponent(message);

    if (whatsappBtn) {
      whatsappBtn.href = `https://wa.me/${FARMER_PHONE}?text=${encodedMsg}`;
    }
  }

  boxBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      boxBtns.forEach(b => {
        b.classList.remove('active-box-btn');
        b.classList.add('bg-white', 'border-orchard-pine/20');
      });

      btn.classList.add('active-box-btn');
      btn.classList.remove('bg-white', 'border-orchard-pine/20');

      currentWeight = parseInt(btn.getAttribute('data-weight'), 10);
      currentPrice = parseInt(btn.getAttribute('data-price'), 10);

      updateOrderLinks();
    });
  });

  if (varietySelect) {
    varietySelect.addEventListener('change', (e) => {
      currentVariety = e.target.value;
      updateOrderLinks();
    });
  }

  // Initial call
  updateOrderLinks();

  // 4. Quick select function exposed to global scope
  window.selectProduct = function(productName) {
    if (varietySelect) {
      const key = productKey(productName);
      const option = [...varietySelect.options].find(option =>
        key && productKey(option.value) === key);
      if (!option) return;
      varietySelect.value = option.value;
      currentVariety = option.value;
      updateOrderLinks();

      const calcSection = document.getElementById('calculator');
      if (calcSection) {
        calcSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // 5. Intelligent Phone Input Mask (+7 (XXX) XXX-XX-XX)
  const phoneInput = document.getElementById('order-phone');
  if (phoneInput) {
    // Ensure initial value
    if (!phoneInput.value.trim() || phoneInput.value === '+7') {
      phoneInput.value = '+7 ';
    }

    phoneInput.addEventListener('focus', () => {
      if (!phoneInput.value.startsWith('+7')) {
        phoneInput.value = '+7 ';
      }
    });

    phoneInput.addEventListener('input', () => {
      let digits = phoneInput.value.replace(/\D/g, '');

      // Normalize Russian/Caucuses numbers
      if (digits.startsWith('8')) {
        digits = '7' + digits.substring(1);
      } else if (!digits.startsWith('7')) {
        digits = '7' + digits;
      }

      // Max 11 digits
      digits = digits.substring(0, 11);

      let formatted = '+7';
      if (digits.length > 1) {
        formatted += ' (' + digits.substring(1, 4);
      }
      if (digits.length >= 4) {
        formatted += ') ' + digits.substring(4, 7);
      }
      if (digits.length >= 7) {
        formatted += '-' + digits.substring(7, 9);
      }
      if (digits.length >= 9) {
        formatted += '-' + digits.substring(9, 11);
      }

      phoneInput.value = formatted;
    });

    phoneInput.addEventListener('keydown', (e) => {
      // Prevent deleting the "+7 " prefix
      if (e.key === 'Backspace' && phoneInput.value.length <= 4) {
        e.preventDefault();
        phoneInput.value = '+7 ';
      }
    });
  }

  // Delivery quick pills (Tskhinval delivery / Tskhinval pickup / Dmenis orchard pickup)
  const btnTskhinval = document.getElementById('btn-delivery-tskhinval');
  const btnPickupTskhinval = document.getElementById('btn-pickup-tskhinval');
  const btnPickup = document.getElementById('btn-delivery-pickup');
  const orderAddressInput = document.getElementById('order-address');

  const deliveryBtns = [btnTskhinval, btnPickupTskhinval, btnPickup];

  function setDeliveryActive(activeBtn) {
    deliveryBtns.forEach(btn => {
      if (!btn) return;
      if (btn === activeBtn) {
        btn.className = 'px-3.5 py-2 rounded-xl bg-white/30 text-xs font-semibold text-white border border-white/50 transition flex items-center gap-1.5 cursor-pointer shadow-sm';
      } else {
        btn.className = 'px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white/80 border border-white/20 transition flex items-center gap-1.5 cursor-pointer';
      }
    });
  }

  if (btnTskhinval && orderAddressInput) {
    btnTskhinval.addEventListener('click', () => {
      setDeliveryActive(btnTskhinval);
      orderAddressInput.value = 'Доставка по Цхинвалу: ул. ';
      orderAddressInput.focus();
    });
  }

  if (btnPickupTskhinval && orderAddressInput) {
    btnPickupTskhinval.addEventListener('click', () => {
      setDeliveryActive(btnPickupTskhinval);
      orderAddressInput.value = 'Самовывоз: г. Цхинвал';
    });
  }

  if (btnPickup && orderAddressInput) {
    btnPickup.addEventListener('click', () => {
      setDeliveryActive(btnPickup);
      orderAddressInput.value = 'Самовывоз из сада в с. Дменис';
    });
  }

  // 6. Direct Order Form Submission & API Integration
  const directForm = document.getElementById('direct-order-form');
  const formStatus = document.getElementById('form-status');
  const submitBtn = document.getElementById('order-submit-btn');
  let orderPending = false;
  const escapeHtml = value => String(value).replace(/[&<>"']/g, char =>
    ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[char]));

  if (directForm) {
    directForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (orderPending) return;
      const name = document.getElementById('order-name').value.trim();
      const phone = phoneInput ? phoneInput.value.trim() : '';
      const weight = document.getElementById('form-weight').value;
      const variety = document.getElementById('form-variety').value;
      const address = document.getElementById('order-address').value.trim();

      // Check phone validity (minimum 11 digits: 7 + 10 local digits)
      const rawDigits = phone.replace(/\D/g, '');
      if (rawDigits.length < 11) {
        if (formStatus) {
          formStatus.classList.remove('hidden');
          formStatus.innerHTML = `
            <div class="p-3 bg-amber-500/20 text-amber-200 rounded-xl text-xs border border-amber-500/40 font-medium">
              ⚠️ Пожалуйста, введите полный номер телефона: +7 (XXX) XXX-XX-XX
            </div>
          `;
        }
        if (phoneInput) phoneInput.focus();
        return;
      }

      // Show loading indicator on button
      orderPending = true;
      if (formStatus) {
        formStatus.textContent = '';
        formStatus.classList.add('hidden');
      }
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <svg class="animate-spin h-5 w-5 text-orchard-pine" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
          <span>Запись заказа...</span>
        `;
      }

      const orderPayload = {
        name,
        phone,
        weight,
        variety,
        address
      };

      const orderText = `Заявка с сайта «Местный сад»:
👤 Имя: ${name}
📞 Телефон: ${phone}
📦 Ящик: ${weight}
🍎 Сорт: ${variety}
📍 Адрес: ${address || 'Не указан'}`;

      const waUrl = `https://wa.me/${FARMER_PHONE}?text=${encodeURIComponent(orderText)}`;
      const controller = new AbortController();
      const requestTimeout = setTimeout(() => controller.abort(), 15000);

      try {
        const resp = await fetch('/api/order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify(orderPayload)
        });

        if (!resp.ok) throw new Error(`Order API HTTP ${resp.status}`);
        const result = await resp.json();
        if (result?.success !== true || !result.order_id) {
          throw new Error('Order API did not confirm registration');
        }

        if (formStatus) {
          formStatus.classList.remove('hidden');
          const orderNum = ` #${escapeHtml(result.order_id)}`;
          formStatus.innerHTML = `
            <div class="p-5 bg-emerald-950/85 rounded-2xl text-emerald-100 text-sm border border-emerald-400/40 shadow-xl space-y-3">
              <div class="font-serif font-bold text-lg text-white flex items-center gap-2">
                <span class="text-emerald-400 text-xl">✓</span>
                <span>Заявка${orderNum} успешно зарегистрирована!</span>
              </div>
              <p class="text-xs text-emerald-200/90 leading-relaxed">
                Спасибо, <strong>${escapeHtml(name)}</strong>! Заявка принята в базу «Местный сад». Роберт Валиев свяжется с вами по номеру <strong class="text-white">${escapeHtml(phone)}</strong> для согласования сбора, доставки или удобного самовывоза (в Цхинвале или с. Дменис).
              </p>
              <div class="pt-2 flex flex-col sm:flex-row gap-2.5">
                <a href="${waUrl}" target="_blank" class="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white py-2.5 px-4 rounded-xl text-xs font-bold transition shadow-sm">
                  <span>💬 Продублировать в WhatsApp</span>
                </a>
                <a href="tel:+${FARMER_PHONE}" class="inline-flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 text-white py-2.5 px-4 rounded-xl text-xs font-semibold transition border border-white/20">
                  <span>📞 Позвонить фермеру: ${FARMER_PHONE_DISPLAY}</span>
                </a>
              </div>
            </div>
          `;
        }

        directForm.reset();
        syncOrderForm();
        if (phoneInput) phoneInput.value = '+7 ';

      } catch (err) {
        // Preserve the entered details and offer a manual fallback.
        if (formStatus) {
          formStatus.classList.remove('hidden');
          formStatus.innerHTML = `
            <div class="p-5 bg-emerald-950/85 rounded-2xl text-emerald-100 text-xs border border-emerald-400/40 space-y-3">
              <p class="text-sm font-semibold text-white">Не удалось подтвердить регистрацию заявки.</p>
              <p>Ваши данные сохранены в форме. Попробуйте отправить ещё раз или уточните заказ у фермера через WhatsApp либо по телефону.</p>
              <div class="flex flex-col sm:flex-row gap-2">
                <a href="${waUrl}" target="_blank" class="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white py-2.5 px-4 rounded-xl font-bold">
                  💬 Открыть в WhatsApp →
                </a>
                <a href="tel:+${FARMER_PHONE}" class="inline-flex items-center justify-center gap-2 bg-white/20 text-white py-2.5 px-4 rounded-xl font-medium">
                  📞 Позвонить фермеру
                </a>
              </div>
            </div>
          `;
        }
      } finally {
        clearTimeout(requestTimeout);
        orderPending = false;
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = `<span>Отправить заявку фермеру</span>`;
        }
      }
    });
  }

  // 7. Orchard Video Player Controls (AI.MP4 / Hand Selection)
  const orchardVideo = document.getElementById('orchard-video');
  const videoPlayBtn = document.getElementById('video-play-btn');
  const videoPlayIcon = document.getElementById('video-play-icon');
  const videoPauseIcon = document.getElementById('video-pause-icon');
  const videoMuteBtn = document.getElementById('video-mute-btn');
  const videoMutedIcon = document.getElementById('video-muted-icon');
  const videoUnmutedIcon = document.getElementById('video-unmuted-icon');

  if (orchardVideo) {
    if (videoPlayBtn) {
      videoPlayBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (orchardVideo.paused) {
          orchardVideo.play();
          if (videoPlayIcon) videoPlayIcon.classList.add('hidden');
          if (videoPauseIcon) videoPauseIcon.classList.remove('hidden');
        } else {
          orchardVideo.pause();
          if (videoPlayIcon) videoPlayIcon.classList.remove('hidden');
          if (videoPauseIcon) videoPauseIcon.classList.add('hidden');
        }
      });
    }

    if (videoMuteBtn) {
      videoMuteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        orchardVideo.muted = !orchardVideo.muted;
        if (orchardVideo.muted) {
          if (videoMutedIcon) videoMutedIcon.classList.remove('hidden');
          if (videoUnmutedIcon) videoUnmutedIcon.classList.add('hidden');
        } else {
          if (videoMutedIcon) videoMutedIcon.classList.add('hidden');
          if (videoUnmutedIcon) videoUnmutedIcon.classList.remove('hidden');
        }
      });
    }

    // Toggle on video click as well
    orchardVideo.addEventListener('click', () => {
      if (orchardVideo.paused) {
        orchardVideo.play();
        if (videoPlayIcon) videoPlayIcon.classList.add('hidden');
        if (videoPauseIcon) videoPauseIcon.classList.remove('hidden');
      } else {
        orchardVideo.pause();
        if (videoPlayIcon) videoPlayIcon.classList.remove('hidden');
        if (videoPauseIcon) videoPauseIcon.classList.add('hidden');
      }
    });

    // IntersectionObserver to auto-pause when scrolled out of view and resume when in view
    if ('IntersectionObserver' in window) {
      const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Only auto-play if video was not paused by explicit user action
            if (videoPlayIcon && videoPlayIcon.classList.contains('hidden')) {
              orchardVideo.play().catch(() => {});
            }
          } else {
            orchardVideo.pause();
          }
        });
      }, { threshold: 0.2 });
      videoObserver.observe(orchardVideo);
    }
  }
});
