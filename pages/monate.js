"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const IMAGE_PATH = "../assets/images/lessons/monate/";
  const ICON_PATH = "../assets/icons/monate/";
  const AUDIO_PATH = "../audio/monate/";

  const months = [
    {
      name: "Januar",
      ro: "ianuarie",
      file: "januar"
    },
    {
      name: "Februar",
      ro: "februarie",
      file: "februar"
    },
    {
      name: "März",
      ro: "martie",
      file: "maerz"
    },
    {
      name: "April",
      ro: "aprilie",
      file: "april"
    },
    {
      name: "Mai",
      ro: "mai",
      file: "mai"
    },
    {
      name: "Juni",
      ro: "iunie",
      file: "juni"
    },
    {
      name: "Juli",
      ro: "iulie",
      file: "juli"
    },
    {
      name: "August",
      ro: "august",
      file: "august"
    },
    {
      name: "September",
      ro: "septembrie",
      file: "september"
    },
    {
      name: "Oktober",
      ro: "octombrie",
      file: "oktober"
    },
    {
      name: "November",
      ro: "noiembrie",
      file: "november"
    },
    {
      name: "Dezember",
      ro: "decembrie",
      file: "dezember"
    }
  ];

  const audio = document.querySelector("#lesson-audio");
  const audioStatus = document.querySelector("#audio-status");

  const completedSteps = new Set();

  let activeAudioButton = null;
  let audioFinishedCallback = null;

  /* FUNCȚII GENERALE */

  function shuffle(items) {
    const copy = [...items];

    for (let index = copy.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(
        Math.random() * (index + 1)
      );

      [copy[index], copy[randomIndex]] = [
        copy[randomIndex],
        copy[index]
      ];
    }

    return copy;
  }

  function setPlaying(button, playing) {
    if (!button) {
      return;
    }

    const icon = button.querySelector("img");

    if (icon) {
      icon.src = `${ICON_PATH}${
        playing
          ? "audio-playing.svg"
          : "audio.svg"
      }`;
    }

    const monthCard = button.closest(".month-card");

    if (monthCard) {
      monthCard.classList.toggle(
        "is-playing",
        playing
      );
    }
  }

  function playAudio(
    source,
    button = null,
    onFinished = null
  ) {
    if (!audio || !source) {
      return;
    }

    if (activeAudioButton) {
      setPlaying(activeAudioButton, false);
    }

    activeAudioButton = button;
    audioFinishedCallback = onFinished;

    setPlaying(button, true);

    audio.pause();
    audio.src = source;
    audio.currentTime = 0;

    audio
      .play()
      .then(() => {
        if (audioStatus) {
          audioStatus.textContent = "";
        }
      })
      .catch(() => {
        if (audioStatus) {
          const fileName =
            source.split("/").pop();

          audioStatus.textContent =
            `Audio indisponibil: ${fileName}. ` +
            "Verifică folderul audio/monate/.";
        }

        setPlaying(button, false);
        activeAudioButton = null;
        audioFinishedCallback = null;
      });
  }

  if (audio) {
    audio.addEventListener("ended", () => {
      setPlaying(activeAudioButton, false);

      activeAudioButton = null;

      const callback = audioFinishedCallback;

      audioFinishedCallback = null;

      if (typeof callback === "function") {
        callback();
      }
    });

    audio.addEventListener("error", () => {
      if (audioStatus) {
        const fileName =
          audio.src.split("/").pop() ||
          "fișier necunoscut";

        audioStatus.textContent =
          `Audio indisponibil: ${fileName}.`;
      }

      setPlaying(activeAudioButton, false);

      activeAudioButton = null;
      audioFinishedCallback = null;
    });
  }

  document
    .querySelectorAll(".audio-button")
    .forEach((button) => {
      button.addEventListener("click", () => {
        playAudio(
          button.dataset.audio,
          button
        );
      });
    });

  /* PROGRESUL LECȚIEI */

  function updateProgress() {
    const percent = Math.round(
      (completedSteps.size / 6) * 100
    );

    const progressLabel =
      document.querySelector("#progress-label");

    const progressBar =
      document.querySelector("#progress-bar");

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
    const nextButton =
      document.querySelector(
        `#${nextButtonId}`
      );

    const status =
      document.querySelector(
        `#${messageId}`
      );

    if (nextButton) {
      nextButton.disabled = false;
    }

    if (status) {
      status.textContent = message;
    }

    if (nextButton) {
      const stepAction =
        nextButton.closest(".step-action");

      if (stepAction) {
        stepAction.classList.add(
          "is-ready"
        );
      }
    }

    if (!completedSteps.has(step)) {
      completedSteps.add(step);
      updateProgress();
    }
  }

  function unlockStep(step) {
    const section =
      document.querySelector(
        `[data-step="${step}"]`
      );

    const navigationLink =
      document.querySelector(
        `[data-step-link="${step}"]`
      );

    if (!section) {
      return;
    }

    section.hidden = false;

    if (navigationLink) {
      navigationLink.removeAttribute(
        "aria-disabled"
      );
    }

    document
      .querySelectorAll(".step-nav a")
      .forEach((link) => {
        link.classList.remove("active");
      });

    if (navigationLink) {
      navigationLink.classList.add("active");
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

    if (!button) {
      return;
    }

    button.addEventListener("click", () => {
      unlockStep(step);

      if (typeof starter === "function") {
        window.setTimeout(
          starter,
          450
        );
      }
    });
  }

  function answerButton(label) {
    const button =
      document.createElement("button");

    button.type = "button";
    button.className = "answer-button";
    button.dataset.answer = label;
    button.textContent = label;

    return button;
  }

  function lockAnswers(container) {
    if (!container) {
      return;
    }

    container
      .querySelectorAll("button")
      .forEach((button) => {
        button.disabled = true;
      });
  }

  function markCorrect(
    container,
    correctAnswer
  ) {
    if (!container) {
      return;
    }

    const buttons =
      container.querySelectorAll(
        "[data-answer]"
      );

    buttons.forEach((button) => {
      if (
        button.dataset.answer ===
        correctAnswer
      ) {
        button.classList.add("correct");
      }
    });
  }

  /* SCHRITT 1: CELE 12 LUNI */

  const monthsGrid =
    document.querySelector("#months-grid");

  const heardMonths = new Set();

  function registerHeardMonth(
    month,
    card
  ) {
    heardMonths.add(month.file);

    if (card) {
      card.classList.add("is-learned");
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
        document.createElement("article");

      card.className = "month-card";

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

  const allMonthsAudioButton =
    document.querySelector(
      "#all-months-audio"
    );

  if (allMonthsAudioButton) {
    allMonthsAudioButton.addEventListener(
      "click",
      () => {
        playAudio(
          `${AUDIO_PATH}monate-alle.mp3`,
          allMonthsAudioButton,
          () => {
            months.forEach(
              (month, index) => {
                const card =
                  monthsGrid
                    ? monthsGrid.children[index]
                    : null;

                registerHeardMonth(
                  month,
                  card
                );
              }
            );
          }
        );
      }
    );
  }

  /* SCHRITT 2: DAVOR ȘI DANACH */

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

  const neighborScore =
    document.querySelector(
      "#neighbor-score"
    );

  let neighborRound = 0;
  let neighborCorrect = 0;

  let currentNeighborAudio =
    "anweisung-danach.mp3";

  function newNeighborQuestion(
    playInstruction = true
  ) {
    const askAfter =
      neighborRound % 2 === 0;

    neighborRound += 1;

    let baseIndex;

    if (askAfter) {
      baseIndex =
        Math.floor(
          Math.random() * 11
        );
    } else {
      baseIndex =
        Math.floor(
          Math.random() * 11
        ) + 1;
    }

    const answerIndex =
      askAfter
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

    if (neighborQuestion) {
      neighborQuestion.textContent =
        askAfter
          ? `Welcher Monat kommt nach ${months[baseIndex].name}?`
          : `Welcher Monat kommt vor ${months[baseIndex].name}?`;
    }

    if (!neighborOptions) {
      return;
    }

    neighborOptions.innerHTML = "";

    if (neighborFeedback) {
      neighborFeedback.textContent = "";
      neighborFeedback.className =
        "feedback";
    }

    if (nextNeighbor) {
      nextNeighbor.hidden = true;
    }

    const distractors = shuffle(
      months.filter(
        (month, index) =>
          index !== answerIndex
      )
    ).slice(0, 2);

    const options = shuffle([
      answer,
      ...distractors
    ]);

    options.forEach((month) => {
      const button =
        answerButton(month.name);

      button.addEventListener(
        "click",
        () => {
          lockAnswers(neighborOptions);

          if (month === answer) {
            button.classList.add(
              "correct"
            );

            neighborCorrect += 1;

            if (neighborScore) {
              neighborScore.textContent =
                String(
                  Math.min(
                    neighborCorrect,
                    4
                  )
                );
            }

            if (neighborFeedback) {
              neighborFeedback.textContent =
                `Richtig! ${answer.name}.`;

              neighborFeedback.className =
                "feedback success";
            }

            playAudio(
              `${AUDIO_PATH}${answer.file}.mp3`
            );

            if (neighborCorrect >= 4) {
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

            if (neighborFeedback) {
              neighborFeedback.textContent =
                `Die richtige Antwort ist ${answer.name}.`;

              neighborFeedback.className =
                "feedback error";
            }
          }

          if (nextNeighbor) {
            nextNeighbor.hidden = false;
          }
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

  /* SCHRITT 3: LUNA LIPSĂ */

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

  const missingScore =
    document.querySelector(
      "#missing-score"
    );

  let missingCorrect = 0;

  function newMissingQuestion(
    playInstruction = false
  ) {
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

    if (
      !missingSequence ||
      !missingOptions
    ) {
      return;
    }

    missingSequence.innerHTML = "";

    sequence.forEach(
      (month, index) => {
        const item =
          document.createElement("span");

        item.className =
          `sequence-item${
            index === missingOffset
              ? " blank"
              : ""
          }`;

        item.textContent =
          index === missingOffset
            ? "?"
            : month.name;

        missingSequence.append(item);
      }
    );

    missingOptions.innerHTML = "";

    if (missingFeedback) {
      missingFeedback.textContent = "";
      missingFeedback.className =
        "feedback";
    }

    if (nextMissing) {
      nextMissing.hidden = true;
    }

    const distractors = shuffle(
      months.filter(
        (month) =>
          !sequence.includes(month)
      )
    ).slice(0, 2);

    const options = shuffle([
      answer,
      ...distractors
    ]);

    options.forEach((month) => {
      const button =
        answerButton(month.name);

      button.addEventListener(
        "click",
        () => {
          lockAnswers(missingOptions);

          if (month === answer) {
            button.classList.add(
              "correct"
            );

            missingCorrect += 1;

            if (missingScore) {
              missingScore.textContent =
                String(
                  Math.min(
                    missingCorrect,
                    3
                  )
                );
            }

            if (missingFeedback) {
              missingFeedback.textContent =
                `Richtig! ${answer.name} fehlt.`;

              missingFeedback.className =
                "feedback success";
            }

            playAudio(
              `${AUDIO_PATH}${answer.file}.mp3`
            );

            if (missingCorrect >= 3) {
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

            if (missingFeedback) {
              missingFeedback.textContent =
                `Hier fehlt ${answer.name}.`;

              missingFeedback.className =
                "feedback error";
            }
          }

          if (nextMissing) {
            nextMissing.hidden = false;
          }
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

  /* SCHRITT 4: ASCULTĂ ȘI ALEGE */

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

  const listenScore =
    document.querySelector(
      "#listen-score"
    );

  let listenAnswer = null;
  let listenCorrect = 0;

  function newListenQuestion(
    autoPlay = false
  ) {
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

    if (!listenOptions) {
      return;
    }

    listenOptions.innerHTML = "";

    if (listenFeedback) {
      listenFeedback.textContent = "";
      listenFeedback.className =
        "feedback";
    }

    if (nextListen) {
      nextListen.hidden = true;
    }

    const options = shuffle([
      listenAnswer,
      ...distractors
    ]);

    options.forEach((month) => {
      const button =
        document.createElement("button");

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
          lockAnswers(listenOptions);

          if (month === listenAnswer) {
            button.classList.add(
              "correct"
            );

            listenCorrect += 1;

            if (listenScore) {
              listenScore.textContent =
                String(
                  Math.min(
                    listenCorrect,
                    3
                  )
                );
            }

            if (listenFeedback) {
              listenFeedback.textContent =
                `Richtig! Du hörst ${listenAnswer.name}.`;

              listenFeedback.className =
                "feedback success";
            }

            if (listenCorrect >= 3) {
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

            if (listenFeedback) {
              listenFeedback.textContent =
                `Du hörst ${listenAnswer.name}. Hör noch einmal gut zu.`;

              listenFeedback.className =
                "feedback error";
            }
          }

          if (nextListen) {
            nextListen.hidden = false;
          }
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

  /* SCHRITT 5: ZIUA DE NAȘTERE */

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

  const openQuizButton =
    document.querySelector(
      "#open-quiz"
    );

  let selectedBirthdayMonth = null;

  if (birthdaySelect) {
    months.forEach(
      (month, index) => {
        const option =
          document.createElement("option");

        option.value = String(index);
        option.textContent = month.name;

        birthdaySelect.append(option);
      }
    );
  }

  if (birthdayQuestionAudio) {
    birthdayQuestionAudio.addEventListener(
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
        if (
          birthdaySelect.value === ""
        ) {
          selectedBirthdayMonth = null;

          if (birthdayAnswer) {
            birthdayAnswer.textContent =
              "Ich habe im … Geburtstag.";
          }

          if (birthdaySentenceAudio) {
            birthdaySentenceAudio.disabled =
              true;
          }

          if (openQuizButton) {
            openQuizButton.disabled =
              true;
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
    birthdaySentenceAudio.addEventListener(
      "click",
      () => {
        if (selectedBirthdayMonth) {
          playAudio(
            `${AUDIO_PATH}geburtstag-${selectedBirthdayMonth.file}.mp3`,
            birthdaySentenceAudio
          );
        }
      }
    );
  }

  /* QUIZUL FINAL */

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

  const quizCounter =
    document.querySelector(
      "#quiz-counter"
    );

  const resultIcon =
    document.querySelector(
      "#result-icon"
    );

  const resultTitle =
    document.querySelector(
      "#result-title"
    );

  const resultScore =
    document.querySelector(
      "#result-score"
    );

  const resultMessage =
    document.querySelector(
      "#result-message"
    );

  let quizIndex = 0;
  let quizScore = 0;

  function renderQuiz() {
    const question =
      quizQuestions[quizIndex];

    if (
      !question ||
      !quizQuestion ||
      !quizOptions
    ) {
      return;
    }

    if (quizCounter) {
      quizCounter.textContent =
        `Frage ${quizIndex + 1} von ${quizQuestions.length}`;
    }

    quizQuestion.textContent =
      question.text;

    quizOptions.innerHTML = "";

    if (quizFeedback) {
      quizFeedback.textContent = "";
      quizFeedback.className =
        "feedback";
    }

    if (quizNext) {
      quizNext.hidden = true;
    }

    const options =
      shuffle(question.options);

    options.forEach((option) => {
      const button =
        answerButton(option);

      button.addEventListener(
        "click",
        () => {
          lockAnswers(quizOptions);

          if (
            option ===
            question.answer
          ) {
            quizScore += 1;

            button.classList.add(
              "correct"
            );

            if (quizFeedback) {
              quizFeedback.textContent =
                "Richtig! Sehr gut.";

              quizFeedback.className =
                "feedback success";
            }
          } else {
            button.classList.add(
              "wrong"
            );

            markCorrect(
              quizOptions,
              question.answer
            );

            if (quizFeedback) {
              quizFeedback.textContent =
                `Die richtige Antwort ist ${question.answer}.`;

              quizFeedback.className =
                "feedback error";
            }
          }

          if (quizNext) {
            quizNext.hidden = false;

            const buttonText =
              quizNext.querySelector("span");

            if (buttonText) {
              buttonText.textContent =
                quizIndex ===
                quizQuestions.length - 1
                  ? "Ergebnis"
                  : "Weiter";
            }
          }
        }
      );

      quizOptions.append(button);
    });
  }

  function showQuizResult() {
    if (quizPanel) {
      quizPanel.hidden = true;
    }

    if (quizResult) {
      quizResult.hidden = false;
    }

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

      const diplomaSection =
        document.querySelector(
          "#diploma-section"
        );

      if (diplomaSection) {
        diplomaSection.hidden = false;

        window.setTimeout(() => {
          diplomaSection.scrollIntoView({
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

        const diplomaSection =
          document.querySelector(
            "#diploma-section"
          );

        if (diplomaSection) {
          diplomaSection.hidden = true;
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

  /* CONECTAREA PAȘILOR */

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

  updateProgress();
});
