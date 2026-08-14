"use strict";

const IMAGE = "../assets/images/lessons/jahreszeiten/";
const AUDIO = "../audio/jahreszeiten/";
const AUDIO_ICON = "../assets/icons/monate/audio.svg";

const seasons = {
  fruehling: {
    name: "der Frühling",
    shortName: "Frühling",
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
    shortName: "Sommer",
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
    shortName: "Herbst",
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
    shortName: "Winter",
    ro: "iarna",
    image: "winter.webp",
    months: ["Dezember", "Januar", "Februar"],
    sentence: "Im Winter ist es kalt und es schneit.",
    translation: "Iarna este frig și ninge.",
    audio: "winter.mp3",
    sentenceAudio: "winter-satz.mp3"
  }
};

const seasonKeys = Object.keys(seasons);

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

const monthSeason = {
  Januar: "winter",
  Februar: "winter",
  März: "fruehling",
  April: "fruehling",
  Mai: "fruehling",
  Juni: "sommer",
  Juli: "sommer",
  August: "sommer",
  September: "herbst",
  Oktober: "herbst",
  November: "herbst",
  Dezember: "winter"
};

const suitcaseObjects = [
  {
    file: "objekt-regenschirm.webp",
    name: "der Regenschirm",
    season: "fruehling"
  },
  {
    file: "objekt-gummistiefel.webp",
    name: "die Gummistiefel",
    season: "fruehling"
  },
  {
    file: "objekt-tulpen.webp",
    name: "die Tulpen",
    season: "fruehling"
  },
  {
    file: "objekt-vogel.webp",
    name: "der Vogel",
    season: "fruehling"
  },
  {
    file: "objekt-sonnenbrille.webp",
    name: "die Sonnenbrille",
    season: "sommer"
  },
  {
    file: "objekt-eis.webp",
    name: "das Eis",
    season: "sommer"
  },
  {
    file: "objekt-badeanzug.webp",
    name: "der Badeanzug",
    season: "sommer"
  },
  {
    file: "objekt-kirschen.webp",
    name: "die Kirschen",
    season: "sommer"
  },
  {
    file: "objekt-blatt.webp",
    name: "das Blatt",
    season: "herbst"
  },
  {
    file: "objekt-drachen.webp",
    name: "der Drachen",
    season: "herbst"
  },
  {
    file: "objekt-kuerbis.webp",
    name: "der Kürbis",
    season: "herbst"
  },
  {
    file: "objekt-regenkleidung.webp",
    name: "die Regenjacke",
    season: "herbst"
  },
  {
    file: "objekt-muetze.webp",
    name: "die Mütze",
    season: "winter"
  },
  {
    file: "objekt-handschuhe.webp",
    name: "die Handschuhe",
    season: "winter"
  },
  {
    file: "objekt-schlitten.webp",
    name: "der Schlitten",
    season: "winter"
  },
  {
    file: "objekt-schneemann.webp",
    name: "der Schneemann",
    season: "winter"
  }
];

