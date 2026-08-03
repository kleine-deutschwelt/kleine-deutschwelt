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
  { icon: "🍎", de: "Der Apfel ist rot.", ro: "Mărul este roșu." },
  { icon: "🚙", de: "Das Auto ist blau.", ro: "Mașina este albastră." },
  { icon: "☀️", de: "Die Sonne ist gelb.", ro: "Soarele este galben." },
  { icon: "🍃", de: "Das Blatt ist grün.", ro: "Frunza este verde." },
  { icon: "🥕", de: "Die Karotte ist orange.", ro: "Morcovul este portocaliu." },
  { icon: "🎈", de: "Der Luftballon ist lila.", ro: "Balonul este violet." },
  { icon: "🌸", de: "Die Blume ist rosa.", ro: "Floarea este roz." },
  { icon: "🐻", de: "Der Bär ist braun.", ro: "Ursul este maro." },
  { icon: "🐈‍⬛", de: "Die Katze ist schwarz.", ro: "Pisica este neagră." },
  { icon: "🐇", de: "Das Kaninchen ist weiß.", ro: "Iepurele este alb." }
];

const completed = new Set();
const activityState = { sun: false, fill: false, object: false };
let reviewIndex = 0;
let reviewScore = 0;
const reviewQuestions = [colors[0], colors[3], colors[5], colors[8], colors[9]];

document.getElementById("colorGrid").innerHTML = colors.map(color => `
  <article class="color-card">
    <span class="color-swatch" style="background:${color.hex}"></span>
    <button class="sound-button" onclick="speak('${color.de}')" aria-label="Ascultă ${color.de}">🔊</button>
    <span class="color-word">${color.de}</span>
    <span class="translation">${color.ro}</span>
  </article>`).join("");

document.getElementById("examplesGrid").innerHTML = examples.map(item => `
  <article class="example-card">
    <span class="example-emoji">${item.icon}</span>
    <div><p>${item.de}</p><small>${item.ro}</small></div>
    <button class="mini-sound" onclick="speak('${item.de}')" aria-label="Ascultă propoziția">🔊</button>
  </article>`).join("");

function speak(text) {
  if (!("speechSynthesis" in window)) {
    alert("Browserul tău nu permite redarea pronunției.");
    return;
  }
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "de-DE";
  utterance.rate = 0.82;
  speechSynthesis.speak(utterance);
}

function beginLesson() {
  completeSection("intro", "vocabulary");
  speak("Hallo! Heute lernen wir die Farben!");
}

function finishVocabulary() {
  completeSection("vocabulary", "examples");
}

function completeSection(name, nextId) {
  completed.add(name);
  updateProgress();
  const next = document.getElementById(nextId);
  next.classList.remove("locked");
  next.classList.add("unlocked");
  setTimeout(() => next.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
}

function updateProgress() {
  const percentage = Math.round((completed.size / 5) * 100);
  document.getElementById("progressBar").style.width = `${percentage}%`;
  document.getElementById("progressText").textContent = `Lektionsfortschritt: ${percentage}%`;
}

function checkChoice(button, correct) {
  const box = button.closest(".activity-box");
  box.querySelectorAll(".choice-row button").forEach(item => item.classList.remove("correct", "wrong"));
  button.classList.add(correct ? "correct" : "wrong");
  box.querySelector(".feedback").textContent = correct ? "Richtig! Die Sonne ist gelb. ☀️" : "Versuche noch einmal! Mai încearcă.";
  if (correct) { activityState.sun = true; updateActivities(); }
}

function checkSelects() {
  const selects = [...document.querySelectorAll("select[data-answer]")];
  const count = selects.filter(select => {
    const correct = select.value === select.dataset.answer;
    select.style.borderColor = correct ? "#258a45" : "#cc453c";
    return correct;
  }).length;
  const feedback = document.getElementById("fillFeedback");
  feedback.textContent = count === selects.length ? "Sehr gut! Toate propozițiile sunt corecte. ⭐" : `Ai ${count} din ${selects.length} răspunsuri corecte. Mai încearcă!`;
  if (count === selects.length) { activityState.fill = true; updateActivities(); }
}

function checkObject(button, correct) {
  document.querySelectorAll(".object-row button").forEach(item => item.classList.remove("correct", "wrong"));
  button.classList.add(correct ? "correct" : "wrong");
  document.getElementById("objectFeedback").textContent = correct ? "Richtig! Der Apfel ist rot. 🍎" : "Nu este rot. Încearcă alt obiect!";
  if (correct) { activityState.object = true; updateActivities(); }
}

function updateActivities() {
  if (Object.values(activityState).every(Boolean)) document.getElementById("activityDone").disabled = false;
}

function renderReview() {
  const current = reviewQuestions[reviewIndex];
  document.getElementById("reviewSwatch").style.background = current.hex;
  document.getElementById("reviewFeedback").textContent = "";
  document.getElementById("reviewCounter").textContent = `Întrebarea ${reviewIndex + 1} din ${reviewQuestions.length}`;
  const alternatives = [current, ...colors.filter(c => c.de !== current.de).sort(() => Math.random() - .5).slice(0, 2)].sort(() => Math.random() - .5);
  document.getElementById("reviewOptions").innerHTML = alternatives.map(option => `<button onclick="answerReview(this, '${option.de}', '${current.de}')">${option.de}</button>`).join("");
}

function answerReview(button, answer, correct) {
  const options = [...document.querySelectorAll("#reviewOptions button")];
  options.forEach(item => item.disabled = true);
  if (answer === correct) {
    button.classList.add("correct");
    reviewScore++;
    document.getElementById("reviewFeedback").textContent = "Richtig! ⭐";
  } else {
    button.classList.add("wrong");
    options.find(item => item.textContent === correct).classList.add("correct");
    document.getElementById("reviewFeedback").textContent = `Răspunsul corect este „${correct}”.`;
  }
  setTimeout(() => {
    reviewIndex++;
    if (reviewIndex < reviewQuestions.length) renderReview();
    else finishReview();
  }, 1100);
}

function finishReview() {
  completed.add("review");
  updateProgress();
  const finish = document.getElementById("finish");
  finish.classList.remove("locked");
  finish.classList.add("unlocked");
  finish.querySelector(".romanian").textContent = `Ai răspuns corect la ${reviewScore} din 5 întrebări. Bravo!`;
  finish.scrollIntoView({ behavior: "smooth", block: "start" });
  speak("Super gemacht! Du kennst jetzt die Farben!");
}

function restartLesson() {
  window.scrollTo({ top: 0, behavior: "smooth" });
  setTimeout(() => window.location.reload(), 500);
}

const reviewSection = document.getElementById("review");
new MutationObserver(() => {
  if (reviewSection.classList.contains("unlocked") && reviewIndex === 0) renderReview();
}).observe(reviewSection, { attributes: true, attributeFilter: ["class"] });
