const translationContainer = document.querySelector(".translation-container");
const finalTrans = document.querySelector(".final-translation");
const interimTrans = document.querySelector(".interim-translation");
const startBtn = document.querySelector(".start-button");
let fromLang = "auto";
let toLang = "es";

const recognition = new webkitSpeechRecognition();
recognition.continuous = true;
recognition.interimResults = true;
recognition.lang = "en-US";

let newLineTimer;
let recognizing = true;

toggleStartStop();

function toggleStartStop() {
  if (recognizing) {
    recognition.stop();
    recognizing = false;
    startBtn.innerHTML = "Click to Speak";
  } else {
    recognition.start();
    recognizing = true;
    startBtn.innerHTML = "Click to Stop";
  }
}

recognition.addEventListener("start", () => {
  console.log("Recognition Started!");
});

recognition.addEventListener("end", () => {
  console.log("Recognition Ended!");
});

recognition.addEventListener("result", (e) => {
  const space = translationContainer.innerHTML.length > 0 ? " " : "";

  for (let i = e.resultIndex; i < e.results.length; i++) {
    if (e.results[i].isFinal) {
      if (newLineTimer) clearTimeout(newLineTimer);
      newLineTimer = setTimeout(insertBr(), 3000);
      translate(e.results[i][0].transcript);
    }
  }
});

function insertBr() {
  finalTrans.innerHTML += "<br>";
}

function insertTranslation(translation) {
  finalTrans.innerHTML += translation;
  interimTrans.innerHTML = "";
}

async function translate(text) {
  const request = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text: text,
      from: fromLang,
      to: toLang,
    }),
  };
  const response = await fetch("http://localhost:8000/translate", request);
  const translation = await response.text();
  insertTranslation(translation);
}
// "https://live-speech-translator.herokuapp.com/";
