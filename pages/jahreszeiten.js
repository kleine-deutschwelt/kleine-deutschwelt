"use strict";

const IMAGE = "../assets/images/lessons/jahreszeiten/";
const AUDIO = "../audio/jahreszeiten/";
const ICON = "../assets/icons/monate/";

const seasons = {
  fruehling: {
    name: "der Frühling",
    ro: "primăvara",
    image: "fruehling.webp",
    months: ["März", "April", "Mai"],
    sentence: "Im Frühling blühen die Blumen.",
    translation: "Primăvara înfloresc florile.",
    audio: "fruehling.mp3",
    sentenceAudio: "fruehling-satz.mp3"
  },
  sommer: {
    name: "der Sommer",
    ro: "vara",
    image: "sommer.webp",
    months: ["Juni", "Juli", "August"],
    sentence: "Im Sommer ist es warm.",
    translation: "Vara este cald.",
    audio: "sommer.mp3",
    sentenceAudio: "sommer-satz.mp3"
  },
  herbst: {
    name: "der Herbst",
    ro: "toamna",
    image: "herbst.webp",
    months: ["September", "Oktober", "November"],
    sentence: "Im Herbst fallen die Blätter.",
    translation: "Toamna cad frunzele.",
    audio: "herbst.mp3",
    sentenceAudio: "herbst-satz.mp3"
  },
  winter: {
    name: "der Winter",
    ro: "iarna",
    image: "winter.webp",
    months: ["Dezember", "Januar", "Februar"],
    sentence: "Im Winter ist es kalt und es schneit.",
    translation: "Iarna este frig și ninge.",
    audio: "winter.mp3",
    sentenceAudio: "winter-satz.mp3"
  }
};

const ordinals = [
  ["Januar", "erste"],
  ["Februar", "zweite"],
  ["März", "dritte"],
  ["April", "vierte"],
  ["Mai", "fünfte"],
  ["Juni", "sechste"],
  ["Juli", "siebte"],
  ["August", "achte"],
  ["September", "neunte"],
  ["Oktober", "zehnte"],
  ["November", "elfte"],
  ["Dezember", "zwölfte"]
];

const objects = [
  ["objekt-regenschirm.webp", "der Regenschirm", "fruehling"],
  ["objekt-gummistiefel.webp", "die Gummistiefel", "fruehling"],
  ["objekt-tulpen.webp", "die Tulpen", "fruehling"],
  ["objekt-vogel.webp", "der Vogel", "fruehling"],
  ["objekt-sonnenbrille.webp", "die Sonnenbrille", "sommer"],
  ["objekt-eis.webp", "das Eis", "sommer"],
  ["objekt-badeanzug.webp", "der Badeanzug", "sommer"],
  ["objekt-kirschen.webp", "die Kirschen", "sommer"],
  ["objekt-blatt.webp", "das Blatt", "herbst"],
  ["objekt-drachen.webp", "der Drachen", "herbst"],
  ["objekt-kuerbis.webp", "der Kürbis", "herbst"],
  ["objekt-regenkleidung.webp", "die Regenjacke", "herbst"],
  ["objekt-muetze.webp", "die Mütze", "winter"],
  ["objekt-handschuhe.webp", "die Handschuhe", "winter"],
  ["objekt-schlitten.webp", "der Schlitten", "winter"],
  ["objekt-schneemann.webp", "der Schneemann", "winter"]
];

