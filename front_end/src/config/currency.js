// src/config/currency.js
// Central place for currency conversion.
//
// IMPORTANT: This is a DISPLAY-ONLY conversion.
// ShopAI's database always stores price in INR (single source of truth),
// and Razorpay always charges in INR (back_end/controllers/payment.controller.js
// hardcodes currency: "INR"). Switching the UI to Arabic never changes what's
// stored or what's charged — it only changes what number gets *shown* to the user.
//
// Why keep it this way:
// - The stored price never needs rewriting when the exchange rate moves
// - The amount shown at checkout always matches the amount actually charged
// - Converting is a pure function of (price, rate) — cheap, no DB writes

// 1 INR = X AED. Update this number whenever you want to refresh the rate.
// (Static for now by design — see the migration roadmap for how to swap
// this for a live-rate API later without touching any calling component.)
export const INR_TO_AED_RATE = 0.044

export const convertInrToAed = (priceInInr) => {
    return priceInInr * INR_TO_AED_RATE
}