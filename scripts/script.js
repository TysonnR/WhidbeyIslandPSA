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

document.addEventListener("DOMContentLoaded", function () {
    const merchSection = document.querySelector(".merch-section");
    merchSection.style.opacity = "0";
    merchSection.style.transform = "translateY(20px)"; // Starts slightly lower
    setTimeout(() => {
        merchSection.style.transition = "opacity 1s ease-out, transform 1s ease-out";
        merchSection.style.opacity = "1";
        merchSection.style.transform = "translateY(0)";
    }, 500); // Delay for a more natural effect
});
