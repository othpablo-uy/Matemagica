(function () {
  'use strict';

  var inTrucos = /\/trucos\//.test(location.pathname);
  var swPath = inTrucos ? '../sw.js' : './sw.js';

  function buildAppbar() {
    if (document.querySelector('.appbar')) return;
    var bar = document.createElement('header');
    bar.className = 'appbar';
    bar.innerHTML =
      (inTrucos ? '<a class="appbar-back" href="../index.html" aria-label="Volver al menú">\u2039</a>' : '') +
      '<span class="appbar-title"></span>' +
      '<button class="appbar-badge" data-premium-badge aria-label="Matemágica PRO">PRO</button>';
    if (inTrucos) {
      bar.querySelector('.appbar-title').textContent = (document.title || 'Truco');
    } else {
      bar.querySelector('.appbar-title').textContent = 'Matemágica';
    }
    document.body.insertBefore(bar, document.body.firstChild);
    bar.querySelector('.appbar-badge').addEventListener('click', function () {
      if (window.Ads) Ads.showUpsell();
    });
  }

  function registerSW() {
    if (!('serviceWorker' in navigator)) return;
    window.addEventListener('load', function () {
      navigator.serviceWorker.register(swPath).catch(function () {});
    });
  }

  function boot() {
    buildAppbar();
    if (window.Ads) Ads.init();
    registerSW();
    if (inTrucos && window.Ads) {
      Ads.maybeInterstitial().then(function () {});
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();