const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const progressText = document.getElementById("progressText");
const progressBarFull = document.getElementById("progressBarFull");
const loader = document.getElementById("loader");
const survey = document.getElementById("survey");

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

let questions = [];

// Grab questions from questions.json then start the survey
fetch("questions.json")
  .then((res) => {
    return res.json();
  })
  .then((loadedQuestions) => {
    questions = loadedQuestions;
    startSurvey();
  })
  .catch((err) => {
    console.error(err);
  });

// reset question counter, score and questions array the pull questions one by one
startSurvey = () => {
  questionCounter = 0;
  score = 0;
  availableQuestions = [...questions];
  getNewQuestion();
  survey.classList.remove("hidden");
  loader.classList.add("hidden");
};

// Grab next question and its from questions array and write to dom, if no questions left go to end page
getNewQuestion = () => {
  if (availableQuestions.length === 0) {
    localStorage.setItem("mostRecentScore", score);
    return window.location.assign("/end.html");
  }

  questionCounter++;
  progressText.innerText = `Question ${questionCounter}/${questions.length}`;
  progressBarFull.style.width = `${
    (questionCounter / questions.length) * 100
  }%`;

  const questionIndex = Math.floor(Math.random() * availableQuestions.length);
  currentQuestion = availableQuestions[questionIndex];
  question.innerText = currentQuestion.question;

  choices.forEach((choice, i) => {
    const number = choice.dataset["number"];
    choice.innerText = currentQuestion["choice" + number];
  });

  availableQuestions.splice(questionIndex, 1);

  acceptingAnswers = true;
  console.log(score);
};

// add to score and add activeChoice class when selecting an answer, then move on to next question
choices.forEach((choice) => {
  choice.addEventListener("click", (e) => {
    if (!acceptingAnswers) return;

    acceptingAnswers = false;
    const selectedChoice = e.target;
    const selectedAnswer = selectedChoice.dataset["number"];

    incrementScore(selectedAnswer);
    selectedChoice.parentElement.classList.add("activeChoice");

    setTimeout(() => {
      selectedChoice.parentElement.classList.remove("activeChoice");
      getNewQuestion();
    }, 800);
  });
});

incrementScore = (num) => {
  score += +num;
};
