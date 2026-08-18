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

  /*
   * Transformă diacriticele germane în variantele lor extinse.
   * Astfel, sunt acceptate ambele forme:
   * ä = ae, ö = oe, ü = ue, ß = ss
   */
  const normalize = value => value
    .trim()
    .toLocaleLowerCase("de-DE")
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[.!?]/g, "")
    .replace(/\s+/g, " ");

  const current = () => stages[currentStage];

  function speak(text) {
    if (!soundOn || !window.speechSynthesis) return;

    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "de-DE";
    utterance.rate = 0.86;

    const voices = speechSynthesis.getVoices();
    utterance.voice =
      voices.find(voice => /^de(-|_)/i.test(voice.lang)) || null;

    speechSynthesis.speak(utterance);
  }

  function playFeedback(correct) {
    if (!soundOn) return;

    const audio = correct ? correctAudio : wrongAudio;

    [correctAudio, wrongAudio].forEach(item => {
      item.pause();
      item.currentTime = 0;
    });

    audio.play().catch(() => {
      speak(correct ? "Richtig!" : "Versuch es noch einmal!");
    });
  }

  function feedback(stage, correct, message) {
    const box = stage.querySelector(".feedback");

    if (box) {
      box.textContent = message;
      box.className = `feedback ${correct ? "success" : "error"}`;
    }

    playFeedback(correct);

    if (correct) {
      completeStage(stage);
    }
  }

  function completeStage(stage) {
    stage.dataset.complete = "true";
    nextButton.disabled = false;
    saveProgress();
  }

  function showStage(index) {
    currentStage = Math.max(0, Math.min(index, stages.length - 1));

    stages.forEach((stage, stageIndex) => {
      stage.classList.toggle("active", stageIndex === currentStage);
    });

    const isResult = currentStage === stages.length - 1;
    const taskNumber = Math.min(currentStage + 1, 11);
    const percent = isResult
      ? 100
      : Math.round((currentStage / 11) * 100);

    progressFill.style.width = `${percent}%`;
    progressFill.parentElement.setAttribute(
      "aria-valuenow",
      String(percent)
    );

    progressLabel.textContent = isResult
      ? "Übung abgeschlossen"
      : `Aufgabe ${taskNumber} von 11`;

    progressPercent.textContent = `${percent}%`;

    prevButton.disabled = currentStage === 0 || isResult;
    nextButton.hidden = isResult || currentStage === 10;
    nextButton.disabled = current().dataset.complete !== "true";

    document.querySelector(".progress-card").hidden = isResult;

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  function saveProgress() {
    try {
      localStorage.setItem(
        "kdw-uebungen2-stage",
        String(currentStage)
      );
    } catch (_) {
      // Salvarea locală poate fi blocată de browser.
    }
  }

  /*
   * Pornirea lecției
   */
  document
    .querySelector("#startLesson")
    .addEventListener("click", () => {
      hero.classList.add("hidden");
      lessonArea.classList.remove("hidden");
      showStage(0);
    });

  prevButton.addEventListener("click", () => {
    showStage(currentStage - 1);
  });

  nextButton.addEventListener("click", () => {
    showStage(currentStage + 1);
  });

  /*
   * Activarea și dezactivarea sunetului
   */
  document
    .querySelector("#soundToggle")
    .addEventListener("click", event => {
      soundOn = !soundOn;

      event.currentTarget.textContent = soundOn
        ? "Ton an"
        : "Ton aus";

      event.currentTarget.setAttribute(
        "aria-pressed",
        String(!soundOn)
      );

      if (!soundOn && window.speechSynthesis) {
        speechSynthesis.cancel();
      }
    });

  /*
   * Butoanele generale pentru citirea textelor
   */
  document
    .querySelectorAll(".speak-button")
    .forEach(button => {
      button.addEventListener("click", () => {
        speak(button.dataset.speak);
      });
    });

  /*
   * Exercițiul 1 – completarea dialogului
   */
  document
    .querySelectorAll(".blank")
    .forEach(blank => {
      blank.addEventListener("click", () => {
        document
          .querySelectorAll(".blank")
          .forEach(item => item.classList.remove("active"));

        selectedBlank = blank;
        blank.classList.add("active");
      });
    });

  document
    .querySelectorAll(".word-bank button")
    .forEach(word => {
      word.addEventListener("click", () => {
        if (!selectedBlank) return;

        const oldWordId = selectedBlank.dataset.wordButton;

        if (oldWordId) {
          document
            .querySelector(`[data-word-id="${oldWordId}"]`)
            ?.classList.remove("used");
        }

        if (!word.dataset.wordId) {
          word.dataset.wordId =
            `w-${Math.random().toString(36).slice(2)}`;
        }

        selectedBlank.textContent = word.textContent;
        selectedBlank.dataset.wordButton = word.dataset.wordId;

        word.setAttribute(
          "data-word-id",
          word.dataset.wordId
        );

        word.classList.add("used");
        selectedBlank.classList.remove("active");
        selectedBlank = null;
      });
    });

  /*
   * Exercițiul 2 – ordonarea dialogului
   */
  let selectedOrderItem = null;

  document
    .querySelectorAll("#dialogOrder button")
    .forEach(item => {
      item.addEventListener("click", () => {
        document
          .querySelectorAll("#dialogOrder button")
          .forEach(button => {
            button.classList.remove("selected");
          });

        selectedOrderItem = item;
        item.classList.add("selected");
      });
    });

  document
    .querySelectorAll("[data-move]")
    .forEach(button => {
      button.addEventListener("click", () => {
        if (!selectedOrderItem) return;

        if (
          button.dataset.move === "up" &&
          selectedOrderItem.previousElementSibling
        ) {
          selectedOrderItem.parentElement.insertBefore(
            selectedOrderItem,
            selectedOrderItem.previousElementSibling
          );
        }

        if (
          button.dataset.move === "down" &&
          selectedOrderItem.nextElementSibling
        ) {
          selectedOrderItem.parentElement.insertBefore(
            selectedOrderItem.nextElementSibling,
            selectedOrderItem
          );
        }
      });
    });

  /*
   * Exercițiul 3 – ascultare
   */
  const listeningText =
    "Hallo! Ich heiße Leonie. " +
    "Ich bin acht Jahre alt. " +
    "Meine Lieblingsfarbe ist Rot. " +
    "Mein Geburtstag ist im Mai.";

  document
    .querySelector("#listeningPlay")
    .addEventListener("click", event => {
      if (listenPlays >= 2) return;

      listenPlays += 1;

      document.querySelector("#listenCount").textContent =
        `${listenPlays}/2`;

      speak(listeningText);

      if (listenPlays === 2) {
        event.currentTarget.disabled = true;
      }
    });

  /*
   * Exercițiul 7 – construirea propozițiilor
   */
  const sentenceData = [
    [
      "Ich heiße Anna",
      ["heiße", "Anna", "Ich"]
    ],
    [
      "Heute ist Freitag",
      ["Freitag", "Heute", "ist"]
    ],
    [
      "Mein Geburtstag ist im Juni",
      ["Juni", "Geburtstag", "im", "Mein", "ist"]
    ],
    [
      "Meine Lieblingsfarbe ist Grün",
      ["Grün", "ist", "Meine", "Lieblingsfarbe"]
    ],
    [
      "Im Winter ist es kalt",
      ["kalt", "Winter", "Im", "es", "ist"]
    ],
    [
      "Ich bin zehn Jahre alt",
      ["Jahre", "alt", "zehn", "Ich", "bin"]
    ]
  ];

  function renderSentences() {
    const host = document.querySelector(
      "#sentenceBuilders"
    );

    host.innerHTML = "";

    sentenceData.forEach(([answer, words], index) => {
      const box = document.createElement("div");

      box.className = "sentence-builder";
      box.dataset.answer = answer;

      box.innerHTML = `
        <div
          class="answer-line"
          aria-label="Satz ${index + 1}">
        </div>

        <div class="tokens"></div>
      `;

      words.forEach(word => {
        const button = document.createElement("button");

        button.type = "button";
        button.textContent = word;

        button.addEventListener("click", () => {
          const answerLine =
            box.querySelector(".answer-line");

          answerLine.textContent +=
            `${answerLine.textContent ? " " : ""}${word}`;

          button.classList.add("used");
        });

        box.querySelector(".tokens").append(button);
      });

      host.append(box);
    });
  }

  renderSentences();

  document
    .querySelector("#resetSentences")
    .addEventListener("click", renderSentences);

  /*
   * Exercițiul 8 – alegerea propoziției potrivite
   */
  document
    .querySelectorAll(".scene-options button")
    .forEach(button => {
      button.addEventListener("click", () => {
        button.parentElement
          .querySelectorAll("button")
          .forEach(item => {
            item.classList.remove("selected");
          });

        button.classList.add("selected");
      });
    });

  /*
   * Exercițiul 10 – construirea dialogului
   */
  const selects = [
    ...document.querySelectorAll(
      "#dialogBuilder select"
    )
  ];

  function updateDialogPreview() {
    const selectedLines = selects
      .map(select => select.value)
      .filter(Boolean);

    document.querySelector(
      "#dialogPreview"
    ).textContent =
      selectedLines.join("\n") ||
      "Dein Dialog erscheint hier.";
  }

  selects.forEach(select => {
    select.addEventListener(
      "change",
      updateDialogPreview
    );
  });

  document
    .querySelector("#playBuiltDialog")
    .addEventListener("click", () => {
      const dialogText = selects
        .map(select => select.value)
        .filter(Boolean)
        .join(" ");

      speak(dialogText);
    });

  /*
   * Verificarea grupurilor radio
   */
  function checkRadioGroup(stage) {
    const fieldsets = [
      ...stage.querySelectorAll(
        "fieldset[data-correct]"
      )
    ];

    return (
      fieldsets.length > 0 &&
      fieldsets.every(fieldset => {
        const selected =
          fieldset.querySelector("input:checked");

        return (
          selected?.value ===
          fieldset.dataset.correct
        );
      })
    );
  }

  /*
   * Verificarea exercițiilor
   */
  document
    .querySelectorAll("[data-check]")
    .forEach(button => {
      button.addEventListener("click", () => {
        const stage = button.closest(".stage");
        let correct = false;

        switch (button.dataset.check) {
          case "fill":
            correct = [
              ...stage.querySelectorAll(".blank")
            ].every(blank => {
              return (
                normalize(blank.textContent) ===
                normalize(blank.dataset.answer)
              );
            });
            break;

          case "order": {
            const list =
              stage.querySelector(".sortable-list");

            const currentOrder = [
              ...list.children
            ]
              .map(item => item.textContent.trim())
              .join("|");

            correct =
              normalize(currentOrder) ===
              normalize(list.dataset.answer);
            break;
          }

          case "listening":
            if (listenPlays === 0) {
              feedback(
                stage,
                false,
                "Hör zuerst den Text an."
              );
              return;
            }

            correct = checkRadioGroup(stage);
            break;

          case "radios":
            correct = checkRadioGroup(stage);
            break;

          case "inputs":
            correct = [
              ...stage.querySelectorAll(
                "input[data-answer]"
              )
            ].every(input => {
              const acceptedAnswers =
                input.dataset.answer.split("|");

              return acceptedAnswers.some(answer => {
                return (
                  normalize(input.value) ===
                  normalize(answer)
                );
              });
            });
            break;

          case "sentences":
            correct = [
              ...stage.querySelectorAll(
                ".sentence-builder"
              )
            ].every(box => {
              const builtSentence =
                box.querySelector(
                  ".answer-line"
                ).textContent;

              return (
                normalize(builtSentence) ===
                normalize(box.dataset.answer)
              );
            });
            break;

          case "choice": {
            const options =
              stage.querySelector(".scene-options");

            const selected =
              options.querySelector(".selected");

            correct =
              selected?.dataset.value ===
              options.dataset.correct;
            break;
          }

          case "personal":
            correct = [
              ...stage.querySelectorAll(
                "input[data-prefix]"
              )
            ].every(input => {
              const answer =
                normalize(input.value);

              const requiredPrefix =
                normalize(input.dataset.prefix);

              const requiredContent =
                input.dataset.contains
                  ? normalize(
                      input.dataset.contains
                    )
                  : "";

              const hasPrefix =
                answer.startsWith(
                  requiredPrefix
                );

              const hasRequiredContent =
                !requiredContent ||
                answer.includes(
                  requiredContent
                );

              const hasPersonalAnswer =
                answer.length >
                requiredPrefix.length + 1;

              return (
                hasPrefix &&
                hasRequiredContent &&
                hasPersonalAnswer
              );
            });
            break;

          case "dialog-builder": {
            const correctDialog = [
              "Guten Tag!",
              "Ich heiße Mia. Wie heißt du?",
              "Ich bin zehn Jahre alt.",
              "Meine Lieblingsfarbe ist Blau.",
              "Tschüss! Bis bald!"
            ];

            correct = selects.every(
              (select, index) => {
                return (
                  select.value ===
                  correctDialog[index]
                );
              }
            );
            break;
          }
        }

        feedback(
          stage,
          correct,
          correct
            ? "Richtig! Super gemacht!"
            : "Noch nicht ganz. Schau genau hin und versuch es noch einmal."
        );
      });
    });

  /*
   * Quizul final
   */
  const quizData = [
    {
      q: "Wie stellst du dich vor?",
      options: [
        "Ich heiße Mia.",
        "Ich bin Montag.",
        "Ich heiße acht Jahre alt."
      ],
      answer: 0
    },
    {
      q: "Welche Begrüßung passt am Morgen?",
      options: [
        "Gute Nacht!",
        "Guten Morgen!",
        "Tschüss!"
      ],
      answer: 1
    },
    {
      q: "Welches Wort beginnt mit B?",
      options: [
        "Apfel",
        "Ball",
        "Sonne"
      ],
      answer: 1
    },
    {
      q: "Welcher Tag kommt nach Freitag?",
      options: [
        "Samstag",
        "Montag",
        "Donnerstag"
      ],
      answer: 0
    },
    {
      q: "Welcher Monat kommt nach September?",
      options: [
        "August",
        "November",
        "Oktober"
      ],
      answer: 2
    },
    {
      q: "In welcher Jahreszeit ist es oft sehr warm?",
      options: [
        "Winter",
        "Sommer",
        "Herbst"
      ],
      answer: 1
    },
    {
      q: "Was ist zwölf plus drei?",
      options: [
        "fünfzehn",
        "dreizehn",
        "zwanzig"
      ],
      answer: 0
    },
    {
      q: "Welche Farbe hat die Sonne oft auf Kinderbildern?",
      options: [
        "Gelb",
        "Blau",
        "Schwarz"
      ],
      answer: 0
    }
  ];

  const quizBox =
    document.querySelector("#quizBox");

  quizData.forEach((item, index) => {
    const box = document.createElement("div");

    box.className = "quiz-question";

    box.innerHTML = `
      <h3>${index + 1}. ${item.q}</h3>
    `;

    item.options.forEach(
      (option, optionIndex) => {
        const label =
          document.createElement("label");

        label.innerHTML = `
          <input
            type="radio"
            name="q${index}"
            value="${optionIndex}">
          ${option}
        `;

        box.append(label);
      }
    );

    quizBox.append(box);
  });

  document
    .querySelector("#checkQuiz")
    .addEventListener("click", () => {
      const chosen = quizData.map(
        (_, index) => {
          return document.querySelector(
            `input[name="q${index}"]:checked`
          );
        }
      );

      if (chosen.some(item => !item)) {
        feedback(
          stages[10],
          false,
          "Beantworte zuerst alle acht Fragen."
        );
        return;
      }

      quizScore = chosen.reduce(
        (score, input, index) => {
          const isCorrect =
            Number(input.value) ===
            quizData[index].answer;

          return score + (isCorrect ? 1 : 0);
        },
        0
      );

      stages[10].dataset.complete = "true";

      playFeedback(quizScore >= 6);
      showResults();
    });

  /*
   * Afișarea rezultatului
   */
  function showResults() {
    let title;
    let text;

    if (quizScore === 8) {
      title =
        "Ausgezeichnet! Du bist ein Starter-Profi!";

      text =
        "Du hast alle Aufgaben richtig gelöst.";
    } else if (quizScore >= 6) {
      title =
        "Sehr gut! Fast alles richtig!";

      text =
        "Felix ist stolz auf dich.";
    } else if (quizScore >= 4) {
      title =
        "Gut gemacht!";

      text =
        "Übe noch ein bisschen und versuche es wieder.";
    } else {
      title =
        "Versuch es noch einmal!";

      text =
        "Felix hilft dir beim nächsten Versuch.";
    }

    document.querySelector(
      "#resultTitle"
    ).textContent = title;

    document.querySelector(
      "#resultText"
    ).textContent = text;

    document.querySelector(
      "#scoreRing"
    ).textContent = `${quizScore}/8`;

    showStage(11);
  }

  /*
   * Reluarea exercițiilor
   */
  document
    .querySelector("#restartLesson")
    .addEventListener("click", () => {
      try {
        localStorage.removeItem(
          "kdw-uebungen2-stage"
        );
      } catch (_) {
        // Salvarea locală poate fi blocată.
      }

      location.reload();
    });
});
