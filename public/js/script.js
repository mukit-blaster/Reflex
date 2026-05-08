// ---------- Header auth state ----------
document.addEventListener("DOMContentLoaded", function () {
  const loginBtn = document.getElementById("login-btn");
  const signupBtn = document.getElementById("signup-btn");
  const dashboardBtn = document.getElementById("dashboard-btn");
  const logoutBtn = document.getElementById("logout-btn");

  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");

  if (isLoggedIn && username) {
    if (loginBtn) {
      loginBtn.innerHTML = `<i class="fa fa-user" aria-hidden="true"></i><span>${username}</span>`;
      loginBtn.removeAttribute("href");
      loginBtn.classList.add("logged-in");
    }
    if (signupBtn) signupBtn.style.display = "none";
    if (logoutBtn) logoutBtn.style.display = "inline-flex";
    if (role === "admin" && dashboardBtn) dashboardBtn.style.display = "inline-flex";
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("username");
      localStorage.removeItem("role");
      localStorage.removeItem("token");
      window.location.href = "index.html";
    });
  }
});

// ---------- Back-to-top button ----------
const mybutton = document.getElementById("btn-back-to-top");

if (mybutton) {
  window.addEventListener("scroll", function () {
    if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
      mybutton.style.display = "block";
    } else {
      mybutton.style.display = "none";
    }
  });

  mybutton.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// ---------- Animated hero text ----------
const sentences = [
  "Welcome to Reflex!",
  "Enhance your well-being with us.",
  "Explore mindfulness, music, and counseling.",
];

let sentenceIndex = 0;
const typingSpeed = 100;
const pauseDuration = 2000;

function typeSentence() {
  const textElement = document.getElementById("animated-text");
  if (!textElement) return;
  textElement.textContent = "";

  const currentSentence = sentences[sentenceIndex];
  let charIndex = 0;

  const typingInterval = setInterval(() => {
    if (charIndex < currentSentence.length) {
      textElement.textContent += currentSentence.charAt(charIndex);
      charIndex++;
    } else {
      clearInterval(typingInterval);
      setTimeout(() => {
        sentenceIndex = (sentenceIndex + 1) % sentences.length;
        typeSentence();
      }, pauseDuration);
    }
  }, typingSpeed);
}

typeSentence();

// ---------- Service-card click routing ----------
// Maps a button id to the page it should open. Pages that don't exist yet
// are left out — those cards just show a "coming soon" alert.
const subpages = {
  exploreBtn: "booking.html",      // Psychiatrists Consult
  "yoga-therapy": "yoga.html",
  "reading-therapy": "reading.html",
};

const comingSoonButtons = ["audio-therapy", "exploreLaughing"];

function isUserLoggedIn() {
  return localStorage.getItem("isLoggedIn") === "true";
}

function showLoginRequired() {
  const alertEl = document.getElementById("customAlert");
  if (alertEl) alertEl.style.display = "flex";
}

Object.entries(subpages).forEach(([id, url]) => {
  const btn = document.getElementById(id);
  if (!btn) return;
  btn.addEventListener("click", function (e) {
    e.preventDefault();
    if (isUserLoggedIn()) {
      window.location.href = url;
    } else {
      showLoginRequired();
    }
  });
});

comingSoonButtons.forEach((id) => {
  const btn = document.getElementById(id);
  if (!btn) return;
  btn.addEventListener("click", function (e) {
    e.preventDefault();
    alert("This service is coming soon!");
  });
});

// Close the login-required modal
document.addEventListener("DOMContentLoaded", function () {
  const closeAlert = document.getElementById("closeAlert");
  const alertEl = document.getElementById("customAlert");
  if (closeAlert && alertEl) {
    closeAlert.addEventListener("click", function () {
      alertEl.style.display = "none";
    });
    alertEl.addEventListener("click", function (e) {
      if (e.target === alertEl) alertEl.style.display = "none";
    });
  }

  // Footer year
  const yearEl = document.getElementById("displayYear");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
