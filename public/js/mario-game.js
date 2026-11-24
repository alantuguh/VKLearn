/* ==========================================================================
   SUPER MARIO MULTIMEDIA ADVENTURE — GAME ENGINE
   Canvas 2D Platformer with 5 Progressive Levels (Easy to Hard),
   Moving Platforms, Lava Hazards, Interactive Quizzes, Web Audio SFX
   ========================================================================== */

(function (window) {
  'use strict';

  // --- Retro Web Audio Synthesizer ---
  class RetroAudio {
    constructor() {
      this.ctx = null;
      this.muted = false;
    }

    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    playJump() {
      if (this.muted || !this.ctx) return;
      try {
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(160, t);
        osc.frequency.exponentialRampToValueAtTime(450, t + 0.16);

        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.16);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.16);
      } catch (e) { }
    }

    playCoin() {
      if (this.muted || !this.ctx) return;
      try {
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(987.77, t); // B5
        osc.frequency.setValueAtTime(1318.51, t + 0.08); // E6

        gain.gain.setValueAtTime(0.25, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.32);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.32);
      } catch (e) { }
    }

    playFruit() {
      if (this.muted || !this.ctx) return;
      try {
        const t = this.ctx.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, t + idx * 0.05);

          gain.gain.setValueAtTime(0.25, t + idx * 0.05);
          gain.gain.exponentialRampToValueAtTime(0.01, t + idx * 0.05 + 0.1);

          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(t + idx * 0.05);
          osc.stop(t + idx * 0.05 + 0.1);
        });
      } catch (e) { }
    }

    playBump() {
      if (this.muted || !this.ctx) return;
      try {
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(120, t);
        osc.frequency.exponentialRampToValueAtTime(60, t + 0.1);

        gain.gain.setValueAtTime(0.25, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.1);
      } catch (e) { }
    }

    playStomp() {
      if (this.muted || !this.ctx) return;
      try {
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(200, t);
        osc.frequency.exponentialRampToValueAtTime(80, t + 0.15);

        gain.gain.setValueAtTime(0.3, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.15);
      } catch (e) { }
    }

    playHurt() {
      if (this.muted || !this.ctx) return;
      try {
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(320, t);
        osc.frequency.linearRampToValueAtTime(110, t + 0.25);

        gain.gain.setValueAtTime(0.3, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.25);
      } catch (e) { }
    }

    playCorrect() {
      if (this.muted || !this.ctx) return;
      try {
        const t = this.ctx.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, t + idx * 0.08);

          gain.gain.setValueAtTime(0.3, t + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.01, t + idx * 0.08 + 0.25);

          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(t + idx * 0.08);
          osc.stop(t + idx * 0.08 + 0.25);
        });
      } catch (e) { }
    }

    playWrong() {
      if (this.muted || !this.ctx) return;
      try {
        const t = this.ctx.currentTime;
        const notes = [311.13, 293.66, 277.18, 261.63];
        notes.forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(freq, t + idx * 0.08);

          gain.gain.setValueAtTime(0.25, t + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.01, t + idx * 0.08 + 0.15);

          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(t + idx * 0.08);
          osc.stop(t + idx * 0.08 + 0.15);
        });
      } catch (e) { }
    }

    playVictory() {
      if (this.muted || !this.ctx) return;
      try {
        const t = this.ctx.currentTime;
        const seq = [
          { f: 392.00, d: 0.12 },
          { f: 523.25, d: 0.12 },
          { f: 659.25, d: 0.12 },
          { f: 783.99, d: 0.16 },
          { f: 1046.50, d: 0.45 }
        ];
        let offset = 0;
        seq.forEach(item => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(item.f, t + offset);

          gain.gain.setValueAtTime(0.35, t + offset);
          gain.gain.exponentialRampToValueAtTime(0.01, t + offset + item.d);

          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(t + offset);
          osc.stop(t + offset + item.d);
          offset += item.d + 0.02;
        });
      } catch (e) { }
    }

    playGameOver() {
      if (this.muted || !this.ctx) return;
      try {
        const t = this.ctx.currentTime;
        const seq = [
          { f: 330.0, d: 0.18 },
          { f: 293.6, d: 0.18 },
          { f: 261.6, d: 0.22 },
          { f: 196.0, d: 0.45 }
        ];
        let offset = 0;
        seq.forEach(item => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(item.f, t + offset);

          gain.gain.setValueAtTime(0.25, t + offset);
          gain.gain.exponentialRampToValueAtTime(0.01, t + offset + item.d);

          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(t + offset);
          osc.stop(t + offset + item.d);
          offset += item.d + 0.03;
        });
      } catch (e) { }
    }
  }


  // --- 10 Curated VAK Diagnostic Questions (Multimedia Learning Context) ---
  const DEFAULT_VAK_QUESTIONS = [
    {
      "id": 1,
      "category": "Pos 1: Eksplorasi Perangkat Lunak",
      "question": "Ketika pertama kali mempelajari software multimedia baru, pendekatan apa yang paling nyaman bagi Anda?",
      "options": [
        {
          "text": "Menonton video tutorial langkah demi langkah dengan ilustrasi visual yang jelas",
          "type": "V",
          "feedback": "Kecenderungan Visual: Anda mudah memahami antarmuka dan alur kerja melalui demonstrasi visual."
        },
        {
          "text": "Mendengarkan penjelasan lisan dari guru atau instruktur mengenai fungsinya",
          "type": "A",
          "feedback": "Kecenderungan Auditori: Anda mengandalkan instruksi verbal untuk memahami konsep kerja sistem."
        },
        {
          "text": "Langsung membuka software, menekan tombol-tombol fitur, dan bereksperimen mandiri",
          "type": "K",
          "feedback": "Kecenderungan Kinestetik: Anda menyerap pemahaman paling cepat lewat interaksi langsung."
        }
      ]
    },
    {
      "id": 2,
      "category": "Pos 2: Retensi & Mengingat Materi",
      "question": "Metode mana yang paling membantu Anda dalam mengingat konsep dan teori multimedia?",
      "options": [
        {
          "text": "Membuat ringkasan berupa diagram alur (flowchart), mind map, atau catatan berwarna",
          "type": "V",
          "feedback": "Kecenderungan Visual: Representasi grafis memperkuat struktur memori Anda."
        },
        {
          "text": "Membaca materi dengan bersuara atau mengulang penjelasan penting secara verbal",
          "type": "A",
          "feedback": "Kecenderungan Auditori: Suara dan resonansi verbal membantu memperkokoh daya ingat Anda."
        },
        {
          "text": "Mempraktikkan langsung latihan soal dan merekonstruksi tahapan teknis di komputer",
          "type": "K",
          "feedback": "Kecenderungan Kinestetik: Memori motorik dan hands-on memudahkan Anda mengingat prosedur."
        }
      ]
    },
    {
      "id": 3,
      "category": "Pos 3: Observasi Presentasi",
      "question": "Ketika menyimak presentasi materi di kelas atau ruang seminar, apa fokus utama Anda?",
      "options": [
        {
          "text": "Memperhatikan tata letak slide, skema grafik, infografis, dan peragaan visual",
          "type": "V",
          "feedback": "Kecenderungan Visual: Anda menyerap informasi utama melalui kejelasan visual sajian."
        },
        {
          "text": "Fokus pada intonasi suara, artikulasi, dan kedalaman penjelasan lisan penyaji",
          "type": "A",
          "feedback": "Kecenderungan Auditori: Anda peka terhadap ritme bahasa dan argumen verbal penyaji."
        },
        {
          "text": "Menunggu saat demonstrasi interaktif atau kesempatan memegang perangkat praktik",
          "type": "K",
          "feedback": "Kecenderungan Kinestetik: Keterlibatan fisik dan interaktivitas menjaga konsentrasi Anda."
        }
      ]
    },
    {
      "id": 4,
      "category": "Pos 4: Komunikasi Alur Kerja",
      "question": "Saat diminta menjelaskan teknik pengeditan media kepada rekan sejawat, cara apa yang Anda pilih?",
      "options": [
        {
          "text": "Menggambar diagram alur proses atau menunjukkan tangkapan layar (screenshot)",
          "type": "V",
          "feedback": "Kecenderungan Visual: Anda menggunakan visualisasi sebagai bahasa komunikasi utama."
        },
        {
          "text": "Menguraikan tahapan secara lisan dari awal hingga akhir dengan sistematis",
          "type": "A",
          "feedback": "Kecenderungan Auditori: Anda terbiasa menyusun kronologi ide secara verbal."
        },
        {
          "text": "Duduk bersama di depan komputer dan mempraktikkan langsung langkahnya bersama mereka",
          "type": "K",
          "feedback": "Kecenderungan Kinestetik: Anda mengajar paling efektif melalui simulasi tindakan nyata."
        }
      ]
    },
    {
      "id": 5,
      "category": "Pos 5: Minat Kreasi Multimedia",
      "question": "Dalam konteks karya multimedia, proyek mana yang paling menggugah minat Anda?",
      "options": [
        {
          "text": "Mendesain poster visual, ilustrasi digital, atau tata letak majalah digital",
          "type": "V",
          "feedback": "Kecenderungan Visual: Anda memiliki kepekaan tinggi terhadap estetika ruang dan bentuk."
        },
        {
          "text": "Memproduksi rekaman audio, scoring musik, podcast edukatif, atau penataan suara",
          "type": "A",
          "feedback": "Kecenderungan Auditori: Anda memiliki kepekaan mendalam terhadap tata suara dan akustik."
        },
        {
          "text": "Membuat game interaktif, simulasi 3D, atau aplikasi multimedia yang dapat digerakkan",
          "type": "K",
          "feedback": "Kecenderungan Kinestetik: Anda antusias menciptakan pengalaman interaktif dinamis."
        }
      ]
    },
    {
      "id": 6,
      "category": "Pos 6: Peran Kolaborasi Tim",
      "question": "Ketika mengerjakan proyek produksi multimedia dalam kelompok, peran apa yang ingin Anda ambil?",
      "options": [
        {
          "text": "Penata artistik visual, desain layout, dan penyelarasan identitas grafis",
          "type": "V",
          "feedback": "Kecenderungan Visual: Anda mengontrol aspek visual agar konsisten dan memikat."
        },
        {
          "text": "Penata suara (sound designer), narator/pengisi suara, atau komunikator presentasi",
          "type": "A",
          "feedback": "Kecenderungan Auditori: Anda mengendalikan kualitas audio dan artikulasi pesan kelompok."
        },
        {
          "text": "Integrator sistem teknis, pemrograman interaktif, atau perakit purwarupa produk",
          "type": "K",
          "feedback": "Kecenderungan Kinestetik: Anda unggul dalam merangkai mekanisme fungsional produk."
        }
      ]
    },
    {
      "id": 7,
      "category": "Pos 7: Penerimaan Evaluasi (Feedback)",
      "question": "Bentuk koreksi atau saran dari guru yang paling mudah Anda tindak lanjuti adalah...",
      "options": [
        {
          "text": "Tanda visual langsung pada karya, perbandingan visual sebelum vs sesudah",
          "type": "V",
          "feedback": "Kecenderungan Visual: Koreksi visual memudahkan Anda mengenali aspek perbaikan."
        },
        {
          "text": "Diskusi evaluasi lisan dan penjelasan mendetail melalui percakapan langsung",
          "type": "A",
          "feedback": "Kecenderungan Auditori: Diskusi mendalam membantu Anda memahami alasan di balik kritik."
        },
        {
          "text": "Demonstrasi langsung di depan layar dengan memandu tangan Anda melakukan perbaikan",
          "type": "K",
          "feedback": "Kecenderungan Kinestetik: Anda belajar memperbaiki kesalahan lewat tindakan nyata."
        }
      ]
    },
    {
      "id": 8,
      "category": "Pos 8: Eksplorasi Teori & Estetika",
      "question": "Ketika mempelajari teori harmoni warna dan komposisi gambar, Anda lebih menikmati...",
      "options": [
        {
          "text": "Menganalisis skema palet warna, lingkaran warna, dan contoh galeri karya terpilih",
          "type": "V",
          "feedback": "Kecenderungan Visual: Mempelajari contoh visual mengasah sensitivitas estetika Anda."
        },
        {
          "text": "Mendengarkan kupasan audio atau penjelasan dosen tentang filosofi dan psikologi warna",
          "type": "A",
          "feedback": "Kecenderungan Auditori: Penjelasan filosofis verbal membuka perspektif konseptual Anda."
        },
        {
          "text": "Mencampur warna, menggeser slider saturasi, dan melihat perubahan warna secara langsung",
          "type": "K",
          "feedback": "Kecenderungan Kinestetik: Anda memahami prinsip warna melalui manipulasi instrumen kerja."
        }
      ]
    },
    {
      "id": 9,
      "category": "Pos 9: Pemecahan Masalah (Troubleshooting)",
      "question": "Saat perangkat lunak multimedia Anda mengalami pesan error atau kendala teknis...",
      "options": [
        {
          "text": "Mencari artikel panduan bergambar atau bagan solusi pemecahan masalah",
          "type": "V",
          "feedback": "Kecenderungan Visual: Anda mengandalkan dokumen terstruktur untuk memandu penyelesaian."
        },
        {
          "text": "Menghubungi mentor, rekan tim, atau menyimak diskusi komunitas untuk saran perbaikan",
          "type": "A",
          "feedback": "Kecenderungan Auditori: Komunikasi dua arah memberi solusi yang cepat bagi Anda."
        },
        {
          "text": "Mencoba berbagai kombinasi tombol pengaturan dan menguji alternatif sampai berhasil",
          "type": "K",
          "feedback": "Kecenderungan Kinestetik: Anda berani mengambil inisiatif eksperimental berbasis aksi."
        }
      ]
    },
    {
      "id": 10,
      "category": "Pos 10: Capaian Portofolio Belajar",
      "question": "Bagi Anda, ukuran keberhasilan utama setelah mempelajari modul multimedia adalah...",
      "options": [
        {
          "text": "Mampu menghasilkan karya visual yang estetis, rapi, dan memiliki pesan visual kuat",
          "type": "V",
          "feedback": "Kecenderungan Visual: Nilai estetika visual menjadi tolak ukur kepuasan Anda."
        },
        {
          "text": "Mampu merangkai narasi audio dan tata suara yang harmonis serta jernih",
          "type": "A",
          "feedback": "Kecenderungan Auditori: Kejernihan audio dan narasi menjadi tolok ukur kesempurnaan karya Anda."
        },
        {
          "text": "Mampu membangun produk interaktif yang responsif dan dapat dioperasikan secara nyata",
          "type": "K",
          "feedback": "Kecenderungan Kinestetik: Fungsionalitas interaktif nyata adalah puncak kepuasan Anda."
        }
      ]
    }
  ];

  // 2 Questions mapped to each of the 5 Progressive Levels
  const LEVEL_VAK_MAP = {
    1: [0, 1], // Pos 1 & Pos 2
    2: [2, 3], // Pos 3 & Pos 4
    3: [4, 5], // Pos 5 & Pos 6
    4: [6, 7], // Pos 7 & Pos 8
    5: [8, 9]  // Pos 9 & Pos 10
  };

  // --- Level Configuration (1 Comprehensive Level with 10 Assessment Questions) ---
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
  };

  // --- Main Mario Game Class ---
  class MarioQuizGame {
    constructor(canvas, container, options = {}) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.container = container;
      this.audio = new RetroAudio();

      // Viewport dimensions
      this.width = 960;
      this.height = 540;
      this.canvas.width = this.width;
      this.canvas.height = this.height;

      // Level System (1 to 5)
      this.currentLevel = 1;
      this.maxLevels = 1;
      this.worldWidth = 2800;

      // Game State: 'START', 'PLAYING', 'QUIZ', 'GAMEOVER', 'VICTORY'
      this.state = 'START';

      // Stats
      this.maxLives = 3;
      this.lives = 3;
      this.score = 0;
      this.coinsCollected = 0;
      this.fruitsCollected = 0;
      this.totalFruits = 3;
      this.quizHistory = [];
      this.vakAnswers = [];
      this.vakScores = { V: 0, A: 0, K: 0 };
      this.totalVakQuestions = 10;
      this.timeLeft = 360;
      this.timerInterval = null;

      // Camera
      this.cameraX = 0;

      // Input keys
      this.keys = {
        left: false,
        right: false,
        jump: false
      };

      // Player Mario
      this.player = {
        x: 80,
        y: 380,
        vx: 0,
        vy: 0,
        width: 34,
        height: 46,
        isGrounded: false,
        facing: 'right',
        animTimer: 0,
        invulnerableTimer: 0,
        respawnX: 80,
        respawnY: 380,
        ridingPlatform: null
      };

      // Question Pools (10 VAK Diagnostic Questions)
      this.questions = [...DEFAULT_VAK_QUESTIONS];
      this.currentQuizFruit = null;
      this.currentQuestion = null;

      // World Elements
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
      this.flagpole = { x: 2550, y: 150, width: 14, height: 320, flagY: 170, reached: false };
      this.castle = { x: 2620, y: 290, width: 120, height: 180 };

      // Bindings
      this.loop = this.loop.bind(this);
      this.handleKeyDown = this.handleKeyDown.bind(this);
      this.handleKeyUp = this.handleKeyUp.bind(this);

      this.setLevel(1);
      this.setupEventListeners();
    }

    setLevel(levelNum) {
      this.currentLevel = Math.max(1, Math.min(this.maxLevels, levelNum));
      const cfg = LEVEL_CONFIGS[this.currentLevel];
      this.worldWidth = cfg.worldWidth;
      this.timeLeft = cfg.time;

      this.initQuestions();
      this.initLevel();
      this.updateHUD();
      this.updateLevelSelectUI();
    }

    nextLevel() {
      if (this.currentLevel < this.maxLevels) {
        this.currentLevel++;
        // Reward: restore 1 heart on level advance if damaged
        if (this.lives < this.maxLives) {
          this.lives++;
        }
        this.setLevel(this.currentLevel);
        this.start(false); // start without zeroing total accumulated score
      } else {
        // Tamat! Loop back to 1
        this.currentLevel = 1;
        this.setLevel(1);
        this.start(true);
      }
    }

    restartLevel() {
      this.initLevel();
      this.start(false);
    }

    async initQuestions() {
      // Default to curated VAK diagnostic questions
      this.questions = [...DEFAULT_VAK_QUESTIONS];

      try {
        const res = await fetch('/api/game/questions');
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.data) && data.data.length >= 10) {
            this.questions = data.data;
          }
        }
      } catch (err) {
        // Fallback is already loaded
      }
    }

    setupEventListeners() {
      window.addEventListener('keydown', this.handleKeyDown);
      window.addEventListener('keyup', this.handleKeyUp);
    }

    destroy() {
      window.removeEventListener('keydown', this.handleKeyDown);
      window.removeEventListener('keyup', this.handleKeyUp);
      if (this.timerInterval) clearInterval(this.timerInterval);
      if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
    }

    handleKeyDown(e) {
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        if (this.state === 'PLAYING') {
          e.preventDefault();
        }
      }

      this.audio.init();

      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        this.keys.left = true;
      }
      if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        this.keys.right = true;
      }
      if (e.code === 'ArrowUp' || e.code === 'KeyW' || e.code === 'Space') {
        if (!this.keys.jump && this.player.isGrounded && this.state === 'PLAYING') {
          this.player.vy = -12.4;
          this.player.isGrounded = false;
          this.player.ridingPlatform = null;
          this.audio.playJump();
          this.createDustParticles(this.player.x + 17, this.player.y + 46);
        }
        this.keys.jump = true;
      }
    }

    handleKeyUp(e) {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        this.keys.left = false;
      }
      if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        this.keys.right = false;
      }
      if (e.code === 'ArrowUp' || e.code === 'KeyW' || e.code === 'Space') {
        this.keys.jump = false;
        if (this.player.vy < -5) {
          this.player.vy = -5;
        }
      }
    }

    setTouchKey(key, isPressed) {
      this.audio.init();
      if (key === 'jump') {
        if (isPressed && !this.keys.jump && this.player.isGrounded && this.state === 'PLAYING') {
          this.player.vy = -12.4;
          this.player.isGrounded = false;
          this.player.ridingPlatform = null;
          this.audio.playJump();
          this.createDustParticles(this.player.x + 17, this.player.y + 46);
        }
        this.keys.jump = isPressed;
      } else if (key === 'left') {
        this.keys.left = isPressed;
      } else if (key === 'right') {
        this.keys.right = isPressed;
      }
    }

    initLevel() {
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

    start(resetScore = true) {
      this.audio.init();
      this.state = 'PLAYING';
      if (resetScore) {
        this.score = 0;
        this.lives = this.maxLives;
        this.vakAnswers = [];
        this.vakScores = { V: 0, A: 0, K: 0 };
      }
      this.coinsCollected = 0;
      this.fruitsCollected = this.vakAnswers.length;
      this.timeLeft = LEVEL_CONFIGS[this.currentLevel].time;

      this.initLevel();

      if (this.timerInterval) clearInterval(this.timerInterval);
      this.timerInterval = setInterval(() => {
        if (this.state === 'PLAYING') {
          this.timeLeft--;
          if (this.timeLeft <= 0) {
            this.handleGameOver('Waktu Habis!');
          }
          this.updateHUD();
        }
      }, 1000);

      this.updateHUD();
      this.hideAllModals();

      if (!this.animFrameId) {
        this.animFrameId = requestAnimationFrame(this.loop);
      }
    }

    restart() {
      this.start(true);
    }

    // --- Main Loop ---
    loop(timestamp) {
      if (this.state === 'PLAYING') {
        this.update();
      }
      this.render();
      this.animFrameId = requestAnimationFrame(this.loop);
    }

    // --- Physics & Logic Update ---
    update() {
      const p = this.player;
      const cfg = LEVEL_CONFIGS[this.currentLevel] || LEVEL_CONFIGS[1];

      // Update Moving Platforms
      for (const mp of this.movingPlatforms) {
        mp.x += mp.vx;
        mp.y += mp.vy;

        if (mp.vx > 0 && mp.x >= mp.maxX) {
          mp.x = mp.maxX;
          mp.vx = -mp.vx;
        } else if (mp.vx < 0 && mp.x <= mp.minX) {
          mp.x = mp.minX;
          mp.vx = -mp.vx;
        }

        if (mp.vy > 0 && mp.y >= mp.maxY) {
          mp.y = mp.maxY;
          mp.vy = -mp.vy;
        } else if (mp.vy < 0 && mp.y <= mp.minY) {
          mp.y = mp.minY;
          mp.vy = -mp.vy;
        }
      }

      // If Mario was riding a moving platform, carry him along
      if (p.isGrounded && p.ridingPlatform) {
        p.x += p.ridingPlatform.vx;
        p.y = p.ridingPlatform.y - p.height;
      }

      const accel = 0.55;
      const maxSpeed = 4.4;
      const friction = 0.82;

      if (this.keys.left) {
        p.vx -= accel;
        p.facing = 'left';
      }
      if (this.keys.right) {
        p.vx += accel;
        p.facing = 'right';
      }

      p.vx *= friction;
      if (Math.abs(p.vx) > maxSpeed) {
        p.vx = Math.sign(p.vx) * maxSpeed;
      }
      if (Math.abs(p.vx) < 0.05) p.vx = 0;

      p.vy += 0.52;
      if (p.vy > 13) p.vy = 13;

      p.x += p.vx;
      this.checkHorizontalCollisions(p);

      p.y += p.vy;
      p.isGrounded = false;
      p.ridingPlatform = null;
      this.checkVerticalCollisions(p);

      p.animTimer += Math.abs(p.vx) * 0.15 + 0.05;
      if (p.invulnerableTimer > 0) {
        p.invulnerableTimer--;
      }

      // Pitfall / Lava check
      if (cfg.hasLava && p.y >= 480) {
        this.handleLavaBurn();
      } else if (p.y > this.height + 50) {
        this.handlePitfall();
      }

      // Respawn checkpoint update
      if (p.isGrounded && p.y >= 380 && p.x > p.respawnX) {
        p.respawnX = p.x;
        p.respawnY = p.y - 10;
      }

      // Question blocks bump decay
      this.questionBlocks.forEach(qb => {
        if (qb.bumpY > 0) {
          qb.bumpY -= 1.2;
          if (qb.bumpY < 0) qb.bumpY = 0;
        }
      });

      this.checkCoinCollisions(p);
      this.checkFruitCollisions(p);
      this.updateEnemies(p);
      this.updateParticles();
      this.checkGoalCollision(p);

      // Camera smooth follow
      const targetCamX = p.x - this.width * 0.38;
      this.cameraX += (targetCamX - this.cameraX) * 0.1;
      if (this.cameraX < 0) this.cameraX = 0;
      if (this.cameraX > this.worldWidth - this.width) {
        this.cameraX = this.worldWidth - this.width;
      }

      // Clouds movement
      this.clouds.forEach(c => {
        c.x += c.speed;
        if (c.x > this.worldWidth + 100) {
          c.x = -150;
        }
      });

      // Mist movement (Level 4)
      this.mist.forEach(m => {
        m.x += m.vx;
        if (m.x > this.worldWidth + 100) {
          m.x = -100;
        }
      });
    }

    checkHorizontalCollisions(p) {
      if (p.x < 0) {
        p.x = 0;
        p.vx = 0;
      }

      const allSolids = [...this.platforms, ...this.questionBlocks];
      for (const sol of allSolids) {
        if (
          p.x + p.width > sol.x &&
          p.x < sol.x + sol.width &&
          p.y + p.height > sol.y + 4 &&
          p.y < sol.y + sol.height - 4
        ) {
          if (p.vx > 0) {
            p.x = sol.x - p.width;
            p.vx = 0;
          } else if (p.vx < 0) {
            p.x = sol.x + sol.width;
            p.vx = 0;
          }
        }
      }
    }

    checkVerticalCollisions(p) {
      const allSolids = [...this.platforms, ...this.questionBlocks, ...this.movingPlatforms];

      for (const sol of allSolids) {
        if (p.x + p.width - 6 > sol.x && p.x + 6 < sol.x + sol.width) {
          // Landing on top
          if (p.vy >= 0 && p.y + p.height >= sol.y && p.y + p.height <= sol.y + 16) {
            p.y = sol.y - p.height;
            p.vy = 0;
            p.isGrounded = true;
            if (sol.type === 'moving') {
              p.ridingPlatform = sol;
            }
          }
          // Hitting from bottom (only questionBlocks & bricks)
          else if (sol.type !== 'moving' && p.vy < 0 && p.y <= sol.y + sol.height && p.y >= sol.y + sol.height - 16) {
            p.y = sol.y + sol.height;
            p.vy = 1;
            this.handleBlockBump(sol);
          }
        }
      }
    }

    handleBlockBump(block) {
      if (block.hasCoin || block.hasFruit) {
        if (!block.hit) {
          block.hit = true;
          block.bumpY = 10;
          this.audio.playBump();

          if (block.hasCoin) {
            this.score += 20;
            this.coinsCollected++;
            this.audio.playCoin();
            this.createFloatingText('+20', block.x + 10, block.y - 20, '#fbbf24');
            this.createSparkleParticles(block.x + 17, block.y - 10, '#fbbf24');
            this.updateHUD();
          } else if (block.hasFruit) {
            const fruitType = block.fruitType || 'star';
            const spawnedFruit = {
              id: 99 + Math.random(),
              type: fruitType,
              name: 'Buah Misteri',
              icon: fruitType === 'star' ? '⭐' : '🍄',
              x: block.x + 1,
              y: block.y - 36,
              baseY: block.y - 36,
              width: 32,
              height: 32,
              collected: false,
              color: '#fbbf24'
            };
            this.fruits.push(spawnedFruit);
            this.totalFruits = this.fruits.filter(f => !f.collected).length + this.fruitsCollected;
            this.audio.playFruit();
            this.createFloatingText('BUAH!', block.x + 5, block.y - 20, '#a855f7');
            this.updateHUD();
          }
        }
      } else {
        this.audio.playBump();
      }
    }

    checkCoinCollisions(p) {
      for (const coin of this.coins) {
        if (!coin.collected) {
          if (
            p.x + p.width > coin.x &&
            p.x < coin.x + coin.width &&
            p.y + p.height > coin.y &&
            p.y < coin.y + coin.height
          ) {
            coin.collected = true;
            this.score += 20;
            this.coinsCollected++;
            this.audio.playCoin();
            this.createSparkleParticles(coin.x + 10, coin.y + 12, '#fbbf24');
            this.createFloatingText('+20', coin.x, coin.y - 15, '#fbbf24');
            this.updateHUD();
          }
        }
      }
    }

    checkFruitCollisions(p) {
      for (const fruit of this.fruits) {
        if (!fruit.collected) {
          const bobY = fruit.baseY + Math.sin(Date.now() * 0.005 + fruit.id) * 6;
          fruit.y = bobY;

          if (
            p.x + p.width > fruit.x &&
            p.x < fruit.x + fruit.width &&
            p.y + p.height > fruit.y &&
            p.y < fruit.y + fruit.height
          ) {
            this.triggerQuiz(fruit);
            break;
          }
        }
      }
    }

    triggerQuiz(fruit) {
      fruit.collected = true;
      this.currentQuizFruit = fruit;
      this.state = 'QUIZ';
      this.audio.playFruit();

      const qIdx = fruit.questionIndex !== undefined
        ? fruit.questionIndex
        : ((this.currentLevel - 1) * 2 + (fruit.id - 1));

      const q = this.questions[qIdx] || DEFAULT_VAK_QUESTIONS[qIdx] || DEFAULT_VAK_QUESTIONS[0];
      this.currentQuestion = q;
      this.showQuizModal(fruit, q);
    }

    showQuizModal(fruit, q) {
      const modal = document.getElementById('marioQuizModal');
      if (!modal) return;

      const fruitIcon = document.getElementById('mqFruitIcon');
      const catBadge = document.getElementById('mqCategory');
      const qText = document.getElementById('mqQuestionText');
      const optionsContainer = document.getElementById('mqOptionsList');
      const feedbackEl = document.getElementById('mqFeedback');
      const continueBtn = document.getElementById('mqContinueBtn');

      if (fruitIcon) fruitIcon.textContent = fruit.icon || 'Pos';
      if (catBadge) catBadge.textContent = q.category || `Level ${this.currentLevel} • Pos ${q.id} dari 10`;
      if (qText) qText.textContent = q.question;
      if (feedbackEl) feedbackEl.style.display = 'none';
      if (continueBtn) continueBtn.style.display = 'none';

      if (optionsContainer) {
        optionsContainer.innerHTML = '';
        const letters = ['A', 'B', 'C'];
        q.options.forEach((opt, idx) => {
          const btn = document.createElement('button');
          btn.className = 'mq-opt-btn';
          btn.innerHTML = `
            <span class="mq-opt-letter">${letters[idx]}</span>
            <span class="mq-opt-text">${opt.text}</span>
          `;
          btn.onclick = () => this.handleVakAnswer(idx, btn, q, opt, fruit);
          optionsContainer.appendChild(btn);
        });
      }

      modal.classList.add('active');
    }

    handleVakAnswer(selectedIndex, selectedBtn, q, opt, fruit) {
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
      this.createFloatingText(`+150 Skor (${typeName})!`, this.player.x, this.player.y - 30, '#10b981');

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

      // Show feedback briefly, then auto-close and resume game
      const feedbackEl = document.getElementById('mqFeedback');
      if (feedbackEl) {
        feedbackEl.textContent = opt.feedback || `Respon ${typeName} tercatat!`;
        feedbackEl.style.display = 'block';
        feedbackEl.className = 'mq-feedback correct';
      }

      // LANGSUNG MAIN LAGI: Tutup modal dan lanjutkan petualangan seketika
      setTimeout(() => {
        this.closeQuizModal();
        this.resumeAfterQuiz(true);
      }, 800);
    }

    recalculateVakScores() {
      this.vakScores = { V: 0, A: 0, K: 0 };
      for (const answer of this.vakAnswers) {
        if (answer.type === 'V') this.vakScores.V++;
        else if (answer.type === 'A') this.vakScores.A++;
        else if (answer.type === 'K') this.vakScores.K++;
      }
    }

    closeQuizModal() {
      const modal = document.getElementById('marioQuizModal');
      if (modal) modal.classList.remove('active');
    }

    resumeAfterQuiz(wasCorrect) {
      this.state = 'PLAYING';
      this.player.invulnerableTimer = 80;
      if (wasCorrect) {
        this.createSparkleParticles(this.player.x + 17, this.player.y + 20, '#10b981', 12);
      }
    }

    updateEnemies(p) {
      for (const enemy of this.enemies) {
        if (enemy.alive) {
          enemy.x += enemy.vx;
          if (enemy.x <= enemy.minX) {
            enemy.x = enemy.minX;
            enemy.vx = Math.abs(enemy.vx);
          } else if (enemy.x >= enemy.maxX) {
            enemy.x = enemy.maxX;
            enemy.vx = -Math.abs(enemy.vx);
          }

          if (
            p.x + p.width - 6 > enemy.x &&
            p.x + 6 < enemy.x + enemy.width &&
            p.y + p.height > enemy.y &&
            p.y < enemy.y + enemy.height
          ) {
            if (p.vy > 0 && p.y + p.height < enemy.y + 16) {
              enemy.alive = false;
              enemy.squishTimer = 30;
              p.vy = -8.5;
              this.score += 50;
              this.audio.playStomp();
              this.createFloatingText('+50', enemy.x, enemy.y - 15, '#f59e0b');
              this.createSparkleParticles(enemy.x + 16, enemy.y + 16, '#f59e0b');
              this.updateHUD();
            } else if (p.invulnerableTimer === 0) {
              this.handlePlayerHurt();
            }
          }
        } else if (enemy.squishTimer > 0) {
          enemy.squishTimer--;
        }
      }
    }

    handlePlayerHurt() {
      this.lives--;
      this.audio.playHurt();
      this.player.invulnerableTimer = 90;
      this.player.vy = -6;
      this.player.vx = this.player.facing === 'right' ? -4 : 4;
      this.createFloatingText('-1 Hati', this.player.x, this.player.y - 20, '#ef4444');
      this.updateHUD();

      if (this.lives <= 0) {
        this.handleGameOver('Tersingkir oleh Musuh!');
      }
    }

    handlePitfall() {
      this.lives--;
      this.audio.playHurt();
      this.updateHUD();

      if (this.lives <= 0) {
        this.handleGameOver('Terjatuh ke Jurang!');
      } else {
        this.player.x = this.player.respawnX;
        this.player.y = this.player.respawnY;
        this.player.vx = 0;
        this.player.vy = 0;
        this.player.invulnerableTimer = 90;
      }
    }

    handleLavaBurn() {
      this.lives--;
      this.audio.playHurt();
      this.createSparkleParticles(this.player.x + 17, 490, '#f97316', 20);
      this.createFloatingText('LAVA! -1 Hati', this.player.x, 460, '#ef4444');
      this.updateHUD();

      if (this.lives <= 0) {
        this.handleGameOver('Tenggelam di Lahar Panas Kastil!');
      } else {
        this.player.x = this.player.respawnX;
        this.player.y = this.player.respawnY;
        this.player.vx = 0;
        this.player.vy = 0;
        this.player.invulnerableTimer = 90;
      }
    }

    checkGoalCollision(p) {
      const fp = this.flagpole;
      if (!fp.reached && p.x + p.width >= fp.x && p.x <= fp.x + fp.width + 10) {
        fp.reached = true;
        this.state = 'VICTORY';
        this.audio.playVictory();

        const slideInterval = setInterval(() => {
          if (fp.flagY < fp.y + fp.height - 40) {
            fp.flagY += 4;
          } else {
            clearInterval(slideInterval);
            setTimeout(() => this.showVictoryModal(), 600);
          }
        }, 20);

        const heartBonus = this.lives * 200;
        const fruitBonus = this.fruitsCollected * 100;
        this.score += 500 + heartBonus + fruitBonus;
        this.updateHUD();
      }
    }

    handleGameOver(reason) {
      this.state = 'GAMEOVER';
      this.audio.playGameOver();
      if (this.timerInterval) clearInterval(this.timerInterval);

      setTimeout(() => {
        const modal = document.getElementById('marioGameOverModal');
        if (modal) {
          const reasonEl = document.getElementById('mgoReason');
          const scoreEl = document.getElementById('mgoScore');
          const fruitsEl = document.getElementById('mgoFruits');
          const restartBtn = document.getElementById('mgoRestartBtn');

          if (reasonEl) reasonEl.textContent = `${reason || 'Nyawa kamu habis!'} (Gagal di Level ${this.currentLevel})`;
          if (scoreEl) scoreEl.textContent = this.score;
          if (fruitsEl) fruitsEl.textContent = `${this.vakAnswers.length}/10 VAK`;

          if (restartBtn) {
            restartBtn.innerHTML = `🔄 Ulangi Level ${this.currentLevel}`;
            if (fruitsEl) fruitsEl.textContent = `${this.vakAnswers.length}/10 VAK Terjawab`;
            restartBtn.onclick = () => {
              modal.classList.remove('active');
              this.restartLevel();
            };
          }

          modal.classList.add('active');
        }
      }, 500);
    }

    showVictoryModal() {
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

      // Sync with global state if available
      if (typeof state !== 'undefined' && state) {
        state.quizResult = {
          dominant: dominant,
          dominantName: styleTitles[dominant],
          percentages: { V: vPct, A: aPct, K: kPct }
        };
        state.userStyle = styleTitles[dominant];
        const styleMap = { V: 'visual', A: 'auditory', K: 'kinesthetic' };
        state.selectedStyle = styleMap[dominant] || 'visual';
      }

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

      modal.innerHTML = `
        <div class="game-overlay-content victory-box" style="max-width: 640px;">
          <h2 class="victory-title" style="font-size: 1.6rem; margin-bottom: 0.25rem;">HASIL GAYA BELAJAR VAK ANDA</h2>
          <p class="victory-subtitle" style="font-size: 0.85rem; margin-bottom: 0.9rem;">
            Selamat! Anda telah menuntaskan petualangan dan menjawab <strong>${totalAnswers} dari 10</strong> instrumen pertanyaan pembelajaran multimedia!
          </p>

          <!-- Dominant Style Banner -->
          <div style="background: rgba(255,255,255,0.05); border: 2px solid ${styleColors[dominant]}; border-radius: 14px; padding: 0.9rem 1.2rem; margin-bottom: 1rem; text-align: left;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.35rem; flex-wrap: wrap; gap: 0.5rem;">
              <span style="font-size: 0.75rem; font-weight: 800; letter-spacing: 0.05em; color: var(--text-muted);">GAYA BELAJAR DOMINAN</span>
              <span style="background: ${styleColors[dominant]}; color: #fff; padding: 2px 10px; border-radius: 9999px; font-weight: 800; font-size: 0.85rem;">
                ${styleTitles[dominant]} (${dominant === 'V' ? vPct : (dominant === 'A' ? aPct : kPct)}%)
              </span>
            </div>
            <p style="font-size: 0.85rem; color: #f1f5f9; line-height: 1.5; margin-bottom: 0.4rem;">
              ${descriptions[dominant]}
            </p>
            <div style="font-size: 0.8rem; color: #94a3b8; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 0.4rem;">
              <strong style="color: ${styleColors[dominant]};">Saran Belajar:</strong> ${tips[dominant]}
            </div>
          </div>

          <!-- Modal Breakdown Bars -->
          <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1rem; background: rgba(0,0,0,0.3); border-radius: 12px; padding: 0.75rem 1rem;">
            <div style="display: flex; flex-direction: column; gap: 0.2rem; font-size: 0.78rem;">
              <div style="display: flex; justify-content: space-between; font-weight: 700;">
                <span style="color: #a78bfa;">Visual</span>
                <span>${vPct}% (${vCount} pilihan)</span>
              </div>
              <div style="height: 8px; background: rgba(255,255,255,0.1); border-radius: 9999px; overflow: hidden;">
                <div style="width: ${vPct}%; height: 100%; background: #8b5cf6; border-radius: 9999px; transition: width 0.8s ease;"></div>
              </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 0.2rem; font-size: 0.78rem;">
              <div style="display: flex; justify-content: space-between; font-weight: 700;">
                <span style="color: #22d3ee;">Auditori</span>
                <span>${aPct}% (${aCount} pilihan)</span>
              </div>
              <div style="height: 8px; background: rgba(255,255,255,0.1); border-radius: 9999px; overflow: hidden;">
                <div style="width: ${aPct}%; height: 100%; background: #06b6d4; border-radius: 9999px; transition: width 0.8s ease;"></div>
              </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 0.2rem; font-size: 0.78rem;">
              <div style="display: flex; justify-content: space-between; font-weight: 700;">
                <span style="color: #fb923c;">Kinestetik</span>
                <span>${kPct}% (${kCount} pilihan)</span>
              </div>
              <div style="height: 8px; background: rgba(255,255,255,0.1); border-radius: 9999px; overflow: hidden;">
                <div style="width: ${kPct}%; height: 100%; background: #f97316; border-radius: 9999px; transition: width 0.8s ease;"></div>
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
      `;

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

    hideAllModals() {
      const m1 = document.getElementById('marioQuizModal');
      const m2 = document.getElementById('marioGameOverModal');
      const m3 = document.getElementById('marioVictoryModal');
      if (m1) m1.classList.remove('active');
      if (m2) m2.classList.remove('active');
      if (m3) m3.classList.remove('active');
    }

    updateHUD() {
      const scoreEl = document.getElementById('mqHudScore');
      const livesEl = document.getElementById('mqHudLives');
      const fruitsEl = document.getElementById('mqHudFruits');
      const timerEl = document.getElementById('mqHudTimer');
      const levelEl = document.getElementById('mqHudLevel');

      if (scoreEl) scoreEl.textContent = String(this.score).padStart(6, '0');
      if (livesEl) {
        let heartsStr = '';
        for (let i = 0; i < this.maxLives; i++) {
          heartsStr += i < this.lives ? '❤️' : '🖤';
        }
        livesEl.innerHTML = heartsStr;
      }
      if (fruitsEl) fruitsEl.textContent = `${this.fruitsCollected}/${this.totalFruits}`;
      if (timerEl) timerEl.textContent = `${this.timeLeft}s`;

      if (levelEl) {
        const cfg = LEVEL_CONFIGS[this.currentLevel] || LEVEL_CONFIGS[1];
        levelEl.innerHTML = `<span class="hud-level-name">1 LEVEL ASESMEN</span>`;
      }
    }

    updateLevelSelectUI() {
      const levelBtns = document.querySelectorAll('#marioLevelSelectGrid .level-btn');
      levelBtns.forEach(btn => {
        const lvl = parseInt(btn.dataset.level, 10);
        btn.classList.toggle('active', lvl === this.currentLevel);
      });
    }

    createDustParticles(x, y) {
      for (let i = 0; i < 6; i++) {
        this.particles.push({
          x: x,
          y: y,
          vx: (Math.random() - 0.5) * 2,
          vy: -Math.random() * 2,
          radius: Math.random() * 3 + 2,
          alpha: 0.8,
          life: 20,
          color: '#cbd5e1'
        });
      }
    }

    createSparkleParticles(x, y, color = '#fbbf24', count = 12) {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3 + 1;
        this.particles.push({
          x: x,
          y: y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius: Math.random() * 3 + 1.5,
          alpha: 1.0,
          life: 30,
          color: color
        });
      }
    }

    createFloatingText(text, x, y, color = '#fbbf24') {
      this.floatingTexts.push({
        text,
        x,
        y,
        vy: -1.2,
        alpha: 1.0,
        life: 45,
        color
      });
    }

    updateParticles() {
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 1 / p.life;
        if (p.alpha <= 0) {
          this.particles.splice(i, 1);
        }
      }

      for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
        const ft = this.floatingTexts[i];
        ft.y += ft.vy;
        ft.alpha -= 1 / ft.life;
        if (ft.alpha <= 0) {
          this.floatingTexts.splice(i, 1);
        }
      }
    }

    render() {
      const ctx = this.ctx;
      const cfg = LEVEL_CONFIGS[this.currentLevel] || LEVEL_CONFIGS[1];

      ctx.clearRect(0, 0, this.width, this.height);
      ctx.save();

      // Sky Gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, this.height);
      skyGrad.addColorStop(0, cfg.sky[0]);
      skyGrad.addColorStop(0.65, cfg.sky[1]);
      skyGrad.addColorStop(1, cfg.sky[2]);
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, this.width, this.height);

      ctx.translate(-this.cameraX, 0);

      // Starry sky (Level 3)
      if (cfg.hasStars) {
        this.drawStars(ctx);
      }

      // Hills
      this.hills.forEach(hill => {
        ctx.beginPath();
        ctx.arc(hill.x, hill.y, hill.radius, Math.PI, 0, false);
        ctx.fillStyle = hill.color;
        ctx.fill();
      });

      // Clouds
      ctx.fillStyle = cfg.hasStars ? 'rgba(255, 255, 255, 0.35)' : 'rgba(255, 255, 255, 0.85)';
      this.clouds.forEach(c => {
        this.drawCloud(ctx, c.x, c.y, c.scale);
      });

      // Mist (Level 4)
      if (cfg.hasMist) {
        this.drawMist(ctx);
      }

      // Lava Abyss (Level 5)
      if (cfg.hasLava) {
        this.drawLava(ctx);
      }

      // Platforms (Ground, Bricks, Pipes, Islands)
      this.platforms.forEach(plat => {
        this.drawPlatform(ctx, plat, cfg);
      });

      // Moving Platforms
      this.movingPlatforms.forEach(mp => {
        this.drawMovingPlatform(ctx, mp, cfg);
      });

      // Question Blocks
      this.questionBlocks.forEach(qb => {
        this.drawQuestionBlock(ctx, qb);
      });

      // Coins
      this.coins.forEach(coin => {
        if (!coin.collected) {
          this.drawCoin(ctx, coin);
        }
      });

      // Fruits
      this.fruits.forEach(fruit => {
        if (!fruit.collected) {
          this.drawFruit(ctx, fruit);
        }
      });

      // Castle & Flagpole
      this.drawCastleAndFlag(ctx, cfg);

      // Enemies
      this.enemies.forEach(enemy => {
        this.drawEnemy(ctx, enemy);
      });

      // Player Mario
      this.drawPlayer(ctx, this.player);

      // Particles & Floating texts
      this.particles.forEach(p => {
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      this.floatingTexts.forEach(ft => {
        ctx.save();
        ctx.globalAlpha = Math.max(0, ft.alpha);
        ctx.font = 'bold 16px "Inter", sans-serif';
        ctx.fillStyle = ft.color;
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3;
        ctx.strokeText(ft.text, ft.x, ft.y);
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.restore();
      });

      ctx.restore();
    }

    drawStars(ctx) {
      ctx.save();
      const time = Date.now() * 0.003;
      this.stars.forEach((s, idx) => {
        const twinkle = (Math.sin(time * 2 + idx) + 1) * 0.4 + 0.2;
        ctx.fillStyle = `rgba(255, 255, 255, ${twinkle})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();
    }

    drawMist(ctx) {
      ctx.save();
      this.mist.forEach(m => {
        ctx.fillStyle = 'rgba(16, 185, 129, 0.12)';
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.radius, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();
    }

    drawLava(ctx) {
      ctx.save();
      const time = Date.now() * 0.003;
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(0, 485, this.worldWidth, 55);

      ctx.fillStyle = '#f97316';
      ctx.beginPath();
      ctx.moveTo(0, 485);
      for (let x = 0; x <= this.worldWidth; x += 35) {
        const wave = Math.sin(time * 3 + x * 0.03) * 6;
        ctx.lineTo(x, 485 + wave);
      }
      ctx.lineTo(this.worldWidth, 540);
      ctx.lineTo(0, 540);
      ctx.closePath();
      ctx.fill();

      // Lava bubbles
      ctx.fillStyle = '#fde047';
      for (let x = 40; x < this.worldWidth; x += 160) {
        const bubbleY = 485 + Math.sin(time * 4 + x) * 5;
        ctx.beginPath();
        ctx.arc(x, bubbleY, 5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    drawCloud(ctx, x, y, scale = 1) {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(scale, scale);
      ctx.beginPath();
      ctx.arc(40, 30, 24, 0, Math.PI * 2);
      ctx.arc(70, 24, 30, 0, Math.PI * 2);
      ctx.arc(100, 30, 24, 0, Math.PI * 2);
      ctx.arc(70, 40, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    drawPlatform(ctx, plat, cfg) {
      if (plat.type === 'ground' || plat.type === 'grass-island') {
        ctx.fillStyle = cfg.grassColor;
        ctx.fillRect(plat.x, plat.y, plat.width, 12);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.fillRect(plat.x, plat.y, plat.width, 3);
        ctx.fillStyle = cfg.groundColor;
        ctx.fillRect(plat.x, plat.y + 12, plat.width, plat.height - 12);

        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        for (let bx = plat.x; bx < plat.x + plat.width; bx += 32) {
          ctx.fillRect(bx, plat.y + 16, 2, plat.height - 16);
          ctx.fillRect(bx + 16, plat.y + 36, 2, plat.height - 36);
        }
        ctx.fillRect(plat.x, plat.y + 34, plat.width, 2);
      } else if (plat.type === 'pipe') {
        ctx.fillStyle = cfg.pipeColor;
        ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fillRect(plat.x + 8, plat.y, 14, plat.height);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(plat.x + plat.width - 12, plat.y, 12, plat.height);

        ctx.fillStyle = cfg.pipeColor;
        ctx.fillRect(plat.x - 4, plat.y, plat.width + 8, 16);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.fillRect(plat.x - 4, plat.y, plat.width + 8, 4);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
        ctx.fillRect(plat.x - 4, plat.y + 14, plat.width + 8, 2);
      } else if (plat.type === 'brick') {
        ctx.fillStyle = cfg.brickColor;
        ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.fillRect(plat.x, plat.y, plat.width, 3);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(plat.x, plat.y + plat.height - 3, plat.width, 3);

        for (let bx = plat.x; bx < plat.x + plat.width; bx += 30) {
          ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
          ctx.fillRect(bx, plat.y, 2, plat.height);
        }
      }
    }

    drawMovingPlatform(ctx, mp, cfg) {
      ctx.save();
      // Outer platform body
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(mp.x, mp.y, mp.width, mp.height);

      // Metal frame / lift design
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(mp.x + 2, mp.y + 2, mp.width - 4, 4);

      ctx.fillStyle = '#334155';
      ctx.fillRect(mp.x + 2, mp.y + 6, mp.width - 4, mp.height - 8);

      // Warning hazard diagonal stripes
      ctx.fillStyle = '#f59e0b';
      for (let sx = mp.x + 6; sx < mp.x + mp.width - 10; sx += 18) {
        ctx.beginPath();
        ctx.moveTo(sx, mp.y + 6);
        ctx.lineTo(sx + 8, mp.y + mp.height - 2);
        ctx.lineTo(sx + 14, mp.y + mp.height - 2);
        ctx.lineTo(sx + 6, mp.y + 6);
        ctx.closePath();
        ctx.fill();
      }

      // Directional arrow icon
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const arrow = mp.vx !== 0 ? '◀▶' : '▲▼';
      ctx.fillText(arrow, mp.x + mp.width / 2, mp.y + mp.height / 2 + 1);

      ctx.restore();
    }

    drawQuestionBlock(ctx, qb) {
      const curY = qb.y - qb.bumpY;
      if (qb.hit) {
        ctx.fillStyle = '#78350f';
        ctx.fillRect(qb.x, curY, qb.width, qb.height);
        ctx.fillStyle = '#92400e';
        ctx.fillRect(qb.x + 3, curY + 3, qb.width - 6, qb.height - 6);
        ctx.fillStyle = '#451a03';
        ctx.fillRect(qb.x + 4, curY + 4, 3, 3);
        ctx.fillRect(qb.x + qb.width - 7, curY + 4, 3, 3);
        ctx.fillRect(qb.x + 4, curY + qb.height - 7, 3, 3);
        ctx.fillRect(qb.x + qb.width - 7, curY + qb.height - 7, 3, 3);
      } else {
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(qb.x, curY, qb.width, qb.height);

        ctx.fillStyle = '#fde047';
        ctx.fillRect(qb.x, curY, qb.width, 3);
        ctx.fillRect(qb.x, curY, 3, qb.height);
        ctx.fillStyle = '#b45309';
        ctx.fillRect(qb.x, curY + qb.height - 3, qb.width, 3);
        ctx.fillRect(qb.x + qb.width - 3, curY, 3, qb.height);

        ctx.fillStyle = '#78350f';
        ctx.fillRect(qb.x + 4, curY + 4, 2, 2);
        ctx.fillRect(qb.x + qb.width - 6, curY + 4, 2, 2);
        ctx.fillRect(qb.x + 4, curY + qb.height - 6, 2, 2);
        ctx.fillRect(qb.x + qb.width - 6, curY + qb.height - 6, 2, 2);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('?', qb.x + qb.width / 2, curY + qb.height / 2 + 1);
      }
    }

    drawCoin(ctx, coin) {
      const time = Date.now() * 0.006 + coin.animOffset;
      const scaleX = Math.abs(Math.cos(time));

      ctx.save();
      ctx.translate(coin.x + coin.width / 2, coin.y + coin.height / 2);
      ctx.scale(Math.max(0.15, scaleX), 1);

      ctx.beginPath();
      ctx.arc(0, 0, 10, 0, Math.PI * 2);
      ctx.fillStyle = '#fbbf24';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(0, 0, 7, 0, Math.PI * 2);
      ctx.fillStyle = '#f59e0b';
      ctx.fill();

      ctx.fillStyle = '#d97706';
      ctx.fillRect(-2, -5, 4, 10);

      ctx.restore();
    }

    drawFruit(ctx, fruit) {
      ctx.save();
      ctx.translate(fruit.x + 16, fruit.y + 16);

      const auraPulse = (Math.sin(Date.now() * 0.008 + fruit.id) + 1) * 0.5;
      ctx.beginPath();
      ctx.arc(0, 0, 18 + auraPulse * 4, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(244, 114, 182, ${0.25 + auraPulse * 0.2})`;
      ctx.fill();

      if (fruit.type === 'apple') {
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(-5, 2, 10, 0, Math.PI * 2);
        ctx.arc(5, 2, 10, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#78350f';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, -5);
        ctx.quadraticCurveTo(2, -12, 6, -13);
        ctx.stroke();

        ctx.fillStyle = '#22c55e';
        ctx.beginPath();
        ctx.ellipse(5, -9, 5, 2.5, Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#fca5a5';
        ctx.beginPath();
        ctx.arc(-4, -1, 3, 0, Math.PI * 2);
        ctx.fill();
      } else if (fruit.type === 'strawberry') {
        ctx.fillStyle = '#f43f5e';
        ctx.beginPath();
        ctx.moveTo(-10, -3);
        ctx.quadraticCurveTo(-11, 10, 0, 14);
        ctx.quadraticCurveTo(11, 10, 10, -3);
        ctx.quadraticCurveTo(0, -8, -10, -3);
        ctx.fill();

        ctx.fillStyle = '#fef08a';
        ctx.fillRect(-4, 0, 1.5, 2);
        ctx.fillRect(4, 0, 1.5, 2);
        ctx.fillRect(0, 6, 1.5, 2);
        ctx.fillRect(-2, 3, 1.5, 2);
        ctx.fillRect(2, 3, 1.5, 2);

        ctx.fillStyle = '#22c55e';
        ctx.beginPath();
        ctx.moveTo(-10, -3);
        ctx.lineTo(-4, -8);
        ctx.lineTo(0, -4);
        ctx.lineTo(4, -8);
        ctx.lineTo(10, -3);
        ctx.closePath();
        ctx.fill();
      } else if (fruit.type === 'star') {
        ctx.fillStyle = '#fbbf24';
        this.drawStarPath(ctx, 0, 0, 5, 14, 7);
        ctx.fill();

        ctx.fillStyle = '#0f172a';
        ctx.fillRect(-3, -2, 2, 5);
        ctx.fillRect(2, -2, 2, 5);
      } else if (fruit.type === 'cherry') {
        ctx.fillStyle = '#dc2626';
        ctx.beginPath();
        ctx.arc(-7, 5, 7, 0, Math.PI * 2);
        ctx.arc(7, 4, 7, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#15803d';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(-7, 0);
        ctx.quadraticCurveTo(-4, -12, 1, -14);
        ctx.moveTo(7, -1);
        ctx.quadraticCurveTo(4, -12, 1, -14);
        ctx.stroke();

        ctx.fillStyle = '#22c55e';
        ctx.beginPath();
        ctx.ellipse(5, -13, 6, 3, -Math.PI / 6, 0, Math.PI * 2);
        ctx.fill();
      } else if (fruit.type === 'mushroom') {
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(0, 0, 13, Math.PI, 0, false);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(0, -6, 4, 0, Math.PI * 2);
        ctx.arc(-7, -2, 3, 0, Math.PI * 2);
        ctx.arc(7, -2, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#fde68a';
        ctx.fillRect(-6, 0, 12, 10);
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(-3, 3, 2, 4);
        ctx.fillRect(2, 3, 2, 4);
      }

      ctx.restore();
    }

    drawStarPath(ctx, cx, cy, spikes, outerRadius, innerRadius) {
      let rot = Math.PI / 2 * 3;
      let x = cx;
      let y = cy;
      const step = Math.PI / spikes;

      ctx.beginPath();
      ctx.moveTo(cx, cy - outerRadius);
      for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
      }
      ctx.lineTo(cx, cy - outerRadius);
      ctx.closePath();
    }

    drawCastleAndFlag(ctx, cfg) {
      const fp = this.flagpole;
      const cas = this.castle;

      // Flagpole
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(fp.x, fp.y, fp.width, fp.height);
      ctx.fillStyle = cfg.id === 5 ? '#f59e0b' : '#22c55e';
      ctx.beginPath();
      ctx.arc(fp.x + fp.width / 2, fp.y, 10, 0, Math.PI * 2);
      ctx.fill();

      // Flag
      ctx.fillStyle = cfg.id === 5 ? '#f59e0b' : '#ef4444';
      ctx.beginPath();
      ctx.moveTo(fp.x + fp.width, fp.flagY);
      ctx.lineTo(fp.x + fp.width + 38, fp.flagY + 16);
      ctx.lineTo(fp.x + fp.width, fp.flagY + 32);
      ctx.closePath();
      ctx.fill();

      // Castle
      const castleColor = cfg.id === 5 ? '#292524' : '#64748b';
      const battlementColor = cfg.id === 5 ? '#dc2626' : '#475569';

      ctx.fillStyle = castleColor;
      ctx.fillRect(cas.x, cas.y, cas.width, cas.height);
      ctx.fillStyle = battlementColor;
      for (let bx = cas.x; bx < cas.x + cas.width; bx += 24) {
        ctx.fillRect(bx, cas.y - 14, 16, 14);
      }
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(cas.x + cas.width / 2, cas.y + cas.height - 40, 22, Math.PI, 0, false);
      ctx.rect(cas.x + cas.width / 2 - 22, cas.y + cas.height - 40, 44, 40);
      ctx.fill();
    }

    drawEnemy(ctx, enemy) {
      if (!enemy.alive && enemy.squishTimer <= 0) return;

      ctx.save();
      ctx.translate(enemy.x, enemy.y);

      if (!enemy.alive) {
        ctx.fillStyle = '#78350f';
        ctx.fillRect(0, enemy.height - 10, enemy.width, 10);
        ctx.restore();
        return;
      }

      ctx.fillStyle = this.currentLevel === 5 ? '#dc2626' : '#92400e';
      ctx.beginPath();
      ctx.arc(16, 14, 15, Math.PI, 0, false);
      ctx.lineTo(30, 26);
      ctx.lineTo(2, 26);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#fef3c7';
      ctx.beginPath();
      ctx.arc(16, 20, 10, 0, Math.PI, false);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(9, 14, 4, 6);
      ctx.fillRect(19, 14, 4, 6);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(11, 16, 2, 4);
      ctx.fillRect(19, 16, 2, 4);

      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(8, 12);
      ctx.lineTo(13, 14);
      ctx.moveTo(24, 12);
      ctx.lineTo(19, 14);
      ctx.stroke();

      const footAnim = Math.sin(Date.now() * 0.015) * 2;
      ctx.fillStyle = '#451a03';
      ctx.fillRect(2, 26, 9 + footAnim, 6);
      ctx.fillRect(21 - footAnim, 26, 9, 6);

      ctx.restore();
    }

    drawPlayer(ctx, p) {
      if (p.invulnerableTimer > 0 && Math.floor(p.invulnerableTimer / 4) % 2 === 0) {
        return;
      }

      ctx.save();
      ctx.translate(p.x + p.width / 2, p.y + p.height / 2);
      if (p.facing === 'left') {
        ctx.scale(-1, 1);
      }

      const isRunning = Math.abs(p.vx) > 0.2 && p.isGrounded;
      const isJumping = !p.isGrounded;
      const runCycle = Math.floor(p.animTimer) % 3;

      // 1. Red Cap
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(-10, -22, 20, 7);
      ctx.fillRect(-6, -25, 16, 4);
      ctx.fillRect(2, -18, 12, 4);

      // 2. Head / Face
      ctx.fillStyle = '#fed7aa';
      ctx.fillRect(-8, -15, 17, 12);
      ctx.fillRect(8, -12, 5, 5);
      ctx.fillRect(-10, -11, 3, 5);

      // Hair
      ctx.fillStyle = '#451a03';
      ctx.fillRect(-8, -15, 5, 7);

      // Eye
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(4, -13, 3, 4);

      // Mustache
      ctx.fillStyle = '#451a03';
      ctx.fillRect(1, -7, 12, 4);

      // 3. Red Shirt
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(-8, -3, 16, 12);

      if (isJumping) {
        ctx.fillRect(8, -11, 6, 7);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(10, -15, 6, 6);
      } else if (isRunning) {
        const armOffset = runCycle === 1 ? 3 : -3;
        ctx.fillRect(6, -2 + armOffset, 5, 7);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(7, 3 + armOffset, 5, 5);
      } else {
        ctx.fillRect(6, -1, 5, 7);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(6, 4, 5, 5);
      }

      // 4. Blue Overalls
      ctx.fillStyle = '#2563eb';
      ctx.fillRect(-7, 2, 14, 12);
      ctx.fillRect(-5, -2, 3, 6);
      ctx.fillRect(2, -2, 3, 6);
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(-5, 2, 3, 3);
      ctx.fillRect(2, 2, 3, 3);

      // 5. Legs & Brown Shoes
      ctx.fillStyle = '#2563eb';
      if (isJumping) {
        ctx.fillRect(-8, 12, 7, 5);
        ctx.fillRect(2, 11, 7, 5);
        ctx.fillStyle = '#78350f';
        ctx.fillRect(-10, 16, 8, 5);
        ctx.fillRect(3, 14, 8, 5);
      } else if (isRunning) {
        if (runCycle === 0) {
          ctx.fillRect(-8, 12, 6, 6);
          ctx.fillRect(2, 12, 6, 6);
          ctx.fillStyle = '#78350f';
          ctx.fillRect(-10, 17, 8, 5);
          ctx.fillRect(2, 17, 8, 5);
        } else if (runCycle === 1) {
          ctx.fillRect(-6, 12, 6, 4);
          ctx.fillRect(4, 11, 7, 5);
          ctx.fillStyle = '#78350f';
          ctx.fillRect(-7, 15, 7, 5);
          ctx.fillRect(5, 14, 8, 5);
        } else {
          ctx.fillRect(-9, 11, 7, 5);
          ctx.fillRect(0, 12, 6, 4);
          ctx.fillStyle = '#78350f';
          ctx.fillRect(-11, 14, 8, 5);
          ctx.fillRect(0, 15, 7, 5);
        }
      } else {
        ctx.fillRect(-7, 12, 5, 6);
        ctx.fillRect(2, 12, 5, 6);
        ctx.fillStyle = '#78350f';
        ctx.fillRect(-9, 17, 7, 5);
        ctx.fillRect(1, 17, 8, 5);
      }

      ctx.restore();
    }
  }

  window.MarioQuizGame = MarioQuizGame;

})(window);
