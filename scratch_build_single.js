const fs = require('fs');

const orig = fs.readFileSync('public/js/mario-game.js', 'utf8');
const quizData = JSON.parse(fs.readFileSync('data/quiz.json', 'utf8'));

// 1. LEVEL_CONFIGS: exactly 1 level
const newLevelConfigs = `  // --- Level Configuration (1 Comprehensive Level with 10 Assessment Questions) ---
  const LEVEL_CONFIGS = {
    1: {
      id: 1,
      name: 'Petualangan VAK Multimedia',
      difficulty: '1 Level (10 Pertanyaan)',
      stars: '⭐',
      time: 360,
      worldWidth: 5600,
      sky: ['#38bdf8', '#bae6fd', '#f0fdf4'],
      groundColor: '#92400e',
      grassColor: '#22c55e',
      pipeColor: '#15803d',
      brickColor: '#b45309',
      hasStars: false,
      hasMist: false,
      hasLava: false,
      flagpoleX: 5320,
      castleX: 5390
    }
  };`;

const cfgStart = orig.indexOf('  // --- Level Configurations');
const cfgEnd = orig.indexOf('  // --- Main Mario Game Class ---');
if (cfgStart === -1 || cfgEnd === -1) {
  console.error('LEVEL_CONFIGS range not found');
  process.exit(1);
}

let code = orig.slice(0, cfgStart) + newLevelConfigs + '\n\n' + orig.slice(cfgEnd);

// 2. In constructor: maxLevels = 1, totalFruits = 10, timeLeft = 360
code = code.replace('this.maxLevels = 5;', 'this.maxLevels = 1;');
code = code.replace('this.totalFruits = 2;', 'this.totalFruits = 10;');
code = code.replace('this.timeLeft = 180;', 'this.timeLeft = 360;');

// 3. Replace initLevel() with 1 unified, beautiful level containing all 10 fruits
const initLevelStart = code.indexOf('    initLevel() {');
const initLevelEnd = code.indexOf('    start(resetScore = true) {');
if (initLevelStart === -1 || initLevelEnd === -1) {
  console.error('initLevel range not found', initLevelStart, initLevelEnd);
  process.exit(1);
}

