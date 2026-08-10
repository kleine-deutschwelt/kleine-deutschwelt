"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const IMAGE_PATH = "../assets/images/lessons/monate/";
  const ICON_PATH = "../assets/icons/monate/";
  const AUDIO_PATH = "../audio/monate/";

  const months = [
    { name: "Januar", ro: "ianuarie", file: "januar" },
    { name: "Februar", ro: "februarie", file: "februar" },
    { name: "März", ro: "martie", file: "maerz" },
    { name: "April", ro: "aprilie", file: "april" },
    { name: "Mai", ro: "mai", file: "mai" },
    { name: "Juni", ro: "iunie", file: "juni" },
    { name: "Juli", ro: "iulie", file: "juli" },
    { name: "August", ro: "august", file: "august" },
    { name: "September", ro: "septembrie", file: "september" },
    { name: "Oktober", ro: "octombrie", file: "oktober" },
    { name: "November", ro: "noiembrie", file: "november" },
    { name: "Dezember", ro: "decembrie", file: "dezember" }
  ];

  const audio = document.querySelector("#lesson-audio");
  const audioStatus = document.querySelector("#audio-status");
  const completedSteps = new Set();

  let activeAudioButton = null;
  let audioFinishedCallback = null;

  function shuffle(items) {
    const copy = [...items];

    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));

      [copy[i], copy[j]] = [
        copy[j],
        copy[i]
      ];
    }

    return copy;
  }

  function setPlaying(button, playing) {
    if (!button) return;

    const icon = button.querySelector("img");

    if (icon) {
      icon.src =
        `${ICON_PATH}${
          playing
            ? "audio-playing.svg"
            : "audio.svg"
        }`;
    }

    const card =
      button.closest(".month-card");

    if (card) {
      card.classList.toggle(
        "is-playing",
        playing
      );
    }
  }

  function playAudio(
    src,
    button = null,
    onFinished = null
  ) {
    if (!audio || !src) return;

    if (activeAudioButton) {
      setPlaying(
        activeAudioButton,
        false
      );
    }

    activeAudioButton = button;
    audioFinishedCallback = onFinished;

    setPlaying(button, true);

    audio.pause();
    audio.src = src;
    audio.currentTime = 0;

    audio.play()
      .then(() => {
        if (audioStatus) {
          audioStatus.textContent = "";
        }
      })
      .catch(() => {
        if (audioStatus) {
          const fileName =
            src.split("/").pop();

          audioStatus.textContent =
            `Audio indisponibil: ${fileName}. Verifică folderul audio/monate/.`;
        }

        setPlaying(button, false);
      });
  }

  if (audio) {
    audio.addEventListener(
      "ended",
      () => {
        setPlaying(
          activeAudioButton,
          false
        );

        activeAudioButton = null;

        const callback =
          audioFinishedCallback;

        audioFinishedCallback = null;

        if (
          typeof callback ===
          "function"
        ) {
          callback();
        }
      }
    );

    audio.addEventListener(
      "error",
      () => {
        if (audioStatus) {
          const fileName =
            audio.src
              .split("/")
              .pop() ||
            "fișier necunoscut";

          audioStatus.textContent =
            `Audio indisponibil: ${fileName}.`;
        }

        setPlaying(
          activeAudioButton,
          false
        );

        activeAudioButton = null;
        audioFinishedCallback = null;
      }
    );
  }

  document
    .querySelectorAll(
      ".audio-button"
    )
    .forEach((button) => {
      button.addEventListener(
        "click",
        () => {
          playAudio(
            button.dataset.audio,
            button
          );
        }
      );
    });

  function updateProgress() {
    const percent = Math.round(
      (completedSteps.size / 6) *
        100
    );

    const progressLabel =
      document.querySelector(
        "#progress-label"
      );

    const progressBar =
      document.querySelector(
        "#progress-bar"
      );

    if (progressLabel) {
      progressLabel.textContent =
        `${percent} %`;
    }

    if (progressBar) {
      progressBar.style.width =
        `${percent}%`;
    }
  }

  function completeStep(
    step,
    nextButtonId,
    messageId,
    message
  ) {
    if (
      completedSteps.has(step)
    ) {
      return;
    }

    completedSteps.add(step);
    updateProgress();

    const button =
      document.querySelector(
        `#${nextButtonId}`
      );

    const status =
      document.querySelector(
        `#${messageId}`
      );

    if (button) {
      button.disabled = false;
    }

    if (status) {
      status.textContent = message;
    }

    if (button) {
      const action =
        button.closest(
          ".step-action"
        );

      if (action) {
        action.classList.add(
          "is-ready"
        );
      }
    }
  }

  function unlockStep(step) {
    const section =
      document.querySelector(
        `[data-step="${step}"]`
      );

    const link =
      document.querySelector(
        `[data-step-link="${step}"]`
      );

    if (!section) return;

    section.hidden = false;

    if (link) {
      link.removeAttribute(
        "aria-disabled"
      );
    }

    document
      .querySelectorAll(
        ".step-nav a"
      )
      .forEach((item) => {
        item.classList.remove(
          "active"
        );
      });

    if (link) {
      link.classList.add("active");
    }

    window.setTimeout(() => {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }, 80);
  }

  function connectUnlockButton(
    buttonId,
    step,
    starter
  ) {
    const button =
      document.querySelector(
        `#${buttonId}`
      );

    if (!button) return;

    button.addEventListener(
      "click",
      () => {
        unlockStep(step);

        if (
          typeof starter ===
          "function"
        ) {
          window.setTimeout(
            starter,
            450
          );
        }
      }
    );
  }

  function answerButton(label) {
    const button =
      document.createElement(
        "button"
      );

    button.type = "button";
    button.className =
      "answer-button";

    button.dataset.answer = label;
    button.textContent = label;

    return button;
  }

  function lockAnswers(container) {
    if (!container) return;

    container
      .querySelectorAll("button")
      .forEach((button) => {
        button.disabled = true;
      });
  }

  function markCorrect(
    container,
    answer
  ) {
    if (!container) return;

    const correct =
      container.querySelector(
        `[data-answer="${answer}"]`
      );

    if (correct) {
      correct.classList.add(
        "correct"
      );
    }
  }

  /*
   * SCHRITT 1
   * Die zwölf Monate
   */

  const monthsGrid =
    document.querySelector(
      "#months-grid"
    );

  const heardMonths = new Set();

  function registerHeardMonth(
    month,
    card
  ) {
    heardMonths.add(month.file);

    if (card) {
      card.classList.add(
        "is-learned"
      );
    }

    const learnedCount =
      document.querySelector(
        "#learned-count"
      );

    if (learnedCount) {
      learnedCount.textContent =
        String(heardMonths.size);
    }

    if (
      heardMonths.size ===
      months.length
    ) {
      completeStep(
        "1",
        "open-step-2",
        "step-1-message",
        "Alle zwölf Monate sind gehört. Du kannst weitergehen."
      );
    }
  }

  if (monthsGrid) {
    months.forEach((month) => {
      const card =
        document.createElement(
          "article"
        );

      card.className =
        "month-card";

      card.innerHTML = `
        <button
          class="month-image-button"
          type="button"
          aria-label="${month.name} hören"
        >
          <img
            class="month-card-image"
            src="${IMAGE_PATH}${month.file}.webp"
            alt="Bild für ${month.name}"
            loading="lazy"
          >
        </button>

        <div class="month-card-copy">
          <div>
            <h3>${month.name}</h3>
            <p>${month.ro}</p>
          </div>

          <button
            class="small-audio-button"
            type="button"
            aria-label="${month.name} hören"
          >
            <img
              src="${ICON_PATH}audio.svg"
              alt=""
              width="24"
              height="24"
            >
          </button>
        </div>
      `;

      card
        .querySelectorAll("button")
        .forEach((button) => {
          button.addEventListener(
            "click",
            () => {
              registerHeardMonth(
                month,
                card
              );

              playAudio(
                `${AUDIO_PATH}${month.file}.mp3`,
                button
              );
            }
          );
        });

      monthsGrid.append(card);
    });
  }

  const allMonthsAudio =
    document.querySelector(
      "#all-months-audio"
    );

  if (allMonthsAudio) {
    allMonthsAudio.addEventListener(
      "click",
      () => {
        playAudio(
          `${AUDIO_PATH}monate-alle.mp3`,
          allMonthsAudio,
          () => {
            months.forEach(
              (month, index) => {
                registerHeardMonth(
                  month,
                  monthsGrid
                    ? monthsGrid.children[
                        index
                      ]
                    : null
                );
              }
            );
          }
        );
      }
    );
  }

  /*
   * SCHRITT 2
   * Davor und danach
   */

  const neighborQuestion =
    document.querySelector(
      "#neighbor-question"
    );

  const neighborOptions =
    document.querySelector(
      "#neighbor-options"
    );

  const neighborFeedback =
    document.querySelector(
      "#neighbor-feedback"
    );

  const nextNeighbor =
    document.querySelector(
      "#next-neighbor"
    );

  const neighborInstruction =
    document.querySelector(
      "#neighbor-instruction"
    );

  const neighborHeadingIcon =
    document.querySelector(
      "#neighbor-heading-icon"
    );

  let neighborRound = 0;
  let neighborCorrect = 0;

  let currentNeighborAudio =
    "anweisung-danach.mp3";

  function newNeighborQuestion(
    playInstruction = true
  ) {
    if (
      !neighborQuestion ||
      !neighborOptions ||
      !neighborFeedback ||
      !nextNeighbor
    ) {
      return;
    }

    const askAfter =
      neighborRound % 2 === 0;

    neighborRound += 1;

    const baseIndex = askAfter
      ? Math.floor(
          Math.random() * 11
        )
      : Math.floor(
          Math.random() * 11
        ) + 1;

    const answerIndex = askAfter
      ? baseIndex + 1
      : baseIndex - 1;

    const answer =
      months[answerIndex];

    currentNeighborAudio =
      askAfter
        ? "anweisung-danach.mp3"
        : "anweisung-davor.mp3";

    if (neighborHeadingIcon) {
      neighborHeadingIcon.src =
        `${ICON_PATH}${
          askAfter
            ? "next.svg"
            : "previous.svg"
        }`;
    }

    neighborQuestion.textContent =
      askAfter
        ? `Welcher Monat kommt nach ${months[baseIndex].name}?`
        : `Welcher Monat kommt vor ${months[baseIndex].name}?`;

    neighborOptions.innerHTML = "";
    neighborFeedback.textContent = "";
    neighborFeedback.className =
      "feedback";

    nextNeighbor.hidden = true;

    const distractors = shuffle(
      months.filter(
        (_, index) =>
          index !== answerIndex
      )
    ).slice(0, 2);

    shuffle([
      answer,
      ...distractors
    ]).forEach((month) => {
      const button =
        answerButton(month.name);

      button.addEventListener(
        "click",
        () => {
          lockAnswers(
            neighborOptions
          );

          if (month === answer) {
            button.classList.add(
              "correct"
            );

            neighborCorrect += 1;

            const score =
              document.querySelector(
                "#neighbor-score"
              );

            if (score) {
              score.textContent =
                String(
                  Math.min(
                    neighborCorrect,
                    4
                  )
                );
            }

            neighborFeedback.textContent =
              `Richtig! ${answer.name}.`;

            neighborFeedback.className =
              "feedback success";

            playAudio(
              `${AUDIO_PATH}${answer.file}.mp3`
            );

            if (
              neighborCorrect >= 4
            ) {
              completeStep(
                "2",
                "open-step-3",
                "step-2-message",
                "Vier Antworten sind richtig. Schritt 3 ist bereit."
              );
            }
          } else {
            button.classList.add(
              "wrong"
            );

            markCorrect(
              neighborOptions,
              answer.name
            );

            neighborFeedback.textContent =
              `Die richtige Antwort ist ${answer.name}.`;

            neighborFeedback.className =
              "feedback error";
          }

          nextNeighbor.hidden = false;
        }
      );

      neighborOptions.append(button);
    });

    if (playInstruction) {
      playAudio(
        `${AUDIO_PATH}${currentNeighborAudio}`,
        neighborInstruction
      );
    }
  }

  if (neighborInstruction) {
    neighborInstruction.addEventListener(
      "click",
      () => {
        playAudio(
          `${AUDIO_PATH}${currentNeighborAudio}`,
          neighborInstruction
        );
      }
    );
  }

  if (nextNeighbor) {
    nextNeighbor.addEventListener(
      "click",
      () => {
        newNeighborQuestion(true);
      }
    );
  }

  /*
   * SCHRITT 3
   * Welcher Monat fehlt?
   */

  const missingSequence =
    document.querySelector(
      "#missing-sequence"
    );

  const missingOptions =
    document.querySelector(
      "#missing-options"
    );

  const missingFeedback =
    document.querySelector(
      "#missing-feedback"
    );

  const nextMissing =
    document.querySelector(
      "#next-missing"
    );

  const missingInstruction =
    document.querySelector(
      "#missing-instruction"
    );

  let missingCorrect = 0;

  function newMissingQuestion(
    playInstruction = false
  ) {
    if (
      !missingSequence ||
      !missingOptions ||
      !missingFeedback ||
      !nextMissing
    ) {
      return;
    }

    const start =
      Math.floor(
        Math.random() * 9
      );

    const missingOffset =
      Math.floor(
        Math.random() * 4
      );

    const sequence =
      months.slice(
        start,
        start + 4
      );

    const answer =
      sequence[missingOffset];

    missingSequence.innerHTML = "";

    sequence.forEach(
      (month, index) => {
        const item =
          document.createElement(
            "span"
          );

        item.className =
          `sequence-item${
            index ===
            missingOffset
              ? " blank"
              : ""
          }`;

        item.textContent =
          index === missingOffset
            ? "?"
            : month.name;

        missingSequence.append(
          item
        );
      }
    );

    missingOptions.innerHTML = "";
    missingFeedback.textContent = "";
    missingFeedback.className =
      "feedback";

    nextMissing.hidden = true;

    const distractors = shuffle(
      months.filter(
        (month) =>
          !sequence.includes(month)
      )
    ).slice(0, 2);

    shuffle([
      answer,
      ...distractors
    ]).forEach((month) => {
      const button =
        answerButton(month.name);

      button.addEventListener(
        "click",
        () => {
          lockAnswers(
            missingOptions
          );

          if (month === answer) {
            button.classList.add(
              "correct"
            );

            missingCorrect += 1;

            const score =
              document.querySelector(
                "#missing-score"
              );

            if (score) {
              score.textContent =
                String(
                  Math.min(
                    missingCorrect,
                    3
                  )
                );
            }

            missingFeedback.textContent =
              `Richtig! ${answer.name} fehlt.`;

            missingFeedback.className =
              "feedback success";

            playAudio(
              `${AUDIO_PATH}${answer.file}.mp3`
            );

            if (
              missingCorrect >= 3
            ) {
              completeStep(
                "3",
                "open-step-4",
                "step-3-message",
                "Drei Reihen sind richtig. Schritt 4 ist bereit."
              );
            }
          } else {
            button.classList.add(
              "wrong"
            );

            markCorrect(
              missingOptions,
              answer.name
            );

            missingFeedback.textContent =
              `Hier fehlt ${answer.name}.`;

            missingFeedback.className =
              "feedback error";
          }

          nextMissing.hidden = false;
        }
      );

      missingOptions.append(button);
    });

    if (playInstruction) {
      playAudio(
        `${AUDIO_PATH}anweisung-fehlt.mp3`,
        missingInstruction
      );
    }
  }

  if (missingInstruction) {
    missingInstruction.addEventListener(
      "click",
      () => {
        playAudio(
          `${AUDIO_PATH}anweisung-fehlt.mp3`,
          missingInstruction
        );
      }
    );
  }

  if (nextMissing) {
    nextMissing.addEventListener(
      "click",
      () => {
        newMissingQuestion(false);
      }
    );
  }

  /*
   * SCHRITT 4
   * Höre und wähle
   */

  const listenOptions =
    document.querySelector(
      "#listen-options"
    );

  const listenFeedback =
    document.querySelector(
      "#listen-feedback"
    );

  const nextListen =
    document.querySelector(
      "#next-listen"
    );

  const listenMonthButton =
    document.querySelector(
      "#listen-month"
    );

  let listenAnswer = null;
  let listenCorrect = 0;

  function newListenQuestion(
    autoPlay = false
  ) {
    if (
      !listenOptions ||
      !listenFeedback ||
      !nextListen ||
      !listenMonthButton
    ) {
      return;
    }

    listenAnswer =
      months[
        Math.floor(
          Math.random() *
            months.length
        )
      ];

    const distractors = shuffle(
      months.filter(
        (month) =>
          month !== listenAnswer
      )
    ).slice(0, 2);

    listenOptions.innerHTML = "";
    listenFeedback.textContent = "";
    listenFeedback.className =
      "feedback";

    nextListen.hidden = true;

    shuffle([
      listenAnswer,
      ...distractors
    ]).forEach((month) => {
      const button =
        document.createElement(
          "button"
        );

      button.type = "button";
      button.className =
        "picture-answer";

      button.dataset.answer =
        month.name;

      button.innerHTML = `
        <img
          src="${IMAGE_PATH}${month.file}.webp"
          alt="Bild für ${month.name}"
        >
        <span>${month.name}</span>
      `;

      button.addEventListener(
        "click",
        () => {
          lockAnswers(
            listenOptions
          );

          if (
            month === listenAnswer
          ) {
            button.classList.add(
              "correct"
            );

            listenCorrect += 1;

            const score =
              document.querySelector(
                "#listen-score"
              );

            if (score) {
              score.textContent =
                String(
                  Math.min(
                    listenCorrect,
                    3
                  )
                );
            }

            listenFeedback.textContent =
              `Richtig! Du hörst ${listenAnswer.name}.`;

            listenFeedback.className =
              "feedback success";

            if (
              listenCorrect >= 3
            ) {
              completeStep(
                "4",
                "open-step-5",
                "step-4-message",
                "Drei Monate sind erkannt. Schritt 5 ist bereit."
              );
            }
          } else {
            button.classList.add(
              "wrong"
            );

            markCorrect(
              listenOptions,
              listenAnswer.name
            );

            listenFeedback.textContent =
              `Du hörst ${listenAnswer.name}. Hör noch einmal gut zu.`;

            listenFeedback.className =
              "feedback error";
          }

          nextListen.hidden = false;
        }
      );

      listenOptions.append(button);
    });

    if (autoPlay) {
      playAudio(
        `${AUDIO_PATH}${listenAnswer.file}.mp3`,
        listenMonthButton
      );
    }
  }

  if (listenMonthButton) {
    listenMonthButton.addEventListener(
      "click",
      () => {
        if (listenAnswer) {
          playAudio(
            `${AUDIO_PATH}${listenAnswer.file}.mp3`,
            listenMonthButton
          );
        }
      }
    );
  }

  if (nextListen) {
    nextListen.addEventListener(
      "click",
      () => {
        newListenQuestion(true);
      }
    );
  }

  /*
   * SCHRITT 5
   * Geburtstag
   */

  const birthdaySelect =
    document.querySelector(
      "#birthday-month"
    );

  const birthdayAnswer =
    document.querySelector(
      "#birthday-answer"
    );

  const birthdayQuestionAudio =
    document.querySelector(
      "#birthday-question-audio"
    );

  const birthdaySentenceAudio =
    document.querySelector(
      "#birthday-sentence-audio"
    );

  let selectedBirthdayMonth =
    null;

  if (birthdaySelect) {
    months.forEach(
      (month, index) => {
        birthdaySelect.add(
          new Option(
            month.name,
            String(index)
          )
        );
      }
    );
  }

  if (birthdayQuestionAudio) {
    birthdayQuestionAudio
      .addEventListener(
        "click",
        () => {
          playAudio(
            `${AUDIO_PATH}wann-hast-du-geburtstag.mp3`,
            birthdayQuestionAudio
          );
        }
      );
  }

  if (birthdaySelect) {
    birthdaySelect.addEventListener(
      "change",
      () => {
        const openQuiz =
          document.querySelector(
            "#open-quiz"
          );

        if (
          birthdaySelect.value ===
          ""
        ) {
          selectedBirthdayMonth =
            null;

          if (birthdayAnswer) {
            birthdayAnswer.textContent =
              "Ich habe im … Geburtstag.";
          }

          if (
            birthdaySentenceAudio
          ) {
            birthdaySentenceAudio.disabled =
              true;
          }

          if (openQuiz) {
            openQuiz.disabled = true;
          }

          return;
        }

        selectedBirthdayMonth =
          months[
            Number(
              birthdaySelect.value
            )
          ];

        if (birthdayAnswer) {
          birthdayAnswer.innerHTML = `
            Ich habe im
            <strong>
              ${selectedBirthdayMonth.name}
            </strong>
            Geburtstag.
            <br>
            <span class="translation">
              Ziua mea de naștere este în
              ${selectedBirthdayMonth.ro}.
            </span>
          `;
        }

        if (birthdaySentenceAudio) {
          birthdaySentenceAudio.disabled =
            false;
        }

        playAudio(
          `${AUDIO_PATH}geburtstag-${selectedBirthdayMonth.file}.mp3`,
          birthdaySentenceAudio
        );

        completeStep(
          "5",
          "open-quiz",
          "step-5-message",
          "Dein Geburtstagssatz ist fertig. Jetzt kommt das Quiz."
        );
      }
    );
  }

  if (birthdaySentenceAudio) {
    birthdaySentenceAudio
      .addEventListener(
        "click",
        () => {
          if (
            selectedBirthdayMonth
          ) {
            playAudio(
              `${AUDIO_PATH}geburtstag-${selectedBirthdayMonth.file}.mp3`,
              birthdaySentenceAudio
            );
          }
        }
      );
  }

  /*
   * ABSCHLUSSQUIZ
   */

  const quizQuestions = [
    {
      text:
        "Welcher Monat kommt nach Februar?",
      answer: "März",
      options: [
        "Januar",
        "März",
        "Mai"
      ]
    },
    {
      text:
        "Welcher Monat kommt vor August?",
      answer: "Juli",
      options: [
        "Juni",
        "Juli",
        "September"
      ]
    },
    {
      text:
        "Welcher Monat ist der erste Monat des Jahres?",
      answer: "Januar",
      options: [
        "Januar",
        "April",
        "Dezember"
      ]
    },
    {
      text:
        "Welcher Monat fehlt: September, Oktober, …, Dezember?",
      answer: "November",
      options: [
        "August",
        "November",
        "Januar"
      ]
    },
    {
      text:
        "Welcher Monat ist der letzte Monat des Jahres?",
      answer: "Dezember",
      options: [
        "Oktober",
        "November",
        "Dezember"
      ]
    }
  ];

  const quizPanel =
    document.querySelector(
      "#quiz-panel"
    );

  const quizQuestion =
    document.querySelector(
      "#quiz-question"
    );

  const quizOptions =
    document.querySelector(
      "#quiz-options"
    );

  const quizFeedback =
    document.querySelector(
      "#quiz-feedback"
    );

  const quizNext =
    document.querySelector(
      "#quiz-next"
    );

  const quizResult =
    document.querySelector(
      "#quiz-result"
    );

  let quizIndex = 0;
  let quizScore = 0;

  function renderQuiz() {
    if (
      !quizQuestion ||
      !quizOptions ||
      !quizFeedback ||
      !quizNext
    ) {
      return;
    }

    const question =
      quizQuestions[quizIndex];

    const quizCounter =
      document.querySelector(
        "#quiz-counter"
      );

    if (quizCounter) {
      quizCounter.textContent =
        `Frage ${quizIndex + 1} von ${quizQuestions.length}`;
    }

    quizQuestion.textContent =
      question.text;

    quizOptions.innerHTML = "";
    quizFeedback.textContent = "";
    quizFeedback.className =
      "feedback";

    quizNext.hidden = true;

    shuffle(question.options)
      .forEach((option) => {
        const button =
          answerButton(option);

        button.addEventListener(
          "click",
          () => {
            lockAnswers(
              quizOptions
            );

            if (
              option ===
              question.answer
            ) {
              quizScore += 1;

              button.classList.add(
                "correct"
              );

              quizFeedback.textContent =
                "Richtig! Sehr gut.";

              quizFeedback.className =
                "feedback success";
            } else {
              button.classList.add(
                "wrong"
              );

              markCorrect(
                quizOptions,
                question.answer
              );

              quizFeedback.textContent =
                `Die richtige Antwort ist ${question.answer}.`;

              quizFeedback.className =
                "feedback error";
            }

            quizNext.hidden = false;

            const nextLabel =
              quizNext.querySelector(
                "span"
              );

            if (nextLabel) {
              nextLabel.textContent =
                quizIndex ===
                quizQuestions.length - 1
                  ? "Ergebnis"
                  : "Weiter";
            }
          }
        );

        quizOptions.append(button);
      });
  }

  function showQuizResult() {
    if (
      !quizPanel ||
      !quizResult
    ) {
      return;
    }

    quizPanel.hidden = true;
    quizResult.hidden = false;

    const quizCounter =
      document.querySelector(
        "#quiz-counter"
      );

    const resultScore =
      document.querySelector(
        "#result-score"
      );

    const resultTitle =
      document.querySelector(
        "#result-title"
      );

    const resultMessage =
      document.querySelector(
        "#result-message"
      );

    const resultIcon =
      document.querySelector(
        "#result-icon"
      );

    if (quizCounter) {
      quizCounter.textContent =
        "Fertig";
    }

    if (resultScore) {
      resultScore.textContent =
        `${quizScore} von 5 Punkten`;
    }

    const perfect =
      quizScore === 5;

    if (resultTitle) {
      resultTitle.textContent =
        perfect
          ? "Du bist Monate-Meister!"
          : "Gut gemacht!";
    }

    if (resultMessage) {
      resultMessage.textContent =
        perfect
          ? "Du kennst alle zwölf Monate. Dein Diplom ist geöffnet."
          : "Für das Diplom brauchst du 5 von 5 Punkten. Versuche es noch einmal.";
    }

    if (resultIcon) {
      resultIcon.src =
        `${ICON_PATH}${
          perfect
            ? "trophy.svg"
            : "restart.svg"
        }`;
    }

    if (perfect) {
      completedSteps.add("6");
      updateProgress();

      const diploma =
        document.querySelector(
          "#diploma-section"
        );

      if (diploma) {
        diploma.hidden = false;

        window.setTimeout(() => {
          diploma.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        }, 250);
      }
    }
  }

  if (quizNext) {
    quizNext.addEventListener(
      "click",
      () => {
        quizIndex += 1;

        if (
          quizIndex <
          quizQuestions.length
        ) {
          renderQuiz();
        } else {
          showQuizResult();
        }
      }
    );
  }

  const restartQuiz =
    document.querySelector(
      "#restart-quiz"
    );

  if (restartQuiz) {
    restartQuiz.addEventListener(
      "click",
      () => {
        quizIndex = 0;
        quizScore = 0;

        if (quizResult) {
          quizResult.hidden = true;
        }

        if (quizPanel) {
          quizPanel.hidden = false;
        }

        const diploma =
          document.querySelector(
            "#diploma-section"
          );

        if (diploma) {
          diploma.hidden = true;
        }

        renderQuiz();
      }
    );
  }

  const printDiploma =
    document.querySelector(
      "#print-diploma"
    );

  if (printDiploma) {
    printDiploma.addEventListener(
      "click",
      () => {
        window.print();
      }
    );
  }

  /*
   * CONECTAREA PAȘILOR
   */

  connectUnlockButton(
    "open-step-2",
    2,
    () => {
      newNeighborQuestion(true);
    }
  );

  connectUnlockButton(
    "open-step-3",
    3,
    () => {
      newMissingQuestion(true);
    }
  );

  connectUnlockButton(
    "open-step-4",
    4,
    () => {
      newListenQuestion(false);
    }
  );

  connectUnlockButton(
    "open-step-5",
    5,
    () => {
      playAudio(
        `${AUDIO_PATH}wann-hast-du-geburtstag.mp3`,
        birthdayQuestionAudio
      );
    }
  );

  connectUnlockButton(
    "open-quiz",
    6,
    () => {
      renderQuiz();
    }
  );
});
