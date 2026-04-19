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
/* Garde ton CSS ici (le même que précédemment) */
.quiz-page { min-height: 100vh; display: flex; flex-direction: column; align-items: center; background: #2c3e50; color: white; }
.container { background: rgba(0,0,0,0.5); padding: 20px; border-radius: 10px; margin-top: 20px; width: 80%; }
.choice { margin: 10px 0; padding: 10px; background: rgba(255,255,255,0.1); border-radius: 5px; }
.success { color: #4caf50; }
.error { color: #f44336; }
</style>