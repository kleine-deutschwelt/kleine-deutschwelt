"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const AUDIO_PATH = "../audio/begruessung/";

  const audio = document.getElementById("lessonAudio");
  const soundToggle = document.getElementById("soundToggle");
  const toast = document.getElementById("toast");

  const completedSteps = new Set(
    JSON.parse(
      localStorage.getItem("begruessungSteps") || "[]"
    )
  );

  let activeAudioButton = null;
  let currentAudioFile = "";
  let audioQueue = [];
  let muted = false;
  let currentStage = 0;

  const totalStages = 8;

  const stageNames = [
    "Start",
    "Hören",
    "Zuordnen",
    "Hallo & Tschüss",
    "Hören & Wählen",
    "Dialoge",
    "Lied",
    "Quiz",
    "Abschluss"
  ];

  /* AFIȘAREA ETAPELOR */

  const showStage = (stage) => {
    currentStage = Math.max(
      0,
      Math.min(totalStages, stage)
    );

    document
      .querySelectorAll(".lesson-stage")
      .forEach((panel) => {
        const active =
          Number(panel.dataset.stage) ===
          currentStage;

        panel.classList.toggle(
          "active",
          active
        );

        panel.setAttribute(
          "aria-hidden",
          String(!active)
        );
      });

    document
      .querySelectorAll(".stage-dots i")
      .forEach((dot, index) => {
        dot.classList.toggle(
          "current",
          index === currentStage
        );

        dot.classList.toggle(
          "visited",
          index < currentStage
        );
      });

    document.getElementById(
      "stageLabel"
    ).textContent =
      stageNames[currentStage];

    updateProgress();

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  /* MESAJ TEMPORAR */

  const showToast = (message) => {
    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(showToast.timer);

    showToast.timer = setTimeout(() => {
      toast.classList.remove("show");
    }, 2200);
  };

  /* EVIDENȚIEREA VERSURILOR */

  const clearLyrics = () => {
    document
      .querySelectorAll(".lyric-line")
      .forEach((line) => {
        line.classList.remove("active");
      });
  };

  /* REDAREA UNUI FIȘIER AUDIO */

  const playFile = (
    file,
    button = null,
    keepQueue = false
  ) => {
    if (muted) {
      showToast(
        "Der Ton ist ausgeschaltet."
      );

      return;
    }

    if (!file) {
      return;
    }

    if (!keepQueue) {
      audioQueue = [];
    }

    if (
      file !== "begruessung-lied.mp3"
    ) {
      clearLyrics();
    }

    if (activeAudioButton) {
      activeAudioButton.classList.remove(
        "playing"
      );
    }

    activeAudioButton = button;
    currentAudioFile = file;

    if (button) {
      button.classList.add("playing");
    }

    audio.src = AUDIO_PATH + file;
    audio.currentTime = 0;

    audio.play().catch(() => {
      if (button) {
        button.classList.remove(
          "playing"
        );
      }

      showToast(
        "Audio konnte nicht geladen werden."
      );
    });
  };

  /* REDAREA MAI MULTOR FIȘIERE AUDIO */

  const playSequence = (
    files,
    button
  ) => {
    audioQueue = files.slice(1);

    playFile(
      files[0],
      button,
      true
    );
  };

  /* DUPĂ TERMINAREA UNUI AUDIO */

  audio.addEventListener(
    "ended",
    () => {
      if (audioQueue.length) {
        playFile(
          audioQueue.shift(),
          activeAudioButton,
          true
        );

        return;
      }

      if (activeAudioButton) {
        activeAudioButton.classList.remove(
          "playing"
        );
      }

      activeAudioButton = null;
      currentAudioFile = "";

      clearLyrics();
    }
  );

  /* SINCRONIZAREA VERSURILOR */

  audio.addEventListener(
    "timeupdate",
    () => {
      if (
        currentAudioFile !==
          "begruessung-lied.mp3" ||
        !audio.duration
      ) {
        return;
      }

      const lines = [
        ...document.querySelectorAll(
          ".lyric-line"
        )
      ];

      const segment = Math.min(
        7,
        Math.floor(
          audio.currentTime /
            (audio.duration / 8)
        )
      );

      lines.forEach(
        (line, index) => {
          line.classList.toggle(
            "active",
            index === segment % 4
          );
        }
      );
    }
  );

  /* BUTOANELE AUDIO */

  document.addEventListener(
    "click",
    (event) => {
      const button =
        event.target.closest(
          ".audio-trigger"
        );

      if (!button) {
        return;
      }

      if (
        button.dataset.audioSequence
      ) {
        playSequence(
          button.dataset.audioSequence.split(
            ","
          ),
          button
        );
      } else {
        playFile(
          button.dataset.audio,
          button
        );
      }
    }
  );

  /* PORNIREA ȘI OPRIREA SUNETULUI */

  soundToggle.addEventListener(
    "click",
    () => {
      muted = !muted;
      audio.muted = muted;

      if (muted) {
        audio.pause();
      }

      soundToggle.textContent =
        muted ? "🔇" : "🔊";

      soundToggle.setAttribute(
        "aria-pressed",
        String(muted)
      );

      soundToggle.setAttribute(
        "aria-label",
        muted
          ? "Ton einschalten"
          : "Ton ausschalten"
      );
    }
  );

  /* SALVAREA PROGRESULUI */

  const markComplete = (step) => {
    completedSteps.add(
      String(step)
    );

    localStorage.setItem(
      "begruessungSteps",
      JSON.stringify(
        [...completedSteps]
      )
    );

    updateProgress();
  };

  const updateProgress = () => {
    const percent = Math.round(
      (currentStage / totalStages) *
        100
    );

    document.getElementById(
      "progressText"
    ).textContent =
      percent + " %";

    document.getElementById(
      "progressBar"
    ).style.width =
      percent + "%";

    document
      .querySelectorAll(
        "[data-complete]"
      )
      .forEach((button) => {
        if (
          completedSteps.has(
            button.dataset.complete
          )
        ) {
          button.classList.add(
            "completed"
          );

          button.textContent =
            "✓ Geschafft!";
        }
      });
  };

  /* NAVIGAREA ÎNTRE ETAPE */

  document
    .querySelectorAll(".stage-next")
    .forEach((button) => {
      button.addEventListener(
        "click",
        () => {
          showStage(
            currentStage + 1
          );
        }
      );
    });

  document
    .querySelectorAll(".stage-prev")
    .forEach((button) => {
      button.addEventListener(
        "click",
        () => {
          showStage(
            currentStage - 1
          );
        }
      );
    });

  /* BUTOANELE DE FINALIZARE */

  document
    .querySelectorAll(
      "[data-complete]"
    )
    .forEach((button) => {
      button.addEventListener(
        "click",
        () => {
          markComplete(
            button.dataset.complete
          );

          button.classList.add(
            "completed"
          );

          button.textContent =
            "✓ Geschafft!";

          playFile(
            "success.mp3",
            button
          );
        }
      );
    });

  /* ACTIVITATEA 2: ASOCIERE */

  document
    .getElementById("checkMatches")
    .addEventListener(
      "click",
      () => {
        const cards = [
          ...document.querySelectorAll(
            ".match-card"
          )
        ];

        let correct = 0;

        cards.forEach((card) => {
          const select =
            card.querySelector(
              "select"
            );

          const state =
            card.querySelector(
              ".answer-state"
            );

          const ok =
            select.value ===
            card.dataset.answer;

          card.classList.toggle(
            "correct",
            ok
          );

          card.classList.toggle(
            "wrong",
            !ok
          );

          state.textContent = ok
            ? "✓ Richtig!"
            : select.value
              ? "Noch einmal!"
              : "Bitte wählen.";

          if (ok) {
            correct++;
          }
        });

        const result =
          document.getElementById(
            "matchResult"
          );

        result.textContent =
          correct === 4
            ? "Super! Alles ist richtig."
            : `${correct} von 4 richtig.`;

        result.className =
          "result-message " +
          (
            correct === 4
              ? "good"
              : "bad"
          );

        playFile(
          correct === 4
            ? "correct.mp3"
            : "try-again.mp3"
        );

        if (correct === 4) {
          markComplete(2);
        }
      }
    );

  /* ACTIVITATEA 3: HALLO SAU TSCHÜSS */

  document
    .querySelectorAll(
      "#quickChoice button"
    )
    .forEach((button) => {
      button.addEventListener(
        "click",
        () => {
          const ok =
            button.dataset.choice ===
            "Hallo!";

          const feedback =
            document.getElementById(
              "quickFeedback"
            );

          feedback.textContent = ok
            ? "✓ Richtig! Sie sagen: Hallo!"
            : "Noch einmal. Sie treffen sich.";

          feedback.style.color = ok
            ? "#297943"
            : "#b83e31";

          if (!ok) {
            playFile(
              "try-again.mp3"
            );
          }

          if (ok) {
            markComplete(3);
          }
        }
      );
    });

  /* ACTIVITATEA 4: ASCULTĂ ȘI ALEGE */

  const listeningItems = [
    {
      text: "Guten Morgen!",
      audio: "guten-morgen.mp3"
    },
    {
      text: "Guten Tag!",
      audio: "guten-tag.mp3"
    },
    {
      text: "Guten Abend!",
      audio: "guten-abend.mp3"
    },
    {
      text: "Gute Nacht!",
      audio: "gute-nacht.mp3"
    }
  ];

  let listeningOrder = [
    ...listeningItems
  ].sort(
    () => Math.random() - 0.5
  );

  let listeningIndex = 0;
  let listeningScore = 0;
  let listeningAnswered = false;

  const renderListening = () => {
    listeningAnswered = false;

    document.getElementById(
      "listeningRound"
    ).textContent =
      `${listeningIndex + 1} / 4`;

    document.getElementById(
      "listeningScore"
    ).textContent =
      `${listeningScore} ⭐`;

    document.getElementById(
      "listeningFeedback"
    ).textContent = "";

    document.getElementById(
      "nextListening"
    ).classList.add("hidden");

    const options =
      document.getElementById(
        "listeningOptions"
      );

    options.innerHTML = "";

    [...listeningItems]
      .sort(
        () =>
          Math.random() - 0.5
      )
      .forEach((item) => {
        const button =
          document.createElement(
            "button"
          );

        button.type = "button";
        button.textContent =
          item.text;

        button.addEventListener(
          "click",
          () => {
            answerListening(
              item.text,
              button
            );
          }
        );

        options.appendChild(
          button
        );
      });
  };

  const answerListening = (
    answer,
    button
  ) => {
    if (listeningAnswered) {
      return;
    }

    listeningAnswered = true;

    const current =
      listeningOrder[
        listeningIndex
      ];

    const ok =
      answer === current.text;

    if (ok) {
      listeningScore++;
    }

    button.classList.add(
      ok ? "correct" : "wrong"
    );

    document
      .querySelectorAll(
        "#listeningOptions button"
      )
      .forEach((option) => {
        option.disabled = true;

        if (
          option.textContent ===
          current.text
        ) {
          option.classList.add(
            "correct"
          );
        }
      });

    const feedback =
      document.getElementById(
        "listeningFeedback"
      );

    feedback.textContent = ok
      ? "Richtig! Sehr gut!"
      : `Das war: ${current.text}`;

    feedback.className =
      "result-message " +
      (ok ? "good" : "bad");

    if (!ok) {
      playFile(
        "try-again.mp3"
      );
    }

    document.getElementById(
      "listeningScore"
    ).textContent =
      `${listeningScore} ⭐`;

    const next =
      document.getElementById(
        "nextListening"
      );

    next.textContent =
      listeningIndex === 3
        ? "Ergebnis zeigen"
        : "Weiter →";

    next.classList.remove(
      "hidden"
    );
  };

  document
    .getElementById(
      "playListening"
    )
    .addEventListener(
      "click",
      (event) => {
        playFile(
          listeningOrder[
            listeningIndex
          ].audio,
          event.currentTarget
        );
      }
    );

  document
    .getElementById(
      "nextListening"
    )
    .addEventListener(
      "click",
      () => {
        if (
          listeningIndex < 3
        ) {
          listeningIndex++;
          renderListening();
        } else {
          document.getElementById(
            "listeningFeedback"
          ).textContent =
            `Geschafft: ${listeningScore} von 4 richtig!`;

          document.getElementById(
            "nextListening"
          ).classList.add(
            "hidden"
          );

          markComplete(4);

          playFile(
            "success.mp3"
          );
        }
      }
    );

  /* ACTIVITATEA 5: MINI-DIALOGURI */

  const dialogs = {
    meeting: {
      image: "hallo.webp",
      alt:
        "Zwei Kinder begrüßen sich",
      speakers: [
        "Mia",
        "Jonas"
      ],
      lines: [
        "Hallo, Jonas!",
        "Hallo, Mia!"
      ],
      translations: [
        "Salut, Jonas!",
        "Salut, Mia!"
      ],
      audio:
        "dialog-hallo.mp3"
    },

    bye: {
      image: "tschuess.webp",
      alt:
        "Zwei Kinder verabschieden sich",
      speakers: [
        "Mia",
        "Jonas"
      ],
      lines: [
        "Tschüss, Jonas!",
        "Tschüss, Mia!"
      ],
      translations: [
        "Pa, Jonas!",
        "Pa, Mia!"
      ],
      audio:
        "dialog-tschuess.mp3"
    },

    formal: {
      image: "guten-tag.webp",
      alt:
        "Ein Kind verabschiedet sich von einer Lehrerin",
      speakers: [
        "Lehrerin",
        "Kind"
      ],
      lines: [
        "Auf Wiedersehen!",
        "Auf Wiedersehen, Frau Müller!"
      ],
      translations: [
        "La revedere!",
        "La revedere, doamna Müller!"
      ],
      audio:
        "dialog-auf-wiedersehen.mp3"
    }
  };

  document
    .querySelectorAll(
      ".dialog-tabs button"
    )
    .forEach((tab) => {
      tab.addEventListener(
        "click",
        () => {
          document
            .querySelectorAll(
              ".dialog-tabs button"
            )
            .forEach((item) => {
              item.classList.toggle(
                "active",
                item === tab
              );

              item.setAttribute(
                "aria-selected",
                String(
                  item === tab
                )
              );
            });

          const selected =
            dialogs[
              tab.dataset.dialog
            ];

          const image =
            document.getElementById(
              "dialogImage"
            );

          image.src =
            "../assets/images/lessons/" +
            "begruessung/" +
            selected.image;

          image.alt =
            selected.alt;

          document.getElementById(
            "speakerOne"
          ).textContent =
            selected.speakers[0];

          document.getElementById(
            "speakerTwo"
          ).textContent =
            selected.speakers[1];

          document.getElementById(
            "dialogLineOne"
          ).textContent =
            selected.lines[0];

          document.getElementById(
            "dialogLineTwo"
          ).textContent =
            selected.lines[1];

          document.getElementById(
            "dialogTranslationOne"
          ).textContent =
            selected.translations[0];

          document.getElementById(
            "dialogTranslationTwo"
          ).textContent =
            selected.translations[1];

          document.getElementById(
            "dialogAudio"
          ).dataset.audio =
            selected.audio;
        }
      );
    });

  /* MINI-QUIZ */

  const quizQuestions = [
    {
      visual: "🌅",
      question:
        "Es ist Morgen. Was sagst du?",
      translation:
        "Este dimineață. Ce spui?",
      options: [
        "Gute Nacht!",
        "Guten Morgen!",
        "Guten Abend!"
      ],
      answer:
        "Guten Morgen!"
    },

    {
      visual: "👋",
      question:
        "Du triffst einen Freund. Was sagst du?",
      translation:
        "Te întâlnești cu un prieten. Ce spui?",
      options: [
        "Hallo!",
        "Tschüss!",
        "Gute Nacht!"
      ],
      answer:
        "Hallo!"
    },

    {
      visual: "🌙",
      question:
        "Du gehst schlafen. Was sagst du?",
      translation:
        "Mergi la culcare. Ce spui?",
      options: [
        "Guten Tag!",
        "Guten Morgen!",
        "Gute Nacht!"
      ],
      answer:
        "Gute Nacht!"
    },

    {
      visual: "🎒",
      question:
        "Du gehst nach Hause. Was sagst du zu deinem Freund?",
      translation:
        "Pleci acasă. Ce îi spui prietenului tău?",
      options: [
        "Tschüss!",
        "Hallo!",
        "Guten Morgen!"
      ],
      answer:
        "Tschüss!"
    },

    {
      visual: "👩‍🏫",
      question:
        "Du verabschiedest dich höflich von der Lehrerin.",
      translation:
        "Îți iei rămas-bun politicos de la profesoară.",
      options: [
        "Hallo!",
        "Auf Wiedersehen!",
        "Gute Nacht!"
      ],
      answer:
        "Auf Wiedersehen!"
    }
  ];

  let quizIndex = 0;
  let quizScore = 0;
  let quizAnswered = false;

  const renderQuiz = () => {
    quizAnswered = false;

    const item =
      quizQuestions[quizIndex];

    document.getElementById(
      "quizCounter"
    ).textContent =
      `Frage ${quizIndex + 1} von 5`;

    document.getElementById(
      "quizScore"
    ).textContent =
      `${quizScore} Punkte`;

    document.getElementById(
      "quizProgress"
    ).style.width =
      `${(quizIndex + 1) * 20}%`;

    document.getElementById(
      "quizVisual"
    ).textContent =
      item.visual;

    document.getElementById(
      "quizQuestion"
    ).textContent =
      item.question;

    document.getElementById(
      "quizTranslation"
    ).textContent =
      item.translation;

    document.getElementById(
      "quizFeedback"
    ).textContent = "";

    document.getElementById(
      "nextQuiz"
    ).classList.add(
      "hidden"
    );

    const options =
      document.getElementById(
        "quizOptions"
      );

    options.innerHTML = "";

    item.options.forEach(
      (option) => {
        const button =
          document.createElement(
            "button"
          );

        button.type = "button";
        button.textContent =
          option;

        button.addEventListener(
          "click",
          () => {
            answerQuiz(
              option,
              button
            );
          }
        );

        options.appendChild(
          button
        );
      }
    );
  };

  const answerQuiz = (
    answer,
    button
  ) => {
    if (quizAnswered) {
      return;
    }

    quizAnswered = true;

    const correctAnswer =
      quizQuestions[
        quizIndex
      ].answer;

    const ok =
      answer ===
      correctAnswer;

    if (ok) {
      quizScore++;
    }

    button.classList.add(
      ok ? "correct" : "wrong"
    );

    document
      .querySelectorAll(
        "#quizOptions button"
      )
      .forEach((option) => {
        option.disabled = true;

        if (
          option.textContent ===
          correctAnswer
        ) {
          option.classList.add(
            "correct"
          );
        }
      });

    const feedback =
      document.getElementById(
        "quizFeedback"
      );

    feedback.textContent = ok
      ? "Richtig! Super!"
      : `Richtig ist: ${correctAnswer}`;

    feedback.className =
      "result-message " +
      (ok ? "good" : "bad");

    if (!ok) {
      playFile(
        "try-again.mp3"
      );
    }

    document.getElementById(
      "quizScore"
    ).textContent =
      `${quizScore} Punkte`;

    const next =
      document.getElementById(
        "nextQuiz"
      );

    next.textContent =
      quizIndex === 4
        ? "Ergebnis"
        : "Nächste Frage →";

    next.classList.remove(
      "hidden"
    );
  };

  const finishQuiz = () => {
    document.getElementById(
      "quizBox"
    ).classList.add(
      "hidden"
    );

    document.getElementById(
      "quizFinish"
    ).classList.remove(
      "hidden"
    );

    document.getElementById(
      "finishTitle"
    ).textContent =
      quizScore === 5
        ? "Perfekt!"
        : quizScore >= 3
          ? "Sehr gut!"
          : "Gut versucht!";

    document.getElementById(
      "finishText"
    ).textContent =
      quizScore === 5
        ? "Du bist ein Begrüßungs-Profi!"
        : "Übe noch einmal und sammle alle Sterne.";

    document.getElementById(
      "finishScore"
    ).textContent =
      `${quizScore} / 5 ${
        "⭐".repeat(quizScore)
      }`;

    if (quizScore === 5) {
      markComplete(7);

      localStorage.setItem(
        "begruessungBestScore",
        "5"
      );

      playFile(
        "success.mp3"
      );
    }
  };

  document
    .getElementById(
      "nextQuiz"
    )
    .addEventListener(
      "click",
      () => {
        if (quizIndex < 4) {
          quizIndex++;
          renderQuiz();
        } else {
          finishQuiz();
        }
      }
    );

  document
    .getElementById(
      "restartQuiz"
    )
    .addEventListener(
      "click",
      () => {
        quizIndex = 0;
        quizScore = 0;

        document.getElementById(
          "quizFinish"
        ).classList.add(
          "hidden"
        );

        document.getElementById(
          "quizBox"
        ).classList.remove(
          "hidden"
        );

        renderQuiz();
      }
    );

  /* INIȚIALIZAREA LECȚIEI */

  showStage(0);
  renderListening();
  renderQuiz();
});
