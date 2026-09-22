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
      (inTrucos ? '<button class="appbar-presenter" aria-label="Guion del truco" title="Modo presentador">&#127917;</button>' : '') +
      '<button class="appbar-badge" data-premium-badge aria-label="Matemágica PRO">PRO</button>';
    bar.querySelector('.appbar-title').textContent = inTrucos ? (document.title || 'Truco') : 'Matemágica';
    document.body.insertBefore(bar, document.body.firstChild);

    bar.querySelector('.appbar-badge').addEventListener('click', function () {
      if (window.Ads) Ads.showUpsell();
    });

    var btn = bar.querySelector('.appbar-presenter');
    if (btn) {
      btn.addEventListener('click', function () {
        if (window.Presenter) Presenter.show();
      });
      refreshPresenterButton(bar);
      document.addEventListener('presenterchange', function () { refreshPresenterButton(bar); });
    }
  }

  function refreshPresenterButton(bar) {
    var btn = bar.querySelector('.appbar-presenter');
    if (!btn) return;
    var visible = window.Presenter && Presenter.enabled() && Presenter.hasScript();
    btn.style.display = visible ? '' : 'none';
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
    if (window.Presenter) Presenter.initToggle();
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