const colors = [
  { de: "rot", ro: "roșu", hex: "#e53935", audio: "../audio/farben/words/rot.mp3" },
  { de: "blau", ro: "albastru", hex: "#3297db", audio: "../audio/farben/words/blau.mp3" },
  { de: "gelb", ro: "galben", hex: "#f7cf36", audio: "../audio/farben/words/gelb.mp3" },
  { de: "grün", ro: "verde", hex: "#55ad5b", audio: "../audio/farben/words/gruen.mp3" },
  { de: "orange", ro: "portocaliu", hex: "#f28b30", audio: "../audio/farben/words/orange.mp3" },
  { de: "lila", ro: "violet", hex: "#9b6bc3", audio: "../audio/farben/words/lila.mp3" },
  { de: "rosa", ro: "roz", hex: "#f39abd", audio: "../audio/farben/words/rosa.mp3" },
  { de: "braun", ro: "maro", hex: "#8b5a3c", audio: "../audio/farben/words/braun.mp3" },
  { de: "schwarz", ro: "negru", hex: "#252525", audio: "../audio/farben/words/schwarz.mp3" },
  { de: "weiß", ro: "alb", hex: "#f8f8f3", audio: "../audio/farben/words/weiss.mp3" }
];

const examples = [
  { image: "../assets/images/lessons/farben/examples/apfel-rot.webp", de: "Der Apfel ist rot.", ro: "Mărul este roșu.", audio: "../audio/farben/examples/apfel-rot.mp3" },
  { image: "../assets/images/lessons/farben/examples/auto-blau.webp", de: "Das Auto ist blau.", ro: "Mașina este albastră.", audio: "../audio/farben/examples/auto-blau.mp3" },
  { image: "../assets/images/lessons/farben/examples/sonne-gelb.webp", de: "Die Sonne ist gelb.", ro: "Soarele este galben.", audio: "../audio/farben/examples/sonne-gelb.mp3" },
  { image: "../assets/images/lessons/farben/examples/blatt-gruen.webp", de: "Das Blatt ist grün.", ro: "Frunza este verde.", audio: "../audio/farben/examples/blatt-gruen.mp3" },
  { image: "../assets/images/lessons/farben/examples/karotte-orange.webp", de: "Die Karotte ist orange.", ro: "Morcovul este portocaliu.", audio: "../audio/farben/examples/karotte-orange.mp3" },
  { image: "../assets/images/lessons/farben/examples/luftballon-lila.webp", de: "Der Luftballon ist lila.", ro: "Balonul este violet.", audio: "../audio/farben/examples/luftballon-lila.mp3" },
  { image: "../assets/images/lessons/farben/examples/blume-rosa.webp", de: "Die Blume ist rosa.", ro: "Floarea este roz.", audio: "../audio/farben/examples/blume-rosa.mp3" },
  { image: "../assets/images/lessons/farben/examples/baer-braun.webp", de: "Der Bär ist braun.", ro: "Ursul este maro.", audio: "../audio/farben/examples/baer-braun.mp3" },
  { image: "../assets/images/lessons/farben/examples/katze-schwarz.webp", de: "Die Katze ist schwarz.", ro: "Pisica este neagră.", audio: "../audio/farben/examples/katze-schwarz.mp3" },
  { image: "../assets/images/lessons/farben/examples/kaninchen-weiss.webp", de: "Das Kaninchen ist weiß.", ro: "Iepurele este alb.", audio: "../audio/farben/examples/kaninchen-weiss.mp3" }
];

const completed = new Set();
const activityState = { sun: false, fill: false, object: false };
const reviewQuestions = [colors[0], colors[3], colors[5], colors[8], colors[9]];

let currentAudio = null;
let reviewIndex = 0;
let reviewScore = 0;

document.getElementById("colorGrid").innerHTML = colors.map((color) => `
  <article class="color-card">
    <span class="color-swatch" style="background:${color.hex}"></span>
    <button class="sound-button" type="button" onclick="playAudio('${color.audio}')" aria-label="Ascultă ${color.de}">🔊</button>
    <span class="color-word">${color.de}</span>
    <span class="translation">${color.ro}</span>
  </article>
`).join("");

