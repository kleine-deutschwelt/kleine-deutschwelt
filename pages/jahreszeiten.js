"use strict";

const IMAGE = "../assets/images/lessons/jahreszeiten/";
const AUDIO = "../audio/jahreszeiten/";
const ICON = "../assets/icons/monate/";

const seasons = {
  fruehling: {
    name: "der Fr\u00fchling",
    ro: "prim\u0103vara",
    image: "fruehling.webp",
    icon: "fruehling.svg",
    months: ["M\u00e4rz", "April", "Mai"],
    sentence: "Im Fr\u00fchling bl\u00fchen die Blumen.",
    translation: "Prim\u0103vara \u00eenfloresc florile.",
    audio: "fruehling.mp3",
    sentenceAudio: "fruehling-satz.mp3"
  },

  sommer: {
    name: "der Sommer",
    ro: "vara",
    image: "sommer.webp",
    icon: "sommer.svg",
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
    icon: "herbst.svg",
    months: ["September", "Oktober", "November"],
    sentence: "Im Herbst fallen die Bl\u00e4tter.",
    translation: "Toamna cad frunzele.",
    audio: "herbst.mp3",
    sentenceAudio: "herbst-satz.mp3"
  },

  winter: {
    name: "der Winter",
    ro: "iarna",
    image: "winter.webp",
    icon: "winter.svg",
    months: ["Dezember", "Januar", "Februar"],
    sentence: "Im Winter ist es kalt und es schneit.",
    translation: "Iarna este frig \u0219i ninge.",
    audio: "winter.mp3",
    sentenceAudio: "winter-satz.mp3"
  }
};

const ordinals = [
  ["Januar", "erste"],
  ["Februar", "zweite"],
  ["M\u00e4rz", "dritte"],
  ["April", "vierte"],
  ["Mai", "f\u00fcnfte"],
  ["Juni", "sechste"],
  ["Juli", "siebte"],
  ["August", "achte"],
  ["September", "neunte"],
  ["Oktober", "zehnte"],
  ["November", "elfte"],
  ["Dezember", "zw\u00f6lfte"]
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
  ["objekt-kuerbis.webp", "der K\u00fcrbis", "herbst"],
  ["objekt-regenkleidung.webp", "die Regenjacke", "herbst"],

  ["objekt-muetze.webp", "die M\u00fctze", "winter"],
  ["objekt-handschuhe.webp", "die Handschuhe", "winter"],
  ["objekt-schlitten.webp", "der Schlitten", "winter"],
  ["objekt-schneemann.webp", "der Schneemann", "winter"]
];

const clothing = [
  {
    file: "kleidung-jacke.webp",
    name: "die Jacke",
    seasons: ["fruehling", "herbst"]
  },
  {
    file: "objekt-gummistiefel.webp",
    name: "die Gummistiefel",
    seasons: ["fruehling"]
  },
  {
    file: "kleidung-pullover.webp",
    name: "der Pullover",
    seasons: ["fruehling", "herbst"]
  },
  {
    file: "kleidung-tshirt.webp",
    name: "das T-Shirt",
    seasons: ["sommer"]
  },
  {
    file: "kleidung-shorts.webp",
    name: "die Shorts",
    seasons: ["sommer"]
  },
  {
    file: "objekt-sonnenbrille.webp",
    name: "die Sonnenbrille",
    seasons: ["sommer"]
  },
  {
    file: "kleidung-stiefel.webp",
    name: "die Stiefel",
    seasons: ["herbst"]
  },
  {
    file: "objekt-muetze.webp",
    name: "die M\u00fctze",
    seasons: ["winter"]
  },
  {
    file: "kleidung-schal.webp",
    name: "der Schal",
    seasons: ["winter"]
  },
  {
    file: "objekt-handschuhe.webp",
    name: "die Handschuhe",
    seasons: ["winter"]
  },
  {
    file: "objekt-badeanzug.webp",
    name: "der Badeanzug",
    seasons: []
  },
  {
    file: "objekt-regenkleidung.webp",
    name: "die Regenjacke",
    seasons: []
  }
];

