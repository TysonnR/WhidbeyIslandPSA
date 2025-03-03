/*
    Student Name: Tyson Ringelstetter
    File Name: script.js
    Date: November 11, 2024
*/

// jQuery for hero image to consume the header window space
$(document).ready(function(){
  $('.hero').height($(window).height()); 
});

document.addEventListener("DOMContentLoaded", function () {
  // Check and add 'show' class to .text-content element if it exists
  const textContent = document.querySelector(".text-content");
  if (textContent) {
      textContent.classList.add("show");
  } else {
      console.log("Element with class '.text-content' not found.");
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
  } else {
      console.log("Element with class '.merch-section' not found.");
  }

  // Handle dropdown change for PayPal button
  const membershipDropdown = document.getElementById("membership");
  if (membershipDropdown) {
      membershipDropdown.addEventListener("change", function () {
          const selectedOption = this.value;
          const paymentAmount = selectedOption === "family" ? "40.00" : "35.00";

          // Clear and re-render the PayPal button with updated amount
          document.getElementById("paypal-button-container").innerHTML = ''; // Clear previous button
          renderPayPalButton(paymentAmount); // Re-render PayPal button
      });
  } else {
      console.log("Element with id 'membership' not found.");
  }

  // Ensure the "sign-up" page is active in navigation
  const currentPage = window.location.pathname.split("/").pop();
  if (currentPage === "sign-up.html") {
      const dropdownParent = document.getElementById("membersDropdownItem");
      if (dropdownParent) {
          dropdownParent.classList.add("active");
      } else {
          console.log("Element with id 'membersDropdownItem' not found.");
      }
  }

  // Ensure PayPal Button is rendered on page load
  renderPayPalButton("35.00");
});

// Function to render PayPal button
function renderPayPalButton(amount) {
  paypal.Buttons({
      createOrder: function (data, actions) {
          return actions.order.create({
              purchase_units: [{
                  amount: {
                      value: amount // Dynamically set the payment amount
                  }
              }]
          });
      },
      onApprove: function (data, actions) {
          return actions.order.capture().then(function (details) {
              alert('Transaction completed by ' + details.payer.name.given_name);
              window.location.href = 'success.html'; // Redirect after payment
          });
      },
      onError: function (err) {
          console.error('PayPal Error:', err);
          alert('An error occurred during the transaction. Please try again.');
      }
  }).render('#paypal-button-container'); // Render the button inside the container
}

document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll('.scroll-to').forEach(anchor => {
        anchor.addEventListener('click', function(event) {
            event.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 100, 
                    behavior: 'smooth'
                });
            }
        });
    });
});
