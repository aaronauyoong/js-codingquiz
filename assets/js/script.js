// Define main variables
let quizMain = document.querySelector("#quiz");
let quizTimer = document.querySelector("#timer");
let questionEl = document.querySelector("#quizQuestions");

// Variables that display highscore
let scoreNameDisplay = document.querySelector("#nameInput");
let scoreValueDisplay = document.querySelector("#scoreInput")
let userScoreDisplay = document.querySelector("#finalQuizScore");

// User key in name to record score
let enterName = document.querySelector("#initials")

// Button to start quiz
let startQuizButton = document.querySelector("#startQuiz");
let replayQuizButton = document.querySelector("#replayQuiz");

// Button to clear highscores
let clearScoreButton = document.querySelector("#clearScore");
let startingPageDiv = document.querySelector("#startingPage");
let quizOverDiv = document.querySelector("#quizOverPage");
let quizPageDiv = document.querySelector("#quizPage");

// Button to save and submit current score
let saveScoreBtn = document.querySelector("#submitQuizBtn");

// Buttons at the end of quiz (clear scores and replay)
let finQuizBtns = document.querySelector("#endQuizBtns");

// To generate popup messages
const popup = document.querySelector("#popup-alert");

// MCQ options as variables defined 
let optionA = document.querySelector("#a");
let optionB = document.querySelector("#b");
let optionC = document.querySelector("#c");
let optionD = document.querySelector("#d");

// Other global variables
let totalQuestionIndex = quizQuestions.length;
let currentQuestionIndex = 0;
let timer;
let timerCount = 76;
let timerPenalty = 10;
let score = 0;

// Function for popup message
function showPopup(message, color, timeout = 2000) {
    
    popup.textContent = message;

    // set colour based on isSuccess value
    popup.style.backgroundColor = color;

    popup.style.display = 'block';

    setTimeout(function () {
        popup.style.display = 'none';
    }, timeout);
};

// Function to start the code quiz
function startQuiz() {
    showPopup("Good Luck!!", 'black')
   
    // Hides the starting screen
    startingPageDiv.style.display = "none";

    // Hides the final display screen with scores
    quizOverDiv.style.display = "none";

    // Displays the quiz page
    quizPageDiv.style.display = "block";

    // Generate quiz question function
    showQuizQuestion();

    // Start timer function
    startTimer();
};

// Function to show quiz questions
function showQuizQuestion() {

    // If current question number is the same as the total number of questions, will end quiz and show score.
    if (currentQuestionIndex === totalQuestionIndex) {
        return displayScore();
    };

    // Defines currentQuestion variable   
    let currentQuestion = quizQuestions[currentQuestionIndex];

    // Places question into designated HTML element
    questionEl.innerHTML = "<h1>" + currentQuestion.question + "</h1>";

    // Places MCQ options into designated HTML element
    optionA.innerHTML = currentQuestion.answers.optionA;
    optionB.innerHTML = currentQuestion.answers.optionB;
    optionC.innerHTML = currentQuestion.answers.optionC;
    optionD.innerHTML = currentQuestion.answers.optionD;

};

// Function to start timer
function startTimer() {
    timer = setInterval(function() {
        timerCount--;
        quizTimer.textContent = "Time left: " + timerCount;
    
        if(timerCount <= 0) {
          // clears interval, stops timer and shows score once timer reaches 0
          clearInterval(timer);
          displayScore();
        }
      }, 1_000);
};

