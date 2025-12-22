// utils/validator.js

// Full name validator (First + Last name)
export function validateUsername(name) {
    const regex = /^[A-Za-z]+$/;
    return regex.test(name);
}

// Email must end with gmail.com, yahoo.com, or hotmail.com
export function validateEmail(email) {
    const regex = /^[a-zA-Z0-9._%+-]+@(gmail|yahoo|hotmail)\.com$/;
    return regex.test(email);
}

// Password validator (8+ chars, uppercase, lowercase, number, symbol)
export function validatePassword(password) {
    const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return regex.test(password);
}

// Confirm password
export function validateConfirmPassword(password, confirmpassword) {
    return password === confirmpassword;
}