const dressTasks = {
  fruehling: [
    "kleidung-jacke.webp",
    "objekt-gummistiefel.webp",
    "kleidung-pullover.webp"
  ],

  sommer: [
    "kleidung-tshirt.webp",
    "kleidung-shorts.webp",
    "objekt-sonnenbrille.webp"
  ],

  herbst: [
    "kleidung-pullover.webp",
    "kleidung-jacke.webp",
    "kleidung-stiefel.webp"
  ],

  winter: [
    "objekt-muetze.webp",
    "kleidung-schal.webp",
    "objekt-handschuhe.webp"
  ]
};

const quizQuestions = [
  {
    q: "Wie viele Jahreszeiten hat ein Jahr?",
    a: ["zwei", "vier", "zw\u00f6lf"],
    correct: 1
  },
  {
    q: "Welche Monate geh\u00f6ren zum Fr\u00fchling?",
    a: [
      "M\u00e4rz, April, Mai",
      "Juni, Juli, August",
      "Dezember, Januar, Februar"
    ],
    correct: 0
  },
  {
    q: "Welche Jahreszeit kommt nach dem Sommer?",
    a: ["der Winter", "der Herbst", "der Fr\u00fchling"],
    correct: 1
  },
  {
    q: "In welcher Jahreszeit schneit es?",
    a: ["im Sommer", "im Fr\u00fchling", "im Winter"],
    correct: 2
  },
  {
    q: "Der wievielte Monat ist M\u00e4rz?",
    a: ["der zweite", "der dritte", "der vierte"],
    correct: 1
  },
  {
    q: "August ist \u2026",
    a: [
      "der achte Monat",
      "der neunte Monat",
      "der elfte Monat"
    ],
    correct: 0
  },
  {
    q: "Welche Monate geh\u00f6ren zum Herbst?",
    a: [
      "April, Mai, Juni",
      "September, Oktober, November",
      "Januar, Februar, M\u00e4rz"
    ],
    correct: 1
  },
  {
    q: "Was passt zum Sommer?",
    a: [
      "der Schlitten",
      "die Sonnenbrille",
      "die M\u00fctze"
    ],
    correct: 1
  },
  {
    q: "Dezember ist \u2026",
    a: [
      "der zehnte Monat",
      "der elfte Monat",
      "der zw\u00f6lfte Monat"
    ],
    correct: 2
  },
  {
    q: "Im Fr\u00fchling \u2026",
    a: [
      "bl\u00fchen die Blumen",
      "fallen die Bl\u00e4tter",
      "bauen wir einen Schneemann"
    ],
    correct: 0
  }
];

const audio = document.getElementById("lessonAudio");

let currentStage = 0;
let recognizeIndex = 0;
let sortDone = 0;
let objectIndex = 0;
let dressIndex = 0;
let finalQuizScore = 0;

let wheelSpinning = false;
let wheelTurns = 0;
let wheelTimer = null;
let selectedWheelSeason = null;

let selectedClothes = new Set();
let sentenceChoice = [];

const packedObjects = [];

function escapeHtml(value) {
  return String(value).replace(
    /[&<>'"]/g,
    (character) => {
      const replacements = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#39;",
        '"': "&quot;"
      };

      return replacements[character];
    }
  );
}

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function setFeedback(element, text, type = "") {
  if (!element) return;

  element.textContent = text;
  element.className = `feedback ${type}`.trim();
}

