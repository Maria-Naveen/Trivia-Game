let player1, player2;
let currentPlayer = 1;
let questions = [];
let currentQuestion;
let chosenCategories = new Set();
let scores = { player1: 0, player2: 0 };

function startGame() {
  player1 = document.getElementById("player1").value;
  player2 = document.getElementById("player2").value;

  if (!player1 || !player2) {
    alert("Please enter names for both players.");
    return;
  }
  document.querySelector(".userDetails").classList.add("hidden");
  document.querySelector(".categories").classList.remove("hidden");
}

function updateCategoryOptions() {
  const categorySelect = document.getElementById("category");
  const options = categorySelect.options;
  for (let i = 0; i < options.length; i++) {
    if (chosenCategories.has(options[i].value)) {
      options[i].disabled = true;
    } else {
      options[i].disabled = false;
    }
  }
}

function selectCategory() {
  const category = document.querySelector("#category").value;
  if (chosenCategories.has(category)) {
    alert("Category already chosen. Please select a different category.");
    return;
  }
  chosenCategories.add(category);
  document.querySelector(".categories").classList.add("hidden");
  document.querySelector(".questionSection").classList.remove("hidden");
  fetchAndFilterQuestions(category).then((fetchedQuestions) => {
    questions = fetchedQuestions;
    displayQuestion();
  });
}

async function fetchAndFilterQuestions(category) {
  const url = `https://the-trivia-api.com/v2/questions?categories=${category}&limit=50`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    let easyQuestions = [];
    let mediumQuestions = [];
    let hardQuestions = [];

    for (let item of data) {
      if (easyQuestions.length < 2 && item.difficulty === "easy") {
        easyQuestions.push({
          question: item.question.text,
          answer: item.correctAnswer,
          incorrectAnswers: item.incorrectAnswers,
          difficulty: "easy",
        });
      } else if (mediumQuestions.length < 2 && item.difficulty === "medium") {
        mediumQuestions.push({
          question: item.question.text,
          answer: item.correctAnswer,
          incorrectAnswers: item.incorrectAnswers,
          difficulty: "medium",
        });
      } else if (hardQuestions.length < 2 && item.difficulty === "hard") {
        hardQuestions.push({
          question: item.question.text,
          answer: item.correctAnswer,
          incorrectAnswers: item.incorrectAnswers,
          difficulty: "hard",
        });
      }

      if (
        easyQuestions.length === 2 &&
        mediumQuestions.length === 2 &&
        hardQuestions.length === 2
      ) {
        break;
      }
    }

    const allQuestions = [
      ...easyQuestions,
      ...mediumQuestions,
      ...hardQuestions,
    ];
    console.log(allQuestions);

    if (allQuestions.length === 6) {
      return allQuestions;
    } else {
      throw new Error(
        "Could not fetch the required number of questions by difficulty"
      );
    }
  } catch (error) {
    alert("There was an error fetching or filtering the questions:");
    console.error(
      "There was an error fetching or filtering the questions:",
      error
    );
  }
}

function displayQuestion() {
  if (questions.length === 0) {
    endCategory();
    return;
  }
  currentQuestion = questions.shift();
  console.log(currentQuestion);
  document.querySelector("#question-text").textContent =
    currentQuestion.question;

  const currentPlayerName = currentPlayer === 1 ? player1 : player2;
  document.querySelector(
    ".current-player"
  ).textContent = `${currentPlayerName}'s turn`;

  const allAnswers = [
    currentQuestion.answer,
    ...currentQuestion.incorrectAnswers,
  ];
  const shuffledAnswers = allAnswers.sort(() => Math.random() - 0.5);

  const answerOptionsDiv = document.getElementById("answer-options");
  answerOptionsDiv.innerHTML = "";
  shuffledAnswers.forEach((answer) => {
    const button = document.createElement("button");
    button.textContent = answer;
    button.onclick = () => submitAnswer(answer);
    button.classList.add("answer-option");
    answerOptionsDiv.appendChild(button);
  });

  document.getElementById("feedback").textContent = "";

  document.getElementById("nextQuestionBtn").classList.add("hidden");
}

function submitAnswer(selectedAnswer) {
  const feedback = document.getElementById("feedback");
  if (
    selectedAnswer.trim().toLowerCase() === currentQuestion.answer.toLowerCase()
  ) {
    feedback.textContent = "Correct!";
    updateScore(currentPlayer, currentQuestion.difficulty);
  } else {
    feedback.textContent = `Incorrect! The correct answer was: ${currentQuestion.answer}`;
  }

  document.getElementById("nextQuestionBtn").classList.remove("hidden");
}

function nextQuestion() {
  currentPlayer = currentPlayer === 1 ? 2 : 1;
  displayQuestion();
}

function updateScore(player, difficulty) {
  const points = difficulty === "easy" ? 10 : difficulty === "medium" ? 15 : 20;
  if (player === 1) {
    scores.player1 += points;
  } else {
    scores.player2 += points;
  }
}

function endCategory() {
  document.querySelector(".questionSection").classList.add("hidden");
  const endGame = confirm(
    "Do you want to select a new category? Press OK to select a new category or Cancel to end the game."
  );

  if (endGame) {
    updateCategoryOptions();
    document.querySelector(".categories").classList.remove("hidden");
  } else {
    displayFinalScores();
  }
}

function displayFinalScores() {
  let winner;
  if (scores.player1 > scores.player2) {
    winner = player1;
  } else if (scores.player1 < scores.player2) {
    winner = player2;
  } else {
    winner = "It's a tie!";
  }

  const finalScoresDiv = document.getElementById("final-scores");
  const winnerDiv = document.getElementById("winner");

  finalScoresDiv.innerHTML = `
        <p>${player1}'s score: ${scores.player1}</p>
        <p>${player2}'s score: ${scores.player2}</p>
    `;

  winnerDiv.textContent = `Winner: ${winner}`;

  document.querySelector(".winnerSection").classList.remove("hidden");
}
