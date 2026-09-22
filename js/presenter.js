(function () {
  'use strict';
  var KEY = 'matemagica_presenter';

  function enabled() {
    try {
      var v = localStorage.getItem(KEY);
      return v === null ? true : v === '1';
    } catch (e) { return true; }
  }

  function setEnabled(on) {
    try { localStorage.setItem(KEY, on ? '1' : '0'); } catch (e) {}
    document.dispatchEvent(new CustomEvent('presenterchange'));
  }

  function getScript() {
    var el = document.getElementById('presenter-script');
    return el ? (el.textContent || '').trim() : '';
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function list(items) {
    return (items || []).map(function (s) { return '<li>' + escapeHtml(s) + '</li>'; }).join('');
  }

  function show() {
    var raw = getScript();
    if (!raw) return;
    var data;
    try {
      data = JSON.parse(raw);
    } catch (e) {
      data = { title: document.title, say: [raw], how: [] };
    }

    var el = document.createElement('div');
    el.className = 'presenter-overlay';
    el.innerHTML =
      '<div class="presenter-box">' +
      '<div class="presenter-head"><span>&#127917; Guion</span><button class="presenter-close" aria-label="Cerrar">&#10005;</button></div>' +
      '<h3>' + escapeHtml(data.title || document.title) + '</h3>' +
      (data.say && data.say.length ? '<h4>Qué decir</h4><ol class="presenter-say">' + list(data.say) + '</ol>' : '') +
      (data.how && data.how.length ? '<h4>Qué hacer</h4><ol class="presenter-how">' + list(data.how) + '</ol>' : '') +
      '<div class="presenter-foot"><button class="presenter-off">Desactivar modo presentador</button></div>' +
      '</div>';
    document.body.appendChild(el);

    el.querySelector('.presenter-close').addEventListener('click', function () { el.remove(); });
    el.querySelector('.presenter-off').addEventListener('click', function () {
      setEnabled(false);
      el.remove();
    });
  }

  function initToggle() {
    var box = document.querySelector('[data-presenter-toggle]');
    if (!box) return;

    function render() {
      box.innerHTML = '';
      var label = document.createElement('label');
      label.className = 'switch';
      label.innerHTML =
        '<input type="checkbox">' +
        '<span class="track"><span class="knob"></span></span>' +
        '<span class="switch-label">Modo presentador (guion en pantalla)</span>';
      var input = label.querySelector('input');
      input.checked = enabled();
      input.addEventListener('change', function () { setEnabled(input.checked); });
      box.appendChild(label);
    }

    render();
    document.addEventListener('presenterchange', render);
  }

  window.Presenter = {
    enabled: enabled,
    setEnabled: setEnabled,
    hasScript: function () { return !!getScript(); },
    show: show,
    initToggle: initToggle
  };
})();