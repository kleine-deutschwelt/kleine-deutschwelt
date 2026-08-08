"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const AUDIO_PATH = "../audio/wochentage/";
  const IMAGE_PATH = "../assets/images/lessons/wochentage/";
  const ICON_PATH = "../assets/icons/wochentage/";

  const days = [
    { key:"montag", article:"der", de:"Montag", ro:"luni", icon:"mo-calendar.svg", yesterday:"Sonntag", yesterdayRo:"duminică", tomorrow:"Dienstag", tomorrowRo:"marți" },
    { key:"dienstag", article:"der", de:"Dienstag", ro:"marți", icon:"di-calendar.svg", yesterday:"Montag", yesterdayRo:"luni", tomorrow:"Mittwoch", tomorrowRo:"miercuri" },
    { key:"mittwoch", article:"der", de:"Mittwoch", ro:"miercuri", icon:"mi-calendar.svg", yesterday:"Dienstag", yesterdayRo:"marți", tomorrow:"Donnerstag", tomorrowRo:"joi" },
    { key:"donnerstag", article:"der", de:"Donnerstag", ro:"joi", icon:"do-calendar.svg", yesterday:"Mittwoch", yesterdayRo:"miercuri", tomorrow:"Freitag", tomorrowRo:"vineri" },
    { key:"freitag", article:"der", de:"Freitag", ro:"vineri", icon:"fr-calendar.svg", yesterday:"Donnerstag", yesterdayRo:"joi", tomorrow:"Samstag", tomorrowRo:"sâmbătă" },
    { key:"samstag", article:"der", de:"Samstag", ro:"sâmbătă", icon:"sa-calendar.svg", yesterday:"Freitag", yesterdayRo:"vineri", tomorrow:"Sonntag", tomorrowRo:"duminică" },
    { key:"sonntag", article:"der", de:"Sonntag", ro:"duminică", icon:"so-calendar.svg", yesterday:"Samstag", yesterdayRo:"sâmbătă", tomorrow:"Montag", tomorrowRo:"luni" }
  ];

  const stageNames = ["Start","Kalender","Reihenfolge","Gestern · heute · morgen","Wörterrätsel","Mini-Test","Abschluss"];
  const lessonAudio = document.getElementById("lessonAudio");
  const toast = document.getElementById("toast");
  let activeButton = null;
  let muted = false;
  let currentStage = 0;
  let currentDay = 0;
  let lastFeedback = "";
  const visitedDays = new Set();
  const completedStages = new Set();

  const feedbackFiles = ["richtig-01.mp3","richtig-02.mp3","richtig-03.mp3","richtig-04.mp3","richtig-05.mp3"];
  const retryFiles = ["noch-einmal-01.mp3","noch-einmal-02.mp3","noch-einmal-03.mp3"];

  const pickDifferent = (files) => {
    const choices = files.filter(file => file !== lastFeedback);
    const file = choices[Math.floor(Math.random() * choices.length)];
    lastFeedback = file;
    return file;
  };

  const showToast = (message) => {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove("show"), 2200);
  };

  const playAudio = (file, button = null) => {
    if (!file) return;
    if (muted) {
      showToast("Der Ton ist ausgeschaltet.");
      return;
    }
    lessonAudio.pause();
    lessonAudio.currentTime = 0;
    if (activeButton) activeButton.classList.remove("playing");
    activeButton = button;
    if (button) button.classList.add("playing");
    lessonAudio.src = AUDIO_PATH + file;
    lessonAudio.play().catch(() => {
      if (button) button.classList.remove("playing");
      showToast("Audio konnte nicht geladen werden.");
    });
  };

  lessonAudio.addEventListener("ended", () => {
    if (activeButton) activeButton.classList.remove("playing");
    activeButton = null;
  });

  document.addEventListener("click", event => {
    const button = event.target.closest(".audio-button");
    if (button) playAudio(button.dataset.audio, button);
  });

  document.getElementById("soundToggle").addEventListener("click", event => {
    muted = !muted;
    lessonAudio.muted = muted;
    if (muted) lessonAudio.pause();
    event.currentTarget.textContent = muted ? "Ton an" : "Ton aus";
    event.currentTarget.setAttribute("aria-pressed", String(muted));
  });

  const updateProgress = () => {
    const percentage = Math.round((completedStages.size / 6) * 100);
    document.getElementById("progressBar").style.width = percentage + "%";
    document.getElementById("progressText").textContent = percentage + " %";
    localStorage.setItem("wochentageProgress", JSON.stringify([...completedStages]));
  };

  const completeStage = stage => {
    completedStages.add(String(stage));
    updateProgress();
  };

  const showStage = stage => {
    currentStage = Math.max(0, Math.min(6, stage));
    document.querySelectorAll(".lesson-stage").forEach(panel => {
      const active = Number(panel.dataset.stage) === currentStage;
      panel.classList.toggle("active", active);
      panel.setAttribute("aria-hidden", String(!active));
    });
    document.querySelectorAll(".stage-dots i").forEach((dot,index) => {
      dot.classList.toggle("current", index === currentStage);
      dot.classList.toggle("visited", index < currentStage);
    });
    document.getElementById("stageLabel").textContent = stageNames[currentStage];
    window.scrollTo({ top:0, behavior:"smooth" });
  };

  const tracker = document.querySelector(".stage-dots");
  tracker.innerHTML = stageNames.map(() => "<i></i>").join("");

  document.addEventListener("click", event => {
    if (event.target.closest(".stage-prev")) showStage(currentStage - 1);
    const next = event.target.closest(".stage-next");
    if (next && !next.disabled) {
      completeStage(currentStage);
      showStage(currentStage + 1);
    }
  });

  const dayGrid = document.getElementById("dayGrid");
  dayGrid.innerHTML = days.map((day,index) => `
    <button class="day-button" type="button" data-day="${index}" aria-label="${day.de}">
      <img src="${ICON_PATH + day.icon}" alt="">
    </button>
  `).join("");

  const renderDay = index => {
    currentDay = (index + days.length) % days.length;
    const day = days[currentDay];
    visitedDays.add(day.key);
    document.getElementById("dayImage").src = IMAGE_PATH + day.key + ".webp";
    document.getElementById("dayImage").alt = "Illustration für " + day.de;
    document.getElementById("dayCounter").textContent = (currentDay + 1) + " / 7";
    document.getElementById("dayGerman").textContent = day.article + " " + day.de;
    document.getElementById("dayRomanian").textContent = day.ro;
    document.getElementById("wordAudio").dataset.audio = day.key + ".mp3";
    document.getElementById("sentenceAudio").dataset.audio = day.key + "-saetze.mp3";
    document.getElementById("sentenceNow").textContent = "Heute ist " + day.de + ".";
    document.getElementById("sentenceNowRo").textContent = "Astăzi este " + day.ro + ".";
    document.getElementById("sentenceYesterday").textContent = "Gestern war " + day.yesterday + ".";
    document.getElementById("sentenceYesterdayRo").textContent = "Ieri a fost " + day.yesterdayRo + ".";
    document.getElementById("sentenceTomorrow").textContent = "Morgen ist " + day.tomorrow + ".";
    document.getElementById("sentenceTomorrowRo").textContent = "Mâine este " + day.tomorrowRo + ".";
    document.querySelectorAll(".day-button").forEach((button,buttonIndex) => {
      button.classList.toggle("active", buttonIndex === currentDay);
      button.classList.toggle("seen", visitedDays.has(days[buttonIndex].key));
    });
    const status = document.getElementById("calendarStatus");
    status.textContent = visitedDays.size + " von 7 Tagen entdeckt";
    if (visitedDays.size === 7) {
      status.textContent = "Alle sieben Tage entdeckt. Sehr gut!";
      status.classList.add("success");
      document.getElementById("calendarDone").disabled = false;
    }
  };

  dayGrid.addEventListener("click", event => {
    const button = event.target.closest(".day-button");
    if (button) renderDay(Number(button.dataset.day));
  });
  document.getElementById("dayPrev").addEventListener("click", () => renderDay(currentDay - 1));
  document.getElementById("dayNext").addEventListener("click", () => renderDay(currentDay + 1));
  renderDay(0);

  const correctOrder = days.map(day => day.de);
  let orderIndex = 0;
  const shuffled = [...correctOrder].sort(() => Math.random() - .5);
  const orderPool = document.getElementById("orderPool");
  const orderAnswer = document.getElementById("orderAnswer");

  const buildOrder = () => {
    orderIndex = 0;
    orderAnswer.innerHTML = "";
    document.getElementById("orderDone").disabled = true;
    document.getElementById("orderFeedback").textContent = "";
    orderPool.innerHTML = shuffled.map(day => `<button class="word-chip" type="button" data-word="${day}">${day}</button>`).join("");
  };

  orderPool.addEventListener("click", event => {
    const button = event.target.closest(".word-chip");
    if (!button || button.disabled) return;
    if (button.dataset.word === correctOrder[orderIndex]) {
      button.disabled = true;
      orderAnswer.insertAdjacentHTML("beforeend", `<span class="answer-chip">${button.dataset.word}</span>`);
      orderIndex += 1;
      playAudio(pickDifferent(feedbackFiles));
      if (orderIndex === correctOrder.length) {
        document.getElementById("orderFeedback").textContent = "Die Woche ist richtig geordnet.";
        document.getElementById("orderFeedback").className = "status-message success";
        document.getElementById("orderDone").disabled = false;
      }
    } else {
      document.getElementById("orderFeedback").textContent = "Noch nicht. Suche den nächsten Tag.";
      document.getElementById("orderFeedback").className = "status-message error";
      playAudio(pickDifferent(retryFiles));
    }
  });
  document.getElementById("orderReset").addEventListener("click", buildOrder);
  buildOrder();

  const timeQuestions = [
    { prompt:"Heute ist Montag. Morgen ist ...", answer:"Dienstag", options:["Sonntag","Dienstag","Mittwoch"] },
    { prompt:"Heute ist Donnerstag. Gestern war ...", answer:"Mittwoch", options:["Mittwoch","Freitag","Dienstag"] },
    { prompt:"Heute ist Samstag. Morgen ist ...", answer:"Sonntag", options:["Freitag","Montag","Sonntag"] },
    { prompt:"Heute ist Dienstag. Gestern war ...", answer:"Montag", options:["Mittwoch","Montag","Sonntag"] },
    { prompt:"Heute ist Sonntag. Morgen ist ...", answer:"Montag", options:["Samstag","Montag","Dienstag"] }
  ];
  let timeIndex = 0;

  const renderTimeQuestion = () => {
    const question = timeQuestions[timeIndex];
    document.getElementById("timeCounter").textContent = (timeIndex + 1) + " / " + timeQuestions.length;
    document.getElementById("timePrompt").textContent = question.prompt;
    document.getElementById("timeOptions").innerHTML = question.options.map(option => `<button class="choice-button" type="button" data-option="${option}">${option}</button>`).join("");
    document.getElementById("timeFeedback").textContent = "";
  };

  document.getElementById("timeOptions").addEventListener("click", event => {
    const button = event.target.closest(".choice-button");
    if (!button) return;
    const question = timeQuestions[timeIndex];
    if (button.dataset.option === question.answer) {
      button.classList.add("correct");
      playAudio(pickDifferent(feedbackFiles));
      setTimeout(() => {
        timeIndex += 1;
        if (timeIndex < timeQuestions.length) renderTimeQuestion();
        else {
          document.getElementById("timePrompt").textContent = "Alle Antworten sind richtig.";
          document.getElementById("timeOptions").innerHTML = "";
          document.getElementById("timeCounter").textContent = "5 / 5";
          document.getElementById("timeFeedback").textContent = "Du kennst gestern, heute und morgen.";
          document.getElementById("timeFeedback").className = "status-message success";
          document.getElementById("timeDone").disabled = false;
        }
      }, 650);
    } else {
      button.classList.add("wrong");
      document.getElementById("timeFeedback").textContent = "Versuche es noch einmal.";
      document.getElementById("timeFeedback").className = "status-message error";
      playAudio(pickDifferent(retryFiles));
    }
  });
  renderTimeQuestion();

  const rebusWords = [
    ["Montag","luni"],["Dienstag","marți"],["Mittwoch","miercuri"],["Donnerstag","joi"],["Freitag","vineri"],
    ["Samstag","sâmbătă"],["Sonntag","duminică"],["gestern","ieri"],["heute","astăzi"],["morgen","mâine"]
  ];
  const roOptions = rebusWords.map(item => item[1]);
  const rebusRows = document.getElementById("rebusRows");
  rebusRows.innerHTML = rebusWords.map(([de,ro],index) => `
    <label class="rebus-row" data-answer="${ro}">
      <span class="rebus-word">${de}</span>
      <select aria-label="Traducere pentru ${de}" data-index="${index}">
        <option value="">Alege traducerea</option>
        ${roOptions.map(option => `<option value="${option}">${option}</option>`).join("")}
      </select>
    </label>
  `).join("");

  rebusRows.addEventListener("change", () => {
    let correct = 0;
    document.querySelectorAll(".rebus-row").forEach(row => {
      const good = row.querySelector("select").value === row.dataset.answer;
      row.classList.toggle("correct", good);
      if (good) correct += 1;
    });
    document.getElementById("rebusFeedback").textContent = correct + " / 10 richtig";
    if (correct === 10) {
      document.querySelector(".rebus-board").classList.add("complete");
      document.getElementById("rebusFeedback").textContent = "Das Lösungswort ist WOCHENTAGE.";
      document.getElementById("rebusFeedback").className = "status-message success";
      document.getElementById("rebusDone").disabled = false;
      playAudio(pickDifferent(feedbackFiles));
    }
  });

  const testQuestions = [
    { prompt:"Care este prima zi din această lecție?", answer:"Montag", options:["Montag","Mittwoch","Sonntag"] },
    { prompt:"Ce înseamnă Dienstag?", answer:"marți", options:["luni","marți","joi"] },
    { prompt:"Heute ist Mittwoch. Morgen ist ...", answer:"Donnerstag", options:["Dienstag","Donnerstag","Freitag"] },
    { prompt:"Gestern war Freitag. Heute ist ...", answer:"Samstag", options:["Samstag","Sonntag","Donnerstag"] },
    { prompt:"Ce înseamnă gestern?", answer:"ieri", options:["astăzi","mâine","ieri"] },
    { prompt:"Care zi urmează după Sonntag?", answer:"Montag", options:["Freitag","Montag","Samstag"] },
    { prompt:"Ce înseamnă morgen?", answer:"mâine", options:["ieri","mâine","astăzi"] }
  ];
  let testIndex = 0;
  let testScore = 0;

  const renderTest = () => {
    const question = testQuestions[testIndex];
    document.getElementById("testCounter").textContent = (testIndex + 1) + " / " + testQuestions.length;
    document.getElementById("testPrompt").textContent = question.prompt;
    document.getElementById("testOptions").innerHTML = question.options.map(option => `<button class="choice-button" type="button" data-option="${option}">${option}</button>`).join("");
    document.getElementById("testFeedback").textContent = "";
  };

  document.getElementById("testOptions").addEventListener("click", event => {
    const button = event.target.closest(".choice-button");
    if (!button || button.parentElement.dataset.answered) return;
    const question = testQuestions[testIndex];
    button.parentElement.dataset.answered = "true";
    const correct = button.dataset.option === question.answer;
    button.classList.add(correct ? "correct" : "wrong");
    if (correct) testScore += 1;
    [...button.parentElement.children].forEach(option => {
      if (option.dataset.option === question.answer) option.classList.add("correct");
      option.disabled = true;
    });
    document.getElementById("testFeedback").textContent = correct ? "Richtig." : "Richtig ist: " + question.answer + ".";
    playAudio(pickDifferent(correct ? feedbackFiles : retryFiles));
    setTimeout(() => {
      delete button.parentElement.dataset.answered;
      testIndex += 1;
      if (testIndex < testQuestions.length) renderTest();
      else {
        completeStage(5);
        document.getElementById("finalScore").textContent = "Ergebnis: " + testScore + " / " + testQuestions.length;
        showStage(6);
      }
    }, 950);
  });
  renderTest();

  document.getElementById("restartLesson").addEventListener("click", () => {
    localStorage.removeItem("wochentageProgress");
    window.location.reload();
  });

  updateProgress();
  showStage(0);
});
