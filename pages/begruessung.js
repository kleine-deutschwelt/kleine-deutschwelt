"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const AUDIO_PATH = "../audio/begruessung/";
  const audio = document.getElementById("lessonAudio");
  const soundToggle = document.getElementById("soundToggle");
  const toast = document.getElementById("toast");
  const completedSteps = new Set(JSON.parse(localStorage.getItem("begruessungSteps") || "[]"));
  let activeAudioButton = null;
  let muted = false;
  let currentStage = 0;
  const totalStages = 8;
  const stageNames = ["Start", "Hören", "Zuordnen", "Hallo & Tschüss", "Hören & Wählen", "Dialoge", "Lied", "Quiz", "Abschluss"];

  const showStage = (stage) => {
    currentStage = Math.max(0, Math.min(totalStages, stage));
    document.querySelectorAll(".lesson-stage").forEach((panel) => {
      const active = Number(panel.dataset.stage) === currentStage;
      panel.classList.toggle("active", active);
      panel.setAttribute("aria-hidden", String(!active));
    });
    document.querySelectorAll(".stage-dots i").forEach((dot, index) => {
      dot.classList.toggle("current", index === currentStage);
      dot.classList.toggle("visited", index < currentStage);
    });
    document.getElementById("stageLabel").textContent = stageNames[currentStage];
    updateProgress();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const showToast = (message) => {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove("show"), 2200);
  };

  const playFile = (file, button = null) => {
    if (muted) {
      showToast("Der Ton ist ausgeschaltet.");
      return;
    }
    if (!file) return;
    if (activeAudioButton) activeAudioButton.classList.remove("playing");
    activeAudioButton = button;
    if (button) button.classList.add("playing");
    audio.src = AUDIO_PATH + file;
    audio.currentTime = 0;
    audio.play().catch(() => {
      if (button) button.classList.remove("playing");
      showToast("Audio konnte nicht geladen werden.");
    });
  };

  audio.addEventListener("ended", () => {
    if (activeAudioButton) activeAudioButton.classList.remove("playing");
    activeAudioButton = null;
  });

  document.addEventListener("click", (event) => {
    const button = event.target.closest(".audio-trigger");
    if (button) playFile(button.dataset.audio, button);
  });

  soundToggle.addEventListener("click", () => {
    muted = !muted;
    audio.muted = muted;
    if (muted) audio.pause();
    soundToggle.textContent = muted ? "🔇" : "🔊";
    soundToggle.setAttribute("aria-pressed", String(muted));
    soundToggle.setAttribute("aria-label", muted ? "Ton einschalten" : "Ton ausschalten");
  });

  const markComplete = (step) => {
    completedSteps.add(String(step));
    localStorage.setItem("begruessungSteps", JSON.stringify([...completedSteps]));
    updateProgress();
  };

  const updateProgress = () => {
    const percent = Math.round((currentStage / totalStages) * 100);
    document.getElementById("progressText").textContent = percent + " %";
    document.getElementById("progressBar").style.width = percent + "%";
    document.querySelectorAll("[data-complete]").forEach((button) => {
      if (completedSteps.has(button.dataset.complete)) {
        button.classList.add("completed");
        button.textContent = "✓ Geschafft!";
      }
    });
  };

  document.querySelectorAll(".stage-next").forEach((button) => {
    button.addEventListener("click", () => showStage(currentStage + 1));
  });
  document.querySelectorAll(".stage-prev").forEach((button) => {
    button.addEventListener("click", () => showStage(currentStage - 1));
  });

  document.querySelectorAll("[data-complete]").forEach((button) => {
    button.addEventListener("click", () => {
      markComplete(button.dataset.complete);
      button.classList.add("completed");
      button.textContent = "✓ Geschafft!";
      playFile("success.mp3", button);
    });
  });

  // Aktivität 2: Zuordnen.
  document.getElementById("checkMatches").addEventListener("click", () => {
    const cards = [...document.querySelectorAll(".match-card")];
    let correct = 0;
    cards.forEach((card) => {
      const select = card.querySelector("select");
      const state = card.querySelector(".answer-state");
      const ok = select.value === card.dataset.answer;
      card.classList.toggle("correct", ok);
      card.classList.toggle("wrong", !ok);
      state.textContent = ok ? "✓ Richtig!" : select.value ? "Noch einmal!" : "Bitte wählen.";
      if (ok) correct++;
    });
    const result = document.getElementById("matchResult");
    result.textContent = correct === 4 ? "Super! Alles ist richtig." : `${correct} von 4 richtig.`;
    result.className = "result-message " + (correct === 4 ? "good" : "bad");
    playFile(correct === 4 ? "correct.mp3" : "try-again.mp3");
    if (correct === 4) markComplete(2);
  });

  // Aktivität 3: Hallo oder Tschüss.
  document.querySelectorAll("#quickChoice button").forEach((button) => {
    button.addEventListener("click", () => {
      const ok = button.dataset.choice === "Hallo!";
      const feedback = document.getElementById("quickFeedback");
      feedback.textContent = ok ? "✓ Richtig! Sie sagen: Hallo!" : "Noch einmal. Sie treffen sich.";
      feedback.style.color = ok ? "#297943" : "#b83e31";
      playFile(ok ? "correct.mp3" : "try-again.mp3");
      if (ok) markComplete(3);
    });
  });

  // Aktivität 4: Hör zu und wähle.
  const listeningItems = [
    { text: "Guten Morgen!", audio: "guten-morgen.mp3" },
    { text: "Guten Tag!", audio: "guten-tag.mp3" },
    { text: "Guten Abend!", audio: "guten-abend.mp3" },
    { text: "Gute Nacht!", audio: "gute-nacht.mp3" }
  ];
  let listeningOrder = [...listeningItems].sort(() => Math.random() - .5);
  let listeningIndex = 0;
  let listeningScore = 0;
  let listeningAnswered = false;

  const renderListening = () => {
    listeningAnswered = false;
    document.getElementById("listeningRound").textContent = `${listeningIndex + 1} / 4`;
    document.getElementById("listeningScore").textContent = `${listeningScore} ⭐`;
    document.getElementById("listeningFeedback").textContent = "";
    document.getElementById("nextListening").classList.add("hidden");
    const options = document.getElementById("listeningOptions");
    options.innerHTML = "";
    [...listeningItems].sort(() => Math.random() - .5).forEach((item) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = item.text;
      button.addEventListener("click", () => answerListening(item.text, button));
      options.appendChild(button);
    });
  };

  const answerListening = (answer, button) => {
    if (listeningAnswered) return;
    listeningAnswered = true;
    const current = listeningOrder[listeningIndex];
    const ok = answer === current.text;
    if (ok) listeningScore++;
    button.classList.add(ok ? "correct" : "wrong");
    document.querySelectorAll("#listeningOptions button").forEach((option) => {
      option.disabled = true;
      if (option.textContent === current.text) option.classList.add("correct");
    });
    const feedback = document.getElementById("listeningFeedback");
    feedback.textContent = ok ? "Richtig! Sehr gut!" : `Das war: ${current.text}`;
    feedback.className = "result-message " + (ok ? "good" : "bad");
    playFile(ok ? "correct.mp3" : "try-again.mp3");
    document.getElementById("listeningScore").textContent = `${listeningScore} ⭐`;
    const next = document.getElementById("nextListening");
    next.textContent = listeningIndex === 3 ? "Ergebnis zeigen" : "Weiter →";
    next.classList.remove("hidden");
  };

  document.getElementById("playListening").addEventListener("click", (event) => playFile(listeningOrder[listeningIndex].audio, event.currentTarget));
  document.getElementById("nextListening").addEventListener("click", () => {
    if (listeningIndex < 3) { listeningIndex++; renderListening(); }
    else {
      document.getElementById("listeningFeedback").textContent = `Geschafft: ${listeningScore} von 4 richtig!`;
      document.getElementById("nextListening").classList.add("hidden");
      markComplete(4);
      playFile("success.mp3");
    }
  });

  // Aktivität 5: Dialoge.
  const dialogs = {
    meeting: { lines: ["Hallo, Mia!", "Hallo, Jonas!"], audio: "dialog-hallo.mp3" },
    bye: { lines: ["Tschüss, Mia!", "Tschüss, Jonas!"], audio: "dialog-tschuess.mp3" },
    formal: { lines: ["Auf Wiedersehen, Kinder!", "Auf Wiedersehen, Felix!"], audio: "dialog-auf-wiedersehen.mp3" }
  };
  document.querySelectorAll(".dialog-tabs button").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".dialog-tabs button").forEach((item) => {
        item.classList.toggle("active", item === tab);
        item.setAttribute("aria-selected", String(item === tab));
      });
      const selected = dialogs[tab.dataset.dialog];
      const lines = document.querySelectorAll("#dialogStage .speaker p");
      lines[0].textContent = selected.lines[0];
      lines[1].textContent = selected.lines[1];
      document.getElementById("dialogAudio").dataset.audio = selected.audio;
    });
  });

  // Mini-Quiz.
  const quizQuestions = [
    { visual: "🌅", question: "Es ist Morgen. Was sagst du?", options: ["Gute Nacht!", "Guten Morgen!", "Guten Abend!"], answer: "Guten Morgen!" },
    { visual: "👋", question: "Du triffst einen Freund. Was sagst du?", options: ["Hallo!", "Tschüss!", "Gute Nacht!"], answer: "Hallo!" },
    { visual: "🌙", question: "Du gehst schlafen. Was sagst du?", options: ["Guten Tag!", "Guten Morgen!", "Gute Nacht!"], answer: "Gute Nacht!" },
    { visual: "🎒", question: "Du gehst nach Hause. Was sagst du zu deinem Freund?", options: ["Tschüss!", "Hallo!", "Guten Morgen!"], answer: "Tschüss!" },
    { visual: "👩‍🏫", question: "Du verabschiedest dich höflich von der Lehrerin.", options: ["Hallo!", "Auf Wiedersehen!", "Gute Nacht!"], answer: "Auf Wiedersehen!" }
  ];
  let quizIndex = 0;
  let quizScore = 0;
  let quizAnswered = false;

  const renderQuiz = () => {
    quizAnswered = false;
    const item = quizQuestions[quizIndex];
    document.getElementById("quizCounter").textContent = `Frage ${quizIndex + 1} von 5`;
    document.getElementById("quizScore").textContent = `${quizScore} Punkte`;
    document.getElementById("quizProgress").style.width = `${(quizIndex + 1) * 20}%`;
    document.getElementById("quizVisual").textContent = item.visual;
    document.getElementById("quizQuestion").textContent = item.question;
    document.getElementById("quizFeedback").textContent = "";
    document.getElementById("nextQuiz").classList.add("hidden");
    const options = document.getElementById("quizOptions");
    options.innerHTML = "";
    item.options.forEach((option) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = option;
      button.addEventListener("click", () => answerQuiz(option, button));
      options.appendChild(button);
    });
  };

  const answerQuiz = (answer, button) => {
    if (quizAnswered) return;
    quizAnswered = true;
    const correctAnswer = quizQuestions[quizIndex].answer;
    const ok = answer === correctAnswer;
    if (ok) quizScore++;
    button.classList.add(ok ? "correct" : "wrong");
    document.querySelectorAll("#quizOptions button").forEach((option) => {
      option.disabled = true;
      if (option.textContent === correctAnswer) option.classList.add("correct");
    });
    const feedback = document.getElementById("quizFeedback");
    feedback.textContent = ok ? "Richtig! Super!" : `Richtig ist: ${correctAnswer}`;
    feedback.className = "result-message " + (ok ? "good" : "bad");
    playFile(ok ? "correct.mp3" : "try-again.mp3");
    document.getElementById("quizScore").textContent = `${quizScore} Punkte`;
    const next = document.getElementById("nextQuiz");
    next.textContent = quizIndex === 4 ? "Ergebnis" : "Nächste Frage →";
    next.classList.remove("hidden");
  };

  const finishQuiz = () => {
    document.getElementById("quizBox").classList.add("hidden");
    document.getElementById("quizFinish").classList.remove("hidden");
    document.getElementById("finishTitle").textContent = quizScore === 5 ? "Perfekt!" : quizScore >= 3 ? "Sehr gut!" : "Gut versucht!";
    document.getElementById("finishText").textContent = quizScore === 5 ? "Du bist ein Begrüßungs-Profi!" : "Übe noch einmal und sammle alle Sterne.";
    document.getElementById("finishScore").textContent = `${quizScore} / 5 ${"⭐".repeat(quizScore)}`;
    if (quizScore === 5) {
      markComplete(7);
      localStorage.setItem("begruessungBestScore", "5");
      playFile("success.mp3");
    }
  };

  document.getElementById("nextQuiz").addEventListener("click", () => {
    if (quizIndex < 4) { quizIndex++; renderQuiz(); } else finishQuiz();
  });
  document.getElementById("restartQuiz").addEventListener("click", () => {
    quizIndex = 0; quizScore = 0;
    document.getElementById("quizFinish").classList.add("hidden");
    document.getElementById("quizBox").classList.remove("hidden");
    renderQuiz();
  });

  showStage(0);
  renderListening();
  renderQuiz();
});