const quizQuestions = [
  {
    q: "Wie viele Jahreszeiten hat ein Jahr?",
    a: ["zwei", "vier", "zwölf"],
    correct: 1
  },
  {
    q: "Welche Monate gehören zum Frühling?",
    a: [
      "März, April, Mai",
      "Juni, Juli, August",
      "Dezember, Januar, Februar"
    ],
    correct: 0
  },
  {
    q: "Welche Jahreszeit kommt nach dem Sommer?",
    a: ["der Winter", "der Herbst", "der Frühling"],
    correct: 1
  },
  {
    q: "In welcher Jahreszeit schneit es?",
    a: ["im Sommer", "im Frühling", "im Winter"],
    correct: 2
  },
  {
    q: "Der wievielte Monat ist März?",
    a: ["der zweite", "der dritte", "der vierte"],
    correct: 1
  },
  {
    q: "August ist …",
    a: ["der achte Monat", "der neunte Monat", "der elfte Monat"],
    correct: 0
  },
  {
    q: "Welche Monate gehören zum Herbst?",
    a: [
      "April, Mai, Juni",
      "September, Oktober, November",
      "Januar, Februar, März"
    ],
    correct: 1
  },
  {
    q: "Was passt zum Sommer?",
    a: ["der Schlitten", "die Sonnenbrille", "die Mütze"],
    correct: 1
  },
  {
    q: "Dezember ist …",
    a: [
      "der zehnte Monat",
      "der elfte Monat",
      "der zwölfte Monat"
    ],
    correct: 2
  },
  {
    q: "Im Frühling …",
    a: [
      "blühen die Blumen",
      "fallen die Blätter",
      "bauen wir einen Schneemann"
    ],
    correct: 0
  }
];

const audio = document.getElementById("lessonAudio");

let recognizeIndex = 0;
let sortDone = 0;
let objectIndex = 0;
let dressIndex = 0;
let finalQuizScore = 0;
let wheelSpinning = false;
let wheelTurns = 0;
let sentenceChoice = [];

const packedObjects = [];

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      "\"": "&quot;"
    };

    return entities[character];
  });
}

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function setFeedback(element, text, type = "") {
  if (!element) {
    return;
  }

  element.textContent = text;
  element.className = `feedback ${type}`.trim();
}

function playAudio(filename, button, statusElement) {
  if (!audio || !filename) {
    return;
  }

  audio.pause();
  audio.currentTime = 0;
  audio.src = AUDIO + filename;

  document
    .querySelectorAll(".audio-btn.playing")
    .forEach((item) => item.classList.remove("playing"));

  if (button) {
    button.classList.add("playing");
  }

  if (statusElement) {
    statusElement.textContent = "";
  }

  audio.onended = () => {
    if (button) {
      button.classList.remove("playing");
    }
  };

  audio.onerror = () => {
    if (button) {
      button.classList.remove("playing");
    }

    if (statusElement) {
      statusElement.textContent =
        `Audio indisponibil: ${filename}`;
    }
  };

  const playPromise = audio.play();

  if (playPromise && typeof playPromise.catch === "function") {
    playPromise.catch(() => {
      if (button) {
        button.classList.remove("playing");
      }

      if (statusElement) {
        statusElement.textContent =
          `Nu poate fi redat: ${filename}`;
      }
    });
  }
}

function setImageWithFallback(image, candidates, altText) {
  const sources = [...candidates];

  image.alt = altText;

  function loadNext() {
    if (sources.length === 0) {
      image.onerror = null;
      image.src = IMAGE + "felix-jahreszeiten.webp";
      return;
    }

    image.src = sources.shift();
  }

  image.onerror = loadNext;
  loadNext();
}

function updateProgress(stage) {
  const progressFill = document.getElementById("progressFill");
  const progressText = document.getElementById("progressText");

  const percentage =
    stage === 0 ? 0 : Math.round((stage / 10) * 100);

  if (progressFill) {
    progressFill.style.width = `${percentage}%`;
  }

  if (progressText) {
    progressText.textContent =
      stage === 0
        ? "Start"
        : `Schritt ${stage} von 10`;
  }
}

function showStage(stage) {
  const target = document.querySelector(
    `[data-stage="${stage}"]`
  );

  if (!target) {
    return;
  }

  target.classList.remove("is-hidden");
  updateProgress(stage);

  if (stage === 6) {
    setupObject();
  }

  if (stage === 7) {
    setupDress();
  }

  if (stage === 9) {
    renderQuiz();
  }

  window.requestAnimationFrame(() => {
    target.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  });
}

function unlockNext(stage) {
  const button = document.querySelector(
    `[data-stage="${stage}"] .next-btn`
  );

  if (!button) {
    return;
  }

  button.disabled = false;
  button.classList.remove("locked");
}

