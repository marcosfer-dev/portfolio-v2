const LINKS = {
  github: "https://github.com/marcosfer-dev",
  linkedin: "https://www.linkedin.com/in/marcosferbispo/",
  email: "mailto:fernandesmarcos.programador@gmail.com",
  rarvelle: "https://github.com/marcosfer-dev/rarvelle-api",
};

(() => {
  "use strict";

  const root = document.documentElement;
  root.classList.add("js");

  const body = document.body;
  const sidebar = document.getElementById("sidebar");
  const menuBtn = document.getElementById("menu-btn");
  const scrim = document.getElementById("scrim");
  const collapseBtn = document.getElementById("collapse");
  const mobile = window.matchMedia("(max-width: 900px)");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  document.querySelectorAll("[data-link]").forEach((el) => {
    const url = LINKS[el.dataset.link];
    if (url) el.href = url;
    if (el.dataset.show) el.textContent = url.replace(/^mailto:|^https?:\/\//, "");
  });
  document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));

  function setCollapsed(collapsed) {
    body.classList.toggle("is-collapsed", collapsed);
    collapseBtn.setAttribute("aria-expanded", String(!collapsed));
    collapseBtn.setAttribute("aria-label", collapsed ? "Expandir menu lateral" : "Recolher menu lateral");
    collapseBtn.querySelector(".collapse__icon").textContent = collapsed ? "→" : "←";
    try { localStorage.setItem("menu-recolhido", collapsed ? "1" : "0"); } catch (e) { /* armazenamento indisponível */ }
  }
  collapseBtn.addEventListener("click", () => setCollapsed(!body.classList.contains("is-collapsed")));
  try { if (localStorage.getItem("menu-recolhido") === "1") setCollapsed(true); } catch (e) { /* ignora */ }

  function setMenu(open) {
    sidebar.classList.toggle("is-open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.textContent = open ? "Fechar" : "Menu";
    body.style.overflow = open ? "hidden" : "";
    syncInert();
  }

  function syncInert() {
    sidebar.inert = mobile.matches && !sidebar.classList.contains("is-open");
  }
  menuBtn.addEventListener("click", () => setMenu(!sidebar.classList.contains("is-open")));
  sidebar.querySelectorAll(".nav a").forEach((a) => a.addEventListener("click", () => mobile.matches && setMenu(false)));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && sidebar.classList.contains("is-open")) { setMenu(false); menuBtn.focus(); }
  });
  mobile.addEventListener("change", () => { if (!mobile.matches) setMenu(false); syncInert(); });
  syncInert();

  const navLinks = [...sidebar.querySelectorAll(".nav a")];
  const sections = navLinks.map((a) => document.querySelector(a.getAttribute("href"))).filter(Boolean);
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((a) => {
        const active = a.getAttribute("href") === "#" + entry.target.id;
        if (active) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
      });
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach((s) => spy.observe(s));

  const reveals = document.querySelectorAll(".reveal");
  if (reduceMotion.matches || !("IntersectionObserver" in window)) {
    reveals.forEach((el) => el.classList.add("is-visible"));
  } else {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add("is-visible"); obs.unobserve(entry.target); }
      });
    }, { threshold: 0.12 });
    reveals.forEach((el) => io.observe(el));
  }
})();