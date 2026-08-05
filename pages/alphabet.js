const AUDIO_ROOT = "../audio/alphabet";
const STORAGE_KEY = "kdw-alphabet-progress-v1";

const alphabetData = [
  { key: "a", display: "A", lower: "a", article: "der", word: "Apfel", wordRo: "mărul", sentence: "Das ist ein Apfel.", sentenceRo: "Acesta este un măr." },
  { key: "b", display: "B", lower: "b", article: "der", word: "Ball", wordRo: "mingea", sentence: "Das ist ein Ball.", sentenceRo: "Aceasta este o minge." },
  { key: "c", display: "C", lower: "c", article: "der", word: "Computer", wordRo: "calculatorul", sentence: "Das ist ein Computer.", sentenceRo: "Acesta este un calculator." },
  { key: "d", display: "D", lower: "d", article: "das", word: "Dorf", wordRo: "satul", sentence: "Das ist ein Dorf.", sentenceRo: "Acesta este un sat." },
  { key: "e", display: "E", lower: "e", article: "der", word: "Elefant", wordRo: "elefantul", sentence: "Das ist ein Elefant.", sentenceRo: "Acesta este un elefant." },
  { key: "f", display: "F", lower: "f", article: "der", word: "Fisch", wordRo: "peștele", sentence: "Das ist ein Fisch.", sentenceRo: "Acesta este un pește." },
  { key: "g", display: "G", lower: "g", article: "das", word: "Geschenk", wordRo: "cadoul", sentence: "Das ist ein Geschenk.", sentenceRo: "Acesta este un cadou." },
  { key: "h", display: "H", lower: "h", article: "das", word: "Haus", wordRo: "casa", sentence: "Das ist ein Haus.", sentenceRo: "Aceasta este o casă." },
  { key: "i", display: "I", lower: "i", article: "die", word: "Insel", wordRo: "insula", sentence: "Das ist eine Insel.", sentenceRo: "Aceasta este o insulă." },
  { key: "j", display: "J", lower: "j", article: "der", word: "Joghurt", wordRo: "iaurtul", sentence: "Das ist ein Joghurt.", sentenceRo: "Acesta este un iaurt." },
  { key: "k", display: "K", lower: "k", article: "die", word: "Katze", wordRo: "pisica", sentence: "Das ist eine Katze.", sentenceRo: "Aceasta este o pisică." },
  { key: "l", display: "L", lower: "l", article: "die", word: "Lampe", wordRo: "lampa", sentence: "Das ist eine Lampe.", sentenceRo: "Aceasta este o lampă." },
  { key: "m", display: "M", lower: "m", article: "die", word: "Maus", wordRo: "șoarecele", sentence: "Das ist eine Maus.", sentenceRo: "Acesta este un șoarece." },
  { key: "n", display: "N", lower: "n", article: "die", word: "Nase", wordRo: "nasul", sentence: "Das ist eine Nase.", sentenceRo: "Acesta este un nas." },
  { key: "o", display: "O", lower: "o", article: "die", word: "Orange", wordRo: "portocala", sentence: "Das ist eine Orange.", sentenceRo: "Aceasta este o portocală." },
  { key: "p", display: "P", lower: "p", article: "der", word: "Pinguin", wordRo: "pinguinul", sentence: "Das ist ein Pinguin.", sentenceRo: "Acesta este un pinguin." },
  { key: "q", display: "Q", lower: "q", article: "die", word: "Qualle", wordRo: "meduza", sentence: "Das ist eine Qualle.", sentenceRo: "Aceasta este o meduză." },
  { key: "r", display: "R", lower: "r", article: "die", word: "Rose", wordRo: "trandafirul", sentence: "Das ist eine Rose.", sentenceRo: "Acesta este un trandafir." },
  { key: "s", display: "S", lower: "s", article: "die", word: "Sonne", wordRo: "soarele", sentence: "Das ist eine Sonne.", sentenceRo: "Acesta este un soare." },
  { key: "t", display: "T", lower: "t", article: "der", word: "Tannenbaum", wordRo: "bradul", sentence: "Das ist ein Tannenbaum.", sentenceRo: "Acesta este un brad." },
  { key: "u", display: "U", lower: "u", article: "die", word: "Uhr", wordRo: "ceasul", sentence: "Das ist eine Uhr.", sentenceRo: "Acesta este un ceas." },
  { key: "v", display: "V", lower: "v", article: "der", word: "Vogel", wordRo: "pasărea", sentence: "Das ist ein Vogel.", sentenceRo: "Aceasta este o pasăre." },
  { key: "w", display: "W", lower: "w", article: "die", word: "Wolke", wordRo: "norul", sentence: "Das ist eine Wolke.", sentenceRo: "Acesta este un nor." },
  { key: "x", display: "X", lower: "x", article: "das", word: "Xylofon", wordRo: "xilofonul", sentence: "Das ist ein Xylofon.", sentenceRo: "Acesta este un xilofon." },
  { key: "y", display: "Y", lower: "y", article: "die", word: "Yacht", wordRo: "iahtul", sentence: "Das ist eine Yacht.", sentenceRo: "Acesta este un iaht." },
  { key: "z", display: "Z", lower: "z", article: "die", word: "Zitrone", wordRo: "lămâia", sentence: "Das ist eine Zitrone.", sentenceRo: "Aceasta este o lămâie." },
  { key: "ae", display: "Ä", lower: "ä", article: "die", gender: "plural", word: "Äpfel", wordRo: "merele", sentence: "Das sind Äpfel.", sentenceRo: "Acestea sunt mere." },
  { key: "oe", display: "Ö", lower: "ö", article: "das", word: "Öl", wordRo: "uleiul", sentence: "Das ist Öl.", sentenceRo: "Acesta este ulei." },
  { key: "ue", display: "Ü", lower: "ü", article: "die", word: "Überraschung", wordRo: "surpriza", sentence: "Das ist eine Überraschung.", sentenceRo: "Aceasta este o surpriză." },
  { key: "ss", display: "ß", lower: "ß", article: "der", word: "Fuß", wordRo: "piciorul", sentence: "Das ist ein Fuß.", sentenceRo: "Acesta este un picior." }
];

