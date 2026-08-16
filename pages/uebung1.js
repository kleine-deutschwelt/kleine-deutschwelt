"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const TOTAL_STEPS = 8;

  const weekdays = [
    "Montag",
    "Dienstag",
    "Mittwoch",
    "Donnerstag",
    "Freitag",
    "Samstag",
    "Sonntag"
  ];

  const feedbackFiles = {
    correct: "../audio/uebungen1/richtig-01.mp3",
    wrong: "../audio/uebungen1/versuche-noch-einmal.mp3"
  };

  const state = {
    currentStep: 1,
    completedSteps: new Set(),
    weekdaySelection: [],
    soundEnabled: true,
    activeAudio: null,
    activeAudioButton: null
  };

  const startButton = document.getElementById("start-lesson");
  const restartButton = document.getElementById("restart-lesson");
  const lessonArea = document.getElementById("lesson-area");
  const progressPanel = document.getElementById("progress-panel");
  const finalCard = document.getElementById("final-card");
  const progressText = document.getElementById("progress-text");
  const progressFill = document.getElementById("progress-fill");
  const progressBar = document.querySelector(".progress-track");
  const starCount = document.getElementById("star-count");
  const finalScoreValue = document.getElementById("final-score-value");
  const finalMessage = document.getElementById("final-message");
  const stepDots = document.getElementById("step-dots");
  const soundToggle = document.getElementById("sound-toggle");
  const soundToggleText = document.getElementById("sound-toggle-text");
  const weekdayBank = document.getElementById("weekday-bank");
  const weekdayAnswer = document.getElementById("weekday-answer");
  const resetWeekdaysButton =
    document.getElementById("reset-weekdays");

  createStepDots();
  prepareWeekdays();
  connectEvents();
  updateProgress();

  function connectEvents() {
    startButton.addEventListener("click", startLesson);
    restartButton.addEventListener("click", restartLesson);
    soundToggle.addEventListener("click", toggleSound);
    resetWeekdaysButton.addEventListener(
      "click",
      prepareWeekdays
    );

    document
      .querySelectorAll("[data-check-step]")
      .forEach((button) => {
        button.addEventListener("click", () => {
          const step = Number(button.dataset.checkStep);
          checkStep(step);
        });
      });

    document
      .querySelectorAll("[data-audio]")
      .forEach((button) => {
        button.addEventListener("click", () => {
          playAudioFile(button.dataset.audio, button);
        });
      });

    document
      .querySelectorAll("input[type='text']")
      .forEach((input) => {
        input.addEventListener("input", () => {
          clearControlState(input);

          if (input.maxLength === 1) {
            input.value = input.value.replace(
              /[^a-zA-ZÄÖÜäöüß]/g,
              ""
            );
          }
        });

        input.addEventListener("keydown", (event) => {
          if (event.key === "Enter") {
            const card = input.closest(".exercise-card");
            const step = Number(card.dataset.step);

            checkStep(step);
          }
        });
      });

    document.querySelectorAll("select").forEach((select) => {
      select.addEventListener("change", () => {
        clearControlState(select);
      });
    });

    document
      .querySelectorAll("input[type='radio']")
      .forEach((radio) => {
        radio.addEventListener("change", () => {
          const block = radio.closest(".question-block");

          block
            .querySelectorAll(".choice-card span")
            .forEach((label) => {
              label.classList.remove(
                "is-correct-control",
                "is-wrong-control"
              );
            });
        });
      });
  }

  function startLesson() {
    stopAudio();

    lessonArea.hidden = false;
    progressPanel.hidden = false;
    finalCard.hidden = true;

    showStep(1);

    window.setTimeout(() => {
      progressPanel.scrollIntoView({
        behavior: prefersReducedMotion() ? "auto" : "smooth",
        block: "start"
      });
    }, 100);
  }

  function restartLesson() {
    stopAudio();

    state.currentStep = 1;
    state.completedSteps.clear();
    state.weekdaySelection = [];

    document
      .querySelectorAll(".exercise-card")
      .forEach((card, index) => {
        card.hidden = index !== 0;
        card.classList.toggle("is-active", index === 0);
      });

    document
      .querySelectorAll("input[type='radio']")
      .forEach((input) => {
        input.checked = false;
        input.disabled = false;
      });

    document
      .querySelectorAll("input[type='text']")
      .forEach((input) => {
        input.value = "";
        input.disabled = false;
        clearControlState(input);
      });

    document.querySelectorAll("select").forEach((select) => {
      select.selectedIndex = 0;
      select.disabled = false;
      clearControlState(select);
    });

    document
      .querySelectorAll(".choice-card span")
      .forEach((label) => {
        label.classList.remove(
          "is-correct-control",
          "is-wrong-control"
        );
      });

    document
      .querySelectorAll("[data-check-step]")
      .forEach((button) => {
        button.disabled = false;
        button.textContent = "Antworten prüfen";
      });

    document
      .querySelectorAll(".feedback")
      .forEach((feedback) => {
        feedback.textContent = "";
        feedback.className = "feedback";
      });

    resetWeekdaysButton.disabled = false;

    prepareWeekdays();
    updateProgress();

    finalCard.hidden = true;
    lessonArea.hidden = false;
    progressPanel.hidden = false;

    progressPanel.scrollIntoView({
      behavior: prefersReducedMotion() ? "auto" : "smooth",
      block: "start"
    });
  }

  function checkStep(step) {
    if (state.completedSteps.has(step)) {
      return;
    }

    let result = {
      complete: false,
      correct: false
    };

    switch (step) {
      case 1:
        result = checkRadioExercise(step);
        break;

      case 2:
      case 6:
      case 8:
        result = checkSelectExercise(step);
        break;

      case 3:
      case 5:
      case 7:
        result = checkTextExercise(step);
        break;

      case 4:
        result = checkWeekdayExercise();
        break;

      default:
        return;
    }

    if (!result.complete) {
      showFeedback(
        step,
        "Bitte löse zuerst alle Aufgaben.",
        false
      );

      playFeedbackAudio("wrong");
      return;
    }

    if (!result.correct) {
      showFeedback(
        step,
        "Noch nicht ganz richtig. Schau noch einmal genau hin und versuche es erneut.",
        false
      );

      playFeedbackAudio("wrong");
      return;
    }

    completeStep(step);
  }

  function checkRadioExercise(step) {
    const card = getStepCard(step);

    const questionBlocks = [
      ...card.querySelectorAll(".question-block")
    ];

    const expectedAnswers = {
      "intro-name": "Mia",
      "intro-age": "9"
    };

    let complete = true;
    let correct = true;

    questionBlocks.forEach((block) => {
      const selected = block.querySelector(
        "input[type='radio']:checked"
      );

      const expected =
        expectedAnswers[block.dataset.question];

      block
        .querySelectorAll(".choice-card span")
        .forEach((label) => {
          label.classList.remove(
            "is-correct-control",
            "is-wrong-control"
          );
        });

      if (!selected) {
        complete = false;
        correct = false;
        return;
      }

      const selectedLabel = selected.nextElementSibling;

      if (selected.value === expected) {
        selectedLabel.classList.add(
          "is-correct-control"
        );
      } else {
        selectedLabel.classList.add(
          "is-wrong-control"
        );

        correct = false;
      }
    });

    return {
      complete,
      correct
    };
  }

  function checkSelectExercise(step) {
    const card = getStepCard(step);

    const selects = [
      ...card.querySelectorAll("select[data-answer]")
    ];

    let complete = true;
    let correct = true;

    selects.forEach((select) => {
      clearControlState(select);

      if (!select.value) {
        complete = false;
        correct = false;
        return;
      }

      if (
        matchesAnswer(
          select.value,
          select.dataset.answer
        )
      ) {
        select.classList.add("is-correct-control");
      } else {
        select.classList.add("is-wrong-control");
        correct = false;
      }
    });

    return {
      complete,
      correct
    };
  }

  function checkTextExercise(step) {
    const card = getStepCard(step);

    const inputs = [
      ...card.querySelectorAll("input[data-answer]")
    ];

    let complete = true;
    let correct = true;

    inputs.forEach((input) => {
      clearControlState(input);

      if (!input.value.trim()) {
        complete = false;
        correct = false;
        return;
      }

      if (
        matchesAnswer(
          input.value,
          input.dataset.answer
        )
      ) {
        input.classList.add("is-correct-control");
      } else {
        input.classList.add("is-wrong-control");
        correct = false;
      }
    });

    return {
      complete,
      correct
    };
  }

  function checkWeekdayExercise() {
    const complete =
      state.weekdaySelection.length === weekdays.length;

    const correct =
      complete &&
      state.weekdaySelection.every(
        (day, index) => day === weekdays[index]
      );

    weekdayAnswer
      .querySelectorAll("li")
      .forEach((item, index) => {
        item.classList.remove(
          "is-correct-control",
          "is-wrong-control"
        );

        if (!complete) {
          return;
        }

        if (
          state.weekdaySelection[index] ===
          weekdays[index]
        ) {
          item.classList.add("is-correct-control");
        } else {
          item.classList.add("is-wrong-control");
        }
      });

    return {
      complete,
      correct
    };
  }

  function completeStep(step) {
    state.completedSteps.add(step);

    const card = getStepCard(step);

    const checkButton = card.querySelector(
      "[data-check-step]"
    );

    checkButton.disabled = true;
    checkButton.textContent = "Richtig gelöst";

    disableCompletedControls(card);

    showFeedback(
      step,
      "Richtig! Du bekommst einen goldenen Stern.",
      true
    );

    playFeedbackAudio("correct");
    updateProgress();

    /*
     * Trecerea la următorul exercițiu are loc
     * după ce feedbackul audio a început.
     */
    window.setTimeout(() => {
      if (step < TOTAL_STEPS) {
        showStep(step + 1);
      } else {
        showFinalResult();
      }
    }, 1500);
  }

  function showStep(step) {
    stopAudio();

    state.currentStep = step;

    document
      .querySelectorAll(".exercise-card")
      .forEach((card) => {
        const isCurrent =
          Number(card.dataset.step) === step;

        card.hidden = !isCurrent;
        card.classList.toggle(
          "is-active",
          isCurrent
        );
      });

    updateProgress();

    const activeCard = getStepCard(step);

    window.setTimeout(() => {
      activeCard.scrollIntoView({
        behavior: prefersReducedMotion()
          ? "auto"
          : "smooth",
        block: "start"
      });

      const heading = activeCard.querySelector("h2");

      if (heading) {
        heading.setAttribute("tabindex", "-1");
        heading.focus({
          preventScroll: true
        });
      }
    }, 80);
  }

  function showFinalResult() {
    stopAudio();

    lessonArea.hidden = true;
    finalCard.hidden = false;

    const score = state.completedSteps.size;

    finalScoreValue.textContent =
      `${score} / ${TOTAL_STEPS}`;

    if (score === TOTAL_STEPS) {
      finalMessage.textContent =
        "Du hast alle acht Starter-Themen erfolgreich wiederholt. Felix ist stolz auf dich!";
    } else {
      finalMessage.textContent =
        "Du hast die Übung beendet. Wiederhole die Aufgaben, um alle Sterne zu sammeln.";
    }

    finalCard.scrollIntoView({
      behavior: prefersReducedMotion()
        ? "auto"
        : "smooth",
      block: "center"
    });
  }

  function updateProgress() {
    const completed = state.completedSteps.size;

    const percentage =
      (completed / TOTAL_STEPS) * 100;

    progressText.textContent =
      completed === TOTAL_STEPS
        ? "Alle Aufgaben gelöst"
        : `Aufgabe ${state.currentStep} von ${TOTAL_STEPS}`;

    starCount.textContent = completed;
    progressFill.style.width = `${percentage}%`;

    progressBar.setAttribute(
      "aria-valuenow",
      String(completed)
    );

    [...stepDots.children].forEach(
      (dot, index) => {
        const stepNumber = index + 1;

        dot.classList.toggle(
          "is-complete",
          state.completedSteps.has(stepNumber)
        );

        dot.classList.toggle(
          "is-current",
          stepNumber === state.currentStep &&
            !state.completedSteps.has(stepNumber)
        );
      }
    );
  }

  function createStepDots() {
    stepDots.innerHTML = "";

    for (
      let step = 1;
      step <= TOTAL_STEPS;
      step += 1
    ) {
      const dot = document.createElement("span");

      dot.className = "step-dot";

      dot.setAttribute(
        "aria-label",
        `Aufgabe ${step}`
      );

      stepDots.appendChild(dot);
    }
  }

  function prepareWeekdays() {
    state.weekdaySelection = [];

    weekdayBank.innerHTML = "";
    weekdayAnswer.innerHTML = "";

    const shuffledDays = shuffleArray([
      ...weekdays
    ]);

    shuffledDays.forEach((day) => {
      const button =
        document.createElement("button");

      button.type = "button";
      button.className = "word-chip";
      button.textContent = day;
      button.dataset.day = day;

      button.addEventListener("click", () => {
        selectWeekday(day, button);
      });

      weekdayBank.appendChild(button);
    });

    const feedback =
      document.getElementById("feedback-4");

    if (feedback) {
      feedback.textContent = "";
      feedback.className = "feedback";
    }
  }

  function selectWeekday(day, button) {
    if (state.completedSteps.has(4)) {
      return;
    }

    state.weekdaySelection.push(day);

    button.disabled = true;
    button.hidden = true;

    const listItem =
      document.createElement("li");

    listItem.textContent = day;
    listItem.dataset.day = day;
    listItem.title =
      "Klicken, um den Tag zurückzulegen";
    listItem.tabIndex = 0;

    listItem.setAttribute(
      "role",
      "button"
    );

    listItem.addEventListener("click", () => {
      removeWeekday(day, listItem);
    });

    listItem.addEventListener(
      "keydown",
      (event) => {
        if (
          event.key === "Enter" ||
          event.key === " "
        ) {
          event.preventDefault();
          removeWeekday(day, listItem);
        }
      }
    );

    weekdayAnswer.appendChild(listItem);
  }

  function removeWeekday(day, listItem) {
    if (state.completedSteps.has(4)) {
      return;
    }

    const index =
      state.weekdaySelection.indexOf(day);

    if (index !== -1) {
      state.weekdaySelection.splice(index, 1);
    }

    listItem.remove();

    const bankButton =
      weekdayBank.querySelector(
        `[data-day="${escapeSelector(day)}"]`
      );

    if (bankButton) {
      bankButton.disabled = false;
      bankButton.hidden = false;
    }

    weekdayAnswer
      .querySelectorAll("li")
      .forEach((item) => {
        item.classList.remove(
          "is-correct-control",
          "is-wrong-control"
        );
      });
  }

  function showFeedback(
    step,
    message,
    success
  ) {
    const feedback =
      document.getElementById(
        `feedback-${step}`
      );

    feedback.textContent = message;

    feedback.className =
      `feedback ${
        success ? "is-success" : "is-error"
      }`;
  }

  function disableCompletedControls(card) {
    card
      .querySelectorAll("input, select")
      .forEach((control) => {
        control.disabled = true;
      });

    if (Number(card.dataset.step) === 4) {
      card
        .querySelectorAll(".word-chip")
        .forEach((button) => {
          button.disabled = true;
        });

      resetWeekdaysButton.disabled = true;

      weekdayAnswer
        .querySelectorAll("li")
        .forEach((item) => {
          item.removeAttribute("role");
          item.removeAttribute("tabindex");
          item.removeAttribute("title");
        });
    }
  }

  function matchesAnswer(
    value,
    acceptedAnswers
  ) {
    const normalizedValue =
      normalizeText(value);

    return acceptedAnswers
      .split("|")
      .map((answer) => normalizeText(answer))
      .includes(normalizedValue);
  }

  function normalizeText(value) {
    return value
      .trim()
      .toLocaleLowerCase("de-DE")
      .replace(/\s+/g, " ");
  }

  function clearControlState(control) {
    control.classList.remove(
      "is-correct-control",
      "is-wrong-control"
    );
  }

  function getStepCard(step) {
    return document.querySelector(
      `.exercise-card[data-step="${step}"]`
    );
  }

  function shuffleArray(array) {
    for (
      let index = array.length - 1;
      index > 0;
      index -= 1
    ) {
      const randomIndex = Math.floor(
        Math.random() * (index + 1)
      );

      [
        array[index],
        array[randomIndex]
      ] = [
        array[randomIndex],
        array[index]
      ];
    }

    return array;
  }

  function toggleSound() {
    state.soundEnabled =
      !state.soundEnabled;

    soundToggle.setAttribute(
      "aria-pressed",
      String(state.soundEnabled)
    );

    soundToggleText.textContent =
      state.soundEnabled
        ? "Ton an"
        : "Ton aus";

    if (!state.soundEnabled) {
      stopAudio();
    }
  }

  function playAudioFile(
    source,
    button = null
  ) {
    if (
      !state.soundEnabled ||
      !source
    ) {
      return;
    }

    /*
     * Dacă este apăsat din nou același buton
     * în timpul redării, fișierul se oprește.
     */
    if (
      state.activeAudio &&
      state.activeAudioButton === button &&
      !state.activeAudio.paused
    ) {
      stopAudio();
      return;
    }

    stopAudio();

    const audio = new Audio(source);

    audio.preload = "auto";
    audio.volume = 1;

    state.activeAudio = audio;
    state.activeAudioButton = button;

    if (button) {
      button.classList.add("is-speaking");

      button.setAttribute(
        "aria-pressed",
        "true"
      );
    }

    audio.addEventListener(
      "ended",
      () => {
        clearActiveAudio();
      },
      {
        once: true
      }
    );

    audio.addEventListener(
      "error",
      () => {
        console.error(
          `Die Audiodatei konnte nicht geladen werden: ${source}`
        );

        clearActiveAudio();
      },
      {
        once: true
      }
    );

    audio.play().catch((error) => {
      console.error(
        "Audio konnte nicht gestartet werden:",
        error
      );

      clearActiveAudio();
    });
  }

  function playFeedbackAudio(type) {
    if (!state.soundEnabled) {
      return;
    }

    const source = feedbackFiles[type];

    if (source) {
      playAudioFile(source);
    }
  }

  function stopAudio() {
    if (state.activeAudio) {
      state.activeAudio.pause();
      state.activeAudio.currentTime = 0;
    }

    clearActiveAudio();
  }

  function clearActiveAudio() {
    if (state.activeAudioButton) {
      state.activeAudioButton.classList.remove(
        "is-speaking"
      );

      state.activeAudioButton.setAttribute(
        "aria-pressed",
        "false"
      );
    }

    state.activeAudio = null;
    state.activeAudioButton = null;
  }

  function escapeSelector(value) {
    if (
      window.CSS &&
      typeof window.CSS.escape === "function"
    ) {
      return window.CSS.escape(value);
    }

    return value.replace(
      /["\\]/g,
      "\\$&"
    );
  }

  function prefersReducedMotion() {
    return window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
  }
});
