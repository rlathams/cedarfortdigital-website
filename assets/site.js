// Cedar Fort Digital — minimal site JS.
(function () {
  'use strict';
  document.addEventListener('DOMContentLoaded', function () {
    var toggle = document.querySelector('.nav-toggle');
    var links = document.getElementById('navlinks');
    if (toggle && links) {
      toggle.addEventListener('click', function () {
        links.classList.toggle('open');
      });
    }
    var form = document.getElementById('contact-form');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var btn = form.querySelector('button.submit');
        if (btn) {
          btn.textContent = 'Sending…';
          btn.disabled = true;
        }
        fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        }).then(function (response) {
          if (response.ok) {
            if (btn) {
              btn.textContent = 'Thank you. We will be in touch.';
              btn.style.background = 'var(--brown-mid)';
              btn.style.cursor = 'default';
            }
            form.reset();
          } else {
            if (btn) {
              btn.textContent = 'Send failed — please email Rachel directly';
              btn.disabled = false;
            }
          }
        }).catch(function () {
          if (btn) {
            btn.textContent = 'Send failed — please email Rachel directly';
            btn.disabled = false;
          }
        });
      });
    }
  });
})();