const colorCycle = ["#ffe5ef", "#ddf2ff", "#e4f8cf", "#fff0c8", "#eee3ff", "#d9f7f4"];
const state = loadState();
let activeLetter = alphabetData[0];
let currentAudio = null;
let currentAudioOwner = null;
let currentAudioResolve = null;
let audioSequenceCancelled = false;
let statusTimer = null;
let quizQuestions = [];
let quizIndex = 0;
let quizScore = 0;
let quizAnswered = false;

const elements = {
  progressLabel: document.getElementById("progress-label"),
  progressBar: document.getElementById("progress-bar"),
  audioStatus: document.getElementById("audio-status"),
  lettersGrid: document.getElementById("letters-grid"),
  detailLetter: document.getElementById("detail-letter"),
  detailArticle: document.getElementById("detail-article"),
  detailWord: document.getElementById("detail-word"),
  detailWordRo: document.getElementById("detail-word-ro"),
  detailSentence: document.getElementById("detail-sentence"),
  detailSentenceRo: document.getElementById("detail-sentence-ro"),
  markLearned: document.getElementById("mark-learned"),
  learnedCount: document.getElementById("learned-count"),
  playLetter: document.getElementById("play-letter"),
  playWord: document.getElementById("play-word"),
  playSentence: document.getElementById("play-sentence"),
  nameInput: document.getElementById("name-input"),
  spelledName: document.getElementById("spelled-name"),
  nameFeedback: document.getElementById("name-feedback"),
  quizCounter: document.getElementById("quiz-counter"),
  quizTitle: document.getElementById("quiz-title"),
  quizListen: document.getElementById("quiz-listen"),
  quizOptions: document.getElementById("quiz-options"),
  quizFeedback: document.getElementById("quiz-feedback"),
  quizStart: document.getElementById("quiz-start"),
  quizNext: document.getElementById("quiz-next"),
  resultCard: document.getElementById("result-card"),
  resultScore: document.getElementById("result-score"),
  resultTitle: document.getElementById("result-title"),
  resultMessage: document.getElementById("result-message"),
  masterBadge: document.getElementById("master-badge")
};

function loadState() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return {
      learned: Array.isArray(stored?.learned) ? stored.learned : [],
      sections: Array.isArray(stored?.sections) ? stored.sections : [],
      bestScore: Number.isFinite(stored?.bestScore) ? stored.bestScore : 0
    };
  } catch {
    return { learned: [], sections: [], bestScore: 0 };
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  updateProgress();
}

