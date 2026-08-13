const IMAGE = "../assets/images/lessons/jahreszeiten/";
const ICON = "../assets/icons/monate/";
const AUDIO = "../audio/jahreszeiten/";

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
    sentence: "Im Sommer ist es warm und sonnig.",
    translation: "Vara este cald \u0219i \u00eensorit.",
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
    a: ["der achte Monat", "der neunte Monat", "der elfte Monat"],
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
    a: ["der Schlitten", "die Sonnenbrille", "die M\u00fctze"],
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

let currentStage = 0;
let wheelSpinning = false;
let wheelTurns = 0;
let recognizeIndex = 0;
let objectIndex = 0;
let dressIndex = 0;
let packedObjects = [];
let sentenceChoice = [];
let finalQuizScore = 0;
let audioQueue = [];

const lessonAudio = document.getElementById("lessonAudio");

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function shuffle(list) {
  return [...list].sort(() => Math.random() - 0.5);
}

function setFeedback(element, message = "", type = "") {
  if (!element) return;

  element.textContent = message;
  element.classList.remove("success", "error");

  if (type) {
    element.classList.add(type);
  }
}

function playAudio(files, button = null, statusElement = null) {
  const candidates = Array.isArray(files) ? files : [files];
  let index = 0;

  lessonAudio.pause();
  lessonAudio.currentTime = 0;

  document
    .querySelectorAll(".audio-btn.playing, .mini-audio.playing")
    .forEach((item) => item.classList.remove("playing"));

  if (button) {
    button.classList.add("playing");
  }

  if (statusElement) {
    statusElement.textContent = "Audio wird abgespielt \u2026";
  }

  function tryNextAudio() {
    if (index >= candidates.length) {
      if (button) {
        button.classList.remove("playing");
      }

      if (statusElement) {
        statusElement.textContent =
          "Fi\u0219ierul audio nu a fost g\u0103sit. Verific\u0103 denumirea MP3.";
      }

      return;
    }

    const file = candidates[index];
    index += 1;

    lessonAudio.src = AUDIO + file;
    lessonAudio.load();

    const promise = lessonAudio.play();

    if (promise) {
      promise.catch(() => {
        tryNextAudio();
      });
    }
  }

  lessonAudio.onended = () => {
    if (button) {
      button.classList.remove("playing");
    }

    if (statusElement) {
      statusElement.textContent = "";
    }

    if (audioQueue.length > 0) {
      const nextFile = audioQueue.shift();
      playAudio(nextFile);
    }
  };

  lessonAudio.onerror = () => {
    tryNextAudio();
  };

  tryNextAudio();
}

function updateProgress(stage) {
  const total = 10;
  const percentage = Math.max(0, Math.min(100, (stage / total) * 100));

  document.getElementById("progressText").textContent =
    stage === 0 ? "Start" : `Schritt ${stage} von ${total}`;

  document.getElementById("progressFill").style.width = `${percentage}%`;
}

