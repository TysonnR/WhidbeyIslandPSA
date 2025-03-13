/*
    Student Name: Tyson Ringelstetter
    File Name: script.js
    Date: November 11, 2024
*/

document.addEventListener("DOMContentLoaded", function () {
    // Check if we're on the homepage
    const isHomePage = document.body.classList.contains("home-page");
    
    // Only execute hero-related code on homepage
    if (isHomePage) {
        // Check and add 'show' class to .text-content element if it exists
        const textContent = document.querySelector(".text-content");
        if (textContent) {
            textContent.classList.add("show");
        }
      
        // Handle .merch-section animation if it exists
        const merchSection = document.querySelector(".merch-section");
        if (merchSection) {
            merchSection.style.opacity = "0";
            merchSection.style.transform = "translateY(20px)"; // Starts slightly lower
            setTimeout(() => {
                merchSection.style.transition = "opacity 1s ease-out, transform 1s ease-out";
                merchSection.style.opacity = "1";
                merchSection.style.transform = "translateY(0)";
            }, 500); // Delay for a more natural effect
        }
        
        // Get the scroll indicator element
        const scrollIndicator = document.querySelector('.scroll-indicator');
        
        // Add click event listener to scroll down smoothly when clicked
        if (scrollIndicator) {
            scrollIndicator.addEventListener('click', function() {
                // Calculate the height of the hero banner
                const headerHeight = document.querySelector('.hero-banner').offsetHeight;
                
                // Scroll down to just below the hero banner plus some extra space
                window.scrollTo({
                    top: headerHeight + 20, 
                    behavior: 'smooth'
                });
            });
            
            // Hide scroll indicator when user scrolls down
            window.addEventListener('scroll', function() {
                if (window.scrollY > 100) {
                    scrollIndicator.style.opacity = '0';
                } else {
                    scrollIndicator.style.opacity = '0.8';
                }
            });
        }
    }

});

(function () {
    'use strict'
    
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll('.needs-validation')
    
    // Loop over them and prevent submission
    Array.from(forms).forEach(function (form) {
        form.addEventListener('submit', function (event) {
            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            }
            
            form.classList.add('was-validated')
        }, false)
    })
})()

// Initialize PayPal Donation Button
document.addEventListener('DOMContentLoaded', function() {
    if (typeof PayPal !== 'undefined' && PayPal.Donation) {
        PayPal.Donation.Button({
            env: 'production',
            hosted_button_id: 'Z2RG63LDRFTZN',
            image: {
                src: 'https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif',
                alt: 'Donate with PayPal button',
                title: 'PayPal - The safer, easier way to pay online!',
            }
        }).render('#donate-button');
    }
});

// Function to scroll to donation button
function scrollToDonatation() {
    const donateButton = document.getElementById('donate-button-container');
    if (donateButton) {
        donateButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Add a subtle highlight effect
        donateButton.classList.add('highlight-element');
        setTimeout(() => {
            donateButton.classList.remove('highlight-element');
        }, 2000);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Get the join-now button
    const joinNowButton = document.getElementById('join-now-button');
    
    // Add click event listener
    if (joinNowButton) {
        joinNowButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the target element
            const targetSection = document.getElementById('membership-form');
            
            // Scroll to the target with smooth behavior
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }
});