const clothing = [
  {
    file: "kleidung-jacke.webp",
    name: "die Jacke"
  },
  {
    file: "objekt-gummistiefel.webp",
    name: "die Gummistiefel"
  },
  {
    file: "kleidung-pullover.webp",
    name: "der Pullover"
  },
  {
    file: "kleidung-tshirt.webp",
    name: "das T-Shirt"
  },
  {
    file: "kleidung-shorts.webp",
    name: "die Shorts"
  },
  {
    file: "objekt-sonnenbrille.webp",
    name: "die Sonnenbrille"
  },
  {
    file: "kleidung-stiefel.webp",
    name: "die Stiefel"
  },
  {
    file: "objekt-muetze.webp",
    name: "die Mütze"
  },
  {
    file: "kleidung-schal.webp",
    name: "der Schal"
  },
  {
    file: "objekt-handschuhe.webp",
    name: "die Handschuhe"
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

const sentenceTasks = [
  ["Im", "Frühling", "blühen", "die", "Blumen."],
  ["Im", "Sommer", "ist", "es", "warm."],
  ["Im", "Herbst", "fallen", "die", "Blätter."],
  ["Im", "Winter", "ist", "es", "kalt."]
];

const quizQuestions = [
  {
    question: "Wie viele Jahreszeiten hat ein Jahr?",
    options: ["zwei", "drei", "vier", "fünf"],
    answer: "vier"
  },
  {
    question: "Welche Jahreszeit kommt nach dem Frühling?",
    options: ["der Winter", "der Sommer", "der Herbst", "der Frühling"],
    answer: "der Sommer"
  },
  {
    question: "Welche Monate gehören zum Sommer?",
    options: [
      "Juni, Juli, August",
      "März, April, Mai",
      "September, Oktober, November",
      "Dezember, Januar, Februar"
    ],
    answer: "Juni, Juli, August"
  },
  {
    question: "Welche Jahreszeit ist kalt?",
    options: ["der Sommer", "der Winter", "der Frühling", "der Herbst"],
    answer: "der Winter"
  },
  {
    question: "Der Januar ist der ... Monat.",
    options: ["erste", "zweite", "dritte", "vierte"],
    answer: "erste"
  },
  {
    question: "Der Dezember ist der ... Monat.",
    options: ["zehnte", "elfte", "zwölfte", "neunte"],
    answer: "zwölfte"
  },
  {
    question: "Wann fallen die Blätter?",
    options: [
      "im Frühling",
      "im Sommer",
      "im Herbst",
      "im Winter"
    ],
    answer: "im Herbst"
  },
  {
    question: "Wann blühen die Blumen?",
    options: [
      "im Frühling",
      "im Sommer",
      "im Herbst",
      "im Winter"
    ],
    answer: "im Frühling"
  },
  {
    question: "Zu welcher Jahreszeit gehört der Juli?",
    options: ["Frühling", "Sommer", "Herbst", "Winter"],
    answer: "Sommer"
  },
  {
    question: "Zu welcher Jahreszeit gehört der November?",
    options: ["Frühling", "Sommer", "Herbst", "Winter"],
    answer: "Herbst"
  }
];

let currentAudio = null;
let wheelBusy = false;

let recognizeIndex = 0;
let sortingSolved = 0;

let objectIndex = 0;
let packedCount = 0;

let dressIndex = 0;
let selectedClothes = new Set();

let sentenceIndex = 0;
let placedWords = [];

let finalQuizScore = 0;

function shuffle(items) {
  const copy = [...items];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));

    [copy[index], copy[randomIndex]] = [
      copy[randomIndex],
      copy[index]
    ];
  }

  return copy;
}

function setFeedback(element, message, type = "") {
  if (!element) {
    return;
  }

  element.textContent = message;
  element.className = `feedback ${type}`.trim();
}

function updateProgress(stage) {
  const percent = stage === 0
    ? 0
    : Math.round((stage / 10) * 100);

  const fill = document.getElementById("progressFill");
  const text = document.getElementById("progressText");
  const track = fill?.parentElement;

  if (fill) {
    fill.style.width = `${percent}%`;
  }

  if (text) {
    text.textContent = stage === 0
      ? "Start"
      : `Schritt ${stage} von 10`;
  }

  if (track) {
    track.setAttribute("aria-valuenow", String(percent));
  }
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

function showStage(stage) {
  const target = document.querySelector(
    `[data-stage="${stage}"]`
  );

  if (!target) {
    return;
  }

  target.classList.remove("is-hidden");
  updateProgress(stage);

  if (stage === 6 && objectIndex === 0) {
    setupObject();
  }

  if (stage === 7 && dressIndex === 0) {
    setupDress();
  }

  if (stage === 9) {
    renderQuiz();
  }

  if (stage === 10) {
    document.getElementById("finalScore").textContent =
      `Quiz: ${finalQuizScore}/10 Punkte`;

    document.getElementById("certificateScore").textContent =
      `Ergebnis: ${finalQuizScore}/10`;

    document
      .getElementById("certificate")
      .classList.toggle("is-hidden", finalQuizScore < 8);

    playAudio(["abschluss.mp3", "super-gemacht.mp3"]);
  }

  window.setTimeout(() => {
    target.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }, 80);
}

function playAudio(files, button = null, status = null) {
  const fileList = Array.isArray(files) ? files : [files];

  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }

  let fileIndex = 0;

  function tryFile() {
    if (fileIndex >= fileList.length) {
      if (button) {
        button.classList.remove("playing");
      }

      if (status) {
        status.textContent = "Fișierul audio nu a fost găsit.";
      }

      return;
    }

    const audio = new Audio(AUDIO + fileList[fileIndex]);
    currentAudio = audio;

    if (button) {
      button.classList.add("playing");
    }

    if (status) {
      status.textContent = "Audio wird abgespielt.";
    }

    audio.addEventListener("ended", () => {
      if (button) {
        button.classList.remove("playing");
      }

      if (status) {
        status.textContent = "";
      }
    });

    audio.addEventListener("error", () => {
      fileIndex += 1;
      tryFile();
    });

    audio.play().catch(() => {
      if (button) {
        button.classList.remove("playing");
      }

      if (status) {
        status.textContent =
          "Apasă din nou butonul pentru a porni sunetul.";
      }
    });
  }

  tryFile();
}

