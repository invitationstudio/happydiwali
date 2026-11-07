# 🪔 Ultimate Diwali Experience 2026

A premium, cinematic, fully-interactive Diwali celebration website.
Built with **HTML5 + CSS3 + Vanilla JavaScript + Canvas API + Web Audio API**.
No frameworks. No backend. Runs directly via **VS Code Live Server**.

---

## 📁 Project Structure

DIWALI-EXPERIENCE/
├── index.html
├── css/
│   ├── style.css          (base design system)
│   ├── opening.css
│   ├── welcome.css
│   ├── gift.css
│   ├── fireworks.css
│   ├── studio.css
│   ├── diya.css
│   ├── rangoli.css
│   └── responsive.css
├── js/
│   ├── app.js             (core engine)
│   ├── audio.js           (sound manager)
│   ├── opening.js
│   ├── welcome.js
│   ├── gift.js
│   ├── fireworks.js
│   ├── cracker-studio.js
│   ├── diya.js
│   ├── rangoli.js
│   └── wishes.js
├── assets/
│   ├── images/
│   │   ├── firecrackers/  ← YOUR PNG IMAGES GO HERE
│   │   ├── diyas/
│   │   ├── backgrounds/
│   │   ├── gifts/
│   │   └── rangoli/
│   ├── sounds/
│   ├── music/
│   └── voice/
└── README.md

---

## 🖼️ REQUIRED PNG Images — Firecrackers

Place **YOUR OWN transparent PNGs** in `assets/images/firecrackers/` with these filenames:

| Filename | Purpose |
|----------|---------|
| `main-cracker.png`  | Big firecracker on opening screen |
| `phulbaji.png`      | Phulbaji (sparkler fountain) |
| `anar.png`          | Anar (flower pot) |
| `rocket.png`        | Rocket |
| `chakri.png`        | Chakri (spinning wheel) |
| `ladi.png`          | Ladi (garland of crackers) |
| `flower-pot.png`    | Flower Pot |
| `bomb.png`          | Bomb |

**Rules:**
- ✅ Transparent background PNG
- ✅ Original aspect ratio preserved (CSS `object-fit: contain`)
- ✅ If a file is missing, a golden placeholder is shown instead
- ❌ Do NOT use random stock images

### To change filenames
Open `js/cracker-studio.js` (filled in STEP 06) — the top of that file contains a **`CRACKER_IMAGES`** object. Just change the paths there. No other code needs to change.

---

## 🔊 Optional Audio Files

### `assets/sounds/`
- `fuse.mp3`           — fuse burning
- `explosion.mp3`      — big blast
- `chakri.mp3`         — spinning wheel
- `rocket-launch.mp3`  — rocket whoosh
- `diya-light.mp3`     — diya lighting spark

### `assets/music/`
- `bgm.mp3`            — background music (looped)

### `assets/voice/`
- `marathi-wish.mp3`   — full Marathi wish voice-over (preferred)
  If this file is missing, the browser's Marathi speech synthesis will be used automatically.

**Note:** No audio auto-plays before the user interacts (browser policy). All sounds are triggered by user actions.

---

## 🚀 How to Run

1. Install the **Live Server** extension in VS Code.
2. Right-click `index.html` → **Open with Live Server**.
3. Your browser opens at `http://127.0.0.1:5500`.

**Testing on Android phone:**
- Connect phone and PC to the **same Wi-Fi**.
- On PC, run `ipconfig` (Windows) or `ifconfig` (Mac) and note your IPv4 address (e.g. `192.168.1.15`).
- On phone's Chrome: open `http://192.168.1.15:5500`.

---

## ✅ Development Progress

- [x] STEP 01 — Foundation (structure, index, CSS system, JS core)
- [ ] STEP 02 — Cinematic Opening
- [ ] STEP 03 — Grand Welcome + fireworks background
- [ ] STEP 04 — 3D Gift Box
- [ ] STEP 05 — Marathi Voice-Over
- [ ] STEP 06 — Firecracker Studio
- [ ] STEP 07 — Fire / Ignition system + 8 unique animations
- [ ] STEP 08 — Diya Lighting
- [ ] STEP 09 — Interactive Rangoli
- [ ] STEP 10 — Personalized Wishes
- [ ] STEP 11 — Share + final polish