// static/js/animations.js
document.addEventListener("DOMContentLoaded", function () {
  // Mobile menu toggle
  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navMenu");
  const menuOverlay = document.getElementById("menuOverlay");

  if (menuToggle && navMenu && menuOverlay) {
    menuToggle.addEventListener("click", function () {
      navMenu.classList.toggle("active");
      menuOverlay.style.display = navMenu.classList.contains("active")
        ? "block"
        : "none";
    });

    menuOverlay.addEventListener("click", function () {
      navMenu.classList.remove("active");
      menuOverlay.style.display = "none";
    });
  }
});

function showLoader() {
  document.getElementById("loader").style.display = "block";
}

function hideLoader() {
  document.getElementById("loader").style.display = "none";
}
