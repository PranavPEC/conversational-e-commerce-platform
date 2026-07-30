// src/utils/validations.js
//
// Pure utility functions — no React, no Redux, no axios
// Every function returns true (valid) or false (invalid)
// When invalid, the function shows its own error via showToast
// The caller just checks the return value and returns early if false
//
// Pattern from inspiration project:
//   if (!isValidEmail(email)) { notifyError("..."); return false }
// We pass showToast as a parameter instead of using a global toast config
// because our toast is a local hook (useToast) not a global function


// ── Check if a value is empty ──
// Handles undefined, null, empty string, empty array, empty object
export const checkIsEmpty = (value) => {
    if (value === undefined) return true
    if (value === null) return true
    if (typeof value === "string" && value.trim() === "") return true
    if (Array.isArray(value) && value.length === 0) return true
    if (typeof value === "object" && Object.keys(value).length === 0) return true
    return false
}


// ── Check minimum length ──
export const checkLength = (value, minLength = 8) => {
    if (checkIsEmpty(value)) return false
    return value.length >= minLength
}


// ── Email validation ──
// Returns true if valid, false if not
export const isValidEmail = (email) => {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/
    return emailRegex.test(email)
}


// ── Password validations ──
// Checks all rules in sequence, calls showToast with the first error found
// Returns true if all pass, false if any fail
//
// Rules:
//   - Minimum 8 characters
//   - At least one uppercase letter
//   - At least one number
//   - At least one special character
export const checkPasswordValidations = (password, showToast) => {
    if (checkIsEmpty(password)) {
        showToast("Please enter a password.")
        return false
    }

    if (!checkLength(password, 8)) {
        showToast("Password must be at least 8 characters long.")
        return false
    }

    if (!/[A-Z]/.test(password)) {
        showToast("Password must contain at least one uppercase letter.")
        return false
    }

    if (!/[0-9]/.test(password)) {
        showToast("Password must contain at least one number.")
        return false
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        showToast("Password must contain at least one special character.")
        return false
    }

    return true
}


// ── Confirm password match ──
export const checkPasswordMatch = (password, confirmPassword, showToast) => {
    if (password !== confirmPassword) {
        showToast("Passwords do not match.")
        return false
    }
    return true
}


// ── Name validation ──
export const checkNameValidation = (name, showToast) => {
    if (checkIsEmpty(name)) {
        showToast("Please enter your name.")
        return false
    }
    if (!checkLength(name, 2)) {
        showToast("Name must be at least 2 characters long.")
        return false
    }
    return true
}

export const isValidPassword = (password) => {
    const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

    return passwordRegex.test(password);
};


// ── Phone validation ──
// Optional field on Profile — blank is allowed (user may not have added it
// yet), but if something is entered, it must be exactly 10 digits.
export const checkPhoneValidation = (phone, showToast) => {
    if (checkIsEmpty(phone)){
        showToast("Phone number must be exactly 10 digits.")
        return false
    }

    if (!/^\d{10}$/.test(phone)) {
        showToast("Phone number must be exactly 10 digits.")
        return false
    }

    return true
}


// ── Date of Birth validation ──
// Also optional — blank is allowed. If a date is entered, it must be a
// real date and can't be in the future.
export const checkDateOfBirthValidation = (dob, showToast) => {
    if (checkIsEmpty(dob)){
        showToast("Please enter a valid date of birth.")
        return false
    }

    const enteredDate = new Date(dob)
    const today = new Date()

    if (isNaN(enteredDate.getTime())) {
        showToast("Please enter a valid date of birth.")
        return false
    }

    if (enteredDate > today) {
        showToast("Date of birth cannot be in the future.")
        return false
    }

    return true
}


// ── Pincode validation ──
// Format-only check (blank passes) — same convention as checkPhoneValidation.
// The caller decides whether the field is required in their context; here
// AddressForm treats pincode as required, so it runs checkIsEmpty itself
// before calling this.
export const checkPincodeValidation = (pincode, showToast) => {
    if (checkIsEmpty(pincode)) return true

    if (!/^\d{6}$/.test(pincode)) {
        showToast("Pincode must be exactly 6 digits.")
        return false
    }

    return true
}