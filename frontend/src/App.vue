<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';

const questions = ref([]);
const currentIndex = ref(0);
const score = ref(0);
const selectedAnswer = ref(null);
const timeLeft = ref(30);
const quizCompleted = ref(false);
const feedback = ref({ text: '', color: '' });
let timerInterval = null;

// Charger les questions depuis le Backend au démarrage
onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/questions');
    questions.value = response.data;
    startTimer();
  } catch (error) {
    console.error("Erreur de connexion au serveur :", error);
  }
});

const currentQuestion = computed(() => questions.value[currentIndex.value]);

const startTimer = () => {
  clearInterval(timerInterval);
  timeLeft.value = 30;
  timerInterval = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--;
    } else {
      submitAnswer(); // Valide automatiquement si le temps est écoulé
    }
  }, 1000);
};

const submitAnswer = () => {
  if (!selectedAnswer.value && timeLeft.value > 0) {
    alert("Please select a response!");
    return;
  }

  clearInterval(timerInterval);

  // Vérification de la réponse
  if (selectedAnswer.value === currentQuestion.value.correctAnswer) {
    score.value++;
    feedback.value = { text: "Correct Answer!", color: "green" };
  } else {
    feedback.value = { text: "Wrong Answer...", color: "red" };
  }

  // Passer à la suivante après 1.5s
  setTimeout(() => {
    feedback.value = { text: '', color: '' };
    selectedAnswer.value = null;

    if (currentIndex.value < questions.value.length - 1) {
      currentIndex.value++;
      startTimer();
    } else {
      quizCompleted.value = true;
    }
  }, 1500);
};

const restartQuiz = () => {
  currentIndex.value = 0;
  score.value = 0;
  quizCompleted.value = false;
  selectedAnswer.value = null;
  startTimer();
};
</script>

<template>
  <div class="quiz-page">
    <div class="header-container">
      <h1>Welcome to the Descendants Quiz!</h1>
      <h2>Test your knowledge of the Descendants universe!</h2>
      <h3>Glad you chose my quiz!</h3>
      <h4>There are {{ questions.length }} questions in this quiz!</h4>
    </div>

    <div class="container">
      <div v-if="!quizFinished && currentQuestion">
        <div class="timer">Time remaining: {{ timeLeft }} seconds</div>

        <div class="quiz-box">
          <div class="question">{{ currentQuestion.question }}</div>

          <div class="choices">
            <div v-for="(option, index) in currentQuestion.options" :key="index" class="choice">
              <label>
                <input
                    type="radio"
                    :value="option"
                    v-model="selectedAnswer"
                    name="quiz-option"
                />
                {{ option }}
              </label>
            </div>
          </div>

          <div v-if="feedback" :class="['result-msg', feedbackType]">
            {{ feedback }}
          </div>

          <button @click="submitAnswer" :disabled="feedback !== ''">Submit Answer</button>
        </div>
      </div>

      <div v-else-if="quizFinished" class="final-results">
        <h2>Quiz Completed!</h2>
        <div class="score">Your Score: {{ score }} / {{ questions.length }}</div>
        <button @click="restartQuiz">Restart Quiz</button>
      </div>
    </div>
  </div>
</template>

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

<style>
body {
  margin: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-image: url('https://www.wallpaperuse.com/wallp/42-421718_m.jpg');
  background-size: cover;
  background-attachment: fixed;
  background-position: center;
}

.quiz-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
}

.header-container h1, h2, h3, h4 {
  text-align: center;
  font-weight: bold;
  background: linear-gradient(to right, #ff0000, #2b00ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 10px 0;
}

h1 { font-size: 3em; }
h2 { font-size: 2em; }

.container {
  width: 100%;
  max-width: 800px;
  background: rgba(0, 0, 0, 0.7);
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
  color: white;
  margin-top: 20px;
}

.timer {
  font-size: 1.5em;
  text-align: center;
  color: #ffeb3b;
  margin-bottom: 20px;
}

.question {
  font-size: 1.8em;
  font-weight: bold;
  text-align: center;
  margin-bottom: 30px;
  background: linear-gradient(to right, #ff4b2b, #ff416c);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
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
  border-radius: 8px;
  transition: 0.3s;
  font-size: 1.2em;
}

.choice:hover {
  background: rgba(255, 255, 255, 0.2);
}

.choice label {
  cursor: pointer;
  display: block;
}

input[type="radio"] {
  margin-right: 15px;
  transform: scale(1.3);
}

button {
  display: block;
  width: 200px;
  margin: 0 auto;
  padding: 12px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1.1em;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s;
}

button:hover:not(:disabled) {
  background-color: #45a049;
}

button:disabled {
  background-color: #888;
  cursor: not-allowed;
}

.result-msg {
  text-align: center;
  font-size: 1.4em;
  margin-bottom: 20px;
  padding: 10px;
  border-radius: 5px;
}

.success { color: #4caf50; font-weight: bold; }
.error { color: #f44336; font-weight: bold; }

.final-results {
  text-align: center;
}

.score {
  font-size: 3em;
  margin: 20px 0;
  color: #fff;
}
</style>