function renderSeason(key) {
  const season = seasons[key];
  const card = document.getElementById("seasonCard");

  if (!season || !card) {
    return;
  }

  card.innerHTML = `
    <img src="${IMAGE}${season.image}" alt="${season.name}">

    <div class="season-info">
      <h3>${season.name}</h3>
      <p class="translation">${season.ro}</p>

      <div class="month-chips">
        ${season.months
          .map((month) => {
            return `<span class="chip">${month}</span>`;
          })
          .join("")}
      </div>

      <p>
        <strong>${season.sentence}</strong><br>
        ${season.translation}
      </p>

      <button
        class="audio-btn"
        type="button"
        data-audio="${season.audio}"
      >
        <img src="${ICON}audio.svg" alt="">
        Wort hören
      </button>

      <button
        class="audio-btn"
        type="button"
        data-audio="${season.sentenceAudio}"
      >
        <img src="${ICON}audio.svg" alt="">
        Satz hören
      </button>
    </div>
  `;
}

function toggleWheel() {
  const button = document.getElementById("wheelButton");
  const wheel = document.getElementById("seasonWheel");
  const action = document.getElementById("wheelAction");
  const result = document.getElementById("wheelResult");

  if (!button || !wheel || !action || !result) {
    return;
  }

  if (!wheelSpinning) {
    wheelSpinning = true;

    button.classList.add("spinning");
    action.textContent = "Stoppen";
    result.classList.add("is-hidden");

    return;
  }

  wheelSpinning = false;

  button.classList.remove("spinning");
  action.textContent = "Noch einmal";

  const seasonKeys = Object.keys(seasons);

  const selectedKey =
    seasonKeys[
      Math.floor(Math.random() * seasonKeys.length)
    ];

  const selectedSeason = seasons[selectedKey];
  const selectedIndex = seasonKeys.indexOf(selectedKey);

  wheelTurns += 3 + Math.floor(Math.random() * 3);

  wheel.style.transform =
    `rotate(${wheelTurns * 360 - selectedIndex * 90}deg)`;

  result.innerHTML = `
    <img
      src="${IMAGE}${selectedSeason.image}"
      alt="${selectedSeason.name}"
    >

    <div class="wheel-result-content">
      <h3>${selectedSeason.name}</h3>
      <p class="translation">${selectedSeason.ro}</p>

      <p>
        <strong>
          ${selectedSeason.months.join(" · ")}
        </strong>
      </p>

      <p>${selectedSeason.sentence}</p>

      <button
        class="audio-btn"
        type="button"
        data-audio="${selectedSeason.sentenceAudio}"
      >
        <img src="${ICON}audio.svg" alt="">
        Anhören
      </button>
    </div>
  `;

  result.classList.remove("is-hidden");

  playAudio(selectedSeason.sentenceAudio);
}

function renderOrdinals() {
  const grid = document.getElementById("ordinalGrid");

  if (!grid) {
    return;
  }

  grid.innerHTML = ordinals
    .map(([month, ordinal], index) => {
      const number = String(index + 1).padStart(2, "0");

      return `
        <div class="ordinal-card">
          <span>
            <b>${month}</b><br>
            der ${ordinal} Monat
          </span>

          <button
            class="mini-audio"
            type="button"
            data-audio="ordinal-${number}.mp3"
            aria-label="${month} hören"
          >
            <img src="${ICON}audio.svg" alt="">
          </button>
        </div>
      `;
    })
    .join("");
}

function setupRecognition() {
  const order = [
    "fruehling",
    "sommer",
    "herbst",
    "winter"
  ];

  if (recognizeIndex >= order.length) {
    return;
  }

  const selectedKey = order[recognizeIndex];
  const selectedSeason = seasons[selectedKey];

  const image = document.getElementById("recognizeImage");
  const prompt = document.getElementById("recognizePrompt");
  const answers = document.getElementById("recognizeAnswers");

  if (!image || !prompt || !answers) {
    return;
  }

  image.src = IMAGE + selectedSeason.image;
  image.alt = selectedSeason.name;

  prompt.textContent =
    `Frage ${recognizeIndex + 1}/4: ` +
    "Welche Jahreszeit ist das?";

  answers.innerHTML = shuffle(order)
    .map((key) => {
      return `
        <button
          class="answer-btn"
          type="button"
          data-value="${key}"
        >
          ${seasons[key].name}
        </button>
      `;
    })
    .join("");
}

