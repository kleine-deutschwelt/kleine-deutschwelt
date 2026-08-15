"use strict";

/* =========================================================
   KLEINE DEUTSCHWELT
   LEKTION: ZAHLEN 0–20
   DATEI: pages/zahlen.js
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  /* =======================================================
     1. DATELE LECȚIEI
  ======================================================= */

  const AUDIO_BASE = "../audio/zahlen/";

  const numbers = [
    { value: 0, word: "null", ro: "zero", file: "null.mp3" },
    { value: 1, word: "eins", ro: "unu", file: "eins.mp3" },
    { value: 2, word: "zwei", ro: "doi", file: "zwei.mp3" },
    { value: 3, word: "drei", ro: "trei", file: "drei.mp3" },
    { value: 4, word: "vier", ro: "patru", file: "vier.mp3" },
    { value: 5, word: "fünf", ro: "cinci", file: "fuenf.mp3" },
    { value: 6, word: "sechs", ro: "șase", file: "sechs.mp3" },
    { value: 7, word: "sieben", ro: "șapte", file: "sieben.mp3" },
    { value: 8, word: "acht", ro: "opt", file: "acht.mp3" },
    { value: 9, word: "neun", ro: "nouă", file: "neun.mp3" },
    { value: 10, word: "zehn", ro: "zece", file: "zehn.mp3" },
    { value: 11, word: "elf", ro: "unsprezece", file: "elf.mp3" },
    { value: 12, word: "zwölf", ro: "doisprezece", file: "zwoelf.mp3" },
    { value: 13, word: "dreizehn", ro: "treisprezece", file: "dreizehn.mp3" },
    { value: 14, word: "vierzehn", ro: "paisprezece", file: "vierzehn.mp3" },
    { value: 15, word: "fünfzehn", ro: "cincisprezece", file: "fuenfzehn.mp3" },
    { value: 16, word: "sechzehn", ro: "șaisprezece", file: "sechzehn.mp3" },
    { value: 17, word: "siebzehn", ro: "șaptesprezece", file: "siebzehn.mp3" },
    { value: 18, word: "achtzehn", ro: "optsprezece", file: "achtzehn.mp3" },
    { value: 19, word: "neunzehn", ro: "nouăsprezece", file: "neunzehn.mp3" },
    { value: 20, word: "zwanzig", ro: "douăzeci", file: "zwanzig.mp3" }
  ];

  const accentColors = [
    ["#f7c948", "#d59400"],
    ["#f47b67", "#cf4f3d"],
    ["#83c9f4", "#3b8fc3"],
    ["#8ed8bd", "#3c9b78"],
    ["#f3dfb7", "#a88443"]
  ];

  const countingQuestions = [
    {
      object: "Äpfel",
      ro: "mere",
      answer: 3,
      options: [2, 3, 5]
    },
    {
      object: "Bleistifte",
      ro: "creioane",
      answer: 5,
      options: [4, 5, 7]
    },
    {
      object: "Bälle",
      ro: "mingi",
      answer: 7,
      options: [6, 7, 9]
    },
    {
      object: "Bauklötze",
      ro: "cuburi",
      answer: 9,
      options: [8, 9, 11]
    },
    {
      object: "Blumen",
      ro: "flori",
      answer: 12,
      options: [10, 11, 12]
    }
  ];

  const matchingValues = [2, 5, 8, 11, 16, 20];

  const listeningValues = [4, 7, 11, 15, 18, 20];

  const sequenceRounds = [
    {
      values: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      missing: [2, 6]
    },
    {
      values: [5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
      missing: [1, 5, 8]
    },
    {
      values: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
      missing: [0, 4, 7]
    },
    {
      values: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20],
      missing: [2, 5, 9]
    },
    {
      values: [20, 19, 18, 17, 16, 15, 14, 13, 12, 11],
      missing: [1, 4, 8]
    }
  ];

  const sequencePositions = [
    { left: 11.1, top: 35.5 },
    { left: 27.0, top: 28.5 },
    { left: 42.5, top: 24.5 },
    { left: 57.8, top: 27.5 },
    { left: 73.0, top: 35.0 },
    { left: 10.6, top: 64.0 },
    { left: 25.5, top: 72.0 },
    { left: 40.6, top: 76.0 },
    { left: 57.0, top: 72.0 },
    { left: 72.0, top: 64.0 }
  ];

  const shoppingQuestions = [
    {
      object: "Äpfel",
      ro: "mere",
      answer: 3,
      sentence: "Felix kauft drei Äpfel.",
      translation: "Felix cumpără trei mere.",
      options: [2, 3, 4]
    },
    {
      object: "Brötchen",
      ro: "chifle",
      answer: 4,
      sentence: "Felix kauft vier Brötchen.",
      translation: "Felix cumpără patru chifle.",
      options: [3, 4, 5]
    },
    {
      object: "Bleistifte",
      ro: "creioane",
      answer: 5,
      sentence: "Felix kauft fünf Bleistifte.",
      translation: "Felix cumpără cinci creioane.",
      options: [4, 5, 6]
    },
    {
      object: "Hefte",
      ro: "caiete",
      answer: 6,
      sentence: "Felix kauft sechs Hefte.",
      translation: "Felix cumpără șase caiete.",
      options: [5, 6, 7]
    }
  ];

  const quizQuestions = [
    {
      type: "choice",
      prompt: "Wie heißt die Zahl 6?",
      translation: "Cum se numește cifra 6?",
      options: ["sechs", "sieben", "zehn"],
      answer: "sechs"
    },
    {
      type: "choice",
      prompt: "Welche Zahl ist „zwölf“?",
      translation: "Ce cifră este „zwölf”?",
      options: ["10", "12", "20"],
      answer: "12"
    },
    {
      type: "audio",
      prompt: "Welche Zahl hörst du?",
      translation: "Ce număr auzi?",
      audioValue: 8,
      options: ["6", "8", "18"],
      answer: "8"
    },
    {
      type: "choice",
      prompt: "Wie heißt die Zahl 15?",
      translation: "Cum se numește cifra 15?",
      options: ["fünf", "fünfzehn", "vierzehn"],
      answer: "fünfzehn"
    },
    {
      type: "choice",
      prompt: "Welche Zahl kommt nach 9?",
      translation: "Ce număr urmează după 9?",
      options: ["8", "10", "11"],
      answer: "10"
    },
    {
      type: "audio",
      prompt: "Welche Zahl hörst du?",
      translation: "Ce număr auzi?",
      audioValue: 17,
      options: ["7", "16", "17"],
      answer: "17"
    },
    {
      type: "choice",
      prompt: "Welche Zahl fehlt: 11, 12, __, 14?",
      translation: "Ce număr lipsește: 11, 12, __, 14?",
      options: ["10", "13", "15"],
      answer: "13"
    },
    {
      type: "choice",
      prompt: "Wie heißt die Zahl 20?",
      translation: "Cum se numește cifra 20?",
      options: ["zwölf", "zwanzig", "zwei"],
      answer: "zwanzig"
    },
    {
      type: "audio",
      prompt: "Welche Zahl hörst du?",
      translation: "Ce număr auzi?",
      audioValue: 4,
      options: ["4", "5", "14"],
      answer: "4"
    },
    {
      type: "choice",
      prompt: "Welche Zahl kommt vor 20?",
      translation: "Ce număr este înainte de 20?",
      options: ["18", "19", "21"],
      answer: "19"
    }
  ];

  /* =======================================================
     2. ELEMENTE DOM
  ======================================================= */

  const lessonAudio = document.getElementById("lesson-audio");

  const lessonNavigation = document.getElementById("lesson-navigation");
  const lessonContent = document.getElementById("lesson-content");
  const startLessonButton = document.getElementById("start-lesson-button");

  const progressFill = document.getElementById("progress-fill");
  const progressText = document.getElementById("progress-text");

  const numberTemplate = document.getElementById("number-card-template");
  const numbersGrid = document.getElementById("numbers-grid");
  const numbersProgressText = document.getElementById("numbers-progress-text");

  const selectedNumberDigit = document.getElementById("selected-number-digit");
  const selectedNumberWord = document.getElementById("selected-number-word");
  const selectedNumberTranslation = document.getElementById(
    "selected-number-translation"
  );
  const felixNumberDisplay = document.getElementById("felix-number-display");
  const repeatSelectedNumber = document.getElementById(
    "repeat-selected-number"
  );

  const completeStage1Button = document.getElementById("complete-stage-1");
  const completeStage2Button = document.getElementById("complete-stage-2");
  const completeStage3Button = document.getElementById("complete-stage-3");
  const completeStage4Button = document.getElementById("complete-stage-4");
  const completeStage5Button = document.getElementById("complete-stage-5");
  const completeStage6Button = document.getElementById("complete-stage-6");

  const countingCurrentQuestion = document.getElementById(
    "counting-current-question"
  );
  const countingTotalQuestions = document.getElementById(
    "counting-total-questions"
  );
  const countingObjectName = document.getElementById("counting-object-name");
  const countingObjectTranslation = document.getElementById(
    "counting-object-translation"
  );
  const countingAnswerOptions = document.getElementById(
    "counting-answer-options"
  );
  const countingFeedback = document.getElementById("counting-feedback");
  const restartCountingButton = document.getElementById("restart-counting");

  const matchingCards = document.getElementById("matching-cards");
  const matchingRoundCounter = document.getElementById(
    "matching-round-counter"
  );
  const matchingFeedback = document.getElementById("matching-feedback");
  const restartMatchingButton = document.getElementById("restart-matching");

  const listeningCardOverlay = document.getElementById(
    "listening-card-overlay"
  );
  const listeningQuestionCounter = document.getElementById(
    "listening-question-counter"
  );
  const playListeningNumberButton = document.getElementById(
    "play-listening-number"
  );
  const listeningFeedback = document.getElementById("listening-feedback");
  const restartListeningButton = document.getElementById("restart-listening");

  const sequenceRoundCounter = document.getElementById(
    "sequence-round-counter"
  );
  const sequenceOverlay = document.getElementById("sequence-overlay");
  const checkSequenceButton = document.getElementById(
    "check-sequence-button"
  );
  const sequenceFeedback = document.getElementById("sequence-feedback");
  const restartSequenceButton = document.getElementById("restart-sequence");

  const shoppingAnswerOverlay = document.getElementById(
    "shopping-answer-overlay"
  );
  const shoppingQuestionCounter = document.getElementById(
    "shopping-question-counter"
  );
  const playShoppingAudioButton = document.getElementById(
    "play-shopping-audio"
  );
  const shoppingSentence = document.getElementById("shopping-sentence");
  const shoppingTranslation = document.getElementById(
    "shopping-translation"
  );
  const shoppingFeedback = document.getElementById("shopping-feedback");
  const restartShoppingButton = document.getElementById("restart-shopping");

  const quizStartScreen = document.getElementById("quiz-start-screen");
  const startQuizButton = document.getElementById("start-quiz-button");
  const quizGame = document.getElementById("quiz-game");
  const quizResult = document.getElementById("quiz-result");
  const quizCurrentQuestion = document.getElementById(
    "quiz-current-question"
  );
  const quizTotalQuestions = document.getElementById("quiz-total-questions");
  const quizScoreElement = document.getElementById("quiz-score");
  const quizQuestionType = document.getElementById("quiz-question-type");
  const quizQuestion = document.getElementById("quiz-question");
  const quizQuestionTranslation = document.getElementById(
    "quiz-question-translation"
  );
  const quizAudioButton = document.getElementById("quiz-audio-button");
  const quizAnswerOptions = document.getElementById("quiz-answer-options");
  const quizFeedback = document.getElementById("quiz-feedback");
  const finalScore = document.getElementById("final-score");
  const quizResultMessage = document.getElementById("quiz-result-message");
  const restartQuizButton = document.getElementById("restart-quiz-button");
  const openDiplomaButton = document.getElementById("open-diploma-button");

  const lessonComplete = document.getElementById("lesson-complete");

  const diplomaModal = document.getElementById("diploma-modal");
  const closeDiplomaButton = document.getElementById(
    "close-diploma-button"
  );
  const studentNameInput = document.getElementById("student-name-input");
  const applyStudentNameButton = document.getElementById(
    "apply-student-name"
  );
  const diplomaStudentName = document.getElementById(
    "diploma-student-name"
  );
  const diplomaScore = document.getElementById("diploma-score");
  const diplomaDate = document.getElementById("diploma-date");
  const printDiplomaButton = document.getElementById(
    "print-diploma-button"
  );

  const feedbackToast = document.getElementById("feedback-toast");
  const feedbackToastText = document.getElementById("feedback-toast-text");

  /* =======================================================
     3. STAREA LECȚIEI
  ======================================================= */

  const STORAGE_KEY = "kleineDeutschwelt_zahlen_0_20";

  const defaultState = {
    started: false,
    currentStage: 1,
    completedStages: [],
    visitedNumbers: [],
    quizBestScore: 0,
    lessonFinished: false,
    studentName: ""
  };

  let state = loadState();

  let currentAudioTrigger = null;
  let toastTimer = null;

  let countingIndex = 0;
  let countingCorrect = 0;

  let selectedMatchingCards = [];
  let matchedPairs = 0;
  let matchingLocked = false;

  let listeningIndex = 0;
  let listeningCorrect = 0;
  let currentListeningOptions = [];

  let sequenceIndex = 0;
  let sequenceCorrectRounds = 0;

  let shoppingIndex = 0;
  let shoppingCorrect = 0;
  let shoppingSelections = [];

  let quizIndex = 0;
  let quizScore = 0;
  let quizLocked = false;

  /* =======================================================
     4. FUNCȚII GENERALE
  ======================================================= */

  function loadState() {
    try {
      const savedState = localStorage.getItem(STORAGE_KEY);

      if (!savedState) {
        return { ...defaultState };
      }

      return {
        ...defaultState,
        ...JSON.parse(savedState)
      };
    } catch (error) {
      console.warn("Der gespeicherte Fortschritt konnte nicht geladen werden.");
      return { ...defaultState };
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.warn("Der Fortschritt konnte nicht gespeichert werden.");
    }
  }

  function shuffle(array) {
    const copy = [...array];

    for (let index = copy.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));

      [copy[index], copy[randomIndex]] = [
        copy[randomIndex],
        copy[index]
      ];
    }

    return copy;
  }

  function getNumberData(value) {
    return numbers.find((number) => number.value === value);
  }

  function getNumberAudio(value) {
    const number = getNumberData(value);

    return number ? `${AUDIO_BASE}${number.file}` : "";
  }

  function scrollToElement(element) {
    if (!element) {
      return;
    }

    element.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }

  function showToast(message, type = "") {
    if (!feedbackToast || !feedbackToastText) {
      return;
    }

    window.clearTimeout(toastTimer);

    feedbackToastText.textContent = message;
    feedbackToast.classList.remove("correct", "incorrect");

    if (type) {
      feedbackToast.classList.add(type);
    }

    feedbackToast.hidden = false;

    toastTimer = window.setTimeout(() => {
      feedbackToast.hidden = true;
    }, 2600);
  }

  function setFeedback(element, message, type = "") {
    if (!element) {
      return;
    }

    element.textContent = message;
    element.classList.remove("correct", "incorrect");

    if (type) {
      element.classList.add(type);
    }
  }

  function playFeedbackAudio(correct) {
    const file = correct
      ? "richtig.mp3"
      : "versuche-noch-einmal.mp3";

    playAudio(`${AUDIO_BASE}${file}`);
  }

  /* =======================================================
     5. SISTEMUL AUDIO
  ======================================================= */

  function playAudio(source, trigger = null) {
    if (!source || !lessonAudio) {
      return;
    }

    if (currentAudioTrigger) {
      currentAudioTrigger.classList.remove("is-playing");
    }

    currentAudioTrigger = trigger;

    lessonAudio.pause();
    lessonAudio.currentTime = 0;
    lessonAudio.src = source;

    if (trigger) {
      trigger.classList.add("is-playing");
    }

    const playPromise = lessonAudio.play();

    if (playPromise) {
      playPromise.catch(() => {
        if (trigger) {
          trigger.classList.remove("is-playing");
        }

        showToast(
          "Die Audiodatei konnte nicht abgespielt werden.",
          "incorrect"
        );
      });
    }
  }

  lessonAudio.addEventListener("ended", () => {
    if (currentAudioTrigger) {
      currentAudioTrigger.classList.remove("is-playing");
    }

    currentAudioTrigger = null;
  });

  lessonAudio.addEventListener("error", () => {
    if (currentAudioTrigger) {
      currentAudioTrigger.classList.remove("is-playing");
    }

    currentAudioTrigger = null;
  });

  document.querySelectorAll(".audio-trigger").forEach((button) => {
    button.addEventListener("click", () => {
      const source = button.dataset.audio;

      if (source) {
        playAudio(source, button);
      }
    });
  });

  /* =======================================================
     6. PORNIREA ȘI PROGRESUL LECȚIEI
  ======================================================= */

  function startLesson() {
    state.started = true;
    saveState();

    lessonNavigation.hidden = false;
    lessonContent.hidden = false;

    unlockSavedStages();
    updateProgress();
    scrollToElement(document.getElementById("stage-1"));
  }

  function unlockSavedStages() {
    const highestCompletedStage = state.completedStages.length
      ? Math.max(...state.completedStages)
      : 0;

    const highestUnlockedStage = Math.min(highestCompletedStage + 1, 7);

    for (let stage = 1; stage <= highestUnlockedStage; stage += 1) {
      unlockStage(stage, false);
    }

    state.completedStages.forEach((stage) => {
      markNavigationCompleted(stage);
    });

    if (state.lessonFinished) {
      lessonComplete.hidden = false;
    }
  }

  function unlockStage(stageNumber, shouldScroll = true) {
    const stage = document.getElementById(`stage-${stageNumber}`);
    const navigationButton = document.querySelector(
      `.stage-navigation-button[data-stage="${stageNumber}"]`
    );

    if (!stage) {
      return;
    }

    stage.classList.remove("locked-stage");
    stage.setAttribute("aria-hidden", "false");

    if (navigationButton) {
      navigationButton.disabled = false;
      navigationButton.classList.remove("locked");
    }

    if (shouldScroll) {
      window.setTimeout(() => {
        setActiveNavigation(stageNumber);
        scrollToElement(stage);
      }, 180);
    }
  }

  function completeStage(stageNumber) {
    if (!state.completedStages.includes(stageNumber)) {
      state.completedStages.push(stageNumber);
      state.completedStages.sort((a, b) => a - b);
    }

    state.currentStage = Math.min(stageNumber + 1, 7);

    markNavigationCompleted(stageNumber);
    updateProgress();
    saveState();

    if (stageNumber < 7) {
      unlockStage(stageNumber + 1);
    }
  }

  function markNavigationCompleted(stageNumber) {
    const navigationButton = document.querySelector(
      `.stage-navigation-button[data-stage="${stageNumber}"]`
    );

    if (navigationButton) {
      navigationButton.classList.add("completed");
    }
  }

  function setActiveNavigation(stageNumber) {
    document
      .querySelectorAll(".stage-navigation-button")
      .forEach((button) => {
        button.classList.toggle(
          "active",
          Number(button.dataset.stage) === stageNumber
        );
      });
  }

  function updateProgress() {
    const completed = state.completedStages.length;
    const percentage = Math.round((completed / 7) * 100);

    progressFill.style.width = `${percentage}%`;
    progressText.textContent = `${percentage} % geschafft`;
  }

  startLessonButton.addEventListener("click", startLesson);

  document
    .querySelectorAll(".stage-navigation-button")
    .forEach((button) => {
      button.addEventListener("click", () => {
        if (button.disabled) {
          return;
        }

        const stageNumber = Number(button.dataset.stage);
        const target = document.getElementById(button.dataset.target);

        setActiveNavigation(stageNumber);
        scrollToElement(target);
      });
    });

  /* =======================================================
     7. ETAPA 1 – NUMERELE 0–20
  ======================================================= */

  function createNumberCards() {
    numbersGrid.innerHTML = "";

    numbers.forEach((number, index) => {
      const fragment = numberTemplate.content.cloneNode(true);
      const button = fragment.querySelector(".number-card");
      const digit = fragment.querySelector(".number-card-digit");
      const word = fragment.querySelector(".number-card-word");
      const translation = fragment.querySelector(
        ".number-card-translation"
      );

      const colorSet = accentColors[index % accentColors.length];

      button.dataset.value = String(number.value);
      button.dataset.audio = `${AUDIO_BASE}${number.file}`;
      button.setAttribute(
        "aria-label",
        `${number.value}, ${number.word}, anhören`
      );

      button.style.setProperty("--card-accent", colorSet[0]);
      button.style.setProperty("--card-accent-dark", colorSet[1]);

      digit.textContent = number.value;
      word.textContent = number.word;
      translation.textContent = number.ro;

      if (state.visitedNumbers.includes(number.value)) {
        button.classList.add("visited");
      }

      button.addEventListener("click", () => {
        selectNumber(number, button);
      });

      numbersGrid.appendChild(fragment);
    });

    updateVisitedNumberProgress();
  }

  function selectNumber(number, button) {
    document.querySelectorAll(".number-card").forEach((card) => {
      card.classList.remove("active");
    });

    button.classList.add("active", "visited");

    selectedNumberDigit.textContent = number.value;
    selectedNumberWord.textContent = number.word;
    selectedNumberTranslation.textContent = number.ro;
    felixNumberDisplay.textContent = number.value;

    repeatSelectedNumber.dataset.audio = `${AUDIO_BASE}${number.file}`;

    if (!state.visitedNumbers.includes(number.value)) {
      state.visitedNumbers.push(number.value);
      state.visitedNumbers.sort((a, b) => a - b);
      saveState();
    }

    updateVisitedNumberProgress();
    playAudio(`${AUDIO_BASE}${number.file}`, button);
  }

  function updateVisitedNumberProgress() {
    const visited = state.visitedNumbers.length;

    numbersProgressText.textContent =
      `${visited} von 21 Zahlen gehört`;

    completeStage1Button.disabled = visited < 21;

    if (visited >= 21) {
      setFeedback(
        document.getElementById("stage-1-feedback"),
        "Super! Du hast alle Zahlen gehört.",
        "correct"
      );
    }
  }

  repeatSelectedNumber.addEventListener("click", () => {
    playAudio(repeatSelectedNumber.dataset.audio, repeatSelectedNumber);
  });

  completeStage1Button.addEventListener("click", () => {
    if (state.visitedNumbers.length < 21) {
      return;
    }

    completeStage(1);
  });

  /* =======================================================
     8. LINIA NUMERELOR
  ======================================================= */

  function createNumberLineLabels() {
    const overlay = document.getElementById("number-line-overlay");

    if (!overlay) {
      return;
    }

    overlay.innerHTML = "";

    const positions = [
      { left: 2.3, top: 65 },
      { left: 6.4, top: 59 },
      { left: 10.7, top: 54 },
      { left: 15.1, top: 48 },
      { left: 19.8, top: 44 },
      { left: 24.4, top: 40 },
      { left: 29.1, top: 38 },
      { left: 33.8, top: 38 },
      { left: 38.5, top: 40 },
      { left: 43.2, top: 43 },
      { left: 48.0, top: 48 },
      { left: 52.8, top: 53 },
      { left: 57.7, top: 57 },
      { left: 62.6, top: 58 },
      { left: 67.5, top: 57 },
      { left: 72.5, top: 53 },
      { left: 77.4, top: 48 },
      { left: 82.3, top: 43 },
      { left: 87.1, top: 39 },
      { left: 92.0, top: 38 },
      { left: 96.7, top: 40 }
    ];

    numbers.forEach((number, index) => {
      const label = document.createElement("span");

      label.className = "number-line-label";
      label.textContent = number.value;
      label.style.left = `${positions[index].left}%`;
      label.style.top = `${positions[index].top}%`;

      overlay.appendChild(label);
    });
  }

  /* =======================================================
     9. ETAPA 2 – NUMĂRARE
  ======================================================= */

  function renderCountingQuestion() {
    const question = countingQuestions[countingIndex];

    countingCurrentQuestion.textContent = String(countingIndex + 1);
    countingTotalQuestions.textContent = String(countingQuestions.length);
    countingObjectName.textContent = question.object;
    countingObjectTranslation.textContent = question.ro;
    countingAnswerOptions.innerHTML = "";
    setFeedback(countingFeedback, "");

    shuffle(question.options).forEach((option) => {
      const button = document.createElement("button");

      button.type = "button";
      button.className = "answer-option";
      button.textContent = option;

      button.addEventListener("click", () => {
        checkCountingAnswer(button, option, question.answer);
      });

      countingAnswerOptions.appendChild(button);
    });
  }

  function checkCountingAnswer(button, selected, answer) {
    const buttons = countingAnswerOptions.querySelectorAll("button");

    buttons.forEach((item) => {
      item.disabled = true;

      if (Number(item.textContent) === answer) {
        item.classList.add("correct");
      }
    });

    if (selected === answer) {
      button.classList.add("correct");
      countingCorrect += 1;

      setFeedback(countingFeedback, "Richtig! Sehr gut!", "correct");
      playFeedbackAudio(true);
    } else {
      button.classList.add("incorrect");

      setFeedback(
        countingFeedback,
        `Die richtige Antwort ist ${answer}.`,
        "incorrect"
      );
      playFeedbackAudio(false);
    }

    window.setTimeout(() => {
      countingIndex += 1;

      if (countingIndex < countingQuestions.length) {
        renderCountingQuestion();
      } else {
        finishCountingActivity();
      }
    }, 1250);
  }

  function finishCountingActivity() {
    countingAnswerOptions.innerHTML = "";

    countingObjectName.textContent = "Aufgabe geschafft!";
    countingObjectTranslation.textContent =
      `${countingCorrect} von ${countingQuestions.length} richtig`;

    setFeedback(
      countingFeedback,
      "Du hast alle Gruppen gezählt.",
      "correct"
    );

    completeStage2Button.disabled = false;
  }

  function resetCountingActivity() {
    countingIndex = 0;
    countingCorrect = 0;
    completeStage2Button.disabled = true;
    renderCountingQuestion();
  }

  restartCountingButton.addEventListener("click", resetCountingActivity);

  completeStage2Button.addEventListener("click", () => {
    completeStage(2);
  });

  /* =======================================================
     10. ETAPA 3 – PERECHI
  ======================================================= */

  function createMatchingGame() {
    selectedMatchingCards = [];
    matchedPairs = 0;
    matchingLocked = false;

    completeStage3Button.disabled = true;
    matchingCards.innerHTML = "";
    setFeedback(matchingFeedback, "");

    const cards = [];

    matchingValues.forEach((value) => {
      const number = getNumberData(value);

      cards.push({
        pair: value,
        content: String(value),
        type: "digit"
      });

      cards.push({
        pair: value,
        content: number.word,
        type: "word"
      });
    });

    shuffle(cards).forEach((cardData) => {
      const button = document.createElement("button");

      button.type = "button";
      button.className = "matching-card";
      button.textContent = cardData.content;
      button.dataset.pair = String(cardData.pair);
      button.dataset.type = cardData.type;

      button.addEventListener("click", () => {
        selectMatchingCard(button);
      });

      matchingCards.appendChild(button);
    });

    updateMatchingCounter();
  }

  function selectMatchingCard(button) {
    if (
      matchingLocked ||
      button.classList.contains("matched") ||
      button.classList.contains("selected")
    ) {
      return;
    }

    button.classList.add("selected");
    selectedMatchingCards.push(button);

    if (selectedMatchingCards.length < 2) {
      return;
    }

    matchingLocked = true;

    const [first, second] = selectedMatchingCards;

    const correctPair =
      first.dataset.pair === second.dataset.pair &&
      first.dataset.type !== second.dataset.type;

    if (correctPair) {
      first.classList.remove("selected");
      second.classList.remove("selected");

      first.classList.add("matched");
      second.classList.add("matched");

      first.disabled = true;
      second.disabled = true;

      matchedPairs += 1;
      selectedMatchingCards = [];
      matchingLocked = false;

      setFeedback(matchingFeedback, "Richtiges Paar!", "correct");
      playFeedbackAudio(true);
      updateMatchingCounter();

      if (matchedPairs === matchingValues.length) {
        completeStage3Button.disabled = false;

        setFeedback(
          matchingFeedback,
          "Super! Du hast alle Paare gefunden.",
          "correct"
        );
      }

      return;
    }

    first.classList.add("wrong");
    second.classList.add("wrong");

    setFeedback(
      matchingFeedback,
      "Diese Karten passen nicht zusammen.",
      "incorrect"
    );
    playFeedbackAudio(false);

    window.setTimeout(() => {
      first.classList.remove("selected", "wrong");
      second.classList.remove("selected", "wrong");

      selectedMatchingCards = [];
      matchingLocked = false;
    }, 900);
  }

  function updateMatchingCounter() {
    matchingRoundCounter.textContent =
      `${matchedPairs} von ${matchingValues.length} Paaren gefunden`;
  }

  restartMatchingButton.addEventListener("click", createMatchingGame);

  completeStage3Button.addEventListener("click", () => {
    completeStage(3);
  });

  /* =======================================================
     11. ETAPA 4 – ASCULTARE
  ======================================================= */

  function createListeningOptions(answer) {
    const alternatives = numbers
      .map((number) => number.value)
      .filter((value) => value !== answer);

    return shuffle([
      answer,
      ...shuffle(alternatives).slice(0, 2)
    ]);
  }

  function renderListeningQuestion() {
    const answer = listeningValues[listeningIndex];

    currentListeningOptions = createListeningOptions(answer);
    listeningCardOverlay.innerHTML = "";

    listeningQuestionCounter.textContent =
      `Frage ${listeningIndex + 1} von ${listeningValues.length}`;

    setFeedback(listeningFeedback, "");

    currentListeningOptions.forEach((option) => {
      const button = document.createElement("button");

      button.type = "button";
      button.className = "listening-answer";
      button.textContent = option;
      button.dataset.value = String(option);
      button.setAttribute("aria-label", `Antwort ${option}`);

      button.addEventListener("click", () => {
        checkListeningAnswer(button, option, answer);
      });

      listeningCardOverlay.appendChild(button);
    });
  }

  function checkListeningAnswer(button, selected, answer) {
    const buttons = listeningCardOverlay.querySelectorAll("button");

    buttons.forEach((item) => {
      item.disabled = true;

      if (Number(item.dataset.value) === answer) {
        item.classList.add("correct");
      }
    });

    if (selected === answer) {
      button.classList.add("correct");
      listeningCorrect += 1;

      setFeedback(listeningFeedback, "Richtig! Sehr gut!", "correct");
      playFeedbackAudio(true);
    } else {
      button.classList.add("incorrect");

      setFeedback(
        listeningFeedback,
        `Die richtige Antwort ist ${answer}.`,
        "incorrect"
      );
      playFeedbackAudio(false);
    }

    window.setTimeout(() => {
      listeningIndex += 1;

      if (listeningIndex < listeningValues.length) {
        renderListeningQuestion();
        playCurrentListeningNumber();
      } else {
        finishListeningActivity();
      }
    }, 1250);
  }

  function playCurrentListeningNumber() {
    const value = listeningValues[listeningIndex];

    playAudio(getNumberAudio(value), playListeningNumberButton);
  }

  function finishListeningActivity() {
    listeningCardOverlay.innerHTML = "";

    listeningQuestionCounter.textContent =
      `${listeningCorrect} von ${listeningValues.length} richtig`;

    setFeedback(
      listeningFeedback,
      "Du hast alle Zahlen gehört.",
      "correct"
    );

    completeStage4Button.disabled = false;
  }

  function resetListeningActivity() {
    listeningIndex = 0;
    listeningCorrect = 0;
    completeStage4Button.disabled = true;

    renderListeningQuestion();
  }

  playListeningNumberButton.addEventListener(
    "click",
    playCurrentListeningNumber
  );

  restartListeningButton.addEventListener(
    "click",
    resetListeningActivity
  );

  completeStage4Button.addEventListener("click", () => {
    completeStage(4);
  });

  /* =======================================================
     12. ETAPA 5 – ȘIRURI NUMERICE
  ======================================================= */

  function renderSequenceRound() {
    const round = sequenceRounds[sequenceIndex];

    sequenceRoundCounter.textContent =
      `Reihe ${sequenceIndex + 1} von ${sequenceRounds.length}`;

    sequenceOverlay.innerHTML = "";
    setFeedback(sequenceFeedback, "");

    round.values.forEach((value, index) => {
      const wrapper = document.createElement("div");

      wrapper.className = "sequence-item";
      wrapper.style.left = `${sequencePositions[index].left}%`;
      wrapper.style.top = `${sequencePositions[index].top}%`;

      if (round.missing.includes(index)) {
        const input = document.createElement("input");

        input.type = "text";
        input.inputMode = "numeric";
        input.maxLength = 2;
        input.dataset.answer = String(value);
        input.setAttribute(
          "aria-label",
          `Fehlende Zahl an Position ${index + 1}`
        );

        input.addEventListener("input", () => {
          input.value = input.value.replace(/\D/g, "").slice(0, 2);
          input.classList.remove("correct", "incorrect");
        });

        wrapper.appendChild(input);
      } else {
        const label = document.createElement("span");
        label.textContent = value;
        wrapper.appendChild(label);
      }

      sequenceOverlay.appendChild(wrapper);
    });
  }

  function checkSequenceRound() {
    const inputs = sequenceOverlay.querySelectorAll("input");
    let allCorrect = true;
    let allFilled = true;

    inputs.forEach((input) => {
      const value = input.value.trim();

      input.classList.remove("correct", "incorrect");

      if (!value) {
        allFilled = false;
        allCorrect = false;
        return;
      }

      if (Number(value) === Number(input.dataset.answer)) {
        input.classList.add("correct");
      } else {
        input.classList.add("incorrect");
        allCorrect = false;
      }
    });

    if (!allFilled) {
      setFeedback(
        sequenceFeedback,
        "Ergänze zuerst alle leeren Felder.",
        "incorrect"
      );
      return;
    }

    if (!allCorrect) {
      setFeedback(
        sequenceFeedback,
        "Fast richtig. Versuche es noch einmal.",
        "incorrect"
      );
      playFeedbackAudio(false);
      return;
    }

    sequenceCorrectRounds += 1;

    setFeedback(sequenceFeedback, "Richtig! Sehr gut!", "correct");
    playFeedbackAudio(true);

    inputs.forEach((input) => {
      input.disabled = true;
    });

    window.setTimeout(() => {
      sequenceIndex += 1;

      if (sequenceIndex < sequenceRounds.length) {
        renderSequenceRound();
      } else {
        finishSequenceActivity();
      }
    }, 1100);
  }

  function finishSequenceActivity() {
    sequenceRoundCounter.textContent =
      `${sequenceCorrectRounds} von ${sequenceRounds.length} Reihen geschafft`;

    setFeedback(
      sequenceFeedback,
      "Super! Du hast alle Zahlenreihen ergänzt.",
      "correct"
    );

    checkSequenceButton.disabled = true;
    completeStage5Button.disabled = false;
  }

  function resetSequenceActivity() {
    sequenceIndex = 0;
    sequenceCorrectRounds = 0;

    checkSequenceButton.disabled = false;
    completeStage5Button.disabled = true;

    renderSequenceRound();
  }

  checkSequenceButton.addEventListener("click", checkSequenceRound);
  restartSequenceButton.addEventListener("click", resetSequenceActivity);

  completeStage5Button.addEventListener("click", () => {
    completeStage(5);
  });

  /* =======================================================
     13. ETAPA 6 – FELIX CUMPĂRĂ
  ======================================================= */

  function renderShoppingActivity() {
    shoppingAnswerOverlay.innerHTML = "";
    shoppingSelections = [];

    shoppingQuestions.forEach((question, index) => {
      const button = document.createElement("button");

      button.type = "button";
      button.className = "shopping-answer";
      button.dataset.index = String(index);
      button.dataset.optionIndex = "0";
      button.textContent = "Wählen";
      button.disabled = index !== shoppingIndex;
      button.setAttribute(
        "aria-label",
        `Antwort für ${question.object} wählen`
      );

      button.addEventListener("click", () => {
        cycleShoppingAnswer(button, question, index);
      });

      shoppingAnswerOverlay.appendChild(button);
    });

    updateShoppingInformation();
  }

  function cycleShoppingAnswer(button, question, index) {
    if (index !== shoppingIndex) {
      return;
    }

    let optionIndex = Number(button.dataset.optionIndex);
    const options = question.options;

    button.textContent = options[optionIndex];
    shoppingSelections[index] = options[optionIndex];

    optionIndex = (optionIndex + 1) % options.length;
    button.dataset.optionIndex = String(optionIndex);

    button.classList.remove("correct", "incorrect");

    if (shoppingSelections[index] === question.answer) {
      button.classList.add("correct");
      button.disabled = true;

      shoppingCorrect += 1;

      setFeedback(shoppingFeedback, "Richtig! Sehr gut!", "correct");
      playFeedbackAudio(true);

      window.setTimeout(() => {
        shoppingIndex += 1;

        if (shoppingIndex < shoppingQuestions.length) {
          const nextButton = shoppingAnswerOverlay.querySelector(
            `[data-index="${shoppingIndex}"]`
          );

          if (nextButton) {
            nextButton.disabled = false;
          }

          updateShoppingInformation();
        } else {
          finishShoppingActivity();
        }
      }, 900);
    } else {
      button.classList.add("incorrect");

      setFeedback(
        shoppingFeedback,
        "Klicke noch einmal und wähle eine andere Zahl.",
        "incorrect"
      );
    }
  }

  function updateShoppingInformation() {
    const question = shoppingQuestions[shoppingIndex];

    if (!question) {
      return;
    }

    shoppingQuestionCounter.textContent =
      `Aufgabe ${shoppingIndex + 1} von ${shoppingQuestions.length}`;

    shoppingSentence.textContent = question.sentence;
    shoppingTranslation.textContent = question.translation;
    setFeedback(shoppingFeedback, "");
  }

  function playCurrentShoppingNumber() {
    const question = shoppingQuestions[shoppingIndex];

    if (!question) {
      return;
    }

    playAudio(
      getNumberAudio(question.answer),
      playShoppingAudioButton
    );
  }

  function finishShoppingActivity() {
    shoppingQuestionCounter.textContent =
      `${shoppingCorrect} von ${shoppingQuestions.length} richtig`;

    shoppingSentence.textContent = "Felix hat alles eingekauft.";
    shoppingTranslation.textContent =
      "Felix a cumpărat toate lucrurile.";

    setFeedback(
      shoppingFeedback,
      "Super! Alle Zahlen sind richtig.",
      "correct"
    );

    completeStage6Button.disabled = false;
  }

  function resetShoppingActivity() {
    shoppingIndex = 0;
    shoppingCorrect = 0;
    shoppingSelections = [];

    completeStage6Button.disabled = true;

    renderShoppingActivity();
  }

  playShoppingAudioButton.addEventListener(
    "click",
    playCurrentShoppingNumber
  );

  restartShoppingButton.addEventListener(
    "click",
    resetShoppingActivity
  );

  completeStage6Button.addEventListener("click", () => {
    completeStage(6);
  });

  /* =======================================================
     14. QUIZ FINAL
  ======================================================= */

  function startQuiz() {
    quizIndex = 0;
    quizScore = 0;
    quizLocked = false;

    quizStartScreen.hidden = true;
    quizResult.hidden = true;
    quizGame.hidden = false;

    quizScoreElement.textContent = "0";
    quizTotalQuestions.textContent = String(quizQuestions.length);

    renderQuizQuestion();
  }

  function renderQuizQuestion() {
    const question = quizQuestions[quizIndex];

    quizLocked = false;

    quizCurrentQuestion.textContent = String(quizIndex + 1);
    quizQuestion.textContent = question.prompt;
    quizQuestionTranslation.textContent = question.translation;
    quizQuestionType.textContent =
      question.type === "audio"
        ? "Höre gut zu."
        : "Wähle die richtige Antwort.";

    quizAnswerOptions.innerHTML = "";
    setFeedback(quizFeedback, "");

    if (question.type === "audio") {
      quizAudioButton.hidden = false;
      quizAudioButton.dataset.value = String(question.audioValue);
    } else {
      quizAudioButton.hidden = true;
      delete quizAudioButton.dataset.value;
    }

    shuffle(question.options).forEach((option) => {
      const button = document.createElement("button");

      button.type = "button";
      button.className = "quiz-answer-button";
      button.textContent = option;

      button.addEventListener("click", () => {
        checkQuizAnswer(button, option, question.answer);
      });

      quizAnswerOptions.appendChild(button);
    });
  }

  function checkQuizAnswer(button, selected, answer) {
    if (quizLocked) {
      return;
    }

    quizLocked = true;

    const buttons = quizAnswerOptions.querySelectorAll("button");

    buttons.forEach((item) => {
      item.disabled = true;

      if (item.textContent === answer) {
        item.classList.add("correct");
      }
    });

    if (selected === answer) {
      button.classList.add("correct");
      quizScore += 1;
      quizScoreElement.textContent = String(quizScore);

      setFeedback(quizFeedback, "Richtig! Sehr gut!", "correct");
      playFeedbackAudio(true);
    } else {
      button.classList.add("incorrect");

      setFeedback(
        quizFeedback,
        `Die richtige Antwort ist ${answer}.`,
        "incorrect"
      );
      playFeedbackAudio(false);
    }

    window.setTimeout(() => {
      quizIndex += 1;

      if (quizIndex < quizQuestions.length) {
        renderQuizQuestion();
      } else {
        finishQuiz();
      }
    }, 1300);
  }

  function finishQuiz() {
    quizGame.hidden = true;
    quizResult.hidden = false;

    finalScore.textContent = String(quizScore);

    if (quizScore > state.quizBestScore) {
      state.quizBestScore = quizScore;
    }

    state.lessonFinished = true;

    if (!state.completedStages.includes(7)) {
      state.completedStages.push(7);
      state.completedStages.sort((a, b) => a - b);
    }

    markNavigationCompleted(7);
    updateProgress();
    saveState();

    diplomaScore.textContent = `${quizScore}/${quizQuestions.length}`;
    diplomaDate.textContent = new Intl.DateTimeFormat("de-DE").format(
      new Date()
    );

    if (quizScore === quizQuestions.length) {
      quizResultMessage.textContent =
        "Perfekt! Du bist ein Zahlen-Meister.";

      openDiplomaButton.hidden = false;
    } else if (quizScore >= 7) {
      quizResultMessage.textContent =
        "Sehr gut! Versuche das Quiz noch einmal für das Diplom.";

      openDiplomaButton.hidden = true;
    } else {
      quizResultMessage.textContent =
        "Übe noch ein bisschen und versuche es noch einmal.";

      openDiplomaButton.hidden = true;
    }

    lessonComplete.hidden = false;

    window.setTimeout(() => {
      scrollToElement(quizResult);
    }, 200);
  }

  quizAudioButton.addEventListener("click", () => {
    const value = Number(quizAudioButton.dataset.value);

    if (Number.isFinite(value)) {
      playAudio(getNumberAudio(value), quizAudioButton);
    }
  });

  startQuizButton.addEventListener("click", startQuiz);
  restartQuizButton.addEventListener("click", startQuiz);

  /* =======================================================
     15. DIPLOMĂ
  ======================================================= */

  function openDiploma() {
    if (quizScore !== quizQuestions.length && state.quizBestScore < 10) {
      return;
    }

    const savedName = state.studentName.trim();

    if (savedName) {
      studentNameInput.value = savedName;
      diplomaStudentName.textContent = savedName;
    }

    diplomaScore.textContent = "10/10";
    diplomaDate.textContent = new Intl.DateTimeFormat("de-DE").format(
      new Date()
    );

    diplomaModal.hidden = false;
    document.body.classList.add("modal-open");

    window.setTimeout(() => {
      closeDiplomaButton.focus();
    }, 50);
  }

  function closeDiploma() {
    diplomaModal.hidden = true;
    document.body.classList.remove("modal-open");
    openDiplomaButton.focus();
  }

  function applyStudentName() {
    const name = studentNameInput.value.trim();

    if (!name) {
      showToast("Bitte gib deinen Namen ein.", "incorrect");
      studentNameInput.focus();
      return;
    }

    state.studentName = name;
    diplomaStudentName.textContent = name;
    saveState();

    showToast("Der Name wurde eingetragen.", "correct");
  }

  openDiplomaButton.addEventListener("click", openDiploma);
  closeDiplomaButton.addEventListener("click", closeDiploma);
  applyStudentNameButton.addEventListener("click", applyStudentName);

  printDiplomaButton.addEventListener("click", () => {
    window.print();
  });

  diplomaModal.querySelectorAll("[data-close-modal]").forEach((element) => {
    element.addEventListener("click", closeDiploma);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !diplomaModal.hidden) {
      closeDiploma();
    }
  });

  /* =======================================================
     16. RESTAURAREA PROGRESULUI
  ======================================================= */

  function restoreSavedNumberCards() {
    document.querySelectorAll(".number-card").forEach((card) => {
      const value = Number(card.dataset.value);

      if (state.visitedNumbers.includes(value)) {
        card.classList.add("visited");
      }
    });

    updateVisitedNumberProgress();
  }

  function restoreLessonState() {
    if (!state.started) {
      lessonNavigation.hidden = true;
      lessonContent.hidden = true;
      updateProgress();
      return;
    }

    lessonNavigation.hidden = false;
    lessonContent.hidden = false;

    unlockSavedStages();
    restoreSavedNumberCards();
    updateProgress();

    if (state.studentName) {
      studentNameInput.value = state.studentName;
      diplomaStudentName.textContent = state.studentName;
    }

    if (state.quizBestScore === 10) {
      openDiplomaButton.hidden = false;
    }
  }

  /* =======================================================
     17. INIȚIALIZAREA LECȚIEI
  ======================================================= */

  function initializeLesson() {
    createNumberCards();
    createNumberLineLabels();

    renderCountingQuestion();
    createMatchingGame();
    renderListeningQuestion();
    renderSequenceRound();
    renderShoppingActivity();

    quizTotalQuestions.textContent = String(quizQuestions.length);

    diplomaDate.textContent = new Intl.DateTimeFormat("de-DE").format(
      new Date()
    );

    restoreLessonState();
  }

  initializeLesson();
});
