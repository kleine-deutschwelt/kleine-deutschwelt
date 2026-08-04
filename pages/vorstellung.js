const allNames = [
  "Sarah",
  "Daniel",
  "Martin",
  "Johanna",
  "Lilly",
  "Lukas",
  "Leonie",
  "Stefan",
  "Emma",
  "Jonas"
];

/*
Numele auzite în exercițiul Start 2b
din manualul Beste Freunde A1.1.
*/

const heardNames = new Set([
  "Emma",
  "Daniel",
  "Lilly",
  "Leonie",
  "Lukas",
  "Stefan",
  "Sarah"
]);

const activityState = {
  speaker: false,
  fill: false,
  structure: false
};

const reviewQuestions = [
  {
    visual: "👦",
    question: "Jonas se prezintă. Ce spune?",
    options: [
      "Hallo, ich bin Jonas.",
      "Das ist Jonas.",
      "Ich ist Jonas."
    ],
    answer: "Hallo, ich bin Jonas."
  },
  {
    visual: "👧 ➜ 👦",
    question: "Johanna îl prezintă pe Jonas. Ce spune?",
    options: [
      "Ich bin Jonas.",
      "Das ist Jonas.",
      "Jonas bin ich."
    ],
    answer: "Das ist Jonas."
  },
  {
    visual: "👧",
    question: "Completează: Und ich ___ Johanna.",
    options: [
      "bin",
      "ist",
      "das"
    ],
    answer: "bin"
  },
  {
    visual: "👋",
    question: "Cine spune doar „Hallo!” în dialog?",
    options: [
      "Leonie",
      "Jonas",
      "Johanna"
    ],
    answer: "Leonie"
  },
  {
    visual: "👦 👧 👧",
    question: "Care este ordinea personajelor din dialog?",
    options: [
      "Jonas – Johanna – Leonie",
      "Leonie – Jonas – Johanna",
      "Johanna – Leonie – Jonas"
    ],
    answer: "Jonas – Johanna – Leonie"
  }
];

const completed = new Set();

let currentAudio = null;
let namesStarted = false;
let reviewIndex = 0;
let reviewScore = 0;

/* Generează cardurile cu nume */

document.getElementById("nameGrid").innerHTML =
  allNames
    .map(
      (name) => `
        <button
          class="name-button"
          type="button"
          data-name="${name}"
          onclick="toggleName(this)"
        >
          ${name}
        </button>
      `
    )
    .join("");

/* Redarea fișierelor audio */

function playAudio(audioPath) {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }

  currentAudio = new Audio(audioPath);

  currentAudio.play().catch((error) => {
    console.error(
      "Fișierul audio nu a putut fi redat:",
      audioPath,
      error
    );
  });
}

/* Pornirea lecției */

function beginLesson() {
  completeSection("intro", "dialogue");

  playAudio(
    "../audio/vorstellung/messages/intro-vorstellung.mp3"
  );
}

/* Deblocarea următoarei secțiuni */

