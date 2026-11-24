const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Load data
const materials = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'materials.json'), 'utf8'));
const quizData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'quiz.json'), 'utf8'));
const multimediaQuizData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'multimedia-quiz.json'), 'utf8'));

// In-memory storage for evaluations
let evaluations = [];

// ==================== API ROUTES ====================

// Helper to get fresh materials data
function getMaterials() {
  return JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'materials.json'), 'utf8'));
}

// GET /api/materials — Get all materials, optionally filtered by learning style
app.get('/api/materials', (req, res) => {
  const currentMaterials = getMaterials();
  const { style, category } = req.query;
  let result = currentMaterials.map(m => ({
    id: m.id,
    title: m.title,
    category: m.category,
    description: m.description,
    content: style ? m.content[style.toLowerCase()] : m.content
  }));

  if (category) {
    result = result.filter(m => m.category.toLowerCase() === category.toLowerCase());
  }

  res.json({ success: true, data: result });
});

// GET /api/materials/:id — Get single material by ID
app.get('/api/materials/:id', (req, res) => {
  const currentMaterials = getMaterials();
  const material = currentMaterials.find(m => m.id === parseInt(req.params.id));
  if (!material) {
    return res.status(404).json({ success: false, message: 'Materi tidak ditemukan' });
  }
  res.json({ success: true, data: material });
});

// GET /api/quiz — Get quiz questions
app.get('/api/quiz', (req, res) => {
  res.json({ success: true, data: quizData.questions });
});

// GET /api/game/questions — Get VAK diagnostic questions for Mario Game
app.get('/api/game/questions', (req, res) => {
  // Always return the 10 sequential VAK assessment questions
  const freshQuizData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'quiz.json'), 'utf8'));
  res.json({ success: true, data: freshQuizData.questions });
});

// POST /api/quiz/submit — Submit quiz answers and get VAK result
app.post('/api/quiz/submit', (req, res) => {
  const { answers } = req.body;

  if (!answers || !Array.isArray(answers)) {
    return res.status(400).json({ success: false, message: 'Format jawaban tidak valid' });
  }

  // Count V, A, K answers
  const counts = { V: 0, A: 0, K: 0 };
  answers.forEach(answer => {
    if (counts.hasOwnProperty(answer.type)) {
      counts[answer.type]++;
    }
  });

  // Determine dominant style
  const total = counts.V + counts.A + counts.K;
  const percentages = {
    V: Math.round((counts.V / total) * 100),
    A: Math.round((counts.A / total) * 100),
    K: Math.round((counts.K / total) * 100)
  };

  const dominant = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);

  const styleNames = {
    V: 'Visual',
    A: 'Auditory',
    K: 'Kinesthetic'
  };

  const styleDescriptions = {
    V: 'Kamu belajar paling efektif melalui gambar, diagram, video, dan representasi visual lainnya. Kamu cenderung mudah mengingat informasi yang disajikan dalam bentuk grafis.',
    A: 'Kamu belajar paling efektif melalui pendengaran — mendengarkan penjelasan, diskusi, dan audio. Kamu mudah mengingat informasi yang disampaikan secara verbal.',
    K: 'Kamu belajar paling efektif melalui praktik langsung, eksperimen, dan pengalaman hands-on. Kamu perlu aktif bergerak dan mencoba untuk memahami konsep.'
  };

  const styleTips = {
    V: [
      'Gunakan mind map dan diagram untuk merangkum materi',
      'Tonton video tutorial saat belajar software baru',
      'Buat catatan berwarna dengan highlighter',
      'Gunakan infografis untuk mengingat proses',
      'Visualisasikan konsep dalam bentuk gambar'
    ],
    A: [
      'Dengarkan podcast atau rekaman materi pelajaran',
      'Diskusikan materi dengan teman sekelompok',
      'Baca catatan dengan suara keras saat belajar',
      'Gunakan mnemonik dan lagu untuk mengingat',
      'Rekam penjelasan guru dan dengarkan ulang'
    ],
    K: [
      'Langsung praktikkan di software saat belajar',
      'Buat proyek mini untuk setiap topik baru',
      'Gunakan flashcard yang bisa dipegang dan dibolak-balik',
      'Belajar sambil berjalan atau bergerak',
      'Ikuti workshop atau kelas praktik'
    ]
  };

  res.json({
    success: true,
    data: {
      counts,
      percentages,
      dominant,
      dominantName: styleNames[dominant],
      description: styleDescriptions[dominant],
      tips: styleTips[dominant]
    }
  });
});

// GET /api/evaluations — Get all evaluations
app.get('/api/evaluations', (req, res) => {
  const stats = {
    total: evaluations.length,
    averageRating: evaluations.length > 0
      ? (evaluations.reduce((sum, e) => sum + e.rating, 0) / evaluations.length).toFixed(1)
      : 0,
    styleDistribution: {
      V: evaluations.filter(e => e.learningStyle === 'V').length,
      A: evaluations.filter(e => e.learningStyle === 'A').length,
      K: evaluations.filter(e => e.learningStyle === 'K').length
    },
    recentEvaluations: evaluations.slice(-10).reverse()
  };
  res.json({ success: true, data: stats });
});

// POST /api/evaluations — Submit an evaluation
app.post('/api/evaluations', (req, res) => {
  const { name, learningStyle, rating, feedback, materialId } = req.body;

  if (!name || !rating) {
    return res.status(400).json({ success: false, message: 'Nama dan rating wajib diisi' });
  }

  const evaluation = {
    id: evaluations.length + 1,
    name,
    learningStyle: learningStyle || 'unknown',
    rating: parseInt(rating),
    feedback: feedback || '',
    materialId: materialId || null,
    createdAt: new Date().toISOString()
  };

  evaluations.push(evaluation);
  res.json({ success: true, data: evaluation, message: 'Evaluasi berhasil disimpan!' });
});

// Catch-all: serve index.html for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`\n🎓 ══════════════════════════════════════════════════`);
  console.log(`   Website Pembelajaran Multimedia VAK-PIE`);
  console.log(`   Server berjalan di http://localhost:${PORT}`);
  console.log(`══════════════════════════════════════════════════════\n`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n⚠️ Port ${PORT} sedang digunakan oleh proses lain.`);
    console.error(`   Silakan tutup proses lain di port ${PORT} atau gunakan port lain.\n`);
  } else {
    console.error('Server error:', err);
  }
});