// Function to check if its the correct answer
function compareAnswer(answer){
    let correct = quizQuestions[currentQuestionIndex].correctAnswer;
    
    // Function to proceed to next question
    function nextQuestion () {
        currentQuestionIndex++;
        showQuizQuestion();
    };

    // if answer is correct, and its not the last question
    if (answer === correct && currentQuestionIndex !== totalQuestionIndex){
        score++;
        // Popup displayed indicating answer is correct
        showPopup("That is correct! 🏆", 'darkgreen')
        nextQuestion();

    // if answer is not correct and its not the last question
    }else if (answer !== correct && currentQuestionIndex !== totalQuestionIndex){
        // Popup displayed indicating answer is incorrect
        showPopup("That is incorrect! 😭", 'maroon') 
        // Deducting 10 seconds due to incorrect answer
        timerCount = timerCount - timerPenalty;
        nextQuestion();

    // if its the last question, then display score
    }else{
        displayScore();
    }
}; 

// Function to display score
function displayScore() {

    // Hides the starting screen
    startingPageDiv.style.display = "none";
    // Displays the final display screen with scores
    quizOverDiv.style.display = "block";
    // Hides the quiz page
    quizPageDiv.style.display = "none";
    // Displays section with end game buttons 
    finQuizBtns.style.display = "flex";

    clearInterval(timer);

    enterName.value = "";
    userScoreDisplay.innerHTML = "You achieved a final score of " + score + " out of " + quizQuestions.length + " correct! 🎉";
};

// Adding event listener to the save score (i.e. submit score) button
saveScoreBtn.addEventListener("click", saveScore);

// Function to save score to local storage
function saveScore() {

    if(enterName.value === "") {
        alert("Your name cannot be blank.");
        return false;
    }else{

    addNewScore();
    generateHighscores();
    };

};

// Function to add new user score

function addNewScore() { 

    let savedUserScore = JSON.parse(localStorage.getItem("savedUserScore"));
    let newUser = enterName.value.trim();
    let newHighscore = {
        name: newUser,
        score: score
    };

    // Hide the quiz over page
    quizOverDiv.style.display = "none";
    // Display the high score page and end game buttons
    highscorePage.style.display = "flex";
    endGameBtns.style.display = "block";

    savedUserScore.push(newHighscore);
    localStorage.setItem("savedUserScore", JSON.stringify(savedUserScore));
    generateHighscores();

};


// This function clears the list for the high scores and generates a new high score list from local storage
function generateHighscores() {
    scoreNameDisplay.textContent = "";
    scoreValueDisplay.textContent = "";

    let savedUserScore = JSON.parse(localStorage.getItem("savedUserScore"));

    for (let index = 0; index < highscores.length; index++) {
        let newNameSpan = document.createElement("li");
        let newScoreSpan = document.createElement("li");

        newNameSpan.textContent = savedUserScore[i].name;
        newScoreSpan.textContent = savedUserScore[i].score;

        scoreNameDisplay.appendChild(newNameSpan);
        scoreValueDisplay.appendChild(newScoreSpan);
    };
};

// Function to organise scores

// This function displays the high scores page while hiding all of the other pages/divs
function displayHighscores() {
    // Hides the starting screen
    startingPageDiv.style.display = "none";

    // Hides the final display screen with highscores
    quizOverDiv.style.display = "none";

    // Displays the quiz page
    quizPageDiv.style.display = "none";

    // Displays the high score page
    highscorePage.style.display = "flex";

    // Displays the end game buttons
    finQuizBtns.style.display = "block";

};

// Function to clear high score list in local storage and generates a new high score list
function clearHighscores() {
    window.localStorage.clear();
    scoreNameDisplay.textContent = "";
    scoreValueDisplay.textContent = "";
};

// Function resets all the variables back to their original values and shows the home page to enable replay of the quiz
function replayQuiz(){
    startingPageDiv.style.display = "block";
    quizPageDiv.style.display = "none";
    quizOverDiv.style.display = "none";
    highscorePage.style.display = "none";
    currentQuestionIndex = 0;
    score = 0;
    timerCount = 76;
};

// // Button to start the quiz
startQuizButton.addEventListener("click", startQuiz);

// // Button to clear scores
clearScoreButton.addEventListener("click", clearHighscores);

// // Button to replay quiz
replayQuizButton.addEventListener("click", replayQuiz);
