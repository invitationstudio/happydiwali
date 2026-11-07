/* ============================================
   opening.js — Cinematic Opening
   ============================================ */

'use strict';

(function () {
    const STATE = {
        locked: true,
        armed: false,
        exploded: false,
        sparkRaf: null,
        particleRaf: null,
    };

    let crackerBtn, instruction, sparkCanvas, sparkCtx, particleCanvas, particleCtx;
    let sparks = [];
    let bgParticles = [];
    let PW = 0, PH = 0, SW = 0, SH = 0, DPR = 1;

    function setup() {
        crackerBtn   = document.getElementById('opening-cracker');
        instruction  = document.getElementById('opening-instruction');
        sparkCanvas  = document.getElementById('opening-sparks');
        particleCanvas = document.getElementById('opening-particles');

        if (!crackerBtn || !sparkCanvas || !particleCanvas) return;

        sparkCtx = sparkCanvas.getContext('2d');
        particleCtx = particleCanvas.getContext('2d');

        resizeCanvases();
        window.addEventListener('resize', resizeCanvases);

        setTimeout(() => { STATE.locked = false; }, 2800);

        startParticleField();

        crackerBtn.addEventListener('click', handleTap);
    }

    function resizeCanvases() {
        DPR = Math.min(window.devicePixelRatio || 1, 1.5);

        SW = sparkCanvas.clientWidth;
        SH = sparkCanvas.clientHeight;
        sparkCanvas.width  = SW * DPR;
        sparkCanvas.height = SH * DPR;
        sparkCtx.setTransform(DPR, 0, 0, DPR, 0, 0);

        PW = particleCanvas.clientWidth;
        PH = particleCanvas.clientHeight;
        particleCanvas.width  = PW * DPR;
        particleCanvas.height = PH * DPR;
        particleCtx.setTransform(DPR, 0, 0, DPR, 0, 0);

        buildParticles();
    }

    function buildParticles() {
        const count = window.innerWidth < 768 ? 18 : 30;
        bgParticles = [];
        for (let i = 0; i < count; i++) {
            bgParticles.push({
                x: Math.random() * PW,
                y: Math.random() * PH,
                r: Math.random() * 1.5 + 0.5,
                vy: -(Math.random() * 0.3 + 0.07),
                vx: (Math.random() - 0.5) * 0.15,
                phase: Math.random() * Math.PI * 2,
                twinkle: Math.random() * 0.03 + 0.01,
                baseAlpha: Math.random() * 0.45 + 0.2,
            });
        }
    }

    function startParticleField() {
        if (STATE.particleRaf) cancelAnimationFrame(STATE.particleRaf);
        function loop() {
            particleCtx.clearRect(0, 0, PW, PH);
            for (const p of bgParticles) {
                p.y += p.vy;
                p.x += p.vx;
                p.phase += p.twinkle;
                if (p.y < -10) { p.y = PH + 10; p.x = Math.random() * PW; }
                if (p.x < -10) p.x = PW + 10;
                if (p.x > PW + 10) p.x = -10;
                const a = p.baseAlpha * (0.5 + 0.5 * Math.sin(p.phase));
                particleCtx.beginPath();
                particleCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                particleCtx.fillStyle = `rgba(255, 215, 0, ${a})`;
                particleCtx.fill();
            }
            STATE.particleRaf = requestAnimationFrame(loop);
        }
        loop();
    }

    function handleTap() {
        if (STATE.locked || STATE.armed || STATE.exploded) return;
        STATE.armed = true;
        if (instruction) instruction.classList.add('hidden');
        startSparks();

        setTimeout(() => {
            explosion();
        }, 800);
    }

    function startSparks() {
        const rect = crackerBtn.getBoundingClientRect();
        const parentRect = sparkCanvas.getBoundingClientRect();
        const originX = rect.left - parentRect.left + rect.width * 0.60;
        const originY = rect.top  - parentRect.top  + rect.height * 0.60;

        function emit() {
            if (STATE.exploded) return;
            sparks.push({
                x: originX + (Math.random() - 0.5) * 10,
                y: originY,
                vx: (Math.random() - 0.5) * 1.2,
                vy: -(Math.random() * 2.8 + 2),
                life: 1,
                decay: Math.random() * 0.028 + 0.016,
                size: Math.random() * 3 + 2,
                hue: Math.random() < 0.7 ? 50 : 30,
            });
            setTimeout(emit, 30);
        }
        emit();
        if (!STATE.sparkRaf) loopSparks();
    }

    function loopSparks() {
        sparkCtx.clearRect(0, 0, SW, SH);
        for (let i = sparks.length - 1; i >= 0; i--) {
            const s = sparks[i];
            s.x += s.vx;
            s.y += s.vy;
            s.vy += 0.08;
            s.vx *= 0.985;
            s.life -= s.decay;
            if (s.life <= 0) { sparks.splice(i, 1); continue; }
            sparkCtx.beginPath();
            sparkCtx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
            sparkCtx.fillStyle = `hsla(${s.hue}, 100%, 65%, ${Math.max(0, s.life)})`;
            sparkCtx.fill();
        }
        STATE.sparkRaf = requestAnimationFrame(loopSparks);
    }

    function explosion() {
        STATE.exploded = true;

        // Big confetti burst
        const rect = crackerBtn.getBoundingClientRect();
        const parentRect = sparkCanvas.getBoundingClientRect();
        const cx = rect.left - parentRect.left + rect.width / 2;
        const cy = rect.top  - parentRect.top  + rect.height / 2;

        for (let i = 0; i < 100; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 8 + 2.5;
            sparks.push({
                x: cx, y: cy,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1,
                decay: Math.random() * 0.02 + 0.01,
                size: Math.random() * 2 + 0.8,
                hue: Math.random() < 0.5 ? 50 : 30,
            });
        }

        const opening = document.getElementById('opening-screen');
        if (opening) opening.style.opacity = '0';
        if (opening) opening.style.transition = 'opacity 1s ease';

        setTimeout(() => {
            if (opening) opening.style.display = 'none';
            if (STATE.sparkRaf) { cancelAnimationFrame(STATE.sparkRaf); STATE.sparkRaf = null; }
            if (STATE.particleRaf) { cancelAnimationFrame(STATE.particleRaf); STATE.particleRaf = null; }

            // Show Welcome Screen
            const welcome = document.getElementById('welcome-screen');
            if (welcome) welcome.style.display = 'flex';
            
            // Fire custom event for welcome.js
            window.dispatchEvent(new Event('welcome-show'));
        }, 1200);
    }

    document.addEventListener('DOMContentLoaded', setup);
})();