function checkRecognition(button) {
  const order = [
    "fruehling",
    "sommer",
    "herbst",
    "winter"
  ];

  const correct = order[recognizeIndex];
  const feedback =
    document.getElementById("recognizeFeedback");

  if (button.dataset.value !== correct) {
    button.classList.add("wrong");

    setFeedback(
      feedback,
      "Versuche es noch einmal.",
      "error"
    );

    return;
  }

  button.classList.add("correct");

  setFeedback(
    feedback,
    `Richtig! Das ist ${seasons[correct].name}.`,
    "success"
  );

  window.setTimeout(() => {
    recognizeIndex += 1;

    if (recognizeIndex < order.length) {
      setupRecognition();
      setFeedback(feedback, "");
      return;
    }

    setFeedback(
      feedback,
      "Sehr gut! Du kennst die vier Jahreszeiten.",
      "success"
    );

    unlockNext(4);
  }, 650);
}

function setupSorting() {
  const container =
    document.getElementById("monthSorting");

  if (!container) {
    return;
  }

  const cards = shuffle([
    ["Januar", "winter"],
    ["April", "fruehling"],
    ["Juli", "sommer"],
    ["Oktober", "herbst"]
  ]);

  container.innerHTML = cards
    .map(([month, correctSeason]) => {
      const options = Object.keys(seasons)
        .map((key) => {
          return `
            <button
              class="sort-btn"
              type="button"
              data-value="${key}"
            >
              ${seasons[key].name.replace("der ", "")}
            </button>
          `;
        })
        .join("");

      return `
        <div
          class="sort-card"
          data-correct="${correctSeason}"
        >
          <h3>${month}</h3>
          <div class="sort-options">${options}</div>
        </div>
      `;
    })
    .join("");
}

function checkSorting(button) {
  const card = button.closest(".sort-card");
  const feedback =
    document.getElementById("sortingFeedback");

  if (!card || card.classList.contains("done")) {
    return;
  }

  if (button.dataset.value !== card.dataset.correct) {
    button.classList.add("wrong");

    setFeedback(
      feedback,
      "Fast richtig. Versuche es noch einmal.",
      "error"
    );

    return;
  }

  button.classList.add("correct");
  card.classList.add("done");

  card.querySelectorAll("button").forEach((item) => {
    item.disabled = true;
  });

  sortDone += 1;

  setFeedback(feedback, "Richtig!", "success");

  if (sortDone === 4) {
    setFeedback(
      feedback,
      "Prima! Alle Monate sind richtig zugeordnet.",
      "success"
    );

    unlockNext(5);
  }
}

function setupObject() {
  if (objectIndex >= objects.length) {
    return;
  }

  const objectCard =
    document.getElementById("objectCard");

  const answerContainer =
    document.getElementById("objectAnswers");

  if (!objectCard || !answerContainer) {
    return;
  }

  const [file, name] = objects[objectIndex];

  const objectAudio = file
    .replace("objekt-", "")
    .replace(".webp", ".mp3");

  objectCard.innerHTML = `
    <img
      src="${IMAGE}${file}"
      alt="${escapeHtml(name)}"
      data-object-audio="${objectAudio}"
    >

    <strong>${escapeHtml(name)}</strong>
    <small>Bild berühren und hören</small>
  `;

  answerContainer.innerHTML = Object.keys(seasons)
    .map((key) => {
      return `
        <button
          class="answer-btn"
          type="button"
          data-value="${key}"
        >
          ${seasons[key].name}
        </button>
      `;
    })
    .join("");
}

function renderPackedObjects() {
  const container =
    document.getElementById("packedObjects");

  if (!container) {
    return;
  }

  container.innerHTML = packedObjects
    .map((item) => {
      return `
        <button
          class="packed-item"
          type="button"
          data-object-audio="${item.audio}"
          aria-label="${escapeHtml(item.name)} hören"
        >
          <img
            src="${IMAGE}${item.file}"
            alt="${escapeHtml(item.name)}"
          >
        </button>
      `;
    })
    .join("");
}

