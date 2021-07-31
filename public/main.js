// prettier-ignore
const transcriptionContainer = document.querySelector(".transcription-container");
const translationContainer = document.querySelector(".translation-container");
const startBtn = document.querySelector(".start-button");
const startBtnSpan = document.querySelector(".start-button span");
const toLanguageInput = document.getElementById("toLanguageInput");

const recognition = new webkitSpeechRecognition();
recognition.continuous = true;
recognition.interimResults = true;
recognition.lang = "es-MX";

let recognizing = false;
let resultTimer;

let languageTo;

if (localStorage.getItem("languageTo")) {
  languageTo = localStorage.getItem("languageTo")
  populateLanguagesTo(languageTo)
} else {
  // languageTo set in populate
  populateLanguagesTo();
}

toLanguageInput.onchange = () => {
  localStorage.setItem("languageTo", toLanguageInput.value);
}

function toggleStartStop() {
  if (recognizing) {
    recognition.stop();
  } else {
    recognition.start();
  }
}

recognition.addEventListener("start", () => {
  console.log("Recognition Started!");
  recognizing = true;
  startBtnSpan.innerHTML = "Stop recording";
  btnClassToggler();

});

recognition.addEventListener("end", () => {
  console.log("Recognition Ended!");
  recognizing = false;
  startBtnSpan.innerHTML = "Start recording";
  btnClassToggler();
});

function btnClassToggler() {
  if (startBtn.classList.contains("btn-warning")) {
    startBtn.classList.remove("btn-warning");
    startBtn.classList.add("btn-danger");
  } else {
    startBtn.classList.add("btn-warning");
    startBtn.classList.remove("btn-danger");
  }
}

recognition.addEventListener("result", (e) => {
  transcriptionContainer.innerHTML = "";

  for (const res of e.results) {
    if (resultTimer) clearTimeout(resultTimer);
    if (res.isFinal) {
      displayTranslation(res[0].transcript, "en");
    } else {
      const p = document.createElement("p");
      const transcriptShot = document.createTextNode(res[0].transcript);
      p.appendChild(transcriptShot);
      transcriptionContainer.appendChild(p);

      // if for some reason final doesn't get detected
      displayTranslation(res[0].transcript, "en");
    }
  }
});

function displayTranslation(text, to) {
  const p = document.createElement("p");
  resultTimer = setTimeout(() => {
    translate(text, to).then((translation) => {
      transcriptionContainer.innerHTML = "";
      translationContainer.innerHTML = "";
      const translationShot = document.createTextNode(translation);
      p.appendChild(translationShot);
      translationContainer.appendChild(p);
    });
  }, 1000);
}

async function translate(text, to) {
  const request = {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text: text,
      to: to,
    }),
    method: "POST",
  };
  // change to "https://live-speech-translator.herokuapp.com/translate" when needed
  const response = await fetch("http://localhost:3000/translate", request);
  const translation = await response.text();
  return translation;
}

async function populateLanguagesTo(def="es") {
  // change to "https://live-speech-translator.herokuapp.com/get-languages" when needed
  const response = await fetch("http://localhost:3000/get-languages");
  const languages = await response.json();
  for (let lang of languages) {
    const option = document.createElement("option");
    option.setAttribute("value", lang.language);
    option.innerHTML = lang.name;

    if (lang.language == def) {
      option.selected = true;
    } else if (lang.language == "en") {
      option.selected = true;
    }

    toLanguageInput.appendChild(option);
  }
  languageTo = toLanguageInput.value;
}
