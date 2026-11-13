// Menu mobile accessible, filtres du portfolio, animations et formulaire WhatsApp.
const menuButton = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');

function closeMenu() {
  if (!menuButton || !mainNav) return;
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Ouvrir le menu');
  mainNav.classList.remove('is-open');
}

if (menuButton && mainNav) {
  menuButton.addEventListener('click', () => {
    const isExpanded = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isExpanded));
    menuButton.setAttribute('aria-label', isExpanded ? 'Ouvrir le menu' : 'Fermer le menu');
    mainNav.classList.toggle('is-open', !isExpanded);
  });

  mainNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });
}

// Filtrer les aperçus conceptuels de la galerie.
const filterButtons = document.querySelectorAll('.filter-button');
const portfolioCards = document.querySelectorAll('.portfolio-card');
const portfolioSummary = document.querySelector('.portfolio-summary');

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const selectedFilter = button.dataset.filter;

    filterButtons.forEach((filterButton) => {
      const isSelected = filterButton === button;
      filterButton.classList.toggle('is-active', isSelected);
      filterButton.setAttribute('aria-pressed', String(isSelected));
    });

    portfolioCards.forEach((card) => {
      const matchesFilter = selectedFilter === 'all' || card.dataset.category === selectedFilter;
      card.hidden = !matchesFilter;
    });

    if (portfolioSummary) {
      const visibleCount = [...portfolioCards].filter((card) => !card.hidden).length;
      const summaryTitle = portfolioSummary.querySelector('strong');
      const summaryText = portfolioSummary.querySelector('span');
      const selectedLabel = button.textContent.replace(/\d+/g, '').trim();
      if (summaryTitle) summaryTitle.textContent = `${visibleCount} concept${visibleCount > 1 ? 's' : ''}`;
      if (summaryText) summaryText.textContent = selectedFilter === 'all'
        ? '15 exemples par catégorie · Appuie sur un filtre pour explorer.'
        : `Exemples de ${selectedLabel.toLowerCase()} · Concepts de démonstration.`;
    }
  });
});

// Faire apparaître les éléments au défilement, avec un affichage de secours.
const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -25px 0px' });

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

// Donner un léger effet de profondeur à l’illustration de l’accueil sur ordinateur.
const homeHero = document.querySelector('.page-index .hero');
const heroArt = document.querySelector('.page-index .hero-art');
const supportsPointerMotion = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (homeHero && heroArt && supportsPointerMotion) {
  homeHero.addEventListener('pointermove', (event) => {
    const heroBounds = homeHero.getBoundingClientRect();
    homeHero.style.setProperty('--pointer-x', `${((event.clientX - heroBounds.left) / heroBounds.width) * 100}%`);
    homeHero.style.setProperty('--pointer-y', `${((event.clientY - heroBounds.top) / heroBounds.height) * 100}%`);

    if (!heroArt.contains(event.target)) {
      heroArt.style.setProperty('--tilt-x', '0deg');
      heroArt.style.setProperty('--tilt-y', '0deg');
      return;
    }

    const artBounds = heroArt.getBoundingClientRect();
    const horizontal = (event.clientX - artBounds.left) / artBounds.width - 0.5;
    const vertical = (event.clientY - artBounds.top) / artBounds.height - 0.5;
    heroArt.style.setProperty('--tilt-x', `${(vertical * -7).toFixed(2)}deg`);
    heroArt.style.setProperty('--tilt-y', `${(horizontal * 9).toFixed(2)}deg`);
  }, { passive: true });

  heroArt.addEventListener('pointerleave', () => {
    heroArt.style.setProperty('--tilt-x', '0deg');
    heroArt.style.setProperty('--tilt-y', '0deg');
  });
}

// Le bouton de retour en haut apparaît après le début du défilement.
const backToTop = document.querySelector('.back-to-top');
const updateBackToTop = () => {
  if (backToTop) backToTop.classList.toggle('is-visible', window.scrollY > 500);
};
window.addEventListener('scroll', updateBackToTop, { passive: true });
updateBackToTop();

// Le formulaire ouvre WhatsApp avec les informations saisies, sans serveur.
const contactForm = document.querySelector('#contact-form');
const formError = document.querySelector('#form-error');
const whatsappNumber = '2290162383722';

if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (formError) formError.hidden = true;

    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      if (formError) formError.hidden = false;
      return;
    }

    const formData = new FormData(contactForm);
    const message = [
      'Bonjour IB Design Digital, je souhaite un devis.',
      '',
      `Nom : ${formData.get('name').trim()}`,
      `Téléphone : ${formData.get('phone').trim()}`,
      `Service souhaité : ${formData.get('service')}`,
      `Mon projet : ${formData.get('message').trim()}`,
    ].join('\n');

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    const whatsappWindow = window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

    // Certains navigateurs bloquent les nouveaux onglets : ouvrir le lien ici en secours.
    if (!whatsappWindow) window.location.href = whatsappUrl;
  });
}
