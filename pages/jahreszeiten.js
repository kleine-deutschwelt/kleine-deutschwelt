"use strict";

const IMAGE = "../assets/images/lessons/jahreszeiten/";
const AUDIO = "../audio/jahreszeiten/";
const ICON = "../assets/icons/monate/";

const seasons = {
  fruehling:{name:"der Frühling",ro:"primăvara",image:"fruehling.webp",icon:"fruehling.svg",months:["März","April","Mai"],sentence:"Im Frühling blühen die Blumen.",translation:"Primăvara înfloresc florile.",audio:"fruehling.mp3",sentenceAudio:"fruehling-satz.mp3"},
  sommer:{name:"der Sommer",ro:"vara",image:"sommer.webp",icon:"sommer.svg",months:["Juni","Juli","August"],sentence:"Im Sommer ist es warm.",translation:"Vara este cald.",audio:"sommer.mp3",sentenceAudio:"sommer-satz.mp3"},
  herbst:{name:"der Herbst",ro:"toamna",image:"herbst.webp",icon:"herbst.svg",months:["September","Oktober","November"],sentence:"Im Herbst fallen die Blätter.",translation:"Toamna cad frunzele.",audio:"herbst.mp3",sentenceAudio:"herbst-satz.mp3"},
  winter:{name:"der Winter",ro:"iarna",image:"winter.webp",icon:"winter.svg",months:["Dezember","Januar","Februar"],sentence:"Im Winter ist es kalt und es schneit.",translation:"Iarna este frig și ninge.",audio:"winter.mp3",sentenceAudio:"winter-satz.mp3"}
};

const ordinals = [
  ["Januar","erste"],["Februar","zweite"],["März","dritte"],["April","vierte"],
  ["Mai","fünfte"],["Juni","sechste"],["Juli","siebte"],["August","achte"],
  ["September","neunte"],["Oktober","zehnte"],["November","elfte"],["Dezember","zwölfte"]
];

const objects = [
  ["objekt-regenschirm.webp","der Regenschirm","fruehling"],["objekt-gummistiefel.webp","die Gummistiefel","fruehling"],
  ["objekt-tulpen.webp","die Tulpen","fruehling"],["objekt-vogel.webp","der Vogel","fruehling"],
  ["objekt-sonnenbrille.webp","die Sonnenbrille","sommer"],["objekt-eis.webp","das Eis","sommer"],
  ["objekt-badeanzug.webp","der Badeanzug","sommer"],["objekt-kirschen.webp","die Kirschen","sommer"],
  ["objekt-blatt.webp","das Blatt","herbst"],["objekt-drachen.webp","der Drachen","herbst"],
  ["objekt-kuerbis.webp","der Kürbis","herbst"],["objekt-regenkleidung.webp","die Regenjacke","herbst"],
  ["objekt-muetze.webp","die Mütze","winter"],["objekt-handschuhe.webp","die Handschuhe","winter"],
  ["objekt-schlitten.webp","der Schlitten","winter"],["objekt-schneemann.webp","der Schneemann","winter"]
];

const quizQuestions = [
  {q:"Wie viele Jahreszeiten hat ein Jahr?",a:["zwei","vier","zwölf"],correct:1},
  {q:"Welche Monate gehören zum Frühling?",a:["März, April, Mai","Juni, Juli, August","Dezember, Januar, Februar"],correct:0},
  {q:"Welche Jahreszeit kommt nach dem Sommer?",a:["der Winter","der Herbst","der Frühling"],correct:1},
  {q:"In welcher Jahreszeit schneit es?",a:["im Sommer","im Frühling","im Winter"],correct:2},
  {q:"Der wievielte Monat ist März?",a:["der zweite","der dritte","der vierte"],correct:1},
  {q:"August ist …",a:["der achte Monat","der neunte Monat","der elfte Monat"],correct:0},
  {q:"Welche Monate gehören zum Herbst?",a:["April, Mai, Juni","September, Oktober, November","Januar, Februar, März"],correct:1},
  {q:"Was passt zum Sommer?",a:["der Schlitten","die Sonnenbrille","die Mütze"],correct:1},
  {q:"Dezember ist …",a:["der zehnte Monat","der elfte Monat","der zwölfte Monat"],correct:2},
  {q:"Im Frühling …",a:["blühen die Blumen","fallen die Blätter","bauen wir einen Schneemann"],correct:0}
];

