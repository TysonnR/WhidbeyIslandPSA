/*
    Student Name: Tyson Ringelstetter
    File Name: script.js
    Date: November 11, 2024
*/

//jQuery for hero image to consume the header window space
$(document).ready(function(){
    $('.hero').height($(window).height()); 
});

document.addEventListener("DOMContentLoaded", function () {
    document.querySelector(".text-content").classList.add("show");
});
