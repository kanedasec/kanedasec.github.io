(function () {
  const root = document.documentElement;
  const storedTheme = localStorage.getItem("theme");

  if (storedTheme === "light" || storedTheme === "dark") {
    root.setAttribute("data-theme", storedTheme);
  }

  function toggleTheme() {
    const current = root.getAttribute("data-theme") || "dark";
    const next = current === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  }

  function wireButton(id) {
    const btn = document.getElementById(id);
    if (!btn) return;
    btn.addEventListener("click", function () {
      toggleTheme();
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    wireButton("theme-toggle");
    wireButton("theme-toggle-footer");
  });
})();
