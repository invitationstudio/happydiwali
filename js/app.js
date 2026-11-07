/* ============================================
   app.js — Core Controller
   ============================================ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Loading Screen Hide
    const loader = document.getElementById('loading-screen');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('fade-out');
            setTimeout(() => loader.style.display = 'none', 800);
        }, 2000);
    }
});

// 🔥 GLOBAL FUNCTION: Gift Screen Open (Called from HTML)
window.openGiftScreen = function() {
    console.log("Opening Gift Screen...");
    
    // Hide Welcome
    const welcome = document.getElementById('welcome-screen');
    if (welcome) welcome.style.display = 'none';

    // Show Gift
    const gift = document.getElementById('gift-section');
    if (gift) {
        gift.style.display = 'flex';
        gift.style.flexDirection = 'column';
        gift.style.alignItems = 'center';
        gift.style.justifyContent = 'center';
        gift.style.width = '100vw';
        gift.style.height = '100vh';
        gift.style.position = 'fixed';
        gift.style.top = '0';
        gift.style.left = '0';
        gift.style.zIndex = '999';
        gift.style.overflow = 'hidden';
    }
};