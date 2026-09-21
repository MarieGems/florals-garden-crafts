/* Contact form submit handling, shared by the home page and the contact page.
   Every <form class="contact-form"> posts to contact-handler.php in the background
   and shows the result in its own .form-status line, so the visitor never leaves the page. */
(function () {
  document.querySelectorAll('form.contact-form').forEach(function (form) {
    var btn = form.querySelector('button[type="submit"]');
    var status = form.querySelector('.form-status');
    if (!btn || !status) return;
    var label = btn.textContent;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      btn.disabled = true;
      btn.textContent = 'Sending...';
      status.textContent = '';
      status.classList.remove('form-status-error');

      fetch('contact-handler.php', { method: 'POST', body: new FormData(form) })
        .then(function (r) { return r.json(); })
        .then(function (data) {
          if (data.ok) {
            status.textContent = "Thanks — your message is on its way! I'll get back to you soon.";
            form.reset();
          } else {
            status.textContent = data.error || 'Something went wrong — please try again.';
            status.classList.add('form-status-error');
          }
        })
        .catch(function () {
          status.textContent = 'Something went wrong — please try again in a little while.';
          status.classList.add('form-status-error');
        })
        .then(function () {
          btn.textContent = label;
          btn.disabled = false;
        });
    });
  });
})();
