const inputs = document.querySelectorAll(".input");

function addcl() {
  let parent = this.parentNode.parentNode;
  parent.classList.add("focus");
}

function remcl() {
  let parent = this.parentNode.parentNode;
  if (this.value == "") {
    parent.classList.remove("focus");
  }
}

inputs.forEach((input) => {
  input.addEventListener("focus", addcl);
  input.addEventListener("blur", remcl);
});












// document.querySelector(".login-btn").addEventListener("click", function (e) {
//   e.preventDefault(); // Prevent form submission

//   // Get username and password inputs
//   const username = document.querySelector(".input-div.one .input").value;
//   const password = document.querySelector(".input-div.pass .input").value;

//   // Simple validation (optional)
//   if (username && password) {
//     // Store username in localStorage
//     localStorage.setItem("isLoggedIn", "true");
//     localStorage.setItem("username", username);

//     // Redirect to the main page
//     window.location.href = "/index.html";
//   } else {
//     alert("Please enter both username and password.");
//   }
// });
//---------------------------------------------------------------------
// document.querySelector(".login-btn").addEventListener("click", function (e) {
//   e.preventDefault(); // Prevent form submission

//   // Get username and password inputs
//   const username = document.querySelector(".input-div.one .input").value;
//   const password = document.querySelector(".input-div.pass .input").value;

//   // Check if username and password are both 'admin'
//   if (username === "admin" && password === "admin") {
//     // Store login status and username
//     localStorage.setItem("isLoggedIn", "true");
//     localStorage.setItem("username", username);

//     // Redirect to the dashboard page
//     window.location.href = "dashboard.html";
//   } 
//   // Check if username and password are non-empty
//   else if (username && password) {
//     // Store login status and username
//     localStorage.setItem("isLoggedIn", "true");
//     localStorage.setItem("username", username);

//     // Redirect to the main page
//     window.location.href = "/index.html";
//   } 
//   // If neither condition is met, show an error
//   else {
//     alert("Please enter both username and password.");
//   }
// });

//---------------------------------------------------------------------

document.querySelector(".login-btn").addEventListener("click", async function (e) {
  e.preventDefault();

  const username = document.querySelector(".input-div.one .input").value;
  const password = document.querySelector(".input-div.pass .input").value;

  if (!username || !password) {
    alert("Please enter both username and password.");
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: username, password }),
    });

    const data = await response.json();

    if (response.ok) {
      // Login successful
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("username", data.user.name);
      localStorage.setItem("token", data.token);

      if (username === "admin" && password === "admin") {
        window.location.href = "dashboard.html";
      } else {
        window.location.href = "/index.html";
      }
    } else {
      alert(data.message || "Login failed.");
    }
  } catch (err) {
    console.error(err);
    alert("An error occurred while logging in.");
  }
});
