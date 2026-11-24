const fs = require('fs');

const orig = fs.readFileSync('public/js/mario-game.js', 'utf8');

// We will construct the 1-Level 10-Question Mario Game Engine
// maintaining all visual features (Padang Rumput graphics, sound effects, Mario sprite, Goombas, coins, bricks, flagpole, castle)
// with instant resume after answering.

const quizData = JSON.parse(fs.readFileSync('data/quiz.json', 'utf8'));
const vakQuestionsStr = JSON.stringify(quizData.questions, null, 2);

console.log('Quiz data questions count:', quizData.questions.length);
