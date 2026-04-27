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
    // -----------------------------------------------------------------
    // Feature card modals
    // Any element with .modal-trigger opens a shared #feature-modal
    // showing its heading + paragraph content at larger typography.
    // -----------------------------------------------------------------
    var modal = document.getElementById('feature-modal');
    var triggers = document.querySelectorAll('.modal-trigger');
    if (modal && triggers.length) {
      var modalTitle = modal.querySelector('.modal-title');
      var modalBody = modal.querySelector('.modal-body');
      var modalClose = modal.querySelector('.modal-close');
      var modalDialog = modal.querySelector('.modal-dialog');
      var lastTrigger = null;

      function openModal(title, body, trigger) {
        modalTitle.textContent = title;
        modalBody.innerHTML = body;
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        lastTrigger = trigger;
        document.body.style.overflow = 'hidden';
        if (modalClose) modalClose.focus();
      }
      function closeModal() {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (lastTrigger) lastTrigger.focus();
        lastTrigger = null;
      }

      if (modalClose) modalClose.addEventListener('click', closeModal);
      modal.addEventListener('click', function (e) {
        if (e.target === modal) closeModal();
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
      });

      triggers.forEach(function (card) {
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        card.addEventListener('click', function () {
          var titleEl = card.querySelector('h2, h3, h4');
          var paragraphs = card.querySelectorAll('p');
          var title = titleEl ? titleEl.textContent : '';
          var bodyHtml = '';
          paragraphs.forEach(function (p) { bodyHtml += '<p>' + p.innerHTML + '</p>'; });
          openModal(title, bodyHtml, card);
        });
        card.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            card.click();
          }
        });
      });
    }
  });
})();