function markSection(section) {
  if (!state.sections.includes(section)) {
    state.sections.push(section);
    saveState();
  }
}

function updateProgress() {
  const sectionPoints = state.sections.length;
  const learnedPoints = state.learned.length / alphabetData.length * 3;
  const quizPoints = state.bestScore === 5 ? 2 : state.bestScore > 0 ? 1 : 0;
  const percentage = Math.min(100, Math.round((sectionPoints + learnedPoints + quizPoints) / 10 * 100));
  elements.progressLabel.textContent = `${percentage} %`;
  elements.progressBar.style.width = `${percentage}%`;
}

function showStatus(message) {
  window.clearTimeout(statusTimer);
  elements.audioStatus.textContent = message;
  elements.audioStatus.classList.add("show");
  statusTimer = window.setTimeout(() => elements.audioStatus.classList.remove("show"), 2200);
}

function stopAudio() {
  audioSequenceCancelled = true;
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }
  if (currentAudioOwner) currentAudioOwner.classList.remove("is-audio-playing", "is-playing");
  currentAudio = null;
  currentAudioOwner = null;
  if (currentAudioResolve) currentAudioResolve();
  currentAudioResolve = null;
  document.querySelectorAll(".is-playing").forEach(item => item.classList.remove("is-playing"));
}

function playAudio(src, owner = null) {
  stopAudio();
  audioSequenceCancelled = false;
  const audio = new Audio(src);
  currentAudio = audio;
  currentAudioOwner = owner;
  if (owner) owner.classList.add("is-audio-playing", "is-playing");
  return new Promise((resolve, reject) => {
    currentAudioResolve = resolve;
    audio.addEventListener("ended", () => {
      if (owner) owner.classList.remove("is-audio-playing", "is-playing");
      currentAudio = null;
      currentAudioOwner = null;
      currentAudioResolve = null;
      resolve();
    }, { once: true });
    audio.addEventListener("error", () => {
      if (owner) owner.classList.remove("is-audio-playing", "is-playing");
      currentAudio = null;
      currentAudioOwner = null;
      currentAudioResolve = null;
      showStatus("Audio konnte nicht geladen werden.");
      reject(new Error(`Audio missing: ${src}`));
    }, { once: true });
    audio.play().catch(error => {
      if (owner) owner.classList.remove("is-audio-playing", "is-playing");
      currentAudio = null;
      currentAudioOwner = null;
      currentAudioResolve = null;
      showStatus("Tippe noch einmal, um das Audio zu starten.");
      reject(error);
    });
  });
}

document.querySelectorAll(".audio-trigger").forEach(button => {
  button.addEventListener("click", () => {
    const line = button.closest(".dialog-line");
    const owner = line || (button.hasAttribute("data-dialog-all") ? document.getElementById("dialog-card") : button);
    playAudio(button.dataset.audio, owner).catch(() => {});
    if (button.closest("#dialog")) markSection("dialog");
  });
});

document.getElementById("stop-audio").addEventListener("click", stopAudio);

const translationToggle = document.getElementById("translation-toggle");
const dialogTranslation = document.getElementById("dialog-translation");
translationToggle.addEventListener("click", () => {
  const open = translationToggle.getAttribute("aria-expanded") === "true";
  translationToggle.setAttribute("aria-expanded", String(!open));
  dialogTranslation.hidden = open;
  translationToggle.textContent = open ? "Übersetzung anzeigen" : "Übersetzung ausblenden";
});

function letterAudioPath(item) { return `${AUDIO_ROOT}/letters/${item.key}.mp3`; }
function wordAudioPath(item) { return `${AUDIO_ROOT}/words/${item.key}-wort.mp3`; }
function sentenceAudioPath(item) { return `${AUDIO_ROOT}/sentences/${item.key}-satz.mp3`; }

function renderLetters() {
  const fragment = document.createDocumentFragment();
  alphabetData.forEach((item, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "letter-button";
    button.textContent = item.display;
    button.style.setProperty("--letter-bg", colorCycle[index % colorCycle.length]);
    button.dataset.key = item.key;
    button.setAttribute("aria-label", `Buchstabe ${item.display}`);
    if (item.key === activeLetter.key) button.classList.add("is-active");
    if (state.learned.includes(item.key)) button.classList.add("is-learned");
    button.addEventListener("click", () => selectLetter(item, button, true));
    fragment.appendChild(button);
  });
  elements.lettersGrid.appendChild(fragment);
  updateLearnedCount();
}

