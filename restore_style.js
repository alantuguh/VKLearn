const fs = require('fs');

let baseCss = fs.readFileSync('backup_fac28da0-7eb3-4795-99a5-e8d92cb2f3e1_step_18_style.css', 'utf8');
const currentCss = fs.readFileSync('public/css/style.css', 'utf8');

// 1. Add .btn-xl, .nav-game-link, .mario-hero-btn after .btn-lg in baseCss
const btnLgRegex = /\.btn-lg\s*\{[\s\S]*?padding:\s*16px\s*36px;[\s\S]*?font-size:\s*1\.05rem;[\s\S]*?\}/;

const heroAdditions = `

.btn-xl {
  padding: 18px 40px;
  font-size: 1.15rem;
  font-weight: 700;
}

/* Navigation special links */
.nav-game-link {
  color: #fbbf24 !important;
  font-weight: 600;
}
.nav-game-link:hover {
  background: rgba(251, 191, 36, 0.1) !important;
}

/* Hero special buttons */
.mario-hero-btn {
  background: linear-gradient(135deg, #f59e0b, #ef4444);
  color: white;
  box-shadow: 0 4px 15px rgba(245, 158, 11, 0.35);
}
.mario-hero-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(245, 158, 11, 0.5);
}`;

if (btnLgRegex.test(baseCss)) {
  baseCss = baseCss.replace(btnLgRegex, match => match + heroAdditions);
  console.log('Added hero additions successfully');
} else {
  console.error('Could not find .btn-lg in baseCss');
}

// 2. Extract marioSection from currentCss
const marioStart = currentCss.indexOf('/* ========================================\r\n   SUPER MARIO QUIZ GAME STYLING') !== -1
  ? currentCss.indexOf('/* ========================================\r\n   SUPER MARIO QUIZ GAME STYLING')
  : currentCss.indexOf('/* ========================================\n   SUPER MARIO QUIZ GAME STYLING');

const marioSection = currentCss.slice(marioStart);

const combined = baseCss.trim() + '\n\n' + marioSection.trim() + '\n';
fs.writeFileSync('public/css/style.css', combined, 'utf8');

console.log('Restored style.css! Total length:', combined.length);