const newInitLevel = `    initLevel() {
      const groundY = 470;
      this.worldWidth = 5600;
      this.platforms = [];
      this.movingPlatforms = [];
      this.questionBlocks = [];
      this.coins = [];
      this.fruits = [];
      this.enemies = [];
      this.particles = [];
      this.floatingTexts = [];
      this.clouds = [];
      this.hills = [];
      this.stars = [];
      this.mist = [];

      this.flagpole = {
        x: 5320,
        y: 150,
        width: 14,
        height: 320,
        flagY: 170,
        reached: false
      };

      this.castle = {
        x: 5390,
        y: 290,
        width: 130,
        height: 180
      };

      // Ground segments across 5600px
      this.platforms.push({ x: 0, y: groundY, width: 1200, height: 70, type: 'ground' });
      this.platforms.push({ x: 1280, y: groundY, width: 1100, height: 70, type: 'ground' });
      this.platforms.push({ x: 2460, y: groundY, width: 1100, height: 70, type: 'ground' });
      this.platforms.push({ x: 3640, y: groundY, width: 1000, height: 70, type: 'ground' });
      this.platforms.push({ x: 4720, y: groundY, width: 900, height: 70, type: 'ground' });

      // Safe stepping island platforms over gaps
      this.platforms.push({ x: 1205, y: 430, width: 70, height: 26, type: 'grass-island' });
      this.platforms.push({ x: 2385, y: 430, width: 70, height: 26, type: 'grass-island' });
      this.platforms.push({ x: 3565, y: 430, width: 70, height: 26, type: 'grass-island' });
      this.platforms.push({ x: 4645, y: 430, width: 70, height: 26, type: 'grass-island' });

      // Classic Mario Pipes
      const pipePositions = [
        { x: 320, h: 55 },
        { x: 740, h: 65 },
        { x: 1600, h: 60 },
        { x: 2050, h: 70 },
        { x: 2780, h: 60 },
        { x: 3200, h: 75 },
        { x: 3950, h: 65 },
        { x: 4380, h: 70 },
        { x: 4950, h: 60 }
      ];
      pipePositions.forEach(p => {
        this.platforms.push({
          x: p.x,
          y: groundY - p.h,
          width: 64,
          height: p.h,
          type: 'pipe'
        });
      });

      // Brick structures
      const bricks = [
        { x: 240, y: 350, w: 120 },
        { x: 620, y: 340, w: 140 },
        { x: 1050, y: 360, w: 120 },
        { x: 1500, y: 340, w: 140 },
        { x: 1900, y: 330, w: 120 },
        { x: 2320, y: 350, w: 140 },
        { x: 2720, y: 340, w: 120 },
        { x: 3120, y: 330, w: 140 },
        { x: 3520, y: 350, w: 120 },
        { x: 3900, y: 340, w: 140 },
        { x: 4300, y: 330, w: 120 },
        { x: 4700, y: 350, w: 140 }
      ];
      bricks.forEach(b => {
        this.platforms.push({
          x: b.x,
          y: b.y,
          width: b.w,
          height: 32,
          type: 'brick'
        });
      });

      // Moving platforms
      this.movingPlatforms.push({
        x: 1720, y: 390, width: 85, height: 22,
        minX: 1700, maxX: 1850, minY: 390, maxY: 390,
        vx: 0.8, vy: 0, type: 'moving'
      });
      this.movingPlatforms.push({
        x: 4100, y: 380, width: 85, height: 22,
        minX: 4080, maxX: 4230, minY: 380, maxY: 380,
        vx: 0.8, vy: 0, type: 'moving'
      });

      // Question Blocks
      this.questionBlocks = [
        { x: 280, y: 240, width: 34, height: 34, hit: false, bumpY: 0, hasCoin: true },
        { x: 660, y: 230, width: 34, height: 34, hit: false, bumpY: 0, hasCoin: true },
        { x: 1540, y: 230, width: 34, height: 34, hit: false, bumpY: 0, hasCoin: true },
        { x: 2760, y: 230, width: 34, height: 34, hit: false, bumpY: 0, hasCoin: true },
        { x: 3940, y: 230, width: 34, height: 34, hit: false, bumpY: 0, hasCoin: true },
        { x: 4740, y: 230, width: 34, height: 34, hit: false, bumpY: 0, hasCoin: true }
      ];

      // === 10 VAK ASSESSMENT FRUITS / QUESTIONS ===
      const fruitPositions = [
        { x: 450, y: 410, type: 'apple', icon: '🍎', color: '#ef4444', name: 'Pos 1: Software Baru' },
        { x: 920, y: 410, type: 'star', icon: '⭐', color: '#fbbf24', name: 'Pos 2: Retensi Materi' },
        { x: 1400, y: 410, type: 'strawberry', icon: '🍓', color: '#f43f5e', name: 'Pos 3: Observasi Presentasi' },
        { x: 1880, y: 410, type: 'cherry', icon: '🍒', color: '#dc2626', name: 'Pos 4: Komunikasi Alur Kerja' },
        { x: 2340, y: 410, type: 'apple', icon: '🍎', color: '#ef4444', name: 'Pos 5: Minat Kreasi' },
        { x: 2860, y: 410, type: 'star', icon: '⭐', color: '#fbbf24', name: 'Pos 6: Kolaborasi Tim' },
        { x: 3380, y: 410, type: 'strawberry', icon: '🍓', color: '#f43f5e', name: 'Pos 7: Penerimaan Evaluasi' },
        { x: 3880, y: 410, type: 'cherry', icon: '🍒', color: '#dc2626', name: 'Pos 8: Eksplorasi Estetika' },
        { x: 4420, y: 410, type: 'apple', icon: '🍎', color: '#ef4444', name: 'Pos 9: Pemecahan Masalah' },
        { x: 4980, y: 410, type: 'star', icon: '⭐', color: '#fbbf24', name: 'Pos 10: Capaian Portofolio' }
      ];

      this.fruits = fruitPositions.map((fp, idx) => {
        const qIdx = idx;
        const qData = this.questions[qIdx] || DEFAULT_VAK_QUESTIONS[qIdx] || DEFAULT_VAK_QUESTIONS[0];
        const isAnswered = this.vakAnswers.some(a => a.id === qData.id);
        return {
          id: idx + 1,
          questionIndex: qIdx,
          question: qData,
          type: fp.type,
          name: fp.name,
          icon: fp.icon,
          color: fp.color,
          x: fp.x,
          y: fp.y,
          baseY: fp.y,
          width: 32,
          height: 32,
          collected: isAnswered
        };
      });

      this.totalFruits = this.fruits.length;
      this.fruitsCollected = this.fruits.filter(f => f.collected).length;

      // Friendly Goombas
      const enemyPositions = [
        { x: 550, minX: 420, maxX: 700 },
        { x: 1020, minX: 920, maxX: 1180 },
        { x: 1720, minX: 1640, maxX: 1820 },
        { x: 2180, minX: 2100, maxX: 2300 },
        { x: 2980, minX: 2880, maxX: 3100 },
        { x: 3450, minX: 3350, maxX: 3550 },
        { x: 4120, minX: 4020, maxX: 4250 },
        { x: 4800, minX: 4720, maxX: 4920 }
      ];
      this.enemies = enemyPositions.map(ep => ({
        x: ep.x,
        y: groundY - 32,
        vx: -0.8,
        width: 32,
        height: 32,
        minX: ep.minX,
        maxX: ep.maxX,
        alive: true,
        squishTimer: 0
      }));

      // Decorative Coins
      const coinXs = [
        180, 210, 520, 550, 800, 830, 1150, 1180,
        1460, 1490, 1960, 1990, 2520, 2550, 3040, 3070,
        3680, 3710, 4200, 4230, 4850, 4880, 5180, 5210
      ];
      this.coins = coinXs.map((cx, idx) => ({
        id: idx,
        x: cx,
        y: 420,
        width: 20,
        height: 24,
        collected: false,
        animOffset: Math.random() * Math.PI * 2
      }));

      // Scenery Clouds & Hills
      for (let x = 80; x < this.worldWidth; x += 450) {
        this.clouds.push({
          x: x + Math.random() * 80,
          y: 60 + Math.random() * 80,
          scale: 0.8 + Math.random() * 0.5
        });
      }
      for (let x = 120; x < this.worldWidth; x += 550) {
        this.hills.push({
          x: x,
          width: 220 + Math.random() * 80,
          height: 90 + Math.random() * 40
        });
      }

      // Reset Player State
      this.player.x = 80;
      this.player.y = 380;
      this.player.vx = 0;
      this.player.vy = 0;
      this.player.respawnX = 80;
      this.player.respawnY = 380;
      this.player.isGrounded = false;
      this.player.invulnerableTimer = 0;
      this.cameraX = 0;
    }
\n`;

