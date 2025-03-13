/*
    Student Name: Tyson Ringelstetter
    File Name: script.js
    Date: March 12, 2025
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

    // Bootstrap form validation
    // Fetch all the forms with .needs-validation class
    var forms = document.querySelectorAll('.needs-validation')
    
    // Loop over them and prevent submission unless valid
    Array.from(forms).forEach(function (form) {
        form.addEventListener('submit', function (event) {
            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            }
            
            form.classList.add('was-validated')
        }, false)
    })

    // Initialize PayPal Donation Button if it exists
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

    // Get the join-now button
    const joinNowButton = document.getElementById('join-now-button');
    
    // Add click event listener
    if (joinNowButton) {
        joinNowButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the target element - first try membership-form
            let targetSection = document.getElementById('membership-form');
            
            // If not found, try paypal-payment (as fallback)
            if (!targetSection) {
                targetSection = document.getElementById('paypal-payment');
            }
            
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

// Function to scroll to donation button (kept as global function for external calls)
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
