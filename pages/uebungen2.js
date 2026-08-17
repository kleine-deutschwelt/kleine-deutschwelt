"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const hero = document.querySelector("#hero");
  const lessonArea = document.querySelector("#lessonArea");
  const stages = [...document.querySelectorAll(".stage")];
  const prevButton = document.querySelector("#prevStage");
  const nextButton = document.querySelector("#nextStage");
  const progressFill = document.querySelector("#progressFill");
  const progressLabel = document.querySelector("#progressLabel");
  const progressPercent = document.querySelector("#progressPercent");
  const correctAudio = document.querySelector("#correctAudio");
  const wrongAudio = document.querySelector("#wrongAudio");
  let currentStage = 0;
  let soundOn = true;
  let selectedBlank = null;
  let listenPlays = 0;
  let quizScore = 0;

  const normalize = value => value.trim().toLocaleLowerCase("de-DE").replace(/[.!?]/g, "").replace(/\s+/g, " ");
  const current = () => stages[currentStage];

  function speak(text) {
    if (!soundOn || !window.speechSynthesis) return;
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "de-DE";
    utterance.rate = 0.86;
    const voices = speechSynthesis.getVoices();
    utterance.voice = voices.find(v => /^de(-|_)/i.test(v.lang)) || null;
    speechSynthesis.speak(utterance);
  }

  function playFeedback(correct) {
    if (!soundOn) return;
    const audio = correct ? correctAudio : wrongAudio;
    [correctAudio, wrongAudio].forEach(item => { item.pause(); item.currentTime = 0; });
    audio.play().catch(() => speak(correct ? "Richtig!" : "Versuch es noch einmal!"));
  }

  function feedback(stage, correct, message) {
    const box = stage.querySelector(".feedback");
    if (box) { box.textContent = message; box.className = `feedback ${correct ? "success" : "error"}`; }
    playFeedback(correct);
    if (correct) completeStage(stage);
  }

  function completeStage(stage) {
    stage.dataset.complete = "true";
    nextButton.disabled = false;
    saveProgress();
  }

  function showStage(index) {
    currentStage = Math.max(0, Math.min(index, stages.length - 1));
    stages.forEach((stage, i) => stage.classList.toggle("active", i === currentStage));
    const isResult = currentStage === stages.length - 1;
    const taskNumber = Math.min(currentStage + 1, 11);
    const percent = isResult ? 100 : Math.round((currentStage / 11) * 100);
    progressFill.style.width = `${percent}%`;
    progressFill.parentElement.setAttribute("aria-valuenow", String(percent));
    progressLabel.textContent = isResult ? "Übung abgeschlossen" : `Aufgabe ${taskNumber} von 11`;
    progressPercent.textContent = `${percent}%`;
    prevButton.disabled = currentStage === 0 || isResult;
    nextButton.hidden = isResult || currentStage === 10;
    nextButton.disabled = current().dataset.complete !== "true";
    document.querySelector(".progress-card").hidden = isResult;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function saveProgress() {
    try { localStorage.setItem("kdw-uebungen2-stage", String(currentStage)); } catch (_) { /* storage may be blocked */ }
  }

  document.querySelector("#startLesson").addEventListener("click", () => {
    hero.classList.add("hidden"); lessonArea.classList.remove("hidden"); showStage(0);
  });
  prevButton.addEventListener("click", () => showStage(currentStage - 1));
  nextButton.addEventListener("click", () => showStage(currentStage + 1));
  document.querySelector("#soundToggle").addEventListener("click", event => {
    soundOn = !soundOn; event.currentTarget.textContent = soundOn ? "Ton an" : "Ton aus";
    event.currentTarget.setAttribute("aria-pressed", String(!soundOn));
    if (!soundOn && window.speechSynthesis) speechSynthesis.cancel();
  });
  document.querySelectorAll(".speak-button").forEach(button => button.addEventListener("click", () => speak(button.dataset.speak)));

  document.querySelectorAll(".blank").forEach(blank => blank.addEventListener("click", () => {
    document.querySelectorAll(".blank").forEach(item => item.classList.remove("active"));
    selectedBlank = blank; blank.classList.add("active");
  }));
  document.querySelectorAll(".word-bank button").forEach(word => word.addEventListener("click", () => {
    if (!selectedBlank) return;
    const old = selectedBlank.dataset.wordButton;
    if (old) document.querySelector(`[data-word-id="${old}"]`)?.classList.remove("used");
    if (!word.dataset.wordId) word.dataset.wordId = `w-${Math.random().toString(36).slice(2)}`;
    selectedBlank.textContent = word.textContent; selectedBlank.dataset.wordButton = word.dataset.wordId;
    word.setAttribute("data-word-id", word.dataset.wordId); word.classList.add("used"); selectedBlank.classList.remove("active"); selectedBlank = null;
  }));

  let selectedOrderItem = null;
  document.querySelectorAll("#dialogOrder button").forEach(item => item.addEventListener("click", () => {
    document.querySelectorAll("#dialogOrder button").forEach(button => button.classList.remove("selected"));
    selectedOrderItem = item; item.classList.add("selected");
  }));
  document.querySelectorAll("[data-move]").forEach(button => button.addEventListener("click", () => {
    if (!selectedOrderItem) return;
    if (button.dataset.move === "up" && selectedOrderItem.previousElementSibling) selectedOrderItem.parentElement.insertBefore(selectedOrderItem, selectedOrderItem.previousElementSibling);
    if (button.dataset.move === "down" && selectedOrderItem.nextElementSibling) selectedOrderItem.parentElement.insertBefore(selectedOrderItem.nextElementSibling, selectedOrderItem);
  }));

  const listeningText = "Hallo! Ich heiße Leonie. Ich bin acht Jahre alt. Meine Lieblingsfarbe ist Rot. Mein Geburtstag ist im Mai.";
  document.querySelector("#listeningPlay").addEventListener("click", event => {
    if (listenPlays >= 2) return;
    listenPlays += 1; document.querySelector("#listenCount").textContent = `${listenPlays}/2`; speak(listeningText);
    if (listenPlays === 2) event.currentTarget.disabled = true;
  });

  const sentenceData = [
    ["Ich heiße Anna", ["heiße", "Anna", "Ich"]], ["Heute ist Freitag", ["Freitag", "Heute", "ist"]],
    ["Mein Geburtstag ist im Juni", ["Juni", "Geburtstag", "im", "Mein", "ist"]],
    ["Meine Lieblingsfarbe ist Grün", ["Grün", "ist", "Meine", "Lieblingsfarbe"]],
    ["Im Winter ist es kalt", ["kalt", "Winter", "Im", "es", "ist"]],
    ["Ich bin zehn Jahre alt", ["Jahre", "alt", "zehn", "Ich", "bin"]]
  ];
  function renderSentences() {
    const host = document.querySelector("#sentenceBuilders"); host.innerHTML = "";
    sentenceData.forEach(([answer, words], index) => {
      const box = document.createElement("div"); box.className = "sentence-builder"; box.dataset.answer = answer;
      box.innerHTML = `<div class="answer-line" aria-label="Satz ${index + 1}"></div><div class="tokens"></div>`;
      words.forEach(word => { const button = document.createElement("button"); button.type = "button"; button.textContent = word; button.addEventListener("click", () => { box.querySelector(".answer-line").textContent += `${box.querySelector(".answer-line").textContent ? " " : ""}${word}`; button.classList.add("used"); }); box.querySelector(".tokens").append(button); });
      host.append(box);
    });
  }
  renderSentences();
  document.querySelector("#resetSentences").addEventListener("click", renderSentences);

  document.querySelectorAll(".scene-options button").forEach(button => button.addEventListener("click", () => {
    button.parentElement.querySelectorAll("button").forEach(item => item.classList.remove("selected")); button.classList.add("selected");
  }));

  const selects = [...document.querySelectorAll("#dialogBuilder select")];
  function updateDialogPreview() { document.querySelector("#dialogPreview").textContent = selects.map(select => select.value).filter(Boolean).join("\n") || "Dein Dialog erscheint hier."; }
  selects.forEach(select => select.addEventListener("change", updateDialogPreview));
  document.querySelector("#playBuiltDialog").addEventListener("click", () => speak(selects.map(select => select.value).filter(Boolean).join(" ")));

  function checkRadioGroup(stage) {
    const sets = [...stage.querySelectorAll("fieldset[data-correct]")];
    return sets.length > 0 && sets.every(set => set.querySelector("input:checked")?.value === set.dataset.correct);
  }

  document.querySelectorAll("[data-check]").forEach(button => button.addEventListener("click", () => {
    const stage = button.closest(".stage"); let ok = false;
    switch (button.dataset.check) {
      case "fill": ok = [...stage.querySelectorAll(".blank")].every(blank => blank.textContent === blank.dataset.answer); break;
      case "order": { const list = stage.querySelector(".sortable-list"); ok = [...list.children].map(item => item.textContent.trim()).join("|") === list.dataset.answer; break; }
      case "listening": if (listenPlays === 0) return feedback(stage, false, "Hör zuerst den Text an."); ok = checkRadioGroup(stage); break;
      case "radios": ok = checkRadioGroup(stage); break;
      case "inputs": ok = [...stage.querySelectorAll("input[data-answer]")].every(input => input.dataset.answer.split("|").some(answer => normalize(input.value) === normalize(answer))); break;
      case "sentences": ok = [...stage.querySelectorAll(".sentence-builder")].every(box => normalize(box.querySelector(".answer-line").textContent) === normalize(box.dataset.answer)); break;
      case "choice": { const options = stage.querySelector(".scene-options"); ok = options.querySelector(".selected")?.dataset.value === options.dataset.correct; break; }
      case "personal": ok = [...stage.querySelectorAll("input[data-prefix]")].every(input => normalize(input.value).startsWith(input.dataset.prefix) && (!input.dataset.contains || normalize(input.value).includes(input.dataset.contains)) && normalize(input.value).length > input.dataset.prefix.length + 1); break;
      case "dialog-builder": { const good = ["Guten Tag!", "Ich heiße Mia. Wie heißt du?", "Ich bin zehn Jahre alt.", "Meine Lieblingsfarbe ist Blau.", "Tschüss! Bis bald!"]; ok = selects.every((select, i) => select.value === good[i]); break; }
    }
    feedback(stage, ok, ok ? "Richtig! Super gemacht!" : "Noch nicht ganz. Schau genau hin und versuch es noch einmal.");
  }));

  const quizData = [
    { q: "Wie stellst du dich vor?", options: ["Ich heiße Mia.", "Ich bin Montag.", "Ich heiße acht Jahre alt."], answer: 0 },
    { q: "Welche Begrüßung passt am Morgen?", options: ["Gute Nacht!", "Guten Morgen!", "Tschüss!"], answer: 1 },
    { q: "Welches Wort beginnt mit B?", options: ["Apfel", "Ball", "Sonne"], answer: 1 },
    { q: "Welcher Tag kommt nach Freitag?", options: ["Samstag", "Montag", "Donnerstag"], answer: 0 },
    { q: "Welcher Monat kommt nach September?", options: ["August", "November", "Oktober"], answer: 2 },
    { q: "In welcher Jahreszeit ist es oft sehr warm?", options: ["Winter", "Sommer", "Herbst"], answer: 1 },
    { q: "Was ist zwölf plus drei?", options: ["fünfzehn", "dreizehn", "zwanzig"], answer: 0 },
    { q: "Welche Farbe hat die Sonne oft auf Kinderbildern?", options: ["Gelb", "Blau", "Schwarz"], answer: 0 }
  ];
  const quizBox = document.querySelector("#quizBox");
  quizData.forEach((item, index) => {
    const box = document.createElement("div"); box.className = "quiz-question"; box.innerHTML = `<h3>${index + 1}. ${item.q}</h3>`;
    item.options.forEach((option, optionIndex) => { const label = document.createElement("label"); label.innerHTML = `<input type="radio" name="q${index}" value="${optionIndex}"> ${option}`; box.append(label); }); quizBox.append(box);
  });
  document.querySelector("#checkQuiz").addEventListener("click", () => {
    const chosen = quizData.map((_, i) => document.querySelector(`input[name="q${i}"]:checked`));
    if (chosen.some(item => !item)) return feedback(stages[10], false, "Beantworte zuerst alle acht Fragen.");
    quizScore = chosen.reduce((score, input, i) => score + (Number(input.value) === quizData[i].answer ? 1 : 0), 0);
    stages[10].dataset.complete = "true"; playFeedback(quizScore >= 6); showResults();
  });

  function showResults() {
    const messages = quizScore === 8 ? ["Ausgezeichnet! Du bist ein Starter-Profi!", "Du hast alle Aufgaben richtig gelöst."] : quizScore >= 6 ? ["Sehr gut! Fast alles richtig!", "Felix ist stolz auf dich."] : quizScore >= 4 ? ["Gut gemacht!", "Übe noch ein bisschen und versuche es wieder."] : ["Versuch es noch einmal!", "Felix hilft dir beim nächsten Versuch."];
    document.querySelector("#resultTitle").textContent = messages[0]; document.querySelector("#resultText").textContent = messages[1]; document.querySelector("#scoreRing").textContent = `${quizScore}/8`; showStage(11);
  }
  document.querySelector("#restartLesson").addEventListener("click", () => { try { localStorage.removeItem("kdw-uebungen2-stage"); } catch (_) {} location.reload(); });
});