document.getElementById("examplesGrid").innerHTML = examples.map((item) => `
  <article class="example-card">
    <img class="example-image" src="${item.image}" alt="${item.de}" loading="lazy">
    <div>
      <p>${item.de}</p>
      <small>${item.ro}</small>
    </div>
    <button class="mini-sound" type="button" onclick="playAudio('${item.audio}')" aria-label="Ascultă propoziția ${item.de}">🔊</button>
  </article>
`).join("");

function playAudio(audioPath) {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }

  currentAudio = new Audio(audioPath);
  currentAudio.play().catch((error) => {
    console.error("Fișierul audio nu a putut fi redat:", audioPath, error);
  });
}

function beginLesson() {
  completeSection("intro", "vocabulary");
  playAudio("../audio/farben/messages/intro-farben.mp3");
}

function finishVocabulary() {
  completeSection("vocabulary", "examples");
}

function completeSection(sectionName, nextSectionId) {
  completed.add(sectionName);
  updateProgress();

  const nextSection = document.getElementById(nextSectionId);
  if (!nextSection) return;

  nextSection.classList.remove("locked");
  nextSection.classList.add("unlocked");

  setTimeout(() => {
    nextSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 100);
}

function updateProgress() {
  const percentage = Math.round((completed.size / 5) * 100);
  document.getElementById("progressBar").style.width = `${percentage}%`;
  document.getElementById("progressText").textContent = `Lektionsfortschritt: ${percentage}%`;
}

function checkChoice(button, isCorrect) {
  const activityBox = button.closest(".activity-box");
  activityBox.querySelectorAll(".choice-row button").forEach((item) => item.classList.remove("correct", "wrong"));

  button.classList.add(isCorrect ? "correct" : "wrong");
  activityBox.querySelector(".feedback").textContent = isCorrect
    ? "Richtig! Die Sonne ist gelb. ☀️"
    : "Versuche noch einmal! Mai încearcă.";

  if (isCorrect) {
    activityState.sun = true;
    updateActivities();
  }
}

function checkSelects() {
  const selects = [...document.querySelectorAll("select[data-answer]")];
  const correctAnswers = selects.filter((select) => {
    const isCorrect = select.value === select.dataset.answer;
    select.style.borderColor = isCorrect ? "#258a45" : "#cc453c";
    return isCorrect;
  }).length;

  const feedback = document.getElementById("fillFeedback");
  if (correctAnswers === selects.length) {
    feedback.textContent = "Sehr gut! Toate propozițiile sunt corecte. ⭐";
    activityState.fill = true;
    updateActivities();
  } else {
    feedback.textContent = `Ai ${correctAnswers} din ${selects.length} răspunsuri corecte. Mai încearcă!`;
  }
}

function checkObject(button, isCorrect) {
  document.querySelectorAll(".object-row button").forEach((item) => item.classList.remove("correct", "wrong"));
  button.classList.add(isCorrect ? "correct" : "wrong");

  document.getElementById("objectFeedback").textContent = isCorrect
    ? "Richtig! Der Apfel ist rot."
    : "Nu este rot. Încearcă alt obiect!";

  if (isCorrect) {
    activityState.object = true;
    updateActivities();
  }
}

function updateActivities() {
  if (Object.values(activityState).every(Boolean)) {
    document.getElementById("activityDone").disabled = false;
  }
}

function renderReview() {
  const currentQuestion = reviewQuestions[reviewIndex];
  document.getElementById("reviewSwatch").style.background = currentQuestion.hex;
  document.getElementById("reviewFeedback").textContent = "";
  document.getElementById("reviewCounter").textContent = `Întrebarea ${reviewIndex + 1} din ${reviewQuestions.length}`;

  const alternatives = [
    currentQuestion,
    ...colors.filter((color) => color.de !== currentQuestion.de).sort(() => Math.random() - 0.5).slice(0, 2)
  ].sort(() => Math.random() - 0.5);

  document.getElementById("reviewOptions").innerHTML = alternatives.map((option) => `
    <button type="button" onclick="answerReview(this, '${option.de}', '${currentQuestion.de}')">${option.de}</button>
  `).join("");
}

function answerReview(button, answer, correctAnswer) {
  const optionButtons = [...document.querySelectorAll("#reviewOptions button")];
  optionButtons.forEach((item) => { item.disabled = true; });

  if (answer === correctAnswer) {
    button.classList.add("correct");
    reviewScore += 1;
    document.getElementById("reviewFeedback").textContent = "Richtig! ⭐";
  } else {
    button.classList.add("wrong");
    const correctButton = optionButtons.find((item) => item.textContent.trim() === correctAnswer);
    if (correctButton) correctButton.classList.add("correct");
    document.getElementById("reviewFeedback").textContent = `Răspunsul corect este „${correctAnswer}”.`;
  }

  setTimeout(() => {
    reviewIndex += 1;
    if (reviewIndex < reviewQuestions.length) renderReview();
    else finishReview();
  }, 1100);
}

function finishReview() {
  completed.add("review");
  updateProgress();

  const finishSection = document.getElementById("finish");
  const diplomaButton = document.getElementById("diplomaButton");
  const diplomaMessage = document.getElementById("diplomaMessage");
  const retryButton = document.getElementById("retryTestButton");
  const resultText = finishSection.querySelector(".romanian");

  finishSection.classList.remove("locked");
  finishSection.classList.add("unlocked");

  if (reviewScore === 5) {
    diplomaButton.disabled = false;
    diplomaMessage.textContent = "Perfect! Ai obținut 100%. Mini-diploma este deblocată!";
    diplomaMessage.style.color = "#258a45";
    resultText.textContent = "Ai răspuns corect la toate cele 5 întrebări. Bravo!";
    retryButton.classList.add("hidden");
    playAudio("../audio/farben/messages/super-gemacht.mp3");
  } else {
    diplomaButton.disabled = true;
    diplomaMessage.textContent = `Ai obținut ${reviewScore}/5. Pentru diplomă trebuie să obții 5/5.`;
    diplomaMessage.style.color = "#cc453c";
    resultText.textContent = `Ai răspuns corect la ${reviewScore} din 5 întrebări.`;
    retryButton.classList.remove("hidden");
  }

  finishSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

function retryReview() {
  reviewIndex = 0;
  reviewScore = 0;
  document.getElementById("finish").classList.add("locked");
  document.getElementById("finish").classList.remove("unlocked");
  document.getElementById("diplomaButton").disabled = true;
  document.getElementById("review").scrollIntoView({ behavior: "smooth", block: "start" });
  renderReview();
}

function openDiploma() {
  if (reviewScore !== 5) return;

  const diplomaModal = document.getElementById("diplomaModal");
  document.getElementById("diplomaDate").textContent = `Ausgestellt am ${new Date().toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  })}`;

  diplomaModal.classList.add("open");
  diplomaModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("diploma-open");
}

function closeDiploma() {
  const diplomaModal = document.getElementById("diplomaModal");
  diplomaModal.classList.remove("open");
  diplomaModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("diploma-open");
}

function printDiploma() {
  window.print();
}

function restartLesson() {
  window.scrollTo({ top: 0, behavior: "smooth" });
  setTimeout(() => window.location.reload(), 500);
}

const reviewSection = document.getElementById("review");
const reviewObserver = new MutationObserver(() => {
  if (reviewSection.classList.contains("unlocked") && reviewIndex === 0) renderReview();
});

reviewObserver.observe(reviewSection, { attributes: true, attributeFilter: ["class"] });

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeDiploma();
});    de: "Die Karotte ist orange.",
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
let currentAudio = null;

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

  playAudio(
    "../audio/farben/messages/intro-farben.mp3"
  );
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

  playAudio(
  "../audio/farben/messages/super-gemacht.mp3"
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
