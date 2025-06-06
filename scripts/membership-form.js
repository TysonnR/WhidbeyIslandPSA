/**
 * WIPSA Membership Form with PayPal SDK Integration
 * Handles form validation, tax calculation, and PayPal payments
 */

document.addEventListener("DOMContentLoaded", function() {
    console.log("WIPSA membership form with PayPal SDK loaded");
    
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
    
    // Get membership type elements
    const membershipTypeInput = document.getElementById('membershipType');
    const membershipTypeSelector = document.getElementById('membership-type-selector');
    
    // Set initial membership type
    if (membershipTypeSelector && membershipTypeInput) {
        membershipTypeInput.value = membershipTypeSelector.value;
        updateMembershipDisplay(membershipTypeSelector.value);
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
            
            // Initialize PayPal button if not already done
            const currentMembershipType = membershipTypeSelector ? membershipTypeSelector.value : 'Single Membership';
            updateMembershipDisplay(currentMembershipType);
        } else {
            // Hide PayPal button
            paypalButtonContainer.style.display = 'none';
            
            // Update message
            paymentMessage.className = 'col-md-12 alert alert-info mb-3';
            paymentMessage.innerHTML = '<i class="fas fa-info-circle me-2"></i>Complete all required fields to enable payment options.';
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
            updateMembershipDisplay(this.value);
            updatePaymentVisibility();
        });
    }
    
    // Initial check
    updatePaymentVisibility();
    
    console.log("Membership form initialized successfully");
});

// Function to update membership display and create PayPal button
function updateMembershipDisplay(membershipType) {
    const membershipTitle = document.getElementById('membership-title');
    const basePriceElement = document.getElementById('base-price');
    const taxRateElement = document.getElementById('tax-rate');
    const taxElement = document.getElementById('tax-amount');
    const totalElement = document.getElementById('total-amount');
    const paypalPlaceholder = document.getElementById('paypal-button-placeholder');
    
    // Washington state sales tax rate - Oak Harbor, WA is 9%
    const WA_TAX_RATE = 0.09; // 9% sales tax
    
    let basePrice, tax, total;
    
    if (membershipType === "Family Membership") {
        basePrice = 40.00;
        if (membershipTitle) {
            membershipTitle.textContent = "Family Membership";
        }
    } else {
        basePrice = 35.00;
        if (membershipTitle) {
            membershipTitle.textContent = "Single Membership";
        }
    }
    
    // Calculate tax and total
    tax = basePrice * WA_TAX_RATE;
    total = basePrice + tax;
    
    // Update display elements
    if (basePriceElement) basePriceElement.textContent = `$${basePrice.toFixed(2)}`;
    if (taxRateElement) taxRateElement.textContent = (WA_TAX_RATE * 100).toFixed(1);
    if (taxElement) taxElement.textContent = `$${tax.toFixed(2)}`;
    if (totalElement) totalElement.textContent = `$${total.toFixed(2)}`;
    
    // Create PayPal button
    if (paypalPlaceholder) {
        // Clear existing button
        paypalPlaceholder.innerHTML = '<div id="paypal-buttons-container"></div>';
        
        // Initialize PayPal button with calculated total
        initializePayPalButton(total, membershipType);
    }
    
    // Update hidden form fields
    const paymentAmountInput = document.getElementById('paymentAmount');
    if (paymentAmountInput) {
        paymentAmountInput.value = total.toFixed(2);
    }
}

// Function to initialize PayPal SDK button
function initializePayPalButton(amount, membershipType) {
    const container = document.getElementById('paypal-buttons-container');
    if (!container) return;
    
    // Check if PayPal SDK is loaded
    if (typeof paypal === 'undefined') {
        console.error('PayPal SDK not loaded');
        // Fallback to simple button
        container.innerHTML = `
            <button class="btn btn-primary btn-lg" onclick="alert('PayPal is loading... Please wait a moment and try again.')">
                <i class="fab fa-paypal me-2"></i>Pay $${amount.toFixed(2)} with PayPal
            </button>
        `;
        return;
    }
    
    // Clear any existing PayPal button
    container.innerHTML = '';
    
    // Create PayPal button
    paypal.Buttons({
        createOrder: function(data, actions) {
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: amount.toFixed(2),
                        currency_code: 'USD'
                    },
                    description: `WIPSA ${membershipType} - Annual Membership (includes WA sales tax)`
                }]
            });
        },
        onApprove: function(data, actions) {
            return actions.order.capture().then(function(details) {
                console.log('Payment successful:', details);
                handlePaymentSuccess(details, membershipType, amount);
            });
        },
        onError: function(err) {
            console.error('PayPal Error:', err);
            showPaymentError();
        },
        onCancel: function(data) {
            console.log('Payment cancelled:', data);
            showPaymentCancelled();
        },
        style: {
            color: 'blue',
            shape: 'rect',
            label: 'pay',
            height: 50,
            layout: 'vertical'
        }
    }).render('#paypal-buttons-container');
}