function renderSeason(key) {
  const season = seasons[key];
  const card = document.getElementById("seasonCard");

  if (!season || !card) {
    return;
  }

  card.innerHTML = `
    <img
      src="${IMAGE}${season.image}"
      alt="${season.name}"
    >

    <div class="season-info">
      <h3>${season.name}</h3>
      <p class="translation">${season.ro}</p>

      <div class="month-chips">
        ${season.months
          .map((month) => `<span class="chip">${month}</span>`)
          .join("")}
      </div>

      <p><strong>${season.sentence}</strong></p>
      <p class="translation">${season.translation}</p>

      <button
        class="audio-btn"
        data-audio="${season.audio}"
        type="button"
      >
        <img src="${AUDIO_ICON}" alt="">
        Wort hören
      </button>

      <button
        class="audio-btn"
        data-audio="${season.sentenceAudio}"
        type="button"
      >
        <img src="${AUDIO_ICON}" alt="">
        Satz hören
      </button>
    </div>
  `;
}

function renderWheelResult(key) {
  const season = seasons[key];
  const result = document.getElementById("wheelResult");

  result.innerHTML = `
    <article class="wheel-result-card selected">
      <img
        src="${IMAGE}${season.image}"
        alt="${season.name}"
      >

      <h3>${season.name}</h3>
      <p class="translation">${season.ro}</p>

      <div class="month-chips">
        ${season.months
          .map((month) => `<span class="chip">${month}</span>`)
          .join("")}
      </div>

      <p><strong>${season.sentence}</strong></p>
      <p>${season.translation}</p>

      <button
        class="audio-btn"
        data-audio="${season.audio}"
        type="button"
      >
        <img src="${AUDIO_ICON}" alt="">
        ${season.name} hören
      </button>
    </article>
  `;
}

function startWheel() {
  if (wheelBusy) {
    return;
  }

  wheelBusy = true;

  const wheel = document.getElementById("seasonWheel");
  const button = document.getElementById("wheelButton");
  const status = document.getElementById("wheelAction");

  button.disabled = true;
  wheel.classList.add("spinning");
  status.textContent = "Das Rad dreht sich …";

  window.setTimeout(() => {
    wheel.classList.remove("spinning");

    const selectedKey =
      seasonKeys[Math.floor(Math.random() * seasonKeys.length)];

    const selectedIndex = seasonKeys.indexOf(selectedKey);
    const finalRotation = 1440 + selectedIndex * 90;

    wheel.style.transform = `rotate(${finalRotation}deg)`;

    status.textContent =
      `Das Rad zeigt: ${seasons[selectedKey].name}.`;

    renderWheelResult(selectedKey);
    unlockNext(2);

    button.disabled = false;
    wheelBusy = false;
  }, 3000);
}

function renderOrdinals() {
  const grid = document.getElementById("ordinalGrid");

  grid.innerHTML = ordinals
    .map(([month, ordinal], index) => `
      <article class="ordinal-card">
        <span>${index + 1}. ${month}</span>
        <strong>der ${ordinal}</strong>
      </article>
    `)
    .join("");
}

function setupRecognition() {
  const tasks = shuffle(seasonKeys).map((key) => ({
    key,
    ...seasons[key]
  }));

  function renderTask() {
    const task = tasks[recognizeIndex];

    if (!task) {
      setFeedback(
        document.getElementById("recognizeFeedback"),
        "Sehr gut! Du hast alle Jahreszeiten erkannt.",
        "success"
      );

      unlockNext(4);
      return;
    }

    document.getElementById("recognizeImage").src =
      IMAGE + task.image;

    document.getElementById("recognizeImage").alt =
      task.name;

    document.getElementById("recognizePrompt").textContent =
      `Aufgabe ${recognizeIndex + 1} von 4`;

    const answers =
      document.getElementById("recognizeAnswers");

    answers.innerHTML = seasonKeys
      .map((key) => `
        <button
          class="answer-btn"
          data-recognize="${key}"
          type="button"
        >
          ${seasons[key].name}
        </button>
      `)
      .join("");
  }

  document
    .getElementById("recognizeAnswers")
    .addEventListener("click", (event) => {
      const button = event.target.closest("[data-recognize]");

      if (!button) {
        return;
      }

      const task = tasks[recognizeIndex];

      if (button.dataset.recognize !== task.key) {
        button.classList.add("wrong");

        setFeedback(
          document.getElementById("recognizeFeedback"),
          "Versuche es noch einmal.",
          "error"
        );

        return;
      }

      button.classList.add("correct");

      setFeedback(
        document.getElementById("recognizeFeedback"),
        "Richtig!",
        "success"
      );

      recognizeIndex += 1;

      window.setTimeout(renderTask, 650);
    });

  renderTask();
}