function checkObject(button) {
  if (objectIndex >= objects.length) {
    return;
  }

  const correctSeason = objects[objectIndex][2];
  const feedback =
    document.getElementById("objectFeedback");

  if (button.dataset.value !== correctSeason) {
    button.classList.add("wrong");

    setFeedback(
      feedback,
      "Das passt noch nicht. Versuche es noch einmal.",
      "error"
    );

    return;
  }

  button.classList.add("correct");

  const [file, name] = objects[objectIndex];

  packedObjects.push({
    file,
    name,
    audio: file
      .replace("objekt-", "")
      .replace(".webp", ".mp3")
  });

  renderPackedObjects();

  setFeedback(
    feedback,
    `Richtig! ${name} passt zu ` +
      `${seasons[correctSeason].name}.`,
    "success"
  );

  window.setTimeout(() => {
    objectIndex += 1;

    if (objectIndex < objects.length) {
      setupObject();
      setFeedback(feedback, "");
      return;
    }

    const objectCard =
      document.getElementById("objectCard");

    const answerContainer =
      document.getElementById("objectAnswers");

    if (objectCard) {
      objectCard.innerHTML = `
        <strong>Der Koffer ist fertig!</strong>
        <small>
          Berühre die Gegenstände im Koffer
          und höre sie noch einmal.
        </small>
      `;
    }

    if (answerContainer) {
      answerContainer.innerHTML = "";
    }

    setFeedback(
      feedback,
      "Gut gemacht! Alle 16 Gegenstände " +
        "sind richtig eingeordnet.",
      "success"
    );

    unlockNext(6);
  }, 600);
}

function setupDress() {
  const order = [
    "fruehling",
    "sommer",
    "herbst",
    "winter"
  ];

  const target = order[dressIndex];

  if (!target) {
    return;
  }

  const prompt = document.getElementById("dressPrompt");
  const mainImage = document.getElementById("dressFelix");
  const options = document.getElementById("outfitOptions");

  if (!prompt || !mainImage || !options) {
    return;
  }

  prompt.innerHTML = `
    Es ist
    <strong>
      ${seasons[target].name.replace("der ", "")}
    </strong>.
    Welche Kleidung braucht Felix?
  `;

  setImageWithFallback(
    mainImage,
    [
      IMAGE + `felix-${target}.webp`,
      IMAGE + `felix_${target}.webp`
    ],
    `Felix: ${seasons[target].name}`
  );

  options.innerHTML = shuffle(order)
    .map((key) => {
      return `
        <button
          class="outfit-btn"
          data-value="${key}"
          type="button"
        >
          <img
            data-felix-season="${key}"
            alt="Felix: ${seasons[key].name}"
          >

          <span>${seasons[key].name}</span>
        </button>
      `;
    })
    .join("");

  document
    .querySelectorAll("[data-felix-season]")
    .forEach((image) => {
      const key = image.dataset.felixSeason;

      setImageWithFallback(
        image,
        [
          IMAGE + `felix-${key}.webp`,
          IMAGE + `felix_${key}.webp`
        ],
        `Felix: ${seasons[key].name}`
      );
    });
}

function checkDress(button) {
  const order = [
    "fruehling",
    "sommer",
    "herbst",
    "winter"
  ];

  const correct = order[dressIndex];
  const feedback =
    document.getElementById("dressFeedback");

  if (button.dataset.value !== correct) {
    button.classList.add("wrong");

    setFeedback(
      feedback,
      "Diese Kleidung passt nicht. " +
        "Versuche es noch einmal.",
      "error"
    );

    return;
  }

  button.classList.add("correct");

  setFeedback(
    feedback,
    "Richtig angezogen!",
    "success"
  );

  window.setTimeout(() => {
    dressIndex += 1;

    if (dressIndex < order.length) {
      setupDress();
      setFeedback(feedback, "");
      return;
    }

    setFeedback(
      feedback,
      "Super! Felix ist für jedes Wetter bereit.",
      "success"
    );

    unlockNext(7);
  }, 650);
}

