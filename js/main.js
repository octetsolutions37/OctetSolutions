/* ==========================================================
   Octet Solutions - petit script du site
   Fichier : js/main.js
   1) ouvre / ferme le menu sur mobile
   2) envoie le formulaire de devis (service Web3Forms)
   ========================================================== */

// 1) Menu mobile
(function () {
  var bouton = document.getElementById('menu-btn');
  var menu = document.getElementById('menu');
  if (!bouton || !menu) return;
  bouton.addEventListener('click', function () {
    var ouvert = menu.classList.toggle('open');
    bouton.setAttribute('aria-expanded', ouvert ? 'true' : 'false');
    bouton.setAttribute('aria-label', ouvert ? 'Fermer le menu' : 'Ouvrir le menu');
  });
})();

// 2) Formulaire de demande de devis
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