function setupSorting() {
  const container = document.getElementById("monthSorting");

  const months = shuffle(Object.keys(monthSeason));

  container.innerHTML = months
    .map((month) => `
      <article
        class="month-question"
        data-month-card="${month}"
      >
        <h3>${month}</h3>

        <div class="month-options">
          ${seasonKeys
            .map((key) => `
              <button
                class="sort-btn"
                data-month="${month}"
                data-month-season="${key}"
                type="button"
              >
                ${seasons[key].shortName}
              </button>
            `)
            .join("")}
        </div>
      </article>
    `)
    .join("");

  container.addEventListener("click", (event) => {
    const button = event.target.closest("[data-month-season]");

    if (!button || button.disabled) {
      return;
    }

    const month = button.dataset.month;
    const selected = button.dataset.monthSeason;
    const correct = monthSeason[month];
    const card = button.closest(".month-question");

    if (selected !== correct) {
      button.classList.add("wrong");

      setFeedback(
        document.getElementById("sortingFeedback"),
        "Noch einmal versuchen.",
        "error"
      );

      return;
    }

    button.classList.add("correct");
    card.classList.add("done");

    card
      .querySelectorAll("button")
      .forEach((item) => {
        item.disabled = true;
      });

    sortingSolved += 1;

    setFeedback(
      document.getElementById("sortingFeedback"),
      `${month} gehört zum ${seasons[correct].shortName}.`,
      "success"
    );

    if (sortingSolved === 12) {
      setFeedback(
        document.getElementById("sortingFeedback"),
        "Sehr gut! Alle Monate sind richtig zugeordnet.",
        "success"
      );

      unlockNext(5);
    }
  });
}

function setupObject() {
  const object = suitcaseObjects[objectIndex];
  const objectCard = document.getElementById("objectCard");
  const answers = document.getElementById("objectAnswers");

  if (!object) {
    objectCard.innerHTML = `
      <strong>Der Koffer ist fertig!</strong>
      <span>Alle Gegenstände sind eingepackt.</span>
    `;

    answers.innerHTML = "";

    setFeedback(
      document.getElementById("objectFeedback"),
      "Gut gemacht! Alle Gegenstände sind richtig eingeordnet.",
      "success"
    );

    unlockNext(6);
    return;
  }

  objectCard.style.display = "grid";

  objectCard.innerHTML = `
    <img
      src="${IMAGE}${object.file}"
      alt="${object.name}"
    >
    <strong>${object.name}</strong>
  `;

  answers.innerHTML = seasonKeys
    .map((key) => `
      <button
        class="answer-btn"
        data-object-season="${key}"
        type="button"
      >
        ${seasons[key].name}
      </button>
    `)
    .join("");

  answers.onclick = (event) => {
    const button = event.target.closest("[data-object-season]");

    if (!button) {
      return;
    }

    const selected = button.dataset.objectSeason;

    if (selected !== object.season) {
      button.classList.add("wrong");

      setFeedback(
        document.getElementById("objectFeedback"),
        "Versuche es noch einmal.",
        "error"
      );

      return;
    }

    button.classList.add("correct");

    const packed = document.createElement("img");

    packed.className = "packed-object";
    packed.src = IMAGE + object.file;
    packed.alt = object.name;
    packed.title = object.name;

    document.getElementById("packedObjects").append(packed);

    packedCount += 1;
    objectIndex += 1;

    setFeedback(
      document.getElementById("objectFeedback"),
      `Richtig! ${packedCount} von ${suitcaseObjects.length}.`,
      "success"
    );

    objectCard.style.display = "none";

    window.setTimeout(setupObject, 550);
  };
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
    setFeedback(
      document.getElementById("dressFeedback"),
      "Felix ist für alle Jahreszeiten richtig angezogen.",
      "success"
    );

    unlockNext(7);
    return;
  }

  selectedClothes = new Set();

  document.getElementById("dressPrompt").innerHTML = `
    Es ist <strong>${seasons[target].shortName}</strong>.
    Wähle genau drei passende Kleidungsstücke.
  `;

  document.getElementById("dressSeasonName").textContent =
    seasons[target].name;

  document.getElementById("dressCounter").textContent =
    "0 von 3 ausgewählt";

  document.getElementById("checkDress").disabled = true;

  const felixImage = document.getElementById("dressFelix");

  felixImage.src =
    `${IMAGE}felix-${target}.webp`;

  felixImage.onerror = () => {
    felixImage.onerror = null;
    felixImage.src =
      `${IMAGE}felix-jahreszeiten.webp`;
  };

  const correctFiles = dressTasks[target];
  const correctItems = clothing.filter((item) =>
    correctFiles.includes(item.file)
  );

  const incorrectItems = shuffle(
    clothing.filter((item) =>
      !correctFiles.includes(item.file)
    )
  ).slice(0, 3);

  const options = shuffle([
    ...correctItems,
    ...incorrectItems
  ]);

  const container =
    document.getElementById("outfitOptions");

  container.innerHTML = options
    .map((item) => `
      <button
        class="outfit-btn"
        data-clothing="${item.file}"
        type="button"
      >
        <img
          src="${IMAGE}${item.file}"
          alt="${item.name}"
        >
        <span>${item.name}</span>
      </button>
    `)
    .join("");

  setFeedback(
    document.getElementById("dressFeedback"),
    "",
    ""
  );
}

