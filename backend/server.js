const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const quizData = [
    { question: "1. What is the name of the kingdom where the story takes place?", options: ["Auradon", "The Isle of the Lost", "The Enchanted Kingdom", "Neverland"], correctAnswer: "Auradon" },
    { question: "2. Who is Maleficent's daughter in Descendants?", options: ["Carlos", "Jay", "Evie", "Mal"], correctAnswer: "Mal" },
    { question: "3. What is the name of the Snow Queen's son in Descendants?", options: ["Chad Charming", "Ben", "Doug", "Harry Hook"], correctAnswer: "Chad Charming" },
    { question: "4. Who is Carlos's mother in Descendants?", options: ["Jafar", "Cruella de Vil", "Captain Hook", "Maleficent"], correctAnswer: "Cruella de Vil" },
    { question: "5. What is the name of Captain Hook's son in Descendants?", options: ["Harry Hook", "Gil", "Uma", "Jay"], correctAnswer: "Harry Hook" },
    { question: "6. Who is the Evil Queen's daughter in Descendants?", options: ["Evie", "Mal", "Uma", "Jane"], correctAnswer: "Evie" },
    { question: "7. What is the name of Belle and Prince Adam's (The Beast) son in Descendants?", options: ["Ben", "Chad", "Doug", "Carlos"], correctAnswer: "Ben" },
    { question: "8. Who is Ursula's daughter in Descendants?", options: ["Uma", "Evie", "Mal", "Jane"], correctAnswer: "Uma" },
    { question: "9. What is the name of Carlos's dog in Descendants?", options: ["Dude", "Max", "Pluto", "Pongo"], correctAnswer: "Dude" },
    { question: "10. Who is Jafar's son in Descendants?", options: ["Jay", "Carlos", "Harry Hook", "Gil"], correctAnswer: "Jay" },
    { question: "11. What is the name of the kingdom where the children of the villains live?", options: ["The Isle of the Lost", "Auradon", "The Enchanted Kingdom", "Neverland"], correctAnswer: "The Isle of the Lost" },
    { question: "12. Who is Cinderella's daughter in Descendants?", options: ["Audrey", "Jane", "Evie", "Mal"], correctAnswer: "Audrey" },
    { question: "13. What is the name of Mr. and Mrs. Darling's son?", options: ["Doug", "Chad", "Ben", "Carlos"], correctAnswer: "Doug" },
    { question: "14. Who is Tinker Bell's daughter in Descendants?", options: ["Jane", "Audrey", "Evie", "Mal"], correctAnswer: "Jane" },
    { question: "15. What is the name of the Queen of Hearts' son?", options: ["Chad Charming", "Ben", "Doug", "Carlos"], correctAnswer: "Chad Charming" },
    { question: "16. Who is the Wicked Witch of the West's daughter?", options: ["Dizzy Tremaine", "Evie", "Mal", "Uma"], correctAnswer: "Dizzy Tremaine" },
    { question: "17. What is the name of Geppetto's son in Descendants?", options: ["Ben", "Chad", "Doug", "Carlos"], correctAnswer: "Doug" },
    { question: "18. Who is the Snow Queen's daughter in Descendants?", options: ["Audrey", "Jane", "Evie", "Mal"], correctAnswer: "Evie" },
    { question: "19. What is the name of Queen Grimhilde's son?", options: ["Chad Charming", "Ben", "Doug", "Carlos"], correctAnswer: "Chad Charming" },
    { question: "20. Who is the Queen of Hearts' daughter in Descendants?", options: ["Red", "Jane", "Evie", "Mal"], correctAnswer: "Red" },
    { question: "21. What is the name of Uma's ship in Descendants?", options: ["The Black Pearl", "The Ghost Ship", "The Revenge", "The Jolly Roger"], correctAnswer: "The Revenge" },
    { question: "22. What is the name of the iconic song from Descendants 2?", options: ["Ways to Be Wicked", "Chillin' Like a Villain", "It's Goin' Down", "Rotten to the Core"], correctAnswer: "Ways to Be Wicked" },
    { question: "23. What is the name of the kingdom where Ben is crowned king in Descendants 2?", options: ["Auradon", "The Isle of the Lost", "The Enchanted Kingdom", "Neverland"], correctAnswer: "Auradon" },
    { question: "24. Who is the leader of the pirates in Descendants 2?", options: ["Harry Hook", "Uma", "Gil", "Captain Hook"], correctAnswer: "Uma" },
    { question: "25. What is the name of the potion Mal uses to hypnotize Ben?", options: ["Love Potion", "Sleeping Potion", "Truth Potion", "Forgetfulness Potion"], correctAnswer: "Love Potion" },
    { question: "26. What is the name of the ball held in Auradon?", options: ["The Star Ball", "The Royal Ball", "The Enchanted Ball", "The Villains' Ball"], correctAnswer: "The Royal Ball" },
    { question: "27. Who is Ben's best friend in Descendants?", options: ["Chad Charming", "Doug", "Jay", "Carlos"], correctAnswer: "Doug" },
    { question: "28. What is the name of the opening song of Descendants?", options: ["Rotten to the Core", "Ways to Be Wicked", "Chillin' Like a Villain", "If Only"], correctAnswer: "Rotten to the Core" },
    { question: "29. What is the name of Mal's mother in Descendants?", options: ["Maleficent", "Ursula", "Cruella de Vil", "The Evil Queen"], correctAnswer: "Maleficent" }
];

app.get('/api/questions', (req, res) => {
    res.json(quizData);
});

app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});