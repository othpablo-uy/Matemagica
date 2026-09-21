(function () {
  'use strict';
  var PREMIUM_KEY = 'matemagica_premium';
  var COUNT_KEY = 'matemagica_ads_count';
  var UNLOCK_PRICE = 'US$ 3,99';
  var EVERY_N = 3;

  function isPremium() {
    try { return localStorage.getItem(PREMIUM_KEY) === '1'; } catch (e) { return false; }
  }

  function ensureBanner() {
    var el = document.getElementById('ad-banner');
    if (!el) {
      el = document.createElement('div');
      el.id = 'ad-banner';
      document.body.appendChild(el);
    }
    return el;
  }

  function renderBanner() {
    var el = ensureBanner();
    if (isPremium()) {
      el.innerHTML = '';
      el.className = 'off';
    } else {
      /* TODO Play Store: reemplazar por bloque real de AdMob/AdSense */
      el.innerHTML = '<span>Publicidad</span>';
      el.className = '';
    }
  }

  function maybeInterstitial() {
    return new Promise(function (resolve) {
      if (isPremium() || !navigator.onLine) return resolve(false);
      var n = 0;
      try { n = parseInt(localStorage.getItem(COUNT_KEY) || '0', 10); } catch (e) {}
      n = n + 1;
      try { localStorage.setItem(COUNT_KEY, String(n)); } catch (e) {}
      if (n % EVERY_N !== 0) return resolve(false);
      showInterstitial(resolve);
    });
  }

  function showInterstitial(done) {
    var el = document.createElement('div');
    el.className = 'ad-interstitial';
    el.innerHTML =
      '<div class="ad-box">' +
      '<div class="ad-label">Publicidad</div>' +
      '<p>Aquí va el anuncio a pantalla completa (AdMob interstitial).</p>' +
      '<button class="ad-close">Cerrar</button>' +
      '</div>';
    document.body.appendChild(el);
    el.querySelector('.ad-close').addEventListener('click', function () {
      el.remove();
      done(true);
    });
  }

  function showUpsell() {
    if (isPremium()) return;
    var el = document.createElement('div');
    el.className = 'ad-interstitial';
    el.innerHTML =
      '<div class="ad-box">' +
      '<div class="ad-label">Matemágica PRO</div>' +
      '<h2>Adiós, anuncios</h2>' +
      '<p>Quitá la publicidad y apoyá este pack de magia.</p>' +
      '<p class="price">' + UNLOCK_PRICE + '</p>' +
      '<div class="ad-actions">' +
      '<button class="ad-buy">Comprar</button>' +
      '<button class="ad-close">Ahora no</button>' +
      '</div>' +
      '<p class="hint">Demo web: se activa al instante. En Play Store se cobra con Google Play Billing.</p>' +
      '</div>';
    document.body.appendChild(el);
    el.querySelector('.ad-buy').addEventListener('click', function () {
      try { localStorage.setItem(PREMIUM_KEY, '1'); } catch (e) {}
      el.remove();
      renderBanner();
      refreshBadges();
    });
    el.querySelector('.ad-close').addEventListener('click', function () {
      el.remove();
    });
  }

  function refreshBadges() {
    var on = isPremium();
    document.querySelectorAll('[data-premium-badge]').forEach(function (b) {
      b.classList.toggle('on', on);
      b.textContent = on ? 'PRO' : 'PRO';
    });
  }

  window.Ads = {
    isPremium: isPremium,
    unlock: function () { try { localStorage.setItem(PREMIUM_KEY, '1'); } catch (e) {} renderBanner(); refreshBadges(); },
    renderBanner: renderBanner,
    maybeInterstitial: maybeInterstitial,
    showUpsell: showUpsell,
    init: function () { renderBanner(); refreshBadges(); }
  };
})();