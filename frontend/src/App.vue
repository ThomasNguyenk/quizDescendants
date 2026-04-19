<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';

// --- VARIABLES D'ÉTAT ---
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
// Musique orchestrale épique libre de droits
const audio = new Audio('https://www.chosic.com/wp-content/uploads/2021/07/The-Epic-Hero-Epic-Music.mp3');
audio.loop = true;
audio.volume = 0.3; // Volume doux à 30%
const isMuted = ref(false);

const playMusic = () => {
  if (!isMuted.value) {
    audio.play().catch(e => console.log("L'audio attend une interaction utilisateur."));
  }
};

const toggleMute = () => {
  isMuted.value = !isMuted.value;
  audio.muted = isMuted.value;
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

  // On lance la musique au premier clic si elle ne s'est pas lancée
  playMusic();

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
  try {
    const response = await axios.get('http://localhost:3000/api/questions');
    questions.value = response.data;
    startTimer();
  } catch (error) {
    console.error("Error fetching quiz data:", error);
  }
});
</script>

<template>
  <div class="quiz-page">
    <div class="audio-controls">
      <button @click="toggleMute" class="mute-btn">
        {{ isMuted ? '🔇' : '🔊' }}
      </button>
    </div>

    <div class="header-container">
      <h1>Descendants Quiz</h1>
      <h4 v-if="!quizFinished">Question {{ currentIndex + 1 }} / {{ questions.length }}</h4>
    </div>

    <div class="container">
      <div v-if="!quizFinished && currentQuestion">
        <div class="timer">Time Remaining: {{ timeLeft }}s</div>

        <div class="quiz-box">
          <div class="question">{{ currentQuestion.question }}</div>

          <div class="choices">
            <div v-for="(option, index) in currentQuestion.options" :key="index" class="choice">
              <label>
                <input type="radio" :value="option" v-model="selectedAnswer" />
                {{ option }}
              </label>
            </div>
          </div>

          <div v-if="feedback" :class="['result-msg', feedbackType]">
            {{ feedback }}
          </div>

          <button @click="submitAnswer" :disabled="feedback !== ''" class="btn-submit">
            Submit Answer
          </button>
        </div>
      </div>

      <div v-else-if="quizFinished" class="final-results">
        <h2>Quiz Completed!</h2>
        <div class="score-display">Your Score: {{ score }} / {{ questions.length }}</div>
        <button @click="restartQuiz" class="btn-submit">Restart Quiz</button>
      </div>
    </div>
  </div>
</template>

<style>
/* Reset */
body, html {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: 'Arial', sans-serif;
}

.quiz-page {
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  background-image: url('https://www.wallpaperuse.com/wallp/42-421718_m.jpg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
}

.audio-controls {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 10;
}

.mute-btn {
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border: 2px solid #fff;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  font-size: 1.5rem;
  cursor: pointer;
  transition: transform 0.2s;
}

.mute-btn:hover { transform: scale(1.1); }

.header-container h1 {
  font-size: 4em;
  font-weight: bold;
  background: linear-gradient(to right, #ff0000, #2b00ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0;
}

.header-container h4 {
  color: white;
  text-align: center;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
}

.container {
  width: 100%;
  max-width: 700px;
  background: rgba(0, 0, 0, 0.75);
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 0 30px rgba(255, 255, 255, 0.15);
  color: white;
  margin-top: 20px;
  backdrop-filter: blur(5px);
}

.timer {
  font-size: 1.8em;
  text-align: center;
  color: #ffeb3b;
  margin-bottom: 25px;
  font-weight: bold;
}

.question {
  font-size: 2em;
  margin-bottom: 30px;
  text-align: center;
  line-height: 1.2;
}

.choices {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 30px;
}

.choice {
  background: rgba(255, 255, 255, 0.1);
  padding: 15px;
  border-radius: 10px;
  transition: background 0.3s;
  cursor: pointer;
}

.choice:hover { background: rgba(255, 255, 255, 0.2); }

.choice label {
  cursor: pointer;
  display: flex;
  align-items: center;
  width: 100%;
}

input[type="radio"] {
  margin-right: 15px;
  transform: scale(1.5);
}

.btn-submit {
  display: block;
  width: 250px;
  margin: 0 auto;
  padding: 15px;
  background: linear-gradient(45deg, #4caf50, #2e7d32);
  color: white;
  border: none;
  border-radius: 50px;
  font-size: 1.2em;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(0,0,0,0.3);
}

.btn-submit:disabled {
  background: #555;
  cursor: not-allowed;
}

.result-msg {
  text-align: center;
  font-size: 1.5em;
  margin-bottom: 20px;
  padding: 10px;
  border-radius: 10px;
}

.success { color: #4caf50; background: rgba(76, 175, 80, 0.1); }
.error { color: #f44336; background: rgba(244, 67, 54, 0.1); }

.score-display {
  font-size: 4em;
  text-align: center;
  margin: 30px 0;
  color: #ffeb3b;
}
</style>