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
  let currentAudioButton = null;

  function shuffle(items) {
    const copy = [...items];

    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }

    return copy;
  }

  function playAudio(src, button = null) {
    if (!src || !audio) return;

    if (currentAudioButton) {
      setPlayingState(currentAudioButton, false);
    }

    currentAudioButton = button;

    if (button) {
      setPlayingState(button, true);
    }

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
          audioStatus.textContent =
            "Fișierul audio nu a putut fi redat. Verifică denumirea și folderul audio/monate/.";
        }

        if (button) {
          setPlayingState(button, false);
        }
      });
  }

  function setPlayingState(button, isPlaying) {
    const icon = button.querySelector("img");

    if (icon) {
      icon.src = `${ICON_PATH}${
        isPlaying ? "audio-playing.svg" : "audio.svg"
      }`;
    }

    const card = button.closest(".month-card");

    if (card) {
      card.classList.toggle("is-playing", isPlaying);
    }
  }

  if (audio) {
    audio.addEventListener("ended", () => {
      if (currentAudioButton) {
        setPlayingState(currentAudioButton, false);
      }

      currentAudioButton = null;
    });

    audio.addEventListener("error", () => {
      if (audioStatus) {
        const fileName =
          audio.src.split("/").pop() || "fișier necunoscut";

        audioStatus.textContent = `Audio indisponibil: ${fileName}.`;
      }

      if (currentAudioButton) {
        setPlayingState(currentAudioButton, false);
      }

      currentAudioButton = null;
    });
  }

  document.querySelectorAll(".audio-button").forEach((button) => {
    button.addEventListener("click", () => {
      playAudio(button.dataset.audio, button);
    });
  });

  const monthsGrid = document.querySelector("#months-grid");

  if (monthsGrid) {
    months.forEach((month) => {
      const article = document.createElement("article");
      article.className = "month-card";

      article.innerHTML = `
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

      article.querySelectorAll("button").forEach((button) => {
        button.addEventListener("click", () => {
          playAudio(
            `${AUDIO_PATH}${month.file}.mp3`,
            button
          );
        });
      });

      monthsGrid.append(article);
    });
  }

  const completedSteps = new Set();

  function completeStep(step) {
    completedSteps.add(step);

    const progressLabel =
      document.querySelector("#progress-label");

    const progressBar =
      document.querySelector("#progress-bar");

    const percent = Math.round(
      (completedSteps.size / 7) * 100
    );

    if (progressLabel) {
      progressLabel.textContent = `${percent} %`;
    }

    if (progressBar) {
      progressBar.style.width = `${percent}%`;
    }
  }

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            completeStep(
              entry.target.dataset.progressStep
            );
          }
        });
      },
      { threshold: 0.35 }
    );

    document
      .querySelectorAll("[data-progress-step]")
      .forEach((section) => {
        observer.observe(section);
      });
  }

  const orderOptions =
    document.querySelector("#order-options");

  const orderResult =
    document.querySelector("#order-result");

  const orderFeedback =
    document.querySelector("#order-feedback");

  const resetOrder =
    document.querySelector("#reset-order");

  let orderIndex = 0;

  function startOrderGame() {
    if (
      !orderOptions ||
      !orderResult ||
      !orderFeedback
    ) {
      return;
    }

    orderIndex = 0;
    orderResult.innerHTML = "";
    orderFeedback.textContent = "";
    orderFeedback.className = "feedback";
    orderOptions.innerHTML = "";

    shuffle(months).forEach((month) => {
      const button =
        document.createElement("button");

      button.type = "button";
      button.className =
        "compact-month-button";

      button.textContent = month.name;

      button.addEventListener("click", () => {
        if (month === months[orderIndex]) {
          const item =
            document.createElement("li");

          item.textContent = month.name;
          orderResult.append(item);
          button.disabled = true;

          playAudio(
            `${AUDIO_PATH}${month.file}.mp3`
          );

          orderIndex += 1;

          if (orderIndex === months.length) {
            orderFeedback.textContent =
              "Richtig! Alle Monate sind in der richtigen Reihenfolge.";

            completeStep("2");
          } else {
            orderFeedback.textContent =
              `Richtig! Jetzt kommt Monat ${
                orderIndex + 1
              }.`;
          }

          orderFeedback.className =
            "feedback success";
        } else {
          orderFeedback.textContent =
            `Noch einmal. Gesucht ist Monat ${
              orderIndex + 1
            }.`;

          orderFeedback.className =
            "feedback error";
        }
      });

      orderOptions.append(button);
    });
  }

  if (resetOrder) {
    resetOrder.addEventListener(
      "click",
      startOrderGame
    );
  }

  startOrderGame();

  function answerButton(text) {
    const button =
      document.createElement("button");

    button.type = "button";
    button.className = "answer-button";
    button.dataset.answer = text;
    button.textContent = text;

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

  function highlightCorrect(
    container,
    answer
  ) {
    if (!container) return;

    const correctButton =
      container.querySelector(
        `[data-answer="${answer}"]`
      );

    if (correctButton) {
      correctButton.classList.add("correct");
    }
  }

  let neighborRound = 0;

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

  function newNeighborQuestion() {
    if (
      !neighborQuestion ||
      !neighborOptions ||
      !neighborFeedback ||
      !nextNeighbor
    ) {
      return;
    }

    neighborRound += 1;

    const askAfter = Math.random() > 0.5;

    const baseIndex = askAfter
      ? Math.floor(Math.random() * 11)
      : Math.floor(Math.random() * 11) + 1;

    const answerIndex = askAfter
      ? baseIndex + 1
      : baseIndex - 1;

    const answer = months[answerIndex];

    const distractors = shuffle(
      months.filter(
        (_, index) => index !== answerIndex
      )
    ).slice(0, 2);

    neighborQuestion.textContent = askAfter
      ? `Welcher Monat kommt nach ${months[baseIndex].name}?`
      : `Welcher Monat kommt vor ${months[baseIndex].name}?`;

    neighborOptions.innerHTML = "";
    neighborFeedback.textContent = "";
    neighborFeedback.className = "feedback";
    nextNeighbor.hidden = true;

    shuffle([answer, ...distractors])
      .forEach((month) => {
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

              neighborFeedback.textContent =
                `Richtig! ${answer.name}.`;

              neighborFeedback.className =
                "feedback success";

              playAudio(
                `${AUDIO_PATH}${answer.file}.mp3`
              );

              if (neighborRound >= 3) {
                completeStep("3");
              }
            } else {
              button.classList.add("wrong");

              highlightCorrect(
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
  }

  if (nextNeighbor) {
    nextNeighbor.addEventListener(
      "click",
      newNeighborQuestion
    );
  }

  newNeighborQuestion();

  let missingRound = 0;

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

  function newMissingQuestion() {
    if (
      !missingSequence ||
      !missingOptions ||
      !missingFeedback ||
      !nextMissing
    ) {
      return;
    }

    missingRound += 1;

    const start =
      Math.floor(Math.random() * 9);

    const missingOffset =
      Math.floor(Math.random() * 4);

    const sequence =
      months.slice(start, start + 4);

    const answer =
      sequence[missingOffset];

    missingSequence.innerHTML = "";

    sequence.forEach((month, index) => {
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
    });

    missingOptions.innerHTML = "";
    missingFeedback.textContent = "";
    missingFeedback.className = "feedback";
    nextMissing.hidden = true;

    const distractors = shuffle(
      months.filter(
        (month) =>
          !sequence.includes(month)
      )
    ).slice(0, 2);

    shuffle([answer, ...distractors])
      .forEach((month) => {
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

              missingFeedback.textContent =
                `Richtig! ${answer.name} fehlt.`;

              missingFeedback.className =
                "feedback success";

              playAudio(
                `${AUDIO_PATH}${answer.file}.mp3`
              );

              if (missingRound >= 3) {
                completeStep("4");
              }
            } else {
              button.classList.add("wrong");

              highlightCorrect(
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
  }

  if (nextMissing) {
    nextMissing.addEventListener(
      "click",
      newMissingQuestion
    );
  }

  newMissingQuestion();

  let listenAnswer = null;
  let listenRound = 0;

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

  function newListenQuestion() {
    if (
      !listenOptions ||
      !listenFeedback ||
      !nextListen ||
      !listenMonthButton
    ) {
      return;
    }

    listenRound += 1;

    listenAnswer =
      months[
        Math.floor(
          Math.random() * months.length
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
    listenFeedback.className = "feedback";
    nextListen.hidden = true;

    shuffle([
      listenAnswer,
      ...distractors
    ]).forEach((month) => {
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
          listenOptions
            .querySelectorAll("button")
            .forEach((item) => {
              item.disabled = true;
            });

          if (month === listenAnswer) {
            button.classList.add(
              "correct"
            );

            listenFeedback.textContent =
              `Richtig! Du hörst ${listenAnswer.name}.`;

            listenFeedback.className =
              "feedback success";

            if (listenRound >= 3) {
              completeStep("5");
            }
          } else {
            button.classList.add("wrong");

            const correctPicture =
              listenOptions.querySelector(
                `[data-answer="${listenAnswer.name}"]`
              );

            if (correctPicture) {
              correctPicture.classList.add(
                "correct"
              );
            }

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
        newListenQuestion();

        if (listenAnswer) {
          playAudio(
            `${AUDIO_PATH}${listenAnswer.file}.mp3`,
            listenMonthButton
          );
        }
      }
    );
  }

  newListenQuestion();

  const birthdaySelect =
    document.querySelector(
      "#birthday-month"
    );

  const birthdayAnswer =
    document.querySelector(
      "#birthday-answer"
    );

  const birthdayAudio =
    document.querySelector(
      "#birthday-audio"
    );

  if (birthdaySelect) {
    months.forEach((month, index) => {
      birthdaySelect.add(
        new Option(
          month.name,
          String(index)
        )
      );
    });

    birthdaySelect.addEventListener(
      "change",
      () => {
        if (
          birthdaySelect.value === ""
        ) {
          if (birthdayAnswer) {
            birthdayAnswer.textContent =
              "Ich habe im … Geburtstag.";
          }

          if (birthdayAudio) {
            birthdayAudio.disabled = true;
          }

          return;
        }

        const month =
          months[
            Number(
              birthdaySelect.value
            )
          ];

        if (birthdayAnswer) {
          birthdayAnswer.innerHTML = `
            Ich habe im
            <strong>${month.name}</strong>
            Geburtstag.
            <br>
            <span class="translation">
              Ziua mea de naștere este în ${month.ro}.
            </span>
          `;
        }

        if (birthdayAudio) {
          birthdayAudio.disabled = false;
          birthdayAudio.dataset.month =
            month.file;
        }

        completeStep("6");
      }
    );
  }

  if (birthdayAudio) {
    birthdayAudio.addEventListener(
      "click",
      () => {
        if (
          birthdayAudio.dataset.month
        ) {
          playAudio(
            `${AUDIO_PATH}${birthdayAudio.dataset.month}.mp3`,
            birthdayAudio
          );
        }
      }
    );
  }

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

  let quizIndex = 0;
  let quizScore = 0;

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
            lockAnswers(quizOptions);

            if (
              option === question.answer
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

              highlightCorrect(
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

    const showDiploma =
      document.querySelector(
        "#show-diploma"
      );

    const resultIcon =
      document.querySelector(
        "#result-icon"
      );

    if (quizCounter) {
      quizCounter.textContent = "Fertig";
    }

    if (resultScore) {
      resultScore.textContent =
        `${quizScore} von ${quizQuestions.length} Punkten`;
    }

    const perfect =
      quizScore === quizQuestions.length;

    if (resultTitle) {
      resultTitle.textContent = perfect
        ? "Du bist Monate-Meister!"
        : "Gut gemacht!";
    }

    if (resultMessage) {
      resultMessage.textContent = perfect
        ? "Du kennst alle zwölf Monate in der richtigen Reihenfolge."
        : "Wiederhole die Monate und versuche das Quiz noch einmal.";
    }

    if (showDiploma) {
      showDiploma.hidden = !perfect;
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
      completeStep("7");
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

        renderQuiz();
      }
    );
  }

  const diplomaSection =
    document.querySelector(
      "#diploma-section"
    );

  const showDiploma =
    document.querySelector(
      "#show-diploma"
    );

  if (showDiploma) {
    showDiploma.addEventListener(
      "click",
      () => {
        if (!diplomaSection) return;

        diplomaSection.hidden = false;

        diplomaSection.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
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

  renderQuiz();
});
