const colors = [
  { de: "rot", ro: "roșu", hex: "#e53935" },
  { de: "blau", ro: "albastru", hex: "#3297db" },
  { de: "gelb", ro: "galben", hex: "#f7cf36" },
  { de: "grün", ro: "verde", hex: "#55ad5b" },
  { de: "orange", ro: "portocaliu", hex: "#f28b30" },
  { de: "lila", ro: "violet", hex: "#9b6bc3" },
  { de: "rosa", ro: "roz", hex: "#f39abd" },
  { de: "braun", ro: "maro", hex: "#8b5a3c" },
  { de: "schwarz", ro: "negru", hex: "#252525" },
  { de: "weiß", ro: "alb", hex: "#f8f8f3" }
];

const examples = [
  {
    icon: "🍎",
    de: "Der Apfel ist rot.",
    ro: "Mărul este roșu."
  },
  {
    icon: "🚙",
    de: "Das Auto ist blau.",
    ro: "Mașina este albastră."
  },
  {
    icon: "☀️",
    de: "Die Sonne ist gelb.",
    ro: "Soarele este galben."
  },
  {
    icon: "🍃",
    de: "Das Blatt ist grün.",
    ro: "Frunza este verde."
  },
  {
    icon: "🥕",
    de: "Die Karotte ist orange.",
    ro: "Morcovul este portocaliu."
  },
  {
    icon: "🎈",
    de: "Der Luftballon ist lila.",
    ro: "Balonul este violet."
  },
  {
    icon: "🌸",
    de: "Die Blume ist rosa.",
    ro: "Floarea este roz."
  },
  {
    icon: "🐻",
    de: "Der Bär ist braun.",
    ro: "Ursul este maro."
  },
  {
    icon: "🐈‍⬛",
    de: "Die Katze ist schwarz.",
    ro: "Pisica este neagră."
  },
  {
    icon: "🐇",
    de: "Das Kaninchen ist weiß.",
    ro: "Iepurele este alb."
  }
];

const completed = new Set();

const activityState = {
  sun: false,
  fill: false,
  object: false
};

let reviewIndex = 0;
let reviewScore = 0;

const reviewQuestions = [
  colors[0],
  colors[3],
  colors[5],
  colors[8],
  colors[9]
];

/* Generează cele 10 carduri de vocabular */

document.getElementById("colorGrid").innerHTML = colors
  .map(
    (color) => `
      <article class="color-card">
        <span
          class="color-swatch"
          style="background: ${color.hex};"
        ></span>

        <button
          class="sound-button"
          onclick="speak('${color.de}')"
          aria-label="Ascultă ${color.de}"
        >
          🔊
        </button>

        <span class="color-word">${color.de}</span>
        <span class="translation">${color.ro}</span>
      </article>
    `
  )
  .join("");

/* Generează cele 10 exemple vizuale */

document.getElementById("examplesGrid").innerHTML = examples
  .map(
    (item) => `
      <article class="example-card">
        <span class="example-emoji">${item.icon}</span>

        <div>
          <p>${item.de}</p>
          <small>${item.ro}</small>
        </div>

        <button
          class="mini-sound"
          onclick="speak('${item.de}')"
          aria-label="Ascultă propoziția"
        >
          🔊
        </button>
      </article>
    `
  )
  .join("");

/* Pronunție în limba germană */

function speak(text) {
  if (!("speechSynthesis" in window)) {
    alert("Browserul tău nu permite redarea pronunției.");
    return;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);

  utterance.lang = "de-DE";
  utterance.rate = 0.82;

  window.speechSynthesis.speak(utterance);
}

/* Începe lecția */

function beginLesson() {
  completeSection("intro", "vocabulary");
  speak("Hallo! Heute lernen wir die Farben!");
}

/* Finalizează vocabularul */

function finishVocabulary() {
  completeSection("vocabulary", "examples");
}

/* Deblochează următoarea secțiune */

function completeSection(sectionName, nextSectionId) {
  completed.add(sectionName);
  updateProgress();

  const nextSection = document.getElementById(nextSectionId);

  if (!nextSection) {
    return;
  }

  nextSection.classList.remove("locked");
  nextSection.classList.add("unlocked");

  setTimeout(() => {
    nextSection.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }, 100);
}

/* Actualizează progresul lecției */

function updateProgress() {
  const percentage = Math.round(
    (completed.size / 5) * 100
  );

  document.getElementById("progressBar").style.width =
    `${percentage}%`;

  document.getElementById("progressText").textContent =
    `Lektionsfortschritt: ${percentage}%`;
}

/* Activitatea 1 */

function checkChoice(button, isCorrect) {
  const activityBox = button.closest(".activity-box");

  activityBox
    .querySelectorAll(".choice-row button")
    .forEach((item) => {
      item.classList.remove("correct", "wrong");
    });

  if (isCorrect) {
    button.classList.add("correct");

    activityBox.querySelector(".feedback").textContent =
      "Richtig! Die Sonne ist gelb. ☀️";

    activityState.sun = true;
    updateActivities();
  } else {
    button.classList.add("wrong");

    activityBox.querySelector(".feedback").textContent =
      "Versuche noch einmal! Mai încearcă.";
  }
}

