/**
 *
 * Paypal Membership Form
 */

document.addEventListener("DOMContentLoaded", function() {
    console.log("Fixed membership form solution loaded");
    
    // Get essential form elements
    const form = document.getElementById('membership-form');
    const paypalButtonContainer = document.getElementById('paypal-button-container');
    const paymentMessage = document.getElementById('payment-message');
    const membershipTitle = document.getElementById('membership-title');
    
    // Exit if essential elements are not found
    if (!form || !paypalButtonContainer || !paymentMessage) {
        console.error("Essential form elements not found");
        return;
    }
    
    // Create a hidden submit button for the form (for Netlify submission)
    const hiddenSubmitButton = document.createElement('input');
    hiddenSubmitButton.type = 'submit';
    hiddenSubmitButton.style.display = 'none';
    hiddenSubmitButton.id = 'hidden-submit';
    form.appendChild(hiddenSubmitButton);
    
    // Get membership type elements
    const membershipTypeInput = document.getElementById('membershipType');
    const membershipTypeSelector = document.getElementById('membership-type-selector');
    
    // Set initial membership type if applicable
    if (membershipTypeSelector && membershipTypeInput) {
        membershipTypeInput.value = membershipTypeSelector.value;
        
        // Update membership title if it exists
        if (membershipTitle) {
            if (membershipTypeSelector.value === "Family Membership") {
                membershipTitle.textContent = "Family Membership - $40/year";
            } else {
                membershipTitle.textContent = "Single Membership - $35/year";
            }
        }
    }
    
    // Get all required form fields
    const requiredFields = form.querySelectorAll('[required]');
    console.log(`Found ${requiredFields.length} required fields`);
    
    // Function to check if form is complete
    function isFormComplete() {
        let complete = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                complete = false;
            }
        });
        
        return complete;
    }
    
    // Function to update PayPal button visibility
    function updatePaymentVisibility() {
        const formComplete = isFormComplete();
        
        if (formComplete) {
            // Show PayPal button
            paypalButtonContainer.style.display = 'block';
            
            // Update message
            paymentMessage.className = 'col-md-12 alert alert-success mb-3';
            paymentMessage.innerHTML = '<i class="fas fa-check-circle me-2"></i>Form complete! Please proceed with payment below.';
            
            // Update the PayPal link handler if it exists
            setupPayPalLinkHandler();
        } else {
            // Hide PayPal button
            paypalButtonContainer.style.display = 'none';
            
            // Update message
            paymentMessage.className = 'col-md-12 alert alert-info mb-3';
            paymentMessage.innerHTML = '<i class="fas fa-info-circle me-2"></i>Complete all required fields to enable payment options.';
        }
    }
    
    // Function to set up the PayPal link handler
    function setupPayPalLinkHandler() {
        const paypalLink = document.querySelector('#paypal-button-container a');
        if (paypalLink && !paypalLink.hasAttribute('data-handler-attached')) {
            paypalLink.setAttribute('data-handler-attached', 'true');
            
            paypalLink.addEventListener('click', function(e) {
                // Set payment status in hidden field
                const paymentStatusInput = document.getElementById('paymentStatus');
                if (paymentStatusInput) {
                    paymentStatusInput.value = 'Redirected to PayPal';
                }
                
                // Set payment date in hidden field
                const paymentDateInput = document.getElementById('paymentDate');
                if (paymentDateInput) {
                    paymentDateInput.value = new Date().toISOString();
                }
                
                // Set payment amount in hidden field
                const paymentAmountInput = document.getElementById('paymentAmount');
                if (paymentAmountInput) {
                    paymentAmountInput.value = membershipTypeInput.value === 'Family Membership' ? '40.00' : '35.00';
                }
                
                // Get the PayPal URL
                const paypalUrl = paypalLink.getAttribute('href');
                
                // Submit the form properly by clicking the hidden submit button
                if (hiddenSubmitButton) {
                    // Create a new form submission event listener that will handle the redirect
                    form.addEventListener('submit', function onSubmit(event) {
                        // Prevent the default submission - we'll handle it
                        event.preventDefault();
                        
                        // Remove this listener to avoid loops
                        form.removeEventListener('submit', onSubmit);
                        
                        // Now use fetch to submit the form data to Netlify
                        const formData = new FormData(form);
                        
                        fetch(form.action, {
                            method: 'POST',
                            body: formData
                        })
                        .then(response => {
                            console.log('Form submitted successfully');
                            // Redirect to PayPal
                            window.open(paypalUrl, '_blank');
                        })
                        .catch(error => {
                            console.error('Error submitting form:', error);
                            // Redirect to PayPal anyway
                            window.open(paypalUrl, '_blank');
                        });
                    }, { once: true });
                    
                    // Trigger the form submission
                    hiddenSubmitButton.click();
                } else {
                    // Fallback - just open PayPal
                    window.open(paypalUrl, '_blank');
                }
                
                // Prevent the default link click
                e.preventDefault();
            });
            
            console.log('PayPal link handler attached');
        }
    }
    
    // Add event listeners to all required fields
    requiredFields.forEach(field => {
        field.addEventListener('input', updatePaymentVisibility);
        field.addEventListener('change', updatePaymentVisibility);
        
        // Add visual validation
        field.addEventListener('blur', function() {
            if (this.value.trim() === '') {
                this.classList.add('is-invalid');
                this.classList.remove('is-valid');
            } else {
                this.classList.remove('is-invalid');
                this.classList.add('is-valid');
            }
        });
    });
    
    // Add event listener to membership type selector
    if (membershipTypeSelector && membershipTypeInput) {
        membershipTypeSelector.addEventListener('change', function() {
            membershipTypeInput.value = this.value;
            
            // Update membership title if it exists
            if (membershipTitle) {
                if (this.value === "Family Membership") {
                    membershipTitle.textContent = "Family Membership - $40/year";
                } else {
                    membershipTitle.textContent = "Single Membership - $35/year";
                }
            }
            
            updatePaymentVisibility();
        });
    }
    
    // Initial check
    updatePaymentVisibility();
    
    console.log("Fixed form solution initialized");
});
