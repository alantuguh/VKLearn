/* ========================================
   MultimediaLearn — SPA Application
   VAK Learning Style + PIE Development Model
   Clean Educational Architecture & Interactive Assessments
   ======================================== */

// ==================== STATE ====================
const state = {
  currentPage: 'home',
  quizAnswers: [],
  currentQuestion: 0,
  quizResult: null,
  userStyle: null,
  materials: [],
  selectedMaterial: null,
  selectedStyle: 'visual',
  evaluations: null,
  materialFilter: 'all',
  aiVideo: {
    isPlaying: false,
    currentScene: 0,
    elapsedSeconds: 0,
    speed: 1,
    voiceEnabled: true,
    showSubtitles: true,
    isSpeaking: false,
    timer: null
  },
  auditory: {
    isPlaying: false,
    elapsedSeconds: 0,
    durationSeconds: 300,
    speed: 1,
    currentSentenceIndex: 0,
    sentences: [],
    timer: null
  }
};

// ==================== ROUTER ====================
function router() {
  // Clean up any active Mario game instance when switching routes
  if (window.currentMarioGame) {
    window.currentMarioGame.destroy();
    window.currentMarioGame = null;
  }

  // Clean up ongoing AI video playback and auditory speech synthesis
  stopAiVideoPlayback();
  stopAuditoryAudio();
  if ('speechSynthesis' in window) {
    speechSynthesis.cancel();
  }
  audioPlaying = false;

  const hash = window.location.hash || '#/';
  const path = hash.replace('#', '');

  const routes = {
    '/': renderHome,
    '/game': renderMarioGame,
    '/mario': renderMarioGame,
    '/materi': renderMaterials,
    '/evaluasi': renderEvaluation,
    '/tentang': renderAboutPIE
  };

  // Check for material detail route
  const materialMatch = path.match(/^\/materi\/(\d+)$/);

  const app = document.getElementById('app');
  app.innerHTML = '<div class="spinner"></div>';

  setTimeout(() => {
    if (materialMatch) {
      renderMaterialDetail(parseInt(materialMatch[1]));
    } else if (routes[path]) {
      routes[path]();
    } else {
      routes['/']();
    }
    updateActiveNav();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 100);
}

function updateActiveNav() {
  const hash = window.location.hash || '#/';
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href');
    if (
      href === hash ||
      (hash === '#/mario' && href === '#/game')
    ) {
      link.classList.add('active');
    }
  });
}

// ==================== HOME PAGE ====================
function renderHome() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <div class="hero-badge">
          <span class="badge-dot"></span>
          <span>Model Pembelajaran VAK + PIE</span>
        </div>
        <h1>
          Temukan Gaya Belajar <span class="gradient-text">Terbaik Sesuai Karakteristik Anda</span>
        </h1>
        <p class="hero-description">
          Sistem pembelajaran adaptif yang memetakan modalitas belajar <strong>Visual</strong>, 
          <strong>Auditori</strong>, dan <strong>Kinestetik</strong> melalui asesmen mandiri maupun media game petualangan interaktif, 
          dilengkapi materi multimedia terkurasi dan dikembangkan dengan kerangka kerja instruksional <strong>PIE</strong>.
        </p>
        <div class="hero-buttons">
          <a href="#/game" class="btn btn-primary btn-lg mario-hero-btn" data-link>
            Mainkan Game Petualangan VAK
          </a>
          <a href="#/materi" class="btn btn-outline btn-lg" data-link>
            Jelajahi Materi
          </a>
        </div>
      </div>
    </section>

    <!-- PANDUAN PENGGUNAAN PLATFORM (ALUR BELAJAR TERPADU) -->
    <section class="section">
      <div class="section-header">
        <span class="section-badge">Panduan Pembelajaran</span>
        <h2 class="section-title">Alur Penggunaan Platform</h2>
        <p class="section-subtitle">
          Ikuti 4 tahapan pembelajaran terpadu untuk memaksimalkan hasil belajar Anda pada mata pelajaran multimedia.
        </p>
      </div>

      <div class="platform-guide-grid">
        <div class="guide-step-card">
          <div class="guide-step-header">
            <span class="guide-step-num">Langkah 01</span>
            <span class="guide-step-tag">Diagnostik</span>
          </div>
          <h3 class="guide-step-title">Identifikasi Modalitas Belajar (VAK)</h3>
          <p class="guide-step-desc">
            Ketahui preferensi belajar Anda melalui <strong>Game Petualangan Mario VAK</strong> (1 level platformer interaktif dengan 10 pos pertanyaan diagnostik).
          </p>
          <div class="guide-step-action">
            <a href="#/game" class="guide-link" data-link>Mainkan Game VAK &rarr;</a>
          </div>
        </div>

        <div class="guide-step-card">
          <div class="guide-step-header">
            <span class="guide-step-num">Langkah 02</span>
            <span class="guide-step-tag">Eksplorasi</span>
          </div>
          <h3 class="guide-step-title">Pelajari Materi yang Disesuaikan</h3>
          <p class="guide-step-desc">
            Masuk ke menu <strong>Materi Multimedia</strong> yang mencakup 4 topik utama: Desain Grafis, Animasi, Video Editing, 
            dan Audio Editing. Setiap topik menyajikan konten adaptif (infografis visual, narasi audio, atau simulasi interaktif).
          </p>
          <div class="guide-step-action">
            <a href="#/materi" class="guide-link" data-link>Jelajahi Modul Belajar &rarr;</a>
          </div>
        </div>

        <div class="guide-step-card">
          <div class="guide-step-header">
            <span class="guide-step-num">Langkah 03</span>
            <span class="guide-step-tag">Pengukuran</span>
          </div>
          <h3 class="guide-step-title">Lakukan Evaluasi Mandiri</h3>
          <p class="guide-step-desc">
            Uji tingkat pemahaman konsep dan keterampilan teknis Anda melalui menu <strong>Evaluasi</strong>. Berikan umpan balik 
            terhadap materi dan pantau ketercapaian hasil belajar Anda secara objektif.
          </p>
          <div class="guide-step-action">
            <a href="#/evaluasi" class="guide-link" data-link>Uji Evaluasi &rarr;</a>
          </div>
        </div>

        <div class="guide-step-card">
          <div class="guide-step-header">
            <span class="guide-step-num">Langkah 04</span>
            <span class="guide-step-tag">Metodologi</span>
          </div>
          <h3 class="guide-step-title">Pahami Kerangka Model PIE</h3>
          <p class="guide-step-desc">
            Pelajari landasan ilmiah perancangan sistem ini pada menu <strong>Tentang Model PIE</strong>, yang menguraikan tahapan 
            <em>Planning</em> (perencanaan kebutuhan), <em>Implementation</em> (pengembangan media), dan <em>Evaluation</em> (evaluasi capaian).
          </p>
          <div class="guide-step-action">
            <a href="#/tentang" class="guide-link" data-link>Baca Metodologi PIE &rarr;</a>
          </div>
        </div>
      </div>
    </section>

    <!-- VAK MODALITY OVERVIEW -->
    <section class="section">
      <div class="section-header">
        <span class="section-badge">Model Modalitas Belajar</span>
        <h2 class="section-title">Karakteristik Gaya Belajar VAK</h2>
        <p class="section-subtitle">
          Setiap individu memiliki modalitas dominan dalam memproses informasi multimedia secara efektif.
        </p>
      </div>

      <div class="vak-grid">
        <div class="card card-visual vak-card">
          <div class="vak-card-badge visual">Visual</div>
          <h3>Tipe Belajar Visual</h3>
          <p>Memproses informasi paling optimal melalui apa yang dilihat &mdash; skema grafis, bagan alur, peragaan gambar, dan tata letak spasial.</p>
          <ul class="vak-features-list">
            <li>Diagram alur kerja produksi &amp; flowchart</li>
            <li>Infografis komponen desain &amp; warna</li>
            <li>Demonstrasi video langkah demi langkah</li>
            <li>Dokumentasi dengan tangkapan layar terstruktur</li>
          </ul>
        </div>

        <div class="card card-auditory vak-card">
          <div class="vak-card-badge auditory">Auditori</div>
          <h3>Tipe Belajar Auditori</h3>
          <p>Memproses informasi paling optimal melalui pendengaran &mdash; penjelasan naratif lisan, ritme suara, dan diskusi terstruktur.</p>
          <ul class="vak-features-list">
            <li>Penjelasan verbal konsep &amp; prinsip teknis</li>
            <li>Panduan narasi audio &amp; transkrip lisan</li>
            <li>Diskusi reflektif &amp; tanya-jawab konsep</li>
            <li>Pemahaman harmoni suara &amp; akustik digital</li>
          </ul>
        </div>

        <div class="card card-kinesthetic vak-card">
          <div class="vak-card-badge kinesthetic">Kinestetik</div>
          <h3>Tipe Belajar Kinestetik</h3>
          <p>Memproses informasi paling optimal melalui tindakan nyata &mdash; praktik langsung di aplikasi, simulasi interaktif, dan manipulasi objek.</p>
          <ul class="vak-features-list">
            <li>Simulasi drag &amp; drop pengurutan alur kerja</li>
            <li>Latihan langsung di perangkat lunak multimedia</li>
            <li>Manipulasi parameter teknis secara real-time</li>
            <li>Proyek mini interaktif berbasis eksplorasi mandiri</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- GAME ASESMEN VAK SHOWCASE BANNER -->
    <section class="section">
      <div class="card mario-home-banner">
        <div class="mario-banner-left">
          <span class="section-badge">Media Asesmen Interaktif</span>
          <h2 class="mario-banner-title">Game Petualangan VAK: <span class="gradient-text">1 Level 10 Pos Asesmen</span></h2>
          <p class="mario-banner-desc">
            Kendalikan Mario melintasi rute petualangan satu level lengkap yang memuat <strong>10 Pos Pertanyaan VAK</strong>. 
            Sentuh setiap pos dan tentukan kecenderungan cara belajar Anda. Seluruh 10 pos harus dijawab untuk dapat menuntaskan 
            level di bendera kastil dan menampilkan hasil analisis gaya belajar Anda secara akurat.
          </p>
          <div class="mario-banner-features">
            <span class="m-feat-pill">1 Level Lengkap</span>
            <span class="m-feat-pill">10 Pos Diagnostik VAK</span>
            <span class="m-feat-pill">Checkpoint Otomatis</span>
            <span class="m-feat-pill">Laporan Profil Belajar</span>
          </div>
          <div class="mario-banner-btn-wrap">
            <a href="#/game" class="btn btn-primary btn-lg" data-link>
              Mulai Game Asesmen VAK &rarr;
            </a>
          </div>
        </div>
        <div class="mario-banner-right">
          <div class="mario-preview-frame">
            <div class="mario-preview-header">
              <span>Pos 1 s.d. Pos 10 &bull; Asesmen Diagnostik</span>
            </div>
            <div class="mario-preview-body">
              <div class="mp-station-indicator">
                <span class="mp-badge-point">Pos 01</span>
                <span class="mp-badge-point">Pos 02</span>
                <span class="mp-badge-point">Pos 03</span>
                <span class="mp-badge-point">...</span>
                <span class="mp-badge-point">Pos 10</span>
              </div>
              <p class="mp-note">
                Wajib menjawab 10 pertanyaan agar hasil gaya belajar dapat diproses dan dimunculkan di garis akhir.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

// ==================== MATERIALS PAGE ====================
async function renderMaterials() {
  const app = document.getElementById('app');

  try {
    const res = await fetch('/api/materials');
    const data = await res.json();
    state.materials = data.data;

    const categories = ['all', ...new Set(state.materials.map(m => m.category))];

    const filtered = state.materialFilter === 'all'
      ? state.materials
      : state.materials.filter(m => m.category === state.materialFilter);

    app.innerHTML = `
      <section class="section">
        <div class="section-header">
          <span class="section-badge">Modul Pembelajaran</span>
          <h2 class="section-title">Materi Multimedia</h2>
          <p class="section-subtitle">
            Pelajari modul kompetensi multimedia yang disesuaikan secara adaptif dengan modalitas belajar Anda
            ${state.userStyle ? ` &bull; Rekomendasi Profil: <strong>${state.userStyle}</strong>` : ''}
          </p>
        </div>

        <div class="material-filters">
          ${categories.map(cat => `
            <button type="button" class="filter-btn ${state.materialFilter === cat ? 'active' : ''}" 
                    onclick="filterMaterials('${cat}')">
              ${cat === 'all' ? 'Semua Topik' : cat}
            </button>
          `).join('')}
        </div>

        <div class="material-grid">
          ${filtered.map(m => `
            <div class="card material-card" onclick="window.location.hash='#/materi/${m.id}'" style="cursor:pointer;">
              <span class="material-category ${getCategoryClass(m.category)}">${m.category}</span>
              <h3 class="material-title">${m.title}</h3>
              <p class="material-desc">${m.description}</p>
              <div class="material-tags">
                <span class="material-tag">Moda Visual</span>
                <span class="material-tag">Moda Auditori</span>
                <span class="material-tag">Moda Kinestetik</span>
              </div>
              <button type="button" class="btn btn-primary btn-sm" style="width:100%; margin-top:1rem;">Buka Materi &rarr;</button>
            </div>
          `).join('')}
        </div>
      </section>
    `;
  } catch (err) {
    app.innerHTML = `<div class="empty-state"><p>Gagal memuat daftar materi multimedia.</p></div>`;
  }
}

