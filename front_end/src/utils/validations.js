// src/utils/validations.js

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
export const isValidEmail = (email) => {
    const emailRegex =
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/

    return emailRegex.test(email)
}

// ── Password validations ──
export const checkPasswordValidations = (
    password,
    showToast,
    t
) => {
    if (checkIsEmpty(password)) {
        showToast(t("password_required"))
        return false
    }

    if (!checkLength(password, 8)) {
        showToast(t("password_min_length"))
        return false
    }

    if (!/[A-Z]/.test(password)) {
        showToast(t("password_uppercase_required"))
        return false
    }

    if (!/[0-9]/.test(password)) {
        showToast(t("password_number_required"))
        return false
    }

    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
        showToast(t("password_special_required"))
        return false
    }

    return true
}

// ── Confirm password match ──
export const checkPasswordMatch = (
    password,
    confirmPassword,
    showToast,
    t
) => {
    if (password !== confirmPassword) {
        showToast(t("passwords_do_not_match"))
        return false
    }

    return true
}

// ── Name validation ──
export const checkNameValidation = (
    name,
    showToast,
    t
) => {
    if (checkIsEmpty(name)) {
        showToast(t("name_required"))
        return false
    }

    if (!checkLength(name, 2)) {
        showToast(t("name_min_length"))
        return false
    }

    return true
}

// ── Seller KYC validations ──
export const checkAadharValidation = (aadharNumber, showToast, t) => {
    if (checkIsEmpty(aadharNumber)) {
        showToast(t('aadhar_number_required'))
        return false
    }

    if (!/^\d{12}$/.test(aadharNumber)) {
        showToast(t('aadhar_number_invalid'))
        return false
    }

    return true
}

export const checkPanValidation = (panNumber, showToast, t) => {
    if (checkIsEmpty(panNumber)) {
        showToast(t('pan_number_required'))
        return false
    }

    if (!/^[A-Za-z]{5}\d{4}[A-Za-z]$/.test(panNumber)) {
        showToast(t('pan_number_invalid'))
        return false
    }

    return true
}

export const isValidPassword = (password) => {
    const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/

    return passwordRegex.test(password)
}

// ── Phone validation ──
export const checkPhoneValidation = (
    phone,
    showToast,
    t
) => {
    if (checkIsEmpty(phone)) {
        showToast(t("phone_invalid"))
        return false
    }

    if (!/^\d{10}$/.test(phone)) {
        showToast(t("phone_invalid"))
        return false
    }

    return true
}

// ── Date of Birth validation ──
export const checkDateOfBirthValidation = (
    dob,
    showToast,
    t
) => {
    if (checkIsEmpty(dob)) {
        showToast(t("dob_invalid"))
        return false
    }

    const enteredDate = new Date(dob)
    const today = new Date()

    if (isNaN(enteredDate.getTime())) {
        showToast(t("dob_invalid"))
        return false
    }

    if (enteredDate > today) {
        showToast(t("dob_future"))
        return false
    }

    return true
}

// ── Pincode validation ──
export const checkPincodeValidation = (
    pincode,
    showToast,
    t
) => {
    if (checkIsEmpty(pincode)) {
        showToast(t("pincode_required"))
        return false
    }

    if (!/^\d{6}$/.test(pincode)) {
        showToast(t("pincode_invalid"))
        return false
    }

    return true
}
// ── Address validation ──
export const checkAddressValidation = (address, showToast, t) => {
    if (checkIsEmpty(address)) {
        showToast(t('address_required'))
        return false
    }
    return true
}

// ── City validation ──
export const checkCityValidation = (city, showToast, t) => {
    if (checkIsEmpty(city)) {
        showToast(t('city_required'))
        return false
    }
    return true
}

// ── State validation ──
export const checkStateValidation = (state, showToast, t) => {
    if (checkIsEmpty(state)) {
        showToast(t('state_required'))
        return false
    }
    return true
}