const audio = document.getElementById("lessonAudio");
let currentStage = 0;
let recognizeIndex = 0;
let sortDone = 0;
let objectIndex = 0;
let dressIndex = 0;
let finalQuizScore = 0;
let wheelSpinning = false;
let wheelTurns = 0;
const packedObjects = [];

function escapeHtml(value){return String(value).replace(/[&<>'"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));}
function shuffle(array){return [...array].sort(()=>Math.random()-.5);}
function setFeedback(element,text,type=""){element.textContent=text;element.className=`feedback ${type}`.trim();}
function playAudio(files,button,statusElement){
  const candidates=(Array.isArray(files)?files:[files]).filter(Boolean);
  if(!candidates.length)return;
  document.querySelectorAll(".audio-btn.playing").forEach(b=>b.classList.remove("playing"));
  audio.pause();audio.currentTime=0;
  if(button)button.classList.add("playing");
  if(statusElement)statusElement.textContent="";
  let index=0;
  const tryNext=()=>{
    if(index>=candidates.length){if(button)button.classList.remove("playing");if(statusElement)statusElement.textContent="Fișierul audio nu a fost găsit. Verifică denumirea MP3.";return;}
    audio.src=AUDIO+candidates[index++];
    audio.load();
    audio.play().catch(tryNext);
  };
  audio.onended=()=>button&&button.classList.remove("playing");
  audio.onerror=tryNext;
  tryNext();
}

function setImageWithFallback(image, candidates, altText) {
  const sources = [...candidates];
  image.alt = altText;
  function loadNext() {
    if (!sources.length) {
      image.onerror = null;
      image.src = IMAGE + "felix-jahreszeiten.webp";
      image.title = "Imaginea sezonieră lipsește. Verifică denumirea fișierului în GitHub.";
      return;
    }
    image.src = sources.shift();
  }
  image.onerror = loadNext;
  loadNext();
}
function updateProgress(stage){
  currentStage=stage;
  const percent=stage===0?0:Math.round(stage/10*100);
  document.getElementById("progressFill").style.width=`${percent}%`;
  document.getElementById("progressText").textContent=stage===0?"Start":`Schritt ${stage} von 10`;
}
function showStage(stage){
  const target=document.querySelector(`[data-stage="${stage}"]`);
  if(!target)return;
  target.classList.remove("is-hidden");updateProgress(stage);
  if(stage===6)setupObject();
  if(stage===7)setupDress();
  if(stage===9)renderQuiz();
  requestAnimationFrame(()=>target.scrollIntoView({behavior:"smooth",block:"start"}));
}
function unlockNext(stage){const btn=document.querySelector(`[data-stage="${stage}"] .next-btn`);if(btn){btn.disabled=false;btn.classList.remove("locked");}}

function renderSeason(key){
  const s=seasons[key];
  document.getElementById("seasonCard").innerHTML=`<img src="${IMAGE}${s.image}" alt="${s.name}"><div class="season-info"><h3>${s.name}</h3><p class="translation">${s.ro}</p><div class="month-chips">${s.months.map(m=>`<span class="chip">${m}</span>`).join("")}</div><p><strong>${s.sentence}</strong><br>${s.translation}</p><button class="audio-btn" type="button" data-audio="${s.audio}"><img src="${ICON}audio.svg" alt=""> Wort hören</button> <button class="audio-btn" type="button" data-audio="${s.sentenceAudio}"><img src="${ICON}audio.svg" alt=""> Satz hören</button></div>`;
}
function toggleWheel(){
  const button=document.getElementById("wheelButton");
  const wheel=document.getElementById("seasonWheel");
  const action=document.getElementById("wheelAction");
  const result=document.getElementById("wheelResult");
  if(!wheelSpinning){
    wheelSpinning=true;button.classList.add("spinning");action.textContent="Stoppen";result.classList.add("is-hidden");
    return;
  }
  wheelSpinning=false;button.classList.remove("spinning");action.textContent="Noch einmal";
  const keys=Object.keys(seasons);const key=keys[Math.floor(Math.random()*keys.length)];const s=seasons[key];
  wheelTurns+=3+Math.floor(Math.random()*3);
  const index=keys.indexOf(key);wheel.style.transform=`rotate(${wheelTurns*360-index*90}deg)`;
  result.innerHTML=`<img src="${IMAGE}${s.image}" alt="${s.name}"><div class="wheel-result-content"><h3>${s.name}</h3><p class="translation">${s.ro}</p><p><strong>${s.months.join(" · ")}</strong></p><p>${s.sentence}</p><button class="audio-btn" type="button" data-audio="${s.sentenceAudio}"><img src="${ICON}audio.svg" alt=""> Anhören</button></div>`;
  result.classList.remove("is-hidden");
  playAudio([s.sentenceAudio,s.audio]);
}
function renderOrdinals(){
  document.getElementById("ordinalGrid").innerHTML=ordinals.map(([month,ordinal],i)=>`<div class="ordinal-card"><span><b>${month}</b><br>der ${ordinal} Monat</span><button class="mini-audio" type="button" data-audio="ordinal-${String(i+1).padStart(2,"0")}.mp3" aria-label="Audio: ${month}"><img src="${ICON}audio.svg" alt=""></button></div>`).join("");
}

function setupRecognition(){
  const order=["fruehling","sommer","herbst","winter"];
  const key=order[recognizeIndex];const s=seasons[key];
  document.getElementById("recognizeImage").src=IMAGE+s.image;
  document.getElementById("recognizePrompt").textContent=`Frage ${recognizeIndex+1}/4: Welche Jahreszeit ist das?`;
  document.getElementById("recognizeAnswers").innerHTML=shuffle(order).map(k=>`<button class="answer-btn" type="button" data-value="${k}">${seasons[k].name}</button>`).join("");
}
function checkRecognition(button){
  const correct=["fruehling","sommer","herbst","winter"][recognizeIndex];
  if(button.dataset.value!==correct){button.classList.add("wrong");setFeedback(document.getElementById("recognizeFeedback"),"Versuche es noch einmal.","error");return;}
  button.classList.add("correct");setFeedback(document.getElementById("recognizeFeedback"),`Richtig! Das ist ${seasons[correct].name}.`,"success");
  setTimeout(()=>{recognizeIndex++;if(recognizeIndex<4){setupRecognition();setFeedback(document.getElementById("recognizeFeedback"),"");}else{setFeedback(document.getElementById("recognizeFeedback"),"Sehr gut! Du kennst die vier Jahreszeiten.","success");unlockNext(4);}},650);
}

function setupSorting(){
  const cards=shuffle([["Januar","winter"],["April","fruehling"],["Juli","sommer"],["Oktober","herbst"]]);
  document.getElementById("monthSorting").innerHTML=cards.map(([month,key],i)=>`<div class="sort-card" data-correct="${key}"><h3>${month}</h3><div class="sort-options">${Object.keys(seasons).map(k=>`<button class="sort-btn" type="button" data-value="${k}">${seasons[k].name.replace("der ","")}</button>`).join("")}</div></div>`).join("");
}
function checkSorting(button){
  const card=button.closest(".sort-card");if(card.classList.contains("done"))return;
  if(button.dataset.value!==card.dataset.correct){button.classList.add("wrong");setFeedback(document.getElementById("sortingFeedback"),"Fast richtig. Versuche es noch einmal.","error");return;}
  button.classList.add("correct");card.classList.add("done");card.querySelectorAll("button").forEach(b=>b.disabled=true);sortDone++;
  setFeedback(document.getElementById("sortingFeedback"),"Richtig!","success");
  if(sortDone===4){setFeedback(document.getElementById("sortingFeedback"),"Prima! Alle Monate sind richtig zugeordnet.","success");unlockNext(5);}
}

function setupObject(){
  if(objectIndex>=objects.length)return;
  const [file,name]=objects[objectIndex];
  document.getElementById("objectCard").innerHTML=`<img src="${IMAGE}${file}" alt="${escapeHtml(name)}" data-object-audio="${file.replace("objekt-","").replace(".webp",".mp3")}"><strong>${escapeHtml(name)}</strong><small>Bild berühren und hören</small>`;
  document.getElementById("objectAnswers").innerHTML=Object.keys(seasons).map(k=>`<button class="answer-btn" type="button" data-value="${k}">${seasons[k].name}</button>`).join("");
}
function renderPackedObjects(){
  document.getElementById("packedObjects").innerHTML=packedObjects.map(item=>`<button class="packed-item" type="button" data-object-audio="${item.audio}" aria-label="${escapeHtml(item.name)} hören"><img src="${IMAGE}${item.file}" alt="${escapeHtml(item.name)}"></button>`).join("");
}
function checkObject(button){
  const correct=objects[objectIndex][2];
  if(button.dataset.value!==correct){button.classList.add("wrong");setFeedback(document.getElementById("objectFeedback"),"Das passt noch nicht. Versuche es noch einmal.","error");return;}
  button.classList.add("correct");
  const [file,name]=objects[objectIndex];packedObjects.push({file,name,audio:file.replace("objekt-","").replace(".webp",".mp3")});renderPackedObjects();
  setFeedback(document.getElementById("objectFeedback"),`Richtig! ${name} passt zu ${seasons[correct].name}.`,"success");
  setTimeout(()=>{objectIndex++;if(objectIndex<objects.length){setupObject();setFeedback(document.getElementById("objectFeedback"),"");}else{document.getElementById("objectCard").innerHTML="<strong>Der Koffer ist fertig!</strong><small>Berühre die Gegenstände im Koffer und höre sie noch einmal.</small>";document.getElementById("objectAnswers").innerHTML="";setFeedback(document.getElementById("objectFeedback"),"Gut gemacht! Alle 16 Gegenstände sind richtig eingeordnet.","success");unlockNext(6);}},600);
}

function setupDress(){
  const order=["fruehling","sommer","herbst","winter"];const target=order[dressIndex];
  if(!target)return;
  document.getElementById("dressPrompt").innerHTML=`Es ist <strong>${seasons[target].name.replace("der ","")}</strong>. Welche Kleidung braucht Felix?`;
  const mainImage=document.getElementById("dressFelix");
  setImageWithFallback(mainImage,[IMAGE+`felix-${target}.webp`,IMAGE+`felix_${target}.webp`],`Felix: ${seasons[target].name}`);
  document.getElementById("outfitOptions").innerHTML=shuffle(order).map(k=>`<button class="outfit-btn" data-value="${k}" type="button"><img data-felix-season="${k}" alt="Felix: ${seasons[k].name}"><span>${seasons[k].name}</span></button>`).join("");
  document.querySelectorAll("[data-felix-season]").forEach(image=>{
    const key=image.dataset.felixSeason;
    setImageWithFallback(image,[IMAGE+`felix-${key}.webp`,IMAGE+`felix_${key}.webp`],`Felix: ${seasons[key].name}`);
  });
}
function checkDress(button){
  const correct=["fruehling","sommer","herbst","winter"][dressIndex];
  if(button.dataset.value!==correct){button.classList.add("wrong");setFeedback(document.getElementById("dressFeedback"),"Diese Kleidung passt nicht. Versuche es noch einmal.","error");return;}
  button.classList.add("correct");setFeedback(document.getElementById("dressFeedback"),"Richtig angezogen!","success");
  setTimeout(()=>{dressIndex++;if(dressIndex<4){setupDress();setFeedback(document.getElementById("dressFeedback"),"");}else{setFeedback(document.getElementById("dressFeedback"),"Super! Felix ist für jedes Wetter bereit.","success");unlockNext(7);}},650);
}

const sentenceWords=["Im","Herbst","fallen","die","Blätter."];
let sentenceChoice=[];
function setupSentence(){sentenceChoice=[];document.getElementById("sentenceTarget").innerHTML="";document.getElementById("wordBank").innerHTML=shuffle(sentenceWords).map((w,i)=>`<button class="word-btn" type="button" data-word="${escapeHtml(w)}" data-id="${i}">${escapeHtml(w)}</button>`).join("");setFeedback(document.getElementById("sentenceFeedback"),"");}
function chooseWord(button){button.disabled=true;sentenceChoice.push(button.dataset.word);document.getElementById("sentenceTarget").insertAdjacentHTML("beforeend",`<span class="placed-word">${escapeHtml(button.dataset.word)}</span>`);if(sentenceChoice.length===sentenceWords.length){if(sentenceChoice.join(" ")===sentenceWords.join(" ")){setFeedback(document.getElementById("sentenceFeedback"),"Richtig! Im Herbst fallen die Blätter.","success");unlockNext(8);}else setFeedback(document.getElementById("sentenceFeedback"),"Die Reihenfolge stimmt noch nicht. Versuche es noch einmal.","error");}}

function renderQuiz(){
  document.getElementById("quizBox").innerHTML=quizQuestions.map((item,i)=>`<article class="quiz-question"><h3>${i+1}. ${item.q}</h3><div class="quiz-options">${item.a.map((answer,j)=>`<label class="quiz-option"><input type="radio" name="q${i}" value="${j}"><span>${answer}</span></label>`).join("")}</div></article>`).join("");
  const submit=document.getElementById("submitQuiz");submit.disabled=false;submit.dataset.mode="check";submit.textContent="Quiz prüfen";
}
function submitQuiz(){
  const submitButton=document.getElementById("submitQuiz");
  if(submitButton.dataset.mode==="retry"){
    renderQuiz();
    submitButton.dataset.mode="check";
    submitButton.textContent="Quiz prüfen";
    setFeedback(document.getElementById("quizFeedback"),"");
    return;
  }
  let answered=0,score=0;
  quizQuestions.forEach((item,i)=>{const chosen=document.querySelector(`input[name="q${i}"]:checked`);if(chosen){answered++;if(Number(chosen.value)===item.correct)score++;}});
  if(answered<quizQuestions.length){setFeedback(document.getElementById("quizFeedback"),"Beantworte bitte alle 10 Fragen.","error");return;}
  finalQuizScore=score;
  quizQuestions.forEach((item,i)=>document.querySelectorAll(`input[name="q${i}"]`).forEach(input=>{input.disabled=true;input.closest("label").classList.add(Number(input.value)===item.correct?"correct":input.checked?"wrong":"");}));
  const passed=score>=8;setFeedback(document.getElementById("quizFeedback"),passed?`Sehr gut! ${score}/10 Punkte. Die Urkunde ist freigeschaltet.`:`Du hast ${score}/10 Punkte. Wiederhole das Quiz und erreiche mindestens 8 Punkte.`,passed?"success":"error");
  if(passed){unlockNext(9);submitButton.disabled=true;}
  else{submitButton.dataset.mode="retry";submitButton.textContent="Quiz wiederholen";}
}

document.addEventListener("click",event=>{
  const start=event.target.closest("#startLesson");if(start){document.querySelector(".hero").classList.add("completed");showStage(1);return;}
  const next=event.target.closest(".next-btn");if(next&&!next.disabled){showStage(Number(next.dataset.next));return;}
  const seasonTab=event.target.closest(".season-tab");if(seasonTab){document.querySelectorAll(".season-tab").forEach(b=>b.classList.toggle("active",b===seasonTab));renderSeason(seasonTab.dataset.season);return;}
  const wheelButton=event.target.closest("#wheelButton");if(wheelButton){toggleWheel();return;}
  const introButton=event.target.closest("#introAudioButton");if(introButton){playAudio("intro.mp3",introButton,document.getElementById("introAudioStatus"));return;}
  const audioButton=event.target.closest("[data-audio]");if(audioButton){playAudio(audioButton.dataset.audio,audioButton);return;}
  const objectAudio=event.target.closest("[data-object-audio]");if(objectAudio){playAudio([objectAudio.dataset.objectAudio,`objekt-${objectAudio.dataset.objectAudio}`]);return;}
  const recognize=event.target.closest("#recognizeAnswers .answer-btn");if(recognize){checkRecognition(recognize);return;}
  const sort=event.target.closest(".sort-btn");if(sort){checkSorting(sort);return;}
  const object=event.target.closest("#objectAnswers .answer-btn");if(object){checkObject(object);return;}
  const outfit=event.target.closest(".outfit-btn");if(outfit){checkDress(outfit);return;}
  const word=event.target.closest(".word-btn");if(word){chooseWord(word);return;}
});

document.getElementById("resetSentence").addEventListener("click",setupSentence);
document.getElementById("submitQuiz").addEventListener("click",submitQuiz);
document.getElementById("restartLesson").addEventListener("click",()=>{window.scrollTo({top:0,behavior:"smooth"});setTimeout(()=>location.reload(),350);});
document.querySelector('[data-next="10"]').addEventListener("click",()=>{document.getElementById("finalScore").textContent=`Quiz: ${finalQuizScore}/10 Punkte`;document.getElementById("certificateScore").textContent=`Ergebnis: ${finalQuizScore}/10`;document.getElementById("certificate").classList.toggle("is-hidden",finalQuizScore<8);playAudio("abschluss.mp3");});

renderSeason("fruehling");renderOrdinals();setupRecognition();setupSorting();setupSentence();updateProgress(0);