function completeSection(sectionName, nextSectionId) {
  completed.add(sectionName);
  updateProgress();

  const nextSection =
    document.getElementById(nextSectionId);

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

/* Actualizarea progresului */

function updateProgress() {
  const percentage = Math.round(
    (completed.size / 6) * 100
  );

  document.getElementById(
    "progressBar"
  ).style.width = `${percentage}%`;

  document.getElementById(
    "progressText"
  ).textContent =
    `Lektionsfortschritt: ${percentage}%`;
}

/* Pornirea activității cu nume */

function startNameActivity() {
  namesStarted = true;

  document.getElementById(
    "checkNamesButton"
  ).disabled = false;

  document.getElementById(
    "namesInstruction"
  ).textContent =
    "Selectează toate numele pe care le auzi în fișierul audio.";

  playAudio(
    "../audio/vorstellung/names/namen-auswahl.mp3"
  );
}

/* Selectarea unui nume */

function toggleName(button) {
  if (!namesStarted) {
    document.getElementById(
      "namesInstruction"
    ).textContent =
      "Ascultă mai întâi exercițiul audio.";

    return;
  }

  button.classList.remove(
    "correct",
    "wrong"
  );

  button.classList.toggle("selected");
}

/* Verificarea numelor selectate */

function checkNames() {
  const buttons = [
    ...document.querySelectorAll(".name-button")
  ];

  const selected = new Set(
    buttons
      .filter((button) =>
        button.classList.contains("selected")
      )
      .map((button) => button.dataset.name)
  );

  const isCorrect =
    selected.size === heardNames.size &&
    [...heardNames].every((name) =>
      selected.has(name)
    );

  buttons.forEach((button) => {
    button.classList.remove(
      "correct",
      "wrong"
    );

    if (heardNames.has(button.dataset.name)) {
      button.classList.add("correct");
    } else if (
      selected.has(button.dataset.name)
    ) {
      button.classList.add("wrong");
    }
  });

  const feedback =
    document.getElementById("namesFeedback");

  if (isCorrect) {
    feedback.textContent =
      "Sehr gut! Ai recunoscut toate numele. ⭐";

    feedback.style.color = "#258a45";

    document.getElementById(
      "namesDone"
    ).disabled = false;
  } else {
    feedback.textContent =
      "Mai ascultă o dată și încearcă din nou.";

    feedback.style.color = "#cc453c";
  }
}

/* Activitatea Wer spricht? */

function checkSpeaker(button, isCorrect) {
  document
    .querySelectorAll(".portrait-row button")
    .forEach((item) => {
      item.classList.remove(
        "correct",
        "wrong"
      );
    });

  button.classList.add(
    isCorrect ? "correct" : "wrong"
  );

  document.getElementById(
    "speakerFeedback"
  ).textContent = isCorrect
    ? "Richtig! Jonas spune: „Hallo, ich bin Jonas.” ⭐"
    : "Ascultă încă o dată. Mai încearcă!";

  if (isCorrect) {
    activityState.speaker = true;
    updateActivities();
  }
}

/* Activitatea de completare a dialogului */

function checkDialogueFill() {
  const selects = [
    ...document.querySelectorAll(
      "#activities select[data-answer]"
    )
  ];

  const correctAnswers = selects.filter(
    (select) => {
      const isCorrect =
        select.value === select.dataset.answer;

      select.style.borderColor = isCorrect
        ? "#258a45"
        : "#cc453c";

      return isCorrect;
    }
  ).length;

  const feedback =
    document.getElementById("fillFeedback");

  if (correctAnswers === selects.length) {
    feedback.textContent =
      "Sehr gut! Dialogul este complet. ⭐";

    activityState.fill = true;
    updateActivities();
  } else {
    feedback.textContent =
      `Ai ${correctAnswers} din ${selects.length} răspunsuri corecte. Mai încearcă!`;
  }
}

/* Activitatea Ich bin / Das ist */

function checkStructure(button, isCorrect) {
  button
    .closest(".choice-row")
    .querySelectorAll("button")
    .forEach((item) => {
      item.classList.remove(
        "correct",
        "wrong"
      );
    });

  button.classList.add(
    isCorrect ? "correct" : "wrong"
  );

  document.getElementById(
    "structureFeedback"
  ).textContent = isCorrect
    ? "Richtig! Johanna îl prezintă pe Jonas: „Das ist Jonas.” ⭐"
    : "Privește gestul Johannei și încearcă din nou.";

  if (isCorrect) {
    activityState.structure = true;
    updateActivities();
  }
}

/* Deblocarea recapitulării */

function updateActivities() {
  const allActivitiesCorrect =
    Object.values(activityState).every(Boolean);

  if (allActivitiesCorrect) {
    document.getElementById(
      "activityDone"
    ).disabled = false;
  }
}

/* Afișarea întrebărilor testului */

function renderReview() {
  const currentQuestion =
    reviewQuestions[reviewIndex];

  document.getElementById(
    "reviewVisual"
  ).textContent = currentQuestion.visual;

  document.getElementById(
    "reviewQuestion"
  ).textContent = currentQuestion.question;

  document.getElementById(
    "reviewFeedback"
  ).textContent = "";

  document.getElementById(
    "reviewCounter"
  ).textContent =
    `Întrebarea ${reviewIndex + 1} din ${reviewQuestions.length}`;

  const alternatives = [
    ...currentQuestion.options
  ].sort(() => Math.random() - 0.5);

  document.getElementById(
    "reviewOptions"
  ).innerHTML = alternatives
    .map(
      (option) => `
        <button
          type="button"
          data-answer="${option}"
        >
          ${option}
        </button>
      `
    )
    .join("");

  document
    .querySelectorAll("#reviewOptions button")
    .forEach((button) => {
      button.addEventListener("click", () => {
        answerReview(
          button,
          button.dataset.answer
        );
      });
    });
}

/* Verificarea răspunsului din test */

function answerReview(button, answer) {
  const currentQuestion =
    reviewQuestions[reviewIndex];

  const optionButtons = [
    ...document.querySelectorAll(
      "#reviewOptions button"
    )
  ];

  optionButtons.forEach((item) => {
    item.disabled = true;
  });

  if (answer === currentQuestion.answer) {
    button.classList.add("correct");
    reviewScore += 1;

    document.getElementById(
      "reviewFeedback"
    ).textContent = "Richtig! ⭐";
  } else {
    button.classList.add("wrong");

    const correctButton = optionButtons.find(
      (item) =>
        item.textContent.trim() ===
        currentQuestion.answer
    );

    if (correctButton) {
      correctButton.classList.add("correct");
    }

    document.getElementById(
      "reviewFeedback"
    ).textContent =
      `Răspunsul corect este „${currentQuestion.answer}”.`;
  }

  setTimeout(() => {
    reviewIndex += 1;

    if (
      reviewIndex < reviewQuestions.length
    ) {
      renderReview();
    } else {
      finishReview();
    }
  }, 1100);
}

/* Rezultatul testului */

function finishReview() {
  completed.add("review");
  updateProgress();

  const finishSection =
    document.getElementById("finish");

  const diplomaButton =
    document.getElementById("diplomaButton");

  const diplomaMessage =
    document.getElementById("diplomaMessage");

  const retryButton =
    document.getElementById("retryTestButton");

  const resultText =
    finishSection.querySelector(".romanian");

  finishSection.classList.remove("locked");
  finishSection.classList.add("unlocked");

  if (reviewScore === 5) {
    diplomaButton.disabled = false;

    diplomaMessage.textContent =
      "Perfect! Ai obținut 100%. Mini-diploma este deblocată!";

    diplomaMessage.style.color = "#258a45";

    resultText.textContent =
      "Ai răspuns corect la toate cele 5 întrebări. Bravo!";

    retryButton.classList.add("hidden");

    playAudio(
      "../audio/vorstellung/messages/super-gemacht.mp3"
    );
  } else {
    diplomaButton.disabled = true;

    diplomaMessage.textContent =
      `Ai obținut ${reviewScore}/5. Pentru diplomă trebuie să obții 5/5.`;

    diplomaMessage.style.color = "#cc453c";

    resultText.textContent =
      `Ai răspuns corect la ${reviewScore} din 5 întrebări.`;

    retryButton.classList.remove("hidden");
  }

  finishSection.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

/* Repetarea testului */

function retryReview() {
  reviewIndex = 0;
  reviewScore = 0;

  const finishSection =
    document.getElementById("finish");

  finishSection.classList.add("locked");
  finishSection.classList.remove("unlocked");

  document.getElementById(
    "diplomaButton"
  ).disabled = true;

  document.getElementById(
    "review"
  ).scrollIntoView({
    behavior: "smooth",
    block: "start"
  });

  renderReview();
}

/* Deschiderea diplomei */

function openDiploma() {
  if (reviewScore !== 5) {
    return;
  }

  const diplomaModal =
    document.getElementById("diplomaModal");

  document.getElementById(
    "diplomaDate"
  ).textContent =
    `Ausgestellt am ${new Date().toLocaleDateString(
      "de-DE",
      {
        day: "2-digit",
        month: "long",
        year: "numeric"
      }
    )}`;

  diplomaModal.classList.add("open");

  diplomaModal.setAttribute(
    "aria-hidden",
    "false"
  );

  document.body.classList.add(
    "diploma-open"
  );
}

/* Închiderea diplomei */

function closeDiploma() {
  const diplomaModal =
    document.getElementById("diplomaModal");

  diplomaModal.classList.remove("open");

  diplomaModal.setAttribute(
    "aria-hidden",
    "true"
  );

  document.body.classList.remove(
    "diploma-open"
  );
}

/* Imprimarea diplomei */

function printDiploma() {
  window.print();
}

/* Reluarea lecției */

function restartLesson() {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

  setTimeout(() => {
    window.location.reload();
  }, 500);
}

/* Pornirea testului după deblocare */

const reviewSection =
  document.getElementById("review");

const reviewObserver =
  new MutationObserver(() => {
    if (
      reviewSection.classList.contains(
        "unlocked"
      ) &&
      reviewIndex === 0
    ) {
      renderReview();
    }
  });

reviewObserver.observe(reviewSection, {
  attributes: true,
  attributeFilter: ["class"]
});

/* Închiderea diplomei cu Escape */

document.addEventListener(
  "keydown",
  (event) => {
    if (event.key === "Escape") {
      closeDiploma();
    }
  }
);
