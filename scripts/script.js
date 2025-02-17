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

$(document).ready(function () {
    // Apply smooth scroll to anchor links
    $('a').on('click', function (event) {
      if (this.hash !== '') {
        event.preventDefault();
        $('html, body').animate({
          scrollTop: $(this.hash).offset().top
        }, 800);
      }
    });
  });

setInterval(() => {
    const shopButton = document.querySelector(".merch-section .btn");
    shopButton.classList.add("pulse");

    setTimeout(() => {
        shopButton.classList.remove("pulse");
    }, 1000);
}, 5000); // Pulses every 5 seconds