function getCategoryClass(cat) {
  return cat.toLowerCase().replace(/\s+/g, '-');
}

function filterMaterials(cat) {
  state.materialFilter = cat;
  renderMaterials();
}

// ==================== MATERIAL DETAIL PAGE ====================
async function renderMaterialDetail(id) {
  const app = document.getElementById('app');

  // Stop any active AI video playback or audio speech
  stopAiVideoPlayback();
  if ('speechSynthesis' in window) {
    speechSynthesis.cancel();
  }
  audioPlaying = false;

  try {
    const res = await fetch(`/api/materials/${id}`);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: Materi dengan ID ${id} tidak ditemukan.`);
    }

    const data = await res.json();
    if (!data.success || !data.data) {
      throw new Error(data.message || 'Materi tidak ditemukan di sistem.');
    }

    const material = data.data;
    state.selectedMaterial = material;

    // Harmonize style preference from quiz result if not yet chosen
    if (state.quizResult && !state.selectedStyle) {
      const styleMap = { V: 'visual', A: 'auditory', K: 'kinesthetic' };
      state.selectedStyle = styleMap[state.quizResult.dominant] || 'visual';
    }
    if (!state.selectedStyle) state.selectedStyle = 'visual';

    // Verify content exists for selected style; fallback to visual if missing
    let content = material.content && material.content[state.selectedStyle];
    if (!content) {
      state.selectedStyle = 'visual';
      content = material.content && material.content.visual;
    }

    if (!content) {
      throw new Error('Konten materi belum diisi untuk topik ini.');
    }

    // Reset AI video position for this material
    state.aiVideo.isPlaying = false;
    state.aiVideo.currentScene = 0;
    state.aiVideo.elapsedSeconds = 0;

    app.innerHTML = `
      <section class="section material-detail">
        <div class="material-detail-header">
          <button type="button" class="back-link" onclick="window.location.hash='#/materi'">&larr; Kembali ke Daftar Materi</button>
          <span class="material-category ${getCategoryClass(material.category)}">${material.category}</span>
          <h1 class="section-title" style="text-align:left; margin-top:0.5rem;">${material.title}</h1>
          <p style="color:var(--text-secondary); margin-top:0.5rem; line-height:1.6;">${material.description}</p>
        </div>

        <div class="style-tabs">
          <button type="button" class="style-tab visual ${state.selectedStyle === 'visual' ? 'active' : ''}" onclick="switchStyle('visual', ${id})">
            ✨ Moda Visual (Video AI &amp; Skema)
          </button>
          <button type="button" class="style-tab auditory ${state.selectedStyle === 'auditory' ? 'active' : ''}" onclick="switchStyle('auditory', ${id})">
            🎧 Moda Auditori (Narasi &amp; Audio)
          </button>
          <button type="button" class="style-tab kinesthetic ${state.selectedStyle === 'kinesthetic' ? 'active' : ''}" onclick="switchStyle('kinesthetic', ${id})">
            ⚡ Moda Kinestetik (Simulasi Praktik)
          </button>
        </div>

        <div class="content-panel page-enter">
          ${renderContentByStyle(state.selectedStyle, content, material)}
        </div>
      </section>
    `;

    if (state.selectedStyle === 'kinesthetic') {
      initDragAndDrop();
    }
    if (state.selectedStyle === 'auditory') {
      initAuditoryPlayer();
    }
  } catch (err) {
    console.error('Error rendering material:', err);
    app.innerHTML = `
      <section class="section">
        <div class="card empty-state" style="max-width: 600px; margin: 3rem auto; text-align: center; padding: 3rem 2rem; border: 1px solid rgba(239, 68, 68, 0.2);">
          <div style="font-size: 3.5rem; margin-bottom: 1rem;">📚</div>
          <h2 style="color: var(--text-primary); margin-bottom: 0.5rem; font-size: 1.5rem;">Materi Tidak Ditemukan</h2>
          <p style="color: var(--text-secondary); margin-bottom: 1.75rem; line-height: 1.6;">
            ${err.message || 'Materi yang Anda pilih tidak tersedia atau gagal dimuat dari server.'}
          </p>
          <div style="display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap;">
            <button type="button" class="btn btn-primary btn-lg" onclick="window.location.hash='#/materi'">
              &larr; Lihat Semua Materi Multimedia
            </button>
            <button type="button" class="btn btn-outline btn-lg" onclick="window.location.hash='#/'">
              Kembali ke Beranda
            </button>
          </div>
        </div>
      </section>
    `;
  }
}

function switchStyle(style, id) {
  stopAiVideoPlayback();
  stopAuditoryAudio();
  if ('speechSynthesis' in window) {
    speechSynthesis.cancel();
  }
  state.selectedStyle = style;
  renderMaterialDetail(id);
}

function renderContentByStyle(style, content, material) {
  switch (style) {
    case 'visual':
      return renderVisualContent(content);
    case 'auditory':
      return renderAuditoryContent(content);
    case 'kinesthetic':
      return renderKinestheticContent(content, material);
    default:
      return '<p>Konten tidak tersedia</p>';
  }
}

// ==================== VISUAL CONTENT WITH REALISTIC AI VIDEO ====================
function renderVisualContent(content) {
  const diagramSteps = (content.diagram || '').split('→').map(s => s.trim()).filter(Boolean);
  const aiVideo = content.aiVideo || {
    title: 'Video Pembelajaran AI: Penjelasan Konsep Multimedia',
    presenter: 'Dr. Maya S.Kom., M.T. (AI Instructor)',
    badge: 'Video AI Explainer',
    duration: '03:15',
    scenes: [
      {
        time: 0,
        timestamp: '00:00',
        title: 'Pengantar Visual & Konsep Inti',
        narration: content.body || 'Materi visual menyajikan pemahaman mendalam melalui grafis, diagram alur, dan demonstrasi interaktif.',
        keyVisual: 'Komunikasi Visual Efektif',
        icon: '🎨',
        visualGraphic: 'elements'
      }
    ]
  };

  const scenes = aiVideo.scenes || [];
  const currentScene = scenes[state.aiVideo.currentScene] || scenes[0] || {};
  const totalSec = parseDurationSeconds(aiVideo.duration || '03:15');
  const currentProgress = totalSec > 0 ? Math.min(100, (state.aiVideo.elapsedSeconds / totalSec) * 100) : 0;

  return `
    <div class="visual-content">
      <!-- AI VIDEO EXPLAINER SECTION (ADVANCED INTERACTIVE AI LECTURE) -->
      <div class="ai-video-section">
        <div class="ai-video-header">
          <div>
            <div class="ai-video-badge">
              <span class="ai-video-badge-dot"></span>
              ${aiVideo.badge || 'Video AI Explainer'} &bull; Visual Interactive Learning
            </div>
            <h3 class="ai-video-title">${aiVideo.title}</h3>
            <div class="ai-video-presenter-meta">
              <span>Instruktur Virtual: <strong>${aiVideo.presenter || 'Dr. Maya S.Kom., M.T.'}</strong></span>
              <span>&bull; Durasi Kuliah: ${aiVideo.duration || '03:15'}</span>
              <span>&bull; ${scenes.length} Babak Materi Terpadu</span>
            </div>
          </div>
        </div>

        <!-- Realistic Cinematic AI Video Screen -->
        <div class="ai-video-frame ${state.aiVideo.isPlaying ? 'playing' : ''}" id="aiVideoFrame">
          <div class="ai-video-viewport" onclick="handleVideoViewportClick(event)">
            <!-- Top Broadcast Status Bar -->
            <div class="ai-video-topbar">
              <div class="ai-live-indicator">
                <span class="ai-live-dot"></span>
                <span>LIVE AI VIRTUAL LECTURE</span>
              </div>
              <div class="ai-scene-badge" id="aiSceneBadge">
                Babak ${state.aiVideo.currentScene + 1} / ${scenes.length}: ${currentScene.title || 'Menerangkan Materi'}
              </div>
              <div style="display:flex; align-items:center; gap:0.6rem;">
                <span class="ai-quality-tag">1080p FHD 60FPS</span>
                <span class="ai-time-readout" id="aiTopTimeCounter" style="color:#94a3b8; font-size:0.75rem; font-family:var(--font-mono);">
                  ${formatVideoTime(state.aiVideo.elapsedSeconds)} / ${aiVideo.duration || '03:15'}
                </span>
              </div>
            </div>

            <!-- Main Video Stage: Center Slide + PiP Presenter Feed -->
            <div class="ai-video-stage">
              <!-- Left/Center: Presentation Slide Screen -->
              <div class="ai-slide-screen">
                <div class="ai-slide-header">
                  <div style="display:flex; align-items:center; gap:0.5rem;">
                    <span class="ai-slide-step-badge">BABAK ${state.aiVideo.currentScene + 1} DARI ${scenes.length}</span>
                    <div class="ai-slide-dots">
                      ${scenes.map((_, idx) => `
                        <span class="ai-slide-dot ${idx === state.aiVideo.currentScene ? 'active' : ''} ${idx < state.aiVideo.currentScene ? 'passed' : ''}"></span>
                      `).join('')}
                    </div>
                  </div>
                  <div style="display:flex; align-items:center; gap:0.6rem;">
                    <div class="ai-slide-live-wave" id="aiSlideLiveWave" title="Audio Visualizer AI">
                      <span class="lv-bar"></span><span class="lv-bar"></span><span class="lv-bar"></span><span class="lv-bar"></span><span class="lv-bar"></span>
                    </div>
                    <span style="font-size:0.72rem; color:#94a3b8; font-family:var(--font-mono); font-weight:600;">MODUL VISUAL ${state.aiVideo.currentScene + 1}.0</span>
                  </div>
                </div>
                
                <div class="ai-slide-title" id="aiTopicTitle">
                  ${currentScene.title || 'Materi Visual'}
                </div>

                <div class="ai-slide-visual-box" id="aiCanvasDisplay">
                  ${renderAiVisualGraphic(currentScene.visualGraphic || 'elements', currentScene)}
                </div>

                <div class="ai-slide-key-pill" id="aiKeyVisualText">
                  ${currentScene.keyVisual ? `💡 <strong>Konsep Inti:</strong> ${currentScene.keyVisual}` : ''}
                </div>
              </div>

              <!-- Right: PiP Presenter Camera Feed (Realistic Speaking Instructor) -->
              <div class="ai-pip-presenter">
                <div class="ai-pip-header">
                  <span class="ai-pip-status">
                    <span class="ai-pip-status-dot"></span>
                    <span>AI INSTRUCTOR</span>
                  </span>
                  <span style="color:#94a3b8; font-size:0.65rem; font-family:var(--font-mono);">CAM 01 &bull; 4K HDR</span>
                </div>

                <div class="ai-pip-camera-view">
                  <div class="ai-presenter-avatar-box">
                    <svg class="ai-presenter-human" viewBox="0 0 140 175" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <!-- Studio Ambient Backlight Glow -->
                      <circle cx="70" cy="80" r="62" fill="url(#studioAura)" opacity="0.8"/>
                      
                      <!-- Shoulders & Blazer -->
                      <path d="M15 175 C18 138, 38 126, 55 124 L70 138 L85 124 C102 126, 122 138, 125 175 Z" fill="#0f172a"/>
                      <path d="M48 126 L70 156 L92 126 L80 120 L70 134 L60 120 Z" fill="#3b82f6" opacity="0.95"/>
                      <!-- Shirt Collar & Tie/Neckline -->
                      <polygon points="70,128 62,142 78,142" fill="#ffffff"/>
                      <polygon points="70,140 66,166 70,173 74,166" fill="#8b5cf6"/>
                      
                      <!-- Neck -->
                      <rect x="62" y="104" width="16" height="26" rx="4" fill="#fbcfe8"/>
                      
                      <!-- Head Group with natural subtle tilt -->
                      <g class="ai-presenter-head">
                        <!-- Head Base & Tone -->
                        <ellipse cx="70" cy="78" rx="27" ry="33" fill="#fde047" opacity="0.1"/>
                        <ellipse cx="70" cy="78" rx="25.5" ry="31.5" fill="#fcd34d" opacity="0.2"/>
                        <ellipse cx="70" cy="78" rx="24.5" ry="30.5" fill="#fbcfe8"/>
                        
                        <!-- Hair -->
                        <path d="M42 76 C40 48, 52 36, 70 36 C88 36, 100 48, 98 76 C94 62, 85 50, 70 50 C55 50, 46 62, 42 76 Z" fill="#312e81"/>
                        <path d="M42 76 C41 90, 46 102, 49 110 C46 95, 45 80, 46 72 Z" fill="#1e1b4b"/>
                        <path d="M98 76 C99 90, 94 102, 91 110 C94 95, 95 80, 94 72 Z" fill="#1e1b4b"/>
                        
                        <!-- Ears -->
                        <ellipse cx="44" cy="80" rx="3.5" ry="7" fill="#f472b6"/>
                        <ellipse cx="96" cy="80" rx="3.5" ry="7" fill="#f472b6"/>
                        <!-- Headset & Microphone -->
                        <circle cx="96" cy="80" r="5" fill="#38bdf8"/>
                        <path d="M96 82 Q92 98 80 100" stroke="#0284c7" stroke-width="2.5" fill="none"/>
                        <circle cx="78" cy="100" r="3.5" fill="#f43f5e" class="ai-mic-led"/>
                        
                        <!-- Eyebrows -->
                        <path d="M52 64 Q60 61 64 64" stroke="#312e81" stroke-width="2" stroke-linecap="round"/>
                        <path d="M76 64 Q80 61 88 64" stroke="#312e81" stroke-width="2" stroke-linecap="round"/>
                        
                        <!-- Eyes with Natural Blinking Animation -->
                        <g class="ai-presenter-eye">
                          <ellipse cx="58" cy="72" rx="4.5" ry="3" fill="#ffffff"/>
                          <circle cx="59" cy="72" r="2.5" fill="#0f172a"/>
                          <circle cx="60" cy="71" r="0.8" fill="#ffffff"/>
                          
                          <ellipse cx="82" cy="72" rx="4.5" ry="3" fill="#ffffff"/>
                          <circle cx="81" cy="72" r="2.5" fill="#0f172a"/>
                          <circle cx="82" cy="71" r="0.8" fill="#ffffff"/>
                        </g>
                        
                        <!-- Intellectual Glasses Frame -->
                        <rect x="50" y="66" width="16" height="11" rx="3" stroke="#8b5cf6" stroke-width="1.8" fill="none"/>
                        <rect x="74" y="66" width="16" height="11" rx="3" stroke="#8b5cf6" stroke-width="1.8" fill="none"/>
                        <path d="M66 71 L74 71" stroke="#8b5cf6" stroke-width="1.8"/>
                        
                        <!-- Nose -->
                        <path d="M69 77 L72 84 L68 85" stroke="#f472b6" stroke-width="1.4" stroke-linecap="round"/>
                        
                        <!-- Lip-syncing Mouth (animates when speaking) -->
                        <ellipse id="aiPresenterMouth" class="ai-presenter-mouth" cx="70" cy="94" rx="7" ry="2.5" fill="#db2777"/>
                      </g>

                      <!-- Studio Ambient Lighting Defs -->
                      <defs>
                        <radialGradient id="studioAura" cx="50%" cy="50%" r="50%">
                          <stop offset="0%" stop-color="#8b5cf6" stop-opacity="0.65"/>
                          <stop offset="60%" stop-color="#3b82f6" stop-opacity="0.25"/>
                          <stop offset="100%" stop-color="#030712" stop-opacity="0"/>
                        </radialGradient>
                      </defs>
                    </svg>
                  </div>
                </div>

                <!-- Lower Third Nameplate -->
                <div class="ai-pip-lower-third">
                  <div class="ai-pip-name">
                    <span>${aiVideo.presenter || 'Dr. Maya S.Kom., M.T.'}</span>
                    <span title="Instruktur AI Terverifikasi" style="color:#38bdf8; font-size:0.85rem;">✓</span>
                  </div>
                  <div class="ai-pip-role">Instruktur Virtual Multimedia</div>
                  <div class="ai-pip-vu-meter" id="aiVuMeter">
                    <span class="ai-pip-vu-bar"></span>
                    <span class="ai-pip-vu-bar"></span>
                    <span class="ai-pip-vu-bar"></span>
                    <span class="ai-pip-vu-bar"></span>
                    <span class="ai-pip-vu-bar"></span>
                    <span class="ai-pip-vu-bar"></span>
                    <span class="ai-pip-vu-bar"></span>
                    <span class="ai-pip-vu-bar"></span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Central Click-to-Play Big Overlay (Disappears when playing) -->
            <div class="ai-center-play-overlay" id="aiCenterPlayOverlay" onclick="event.stopPropagation(); playAiVideo();">
              <div class="ai-big-play-btn">▶</div>
              <div class="ai-play-prompt-text">KLIK UNTUK MEMUTAR KULIAH VIDEO AI</div>
            </div>

            <!-- Closed Captions Overlay (Subtitles inside video frame) -->
            <div class="ai-video-captions-overlay" id="aiVideoCaptions" style="display: ${state.aiVideo.showSubtitles ? 'block' : 'none'};">
              <span class="ai-caption-badge">[CC] Subtitle AI</span>
              <p class="ai-caption-text" id="aiSubtitleText">
                ${currentScene.narration || 'Klik tombol putar untuk menyimak video penjelasan interaktif dari instruktur AI.'}
              </p>
            </div>

            <!-- Bottom On-Screen Video Controls Bar -->
            <div class="ai-video-controls" onclick="event.stopPropagation()">
              <!-- Scrubber Timeline Track -->
              <div class="ai-timeline-scrubber" id="aiTimelineTrack" onclick="seekAiVideoProgress(event)" title="Klik untuk melompat ke menit tertentu">
                <div class="ai-timeline-bar-fill" id="aiTimelineFill" style="width: ${currentProgress}%;"></div>
              </div>

              <!-- Controls Buttons Flex -->
              <div class="ai-controls-flex">
                <div class="ai-controls-left">
                  <button type="button" class="ai-video-btn ai-video-btn-play" id="aiPlayBtn" onclick="toggleAiVideo()" title="Putar atau jeda video">
                    ${state.aiVideo.isPlaying ? '⏸ Jeda' : '▶ Putar'}
                  </button>
                  <button type="button" class="ai-video-btn" onclick="prevAiVideoScene()" title="Babak Sebelumnya">
                    ⏮ Babak
                  </button>
                  <button type="button" class="ai-video-btn" onclick="nextAiVideoScene()" title="Babak Berikutnya">
                    Babak ⏭
                  </button>
                  <button type="button" class="ai-video-btn" onclick="skipAiVideo(-10)" title="Mundur 10 detik">
                    ⏪ 10s
                  </button>
                  <button type="button" class="ai-video-btn" onclick="skipAiVideo(10)" title="Maju 10 detik">
                    ⏩ 10s
                  </button>
                  <button type="button" class="ai-video-btn" onclick="replayAiVideo()" title="Putar dari awal">
                    ↺ Ulang
                  </button>
                  <span class="ai-time-readout" id="aiElapsedCounter" style="font-family:var(--font-mono);">
                    ${formatVideoTime(state.aiVideo.elapsedSeconds)} / ${aiVideo.duration || '03:15'}
                  </span>
                </div>

                <div class="ai-controls-right">
                  <button type="button" class="ai-video-btn" id="aiSpeechToggleBtn" onclick="toggleAiVideoSpeech()" title="Suara AI">
                    ${state.aiVideo.voiceEnabled ? '🔊 Suara AI' : '🔇 Mute'}
                  </button>
                  <button type="button" class="ai-video-btn ${state.aiVideo.showSubtitles ? 'active' : ''}" id="aiSubtitleBtn" onclick="toggleAiVideoSubtitles()" title="Teks Terjemahan (CC)">
                    💬 CC
                  </button>
                  <select class="ai-speed-dropdown" onchange="changeAiVideoSpeed(this.value)" title="Kecepatan Video">
                    <option value="0.75" ${state.aiVideo.speed === 0.75 ? 'selected' : ''}>0.75x</option>
                    <option value="1" ${state.aiVideo.speed === 1 ? 'selected' : ''}>1.0x Normal</option>
                    <option value="1.25" ${state.aiVideo.speed === 1.25 ? 'selected' : ''}>1.25x</option>
                    <option value="1.5" ${state.aiVideo.speed === 1.5 ? 'selected' : ''}>1.5x</option>
                  </select>
                  <button type="button" class="ai-video-btn" onclick="toggleAiVideoFullscreen()" title="Layar Penuh">
                    ⛶ Layar Penuh
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Chapter Playlist below the Video Player -->
        <div class="ai-chapters-container">
          <div class="ai-chapters-label">
            📑 Daftar Babak &amp; Bahasan Kuliah AI (Klik untuk lompat pembahasan langsung):
          </div>
          <div class="ai-chapters-grid">
            ${scenes.map((sc, i) => `
              <div class="ai-chapter-card ${state.aiVideo.currentScene === i ? 'active' : ''}" onclick="seekAiVideoScene(${i})">
                <div class="ai-chapter-top">
                  <span class="ai-chapter-time">${sc.timestamp || '00:00'}</span>
                  <span>${state.aiVideo.currentScene === i ? '● Sedang Aktif' : `Babak #${i + 1}`}</span>
                </div>
                <div class="ai-chapter-title">${sc.title}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- INFOGRAPHICS & SUMMARY CARD -->
      <div class="card card-visual">
        <h3 class="content-heading">${content.title}</h3>
        <p style="color:var(--text-secondary); margin-bottom:1.5rem; line-height:1.8;">${content.body}</p>
        
        <div class="visual-keypoints">
          ${(content.keyPoints || []).map(point => `
            <div class="visual-keypoint">${point}</div>
          `).join('')}
        </div>

        ${diagramSteps.length > 0 ? `
          <div class="visual-diagram">
            <h4>Bagan Alur Kerja &amp; Pipeline Multimedia:</h4>
            <div class="diagram-flow">
              ${diagramSteps.map((step, i) => `
                <span class="diagram-step">${step}</span>
                ${i < diagramSteps.length - 1 ? '<span class="diagram-arrow">&rarr;</span>' : ''}
              `).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

function handleVideoViewportClick(event) {
  // If clicking on controls, topbar, overlay, or interactive elements, don't trigger toggle
  if (
    event.target.closest('.ai-video-controls') || 
    event.target.closest('.ai-video-topbar') ||
    event.target.closest('#aiCenterPlayOverlay') ||
    event.target.closest('button') ||
    event.target.closest('select') ||
    event.target.closest('.ai-chapter-card')
  ) {
    return;
  }
  toggleAiVideo();
}

// Render dynamic visual diagram based on scene topic (covers all 16 topics across 4 modules)
function renderAiVisualGraphic(type, scene) {
  switch (type) {
    case 'elements':
      return `
        <div class="vg-elements-grid">
          <div class="vg-elem-chip chip-line">
            <span class="vg-icon">📏</span>
            <strong>Garis</strong>
            <small>Struktur &amp; Arah</small>
          </div>
          <div class="vg-elem-chip chip-shape">
            <span class="vg-icon">🔷</span>
            <strong>Bentuk</strong>
            <small>Geometris &amp; Organis</small>
          </div>
          <div class="vg-elem-chip chip-color">
            <span class="vg-icon">🎨</span>
            <strong>Warna</strong>
            <small>Emosi &amp; Kontras</small>
          </div>
          <div class="vg-elem-chip chip-texture">
            <span class="vg-icon">🧶</span>
            <strong>Tekstur</strong>
            <small>Kesan Taktil Permukaan</small>
          </div>
          <div class="vg-elem-chip chip-space">
            <span class="vg-icon">⬜</span>
            <strong>Ruang</strong>
            <small>Napas &amp; Area Negatif</small>
          </div>
        </div>
      `;
    case 'colorspace':
      return `
        <div class="vg-compare-grid">
          <div class="vg-compare-card card-rgb">
            <div class="vg-compare-badge badge-rgb">RGB (Layar Monitor)</div>
            <div class="vg-color-dots">
              <span class="dot-r" title="Red"></span>
              <span class="dot-g" title="Green"></span>
              <span class="dot-b" title="Blue"></span>
            </div>
            <div class="vg-spec-text">Model Warna Aditif</div>
            <div class="vg-badge-pill">72 &ndash; 96 DPI Standar Layar</div>
          </div>
          <div class="vg-compare-card card-cmyk">
            <div class="vg-compare-badge badge-cmyk">CMYK (Cetak Fisik)</div>
            <div class="vg-color-dots">
              <span class="dot-c" title="Cyan"></span>
              <span class="dot-m" title="Magenta"></span>
              <span class="dot-y" title="Yellow"></span>
              <span class="dot-k" title="Key/Black"></span>
            </div>
            <div class="vg-spec-text">Model Warna Subtraktif</div>
            <div class="vg-badge-pill highlight">300 DPI Cetak Tajam</div>
          </div>
        </div>
      `;
    case 'composition':
      return `
        <div class="vg-composition-grid">
          <div class="vg-comp-item">
            <div class="vg-comp-icon">⚖️</div>
            <div class="vg-comp-title">Balance</div>
            <div class="vg-comp-desc">Keseimbangan simetris &amp; asimetris</div>
          </div>
          <div class="vg-comp-item">
            <div class="vg-comp-icon">🌓</div>
            <div class="vg-comp-title">Contrast</div>
            <div class="vg-comp-desc">Pembeda skala, warna &amp; nilai</div>
          </div>
          <div class="vg-comp-item">
            <div class="vg-comp-icon">🎯</div>
            <div class="vg-comp-title">Emphasis</div>
            <div class="vg-comp-desc">Pusat perhatian utama (focal point)</div>
          </div>
          <div class="vg-comp-item">
            <div class="vg-comp-icon">🧩</div>
            <div class="vg-comp-title">Unity</div>
            <div class="vg-comp-desc">Kesatuan harmonis seluruh elemen</div>
          </div>
        </div>
      `;
    case 'workflow':
      return `
        <div class="vg-workflow-flow">
          <div class="vg-wf-step"><span class="vg-wf-num">1</span><span>Briefing</span></div>
          <span class="vg-wf-arrow">&rarr;</span>
          <div class="vg-wf-step"><span class="vg-wf-num">2</span><span>Sketsa</span></div>
          <span class="vg-wf-arrow">&rarr;</span>
          <div class="vg-wf-step highlight"><span class="vg-wf-num">3</span><span>Digitalisasi</span></div>
          <span class="vg-wf-arrow">&rarr;</span>
          <div class="vg-wf-step"><span class="vg-wf-num">4</span><span>Review</span></div>
          <span class="vg-wf-arrow">&rarr;</span>
          <div class="vg-wf-step final"><span class="vg-wf-num">5</span><span>Final Export</span></div>
        </div>
      `;
    case 'framerate':
      return `
        <div class="vg-framerate-box">
          <div class="vg-fps-item">
            <div class="vg-fps-num">12 FPS</div>
            <div class="vg-fps-desc">Animasi Tradisional</div>
          </div>
          <div class="vg-fps-item active">
            <div class="vg-fps-num active">24 FPS</div>
            <div class="vg-fps-desc">Standar Sinema / Film</div>
          </div>
          <div class="vg-fps-item">
            <div class="vg-fps-num">60 FPS</div>
            <div class="vg-fps-desc">Game &amp; Video Mulus</div>
          </div>
        </div>
      `;
    case 'squash':
      return `
        <div class="vg-squash-stage">
          <div class="vg-sq-col">
            <div class="vg-ball-normal"></div>
            <span class="vg-sq-label">Normal (Puncak)</span>
          </div>
          <div class="vg-sq-col">
            <div class="vg-ball-stretch"></div>
            <span class="vg-sq-label">Stretch (Meluncur)</span>
          </div>
          <div class="vg-sq-col">
            <div class="vg-ball-squash"></div>
            <span class="vg-sq-label">Squash (Tumbukan)</span>
          </div>
        </div>
      `;
    case 'anticipation':
      return `
        <div class="vg-anticipation-grid">
          <div class="vg-anti-card">
            <div class="vg-anti-icon">🔙</div>
            <strong>1. Anticipation</strong>
            <small>Gerakan ancang-ancang</small>
          </div>
          <span class="vg-wf-arrow">&rarr;</span>
          <div class="vg-anti-card highlight">
            <div class="vg-anti-icon">⚡</div>
            <strong>2. Action</strong>
            <small>Aksi utama gerakan</small>
          </div>
          <span class="vg-wf-arrow">&rarr;</span>
          <div class="vg-anti-card">
            <div class="vg-anti-icon">💨</div>
            <strong>3. Follow-Through</strong>
            <small>Gerak susulan inertia</small>
          </div>
        </div>
      `;
    case 'pipeline':
      return `
        <div class="vg-pipeline-grid">
          <div class="vg-pl-card">
            <span class="vg-pl-badge">Fase 1</span>
            <strong>Pra-Produksi</strong>
            <small>Naskah, Storyboard &amp; Desain</small>
          </div>
          <div class="vg-pl-card active">
            <span class="vg-pl-badge active">Fase 2</span>
            <strong>Produksi</strong>
            <small>Keyframe, Inbetween &amp; Coloring</small>
          </div>
          <div class="vg-pl-card">
            <span class="vg-pl-badge">Fase 3</span>
            <strong>Pascaproduksi</strong>
            <small>Compositing, SFX &amp; Rendering</small>
          </div>
        </div>
      `;
    case 'timeline':
      return `
        <div class="vg-timeline-sim">
          <div class="vg-tl-track track-v2">
            <span class="vg-tl-label">V2</span>
            <div class="vg-tl-clip clip-broll">B-Roll &amp; Lower Third</div>
          </div>
          <div class="vg-tl-track track-v1">
            <span class="vg-tl-label">V1</span>
            <div class="vg-tl-clip clip-main">Main Shot &bull; A-Roll Dialog Video</div>
          </div>
          <div class="vg-tl-track track-a1">
            <span class="vg-tl-label">A1</span>
            <div class="vg-tl-clip clip-audio">Voice Over Dialog (-12 dB)</div>
          </div>
          <div class="vg-tl-track track-a2">
            <span class="vg-tl-label">A2</span>
            <div class="vg-tl-clip clip-music">Musik Latar &amp; SFX (-20 dB)</div>
          </div>
        </div>
      `;
    case 'cuts':
      return `
        <div class="vg-cuts-grid">
          <div class="vg-cut-card">
            <div class="vg-cut-title">J-Cut (Audio Lebih Dulu)</div>
            <div class="vg-cut-diagram">
              <div class="cut-bar video">Video A | Video B</div>
              <div class="cut-bar audio-j">Audio A | &larr; Audio B Masuk Duluan</div>
            </div>
            <small>Peralihan adegan mengalir secara natural</small>
          </div>
          <div class="vg-cut-card">
            <div class="vg-cut-title">L-Cut (Audio Berlanjut)</div>
            <div class="vg-cut-diagram">
              <div class="cut-bar video">Video A | Video B</div>
              <div class="cut-bar audio-l">Audio A Masih Lanjut &rarr; | Audio B</div>
            </div>
            <small>Menciptakan kontinuitas percakapan</small>
          </div>
        </div>
      `;
    case 'colorgrading':
      return `
        <div class="vg-grading-flow">
          <div class="vg-grade-step flat">
            <div class="grade-swatch flat"></div>
            <strong>Log / Flat</strong>
            <small>Dynamic Range Mentah</small>
          </div>
          <span class="vg-wf-arrow">&rarr;</span>
          <div class="vg-grade-step corr">
            <div class="grade-swatch corr"></div>
            <strong>Color Correction</strong>
            <small>White Balance Alami</small>
          </div>
          <span class="vg-wf-arrow">&rarr;</span>
          <div class="vg-grade-step cinem">
            <div class="grade-swatch cinem"></div>
            <strong>Color Grading</strong>
            <small>Teal &amp; Orange Sinematik</small>
          </div>
        </div>
      `;
    case 'export':
      return `
        <div class="vg-export-specs">
          <div class="vg-spec-item">
            <span class="spec-label">Codec Video</span>
            <span class="spec-val">H.264 / AVC (MP4)</span>
          </div>
          <div class="vg-spec-item">
            <span class="spec-label">Resolusi &amp; FPS</span>
            <span class="spec-val">1080p FHD @ 60 FPS</span>
          </div>
          <div class="vg-spec-item">
            <span class="spec-label">Bitrate Target</span>
            <span class="spec-val">15 &ndash; 20 Mbps (VBR 2-Pass)</span>
          </div>
          <div class="vg-spec-item">
            <span class="spec-label">Format Audio</span>
            <span class="spec-val">AAC Stereo 320 kbps &bull; 48 kHz</span>
          </div>
        </div>
      `;
    case 'adc':
      return `
        <div class="vg-adc-flow">
          <div class="vg-adc-step">
            <span class="vg-icon">🔊</span>
            <strong>Akustik Fisik</strong>
            <small>Gelombang Tekanan</small>
          </div>
          <span class="vg-wf-arrow">&rarr;</span>
          <div class="vg-adc-step">
            <span class="vg-icon">🎙️</span>
            <strong>Diafragma Mic</strong>
            <small>Getaran Mekanis</small>
          </div>
          <span class="vg-wf-arrow">&rarr;</span>
          <div class="vg-adc-step">
            <span class="vg-icon">⚡</span>
            <strong>Tegangan Analog</strong>
            <small>Sinyal Listrik AC</small>
          </div>
          <span class="vg-wf-arrow">&rarr;</span>
          <div class="vg-adc-step final">
            <span class="vg-icon">💾</span>
            <strong>ADC Biner</strong>
            <small>Kuantisasi 0 &amp; 1</small>
          </div>
        </div>
      `;
    case 'samplerate':
      return `
        <div class="vg-sample-grid">
          <div class="vg-sample-card">
            <div class="sample-freq">48.000 Hz</div>
            <div class="sample-title">Sample Rate (48 kHz)</div>
            <div class="sample-desc">Menangkap 48.000 sampel suara per detik, menjangkau batas dengar 24 kHz Nyquist.</div>
          </div>
          <div class="vg-sample-card highlight">
            <div class="sample-freq">24-Bit</div>
            <div class="sample-title">Bit Depth (Kedalaman Resolusi)</div>
            <div class="sample-desc">Dynamic range luas 144 dB tanpa distorsi noise lantai.</div>
          </div>
        </div>
      `;
    case 'signalchain':
      return `
        <div class="vg-signal-strip">
          <div class="strip-module"><span>1. Denoise</span></div>
          <span class="vg-wf-arrow">&rarr;</span>
          <div class="strip-module"><span>2. HPF 80Hz</span></div>
          <span class="vg-wf-arrow">&rarr;</span>
          <div class="strip-module highlight"><span>3. Para EQ</span></div>
          <span class="vg-wf-arrow">&rarr;</span>
          <div class="strip-module highlight"><span>4. Comp 3:1</span></div>
          <span class="vg-wf-arrow">&rarr;</span>
          <div class="strip-module final"><span>5. Limiter</span></div>
        </div>
      `;
    case 'mastering':
      return `
        <div class="vg-master-grid">
          <div class="vg-master-item">
            <span class="master-label">Integrated Loudness</span>
            <span class="master-num">-14 LUFS</span>
            <small>Standar YouTube &amp; Streaming</small>
          </div>
          <div class="vg-master-item highlight">
            <span class="master-label">True Peak Ceiling</span>
            <span class="master-num">-1.0 dBFS</span>
            <small>Mencegah Inter-sample Clipping</small>
          </div>
        </div>
      `;
    default:
      return `
        <div class="vg-default-card">
          <span class="vg-icon" style="font-size:2.4rem;">${scene.icon || '✨'}</span>
          <div>
            <div style="font-weight:700; color:#fff; font-size:1rem;">${scene.title || 'Materi Multimedia'}</div>
            <div style="font-size:0.8rem; color:#94a3b8; margin-top:0.25rem;">${scene.keyVisual || 'Perhatikan prinsip teknis dan visual di atas.'}</div>
          </div>
        </div>
      `;
  }
}

// Format seconds into MM:SS
function formatVideoTime(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

// Parse "MM:SS" into seconds
function parseDurationSeconds(str) {
  if (!str) return 195;
  const parts = str.split(':');
  if (parts.length === 2) {
    return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
  }
  return 195;
}

// Calculate video progress percentage
function calculateVideoProgress(scenes) {
  if (!scenes || scenes.length === 0) return 0;
  const current = state.aiVideo.currentScene;
  return Math.min(100, Math.round(((current + 1) / scenes.length) * 100));
}

// ==================== AI VIDEO CONTROLLER ====================
function toggleAiVideo() {
  if (state.aiVideo.isPlaying) {
    pauseAiVideo();
  } else {
    playAiVideo();
  }
}

function playAiVideo() {
  // If auditory is playing, stop it first to prevent overlapping audio
  stopAuditoryAudio();

  const material = state.selectedMaterial;
  if (!material || !material.content || !material.content.visual) return;
  const scenes = material.content.visual.aiVideo?.scenes || [];
  if (scenes.length === 0) return;

  state.aiVideo.isPlaying = true;

  // Add playing class to frame
  const frame = document.getElementById('aiVideoFrame');
  if (frame) frame.classList.add('playing');

  // Explicitly hide the center overlay so it never blocks the video
  const overlay = document.getElementById('aiCenterPlayOverlay');
  if (overlay) {
    overlay.style.display = 'none';
  }

  const playBtn = document.getElementById('aiPlayBtn');
  if (playBtn) playBtn.textContent = '⏸ Jeda';

  // Speak current scene narration if speech is enabled
  speakAiCurrentScene();

  const totalSec = parseDurationSeconds(material.content.visual.aiVideo?.duration || '03:15');

  // Start video timer
  if (state.aiVideo.timer) clearInterval(state.aiVideo.timer);
  state.aiVideo.timer = setInterval(() => {
    state.aiVideo.elapsedSeconds += 1;
    updateAiVideoTimeDisplay();

    // Check if we should advance to the next scene
    const nextScene = scenes[state.aiVideo.currentScene + 1];

    if (nextScene && state.aiVideo.elapsedSeconds >= (nextScene.time || 0)) {
      state.aiVideo.currentScene++;
      updateAiVideoSceneUI();
      speakAiCurrentScene();
    } else if (state.aiVideo.elapsedSeconds >= totalSec) {
      pauseAiVideo();
      showToast('Video penjelasan AI telah selesai diputar!', 'success');
    }
  }, 1000 / (state.aiVideo.speed || 1));
}

function pauseAiVideo() {
  state.aiVideo.isPlaying = false;
  state.aiVideo.isSpeaking = false;
  if (state.aiVideo.timer) {
    clearInterval(state.aiVideo.timer);
    state.aiVideo.timer = null;
  }

  if ('speechSynthesis' in window) {
    speechSynthesis.cancel();
  }

  const frame = document.getElementById('aiVideoFrame');
  if (frame) frame.classList.remove('playing');

  // Re-show center overlay when paused
  const overlay = document.getElementById('aiCenterPlayOverlay');
  if (overlay) {
    overlay.style.display = 'flex';
  }

  const playBtn = document.getElementById('aiPlayBtn');
  if (playBtn) playBtn.textContent = '▶ Putar';

  const mouth = document.getElementById('aiPresenterMouth');
  if (mouth) mouth.classList.remove('talking');

  const vu = document.getElementById('aiVuMeter');
  if (vu) vu.classList.remove('active');
}

function stopAiVideoPlayback() {
  state.aiVideo.isPlaying = false;
  state.aiVideo.isSpeaking = false;
  if (state.aiVideo.timer) {
    clearInterval(state.aiVideo.timer);
    state.aiVideo.timer = null;
  }
  if ('speechSynthesis' in window) {
    speechSynthesis.cancel();
  }
  const frame = document.getElementById('aiVideoFrame');
  if (frame) frame.classList.remove('playing');
  const overlay = document.getElementById('aiCenterPlayOverlay');
  if (overlay) overlay.style.display = 'flex';
  const playBtn = document.getElementById('aiPlayBtn');
  if (playBtn) playBtn.textContent = '▶ Putar';
}

function replayAiVideo() {
  state.aiVideo.currentScene = 0;
  state.aiVideo.elapsedSeconds = 0;
  updateAiVideoSceneUI();
  updateAiVideoTimeDisplay();
  playAiVideo();
}

function skipAiVideo(seconds) {
  const material = state.selectedMaterial;
  const scenes = material?.content?.visual?.aiVideo?.scenes || [];
  if (scenes.length === 0) return;

  const totalSec = parseDurationSeconds(material?.content?.visual?.aiVideo?.duration || '03:15');
  state.aiVideo.elapsedSeconds = Math.max(0, Math.min(totalSec, state.aiVideo.elapsedSeconds + seconds));

  // Find corresponding scene
  let foundIndex = 0;
  for (let i = 0; i < scenes.length; i++) {
    if (state.aiVideo.elapsedSeconds >= (scenes[i].time || 0)) {
      foundIndex = i;
    }
  }

  const sceneChanged = (state.aiVideo.currentScene !== foundIndex);
  state.aiVideo.currentScene = foundIndex;
  updateAiVideoSceneUI();
  updateAiVideoTimeDisplay();

  if (state.aiVideo.isPlaying && sceneChanged) {
    speakAiCurrentScene();
  }
}

function nextAiVideoScene() {
  const material = state.selectedMaterial;
  const scenes = material?.content?.visual?.aiVideo?.scenes || [];
  if (state.aiVideo.currentScene < scenes.length - 1) {
    seekAiVideoScene(state.aiVideo.currentScene + 1);
  } else {
    showToast('Ini adalah babak terakhir.', 'info');
  }
}

function prevAiVideoScene() {
  if (state.aiVideo.currentScene > 0) {
    seekAiVideoScene(state.aiVideo.currentScene - 1);
  } else {
    showToast('Ini adalah babak pertama.', 'info');
  }
}

function seekAiVideoScene(sceneIndex) {
  const material = state.selectedMaterial;
  if (!material || !material.content || !material.content.visual) return;
  const scenes = material.content.visual.aiVideo?.scenes || [];
  if (!scenes[sceneIndex]) return;

  state.aiVideo.currentScene = sceneIndex;
  state.aiVideo.elapsedSeconds = scenes[sceneIndex].time || 0;

  updateAiVideoSceneUI();
  updateAiVideoTimeDisplay();

  if (state.aiVideo.isPlaying) {
    speakAiCurrentScene();
  }
}

function seekAiVideoProgress(e) {
  const track = document.getElementById('aiTimelineTrack');
  if (!track) return;
  const rect = track.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const ratio = Math.max(0, Math.min(1, clickX / rect.width));

  const material = state.selectedMaterial;
  const duration = material?.content?.visual?.aiVideo?.duration || '03:15';
  const totalSec = parseDurationSeconds(duration);
  const targetSeconds = Math.round(ratio * totalSec);

  skipAiVideo(targetSeconds - state.aiVideo.elapsedSeconds);
}

function toggleAiVideoSpeech() {
  state.aiVideo.voiceEnabled = !state.aiVideo.voiceEnabled;
  const btn = document.getElementById('aiSpeechToggleBtn');

  if (!state.aiVideo.voiceEnabled) {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
    state.aiVideo.isSpeaking = false;
    const mouth = document.getElementById('aiPresenterMouth');
    if (mouth) mouth.classList.remove('talking');
    const vu = document.getElementById('aiVuMeter');
    if (vu) vu.classList.remove('active');
    if (btn) btn.textContent = '🔇 Mute';
    showToast('Suara narasi AI dinonaktifkan', 'info');
  } else {
    if (btn) btn.textContent = '🔊 Suara AI';
    showToast('Suara narasi AI diaktifkan', 'success');
    if (state.aiVideo.isPlaying) {
      speakAiCurrentScene();
    }
  }
}

function toggleAiVideoSubtitles() {
  state.aiVideo.showSubtitles = !state.aiVideo.showSubtitles;
  const overlay = document.getElementById('aiVideoCaptions');
  const btn = document.getElementById('aiSubtitleBtn');
  if (overlay) {
    overlay.style.display = state.aiVideo.showSubtitles ? 'block' : 'none';
  }
  if (btn) {
    btn.classList.toggle('active', state.aiVideo.showSubtitles);
  }
  showToast(state.aiVideo.showSubtitles ? 'Teks terjemahan (CC) diaktifkan' : 'Teks terjemahan (CC) dinonaktifkan', 'info');
}

function changeAiVideoSpeed(newSpeed) {
  state.aiVideo.speed = parseFloat(newSpeed) || 1;
  if (state.aiVideo.isPlaying) {
    if (state.aiVideo.timer) clearInterval(state.aiVideo.timer);
    state.aiVideo.timer = setInterval(() => {
      state.aiVideo.elapsedSeconds += 1;
      updateAiVideoTimeDisplay();
    }, 1000 / state.aiVideo.speed);
  }
  showToast(`Kecepatan video: ${newSpeed}x`, 'info');
}

function toggleAiVideoFullscreen() {
  const frame = document.getElementById('aiVideoFrame');
  if (!frame) return;

  if (!document.fullscreenElement) {
    if (frame.requestFullscreen) {
      frame.requestFullscreen();
    } else if (frame.webkitRequestFullscreen) {
      frame.webkitRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}

// Find the best Indonesian speech synthesis voice
function getBestIndonesianVoice() {
  if (!('speechSynthesis' in window)) return null;
  const voices = speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;
  const idVoice = voices.find(v => v.lang.startsWith('id') || v.lang.includes('ID') || v.name.toLowerCase().includes('indonesia'));
  if (idVoice) return idVoice;
  return voices.find(v => v.lang.startsWith('en')) || voices[0] || null;
}

function speakAiCurrentScene() {
  if (!state.aiVideo.voiceEnabled) return;
  if (!('speechSynthesis' in window)) return;

  speechSynthesis.cancel();

  const material = state.selectedMaterial;
  const scenes = material?.content?.visual?.aiVideo?.scenes || [];
  const scene = scenes[state.aiVideo.currentScene];
  if (!scene || !scene.narration) return;

  const utterance = new SpeechSynthesisUtterance(scene.narration);
  const voice = getBestIndonesianVoice();
  if (voice) {
    utterance.voice = voice;
    utterance.lang = voice.lang;
  } else {
    utterance.lang = 'id-ID';
  }
  utterance.rate = 1.0 * (state.aiVideo.speed || 1);
  utterance.pitch = 1.05;

  const mouth = document.getElementById('aiPresenterMouth');
  const vu = document.getElementById('aiVuMeter');

  utterance.onstart = () => {
    state.aiVideo.isSpeaking = true;
    if (mouth) mouth.classList.add('talking');
    if (vu) vu.classList.add('active');
  };

  utterance.onend = () => {
    state.aiVideo.isSpeaking = false;
    if (mouth) mouth.classList.remove('talking');
    if (vu) vu.classList.remove('active');
  };

  utterance.onerror = () => {
    state.aiVideo.isSpeaking = false;
    if (mouth) mouth.classList.remove('talking');
    if (vu) vu.classList.remove('active');
  };

  speechSynthesis.speak(utterance);
}

function updateAiVideoSceneUI() {
  const material = state.selectedMaterial;
  const scenes = material?.content?.visual?.aiVideo?.scenes || [];
  const scene = scenes[state.aiVideo.currentScene];
  if (!scene) return;

  const badge = document.getElementById('aiSceneBadge');
  if (badge) badge.textContent = `Babak ${state.aiVideo.currentScene + 1} / ${scenes.length}: ${scene.title || ''}`;

  const topicTitle = document.getElementById('aiTopicTitle');
  if (topicTitle) topicTitle.textContent = scene.title || '';

  const display = document.getElementById('aiCanvasDisplay');
  if (display) display.innerHTML = renderAiVisualGraphic(scene.visualGraphic || 'elements', scene);

  const keyVisual = document.getElementById('aiKeyVisualText');
  if (keyVisual) {
    keyVisual.innerHTML = scene.keyVisual ? `💡 <strong>Konsep Inti:</strong> ${scene.keyVisual}` : '';
  }

  const subtitle = document.getElementById('aiSubtitleText');
  if (subtitle) {
    subtitle.style.opacity = '0';
    setTimeout(() => {
      subtitle.textContent = scene.narration || '';
      subtitle.style.opacity = '1';
    }, 150);
  }

  // Update slide dots
  document.querySelectorAll('.ai-slide-dot').forEach((dot, idx) => {
    dot.classList.toggle('active', idx === state.aiVideo.currentScene);
    dot.classList.toggle('passed', idx < state.aiVideo.currentScene);
  });

  // Update chapter cards
  document.querySelectorAll('.ai-chapter-card').forEach((card, idx) => {
    card.classList.toggle('active', idx === state.aiVideo.currentScene);
  });
}

function updateAiVideoTimeDisplay() {
  const material = state.selectedMaterial;
  const duration = material?.content?.visual?.aiVideo?.duration || '03:15';
  const totalSec = parseDurationSeconds(duration);
  const elapsed = state.aiVideo.elapsedSeconds;
  const percent = totalSec > 0 ? Math.min(100, (elapsed / totalSec) * 100) : 0;

  const fill = document.getElementById('aiTimelineFill');
  if (fill) fill.style.width = `${percent}%`;

  const counter = document.getElementById('aiElapsedCounter');
  if (counter) counter.textContent = `${formatVideoTime(elapsed)} / ${duration}`;

  const topCounter = document.getElementById('aiTopTimeCounter');
  if (topCounter) {
    topCounter.textContent = `${formatVideoTime(elapsed)} / ${duration}`;
  }
}

// ==================== AUDITORY CONTENT (UPGRADED PODCAST PLAYER) ====================
function renderAuditoryContent(content) {
  const keyPoints = content.keyPoints || [
    'Dengarkan secara saksama setiap pemaparan konsep lisan yang disampaikan.',
    'Catat istilah kunci atau ulangi kembali narasi dengan suara perlahan.',
    'Gunakan teknik diskusi verbal untuk memperdalam pemahaman materi.'
  ];

  const transcript = content.transcript || 'Transkrip audio materi pembelajaran sedang disiapkan.';
  // Parse sentences for interactive karaoke-style transcript follow
  const sentences = transcript.match(/[^.!?]+[.!?]+(\s+|$)/g) || [transcript];
  state.auditory.sentences = sentences.map(s => s.trim());

  return `
    <div class="auditory-content">
      <div class="card card-auditory">
        <h3 class="content-heading">${content.title}</h3>
        <p style="color:var(--text-secondary); margin-bottom:1.25rem; line-height:1.6;">
          Dengarkan uraian materi verbal berformat podcast dengan pemutar audio pintar dan transkrip interaktif.
        </p>

        <!-- Upgraded Podcast Audio Player Card -->
        <div class="podcast-player-card">
          <!-- Top Row: Circle Play Button + Metadata -->
          <div class="podcast-top-header">
            <button type="button" class="podcast-play-circle-btn" id="podcastPlayCircleBtn" onclick="toggleAuditoryPlay()" title="Putar Audio Podcast">
              <span id="podcastPlayIcon">${state.auditory.isPlaying ? '⏸' : '▶'}</span>
            </button>

            <div class="podcast-meta-info">
              <span class="podcast-badge">🎙️ PODCAST PEMBELAJARAN MULTIMEDIA</span>
              <h4 class="podcast-track-title">${content.title}</h4>
              <p class="podcast-track-subtitle" id="podcastStatusText">
                ${state.auditory.isPlaying ? 'Sedang memutar audio podcast...' : `Klik tombol putar untuk mendengarkan (${content.duration || '5 menit'})`}
              </p>
            </div>
          </div>

          <!-- 32-Bar Live Frequency Audio Waveform -->
          <div class="podcast-waveform-box ${state.auditory.isPlaying ? 'active' : ''}" id="podcastWaveformBox">
            ${Array.from({ length: 32 }, (_, i) => `
              <div class="podcast-wave-bar" id="pwave-${i}" style="height: ${Math.floor(Math.sin(i * 0.25) * 35 + 40)}%;"></div>
            `).join('')}
          </div>

          <!-- Timeline Scrubber Track -->
          <div class="podcast-scrubber-row">
            <span class="ai-time-readout" id="podcastElapsedCounter">${formatVideoTime(state.auditory.elapsedSeconds)}</span>
            <div class="podcast-scrubber-track" id="podcastScrubberTrack" onclick="seekAuditoryProgress(event)" title="Klik untuk melompat menit audio">
              <div class="podcast-scrubber-fill" id="podcastScrubberFill" style="width: ${calculateAuditoryProgress()}%;"></div>
            </div>
            <span class="ai-time-readout" id="podcastDurationCounter">${content.duration || '05:00'}</span>
          </div>

          <!-- Controls Row -->
          <div class="podcast-controls-row">
            <div style="display:flex; align-items:center; gap:0.5rem;">
              <button type="button" class="podcast-btn-ctrl" onclick="skipAuditoryAudio(-10)" title="Mundur 10 detik">
                ⏪ -10 detik
              </button>
              <button type="button" class="podcast-btn-ctrl" onclick="skipAuditoryAudio(10)" title="Maju 10 detik">
                ⏩ +10 detik
              </button>
              <button type="button" class="podcast-btn-ctrl" onclick="replayAuditoryAudio()" title="Putar dari awal">
                ↺ Putar Ulang
              </button>
            </div>

            <div style="display:flex; align-items:center; gap:0.5rem;">
              <label style="font-size:0.75rem; color:var(--text-secondary);">Kecepatan:</label>
              <select class="ai-speed-dropdown" onchange="changeAuditorySpeed(this.value)">
                <option value="0.85" ${state.auditory.speed === 0.85 ? 'selected' : ''}>0.85x Lambat</option>
                <option value="1" ${state.auditory.speed === 1 ? 'selected' : ''}>1.0x Normal</option>
                <option value="1.2" ${state.auditory.speed === 1.2 ? 'selected' : ''}>1.2x Cepat</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Interactive Karaoke Live Transcript -->
        <div class="podcast-transcript-container">
          <div class="podcast-transcript-title">
            <span>📝 Transkrip Suara (Tersinkronisasi &amp; Interaktif):</span>
            <span style="font-size:0.75rem; font-weight:normal; color:#94a3b8;">(Klik kalimat untuk memutar langsung dari sana)</span>
          </div>
          <div class="podcast-transcript-body" id="podcastTranscriptBody">
            ${state.auditory.sentences.map((s, idx) => `
              <span class="transcript-sentence ${state.auditory.currentSentenceIndex === idx ? 'active' : ''}" 
                    id="transcript-sent-${idx}" 
                    onclick="seekAuditorySentence(${idx})"
                    title="Klik untuk memutar kalimat ini">
                ${s}
              </span>
            `).join(' ')}
          </div>
        </div>

        <!-- Key Points to Listen To -->
        <div class="audio-keypoints" style="margin-top:1.5rem;">
          <h4>Poin-Poin Penting untuk Didengarkan:</h4>
          <ul>
            ${keyPoints.map(p => `<li>${p}</li>`).join('')}
          </ul>
        </div>
      </div>
    </div>
  `;
}

// Calculate auditory player progress percentage
function calculateAuditoryProgress() {
  const total = state.auditory.durationSeconds || 300;
  return Math.min(100, Math.round((state.auditory.elapsedSeconds / total) * 100));
}

// ==================== AUDITORY AUDIO ENGINE CONTROLLER ====================
function initAuditoryPlayer() {
  // Reset active state when entering Auditory view
  state.auditory.isPlaying = false;
  state.auditory.elapsedSeconds = 0;
  state.auditory.currentSentenceIndex = 0;

  const content = state.selectedMaterial?.content?.auditory;
  if (content && content.transcript) {
    const sentences = content.transcript.match(/[^.!?]+[.!?]+(\s+|$)/g) || [content.transcript];
    state.auditory.sentences = sentences.map(s => s.trim());
    state.auditory.durationSeconds = Math.max(60, state.auditory.sentences.length * 15);
  }
}

function toggleAuditoryPlay() {
  if (state.auditory.isPlaying) {
    pauseAuditoryAudio();
  } else {
    playAuditoryAudio();
  }
}

function playAuditoryAudio() {
  // If AI video is playing, pause it first
  stopAiVideoPlayback();

  state.auditory.isPlaying = true;

  const icon = document.getElementById('podcastPlayIcon');
  if (icon) icon.textContent = '⏸';

  const statusText = document.getElementById('podcastStatusText');
  if (statusText) statusText.textContent = 'Sedang memutar audio podcast...';

  const waveBox = document.getElementById('podcastWaveformBox');
  if (waveBox) waveBox.classList.add('active');

  // Start timer interval
  if (state.auditory.timer) clearInterval(state.auditory.timer);
  state.auditory.timer = setInterval(() => {
    state.auditory.elapsedSeconds += 1;
    updateAuditoryTimeDisplay();

    // Randomize wave bars slightly for dynamic audio visualization
    const bars = document.querySelectorAll('.podcast-wave-bar');
    bars.forEach(bar => {
      bar.style.height = `${Math.floor(Math.random() * 75 + 15)}%`;
    });
  }, 1000 / (state.auditory.speed || 1));

  // Speak current sentence
  speakAuditoryCurrentSentence();
  showToast('Podcast audio dimulai...', 'info');
}

function pauseAuditoryAudio() {
  state.auditory.isPlaying = false;
  if (state.auditory.timer) {
    clearInterval(state.auditory.timer);
    state.auditory.timer = null;
  }

  if ('speechSynthesis' in window) {
    speechSynthesis.cancel();
  }

  const icon = document.getElementById('podcastPlayIcon');
  if (icon) icon.textContent = '▶';

  const statusText = document.getElementById('podcastStatusText');
  if (statusText) statusText.textContent = 'Audio podcast dijeda.';

  const waveBox = document.getElementById('podcastWaveformBox');
  if (waveBox) waveBox.classList.remove('active');
}

function stopAuditoryAudio() {
  state.auditory.isPlaying = false;
  if (state.auditory.timer) {
    clearInterval(state.auditory.timer);
    state.auditory.timer = null;
  }
  if ('speechSynthesis' in window) {
    speechSynthesis.cancel();
  }
}

function replayAuditoryAudio() {
  state.auditory.currentSentenceIndex = 0;
  state.auditory.elapsedSeconds = 0;
  updateAuditorySentenceHighlight();
  updateAuditoryTimeDisplay();
  playAuditoryAudio();
}

function skipAuditoryAudio(seconds) {
  state.auditory.elapsedSeconds = Math.max(0, state.auditory.elapsedSeconds + seconds);

  // Approximate sentence index based on time
  const totalSentences = state.auditory.sentences.length || 1;
  const targetIndex = Math.min(totalSentences - 1, Math.floor((state.auditory.elapsedSeconds / state.auditory.durationSeconds) * totalSentences));

  state.auditory.currentSentenceIndex = Math.max(0, targetIndex);
  updateAuditorySentenceHighlight();
  updateAuditoryTimeDisplay();

  if (state.auditory.isPlaying) {
    speakAuditoryCurrentSentence();
  }
}

function seekAuditorySentence(index) {
  state.auditory.currentSentenceIndex = index;
  const totalSentences = state.auditory.sentences.length || 1;
  state.auditory.elapsedSeconds = Math.floor((index / totalSentences) * state.auditory.durationSeconds);

  updateAuditorySentenceHighlight();
  updateAuditoryTimeDisplay();

  if (state.auditory.isPlaying) {
    speakAuditoryCurrentSentence();
  } else {
    playAuditoryAudio();
  }
}

function seekAuditoryProgress(e) {
  const track = document.getElementById('podcastScrubberTrack');
  if (!track) return;
  const rect = track.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const ratio = Math.max(0, Math.min(1, clickX / rect.width));

  state.auditory.elapsedSeconds = Math.floor(ratio * state.auditory.durationSeconds);
  const totalSentences = state.auditory.sentences.length || 1;
  state.auditory.currentSentenceIndex = Math.min(totalSentences - 1, Math.floor(ratio * totalSentences));

  updateAuditorySentenceHighlight();
  updateAuditoryTimeDisplay();

  if (state.auditory.isPlaying) {
    speakAuditoryCurrentSentence();
  }
}

function changeAuditorySpeed(newSpeed) {
  state.auditory.speed = parseFloat(newSpeed) || 1;
  if (state.auditory.isPlaying) {
    if (state.auditory.timer) clearInterval(state.auditory.timer);
    state.auditory.timer = setInterval(() => {
      state.auditory.elapsedSeconds += 1;
      updateAuditoryTimeDisplay();
    }, 1000 / state.auditory.speed);

    // Re-speak current sentence with new rate
    speakAuditoryCurrentSentence();
  }
  showToast(`Kecepatan podcast: ${newSpeed}x`, 'info');
}

function speakAuditoryCurrentSentence() {
  if (!('speechSynthesis' in window)) return;

  speechSynthesis.cancel();

  const sentences = state.auditory.sentences;
  const idx = state.auditory.currentSentenceIndex;
  if (!sentences || !sentences[idx]) return;

  updateAuditorySentenceHighlight();

  const textToSpeak = sentences[idx];
  const utterance = new SpeechSynthesisUtterance(textToSpeak);
  utterance.lang = 'id-ID';
  utterance.rate = 0.92 * (state.auditory.speed || 1);

  utterance.onend = () => {
    if (!state.auditory.isPlaying) return;

    // Advance to next sentence
    if (state.auditory.currentSentenceIndex < sentences.length - 1) {
      state.auditory.currentSentenceIndex++;
      speakAuditoryCurrentSentence();
    } else {
      // Reached the end
      pauseAuditoryAudio();
      state.auditory.currentSentenceIndex = 0;
      updateAuditorySentenceHighlight();
      showToast('Podcast audio selesai didengarkan!', 'success');
    }
  };

  utterance.onerror = (e) => {
    console.warn('Speech synthesis auditory error:', e);
    // Continue playback smoothly without crashing
  };

  speechSynthesis.speak(utterance);
}

function updateAuditorySentenceHighlight() {
  document.querySelectorAll('.transcript-sentence').forEach((el, i) => {
    if (i === state.auditory.currentSentenceIndex) {
      el.classList.add('active');
      // Smoothly scroll active sentence into view if needed
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
      el.classList.remove('active');
    }
  });

  const fill = document.getElementById('podcastScrubberFill');
  if (fill) fill.style.width = `${calculateAuditoryProgress()}%`;
}

function updateAuditoryTimeDisplay() {
  const counter = document.getElementById('podcastElapsedCounter');
  if (counter) counter.textContent = formatVideoTime(state.auditory.elapsedSeconds);

  const fill = document.getElementById('podcastScrubberFill');
  if (fill) fill.style.width = `${calculateAuditoryProgress()}%`;
}

// Backward compatibility alias
function toggleAudio() {
  toggleAuditoryPlay();
}

function initWaveform() {
  initAuditoryPlayer();
}

// ==================== KINESTHETIC CONTENT ====================
function renderKinestheticContent(content, material) {
  const items = content.items || content.steps || [];
  const shuffledItems = shuffleArray([...items]);

  return `
    <div class="kinesthetic-content">
      <div class="card card-kinesthetic">
        <h3 class="content-heading">${content.title}</h3>
        <p style="color:var(--text-secondary); margin-bottom:1.5rem; line-height:1.8;">
          ${content.instruction || content.body || 'Susun langkah-langkah proses berikut dalam urutan teknis yang tepat!'}
        </p>

        <div class="interactive-activity">
          <div class="activity-instructions">
            <h4>Simulasi Praktik: Urutkan Tahapan Kerja</h4>
            <p>Tarik dan geser (drag &amp; drop) kotak tahapan berikut agar tersusun sesuai urutan teknis yang benar:</p>
          </div>

          <div class="drag-container" id="dragContainer">
            <div class="drag-list" id="dragList">
              ${shuffledItems.map(item => `
                <div class="drag-item" draggable="true" data-order="${item.order}">
                  <span class="drag-handle">&equiv;</span>
                  <span class="drag-text">${item.text}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <div style="margin-top:1.5rem; text-align:center;">
            <button type="button" class="btn btn-primary" onclick="checkOrder()">Periksa Urutan Praktik</button>
          </div>

          <div id="dragResult" style="margin-top:1rem;"></div>
        </div>
      </div>
    </div>
  `;
}

// Drag & Drop
let draggedItem = null;

function initDragAndDrop() {
  const list = document.getElementById('dragList');
  if (!list) return;

  const items = list.querySelectorAll('.drag-item');
  items.forEach(item => {
    item.addEventListener('dragstart', handleDragStart);
    item.addEventListener('dragover', handleDragOver);
    item.addEventListener('drop', handleDrop);
    item.addEventListener('dragend', handleDragEnd);
  });
}

function handleDragStart(e) {
  draggedItem = this;
  this.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
}

function handleDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  const list = document.getElementById('dragList');
  const afterElement = getDragAfterElement(list, e.clientY);
  if (afterElement == null) {
    list.appendChild(draggedItem);
  } else {
    list.insertBefore(draggedItem, afterElement);
  }
}

function handleDrop(e) {
  e.stopPropagation();
}

function handleDragEnd() {
  this.classList.remove('dragging');
  draggedItem = null;
}

function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll('.drag-item:not(.dragging)')];
  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function checkOrder() {
  const list = document.getElementById('dragList');
  if (!list) return;

  const items = list.querySelectorAll('.drag-item');
  let correct = 0;

  items.forEach((item, i) => {
    const expectedOrder = i + 1;
    const actualOrder = parseInt(item.dataset.order);

    item.classList.remove('correct', 'incorrect');
    if (actualOrder === expectedOrder) {
      item.classList.add('correct');
      correct++;
    } else {
      item.classList.add('incorrect');
    }
  });

  const resultDiv = document.getElementById('dragResult');
  const total = items.length;

  if (correct === total) {
    resultDiv.innerHTML = `
      <div class="drag-result success">
        Urutan Tepat! Seluruh ${correct} langkah tersusun sesuai prosedur teknis (${correct}/${total}).
      </div>
    `;
  } else {
    resultDiv.innerHTML = `
      <div class="drag-result error">
        ${correct} dari ${total} langkah sudah benar. Silakan periksa kembali bagian yang ditandai merah.
      </div>
    `;
  }
}

// ==================== EVALUATION PAGE ====================
async function renderEvaluation() {
  const app = document.getElementById('app');

  try {
    const res = await fetch('/api/evaluations');
    const evalData = await res.json();
    state.evaluations = evalData.data;

    const stats = state.evaluations;

    app.innerHTML = `
      <section class="section">
        <div class="section-header">
          <span class="section-badge">Pengukuran &amp; Evaluasi</span>
          <h2 class="section-title">Evaluasi Pembelajaran</h2>
          <p class="section-subtitle">Fase Evaluation dari model PIE &mdash; mengukur efektivitas media dan umpan balik pengguna.</p>
        </div>

        <!-- Stats -->
        <div class="eval-grid">
          <div class="card eval-stat">
            <div class="eval-stat-value">${stats.total}</div>
            <div class="eval-stat-label">Total Respon Evaluasi</div>
          </div>
          <div class="card eval-stat">
            <div class="eval-stat-value">${stats.averageRating} / 5.0</div>
            <div class="eval-stat-label">Rating Rata-rata Kualitas</div>
          </div>
          <div class="card eval-stat">
            <div class="eval-stat-value">
              V: ${stats.styleDistribution.V} &bull; A: ${stats.styleDistribution.A} &bull; K: ${stats.styleDistribution.K}
            </div>
            <div class="eval-stat-label">Distribusi Modalitas Responden</div>
          </div>
        </div>

        <!-- Form -->
        <div class="eval-form-container">
          <div class="card">
            <h3 style="font-size:1.2rem; font-weight:700; margin-bottom:1.5rem; text-align:center;">
              Formulir Umpan Balik Pembelajaran
            </h3>
            <form id="evalForm" onsubmit="submitEvaluation(event)">
              <div class="form-group">
                <label class="form-label">Nama Siswa / Pengguna</label>
                <input type="text" class="form-input" id="evalName" placeholder="Masukkan nama Anda" required>
              </div>

              <div class="form-group">
                <label class="form-label">Gaya Belajar Hasil Diagnosis</label>
                <select class="form-select" id="evalStyle">
                  <option value="">&mdash; Pilih gaya belajar &mdash;</option>
                  <option value="V" ${state.quizResult?.dominant === 'V' ? 'selected' : ''}>Visual (Spasial &amp; Grafis)</option>
                  <option value="A" ${state.quizResult?.dominant === 'A' ? 'selected' : ''}>Auditori (Verbal &amp; Suara)</option>
                  <option value="K" ${state.quizResult?.dominant === 'K' ? 'selected' : ''}>Kinestetik (Praktik &amp; Interaktif)</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Penilaian Kualitas Media (1 s.d. 5 Bintang)</label>
                <div class="star-rating" id="starRating">
                  ${[1, 2, 3, 4, 5].map(n => `
                    <button type="button" class="star-btn" data-rating="${n}" onclick="setRating(${n})">&#9733;</button>
                  `).join('')}
                </div>
                <input type="hidden" id="evalRating" value="5">
              </div>

              <div class="form-group">
                <label class="form-label">Umpan Balik &amp; Saran Perbaikan</label>
                <textarea class="form-textarea" id="evalFeedback" placeholder="Tuliskan masukan Anda terkait kemudahan materi, kenyamanan asesmen, atau saran pengembangan sistem" required></textarea>
              </div>

              <button type="submit" class="btn btn-primary" style="width:100%;">Kirim Evaluasi &rarr;</button>
            </form>
          </div>
        </div>
      </section>
    `;
  } catch (err) {
    app.innerHTML = `<div class="empty-state"><p>Gagal memuat data evaluasi.</p></div>`;
  }
}

let currentRating = 5;

function setRating(rating) {
  currentRating = rating;
  const input = document.getElementById('evalRating');
  if (input) input.value = rating;

  document.querySelectorAll('.star-btn').forEach((btn, i) => {
    btn.classList.toggle('active', i < rating);
  });
}

async function submitEvaluation(e) {
  e.preventDefault();

  const name = document.getElementById('evalName').value;
  const learningStyle = document.getElementById('evalStyle').value;
  const rating = parseInt(document.getElementById('evalRating').value);
  const feedback = document.getElementById('evalFeedback').value;

  try {
    const res = await fetch('/api/evaluations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, learningStyle, rating, feedback })
    });
    const data = await res.json();
    if (data.success) {
      showToast('Evaluasi berhasil dikirim. Terima kasih!', 'success');
      renderEvaluation();
    }
  } catch (err) {
    showToast('Gagal mengirim evaluasi', 'error');
  }
}

// ==================== TENTANG PIE PAGE ====================
function renderAboutPIE() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <section class="section">
      <div class="section-header">
        <span class="section-badge">Kerangka Kerja Desain Instruksional</span>
        <h2 class="section-title">Model PIE</h2>
        <p class="section-subtitle">
          Planning &bull; Implementation &bull; Evaluation &mdash; Model metodologi pengembangan perangkat lunak &amp; media edukasi
        </p>
      </div>

      <div class="pie-timeline">
        <div class="pie-step">
          <div class="pie-step-number">P</div>
          <div class="card card-visual">
            <h3 class="pie-step-heading">Planning (Tahap Perencanaan)</h3>
            <p>
              Fase awal perancangan di mana pengembang mengidentifikasi karakteristik siswa, menganalisis kebutuhan instruksional, 
              merumuskan capaian pembelajaran multimedia, dan merancang arsitektur perangkat lunak yang responsif.
            </p>
            <div class="pie-activities">
              <div class="pie-activity">
                <span class="check-mark">&bull;</span>
                <span>Analisis kebutuhan pemelajar: pemetaan 3 gaya belajar VAK (Visual, Auditori, Kinestetik)</span>
              </div>
              <div class="pie-activity">
                <span class="check-mark">&bull;</span>
                <span>Desain arsitektur: backend REST API dengan Node.js/Express dan frontend SPA modular</span>
              </div>
              <div class="pie-activity">
                <span class="check-mark">&bull;</span>
                <span>Kurasi materi: Desain Grafis, Animasi, Video Editing, dan Audio Editing</span>
              </div>
              <div class="pie-activity">
                <span class="check-mark">&bull;</span>
                <span>Perancangan instrumen asesmen: 10 butir diagnostik berkonteks multimedia</span>
              </div>
            </div>
          </div>
        </div>

        <div class="pie-step">
          <div class="pie-step-number">I</div>
          <div class="card card-auditory">
            <h3 class="pie-step-heading">Implementation (Tahap Penerapan)</h3>
            <p>
              Fase perealisasian rencana ke dalam bentuk kode program dan media interaktif nyata. Konten dikembangkan dengan 
              antarmuka adaptif sehingga pemelajar dapat beralih moda belajar dengan mulus.
            </p>
            <div class="pie-activities">
              <div class="pie-activity">
                <span class="check-mark">&bull;</span>
                <span>Pengembangan Game Petualangan Mario: 1 level komprehensif dengan 10 pos asesmen VAK</span>
              </div>
              <div class="pie-activity">
                <span class="check-mark">&bull;</span>
                <span>Pengembangan modul adaptif: diagram alur untuk visual, pemutar audio untuk auditori, drag &amp; drop untuk kinestetik</span>
              </div>
              <div class="pie-activity">
                <span class="check-mark">&bull;</span>
                <span>Integrasi Web Audio API untuk efek suara retro prosedural tanpa latensi</span>
              </div>
              <div class="pie-activity">
                <span class="check-mark">&bull;</span>
                <span>Penyediaan kontrol responsif: keyboard desktop dan tombol virtual layar sentuh (mobile/tablet)</span>
              </div>
            </div>
          </div>
        </div>

        <div class="pie-step">
          <div class="pie-step-number">E</div>
          <div class="card card-kinesthetic">
            <h3 class="pie-step-heading">Evaluation (Tahap Evaluasi)</h3>
            <p>
              Fase pengukuran efektivitas instruksional media dan pengumpulan umpan balik dari pengguna untuk perbaikan berkelanjutan 
              (continuous quality improvement).
            </p>
            <div class="pie-activities">
              <div class="pie-activity">
                <span class="check-mark">&bull;</span>
                <span>Instrumen rating kepuasan belajar dan efektivitas antarmuka sistem</span>
              </div>
              <div class="pie-activity">
                <span class="check-mark">&bull;</span>
                <span>Analisis distribusi modalitas belajar responden yang tercatat di basis data</span>
              </div>
              <div class="pie-activity">
                <span class="check-mark">&bull;</span>
                <span>Evaluasi formatif pemahaman kompetensi multimedia</span>
              </div>
              <div class="pie-activity">
                <span class="check-mark">&bull;</span>
                <span>Pemanfaatan data untuk iterasi perbaikan konten dan mekanisme permainan</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

// ==================== MARIO VAK ADVENTURE GAME PAGE ====================
function renderMarioGame() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="game-page-container">
      <div class="section-header text-center">
        <span class="section-badge">Media Asesmen Interaktif</span>
        <h1 class="section-title">Petualangan Mario: <span class="gradient-text">Asesmen Gaya Belajar VAK</span></h1>
        <p class="section-subtitle">
          Jelajahi level petualangan, kunjungi seluruh <strong>10 Pos Pertanyaan VAK</strong> di sepanjang lintasan, 
          dan capai bendera kastil untuk mengungkap laporan diagnosis gaya belajar dominan Anda.
        </p>
      </div>

      <!-- Main Game Arcade Frame -->
      <div class="arcade-wrapper">
        <!-- Arcade HUD Header -->
        <div class="arcade-hud">
          <div class="hud-item hud-level">
            <span class="hud-label">LEVEL</span>
            <span id="mqHudLevel" class="hud-val">1 / 5</span>
          </div>
          <div class="hud-item hud-fruits">
            <span class="hud-label">PERTANYAAN VAK</span>
            <span id="mqHudFruits" class="hud-val highlight">0 / 10</span>
          </div>
          <div class="hud-item hud-lives">
            <span class="hud-label">NYAWA</span>
            <span id="mqHudLives" class="hud-val lives-val">❤️❤️❤️</span>
          </div>
          <div class="hud-item hud-score">
            <span class="hud-label">SKOR</span>
            <span id="mqHudScore" class="hud-val">000000</span>
          </div>
          <div class="hud-item hud-timer">
            <span class="hud-label">WAKTU</span>
            <span id="mqHudTimer" class="hud-val">180s</span>
          </div>
          <div class="hud-controls">
            <button type="button" id="mqMuteBtn" class="hud-btn" title="Nyalakan/Matikan Suara">Suara: ON</button>
            <button type="button" id="mqRestartBtn" class="hud-btn" title="Mulai Ulang Level">Mulai Ulang</button>
            <button type="button" id="mqFullscreenBtn" class="hud-btn hud-btn-fullscreen" title="Layar Penuh">Layar Penuh</button>
          </div>
        </div>

        <!-- Canvas Viewport Frame -->
        <div class="arcade-screen" id="arcadeScreen">
          <canvas id="marioCanvas" width="960" height="540"></canvas>

          <!-- Start Screen Overlay (Compact & Fully Visible on all screens) -->
          <div id="marioStartOverlay" class="game-overlay active">
            <div class="game-overlay-content start-box">
              <div class="start-title-badge">PETUALANGAN ASESMEN GAYA BELAJAR VAK</div>
              <h2 class="start-title">SUPER MARIO VAK ADVENTURE</h2>

              <p class="start-desc">
                Jelajahi <strong>1 level petualangan</strong> yang berisi <strong>10 Pos Pertanyaan VAK</strong>! Kumpulkan buah di sepanjang lintasan untuk membuka pertanyaan diagnostik gaya belajar (Visual, Auditori, Kinestetik). Jawab seluruh 10 pertanyaan dan capai bendera kastil untuk melihat hasil analisis gaya belajar Anda.
              </p>

              <!-- Single Level Info -->
              <div class="level-select-section">
                <div class="level-select-header">
                  <span>1 LEVEL &bull; 10 POS ASESMEN VAK</span>
                </div>
                <div class="level-select-grid" id="marioLevelSelectGrid">
                  <button type="button" class="level-btn active" data-level="1" title="Level 1: Petualangan VAK Multimedia" style="flex: 1; max-width: 100%;">
                    <span class="level-btn-num">LEVEL</span>
                    <span class="level-btn-stars">⭐</span>
                    <span class="level-btn-name">Petualangan VAK Multimedia &bull; 10 Pertanyaan</span>
                  </button>
                </div>
              </div>

              <div class="controls-guide">
                <div class="cg-col">
                  <strong>Kontrol Keyboard:</strong>
                  <span><code>[A] / [D] / [Panah]</code> : Gerak Kiri / Kanan</span>
                  <span><code>[Spasi] / [W] / [Atas]</code> : Lompat</span>
                </div>
                <div class="cg-col">
                  <strong>Kontrol Layar Sentuh:</strong>
                  <span>Gunakan tombol virtual di bagian bawah layar</span>
                </div>
              </div>

              <button type="button" id="marioStartBtn" class="btn btn-primary btn-xl start-play-btn">
                Mulai Petualangan &rarr;
              </button>
            </div>
          </div>

          <!-- Interactive VAK Quiz Modal Overlay -->
          <div id="marioQuizModal" class="game-overlay">
            <div class="game-overlay-content quiz-box">
              <div class="mq-header">
                <div class="mq-fruit-badge">
                  <span id="mqFruitIcon" class="mq-fruit-avatar">Pos</span>
                  <div>
                    <div class="mq-fruit-title">Instrumen Gaya Belajar VAK</div>
                    <span id="mqCategory" class="mq-cat-badge">Pos 1 dari 10</span>
                  </div>
                </div>
                <div class="mq-notice">Pilih respon yang paling menggambarkan diri Anda</div>
              </div>

              <div id="mqQuestionText" class="mq-question-text">
                Memuat pertanyaan...
              </div>

              <div id="mqOptionsList" class="mq-options-grid">
                <!-- Option buttons dynamically generated -->
              </div>

              <div id="mqFeedback" class="mq-feedback" style="display: none;"></div>

              <div class="mq-footer">
                <button type="button" id="mqContinueBtn" class="btn btn-primary btn-lg" style="display: none;">
                  Lanjutkan Petualangan &rarr;
                </button>
              </div>
            </div>
          </div>

          <!-- Game Over Modal Overlay -->
          <div id="marioGameOverModal" class="game-overlay">
            <div class="game-overlay-content gameover-box">
              <h2 class="gameover-title">LEVEL GAGAL</h2>
              <p id="mgoReason" class="gameover-reason">Nyawa Anda telah habis!</p>
              <div class="gameover-stats">
                <div class="g-stat-item">
                  <span class="g-stat-label">Skor Eksplorasi</span>
                  <span id="mgoScore" class="g-stat-val">0</span>
                </div>
                <div class="g-stat-item">
                  <span class="g-stat-label">Pertanyaan VAK</span>
                  <span id="mgoFruits" class="g-stat-val">0 / 10</span>
                </div>
              </div>
              <div class="modal-actions">
                <button type="button" id="mgoRestartBtn" class="btn btn-primary btn-lg">
                  Ulangi Level Ini
                </button>
                <a href="#/" class="btn btn-outline btn-lg" data-link>
                  Kembali ke Beranda
                </a>
              </div>
            </div>
          </div>

          <!-- Victory Modal Overlay (Will be populated with level clear / final VAK Result by Game Engine) -->
          <div id="marioVictoryModal" class="game-overlay"></div>
        </div>

        <!-- On-Screen Virtual Touch Controls for Mobile/Tablet -->
        <div class="virtual-arcade-pad" id="virtualArcadePad">
          <div class="dpad-cluster">
            <button type="button" class="v-btn v-btn-left" id="vBtnLeft" aria-label="Gerak Kiri">&larr; Kiri</button>
            <button type="button" class="v-btn v-btn-right" id="vBtnRight" aria-label="Gerak Kanan">Kanan &rarr;</button>
          </div>
          <div class="action-cluster">
            <button type="button" class="v-btn v-btn-jump" id="vBtnJump" aria-label="Lompat">&uarr; LOMPAT</button>
          </div>
        </div>
      </div>

      <!-- Panduan Permainan & Asesmen -->
      <div class="game-info-cards">
        <div class="info-card">
          <div class="info-card-badge">Fitur 01</div>
          <h3>1 Level Lengkap</h3>
          <p>Satu level petualangan komprehensif dengan lintasan panjang berisi rintangan, koin, musuh, dan 10 pos pertanyaan yang tersebar merata di sepanjang jalur.</p>
        </div>
        <div class="info-card">
          <div class="info-card-badge">Fitur 02</div>
          <h3>10 Pertanyaan Diagnostik VAK</h3>
          <p>Kumpulkan buah di setiap pos untuk membuka pertanyaan. Setiap respon yang Anda pilih memetakan modalitas Visual, Auditori, atau Kinestetik secara akurat.</p>
        </div>
        <div class="info-card">
          <div class="info-card-badge">Fitur 03</div>
          <h3>Laporan Lengkap di Kastil Akhir</h3>
          <p>Capai bendera kastil di ujung level untuk mendapatkan diagnosis lengkap gaya belajar dominan beserta rekomendasi strategi belajar multimedia.</p>
        </div>
      </div>
    </div>
  `;

  // Initialize Game Instance
  const canvas = document.getElementById('marioCanvas');
  const screen = document.getElementById('arcadeScreen');
  if (canvas && window.MarioQuizGame) {
    const game = new window.MarioQuizGame(canvas, screen);
    window.currentMarioGame = game;

    // Start button
    const startBtn = document.getElementById('marioStartBtn');
    const startOverlay = document.getElementById('marioStartOverlay');
    if (startBtn) {
      startBtn.onclick = () => {
        if (startOverlay) startOverlay.classList.remove('active');
        game.start(true);
      };
    }

    // Level selector buttons
    const levelBtns = document.querySelectorAll('#marioLevelSelectGrid .level-btn');
    levelBtns.forEach(btn => {
      btn.onclick = () => {
        const lvl = parseInt(btn.dataset.level, 10);
        levelBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        game.setLevel(lvl);
      };
    });

    // Restart in HUD
    const hudRestartBtn = document.getElementById('mqRestartBtn');
    if (hudRestartBtn) {
      hudRestartBtn.onclick = () => {
        if (startOverlay) startOverlay.classList.remove('active');
        game.restartLevel ? game.restartLevel() : (game.initLevel(), game.start(true));
      };
    }

    // Mute button
    const muteBtn = document.getElementById('mqMuteBtn');
    if (muteBtn) {
      muteBtn.onclick = () => {
        game.audio.muted = !game.audio.muted;
        muteBtn.textContent = game.audio.muted ? 'Suara: OFF' : 'Suara: ON';
        muteBtn.classList.toggle('muted', game.audio.muted);
      };
    }

    // Fullscreen button
    const fullscreenBtn = document.getElementById('mqFullscreenBtn');
    const arcadeWrapper = document.querySelector('.arcade-wrapper');
    if (fullscreenBtn && arcadeWrapper) {
      fullscreenBtn.onclick = () => {
        const isFs = !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement);
        if (!isFs) {
          if (arcadeWrapper.requestFullscreen) arcadeWrapper.requestFullscreen();
          else if (arcadeWrapper.webkitRequestFullscreen) arcadeWrapper.webkitRequestFullscreen();
        } else {
          if (document.exitFullscreen) document.exitFullscreen();
          else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
        }
      };
    }

    // Virtual Touch Controls setup
    setupVirtualControls(game);
  }
}

function setupVirtualControls(game) {
  const btnLeft = document.getElementById('vBtnLeft');
  const btnRight = document.getElementById('vBtnRight');
  const btnJump = document.getElementById('vBtnJump');

  if (!btnLeft || !btnRight || !btnJump) return;

  const bindTouch = (elem, key) => {
    const press = (e) => {
      e.preventDefault();
      game.setTouchKey(key, true);
      elem.classList.add('pressed');
    };
    const release = (e) => {
      e.preventDefault();
      game.setTouchKey(key, false);
      elem.classList.remove('pressed');
    };

    elem.addEventListener('touchstart', press, { passive: false });
    elem.addEventListener('touchend', release, { passive: false });
    elem.addEventListener('touchcancel', release, { passive: false });
    elem.addEventListener('mousedown', press);
    elem.addEventListener('mouseup', release);
    elem.addEventListener('mouseleave', release);
  };

  bindTouch(btnLeft, 'left');
  bindTouch(btnRight, 'right');
  bindTouch(btnJump, 'jump');
}

// ==================== UTILITIES ====================
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function showToast(message, type = 'info') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(30px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
  window.addEventListener('hashchange', router);
  router();

  // Mobile nav toggle
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      navToggle.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        navToggle.classList.remove('active');
      });
    });
  }

  // Navbar scroll effect
  window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (navbar) {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
  });
});
