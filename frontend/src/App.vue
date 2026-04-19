<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';

// --- ÉTATS DU QUIZ ---
const questions = ref([]);
const currentIndex = ref(0);
const score = ref(0);
const selectedAnswer = ref(null);
const timeLeft = ref(30);
const quizFinished = ref(false);
const feedback = ref('');
const feedbackType = ref('');
let timerInterval = null;

// --- LOGIQUE AUDIO ---
// Le chemin '/' pointe directement vers le dossier 'public'
const audio = new Audio('/music.mp3');
audio.loop = true;
audio.volume = 0.4;
const isMuted = ref(false);

const toggleMute = () => {
  isMuted.value = !isMuted.value;
  audio.muted = isMuted.value;
};

// Fonction pour débloquer l'audio (Contourne la restriction navigateur)
const unlockAudio = () => {
  if (audio.paused && !isMuted.value) {
    audio.play().catch(e => {
      console.log("Lecture auto bloquée, en attente d'un clic...");
    });
  }
};

// --- LOGIQUE DU QUIZ ---
const currentQuestion = computed(() => questions.value[currentIndex.value]);

const startTimer = () => {
  timeLeft.value = 30;
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--;
    } else {
      handleTimeout();
    }
  }, 1000);
};

const handleTimeout = () => {
  clearInterval(timerInterval);
  feedback.value = "Time's up!";
  feedbackType.value = 'error';
  setTimeout(nextQuestion, 2000);
};

const submitAnswer = () => {
  if (!selectedAnswer.value) {
    alert("Please select an answer!");
    return;
  }

  // On tente de lancer la musique au premier clic sur "Submit" au cas où
  unlockAudio();

  clearInterval(timerInterval);

  if (selectedAnswer.value === currentQuestion.value.correctAnswer) {
    score.value++;
    feedback.value = "Correct Answer!";
    feedbackType.value = 'success';
  } else {
    feedback.value = `Wrong! The correct answer was: ${currentQuestion.value.correctAnswer}`;
    feedbackType.value = 'error';
  }

  setTimeout(nextQuestion, 2000);
};

const nextQuestion = () => {
  feedback.value = '';
  selectedAnswer.value = null;
  if (currentIndex.value < questions.value.length - 1) {
    currentIndex.value++;
    startTimer();
  } else {
    quizFinished.value = true;
    clearInterval(timerInterval);
  }
};

const restartQuiz = () => {
  currentIndex.value = 0;
  score.value = 0;
  quizFinished.value = false;
  startTimer();
};

onMounted(async () => {
  // 1. Récupération des questions sur le backend
  try {
    const response = await axios.get('http://localhost:3000/api/questions');
    questions.value = response.data;
    startTimer();
  } catch (error) {
    console.error("Erreur : Le serveur Backend (port 3000) ne répond pas !");
  }

  // 2. Débloquer l'audio dès que l'utilisateur clique n'importe où sur la page
  window.addEventListener('click', unlockAudio, { once: true });
});
</script>

<template>
  <div class="quiz-page">
    <div class="audio-controls">
      <button @click="toggleMute" class="mute-btn" title="Couper/Activer le son">
        {{ isMuted ? '🔇' : '🔊' }}
      </button>
    </div>

    <div class="header-container">
      <h1>Descendants Quiz</h1>
      <h4 v-if="!quizFinished && questions.length">
        Question {{ currentIndex + 1 }} sur {{ questions.length }}
      </h4>
    </div>

    <div class="container">
      <div v-if="questions.length === 0" class="status-msg">
        Connexion au serveur en cours...
      </div>

      <div v-else-if="!quizFinished && currentQuestion">
        <div class="timer">Temps restant : {{ timeLeft }}s</div>

        <div class="quiz-box">
          <div class="question">{{ currentQuestion.question }}</div>

          <div class="choices">
            <div v-for="(option, index) in currentQuestion.options" :key="index" class="choice">
              <label>
                <input type="radio" :value="option" v-model="selectedAnswer" />
                <span>{{ option }}</span>
              </label>
            </div>
          </div>

          <div v-if="feedback" :class="['result-msg', feedbackType]">
            {{ feedback }}
          </div>

          <button @click="submitAnswer" :disabled="feedback !== ''" class="btn-submit">
            Valider la réponse
          </button>
        </div>
      </div>

      <div v-else-if="quizFinished" class="final-results">
        <h2>Quiz terminé !</h2>
        <div class="score-display">{{ score }} / {{ questions.length }}</div>
        <button @click="restartQuiz" class="btn-submit">Recommencer</button>
      </div>
    </div>
  </div>
</template>

<style>
/* Reset global */
body, html {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.quiz-page {
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  /* Fond d'écran */
  background-image: url('https://www.wallpaperuse.com/wallp/42-421718_m.jpg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
}

.audio-controls {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 100;
}

.mute-btn {
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: 2px solid #ffffff;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  cursor: pointer;
  font-size: 1.3em;
  transition: transform 0.2s;
}
.mute-btn:hover { transform: scale(1.1); }

.header-container h1 {
  font-size: 4em;
  font-weight: 900;
  background: linear-gradient(to right, #ff0000, #2b00ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
  filter: drop-shadow(2px 2px 5px rgba(0,0,0,0.5));
}

.header-container h4 { color: white; text-align: center; font-size: 1.2em; }

.container {
  width: 100%;
  max-width: 600px;
  background: rgba(0, 0, 0, 0.85);
  padding: 30px;
  border-radius: 20px;
  margin-top: 20px;
  color: white;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  backdrop-filter: blur(10px);
}

.timer { color: #ffeb3b; font-size: 1.6em; text-align: center; margin-bottom: 20px; font-weight: bold; }
.question { font-size: 1.8em; text-align: center; margin-bottom: 25px; line-height: 1.3; }

.choices { display: flex; flex-direction: column; gap: 15px; }
.choice {
  background: rgba(255, 255, 255, 0.1);
  padding: 15px;
  border-radius: 12px;
  transition: background 0.3s, transform 0.2s;
  border: 1px solid rgba(255,255,255,0.1);
}
.choice:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateX(5px);
}

.choice label { display: flex; align-items: center; cursor: pointer; width: 100%; }
input[type="radio"] { margin-right: 15px; transform: scale(1.5); cursor: pointer; }

.btn-submit {
  display: block; width: 100%; max-width: 280px; margin: 30px auto 0;
  padding: 15px; border-radius: 50px; border: none;
  background: linear-gradient(45deg, #4caf50, #2e7d32);
  color: white; font-size: 1.2em; font-weight: bold; cursor: pointer;
  transition: 0.3s;
}
.btn-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(76, 175, 80, 0.4); }
.btn-submit:disabled { background: #555; cursor: not-allowed; opacity: 0.7; }

.result-msg { text-align: center; margin-top: 20px; font-weight: bold; font-size: 1.2em; padding: 10px; border-radius: 10px; }
.success { color: #4caf50; background: rgba(76, 175, 80, 0.1); }
.error { color: #f44336; background: rgba(244, 67, 54, 0.1); }

.score-display { font-size: 5em; text-align: center; color: #ffeb3b; margin: 20px 0; font-weight: bold; }
.status-msg { text-align: center; font-style: italic; color: #888; }
</style>