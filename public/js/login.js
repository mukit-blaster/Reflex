// Floating-label focus styling for the login form.
// The actual submit handler lives inline in login.html.
const inputs = document.querySelectorAll(".input");

function addcl() {
  const parent = this.parentNode.parentNode;
  parent.classList.add("focus");
}

function remcl() {
  const parent = this.parentNode.parentNode;
  if (this.value === "") {
    parent.classList.remove("focus");
  }
}

inputs.forEach((input) => {
  input.addEventListener("focus", addcl);
  input.addEventListener("blur", remcl);
});
