/**
 * Simple PayPal Button Display Logic
 * Shows PayPal buttons only when form is complete
 */

document.addEventListener("DOMContentLoaded", function() {
    // Direct references to key elements
    const form = document.getElementById('membership-form');
    const singleButton = document.getElementById('single-membership-button');
    const familyButton = document.getElementById('family-membership-button');
    const messageArea = document.getElementById('payment-message');
    
    // Exit if not on the right page
    if (!form || (!singleButton && !familyButton)) {
        console.log("Required elements not found");
        return;
    }
    
    console.log("Form and payment buttons found");
    
    // Create message area if it doesn't exist
    if (!messageArea) {
        const newMessage = document.createElement('div');
        newMessage.id = 'payment-message';
        newMessage.className = 'alert alert-info mt-3';
        newMessage.innerHTML = 'Complete all required fields to see payment options';
        
        // Insert before the buttons
        if (singleButton) {
            singleButton.parentNode.insertBefore(newMessage, singleButton);
        } else if (familyButton) {
            familyButton.parentNode.insertBefore(newMessage, familyButton);
        } else {
            form.appendChild(newMessage);
        }
    }
    
    // Get all required input fields
    const requiredInputs = form.querySelectorAll('input[required]');
    console.log(`Found ${requiredInputs.length} required fields`);
    
    // If no required fields are found, manually set some
    if (requiredInputs.length === 0) {
        const commonFields = ['fullname', 'email', 'phone', 'address'];
        commonFields.forEach(fieldName => {
            const field = form.querySelector(`[name="${fieldName}"]`);
            if (field) {
                field.setAttribute('required', 'true');
                console.log(`Made ${fieldName} required`);
            }
        });
    }
    
    // Get the updated list of required fields
    const allRequiredFields = form.querySelectorAll('input[required]');
    console.log(`Now tracking ${allRequiredFields.length} required fields`);
    
    // Force buttons to be hidden initially
    if (singleButton) singleButton.style.display = 'none';
    if (familyButton) familyButton.style.display = 'none';
    
    // Function to check if form is complete
    function checkFormCompletion() {
        let isComplete = true;
        
        // Check each required field
        allRequiredFields.forEach(field => {
            if (!field.value.trim()) {
                isComplete = false;
                console.log(`Field incomplete: ${field.name || field.id}`);
            }
        });
        
        return isComplete;
    }
    
    // Function to update button visibility
    function updateButtonVisibility() {
        const formComplete = checkFormCompletion();
        const msg = document.getElementById('payment-message');
        
        console.log(`Form complete: ${formComplete}`);
        
        if (formComplete) {
            // Determine which button to show
            const membershipTypeField = document.getElementById('membershipType');
            const isFamilyMembership = membershipTypeField && 
                                       membershipTypeField.value === 'Family Membership';
            
            // Show appropriate button
            if (isFamilyMembership) {
                if (singleButton) singleButton.style.display = 'none';
                if (familyButton) familyButton.style.display = 'block';
            } else {
                if (singleButton) singleButton.style.display = 'block';
                if (familyButton) familyButton.style.display = 'none';
            }
            
            // Update message
            if (msg) {
                msg.className = 'alert alert-success mt-3';
                msg.innerHTML = 'Form complete! You can now proceed with payment.';
            }
        } else {
            // Hide both buttons
            if (singleButton) singleButton.style.display = 'none';
            if (familyButton) familyButton.style.display = 'none';
            
            // Update message
            if (msg) {
                msg.className = 'alert alert-info mt-3';
                msg.innerHTML = 'Complete all required fields to see payment options';
            }
        }
    }
    
    // Add input event listeners to all required fields
    allRequiredFields.forEach(field => {
        field.addEventListener('input', updateButtonVisibility);
        field.addEventListener('change', updateButtonVisibility);
    });
    
    // Handle membership type changes if applicable
    const membershipSelector = document.getElementById('membership-type-selector');
    if (membershipSelector) {
        membershipSelector.addEventListener('change', function() {
            const membershipTypeField = document.getElementById('membershipType');
            if (membershipTypeField) {
                membershipTypeField.value = this.value;
            }
            updateButtonVisibility();
        });
    }
    
    // Check initial state
    updateButtonVisibility();
    console.log("PayPal button display logic initialized");
});
