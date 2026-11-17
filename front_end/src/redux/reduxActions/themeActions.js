// src/redux/reduxActions/themeActions.js

import store from "../reduxStore"
import { setTheme } from "../reduxReducers/themeReducers"

const { dispatch } = store

// â”€â”€ Apply theme to DOM â”€â”€
// Sets the `data-theme` attribute on <html> so CSS variables switch.
// Called both on init and on toggle.
const applyThemeToDOM = (theme) => {
    document.documentElement.setAttribute('data-theme', theme)
}

// â”€â”€ Initialize theme on app load â”€â”€
// Reads from localStorage; defaults to 'light' if nothing stored.
export const initializeTheme = () => {
    const stored = localStorage.getItem('shopai-theme') || 'light'
    dispatch(setTheme(stored))
    applyThemeToDOM(stored)
}

// â”€â”€ Toggle between dark and light â”€â”€
export const toggleTheme = () => {
    const current = store.getState().theme.theme
    const next = current === 'dark' ? 'light' : 'dark'

    localStorage.setItem('shopai-theme', next)
    dispatch(setTheme(next))
    applyThemeToDOM(next)
}