code = code.slice(0, initLevelStart) + newInitLevel + code.slice(initLevelEnd);

// 4. Update handleVakAnswer to IMMEDIATELY RESUME PLAYING ("langsung main lagi")
const handleAnswerStart = code.indexOf('    handleVakAnswer(selectedIndex, selectedBtn, q, opt, fruit) {');
const handleAnswerEnd = code.indexOf('    closeQuizModal() {');
if (handleAnswerStart === -1 || handleAnswerEnd === -1) {
  console.error('handleVakAnswer range not found');
  process.exit(1);
}

const newHandleVakAnswer = `    handleVakAnswer(selectedIndex, selectedBtn, q, opt, fruit) {
      const optionsContainer = document.getElementById('mqOptionsList');

      if (optionsContainer) {
        Array.from(optionsContainer.children).forEach(btn => {
          btn.disabled = true;
        });
      }

      selectedBtn.classList.add('correct');
      this.audio.playCorrect();
      this.score += 150;
      this.fruitsCollected++;

      const typeName = opt.type === 'V' ? 'Visual' : (opt.type === 'A' ? 'Auditori' : 'Kinestetik');
      this.createFloatingText(\`+150 Skor (\${typeName})!\`, this.player.x, this.player.y - 30, '#10b981');

      // Record VAK answer
      const answerRecord = {
        id: q.id,
        category: q.category,
        question: q.question,
        type: opt.type, // 'V', 'A', 'K'
        optionText: opt.text,
        feedback: opt.feedback
      };

      const existingIdx = this.vakAnswers.findIndex(a => a.id === q.id);
      if (existingIdx !== -1) {
        this.vakAnswers[existingIdx] = answerRecord;
      } else {
        this.vakAnswers.push(answerRecord);
      }
      this.recalculateVakScores();
      this.updateHUD();

      // LANGSUNG MAIN LAGI: Tutup modal dan lanjutkan petualangan seketika tanpa perlu tombol lanjut
      setTimeout(() => {
        this.closeQuizModal();
        this.resumeAfterQuiz(true);
      }, 240);
    }
\n`;

