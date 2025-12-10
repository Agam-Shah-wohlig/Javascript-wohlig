// signup.js
import { 
    validateUsername, 
    validateEmail, 
    validatePassword, 
    validateConfirmPassword 
} from "./validator.js";

// Toggle password visibility
function togglePassword(id) {
    const input = document.getElementById(id);
    input.type = input.type === "password" ? "text" : "password";
}

// Error message helpers
function setError(id, message) {
    document.getElementById(id).innerText = message;
}

function clearErrors() {
    ['nameError','emailError','passwordError','confirmPasswordError']
        .forEach(id => setError(id, ''));
}

// Validation pipeline
function validateSignup() {
    clearErrors();

    const name = document.getElementById("signupName").value.trim();
    const email = document.getElementById("signupEmail").value.trim();
    const pass = document.getElementById("signupPassword").value.trim();
    const confirmPass = document.getElementById("signupConfirmPassword").value.trim();

    if (!name || !email || !pass || !confirmPass) {
        alert("All fields are required.");
        return false;
    }

    if (!validateUsername(name)) {
        setError("nameError", "Enter first and last name (letters only).");
        return false;
    }

    if (!validateEmail(email)) {
        setError("emailError", "Email must end with @gmail.com, @yahoo.com, or @hotmail.com.");
        return false;
    }

    if (!validatePassword(pass)) {
        setError("passwordError", "Password must have uppercase, lowercase, number, symbol, and be 8+ characters.");
        return false;
    }

    if (!validateConfirmPassword(pass, confirmPass)) {
        setError("confirmPasswordError", "Passwords do not match.");
        return false;
    }

    return true;
}

// Form submit handler
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("signupForm");

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        if (validateSignup()) {
            form.submit();
        }
    });
});

// Expose togglePassword for inline HTML onclick
window.togglePassword = togglePassword;
