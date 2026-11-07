/* ============================================
   fireworks.js — Canvas Fireworks Engine
   PERFORMANCE OPTIMISED:
   • NO shadowBlur (was the #1 lag source)
   • Reduced particle count
   • Slower auto-launch rate
   • Full stop when paused
   ============================================ */

'use strict';

const FireworksEngine = (function () {

    function rand(min, max) { return Math.random() * (max - min) + min; }

    class FireworksStage {
        constructor(canvas) {
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d', { alpha: true });
            this.dpr = Math.min(window.devicePixelRatio || 1, 1.5);
            this.w = 0;
            this.h = 0;

            this.rockets = [];
            this.particles = [];
            this.running = false;
            this.rafId = null;

            this.autoLaunchEnabled = false;
            this.autoLaunchTimer = null;

            this._onResize = this._onResize.bind(this);
            this._loop = this._loop.bind(this);

            this._resize();
            window.addEventListener('resize', this._onResize);
        }

        _resize() {
            this.w = this.canvas.clientWidth  || window.innerWidth;
            this.h = this.canvas.clientHeight || window.innerHeight;
            this.canvas.width  = this.w * this.dpr;
            this.canvas.height = this.h * this.dpr;
            this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
        }

        _onResize() { this._resize(); }

        start() {
            if (this.running) return;
            this.running = true;
            this.rafId = requestAnimationFrame(this._loop);
        }

        stop() {
            this.running = false;
            if (this.rafId) { cancelAnimationFrame(this.rafId); this.rafId = null; }
        }

        clear() {
            this.rockets.length = 0;
            this.particles.length = 0;
            this.ctx.clearRect(0, 0, this.w, this.h);
        }

        enableAutoLaunch(minMs = 1600, maxMs = 3200) {
            this.autoLaunchEnabled = true;
            this._scheduleNext(minMs, maxMs);
        }

        disableAutoLaunch() {
            this.autoLaunchEnabled = false;
            if (this.autoLaunchTimer) clearTimeout(this.autoLaunchTimer);
            this.autoLaunchTimer = null;
        }

        _scheduleNext(minMs, maxMs) {
            if (!this.autoLaunchEnabled) return;
            const delay = rand(minMs, maxMs);
            this.autoLaunchTimer = setTimeout(() => {
                if (this.autoLaunchEnabled && this.running) {
                    this.launchRocket();
                    this._scheduleNext(minMs, maxMs);
                }
            }, delay);
        }

        launchRocket(opts = {}) {
            const startX = opts.x ?? rand(this.w * 0.2, this.w * 0.8);
            const startY = opts.y ?? this.h + 10;
            const targetX = opts.targetX ?? rand(this.w * 0.2, this.w * 0.8);
            const targetY = opts.targetY ?? rand(this.h * 0.15, this.h * 0.5);
            const color = opts.color ?? pickPaletteColor();

            this.rockets.push({
                x: startX,
                y: startY,
                startX, startY,
                targetX, targetY,
                color,
                speed: 0.06,
                t: 0,
                trail: [],
            });
        }

        _burst(x, y, color) {
            const isMobile = window.innerWidth < 768;
            // Was 42/72. Now 28/45.
            const count = isMobile ? 28 : 45;

            for (let i = 0; i < count; i++) {
                const angle = (Math.PI * 2 * i) / count + rand(-0.15, 0.15);
                const speed = rand(1.4, 3.8);
                const hueShift = rand(-12, 12);

                this.particles.push({
                    x, y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    life: 1,
                    decay: rand(0.014, 0.026),
                    hue: color.h + hueShift,
                    sat: color.s,
                    size: rand(1.2, 2.4),
                    gravity: 0.045,
                    drag: 0.988,
                });
            }

            // Small bright core (5 instead of 10)
            for (let i = 0; i < 5; i++) {
                const angle = rand(0, Math.PI * 2);
                const speed = rand(0.5, 1.6);
                this.particles.push({
                    x, y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    life: 1,
                    decay: rand(0.03, 0.05),
                    hue: 50,
                    sat: 100,
                    size: rand(2, 3.2),
                    gravity: 0.01,
                    drag: 0.96,
                });
            }
        }

        _loop() {
            if (!this.running) return;

            // Trail fade
            this.ctx.globalCompositeOperation = 'destination-out';
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
            this.ctx.fillRect(0, 0, this.w, this.h);
            this.ctx.globalCompositeOperation = 'lighter';

            // Rockets
            for (let i = this.rockets.length - 1; i >= 0; i--) {
                const r = this.rockets[i];
                r.t += r.speed;

                const ease = r.t < 1 ? 1 - Math.pow(1 - r.t, 2.5) : 1;
                const x = r.startX + (r.targetX - r.startX) * ease;
                const y = r.startY + (r.targetY - r.startY) * ease;

                r.trail.push({ x, y });
                if (r.trail.length > 6) r.trail.shift();

                // NO shadowBlur — plain alpha circles
                for (let j = 0; j < r.trail.length; j++) {
                    const p = r.trail[j];
                    const a = (j + 1) / r.trail.length * 0.75;
                    this.ctx.beginPath();
                    this.ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2);
                    this.ctx.fillStyle = `hsla(${r.color.h}, 100%, 70%, ${a})`;
                    this.ctx.fill();
                }

                this.ctx.beginPath();
                this.ctx.arc(x, y, 2.4, 0, Math.PI * 2);
                this.ctx.fillStyle = `hsla(${r.color.h}, 100%, 85%, 1)`;
                this.ctx.fill();

                if (r.t >= 1) {
                    this._burst(r.targetX, r.targetY, r.color);
                    this.rockets.splice(i, 1);
                }
            }

            // Particles — NO shadowBlur
            for (let i = this.particles.length - 1; i >= 0; i--) {
                const p = this.particles[i];
                p.vx *= p.drag;
                p.vy *= p.drag;
                p.vy += p.gravity;
                p.x += p.vx;
                p.y += p.vy;
                p.life -= p.decay;

                if (p.life <= 0) { this.particles.splice(i, 1); continue; }

                const a = Math.max(0, p.life);
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                this.ctx.fillStyle = `hsla(${p.hue}, ${p.sat}%, 65%, ${a})`;
                this.ctx.fill();
            }

            this.rafId = requestAnimationFrame(this._loop);
        }
    }

    const PALETTE = [
        { h: 50,  s: 100 },
        { h: 15,  s: 100 },
        { h: 0,   s: 95  },
        { h: 300, s: 85  },
        { h: 200, s: 90  },
        { h: 120, s: 80  },
        { h: 40,  s: 100 },
        { h: 260, s: 85  },
    ];

    function pickPaletteColor() {
        return PALETTE[Math.floor(Math.random() * PALETTE.length)];
    }

    function create(canvasOrId) {
        const canvas = typeof canvasOrId === 'string'
            ? document.getElementById(canvasOrId)
            : canvasOrId;
        if (!canvas) return null;
        return new FireworksStage(canvas);
    }

    return { create, pickPaletteColor };
})();

window.FireworksEngine = FireworksEngine;