// Redirect to the login page
document.getElementById("login-btn").addEventListener("click", function () {
  window.location.href = "login.html";
});

// Redirect to the signnup page
document.getElementById("signup-btn").addEventListener("click", function () {
  window.location.href = "signup.html";
});

// Redirect to the audio therapy page
// document.getElementById("audio-therapy").addEventListener("click", function () {
//   window.location.href = "./music player/music.html";
// });

// Redirect to the appointment page
// document.getElementById("exploreBtn").addEventListener("click", function () {
//   window.location.href = "./appointment booking/booking.html";
// });

// Redirect to the yoga page
// document.getElementById("yoga-therapy").addEventListener("click", function () {
//   window.location.href = "./yoga therapy/yoga.html";
// });

// Redirect to the reading therapy page
// document
//   .getElementById("reading-therapy")
//   .addEventListener("click", function () {
//     window.location.href = "./reading therapy/reading.html";
//   });

// Redirect to the laughing therapy page
// document
//   .getElementById("reading-therapy")
//   .addEventListener("click", function () {
//     window.location.href = "/laughing therapy/laughing.html";
//   });
  

//Get the button
let mybutton = document.getElementById("btn-back-to-top");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function () {
  scrollFunction();
};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}
// When the user clicks on the button, scroll to the top of the document
mybutton.addEventListener("click", backToTop);

function backToTop() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

const sentences = [
  "Welcome to Reflex!",
  "Enhance your well-being with us.",
  "Explore mindfulness, music, and counseling.",
];

let index = 0;
const typingSpeed = 100;
const pauseDuration = 2000;

function typeSentence() {
  const textElement = document.getElementById("animated-text");
  textElement.textContent = "";

  const currentSentence = sentences[index];
  let charIndex = 0;

  // Typing effect
  const typingInterval = setInterval(() => {
    if (charIndex < currentSentence.length) {
      textElement.textContent += currentSentence.charAt(charIndex);
      charIndex++;
    } else {
      clearInterval(typingInterval);

      // Pause before starting the next sentence
      setTimeout(() => {
        index = (index + 1) % sentences.length;
        typeSentence();
      }, pauseDuration);
    }
  }, typingSpeed);
}

typeSentence();



// //for laughing therapy page
// // Simulating a login status variable
// let isLoggedIn = false;

// document.getElementById("exploreLaughing").addEventListener("click", function (e) {
//   e.preventDefault(); // Prevent default link behavior
  
//   if (isLoggedIn) {
//     // Redirect to the service subpage if logged in
//     window.location.href = "/laughing therapy/laughing.html";
//   } else {
//     // Show the custom alert
//     document.getElementById("customAlert").style.display = "flex";
//   }
// });

// document.getElementById("closeAlert").addEventListener("click", function () {
//   // Hide the custom alert
//   document.getElementById("customAlert").style.display = "none";
// });







// Simulating login status (use localStorage or other methods for real authentication)
let isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

// Subpage mapping for buttons
const subpages = {
  "exploreLaughing": "/laughing therapy/laughing.html",
  "exploreBtn": "booking.html",
  "audio-therapy": "./music player/music.html",
  "yoga-therapy": "yoga.html",
  "reading-therapy": "reading.html"
  // Add more buttons and subpages here
};

// Function to handle card clicks
function handleCardClick(buttonId) {
  document.getElementById(buttonId).addEventListener("click", function (e) {
    e.preventDefault(); // Prevent default link behavior

    if (isLoggedIn) {
      // Redirect to the respective subpage if logged in
      window.location.href = subpages[buttonId];
    } else {
      // Show the custom alert if not logged in
      document.getElementById("customAlert").style.display = "flex";
    }
  });
}

// Iterate over all buttons and attach click events
Object.keys(subpages).forEach(handleCardClick);

// Close the custom alert modal when the OK button is clicked
document.getElementById("closeAlert").addEventListener("click", function () {
  // Hide the custom alert by setting display to "none"
  document.getElementById("customAlert").style.display = "none";
});




















// document.addEventListener("DOMContentLoaded", function () {
//   const loginBtn = document.getElementById("login-btn");
//   const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
//   const username = localStorage.getItem("username");

//   if (isLoggedIn && username) {
//     // Replace "Login" button with the username
//     loginBtn.innerHTML = `
//       <i class="fa fa-user" aria-hidden="true"></i>
//       <span>${username}</span>
//     `;
//   }
// });




// document.addEventListener("DOMContentLoaded", function () {
//   const loginBtn = document.getElementById("login-btn");
//   const logoutBtn = document.getElementById("logout-btn");
//   const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
//   const username = localStorage.getItem("username");

//   if (isLoggedIn && username) {
//     // Replace "Login" button with the username
//     loginBtn.innerHTML = `
//       <i class="fa fa-user" aria-hidden="true"></i>
//       <span>${username}</span>
//     `;

//     // Show logout button
//     logoutBtn.style.display = "inline";
//   }

//   // Handle logout
//   logoutBtn.addEventListener("click", function () {
//     localStorage.removeItem("isLoggedIn");
//     localStorage.removeItem("username");
//     window.location.reload(); // Refresh the page
//   });
// });

// // Simulate login
// document.getElementById("login-btn").addEventListener("click", function () {
//   isLoggedIn = true;
//   localStorage.setItem("isLoggedIn", "true");
// });

// // Check login status on page load
// document.addEventListener("DOMContentLoaded", function () {
//   isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
// });











  document.addEventListener("DOMContentLoaded", function () {
    const loginBtn = document.getElementById("login-btn");
    const logoutBtn = document.getElementById("logout-btn");
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const username = localStorage.getItem("username");

    if (isLoggedIn && username) {
      loginBtn.innerHTML = `
        <i class="fa fa-user" aria-hidden="true"></i>
        <span>${username}</span>
      `;
      logoutBtn.style.display = "inline";
    }

    logoutBtn.addEventListener("click", function () {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("username");
      localStorage.removeItem("token");
      window.location.reload();  // Refresh the page
    });
  });