function chooseClothing(button) {
  const file = button.dataset.clothing;

  if (selectedClothes.has(file)) {
    selectedClothes.delete(file);
    button.classList.remove("selected");
  } else {
    if (selectedClothes.size >= 3) {
      setFeedback(
        document.getElementById("dressFeedback"),
        "Alege exact trei haine.",
        "error"
      );

      return;
    }

    selectedClothes.add(file);
    button.classList.add("selected");
  }

  document.getElementById("dressCounter").textContent =
    `${selectedClothes.size} von 3 ausgewählt`;

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
  const correct = new Set(dressTasks[target]);

  const isCorrect =
    selectedClothes.size === correct.size &&
    [...selectedClothes].every((file) => correct.has(file));

  if (!isCorrect) {
    setFeedback(
      document.getElementById("dressFeedback"),
      "Noch nicht richtig. Tausche die unpassenden Kleidungsstücke.",
      "error"
    );

    return;
  }

  const felixImage = document.getElementById("dressFelix");

  felixImage.src =
    `${IMAGE}felix-${target}-angezogen.webp`;

  felixImage.onerror = () => {
    felixImage.onerror = null;
    felixImage.src = `${IMAGE}felix-${target}.webp`;
  };

  setFeedback(
    document.getElementById("dressFeedback"),
    `Richtig! Felix ist für den ${seasons[target].shortName} angezogen.`,
    "success"
  );

  document
    .querySelectorAll("#outfitOptions button")
    .forEach((button) => {
      button.disabled = true;

      if (correct.has(button.dataset.clothing)) {
        button.classList.add("correct");
      }
    });

  document.getElementById("checkDress").disabled = true;

  dressIndex += 1;

  if (dressIndex >= order.length) {
    window.setTimeout(() => {
      setFeedback(
        document.getElementById("dressFeedback"),
        "Sehr gut! Felix ist für alle Jahreszeiten vorbereitet.",
        "success"
      );

      unlockNext(7);
    }, 900);

    return;
  }

  window.setTimeout(setupDress, 1200);
}

function setupSentence() {
  const sentence = sentenceTasks[sentenceIndex];

  if (!sentence) {
    setFeedback(
      document.getElementById("sentenceFeedback"),
      "Sehr gut! Alle Sätze sind richtig.",
      "success"
    );

    unlockNext(8);
    return;
  }

  placedWords = [];

  document.getElementById("sentenceTarget").innerHTML = "";
  document.getElementById("sentenceFeedback").textContent = "";

  document.getElementById("wordBank").innerHTML =
    shuffle(sentence)
      .map((word, index) => `
        <button
          class="word-btn"
          data-word="${word}"
          data-word-index="${index}"
          type="button"
        >
          ${word}
        </button>
      `)
      .join("");
}

