/* ============================================
   audio.js — Basic Audio Toggles
   ============================================ */

'use strict';

const DiwaliAudio = {
    play(key) { /* Placeholder */ },
    stop(key) { /* Placeholder */ }
};

document.addEventListener('DOMContentLoaded', () => {
    const btnMusic = document.getElementById('btn-music');
    const btnSfx = document.getElementById('btn-sfx');
    const btnVoice = document.getElementById('btn-voice');
    const btnMute = document.getElementById('btn-mute-all');

    if (btnMusic) btnMusic.addEventListener('click', () => btnMusic.classList.toggle('off'));
    if (btnSfx) btnSfx.addEventListener('click', () => btnSfx.classList.toggle('off'));
    if (btnVoice) btnVoice.addEventListener('click', () => btnVoice.classList.toggle('off'));
    if (btnMute) btnMute.addEventListener('click', () => btnMute.classList.toggle('off'));
});