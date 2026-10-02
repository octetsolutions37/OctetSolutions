/* ==========================================================
   Octet Solutions - script du site
   Fichier : js/main.js
   1) menu mobile
   2) en-tête qui se précise quand on défile
   3) petites animations à l'apparition des blocs
   4) jour d'aujourd'hui dans la semaine + phrase d'accueil
   5) envoi du formulaire de devis (service Web3Forms)
   ========================================================== */

// 1) Menu mobile
(function () {
  var bouton = document.getElementById('menu-btn');
  var menu = document.getElementById('menu');
  if (!bouton || !menu) return;
  function fermer() {
    menu.classList.remove('open');
    bouton.setAttribute('aria-expanded', 'false');
    bouton.setAttribute('aria-label', 'Ouvrir le menu');
  }
  bouton.addEventListener('click', function () {
    var ouvert = menu.classList.toggle('open');
    bouton.setAttribute('aria-expanded', ouvert ? 'true' : 'false');
    bouton.setAttribute('aria-label', ouvert ? 'Fermer le menu' : 'Ouvrir le menu');
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') fermer(); });
})();

// 2) En-tête : fine ligne quand on a défilé
(function () {
  var h = document.querySelector('.site-header');
  if (!h) return;
  function maj() { h.classList.toggle('scrolled', window.scrollY > 8); }
  maj();
  window.addEventListener('scroll', maj, { passive: true });
})();

// 3) Apparition au défilement
(function () {
  var cibles = document.querySelectorAll('.rv, .path, .rings, .wk');
  if (!cibles.length) return;
  if (!('IntersectionObserver' in window)) {
    cibles.forEach(function (c) { c.classList.add('in'); });
    return;
  }
  var obs = new IntersectionObserver(function (entrees) {
    entrees.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.18, rootMargin: '0px 0px -6% 0px' });
  cibles.forEach(function (c) { obs.observe(c); });
})();

// 4) Aujourd'hui : met le jour en évidence dans la semaine
(function () {
  var jour = new Date().getDay(); // 0 = dimanche, 1 = lundi ... 6 = samedi
  var lignes = document.querySelectorAll('.day[data-day="' + jour + '"]');
  lignes.forEach(function (ligne) {
    ligne.classList.add('today');
    var em = document.createElement('em');
    em.textContent = 'Aujourd\u2019hui';
    ligne.appendChild(em);
  });
})();

// 5) Formulaire de demande de devis
(function () {
  var form = document.getElementById('devis-form');
  if (!form) return;
  var msg = document.getElementById('form-msg');
  var bouton = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    // Piège anti-robots : ce champ caché doit rester vide
    if (form.botcheck && form.botcheck.checked) return;

    var texteBouton = bouton.textContent;
    bouton.disabled = true;
    bouton.textContent = 'Envoi en cours…';
    msg.hidden = true;

    var donnees = {};
    new FormData(form).forEach(function (v, k) { donnees[k] = v; });

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(donnees)
    })
      .then(function (r) { return r.json(); })
      .then(function (r) {
        if (r.success) {
          form.reset();
          msg.className = 'form-msg ok';
          msg.textContent = 'Merci, votre demande est bien envoyée. Je vous recontacte dès que possible. Pour une urgence, appelez le 07 60 18 54 14.';
        } else {
          throw new Error('refus');
        }
      })
      .catch(function () {
        msg.className = 'form-msg err';
        msg.textContent = 'Votre demande n’a pas pu être envoyée. Merci de m’appeler au 07 60 18 54 14 ou de m’écrire à octetsolutions@outlook.fr.';
      })
      .finally(function () {
        msg.hidden = false;
        msg.focus();
        bouton.disabled = false;
        bouton.textContent = texteBouton;
      });
  });
})();

// 6) Ouvre le détail d'une prestation quand on arrive par un lien (ex. services.html#montage)
(function () {
  function ouvrir() {
    var id = decodeURIComponent(location.hash.slice(1));
    if (!id) return;
    var el = document.getElementById(id);
    if (el && el.tagName === 'DETAILS') {
      el.open = true;
      el.scrollIntoView({ block: 'start' });
    }
  }
  ouvrir();
  window.addEventListener('hashchange', ouvrir);
})();
