<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';

const questions = ref([]);
const currentIndex = ref(0);
const score = ref(0);
const selectedAnswer = ref(null);
const timeLeft = ref(30);
const quizFinished = ref(false);
const feedback = ref('');
const feedbackType = ref('');
let timerInterval = null;

const currentQuestion = computed(() => questions.value[currentIndex.value]);

const startTimer = () => {
  timeLeft.value = 30;
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--;
    } else {
      feedback.value = "Time's up!";
      feedbackType.value = 'error';
      setTimeout(nextQuestion, 2000);
    }
  }, 1000);
};

const submitAnswer = () => {
  if (!selectedAnswer.value) {
    alert("Please select an answer!");
    return;
  }
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
    <div class="header-container">
      <h1>Descendants Quiz</h1>
      <h4>Question {{ currentIndex + 1 }} / {{ questions.length }}</h4>
    </div>
    <div class="container">
      <div v-if="!quizFinished && currentQuestion">
        <div class="timer">Time: {{ timeLeft }}s</div>
        <div class="quiz-box">
          <div class="question">{{ currentQuestion.question }}</div>
          <div class="choices">
            <div v-for="(option, index) in currentQuestion.options" :key="index" class="choice">
              <label><input type="radio" :value="option" v-model="selectedAnswer" /> {{ option }}</label>
            </div>
          </div>
          <div v-if="feedback" :class="['result-msg', feedbackType]">{{ feedback }}</div>
          <button @click="submitAnswer" :disabled="feedback !== ''">Submit</button>
        </div>
      </div>
      <div v-else-if="quizFinished" class="final-results">
        <h2>Finished!</h2>
        <div class="score">Score: {{ score }} / {{ questions.length }}</div>
        <button @click="restartQuiz">Restart</button>
      </div>
    </div>
  </div>
</template>

<style>
/* Reset de base pour que le fond prenne tout l'écran */
body, html {
  margin: 0;
  padding: 0;
  height: 100%;
}

.quiz-page {
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;

  /* --- AJOUT DU FOND D'ÉCRAN ICI --- */
  background-image: url('https://www.wallpaperuse.com/wallp/42-421718_m.jpg');
  background-size: cover; /* L'image couvre tout l'écran sans se déformer */
  background-position: center; /* Centre l'image */
  background-repeat: no-repeat; /* Ne pas répéter l'image */
  background-attachment: fixed; /* Le fond reste fixe quand on scrolle (optionnel mais joli) */
  /* ---------------------------------- */
}

/* Le reste de ton CSS pour que le texte soit lisible sur le fond */
.header-container h1, .header-container h4 {
  text-align: center;
  background: linear-gradient(to right, #ff0000, #2b00ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 10px 0;
}

h1 { font-size: 3em; font-weight: bold; }

.container {
  width: 100%;
  max-width: 800px;
  background: rgba(0, 0, 0, 0.7); /* Fond semi-transparent pour le quiz box */
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
  color: white;
  margin-top: 20px;
}

.timer { font-size: 1.5em; text-align: center; color: #ffeb3b; margin-bottom: 20px; }
.question { font-size: 1.8em; font-weight: bold; text-align: center; margin-bottom: 30px; color: white; }
.choices { display: flex; flex-direction: column; gap: 15px; margin-bottom: 30px; }
.choice { background: rgba(255, 255, 255, 0.1); padding: 15px; border-radius: 8px; font-size: 1.2em; }
.choice:hover { background: rgba(255, 255, 255, 0.2); }
input[type="radio"] { margin-right: 15px; transform: scale(1.3); }

button {
  display: block; width: 200px; margin: 0 auto; padding: 12px;
  background-color: #4caf50; color: white; border: none; border-radius: 5px;
  font-size: 1.1em; font-weight: bold; cursor: pointer;
}
button:hover:not(:disabled) { background-color: #45a049; }
button:disabled { background-color: #888; cursor: not-allowed; }
.result-msg { text-align: center; font-size: 1.4em; margin-bottom: 20px; }
.success { color: #4caf50; }
.error { color: #f44336; }
.final-results { text-align: center; }
.score { font-size: 3em; margin: 20px 0; }
</style>