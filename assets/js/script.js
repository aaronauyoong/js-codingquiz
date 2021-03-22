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
let highscorePageDiv = document.querySelector("#highscorePage")
let highscorePageContainer = document.querySelector("#highscoreContainer")

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

    if (!enterName.value) {
        alert("Your name cannot be blank.");
        return false;
    } else {
        addNewScore();
        generateHighscores();
    };

};

// Function to add new user score
function addNewScore() { 

    // Save related quiz data as an object (later to be stored in localStorage)
    let newUser = enterName.value.trim();
    let newHighscore = {
        name: newUser,
        score
    };

    let savedUserScore = JSON.parse(localStorage.getItem("savedUserScore")) || [];

    // Hide the quiz over page
    quizOverDiv.style.display = "none";
    // Display the high score page and end game buttons
    highscorePageDiv.style.display = "flex";
    highscorePageContainer.style.display = "block";
    finQuizBtns.style.display = "flex";

    savedUserScore.push(newHighscore);

    // Use .setItem() to store object in storage and JSON.stringify to convert it as a string
    localStorage.setItem("savedUserScore", JSON.stringify(savedUserScore));
};


// This function generates a new high score list from local storage
function generateHighscores() {

    // Clearing content in name and score
    scoreNameDisplay.textContent = "";
    scoreValueDisplay.textContent = "";

    let savedUserScores = JSON.parse(localStorage.getItem("savedUserScore"));

    // To accommodate for new users and their scores,
    // Make a for loop and have their data become a list underneath each heading

    for (let index = 0; index < savedUserScores.length; index++) {
        let newNameEl = document.createElement("li");
        let newScoreEl = document.createElement("li");

        newNameEl.textContent = savedUserScores[index].name;
        newScoreEl.textContent = savedUserScores[index].score;

        scoreNameDisplay.appendChild(newNameEl);
        scoreValueDisplay.appendChild(newScoreEl);
    };
};

// This function displays the high scores page while hiding all of the other pages/divs
function displayHighscores() {
    // Hides the starting screen, quiz page, and quiz over page
    startingPageDiv.style.display = "none";
    quizOverDiv.style.display = "none";
    quizPageDiv.style.display = "none";

    // Displays the high score pages and the finish quiz buttons (replay and clear scores buttons)
    highscorePageDiv.style.display = "flex";
    highscorePageContainer.style.display = "block";
    finQuizBtns.style.display = "flex";

    generateHighscores()
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