/* Activitatea 2 */

function checkSelects() {
  const selects = [
    ...document.querySelectorAll("select[data-answer]")
  ];

  const correctAnswers = selects.filter((select) => {
    const isCorrect =
      select.value === select.dataset.answer;

    select.style.borderColor = isCorrect
      ? "#258a45"
      : "#cc453c";

    return isCorrect;
  }).length;

  const feedback =
    document.getElementById("fillFeedback");

  if (correctAnswers === selects.length) {
    feedback.textContent =
      "Sehr gut! Toate propozițiile sunt corecte. ⭐";

    activityState.fill = true;
    updateActivities();
  } else {
    feedback.textContent =
      `Ai ${correctAnswers} din ${selects.length} răspunsuri corecte. Mai încearcă!`;
  }
}

/* Activitatea 3 */

function checkObject(button, isCorrect) {
  document
    .querySelectorAll(".object-row button")
    .forEach((item) => {
      item.classList.remove("correct", "wrong");
    });

  if (isCorrect) {
    button.classList.add("correct");

    document.getElementById("objectFeedback").textContent =
      "Richtig! Der Apfel ist rot. 🍎";

    activityState.object = true;
    updateActivities();
  } else {
    button.classList.add("wrong");

    document.getElementById("objectFeedback").textContent =
      "Nu este rot. Încearcă alt obiect!";
  }
}

/* Verifică dacă toate activitățile sunt rezolvate */

function updateActivities() {
  const allActivitiesCompleted =
    Object.values(activityState).every(Boolean);

  if (allActivitiesCompleted) {
    document.getElementById("activityDone").disabled =
      false;
  }
}

/* Afișează întrebările de recapitulare */

function renderReview() {
  const currentQuestion =
    reviewQuestions[reviewIndex];

  document.getElementById(
    "reviewSwatch"
  ).style.background = currentQuestion.hex;

  document.getElementById(
    "reviewFeedback"
  ).textContent = "";

  document.getElementById(
    "reviewCounter"
  ).textContent =
    `Întrebarea ${reviewIndex + 1} din ${reviewQuestions.length}`;

  const alternatives = [
    currentQuestion,
    ...colors
      .filter(
        (color) =>
          color.de !== currentQuestion.de
      )
      .sort(() => Math.random() - 0.5)
      .slice(0, 2)
  ].sort(() => Math.random() - 0.5);

  document.getElementById(
    "reviewOptions"
  ).innerHTML = alternatives
    .map(
      (option) => `
        <button
          onclick="answerReview(
            this,
            '${option.de}',
            '${currentQuestion.de}'
          )"
        >
          ${option.de}
        </button>
      `
    )
    .join("");
}

/* Verifică răspunsul din recapitulare */

function answerReview(button, answer, correctAnswer) {
  const optionButtons = [
    ...document.querySelectorAll(
      "#reviewOptions button"
    )
  ];

  optionButtons.forEach((item) => {
    item.disabled = true;
  });

  if (answer === correctAnswer) {
    button.classList.add("correct");

    reviewScore++;

    document.getElementById(
      "reviewFeedback"
    ).textContent = "Richtig! ⭐";
  } else {
    button.classList.add("wrong");

    const correctButton = optionButtons.find(
      (item) =>
        item.textContent.trim() === correctAnswer
    );

    if (correctButton) {
      correctButton.classList.add("correct");
    }

    document.getElementById(
      "reviewFeedback"
    ).textContent =
      `Răspunsul corect este „${correctAnswer}”.`;
  }

  setTimeout(() => {
    reviewIndex++;

    if (reviewIndex < reviewQuestions.length) {
      renderReview();
    } else {
      finishReview();
    }
  }, 1100);
}

/* Finalizează recapitularea */

function finishReview() {
  completed.add("review");
  updateProgress();

  const finishSection =
    document.getElementById("finish");

  finishSection.classList.remove("locked");
  finishSection.classList.add("unlocked");

  finishSection.querySelector(
    ".romanian"
  ).textContent =
    `Ai răspuns corect la ${reviewScore} din 5 întrebări. Bravo!`;

  finishSection.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });

  speak(
    "Super gemacht! Du kennst jetzt die Farben!"
  );
}

/* Repornește lecția */

function restartLesson() {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

  setTimeout(() => {
    window.location.reload();
  }, 500);
}

/* Pornește recapitularea când secțiunea este deblocată */

const reviewSection =
  document.getElementById("review");

const reviewObserver = new MutationObserver(() => {
  if (
    reviewSection.classList.contains("unlocked") &&
    reviewIndex === 0
  ) {
    renderReview();
  }
});

reviewObserver.observe(reviewSection, {
  attributes: true,
  attributeFilter: ["class"]
});
