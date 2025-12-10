import { 
    validateEmail, 
    validatePassword 
} from "./validator.js";

// Toggle password visibility
function togglePassword(id) {
    const input = document.getElementById(id);
    input.type = input.type === "password" ? "text" : "password";
}

// Error helpers
function setError(id, message) {
    document.getElementById(id).innerText = message;
}

function clearErrors() {
    ['emailError', 'passwordError'].forEach(id => setError(id, ''));
}

// Validate Login Fields
function validateLogin() {
    clearErrors();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    if (!email || !password) {
        alert("All fields are required.");
        return false;
    }

    if (!validateEmail(email)) {
        setError("emailError", "Invalid email format.");
        return false;
    }

    // Same password validation as signup
    if (!validatePassword(password)) {
        setError("passwordError", "Password is incorrect or invalid format.");
        return false;
    }

    return true;
}

// Submit Listener
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("loginForm");

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        if (validateLogin()) {
            form.submit();
        }
    });
});

// Make togglePassword accessible
window.togglePassword = togglePassword;
