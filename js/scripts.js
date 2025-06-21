document.addEventListener('DOMContentLoaded', () => {
  // Email Validation Modal
  const emailModal = document.querySelector('#email-modal');
  const emailInput = document.querySelector('#email-input');
  const emailSubmit = document.querySelector('#email-submit');
  const emailError = document.querySelector('#email-error');
  const hiddenContents = document.querySelectorAll('.hidden-content');

  if (emailModal && emailInput && emailSubmit && emailError) {
    // Check if email is already validated in localStorage
    const savedEmail = localStorage.getItem('validatedEmail');
    if (savedEmail && isValidEmail(savedEmail)) {
      emailModal.classList.add('hidden');
      hiddenContents.forEach(content => content.classList.remove('hidden'));
    }

    emailSubmit.addEventListener('click', () => {
      const email = emailInput.value.trim();
      if (isValidEmail(email)) {
        localStorage.setItem('validatedEmail', email);
        emailModal.classList.add('hidden');
        hiddenContents.forEach(content => content.classList.remove('hidden'));
        emailError.classList.add('hidden');
      } else {
        emailError.classList.remove('hidden');
        emailInput.focus();
      }
    });

    // Allow Enter key to submit email
    emailInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        emailSubmit.click();
      }
    });

    function isValidEmail(email) {
      const regex = /^[^\s@]+@etu\.uae\.ac\.ma$/;
      return regex.test(email);
    }
  }

  // Navbar Toggle
  const menuToggle = document.querySelector('#menu-toggle');
  const menuClose = document.querySelector('#menu-close');
  const mobileMenu = document.querySelector('#mobile-menu');

  if (menuToggle && menuClose && mobileMenu) {
    menuToggle.addEventListener('click', () => mobileMenu.classList.remove('hidden'));
    menuClose.addEventListener('click', () => mobileMenu.classList.add('hidden'));
  }

  // Professor Search
  const searchInput = document.querySelector('#professor-search');
  const professorList = document.querySelector('#professor-list');
  const noResults = document.querySelector('#no-results');

  if (searchInput && professorList && noResults) {
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.toLowerCase().trim();
      const professorCards = professorList.querySelectorAll('.professor-card');
      let hasResults = false;

      professorCards.forEach(card => {
        const name = card.querySelector('h3').textContent.toLowerCase();
        card.style.display = name.includes(query) ? 'block' : 'none';
        if (name.includes(query)) hasResults = true;
      });

      noResults.style.display = hasResults ? 'none' : 'block';
    });
  }

  // Highlight Active Nav Link and Footer Link
  const navLinks = document.querySelectorAll('.nav-link, footer ul li a');
  const currentPage = window.location.pathname.split('/').pop();

  navLinks.forEach(link => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });

  // Dynamic Copyright Year
  const copyrightYear = document.querySelector('#footer-copyright-year');
  if (copyrightYear) copyrightYear.textContent = new Date().getFullYear();

  // Theme Toggle
  const themeToggle = document.querySelector('#theme-toggle');
  const themeIcon = document.querySelector('#theme-icon');
  if (themeToggle && themeIcon) {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeLabel(savedTheme);

    themeToggle.addEventListener('click', () => {
      const newTheme = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateThemeLabel(newTheme);
    });

    function updateThemeLabel(theme) {
      themeIcon.className = `fas fa-${theme === 'light' ? 'moon' : 'sun'}`;
      themeToggle.innerHTML = `<i id="theme-icon" class="${themeIcon.className}" aria-hidden="true"></i> Thème ${theme === 'light' ? 'Sombre' : 'Clair'}`;
    }
  }

  // Fullscreen Mode
  const fullscreenToggle = document.querySelector('#fullscreen-toggle');
  if (fullscreenToggle) {
    fullscreenToggle.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => console.error('Fullscreen error:', err));
        document.body.classList.add('fullscreen');
        fullscreenToggle.innerHTML = '<i class="fas fa-compress"></i> Quitter Plein Écran';
      } else {
        document.exitFullscreen();
        document.body.classList.remove('fullscreen');
        fullscreenToggle.innerHTML = '<i class="fas fa-expand"></i> Plein Écran';
      }
    });
  }

  // Spotify Toggle
  const spotifyElements = {
    toggleBtn: document.querySelector('#toggle-spotify'),
    container: document.querySelector('#spotify-container'),
    placeholder: document.querySelector('#spotify-placeholder')
  };

  if (spotifyElements.toggleBtn && spotifyElements.container && spotifyElements.placeholder) {
    const savedSpotifyState = localStorage.getItem('spotifyVisible') !== 'false';
    let isLoaded = false;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !isLoaded && savedSpotifyState) {
        spotifyElements.placeholder.innerHTML = `
          <iframe style="border-radius:12px" src="https://open.spotify.com/embed/playlist/0oPyDVNdgcPFAWmOYSK7O1?utm_source=generator" width="100%" height="380" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
        `;
        isLoaded = true;
        observer.disconnect();
      }
    }, { threshold: 0.1 });

    observer.observe(spotifyElements.container);

    spotifyElements.container.style.display = savedSpotifyState ? 'block' : 'none';
    spotifyElements.toggleBtn.textContent = savedSpotifyState ? 'Masquer Spotify' : 'Afficher Spotify';

    spotifyElements.toggleBtn.addEventListener('click', () => {
      const isVisible = spotifyElements.container.style.display !== 'none';
      spotifyElements.container.style.display = isVisible ? 'none' : 'block';
      spotifyElements.toggleBtn.textContent = isVisible ? 'Afficher Spotify' : 'Masquer Spotify';
      localStorage.setItem('spotifyVisible', !isVisible);
      if (!isLoaded && !isVisible) {
        spotifyElements.placeholder.innerHTML = `
          <iframe style="border-radius:12px" src="https://open.spotify.com/embed/playlist/0oPyDVNdgcPFAWmOYSK7O1?utm_source=generator" width="100%" height="380" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
        `;
        isLoaded = true;
      }
    });
  }
});