function selectLetter(item, button, autoplay = false) {
  activeLetter = item;
  document.querySelectorAll(".letter-button").forEach(el => el.classList.toggle("is-active", el.dataset.key === item.key));
  if (button) button.classList.add("is-active");
  elements.detailLetter.textContent = `${item.display} ${item.lower}`;
  elements.detailArticle.textContent = item.article;
  elements.detailArticle.dataset.gender = item.gender || item.article;
  elements.detailWord.textContent = item.word;
  elements.detailWordRo.textContent = item.wordRo;
  elements.detailSentence.textContent = item.sentence;
  elements.detailSentenceRo.textContent = item.sentenceRo;
  updateLearnedButton();
  markSection("discover");
  if (autoplay) playAudio(letterAudioPath(item), button).catch(() => {});
}

function updateLearnedButton() {
  const learned = state.learned.includes(activeLetter.key);
  elements.markLearned.classList.toggle("is-learned", learned);
  elements.markLearned.textContent = learned ? "Geübt" : "Als geübt markieren";
}

function updateLearnedCount() {
  elements.learnedCount.textContent = `${state.learned.length} von 30 Buchstaben geübt`;
  document.querySelectorAll(".letter-button").forEach(button => button.classList.toggle("is-learned", state.learned.includes(button.dataset.key)));
}

elements.playLetter.addEventListener("click", () => playAudio(letterAudioPath(activeLetter), elements.playLetter).catch(() => {}));
elements.playWord.addEventListener("click", () => playAudio(wordAudioPath(activeLetter), elements.playWord).catch(() => {}));
elements.playSentence.addEventListener("click", () => playAudio(sentenceAudioPath(activeLetter), elements.playSentence).catch(() => {}));
elements.markLearned.addEventListener("click", () => {
  if (!state.learned.includes(activeLetter.key)) state.learned.push(activeLetter.key);
  else state.learned = state.learned.filter(key => key !== activeLetter.key);
  saveState();
  updateLearnedButton();
  updateLearnedCount();
});

document.getElementById("play-alphabet").addEventListener("click", async event => {
  stopAudio();
  audioSequenceCancelled = false;
  event.currentTarget.classList.add("is-audio-playing");
  markSection("board");
  for (const item of alphabetData) {
    if (audioSequenceCancelled) break;
    const button = document.querySelector(`.letter-button[data-key="${item.key}"]`);
    document.querySelectorAll(".letter-button").forEach(el => el.classList.toggle("is-active", el === button));
    try { await playAudio(letterAudioPath(item), button); }
    catch { break; }
    await new Promise(resolve => window.setTimeout(resolve, 130));
  }
  event.currentTarget.classList.remove("is-audio-playing");
});

function findLetterForCharacter(character) {
  const normalized = character.toLocaleLowerCase("de-DE");
  const special = { "ä": "ae", "ö": "oe", "ü": "ue", "ß": "ss" };
  const key = special[normalized] || normalized;
  return alphabetData.find(item => item.key === key) || null;
}

async function spellName() {
  stopAudio();
  elements.spelledName.replaceChildren();
  elements.nameFeedback.textContent = "";
  const name = elements.nameInput.value.trim();
  if (!name) {
    elements.nameFeedback.textContent = "Schreibe zuerst deinen Namen.";
    elements.nameInput.focus();
    return;
  }
  const playable = [];
  [...name].forEach(character => {
    if (!/\p{L}/u.test(character)) return;
    const item = findLetterForCharacter(character);
    const button = document.createElement("button");
    button.type = "button";
    button.className = "spelled-letter";
    button.textContent = character.toLocaleUpperCase("de-DE");
    if (item) {
      button.addEventListener("click", () => playAudio(letterAudioPath(item), button).catch(() => {}));
      playable.push({ item, button });
    } else {
      button.classList.add("no-audio");
      button.setAttribute("aria-label", `${character}, kein Audio verfügbar`);
    }
    elements.spelledName.appendChild(button);
  });
  markSection("name");
  elements.nameFeedback.textContent = playable.length ? "Höre zu und sprich deinen Namen Buchstabe für Buchstabe." : "Für diese Buchstaben ist noch kein Audio verfügbar.";
  audioSequenceCancelled = false;
  for (const entry of playable) {
    if (audioSequenceCancelled) break;
    try { await playAudio(letterAudioPath(entry.item), entry.button); }
    catch { break; }
    await new Promise(resolve => window.setTimeout(resolve, 170));
  }
}

