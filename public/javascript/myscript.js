//activate header on scroll
const header = document.querySelector("header");
window.addEventListener("scroll", function(){
    header.classList.toggle("sticky", window.scrollY > 0);
})

// Hide logo on scroll
const logo = document.querySelector(".header-logo")
window.addEventListener("scroll", function(){
    logo.classList.toggle("logo-remove", window.scrollY > 0);
})

//Sidebar nav toggle
let menu = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');
menu.onclick = () => {
    menu.classList.toggle('fa-x');
    navbar.classList.toggle('open');
}