const sentenceWords = [
  "Im",
  "Herbst",
  "fallen",
  "die",
  "Blätter."
];

function setupSentence() {
  const target =
    document.getElementById("sentenceTarget");

  const wordBank =
    document.getElementById("wordBank");

  const feedback =
    document.getElementById("sentenceFeedback");

  sentenceChoice = [];

  if (target) {
    target.innerHTML = "";
  }

  if (wordBank) {
    wordBank.innerHTML = shuffle(sentenceWords)
      .map((word, index) => {
        return `
          <button
            class="word-btn"
            type="button"
            data-word="${escapeHtml(word)}"
            data-id="${index}"
          >
            ${escapeHtml(word)}
          </button>
        `;
      })
      .join("");
  }

  setFeedback(feedback, "");
}

function chooseWord(button) {
  button.disabled = true;
  sentenceChoice.push(button.dataset.word);

  const target =
    document.getElementById("sentenceTarget");

  const feedback =
    document.getElementById("sentenceFeedback");

  if (target) {
    target.insertAdjacentHTML(
      "beforeend",
      `<span class="placed-word">${
        escapeHtml(button.dataset.word)
      }</span>`
    );
  }

  if (sentenceChoice.length !== sentenceWords.length) {
    return;
  }

  if (
    sentenceChoice.join(" ") ===
    sentenceWords.join(" ")
  ) {
    setFeedback(
      feedback,
      "Richtig! Im Herbst fallen die Blätter.",
      "success"
    );

    unlockNext(8);
    return;
  }

  setFeedback(
    feedback,
    "Die Reihenfolge stimmt noch nicht. " +
      "Versuche es noch einmal.",
    "error"
  );
}

function renderQuiz() {
  const quizBox = document.getElementById("quizBox");
  const submitButton =
    document.getElementById("submitQuiz");

  if (!quizBox || !submitButton) {
    return;
  }

  quizBox.innerHTML = quizQuestions
    .map((item, questionIndex) => {
      const answers = item.a
        .map((answer, answerIndex) => {
          return `
            <label class="quiz-option">
              <input
                type="radio"
                name="q${questionIndex}"
                value="${answerIndex}"
              >
              <span>${answer}</span>
            </label>
          `;
        })
        .join("");

      return `
        <article class="quiz-question">
          <h3>
            ${questionIndex + 1}. ${item.q}
          </h3>

          <div class="quiz-options">
            ${answers}
          </div>
        </article>
      `;
    })
    .join("");

  submitButton.disabled = false;
  submitButton.dataset.mode = "check";
  submitButton.textContent = "Quiz prüfen";
}

function submitQuiz() {
  const submitButton =
    document.getElementById("submitQuiz");

  const feedback =
    document.getElementById("quizFeedback");

  if (!submitButton) {
    return;
  }

  if (submitButton.dataset.mode === "retry") {
    renderQuiz();
    setFeedback(feedback, "");
    return;
  }

  let answered = 0;
  let score = 0;

  quizQuestions.forEach((item, index) => {
    const chosen = document.querySelector(
      `input[name="q${index}"]:checked`
    );

    if (!chosen) {
      return;
    }

    answered += 1;

    if (Number(chosen.value) === item.correct) {
      score += 1;
    }
  });

  if (answered < quizQuestions.length) {
    setFeedback(
      feedback,
      "Beantworte bitte alle 10 Fragen.",
      "error"
    );

    return;
  }

  finalQuizScore = score;

  quizQuestions.forEach((item, index) => {
    document
      .querySelectorAll(`input[name="q${index}"]`)
      .forEach((input) => {
        input.disabled = true;

        const label = input.closest("label");

        if (Number(input.value) === item.correct) {
          label.classList.add("correct");
        } else if (input.checked) {
          label.classList.add("wrong");
        }
      });
  });

  const passed = score >= 8;

  setFeedback(
    feedback,
    passed
      ? `Sehr gut! ${score}/10 Punkte. ` +
        "Die Urkunde ist freigeschaltet."
      : `Du hast ${score}/10 Punkte. ` +
        "Wiederhole das Quiz und erreiche " +
        "mindestens 8 Punkte.",
    passed ? "success" : "error"
  );

  if (passed) {
    unlockNext(9);
    submitButton.disabled = true;
  } else {
    submitButton.dataset.mode = "retry";
    submitButton.textContent = "Quiz wiederholen";
  }
}

