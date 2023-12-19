/* RMIT University Vietnam
Course: COSC2430 Web Programming
Semester: 2023A
Assessment: Assignment 1
Author: Tran Nguyen Ngoc Han
ID: s3963227
Acknowledgement:
- Books information and images: https://bookshop.org/categories/m/fiction
- About us video: https://www.youtube.com/watch?v=AcfM9Z9MbXI
- Icon: https://fontawesome.com/ */

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