// Function to handle successful payment
function handlePaymentSuccess(details, membershipType, amount) {
    console.log('Processing payment success...');
    
    // Update form with payment details
    const paymentStatusInput = document.getElementById('paymentStatus');
    const paymentDateInput = document.getElementById('paymentDate');
    const transactionIdInput = document.getElementById('transactionId');
    const paymentAmountInput = document.getElementById('paymentAmount');
    
    if (paymentStatusInput) paymentStatusInput.value = 'Completed';
    if (paymentDateInput) paymentDateInput.value = new Date().toISOString();
    if (transactionIdInput) transactionIdInput.value = details.id;
    if (paymentAmountInput) paymentAmountInput.value = amount.toFixed(2);
    
    // Submit the form to Netlify
    const form = document.getElementById('membership-form');
    if (form) {
        const formData = new FormData(form);
        
        fetch(form.action || '/', {
            method: 'POST',
            body: formData
        }).then(response => {
            console.log('Form submitted successfully to Netlify');
            showPaymentSuccess(details.id, membershipType, amount);
        }).catch(error => {
            console.error('Form submission error:', error);
            // Still show success since payment went through
            showPaymentSuccess(details.id, membershipType, amount);
        });
    } else {
        showPaymentSuccess(details.id, membershipType, amount);
    }
}

// Function to show payment success message
function showPaymentSuccess(transactionId, membershipType, amount) {
    const mainContainer = document.querySelector('.container');
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Replace content with success message
    mainContainer.innerHTML = `
        <div class="row justify-content-center">
            <div class="col-lg-8">
                <div class="card border-success shadow-lg mt-5">
                    <div class="card-body text-center p-5">
                        <i class="fas fa-check-circle text-success mb-4" style="font-size: 4rem;"></i>
                        <h2 class="text-success mb-3">Welcome to WIPSA!</h2>
                        <h4 class="mb-4">Payment Successful</h4>
                        <div class="bg-light p-3 rounded mb-4">
                            <p class="mb-1"><strong>Membership Type:</strong> ${membershipType}</p>
                            <p class="mb-1"><strong>Amount Paid:</strong> $${amount.toFixed(2)}</p>
                            <p class="mb-0"><strong>Transaction ID:</strong> <code>${transactionId}</code></p>
                        </div>
                        <p class="lead mb-4">Thank you for joining the Whidbey Island Puget Sound Anglers!</p>
                        <p class="mb-4">You'll receive a confirmation email shortly with your membership details and information about upcoming meetings and events.</p>
                        <div class="d-grid gap-2 d-md-flex justify-content-md-center">
                            <a href="index.html" class="btn btn-primary btn-lg px-4">Return Home</a>
                            <a href="events.html" class="btn btn-outline-primary btn-lg px-4">View Events</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Function to show payment error
function showPaymentError() {
    const paymentMessage = document.getElementById('payment-message');
    if (paymentMessage) {
        paymentMessage.className = 'col-md-12 alert alert-danger mb-3';
        paymentMessage.innerHTML = '<i class="fas fa-exclamation-circle me-2"></i>Payment failed. Please try again or contact support at whidbeypsa@gmail.com';
    }
}

// Function to show payment cancelled message
function showPaymentCancelled() {
    const paymentMessage = document.getElementById('payment-message');
    if (paymentMessage) {
        paymentMessage.className = 'col-md-12 alert alert-warning mb-3';
        paymentMessage.innerHTML = '<i class="fas fa-info-circle me-2"></i>Payment was cancelled. You can try again when ready.';
    }
}