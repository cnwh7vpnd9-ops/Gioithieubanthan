(() => {
  const menuToggle = document.querySelector("#menuToggle");
  const navLinks = document.querySelector("#navLinks");
  const themeToggle = document.querySelector("#themeToggle");
  const themeIcon = document.querySelector(".theme-icon");
  const progress = document.querySelector("#scrollProgress");
  const toast = document.querySelector("#toast");

  // Mobile navigation
  menuToggle?.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    navLinks?.classList.toggle("open", !isOpen);
  });

  navLinks?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuToggle?.setAttribute("aria-expanded", "false");
    });
  });

  // Remember the visitor's light/dark preference on this device
  const savedTheme = localStorage.getItem("little-space-theme");
  if (savedTheme === "dark") document.body.classList.add("dark-mode");
  updateThemeIcon();

  themeToggle?.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem(
      "little-space-theme",
      document.body.classList.contains("dark-mode") ? "dark" : "light"
    );
    updateThemeIcon();
  });

  function updateThemeIcon() {
    if (!themeIcon) return;
    const isDark = document.body.classList.contains("dark-mode");
    themeIcon.textContent = isDark ? "☀" : "☾";
    themeToggle?.setAttribute("aria-label", isDark ? "Chuyển sang giao diện sáng" : "Chuyển sang giao diện tối");
  }

  // Scroll progress indicator
  function updateProgress() {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const percent = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    if (progress) progress.style.width = percent + "%";
  }
  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();

  // Reveal sections as they enter the viewport
  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  // Footer year
  const year = document.querySelector("#currentYear");
  if (year) year.textContent = new Date().getFullYear();

  // Close the mobile menu with Escape
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && navLinks?.classList.contains("open")) {
      navLinks.classList.remove("open");
      menuToggle?.setAttribute("aria-expanded", "false");
      menuToggle?.focus();
    }
  });

  // Keep a tiny accessible toast utility available for future enhancements.
  window.showLittleSpaceToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    window.clearTimeout(window.__littleSpaceToastTimer);
    window.__littleSpaceToastTimer = window.setTimeout(() => toast.classList.remove("show"), 2400);
  };
})();