function playAudio(files, button = null, statusElement = null) {
  const candidates = (
    Array.isArray(files) ? files : [files]
  ).filter(Boolean);

  if (!candidates.length || !audio) return;

  document
    .querySelectorAll(".audio-btn.playing, .mini-audio.playing")
    .forEach((item) => {
      item.classList.remove("playing");
    });

  audio.pause();
  audio.currentTime = 0;

  if (button) {
    button.classList.add("playing");
  }

  if (statusElement) {
    statusElement.textContent = "";
  }

  let index = 0;

  function tryNext() {
    if (index >= candidates.length) {
      if (button) {
        button.classList.remove("playing");
      }

      if (statusElement) {
        statusElement.textContent =
          "Fi\u0219ierul audio nu a fost g\u0103sit. " +
          "Verific\u0103 denumirea MP3.";
      }

      return;
    }

    audio.src = AUDIO + candidates[index];
    index += 1;
    audio.load();

    const playPromise = audio.play();

    if (playPromise) {
      playPromise.catch(() => {
        tryNext();
      });
    }
  }

  audio.onended = () => {
    if (button) {
      button.classList.remove("playing");
    }

    if (statusElement) {
      statusElement.textContent = "";
    }
  };

  audio.onerror = () => {
    tryNext();
  };

  tryNext();
}

function setImageWithFallback(image, candidates, altText) {
  const sources = [...candidates];

  image.alt = altText;

  function loadNext() {
    if (!sources.length) {
      image.onerror = null;
      image.src = IMAGE + "felix-jahreszeiten.webp";
      image.title =
        "Imaginea sezonier\u0103 lipse\u0219te. " +
        "Verific\u0103 denumirea fi\u0219ierului \u00een GitHub.";
      return;
    }

    image.src = sources.shift();
  }

  image.onerror = loadNext;
  loadNext();
}

function updateProgress(stage) {
  currentStage = stage;

  const percent =
    stage === 0 ? 0 : Math.round((stage / 10) * 100);

  document.getElementById("progressFill").style.width =
    `${percent}%`;

  document.getElementById("progressText").textContent =
    stage === 0
      ? "Start"
      : `Schritt ${stage} von 10`;
}