function showStage(stage) {
  document.querySelectorAll(".stage").forEach((section) => {
    section.classList.add("is-hidden");
  });

  document.querySelector(".hero").classList.add("is-hidden");

  const target = document.querySelector(`[data-stage="${stage}"]`);

  if (!target) return;

  currentStage = stage;
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

      <p class="translation">${season.ro}</p>

      <div class="month-chips">
        ${season.months
          .map((month) => `<span class="chip">${month}</span>`)
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

function toggleWheel() {
  const button = document.getElementById("wheelButton");
  const wheel = document.getElementById("seasonWheel");
  const action = document.getElementById("wheelAction");
  const result = document.getElementById("wheelResult");

  if (!wheelSpinning) {
    wheelSpinning = true;

    button.classList.add("spinning");
    action.textContent = "Stoppen";

    result.classList.remove("is-hidden");
    result.classList.add("wheel-result--waiting");

    result.innerHTML = `
      <div class="wheel-result-content">
        <h3>Das Rad dreht sich ...</h3>
        <p>
          Dr\u00fccke noch einmal auf das Rad,
          um es zu stoppen.
        </p>
      </div>
    `;

    return;
  }

  wheelSpinning = false;
  button.classList.remove("spinning");
  action.textContent = "Noch einmal";

  const keys = Object.keys(seasons);
  const key = keys[Math.floor(Math.random() * keys.length)];
  const season = seasons[key];
  const index = keys.indexOf(key);

  wheelTurns += 3 + Math.floor(Math.random() * 3);

  wheel.style.transform =
    `rotate(${wheelTurns * 360 - index * 90}deg)`;

  result.innerHTML = `
    <img
      src="${IMAGE}${season.image}"
      alt="${season.name}"
    >

    <div class="wheel-result-content">
      <h3>${season.name}</h3>

      <p class="translation">${season.ro}</p>

      <p>
        <strong>${season.months.join(" \u00b7 ")}</strong>
      </p>

      <p>${season.sentence}</p>

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

  result.classList.remove("is-hidden", "wheel-result--waiting");

  playAudio([season.sentenceAudio, season.audio]);
}

function renderOrdinals() {
  const grid = document.getElementById("ordinalGrid");

  grid.innerHTML = ordinals
    .map(([month, ordinal], index) => {
      const audioNumber = String(index + 1).padStart(2, "0");

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
  const order = ["fruehling", "sommer", "herbst", "winter"];
  const key = order[recognizeIndex];
  const season = seasons[key];

  document.getElementById("recognizeImage").src =
    IMAGE + season.image;

  document.getElementById("recognizePrompt").textContent =
    `Frage ${recognizeIndex + 1}/4: Welche Jahreszeit ist das?`;

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
  const order = ["fruehling", "sommer", "herbst", "winter"];
  const correct = order[recognizeIndex];
  const feedback = document.getElementById("recognizeFeedback");

  if (button.dataset.value !== correct) {
    button.classList.add("wrong");
    setFeedback(feedback, "Versuche es noch einmal.", "error");
    return;
  }

  button.classList.add("correct");

  setFeedback(
    feedback,
    `Richtig! Das ist ${seasons[correct].name}.`,
    "success"
  );

  playAudio(seasons[correct].audio);

  setTimeout(() => {
    recognizeIndex += 1;

    if (recognizeIndex < 4) {
      setupRecognition();
      setFeedback(feedback);
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

function renderMonthSorting() {
  const tasks = [
    ["Juli", "sommer"],
    ["Oktober", "herbst"],
    ["Januar", "winter"],
    ["April", "fruehling"]
  ];

  document.getElementById("monthSorting").innerHTML = tasks
    .map(([month, correct]) => {
      return `
        <article
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
        </article>
      `;
    })
    .join("");
}

function checkMonthSorting(button) {
  const card = button.closest(".sort-card");
  const feedback = document.getElementById("sortingFeedback");
  const correct = card.dataset.correct;

  if (button.dataset.value !== correct) {
    button.classList.add("wrong");

    setFeedback(
      feedback,
      "Das passt noch nicht. Versuche es noch einmal.",
      "error"
    );

    return;
  }

  card.classList.add("done");

  card.querySelectorAll("button").forEach((item) => {
    item.disabled = true;
  });

  button.classList.add("correct");
  playAudio(seasons[correct].audio);

  const completed =
    document.querySelectorAll("#monthSorting .sort-card.done").length;

  if (completed === 4) {
    setFeedback(
      feedback,
      "Sehr gut! Alle Monate sind richtig zugeordnet.",
      "success"
    );

    unlockNext(5);
  } else {
    setFeedback(feedback, "Richtig!", "success");
  }
}

function setupObject() {
  if (objectIndex >= objects.length) return;

  const [file, name] = objects[objectIndex];
  const audioFile = file
    .replace("objekt-", "")
    .replace(".webp", ".mp3");

  document.getElementById("objectCard").innerHTML = `
    <img
      src="${IMAGE}${file}"
      alt="${escapeHtml(name)}"
      data-object-audio="${audioFile}"
    >

    <strong>${escapeHtml(name)}</strong>
    <small>Bild ber\u00fchren und h\u00f6ren</small>
  `;

  document.getElementById("objectAnswers").innerHTML =
    Object.keys(seasons)
      .map((key) => {
        return `
          <button
            class="answer-btn"
            type="button"
            data-object-season="${key}"
          >
            ${seasons[key].name}
          </button>
        `;
      })
      .join("");
}

function renderPackedObjects() {
  document.getElementById("packedObjects").innerHTML =
    packedObjects
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
  const [file, name, correctSeason] = objects[objectIndex];
  const selectedSeason = button.dataset.objectSeason;
  const feedback = document.getElementById("objectFeedback");

  if (selectedSeason !== correctSeason) {
    button.classList.add("wrong");

    setFeedback(
      feedback,
      "Das passt noch nicht in diese Jahreszeit.",
      "error"
    );

    return;
  }

  const audioFile = file
    .replace("objekt-", "")
    .replace(".webp", ".mp3");

  packedObjects.push({
    file,
    name,
    audio: audioFile
  });

  renderPackedObjects();
  playAudio(audioFile);

  button.classList.add("correct");

  setFeedback(
    feedback,
    `Richtig! ${name} passt zu ${seasons[correctSeason].name}.`,
    "success"
  );

  setTimeout(() => {
    objectIndex += 1;

    if (objectIndex < objects.length) {
      setupObject();
      setFeedback(feedback);
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
      "Gut gemacht! Alle 16 Gegenst\u00e4nde sind richtig eingeordnet.",
      "success"
    );

    unlockNext(6);
  }, 600);
}

function setupDress() {
  const order = ["fruehling", "sommer", "herbst", "winter"];
  const correctSeason = order[dressIndex];

  document.getElementById("dressPrompt").textContent =
    `${seasons[correctSeason].name.replace("der ", "Es ist ")}. ` +
    "Welche Kleidung braucht Felix?";

  document.getElementById("dressFelix").src =
    IMAGE + "felix-jahreszeiten.webp";

  document.getElementById("outfitOptions").innerHTML =
    shuffle(order)
      .map((key) => {
        return `
          <button
            class="outfit-btn"
            type="button"
            data-outfit="${key}"
          >
            <img
              src="${IMAGE}felix-${key}.webp"
              alt="Felix: ${seasons[key].name}"
            >

            <span>${seasons[key].name}</span>
          </button>
        `;
      })
      .join("");
}

function checkDress(button) {
  const order = ["fruehling", "sommer", "herbst", "winter"];
  const correct = order[dressIndex];
  const feedback = document.getElementById("dressFeedback");

  if (button.dataset.outfit !== correct) {
    button.classList.add("wrong");

    setFeedback(
      feedback,
      "Diese Kleidung passt noch nicht.",
      "error"
    );

    return;
  }

  button.classList.add("correct");

  document.getElementById("dressFelix").src =
    IMAGE + `felix-${correct}.webp`;

  setFeedback(
    feedback,
    `Richtig! So ist Felix f\u00fcr ${seasons[correct].name} angezogen.`,
    "success"
  );

  playAudio(seasons[correct].audio);

  setTimeout(() => {
    dressIndex += 1;

    if (dressIndex < 4) {
      setupDress();
      setFeedback(feedback);
    } else {
      setFeedback(
        feedback,
        "Super! Felix ist f\u00fcr jedes Wetter bereit.",
        "success"
      );

      unlockNext(7);
    }
  }, 650);
}

const sentenceWords = [
  "Im",
  "Herbst",
  "fallen",
  "die",
  "Bl\u00e4tter."
];

function renderSentence() {
  sentenceChoice = [];

  document.getElementById("sentenceTarget").innerHTML = "";

  document.getElementById("wordBank").innerHTML =
    shuffle(sentenceWords)
      .map((word) => {
        return `
          <button
            class="word-btn"
            type="button"
            data-word="${escapeHtml(word)}"
          >
            ${escapeHtml(word)}
          </button>
        `;
      })
      .join("");

  setFeedback(document.getElementById("sentenceFeedback"));
}

function chooseWord(button) {
  button.disabled = true;
  sentenceChoice.push(button.dataset.word);

  document.getElementById("sentenceTarget").insertAdjacentHTML(
    "beforeend",
    `
      <span class="placed-word">
        ${escapeHtml(button.dataset.word)}
      </span>
    `
  );

  if (sentenceChoice.length !== sentenceWords.length) return;

  const feedback = document.getElementById("sentenceFeedback");

  if (sentenceChoice.join(" ") === sentenceWords.join(" ")) {
    setFeedback(
      feedback,
      "Richtig! Im Herbst fallen die Bl\u00e4tter.",
      "success"
    );

    playAudio("herbst-satz.mp3");
    unlockNext(8);
  } else {
    setFeedback(
      feedback,
      "Die Reihenfolge stimmt noch nicht. Versuche es noch einmal.",
      "error"
    );
  }
}

function renderQuiz() {
  const quizBox = document.getElementById("quizBox");
  const submit = document.getElementById("submitQuiz");

  quizBox.innerHTML = quizQuestions
    .map((question, questionIndex) => {
      return `
        <article class="quiz-question">
          <h3>
            ${questionIndex + 1}. ${question.q}
          </h3>

          <div class="quiz-options">
            ${question.a
              .map((answer, answerIndex) => {
                return `
                  <label class="quiz-option">
                    <input
                      type="radio"
                      name="quiz-${questionIndex}"
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

  submit.disabled = false;
  submit.dataset.mode = "check";
  submit.textContent = "Quiz pr\u00fcfen";

  setFeedback(document.getElementById("quizFeedback"));
}

function checkQuiz() {
  const submitButton = document.getElementById("submitQuiz");
  const feedback = document.getElementById("quizFeedback");

  if (submitButton.dataset.mode === "repeat") {
    renderQuiz();
    return;
  }

  const selectedAnswers = quizQuestions.map((question, index) => {
    return document.querySelector(
      `input[name="quiz-${index}"]:checked`
    );
  });

  if (selectedAnswers.some((answer) => !answer)) {
    setFeedback(
      feedback,
      "Bitte beantworte zuerst alle zehn Fragen.",
      "error"
    );

    return;
  }

  finalQuizScore = selectedAnswers.reduce(
    (score, selected, index) => {
      return score +
        (Number(selected.value) === quizQuestions[index].correct ? 1 : 0);
    },
    0
  );

  document
    .querySelectorAll(".quiz-question")
    .forEach((questionElement, index) => {
      const selected = questionElement.querySelector(
        "input[type='radio']:checked"
      );

      const options =
        questionElement.querySelectorAll(".quiz-option");

      options.forEach((option, optionIndex) => {
        option.classList.remove("correct", "wrong");

        if (optionIndex === quizQuestions[index].correct) {
          option.classList.add("correct");
        } else if (
          selected &&
          Number(selected.value) === optionIndex
        ) {
          option.classList.add("wrong");
        }
      });
    });

  if (finalQuizScore >= 8) {
    setFeedback(
      feedback,
      `Sehr gut! Du hast ${finalQuizScore} von 10 Punkten.`,
      "success"
    );

    unlockNext(9);
  } else {
    setFeedback(
      feedback,
      `Du hast ${finalQuizScore} von 10 Punkten. ` +
      "Versuche es noch einmal, um mindestens 8 Punkte zu erreichen.",
      "error"
    );

    submitButton.dataset.mode = "repeat";
    submitButton.textContent = "Quiz wiederholen";
  }
}

function showFinalResult() {
  document.getElementById("finalScore").textContent =
    `Dein Ergebnis: ${finalQuizScore} von 10 Punkten.`;

  document.getElementById("certificateScore").textContent =
    `${finalQuizScore} von 10 Punkten`;

  const certificate = document.getElementById("certificate");

  if (finalQuizScore >= 8) {
    certificate.classList.remove("is-hidden");
  } else {
    certificate.classList.add("is-hidden");
  }
}

function resetLesson() {
  lessonAudio.pause();
  lessonAudio.currentTime = 0;

  currentStage = 0;
  wheelSpinning = false;
  wheelTurns = 0;
  recognizeIndex = 0;
  objectIndex = 0;
  dressIndex = 0;
  packedObjects = [];
  sentenceChoice = [];
  finalQuizScore = 0;

  document.querySelectorAll(".stage").forEach((stage) => {
    stage.classList.add("is-hidden");
  });

  document.querySelector(".hero").classList.remove("is-hidden");

  document.querySelectorAll(".next-btn").forEach((button) => {
    const next = Number(button.dataset.next);

    if (next >= 5 && next <= 10) {
      button.disabled = true;
      button.classList.add("locked");
    }
  });

  const wheelButton = document.getElementById("wheelButton");
  const seasonWheel = document.getElementById("seasonWheel");
  const wheelAction = document.getElementById("wheelAction");
  const wheelResult = document.getElementById("wheelResult");

  wheelButton.classList.remove("spinning");
  seasonWheel.style.transform = "";
  wheelAction.textContent = "Drehen";

  wheelResult.classList.remove("is-hidden");
  wheelResult.classList.add("wheel-result--waiting");

  wheelResult.innerHTML = `
    <div class="wheel-result-content">
      <h3>Drehe das Rad!</h3>
      <p>
        Starte die Drehung und stoppe das Rad.
        Danach siehst und h\u00f6rst du eine Jahreszeit.
      </p>
    </div>
  `;

  document.getElementById("packedObjects").innerHTML = "";
  document.getElementById("certificate").classList.add("is-hidden");

  setupRecognition();
  renderMonthSorting();
  renderSentence();
  updateProgress(0);

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

document.addEventListener("click", (event) => {
  const target = event.target;

  const startButton = target.closest("#startLesson");

  if (startButton) {
    showStage(1);
    return;
  }

  const nextButton = target.closest(".next-btn");

  if (nextButton && !nextButton.disabled) {
    const nextStage = Number(nextButton.dataset.next);
    showStage(nextStage);

    if (nextStage === 10) {
      showFinalResult();
    }

    return;
  }

  const seasonTab = target.closest(".season-tab");

  if (seasonTab) {
    document.querySelectorAll(".season-tab").forEach((tab) => {
      tab.classList.remove("active");
    });

    seasonTab.classList.add("active");
    renderSeason(seasonTab.dataset.season);
    playAudio(seasons[seasonTab.dataset.season].audio);
    return;
  }

  const wheelButton = target.closest("#wheelButton");

  if (wheelButton) {
    toggleWheel();
    return;
  }

  const audioButton = target.closest("[data-audio]");

  if (audioButton) {
    playAudio(audioButton.dataset.audio, audioButton);
    return;
  }

  const objectAudio = target.closest("[data-object-audio]");

  if (objectAudio) {
    playAudio(objectAudio.dataset.objectAudio, objectAudio);
    return;
  }

  const recognitionButton = target.closest(
    "#recognizeAnswers .answer-btn"
  );

  if (recognitionButton) {
    checkRecognition(recognitionButton);
    return;
  }

  const sortingButton = target.closest(".sort-btn");

  if (sortingButton) {
    checkMonthSorting(sortingButton);
    return;
  }

  const objectSeasonButton = target.closest(
    "[data-object-season]"
  );

  if (objectSeasonButton) {
    checkObject(objectSeasonButton);
    return;
  }

  const outfitButton = target.closest("[data-outfit]");

  if (outfitButton) {
    checkDress(outfitButton);
    return;
  }

  const wordButton = target.closest(".word-btn");

  if (wordButton) {
    chooseWord(wordButton);
  }
});

document
  .getElementById("introAudioButton")
  .addEventListener("click", function () {
    const status = document.getElementById("introAudioStatus");

    playAudio(
      [
        "intro.mp3",
        "jahreszeiten-intro.mp3",
        "einfuehrung.mp3"
      ],
      this,
      status
    );
  });

document
  .getElementById("resetSentence")
  .addEventListener("click", renderSentence);

document
  .getElementById("submitQuiz")
  .addEventListener("click", checkQuiz);

document
  .getElementById("restartLesson")
  .addEventListener("click", resetLesson);

document.querySelectorAll("img").forEach((image) => {
  image.addEventListener("error", () => {
    image.title =
      "Imaginea lipse\u0219te. Verific\u0103 denumirea fi\u0219ierului.";
  });
});

renderSeason("fruehling");
renderOrdinals();
setupRecognition();
renderMonthSorting();
renderSentence();
updateProgress(0);