document.addEventListener("click", (event) => {
  const startButton =
    event.target.closest("#startLesson");

  if (startButton) {
    showStage(1);
    return;
  }

  const nextButton =
    event.target.closest(".next-btn");

  if (nextButton && !nextButton.disabled) {
    showStage(Number(nextButton.dataset.next));
    return;
  }

  const seasonTab =
    event.target.closest(".season-tab");

  if (seasonTab) {
    document
      .querySelectorAll(".season-tab")
      .forEach((button) => {
        button.classList.toggle(
          "active",
          button === seasonTab
        );
      });

    renderSeason(seasonTab.dataset.season);
    return;
  }

  const wheelButton =
    event.target.closest("#wheelButton");

  if (wheelButton) {
    toggleWheel();
    return;
  }

  const introButton =
    event.target.closest("#introAudioButton");

  if (introButton) {
    playAudio(
      "intro.mp3",
      introButton,
      document.getElementById("introAudioStatus")
    );

    return;
  }

  const objectAudio =
    event.target.closest("[data-object-audio]");

  if (objectAudio) {
    playAudio(objectAudio.dataset.objectAudio);
    return;
  }

  const audioButton =
    event.target.closest("[data-audio]");

  if (audioButton) {
    playAudio(
      audioButton.dataset.audio,
      audioButton
    );

    return;
  }

  const recognitionAnswer =
    event.target.closest(
      "#recognizeAnswers .answer-btn"
    );

  if (recognitionAnswer) {
    checkRecognition(recognitionAnswer);
    return;
  }

  const sortingAnswer =
    event.target.closest(".sort-btn");

  if (sortingAnswer) {
    checkSorting(sortingAnswer);
    return;
  }

  const objectAnswer =
    event.target.closest(
      "#objectAnswers .answer-btn"
    );

  if (objectAnswer) {
    checkObject(objectAnswer);
    return;
  }

  const outfitAnswer =
    event.target.closest(".outfit-btn");

  if (outfitAnswer) {
    checkDress(outfitAnswer);
    return;
  }

  const wordButton =
    event.target.closest(".word-btn");

  if (wordButton) {
    chooseWord(wordButton);
  }
});

const resetSentenceButton =
  document.getElementById("resetSentence");

if (resetSentenceButton) {
  resetSentenceButton.addEventListener(
    "click",
    setupSentence
  );
}

const submitQuizButton =
  document.getElementById("submitQuiz");

if (submitQuizButton) {
  submitQuizButton.addEventListener(
    "click",
    submitQuiz
  );
}

const restartLessonButton =
  document.getElementById("restartLesson");

if (restartLessonButton) {
  restartLessonButton.addEventListener(
    "click",
    () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });

      window.setTimeout(() => {
        window.location.reload();
      }, 350);
    }
  );
}

const finalButton =
  document.querySelector('[data-next="10"]');

if (finalButton) {
  finalButton.addEventListener("click", () => {
    const finalScore =
      document.getElementById("finalScore");

    const certificateScore =
      document.getElementById("certificateScore");

    const certificate =
      document.getElementById("certificate");

    if (finalScore) {
      finalScore.textContent =
        `Quiz: ${finalQuizScore}/10 Punkte`;
    }

    if (certificateScore) {
      certificateScore.textContent =
        `Ergebnis: ${finalQuizScore}/10`;
    }

    if (certificate) {
      certificate.classList.toggle(
        "is-hidden",
        finalQuizScore < 8
      );
    }

    playAudio("abschluss.mp3");
  });
}

renderSeason("fruehling");
renderOrdinals();
setupRecognition();
setupSorting();
setupSentence();
updateProgress(0);
