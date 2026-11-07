/* ============================================
   gift.js — Gift Box Opening
   ============================================ */

'use strict';

(function () {
    const STATE = { opened: false, busy: false, burstRaf: null };
    let giftBox, giftLetterWrap, closeBtn, burstCanvas, burstCtx, giftParticles = [];
    let BW = 0, BH = 0, DPR = 1;

    function setup() {
        giftBox        = document.getElementById('gift-box');
        giftLetterWrap = document.getElementById('gift-letter-wrap');
        closeBtn       = document.getElementById('gift-letter-close');
        burstCanvas    = document.getElementById('gift-particles');

        if (!giftBox || !burstCanvas) return;

        burstCtx = burstCanvas.getContext('2d');
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        giftBox.addEventListener('click', handleOpen);
        if (closeBtn) closeBtn.addEventListener('click', handleClose);
    }

    function resizeCanvas() {
        if (!burstCanvas) return;
        DPR = Math.min(window.devicePixelRatio || 1, 1.5);
        BW = burstCanvas.clientWidth;
        BH = burstCanvas.clientHeight;
        burstCanvas.width  = BW * DPR;
        burstCanvas.height = BH * DPR;
        burstCtx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }

    function handleOpen() {
        if (STATE.opened || STATE.busy) return;
        STATE.busy = true;
        STATE.opened = true;

        giftBox.classList.add('opening');

        setTimeout(() => {
            giftBox.classList.remove('opening');
            giftBox.classList.add('opened');
            burstParticles();
        }, 700);

        setTimeout(() => {
            if (giftLetterWrap) giftLetterWrap.classList.add('visible');
            STATE.busy = false;
        }, 1100);
    }

    function handleClose() {
        if (!STATE.opened || STATE.busy) return;
        STATE.busy = true;
        if (giftLetterWrap) giftLetterWrap.classList.remove('visible');

        setTimeout(() => {
            giftBox.classList.remove('opened');
            giftParticles = [];
            if (STATE.burstRaf) { cancelAnimationFrame(STATE.burstRaf); STATE.burstRaf = null; }
            if (burstCtx) burstCtx.clearRect(0, 0, BW, BH);
            STATE.opened = false;
            STATE.busy = false;
        }, 700);
    }

    function burstParticles() {
        if (!burstCtx) return;
        const count = window.innerWidth < 768 ? 30 : 45;
        const boxRect = giftBox.getBoundingClientRect();
        const canvasRect = burstCanvas.getBoundingClientRect();
        const cx = boxRect.left - canvasRect.left + boxRect.width / 2;
        const cy = boxRect.top - canvasRect.top + boxRect.height / 2;

        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 5 + 2;
            giftParticles.push({
                x: cx + (Math.random() - 0.5) * 30,
                y: cy + (Math.random() - 0.5) * 20,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 1.8,
                size: Math.random() * 2 + 1,
                life: 1,
                decay: Math.random() * 0.016 + 0.008,
                hue: Math.random() < 0.7 ? 48 : (Math.random() < 0.5 ? 35 : 20),
                gravity: 0.08,
                drag: 0.985,
            });
        }
        if (!STATE.burstRaf) loopBurst();
    }

    function loopBurst() {
        burstCtx.clearRect(0, 0, BW, BH);
        for (let i = giftParticles.length - 1; i >= 0; i--) {
            const p = giftParticles[i];
            p.vx *= p.drag;
            p.vy *= p.drag;
            p.vy += p.gravity;
            p.x += p.vx;
            p.y += p.vy;
            p.life -= p.decay;
            if (p.life <= 0) { giftParticles.splice(i, 1); continue; }
            burstCtx.beginPath();
            burstCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            burstCtx.fillStyle = `hsla(${p.hue}, 100%, 65%, ${Math.max(0, p.life)})`;
            burstCtx.fill();
        }
        if (giftParticles.length > 0) {
            STATE.burstRaf = requestAnimationFrame(loopBurst);
        } else {
            burstCtx.clearRect(0, 0, BW, BH);
            STATE.burstRaf = null;
        }
    }

    document.addEventListener('DOMContentLoaded', setup);
})();