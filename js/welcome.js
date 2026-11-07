/* ============================================
   welcome.js — Welcome Screen Controller
   ============================================ */

'use strict';

(function () {
    let welcomeStage = null;
    let active = false;

    function initFireworks() {
        const canvas = document.getElementById('welcome-fireworks');
        if (!canvas) return;
        welcomeStage = FireworksEngine.create(canvas);
    }

    function startFireworks() {
        if (!welcomeStage) return;
        welcomeStage.start();
        welcomeStage.enableAutoLaunch(1600, 3200);
        active = true;
    }

    function stopFireworks() {
        if (!welcomeStage) return;
        welcomeStage.disableAutoLaunch();
        welcomeStage.stop();
        welcomeStage.clear();
        active = false;
    }

    window.addEventListener('welcome-show', () => {
        startFireworks();
    });

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) stopFireworks();
        else if (active) startFireworks();
    });

    document.addEventListener('DOMContentLoaded', initFireworks);
})();