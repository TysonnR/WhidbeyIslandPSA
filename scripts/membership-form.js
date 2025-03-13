/**
 * Membership Form Integration with PayPal
 * Handles form validation, payment selection, and Netlify form submission
 */

document.addEventListener("DOMContentLoaded", function() {
    // Check if we're on the sign-up page
    if (window.location.pathname.includes('sign-up.html')) {
        setupMembershipFormAndPayPal();
    }
});

function setupMembershipFormAndPayPal() {
    // Get references to form and PayPal elements
    const membershipForm = document.querySelector('.membership-form');
    const paypalAddToCartButton = document.querySelector('paypal-add-to-cart-button');
    
    if (!membershipForm || !paypalAddToCartButton) return;
    
    // Initially hide the PayPal buttons
    paypalAddToCartButton.style.display = 'none';
    const paymentMessage = document.createElement('div');
    paymentMessage.id = 'payment-message';
    paymentMessage.className = 'alert alert-info mt-3';
    paymentMessage.innerHTML = '<i class="fas fa-info-circle me-2"></i>Complete the form above to enable payment options.';
    paypalAddToCartButton.insertAdjacentElement('afterend', paymentMessage);
    
    // Create an observer to watch for form field changes
    createFormObserver(membershipForm, paypalAddToCartButton, paymentMessage);
    
    // Add event listener for when items are added to cart
    if (typeof window.cartPaypal !== 'undefined') {
        // Check if onReady method exists
        if (typeof window.cartPaypal.onReady === 'function') {
            window.cartPaypal.onReady(() => {
                console.log('PayPal cart is ready');
                setupPayPalEventListeners(membershipForm);
            });
        } else {
            // Fallback if onReady isn't available
            console.log('PayPal cart is available, setting up event listeners directly');
            setupPayPalEventListeners(membershipForm);
        }
    } else {
        console.error('PayPal cart is not available');
        paymentMessage.className = 'alert alert-danger mt-3';
        paymentMessage.innerHTML = '<i class="fas fa-exclamation-triangle me-2"></i>Payment system is currently unavailable. Please try again later or contact us.';
    }
}

function setupPayPalEventListeners(form) {
    // Listen for cart events
    if (typeof window.cartPaypal.onAddItem === 'function') {
        window.cartPaypal.onAddItem((data) => {
            console.log('Item added to cart', data);
            // Validate form before allowing checkout
            if (!validateBeforeCheckout(form)) {
                // Clear the cart if form is invalid
                if (typeof window.cartPaypal.clearCart === 'function') {
                    window.cartPaypal.clearCart();
                }
            }
        });
    }
    
    // When checkout completes successfully
    if (typeof window.cartPaypal.onCheckout === 'function') {
        window.cartPaypal.onCheckout((data) => {
            console.log('Checkout completed', data);
            // Now submit the form to Netlify
            submitFormToNetlify(form, data);
        });
    }
}

// Create observer to watch form fields and show/hide PayPal buttons
function createFormObserver(form, paypalButton, messageEl) {
    // Check form validity on input to any field
    const formInputs = form.querySelectorAll('input[required]');
    formInputs.forEach(input => {
        input.addEventListener('input', () => {
            if (validateForm(form)) {
                paypalButton.style.display = 'block';
                messageEl.className = 'alert alert-success mt-3';
                messageEl.innerHTML = '<i class="fas fa-check-circle me-2"></i>Form is valid! Please proceed with payment.';
            } else {
                paypalButton.style.display = 'none';
                messageEl.className = 'alert alert-info mt-3';
                messageEl.innerHTML = '<i class="fas fa-info-circle me-2"></i>Complete the form above to enable payment options.';
            }
        });
    });
    
    // Initial check
    if (validateForm(form)) {
        paypalButton.style.display = 'block';
        messageEl.className = 'alert alert-success mt-3';
        messageEl.innerHTML = '<i class="fas fa-check-circle me-2"></i>Form is valid! Please proceed with payment.';
    }
}

// Form validation function
function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.classList.add('is-invalid');
        } else {
            field.classList.remove('is-invalid');
            field.classList.add('is-valid');
        }
    });
    
    return isValid;
}

// Validate form before allowing checkout to proceed
function validateBeforeCheckout(form) {
    if (!validateForm(form)) {
        // Show error message
        alert('Please complete all required fields before proceeding to checkout.');
        
        // Focus on first invalid field
        const firstInvalid = form.querySelector('.is-invalid');
        if (firstInvalid) {
            firstInvalid.focus();
            firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        
        return false;
    }
    return true;
}

// Submit form to Netlify after successful checkout
function submitFormToNetlify(form, paymentData) {
    // Create a hidden info field for payment data
    let paymentInfoField = form.querySelector('input[name="payment_info"]');
    if (!paymentInfoField) {
        paymentInfoField = document.createElement('input');
        paymentInfoField.type = 'hidden';
        paymentInfoField.name = 'payment_info';
        form.appendChild(paymentInfoField);
    }
    
    // Add payment details to the hidden field
    paymentInfoField.value = JSON.stringify({
        transaction_id: paymentData.id || 'unknown',
        payment_status: 'completed',
        payment_date: new Date().toISOString(),
        payment_amount: paymentData.amount || 'unknown'
    });
    
    // Submit the form
    form.submit();
    
    // Load success page HTML from separate file
    const mainContent = document.querySelector('#membership-form');
    if (mainContent) {
        fetch('membership-success.html')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(html => {
                // Replace any placeholder values
                html = html.replace('{{transactionId}}', paymentData.id || 'unknown');
                
                // Insert the HTML
                mainContent.innerHTML = html;
                
                // Scroll to top
                window.scrollTo({ top: 0, behavior: 'smooth' });
            })
            .catch(error => {
                console.error('Error loading success page:', error);
                // Fallback to inline HTML if loading fails
                mainContent.innerHTML = `
                    <div class="container">
                        <div class="alert alert-success">
                            <h4>Registration Complete!</h4>
                            <p>Thank you for your membership. Your registration has been received.</p>
                            <a href="index.html" class="btn btn-primary">Return to Homepage</a>
                        </div>
                    </div>
                `;
            });
    }
}