function showStage(stage) {
  const target = document.querySelector(
    `[data-stage="${stage}"]`
  );

  if (!target) return;

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

  requestAnimationFrame(() => {
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

  if (!button) return;

  button.disabled = false;
  button.classList.remove("locked");
}

function renderSeason(key) {
  const season = seasons[key];

  document.getElementById("seasonCard").innerHTML = `
    <img
      src="${IMAGE}${season.image}"
      alt="${season.name}"
    >

    <div class="season-info">
      <h3>${season.name}</h3>

      <p class="translation">
        ${season.ro}
      </p>

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
        Wort h\u00f6ren
      </button>

      <button
        class="audio-btn"
        type="button"
        data-audio="${season.sentenceAudio}"
      >
        <img src="${ICON}audio.svg" alt="">
        Satz h\u00f6ren
      </button>
    </div>
  `;
}

function startWheel() {
  const button = document.getElementById("wheelButton");
  const action = document.getElementById("wheelAction");
  const result = document.getElementById("wheelResult");

  if (
    wheelSpinning ||
    !button ||
    !action ||
    !result
  ) {
    return;
  }

  wheelSpinning = true;
  selectedWheelSeason = null;

  button.disabled = true;
  button.classList.add("spinning");
  action.textContent = "Dreht sich ...";

  result.className =
    "wheel-result wheel-result--waiting";

  result.innerHTML = `
    <div class="wheel-result-content">
      <h3>Das Rad dreht sich ...</h3>
      <p>Warte 3 Sekunden.</p>
    </div>
  `;

  clearTimeout(wheelTimer);

  wheelTimer = window.setTimeout(
    stopWheel,
    3000
  );
}

function stopWheel() {
  const button = document.getElementById("wheelButton");
  const wheel = document.getElementById("seasonWheel");
  const action = document.getElementById("wheelAction");
  const result = document.getElementById("wheelResult");

  if (
    !button ||
    !wheel ||
    !action ||
    !result
  ) {
    wheelSpinning = false;
    return;
  }

  const keys = Object.keys(seasons);
  const key =
    keys[Math.floor(Math.random() * keys.length)];

  const season = seasons[key];

  const stopAngles = {
    fruehling: 45,
    sommer: 315,
    herbst: 135,
    winter: 225
  };

  wheelSpinning = false;
  selectedWheelSeason = key;

  button.classList.remove("spinning");
  button.disabled = false;

  action.textContent = "Noch einmal";

  wheelTurns += 4;

  wheel.style.transform =
    `rotate(${wheelTurns * 360 + stopAngles[key]}deg)`;

  result.className = "wheel-result";

  result.innerHTML = `
    <button
      class="wheel-season-choice"
      type="button"
      data-wheel-season="${key}"
      aria-label="${season.name}: Informationen anzeigen"
    >
      <img
        src="${IMAGE}${season.image}"
        alt="${season.name}"
      >

      <strong>
        ${season.name}<br>
        <small>Bild anklicken</small>
      </strong>
    </button>
  `;
}

function showWheelSeason(key) {
  if (
    !key ||
    key !== selectedWheelSeason
  ) {
    return;
  }

  const result = document.getElementById("wheelResult");
  const season = seasons[key];

  if (!result || !season) return;

  result.className = "wheel-result";

  result.innerHTML = `
    <img
      class="wheel-info-image"
      src="${IMAGE}${season.image}"
      alt="${season.name}"
    >

    <div class="wheel-result-content">
      <h3>${season.name}</h3>

      <p class="translation">
        ${season.ro}
      </p>

      <p>
        <strong>
          ${season.months.join(" \u00b7 ")}
        </strong>
      </p>

      <p>${season.sentence}</p>
      <p>${season.translation}</p>

      <button
        class="audio-btn"
        type="button"
        data-audio="${season.sentenceAudio}"
      >
        <img src="${ICON}audio.svg" alt="">
        Anh\u00f6ren
      </button>
    </div>
  `;
}

function renderOrdinals() {
  const grid = document.getElementById("ordinalGrid");

  if (!grid) return;

  grid.innerHTML = ordinals
    .map(([month, ordinal], index) => {
      const audioNumber =
        String(index + 1).padStart(2, "0");

      return `
        <div class="ordinal-card">
          <span>
            <b>${month}</b><br>
            der ${ordinal} Monat
          </span>

          <button
            class="mini-audio"
            type="button"
            data-audio="ordinal-${audioNumber}.mp3"
            aria-label="Audio: ${month}"
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

  if (recognizeIndex >= order.length) return;

  const key = order[recognizeIndex];
  const season = seasons[key];

  document.getElementById("recognizeImage").src =
    IMAGE + season.image;

  document.getElementById("recognizePrompt").textContent =
    `Frage ${recognizeIndex + 1}/4: ` +
    "Welche Jahreszeit ist das?";

  document.getElementById("recognizeAnswers").innerHTML =
    shuffle(order)
      .map((seasonKey) => {
        return `
          <button
            class="answer-btn"
            type="button"
            data-value="${seasonKey}"
          >
            ${seasons[seasonKey].name}
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

  playAudio(seasons[correct].audio);

  window.setTimeout(() => {
    recognizeIndex += 1;

    if (recognizeIndex < 4) {
      setupRecognition();
      setFeedback(feedback, "");
    } else {
      setFeedback(
        feedback,
        "Sehr gut! Du kennst die vier Jahreszeiten.",
        "success"
      );

      unlockNext(4);
    }
  }, 650);
}

function setupSorting() {
  sortDone = 0;

  const cards = shuffle([
    ["Januar", "winter"],
    ["April", "fruehling"],
    ["Juli", "sommer"],
    ["Oktober", "herbst"]
  ]);

  const container =
    document.getElementById("monthSorting");

  if (!container) return;

  container.innerHTML = cards
    .map(([month, correct]) => {
      return `
        <div
          class="sort-card"
          data-correct="${correct}"
        >
          <h3>${month}</h3>

          <div class="sort-options">
            ${Object.keys(seasons)
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
              .join("")}
          </div>
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

  setFeedback(
    feedback,
    "Richtig!",
    "success"
  );

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
  if (objectIndex >= objects.length) return;

  const objectCard =
    document.getElementById("objectCard");

  const objectAnswers =
    document.getElementById("objectAnswers");

  if (!objectCard || !objectAnswers) return;

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

    <small>
      Bild ber\u00fchren und h\u00f6ren
    </small>
  `;

  objectAnswers.innerHTML =
    Object.keys(seasons)
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

  if (!container) return;

  container.innerHTML = packedObjects
    .map((item) => {
      return `
        <button
          class="packed-item"
          type="button"
          data-object-audio="${item.audio}"
          aria-label="${escapeHtml(item.name)} h\u00f6ren"
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
  if (objectIndex >= objects.length) return;

  const feedback =
    document.getElementById("objectFeedback");

  const [file, name, correctSeason] =
    objects[objectIndex];

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

  const objectAudio = file
    .replace("objekt-", "")
    .replace(".webp", ".mp3");

  packedObjects.push({
    file,
    name,
    audio: objectAudio
  });

  renderPackedObjects();
  playAudio([objectAudio, `objekt-${objectAudio}`]);

  setFeedback(
    feedback,
    `Richtig! ${name} passt zu ${seasons[correctSeason].name}.`,
    "success"
  );

  document
    .querySelectorAll("#objectAnswers button")
    .forEach((answer) => {
      answer.disabled = true;
    });

  window.setTimeout(() => {
    objectIndex += 1;

    if (objectIndex < objects.length) {
      setupObject();
      setFeedback(feedback, "");
      return;
    }

    document.getElementById("objectCard").innerHTML = `
      <strong>Der Koffer ist fertig!</strong>

      <small>
        Ber\u00fchre die Gegenst\u00e4nde im Koffer
        und h\u00f6re sie noch einmal.
      </small>
    `;

    document.getElementById("objectAnswers").innerHTML = "";

    setFeedback(
      feedback,
      "Gut gemacht! Alle 16 Gegenst\u00e4nde " +
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

  if (!target) return;

  selectedClothes = new Set();

  document.getElementById("dressPrompt").innerHTML = `
    Es ist
    <strong>
      ${seasons[target].name.replace("der ", "")}
    </strong>.
    W\u00e4hle genau drei passende Kleidungsst\u00fccke.
  `;

  document.getElementById("dressSeasonName").textContent =
    seasons[target].name;

  document.getElementById("dressCounter").textContent =
    "0 von 3 ausgew\u00e4hlt";

  const checkButton =
    document.getElementById("checkDress");

  checkButton.disabled = true;

  const mainImage =
    document.getElementById("dressFelix");

  setImageWithFallback(
    mainImage,
    [
      IMAGE + `felix-${target}.webp`,
      IMAGE + `felix_${target}.webp`
    ],
    `Felix: ${seasons[target].name}`
  );

  const correctFiles = dressTasks[target];

  const correctChoices = clothing.filter((item) => {
    return correctFiles.includes(item.file);
  });

  const distractors = shuffle(
    clothing.filter((item) => {
      return !correctFiles.includes(item.file);
    })
  ).slice(0, 3);

  const choices = shuffle([
    ...correctChoices,
    ...distractors
  ]);

  document.getElementById("outfitOptions").innerHTML =
    choices
      .map((item) => {
        return `
          <button
            class="outfit-btn"
            data-clothing="${item.file}"
            type="button"
            aria-pressed="false"
          >
            <img
              src="${IMAGE}${item.file}"
              alt="${escapeHtml(item.name)}"
            >

            <span>${escapeHtml(item.name)}</span>
          </button>
        `;
      })
      .join("");
}

function toggleClothing(button) {
  const file = button.dataset.clothing;

  if (!file || button.disabled) return;

  if (selectedClothes.has(file)) {
    selectedClothes.delete(file);
    button.classList.remove("selected");
    button.setAttribute("aria-pressed", "false");
  } else if (selectedClothes.size < 3) {
    selectedClothes.add(file);
    button.classList.add("selected");
    button.setAttribute("aria-pressed", "true");
  }

  document.getElementById("dressCounter").textContent =
    `${selectedClothes.size} von 3 ausgew\u00e4hlt`;

  document.getElementById("checkDress").disabled =
    selectedClothes.size !== 3;
}

function checkDress() {
  const order = [
    "fruehling",
    "sommer",
    "herbst",
    "winter"
  ];

  const target = order[dressIndex];

  if (!target) return;

  const correct = dressTasks[target];

  const success =
    selectedClothes.size === 3 &&
    correct.every((file) => {
      return selectedClothes.has(file);
    });

  document
    .querySelectorAll("#outfitOptions .outfit-btn")
    .forEach((button) => {
      const file = button.dataset.clothing;

      if (
        correct.includes(file) &&
        selectedClothes.has(file)
      ) {
        button.classList.add("correct");
      } else if (selectedClothes.has(file)) {
        button.classList.add("wrong");
      }
    });

  if (!success) {
    setFeedback(
      document.getElementById("dressFeedback"),
      "Noch nicht richtig. W\u00e4hle drei andere Kleidungsst\u00fccke.",
      "error"
    );

    window.setTimeout(() => {
      selectedClothes.clear();

      document
        .querySelectorAll("#outfitOptions .outfit-btn")
        .forEach((button) => {
          button.classList.remove(
            "selected",
            "correct",
            "wrong"
          );

          button.setAttribute(
            "aria-pressed",
            "false"
          );
        });

      document.getElementById("dressCounter").textContent =
        "0 von 3 ausgew\u00e4hlt";

      document.getElementById("checkDress").disabled =
        true;
    }, 900);

    return;
  }

  document
    .querySelectorAll("#outfitOptions .outfit-btn")
    .forEach((button) => {
      button.disabled = true;
    });

  document.getElementById("checkDress").disabled = true;

  setFeedback(
    document.getElementById("dressFeedback"),
    "Richtig! Diese drei Kleidungsst\u00fccke passen.",
    "success"
  );

  playAudio(seasons[target].audio);

  window.setTimeout(() => {
    dressIndex += 1;

    if (dressIndex < 4) {
      setupDress();

      setFeedback(
        document.getElementById("dressFeedback"),
        ""
      );
    } else {
      setFeedback(
        document.getElementById("dressFeedback"),
        "Super! Du hast Felix f\u00fcr alle " +
        "Jahreszeiten richtig angezogen.",
        "success"
      );

      unlockNext(7);
    }
  }, 1100);
}

const sentenceWords = [
  "Im",
  "Herbst",
  "fallen",
  "die",
  "Bl\u00e4tter."
];

function setupSentence() {
  sentenceChoice = [];

  document.getElementById("sentenceTarget").innerHTML = "";

  document.getElementById("wordBank").innerHTML =
    shuffle(sentenceWords)
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

  setFeedback(
    document.getElementById("sentenceFeedback"),
    ""
  );
}

function chooseWord(button) {
  button.disabled = true;
  sentenceChoice.push(button.dataset.word);

  document
    .getElementById("sentenceTarget")
    .insertAdjacentHTML(
      "beforeend",
      `
        <span class="placed-word">
          ${escapeHtml(button.dataset.word)}
        </span>
      `
    );

  if (sentenceChoice.length !== sentenceWords.length) {
    return;
  }

  if (
    sentenceChoice.join(" ") ===
    sentenceWords.join(" ")
  ) {
    setFeedback(
      document.getElementById("sentenceFeedback"),
      "Richtig! Im Herbst fallen die Bl\u00e4tter.",
      "success"
    );

    playAudio("herbst-satz.mp3");
    unlockNext(8);
  } else {
    setFeedback(
      document.getElementById("sentenceFeedback"),
      "Die Reihenfolge stimmt noch nicht. " +
      "Versuche es noch einmal.",
      "error"
    );
  }
}

function renderQuiz() {
  document.getElementById("quizBox").innerHTML =
    quizQuestions
      .map((item, index) => {
        return `
          <article class="quiz-question">
            <h3>
              ${index + 1}. ${item.q}
            </h3>

            <div class="quiz-options">
              ${item.a
                .map((answer, answerIndex) => {
                  return `
                    <label class="quiz-option">
                      <input
                        type="radio"
                        name="q${index}"
                        value="${answerIndex}"
                      >

                      <span>${answer}</span>
                    </label>
                  `;
                })
                .join("")}
            </div>
          </article>
        `;
      })
      .join("");

  const submit =
    document.getElementById("submitQuiz");

  submit.disabled = false;
  submit.dataset.mode = "check";
  submit.textContent = "Quiz pr\u00fcfen";
}

function submitQuiz() {
  const submitButton =
    document.getElementById("submitQuiz");

  const feedback =
    document.getElementById("quizFeedback");

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

    if (chosen) {
      answered += 1;

      if (Number(chosen.value) === item.correct) {
        score += 1;
      }
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

  quizQuestions.forEach((item, questionIndex) => {
    document
      .querySelectorAll(
        `input[name="q${questionIndex}"]`
      )
      .forEach((input) => {
        input.disabled = true;

        const label = input.closest("label");
        const value = Number(input.value);

        if (value === item.correct) {
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
    document
      .querySelector(".hero")
      .classList.add("completed");

    showStage(1);
    return;
  }

  const nextButton =
    event.target.closest(".next-btn");

  if (nextButton && !nextButton.disabled) {
    const nextStage =
      Number(nextButton.dataset.next);

    showStage(nextStage);

    if (nextStage === 10) {
      document.getElementById("finalScore").textContent =
        `Quiz: ${finalQuizScore}/10 Punkte`;

      document.getElementById(
        "certificateScore"
      ).textContent =
        `Ergebnis: ${finalQuizScore}/10`;

      document
        .getElementById("certificate")
        .classList.toggle(
          "is-hidden",
          finalQuizScore < 8
        );

      playAudio("abschluss.mp3");
    }

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
    startWheel();
    return;
  }

  const wheelSeason =
    event.target.closest("[data-wheel-season]");

  if (wheelSeason) {
    showWheelSeason(
      wheelSeason.dataset.wheelSeason
    );

    return;
  }

  const introButton =
    event.target.closest("#introAudioButton");

  if (introButton) {
    playAudio(
      [
        "intro.mp3",
        "jahreszeiten-intro.mp3",
        "einfuehrung.mp3"
      ],
      introButton,
      document.getElementById("introAudioStatus")
    );

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

  const objectAudio =
    event.target.closest("[data-object-audio]");

  if (objectAudio) {
    playAudio(
      [
        objectAudio.dataset.objectAudio,
        `objekt-${objectAudio.dataset.objectAudio}`
      ],
      objectAudio
    );

    return;
  }

  const recognitionButton =
    event.target.closest(
      "#recognizeAnswers .answer-btn"
    );

  if (recognitionButton) {
    checkRecognition(recognitionButton);
    return;
  }

  const sortingButton =
    event.target.closest(".sort-btn");

  if (sortingButton) {
    checkSorting(sortingButton);
    return;
  }

  const objectButton =
    event.target.closest(
      "#objectAnswers .answer-btn"
    );

  if (objectButton) {
    checkObject(objectButton);
    return;
  }

  const outfitButton =
    event.target.closest(".outfit-btn");

  if (outfitButton) {
    toggleClothing(outfitButton);
    return;
  }

  const wordButton =
    event.target.closest(".word-btn");

  if (wordButton) {
    chooseWord(wordButton);
  }
});

document
  .getElementById("resetSentence")
  .addEventListener(
    "click",
    setupSentence
  );

document
  .getElementById("submitQuiz")
  .addEventListener(
    "click",
    submitQuiz
  );

document
  .getElementById("checkDress")
  .addEventListener(
    "click",
    checkDress
  );

document
  .getElementById("restartLesson")
  .addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

    window.setTimeout(() => {
      location.reload();
    }, 350);
  });

renderSeason("fruehling");
renderOrdinals();
setupRecognition();
setupSorting();
setupSentence();
updateProgress(0);
