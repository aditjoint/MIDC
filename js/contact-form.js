/**
 * ADIT Joint - Contact Form JavaScript
 * Author: ADIT Joint
 * Version: 1.0
 */

// Execute when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the contact form validation and submission
    initContactForm();
});

/**
 * Initialize the contact form functionality
 */
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        // Add event listeners for input validation
        const formInputs = contactForm.querySelectorAll('input, textarea, select');
        formInputs.forEach(input => {
            // Validate on blur
            input.addEventListener('blur', function() {
                validateInput(this);
            });
            
            // Clear error on focus
            input.addEventListener('focus', function() {
                clearInputError(this);
            });
        });
        
        // Handle form submission
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate all inputs before submission
            let isValid = true;
            formInputs.forEach(input => {
                if (!validateInput(input)) {
                    isValid = false;
                }
            });
            
            if (isValid) {
                // For this static version, simulate form submission
                submitForm(this);
            } else {
                // Scroll to the first error
                const firstError = contactForm.querySelector('.error');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        });
    }
}

/**
 * Validate a form input field
 * @param {HTMLElement} input - The input element to validate
 * @returns {boolean} - Whether the input is valid
 */
function validateInput(input) {
    const value = input.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Skip validation for non-required fields if they're empty
    if (!input.required && value === '') {
        clearInputError(input);
        return true;
    }
    
    // Validate based on input type and requirements
    switch (input.type) {
        case 'email':
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (value === '') {
                isValid = false;
                errorMessage = 'Email address is required';
            } else if (!emailPattern.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
            break;
            
        case 'tel':
            if (input.required && value === '') {
                isValid = false;
                errorMessage = 'Phone number is required';
            } else if (value !== '' && !/^[0-9+\-\s()]{7,20}$/.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number';
            }
            break;
            
        case 'text':
        case 'textarea':
            if (input.required && value === '') {
                isValid = false;
                errorMessage = `${input.name.charAt(0).toUpperCase() + input.name.slice(1)} is required`;
            }
            break;
            
        case 'checkbox':
            if (input.required && !input.checked) {
                isValid = false;
                errorMessage = 'This checkbox is required';
            }
            break;
            
        case 'select-one':
            if (input.required && (value === '' || value === 'default')) {
                isValid = false;
                errorMessage = 'Please select an option';
            }
            break;
    }
    
    // Show or clear error message
    if (!isValid) {
        showInputError(input, errorMessage);
    } else {
        clearInputError(input);
    }
    
    return isValid;
}

/**
 * Show an error message for an input
 * @param {HTMLElement} input - The input element
 * @param {string} message - The error message to display
 */
function showInputError(input, message) {
    // Clear any existing error first
    clearInputError(input);
    
    // Create error element
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    errorElement.style.color = '#dc3545';
    errorElement.style.fontSize = '0.8rem';
    errorElement.style.marginTop = '5px';
    
    // Add error class to the input
    input.classList.add('error');
    input.style.borderColor = '#dc3545';
    
    // Special handling for checkboxes
    if (input.type === 'checkbox') {
        const checkboxContainer = input.closest('.checkbox-group');
        if (checkboxContainer) {
            checkboxContainer.appendChild(errorElement);
        }
    } else {
        // Insert error message after the input
        if (input.nextElementSibling) {
            input.parentNode.insertBefore(errorElement, input.nextElementSibling);
        } else {
            input.parentNode.appendChild(errorElement);
        }
    }
}

/**
 * Clear the error message for an input
 * @param {HTMLElement} input - The input element
 */
function clearInputError(input) {
    // Remove error class from input
    input.classList.remove('error');
    input.style.borderColor = '';
    
    // Find and remove error message element
    let errorElement;
    
    if (input.type === 'checkbox') {
        const checkboxContainer = input.closest('.checkbox-group');
        if (checkboxContainer) {
            errorElement = checkboxContainer.querySelector('.error-message');
            if (errorElement) {
                checkboxContainer.removeChild(errorElement);
            }
        }
    } else {
        // Look for error message after input
        errorElement = input.nextElementSibling;
        if (errorElement && errorElement.classList.contains('error-message')) {
            input.parentNode.removeChild(errorElement);
        }
    }
}

/**
 * Submit the contact form
 * @param {HTMLFormElement} form - The form element
 */
function submitForm(form) {
    // For static website, we show a success message instead of actually submitting
    
    // Create a loading indicator
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'Submitting...';
    
    // Simulate form submission delay
    setTimeout(() => {
        // Hide the form
        form.style.display = 'none';
        
        // Create and show a success message
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerHTML = `
            <div class="success-content">
                <div class="success-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h3>Thank You!</h3>
                <p>Your message has been sent successfully. We'll get back to you as soon as possible.</p>
                <button id="resetForm" class="btn btn-primary">Send Another Message</button>
            </div>
        `;
        
        // Insert success message
        form.parentNode.appendChild(successMessage);
        
        // Add event listener to reset button
        const resetButton = document.getElementById('resetForm');
        if (resetButton) {
            resetButton.addEventListener('click', function() {
                // Remove success message
                form.parentNode.removeChild(successMessage);
                
                // Reset and show form
                form.reset();
                form.style.display = 'grid';
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            });
        }
    }, 1500);
}

/**
 * Add input mask for phone number field
 */
(function addPhoneMask() {
    const phoneInput = document.getElementById('phone');
    
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            // Get the input value and remove non-digits
            let input = this.value.replace(/\D/g, '');
            
            // Limit to 15 digits
            input = input.substring(0, 15);
            
            // Format the phone number
            if (input.length > 0) {
                // Format with country code if starting with international format
                if (input.length > 10) {
                    this.value = '+' + input.substring(0, 3) + ' ' + 
                                  input.substring(3, 6) + ' ' + 
                                  input.substring(6, 10) + ' ' + 
                                  input.substring(10);
                } 
                // Format for standard 10-digit numbers
                else if (input.length > 6) {
                    this.value = '(' + input.substring(0, 3) + ') ' + 
                                  input.substring(3, 6) + '-' + 
                                  input.substring(6);
                }
                // Format for partial numbers
                else if (input.length > 3) {
                    this.value = '(' + input.substring(0, 3) + ') ' + 
                                  input.substring(3);
                }
                else {
                    this.value = '(' + input;
                }
            }
        });
    }
})();
