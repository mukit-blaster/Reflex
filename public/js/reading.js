let currentSlide = 0;
const slides = document.querySelectorAll(".slide");

function changeSlide(direction) {
  slides[currentSlide].classList.remove("active");
  currentSlide = (currentSlide + direction + slides.length) % slides.length;
  slides[currentSlide].classList.add("active");
}

// Auto slide every 5 seconds
setInterval(() => {
  changeSlide(1);
}, 4000);
