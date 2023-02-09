const slide = document.querySelector(".testimonial-slide")
const slideBtn = document.querySelectorAll(".testimonial-btn")

if (screen.width >= 1200 && screen.width <= 1400 ) {
function slider(index, int) {
    slide.style.left = int
}
console.log(screen.width );
let index = 0;
setInterval(() => {
    if (screen.width > 1150) {
        slide.style.left = "-" + index + "px";
        if (index >= 2300) {
            index = 0
        } else {
            index += 1150
        }
    }
}, 4000);
}
