/* Flodesk newsletter signup (formId 6aaf0e5309efceba11a1e3c9).
   Same universal-snippet loader used on marieharvey.com. It only runs on pages
   that contain the container div, so it is safe to include on any page.
   The form's heading and body text come from Flodesk's own form editor. */
(function () {
  var formId = '6aaf0e5309efceba11a1e3c9';
  if (!document.getElementById('fd-form-' + formId)) return;

  (function (w, d, t, h, s, n) {
    if (d.querySelector('script[src*="flodesk"]')) return;
    w.FlodeskObject = n;
    var fn = function () { (w[n].q = w[n].q || []).push(arguments); };
    w[n] = w[n] || fn;
    var f = d.getElementsByTagName(t)[0];
    var v = '?v=' + Math.floor(new Date().getTime() / (120 * 1000)) * 60;
    var sm = d.createElement(t);
    sm.async = true; sm.type = 'module'; sm.src = h + s + '.mjs' + v;
    f.parentNode.insertBefore(sm, f);
    var sn = d.createElement(t);
    sn.async = true; sn.noModule = true; sn.src = h + s + '.js' + v;
    f.parentNode.insertBefore(sn, f);
  })(window, document, 'script', 'https://assets.flodesk.com', '/universal', 'fd');

  window.fd('form', {
    formId: formId,
    containerEl: '#fd-form-' + formId
  });
})();