code = code.slice(0, handleAnswerStart) + newHandleVakAnswer + code.slice(handleAnswerEnd);

// 5. Update showVictoryModal to always show the comprehensive 10-Question VAK result!
const showVicStart = code.indexOf('    showVictoryModal() {');
const showVicEnd = code.indexOf('    hideAllModals() {');
if (showVicStart === -1 || showVicEnd === -1) {
  console.error('showVictoryModal range not found');
  process.exit(1);
}

const newShowVictoryModal = `    showVictoryModal() {
      if (this.timerInterval) clearInterval(this.timerInterval);
      this.state = 'VICTORY';
      this.audio.playVictory();

      const modal = document.getElementById('marioVictoryModal');
      if (!modal) return;

      const totalAnswers = this.vakAnswers.length;
      const vCount = this.vakScores.V;
      const aCount = this.vakScores.A;
      const kCount = this.vakScores.K;
      const total = totalAnswers || 1;

      const vPct = Math.round((vCount / total) * 100);
      const aPct = Math.round((aCount / total) * 100);
      const kPct = Math.round((kCount / total) * 100);

      const dominant = ['V', 'A', 'K'].reduce((best, cur) => (this.vakScores[cur] > this.vakScores[best] ? cur : best), 'V');

      const styleTitles = {
        V: 'VISUAL',
        A: 'AUDITORI',
        K: 'KINESTETIK'
      };

      const styleColors = {
        V: '#8b5cf6',
        A: '#06b6d4',
        K: '#f97316'
      };

      const descriptions = {
        V: 'Anda memiliki kepekaan kuat terhadap representasi visual, tata letak antarmuka, infografis, video demonstrasi, dan keharmonisan warna dalam produksi multimedia.',
        A: 'Anda menyerap konsep paling efektif melalui artikulasi lisan, penjelasan guru, diskusi bertukar pikiran, narasi podcast, dan kepekaan tata suara multimedia.',
        K: 'Anda belajar paling cepat melalui interaksi langsung, manipulasi objek di aplikasi, mencoba langsung di komputer, dan merekonstruksi proyek multimedia secara nyata.'
      };

      const tips = {
        V: 'Manfaatkan video tutorial langkah demi langkah, mind mapping konsep alur kerja, dan catatan visual berwarna.',
        A: 'Gunakan rekaman suara materi, aktif berdiskusi dalam kelompok, dan dengarkan podcast edukatif multimedia.',
        K: 'Langsung praktikkan tools di software, buat proyek portofolio mini mandiri, dan pelajari materi lewat manipulasi objek langsung.'
      };

      modal.innerHTML = \`
        <div class="game-overlay-content victory-box" style="max-width: 640px;">
          <div class="victory-badge">👑 ASESMEN SELESAI &bull; BENDERA KASTIL TERCAPAI</div>
          <h2 class="victory-title" style="font-size: 1.6rem; margin-bottom: 0.25rem;">HASIL GAYA BELAJAR VAK ANDA</h2>
          <p class="victory-subtitle" style="font-size: 0.85rem; margin-bottom: 0.9rem;">
            Selamat! Anda telah menuntaskan petualangan dan menjawab <strong>\${totalAnswers} dari 10</strong> instrumen pertanyaan pembelajaran multimedia!
          </p>

          <!-- Dominant Style Banner -->
          <div style="background: rgba(255,255,255,0.05); border: 2px solid \${styleColors[dominant]}; border-radius: 14px; padding: 0.9rem 1.2rem; margin-bottom: 1rem; text-align: left;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.35rem; flex-wrap: wrap; gap: 0.5rem;">
              <span style="font-size: 0.75rem; font-weight: 800; letter-spacing: 0.05em; color: var(--text-muted);">GAYA BELAJAR DOMINAN</span>
              <span style="background: \${styleColors[dominant]}; color: #fff; padding: 2px 10px; border-radius: 9999px; font-weight: 800; font-size: 0.85rem;">
                \${styleTitles[dominant]} (\${dominant === 'V' ? vPct : (dominant === 'A' ? aPct : kPct)}%)
              </span>
            </div>
            <p style="font-size: 0.85rem; color: #f1f5f9; line-height: 1.5; margin-bottom: 0.4rem;">
              \${descriptions[dominant]}
            </p>
            <div style="font-size: 0.8rem; color: #94a3b8; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 0.4rem;">
              <strong style="color: \${styleColors[dominant]};">Saran Belajar:</strong> \${tips[dominant]}
            </div>
          </div>

          <!-- Modal Breakdown Bars -->
          <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1rem; background: rgba(0,0,0,0.3); border-radius: 12px; padding: 0.75rem 1rem;">
            <div style="display: flex; flex-direction: column; gap: 0.2rem; font-size: 0.78rem;">
              <div style="display: flex; justify-content: space-between; font-weight: 700;">
                <span style="color: #a78bfa;">Visual</span>
                <span>\${vPct}% (\${vCount} pilihan)</span>
              </div>
              <div style="height: 8px; background: rgba(255,255,255,0.1); border-radius: 9999px; overflow: hidden;">
                <div style="width: \${vPct}%; height: 100%; background: #8b5cf6; border-radius: 9999px; transition: width 0.8s ease;"></div>
              </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 0.2rem; font-size: 0.78rem;">
              <div style="display: flex; justify-content: space-between; font-weight: 700;">
                <span style="color: #22d3ee;">Auditori</span>
                <span>\${aPct}% (\${aCount} pilihan)</span>
              </div>
              <div style="height: 8px; background: rgba(255,255,255,0.1); border-radius: 9999px; overflow: hidden;">
                <div style="width: \${aPct}%; height: 100%; background: #06b6d4; border-radius: 9999px; transition: width 0.8s ease;"></div>
              </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 0.2rem; font-size: 0.78rem;">
              <div style="display: flex; justify-content: space-between; font-weight: 700;">
                <span style="color: #fb923c;">Kinestetik</span>
                <span>\${kPct}% (\${kCount} pilihan)</span>
              </div>
              <div style="height: 8px; background: rgba(255,255,255,0.1); border-radius: 9999px; overflow: hidden;">
                <div style="width: \${kPct}%; height: 100%; background: #f97316; border-radius: 9999px; transition: width 0.8s ease;"></div>
              </div>
            </div>
          </div>

          <!-- Action buttons -->
          <div class="modal-actions" style="display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap;">
            <a href="#/materi" class="btn btn-primary btn-lg" data-link style="text-decoration: none;">
              📚 Pelajari Materi Sesuai Gaya Anda
            </a>
            <button type="button" id="mvRestartAllBtn" class="btn btn-outline btn-lg">
              🔄 Main Lagi dari Awal
            </button>
          </div>
        </div>
      \`;

      const restartAllBtn = document.getElementById('mvRestartAllBtn');
      if (restartAllBtn) {
        restartAllBtn.onclick = () => {
          modal.classList.remove('active');
          this.setLevel(1);
          this.start(true);
        };
      }

      modal.classList.add('active');
    }
\n`;

code = code.slice(0, showVicStart) + newShowVictoryModal + code.slice(showVicEnd);

// 6. In updateHUD():
code = code.replace(
  'levelEl.innerHTML = `<span>${this.currentLevel} / ${this.maxLevels}</span> <span class="hud-level-name">${cfg.name}</span>`;',
  'levelEl.innerHTML = `<span class="hud-level-name">1 LEVEL ASESMEN</span>`;'
);

// Write to public/js/mario-game.js
fs.writeFileSync('public/js/mario-game.js', code);
console.log('Successfully written single-level 10-question mario-game.js! Total length:', code.length);