document.getElementById("spell-button").addEventListener("click", spellName);
elements.nameInput.addEventListener("keydown", event => { if (event.key === "Enter") spellName(); });

function shuffled(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function startQuiz() {
  stopAudio();
  quizQuestions = shuffled(alphabetData).slice(0, 5);
  quizIndex = 0;
  quizScore = 0;
  quizAnswered = false;
  elements.resultCard.hidden = true;
  document.querySelector(".quiz-card").hidden = false;
  elements.quizStart.hidden = true;
  elements.quizNext.hidden = true;
  elements.quizListen.hidden = false;
  renderQuestion();
  markSection("quiz");
}

function renderQuestion() {
  const correct = quizQuestions[quizIndex];
  quizAnswered = false;
  elements.quizCounter.textContent = `Frage ${quizIndex + 1} von 5`;
  elements.quizTitle.textContent = "Welchen Buchstaben hörst du?";
  elements.quizFeedback.textContent = "";
  elements.quizFeedback.className = "quiz-feedback";
  elements.quizNext.hidden = true;
  elements.quizOptions.replaceChildren();

  const distractors = shuffled(alphabetData.filter(item => item.key !== correct.key)).slice(0, 2);
  shuffled([correct, ...distractors]).forEach(item => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "quiz-option";
    button.textContent = item.display;
    button.addEventListener("click", () => answerQuiz(item, button));
    elements.quizOptions.appendChild(button);
  });
  window.setTimeout(() => playAudio(letterAudioPath(correct), elements.quizListen).catch(() => {}), 250);
}

function answerQuiz(selected, button) {
  if (quizAnswered) return;
  quizAnswered = true;
  const correct = quizQuestions[quizIndex];
  const isCorrect = selected.key === correct.key;
  if (isCorrect) quizScore += 1;
  document.querySelectorAll(".quiz-option").forEach(option => {
    option.disabled = true;
    if (option.textContent === correct.display) option.classList.add("correct");
  });
  if (!isCorrect) button.classList.add("wrong");
  elements.quizFeedback.textContent = isCorrect ? "Richtig!" : `Das war ${correct.display}.`;
  elements.quizFeedback.classList.add(isCorrect ? "good" : "bad");
  elements.quizNext.textContent = quizIndex === 4 ? "Ergebnis" : "Weiter";
  elements.quizNext.hidden = false;
}

function nextQuizQuestion() {
  if (!quizAnswered) return;
  quizIndex += 1;
  if (quizIndex < 5) renderQuestion();
  else showQuizResult();
}

function showQuizResult() {
  stopAudio();
  document.querySelector(".quiz-card").hidden = true;
  elements.resultCard.hidden = false;
  elements.resultScore.textContent = `${quizScore} / 5`;
  const perfect = quizScore === 5;
  elements.resultTitle.textContent = perfect ? "Super gemacht!" : "Gut geübt!";
  elements.resultMessage.textContent = perfect ? "Du kennst jetzt das deutsche Alphabet!" : "Höre die Buchstaben noch einmal und versuche es wieder.";
  elements.masterBadge.hidden = !perfect;
  state.bestScore = Math.max(state.bestScore, quizScore);
  saveState();
  if (perfect) playAudio(`${AUDIO_ROOT}/instructions/06-super-gemacht.mp3`, elements.resultCard).catch(() => {});
  elements.resultCard.scrollIntoView({ behavior: "smooth", block: "center" });
}

elements.quizStart.addEventListener("click", startQuiz);
elements.quizNext.addEventListener("click", nextQuizQuestion);
elements.quizListen.addEventListener("click", () => playAudio(letterAudioPath(quizQuestions[quizIndex]), elements.quizListen).catch(() => {}));
document.getElementById("quiz-restart").addEventListener("click", startQuiz);

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && entry.intersectionRatio > .35) {
      const step = entry.target.dataset.progressStep;
      if (step && step !== "discover" && step !== "name" && step !== "quiz") markSection(step);
    }
  });
}, { threshold: [.35] });
document.querySelectorAll("[data-progress-step]").forEach(section => observer.observe(section));

renderLetters();
selectLetter(alphabetData[0], null, false);
updateProgress();
