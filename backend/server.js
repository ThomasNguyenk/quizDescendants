const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const quizData = [
    { id: 1, question: "What is the name of the kingdom where the story of Descendants mainly takes place?", options: ["Auradon", "The Isle of the Lost", "The Enchanted Kingdom", "Neverland"], correctAnswer: "Auradon" },
    { id: 2, question: "Who is Maleficent's daughter in Descendants?", options: ["Carlos", "Jay", "Evie", "Mal"], correctAnswer: "Mal" },
    { id: 3, question: "What is the name of the Snow Queen's son in Descendants?", options: ["Chad Charming", "Ben", "Doug", "Harry Hook"], correctAnswer: "Chad Charming" },
    { id: 4, question: "Who is Carlos's mother in Descendants?", options: ["Jafar", "Cruella de Vil", "Captain Hook", "Maleficent"], correctAnswer: "Cruella de Vil" },
    { id: 5, question: "What is the name of Captain Hook's son in Descendants?", options: ["Harry Hook", "Gil", "Uma", "Jay"], correctAnswer: "Harry Hook" },
    { id: 6, question: "Who is the Evil Queen's daughter in Descendants?", options: ["Evie", "Mal", "Uma", "Jane"], correctAnswer: "Evie" },
    { id: 7, question: "What is the name of Belle and Prince Adam's (The Beast) son in Descendants?", options: ["Ben", "Chad", "Doug", "Carlos"], correctAnswer: "Ben" },
    { id: 8, question: "Who is Ursula's daughter in Descendants?", options: ["Uma", "Evie", "Mal", "Jane"], correctAnswer: "Uma" },
    { id: 9, question: "What is the name of Carlos's dog in Descendants?", options: ["Dude", "Max", "Pluto", "Pongo"], correctAnswer: "Dude" },
    { id: 10, question: "Who is Jafar's son in Descendants?", options: ["Jay", "Carlos", "Harry Hook", "Gil"], correctAnswer: "Jay" },
    { id: 11, question: "What is the name of the kingdom where the children of the villains live?", options: ["The Isle of the Lost", "Auradon", "The Enchanted Kingdom", "Neverland"], correctAnswer: "The Isle of the Lost" },
    { id: 12, question: "Who is Cinderella's daughter in Descendants?", options: ["Audrey", "Jane", "Evie", "Mal"], correctAnswer: "Audrey" },
    { id: 13, question: "What is the name of Mr. and Mrs. Darling's son in Descendants?", options: ["Doug", "Chad", "Ben", "Carlos"], correctAnswer: "Doug" },
    { id: 14, question: "Who is Tinker Bell's daughter in Descendants?", options: ["Jane", "Audrey", "Evie", "Mal"], correctAnswer: "Jane" },
    { id: 15, question: "What is the name of the Queen of Hearts' son in Descendants?", options: ["Chad Charming", "Ben", "Doug", "Carlos"], correctAnswer: "Chad Charming" },
    { id: 16, question: "Who is the Wicked Witch of the West's daughter in Descendants?", options: ["Dizzy Tremaine", "Evie", "Mal", "Uma"], correctAnswer: "Dizzy Tremaine" },
    { id: 17, question: "What is the name of Geppetto's son in Descendants?", options: ["Ben", "Chad", "Doug", "Carlos"], correctAnswer: "Doug" },
    { id: 18, question: "Who is the Snow Queen's daughter in Descendants?", options: ["Audrey", "Jane", "Evie", "Mal"], correctAnswer: "Evie" },
    { id: 19, question: "What is the name of Queen Grimhilde's son in Descendants?", options: ["Chad Charming", "Ben", "Doug", "Carlos"], correctAnswer: "Chad Charming" },
    { id: 20, question: "Who is the Queen of Hearts' daughter in Descendants?", options: ["Red", "Jane", "Evie", "Mal"], correctAnswer: "Red" },
    { id: 21, question: "What is the name of Uma's ship in Descendants?", options: ["The Black Pearl", "The Ghost Ship", "The Revenge", "The Jolly Roger"], correctAnswer: "The Revenge" },
    { id: 22, question: "What is the name of the iconic song from Descendants 2?", options: ["Ways to Be Wicked", "Chillin' Like a Villain", "It's Goin' Down", "Rotten to the Core"], correctAnswer: "Ways to Be Wicked" },
    { id: 23, question: "What is the name of the kingdom where Ben is crowned king in Descendants 2?", options: ["Auradon", "The Isle of the Lost", "The Enchanted Kingdom", "Neverland"], correctAnswer: "Auradon" },
    { id: 24, question: "Who is the leader of the pirates in Descendants 2?", options: ["Harry Hook", "Uma", "Gil", "Captain Hook"], correctAnswer: "Uma" },
    { id: 25, question: "What is the name of the potion Mal uses to hypnotize Ben?", options: ["Love Potion", "Sleeping Potion", "Truth Potion", "Forgetfulness Potion"], correctAnswer: "Love Potion" },
    { id: 26, question: "What is the name of the ball held in Auradon in Descendants?", options: ["The Star Ball", "The Royal Ball", "The Enchanted Ball", "The Villains' Ball"], correctAnswer: "The Royal Ball" },
    { id: 27, question: "Who is Ben's best friend in Descendants?", options: ["Chad Charming", "Doug", "Jay", "Carlos"], correctAnswer: "Doug" },
    { id: 28, question: "What is the name of the opening song of Descendants?", options: ["Rotten to the Core", "Ways to Be Wicked", "Chillin' Like a Villain", "If Only"], correctAnswer: "Rotten to the Core" },
    { id: 29, question: "What is the name of Mal's mother in Descendants?", options: ["Maleficent", "Ursula", "Cruella de Vil", "The Evil Queen"], correctAnswer: "Maleficent" }
];

app.get('/api/questions', (req, res) => {
    res.json(quizData);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});