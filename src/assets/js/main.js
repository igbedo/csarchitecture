function setYear() {
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
}

function initNav() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("primary-nav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!open));
    nav.classList.toggle("open", !open);
  });

  // Active link highlight
  const path = location.pathname.endsWith("/") ? location.pathname : location.pathname + "/";
  document.querySelectorAll("[data-nav]").forEach((a) => {
    if (a.getAttribute("data-nav") === path) a.classList.add("active");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setYear();
  initNav();
});

// Expose for any deferred/injected usage if needed
window.setYear = setYear;
window.initNav = initNav;

