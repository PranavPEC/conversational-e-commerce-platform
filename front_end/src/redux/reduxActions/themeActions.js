// src/redux/reduxActions/themeActions.js

import store from "../reduxStore"
import { setTheme } from "../reduxReducers/themeReducers"

const { dispatch } = store

// ── Apply theme to DOM ──
// Sets the `data-theme` attribute on <html> so CSS variables switch.
// Called both on init and on toggle.
const applyThemeToDOM = (theme) => {
    document.documentElement.setAttribute('data-theme', theme)
}

// ── Initialize theme on app load ──
// Reads from localStorage; defaults to 'dark' if nothing stored.
export const initializeTheme = () => {
    const stored = localStorage.getItem('shopai-theme') || 'dark'
    dispatch(setTheme(stored))
    applyThemeToDOM(stored)
}

// ── Toggle between dark and light ──
export const toggleTheme = () => {
    const current = store.getState().theme.theme
    const next = current === 'dark' ? 'light' : 'dark'

    localStorage.setItem('shopai-theme', next)
    dispatch(setTheme(next))
    applyThemeToDOM(next)
}