function chooseWord(button) {
  const sentence = sentenceTasks[sentenceIndex];

  if (!sentence || button.disabled) {
    return;
  }

  const word = button.dataset.word;
  placedWords.push(word);
  button.disabled = true;

  const placed = document.createElement("span");
  placed.className = "placed-word";
  placed.textContent = word;

  document.getElementById("sentenceTarget").append(placed);

  if (placedWords.length !== sentence.length) {
    return;
  }

  const correct =
    placedWords.join(" ") === sentence.join(" ");

  if (!correct) {
    setFeedback(
      document.getElementById("sentenceFeedback"),
      "Ordinea nu este corectă. Încearcă din nou.",
      "error"
    );

    return;
  }

  setFeedback(
    document.getElementById("sentenceFeedback"),
    "Richtig!",
    "success"
  );

  sentenceIndex += 1;

  window.setTimeout(setupSentence, 900);
}

function renderQuiz() {
  const quizBox = document.getElementById("quizBox");

  if (quizBox.dataset.rendered === "true") {
    return;
  }

  quizBox.dataset.rendered = "true";

  quizBox.innerHTML = quizQuestions
    .map((question, questionIndex) => `
      <article class="quiz-question">
        <h3>
          ${questionIndex + 1}. ${question.question}
        </h3>

        <div class="quiz-options">
          ${question.options
            .map((option) => `
              <label class="quiz-option">
                <input
                  type="radio"
                  name="quiz-${questionIndex}"
                  value="${option}"
                >
                <span>${option}</span>
              </label>
            `)
            .join("")}
        </div>
      </article>
    `)
    .join("");
}

function submitQuiz() {
  let answered = 0;
  let score = 0;

  quizQuestions.forEach((question, index) => {
    const selected = document.querySelector(
      `input[name="quiz-${index}"]:checked`
    );

    if (!selected) {
      return;
    }

    answered += 1;

    if (selected.value === question.answer) {
      score += 1;
    }
  });

  const feedback = document.getElementById("quizFeedback");

  if (answered < quizQuestions.length) {
    setFeedback(
      feedback,
      "Răspunde la toate cele 10 întrebări.",
      "error"
    );

    return;
  }

  finalQuizScore = score;

  setFeedback(
    feedback,
    `Du hast ${score} von 10 Punkten erreicht.`,
    score >= 8 ? "success" : "error"
  );

  unlockNext(9);

  document
    .querySelectorAll("#quizBox input")
    .forEach((input) => {
      input.disabled = true;
    });

  document.getElementById("submitQuiz").disabled = true;
}

document.addEventListener("click", (event) => {
  const startButton = event.target.closest("#startLesson");

  if (startButton) {
    showStage(1);
    return;
  }

  const nextButton = event.target.closest(".next-btn");

  if (nextButton && !nextButton.disabled) {
    showStage(Number(nextButton.dataset.next));
    return;
  }

  const seasonTab = event.target.closest(".season-tab");

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

  const audioButton = event.target.closest("[data-audio]");

  if (audioButton) {
    playAudio(
      audioButton.dataset.audio,
      audioButton
    );

    return;
  }

  const introAudioButton =
    event.target.closest("#introAudioButton");

  if (introAudioButton) {
    playAudio(
      [
        "intro.mp3",
        "jahreszeiten-intro.mp3",
        "einfuehrung.mp3"
      ],
      introAudioButton,
      document.getElementById("introAudioStatus")
    );

    return;
  }

  const wheelButton = event.target.closest("#wheelButton");

  if (wheelButton) {
    startWheel();
    return;
  }

  const outfitButton =
    event.target.closest("[data-clothing]");

  if (outfitButton) {
    chooseClothing(outfitButton);
    return;
  }

  const wordButton = event.target.closest(".word-btn");

  if (wordButton) {
    chooseWord(wordButton);
  }
});

document
  .getElementById("checkDress")
  .addEventListener("click", checkDress);

document
  .getElementById("resetSentence")
  .addEventListener("click", setupSentence);

document
  .getElementById("submitQuiz")
  .addEventListener("click", submitQuiz);

document
  .getElementById("restartLesson")
  .addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

    window.setTimeout(() => {
      window.location.reload();
    }, 350);
  });

renderSeason("fruehling");
renderOrdinals();
setupRecognition();
setupSorting();
setupSentence();
updateProgress(0);
