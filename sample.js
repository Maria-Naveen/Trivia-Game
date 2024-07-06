const category = "music";
const url = `https://the-trivia-api.com/v2/questions?categories=${category}&limit=50`; // Fetch more questions to ensure sufficient filtering

async function fetchAndFilterQuestions() {
  try {
    const response = await fetch(url);
    const data = await response.json();

    let easyQuestions = [];
    let mediumQuestions = [];
    let hardQuestions = [];

    for (let item of data) {
      if (easyQuestions.length < 2 && item.difficulty === "easy") {
        easyQuestions.push({
          question: item.question.text,
          answer: item.correctAnswer,
        });
      } else if (mediumQuestions.length < 2 && item.difficulty === "medium") {
        mediumQuestions.push({
          question: item.question.text,
          answer: item.correctAnswer,
        });
      } else if (hardQuestions.length < 2 && item.difficulty === "hard") {
        hardQuestions.push({
          question: item.question.text,
          answer: item.correctAnswer,
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

    if (allQuestions.length === 6) {
      allQuestions.forEach((item) =>
        console.log(`Question: ${item.question}, Answer: ${item.answer}`)
      );
      return allQuestions;
    } else {
      throw new Error(
        "Could not fetch the required number of questions by difficulty"
      );
    }
  } catch (error) {
    console.error(
      "There was an error fetching or filtering the questions:",
      error
    );
  }
}

fetchAndFilterQuestions();
