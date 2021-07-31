// prettier-ignore
const transcriptionContainer = document.querySelector(".transcription-container");
const translationContainer = document.querySelector(".translation-container");
const startBtn = document.querySelector(".start-button");
const startBtnSpan = document.querySelector(".start-button span");
const toLanguageInput = document.getElementById("toLanguageInput");
const fromLanguageInput = document.getElementById("fromLanguageInput");

const recognition = new webkitSpeechRecognition();
recognition.continuous = true;
recognition.interimResults = true;
recognition.lang = "es-MX";

let recognizing = false;
let resultTimer;

let languageFrom;
let languageTo;

if (localStorage.getItem("languageFrom")) {
  languageFrom = localStorage.getItem("languageFrom");
  populateLanguagesFrom(languageFrom);
} else {
  // languageFrom set in populate
  populateLanguagesFrom();
}

if (localStorage.getItem("languageTo")) {
  languageTo = localStorage.getItem("languageTo")
  populateLanguagesTo(languageTo);
} else {
  // languageTo set in populate
  populateLanguagesTo();
}

fromLanguageInput.onchange = () => {
  localStorage.setItem("languageFrom", fromLanguageInput.value);
  recognition.lang = fromLanguageInput.value;
}

toLanguageInput.onchange = () => {
  localStorage.setItem("languageTo", toLanguageInput.value);
  languageTo = toLanguageInput.value;
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
      displayTranslation(res[0].transcript);
    } else {
      const p = document.createElement("p");
      const transcriptShot = document.createTextNode(res[0].transcript);
      p.appendChild(transcriptShot);
      transcriptionContainer.appendChild(p);

      // if for some reason final doesn't get detected
      displayTranslation(res[0].transcript);
    }
  }
});

function displayTranslation(text) {
  const p = document.createElement("p");
  resultTimer = setTimeout(() => {
    translate(text).then((translation) => {
      transcriptionContainer.innerHTML = "";
      translationContainer.innerHTML = "";
      const translationShot = document.createTextNode(translation);
      p.appendChild(translationShot);
      translationContainer.appendChild(p);
    });
  }, 1000);
}

async function translate(text) {
  const request = {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text: text,
      to: languageTo,
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

    if (lang.language == def) option.selected = true;

    toLanguageInput.appendChild(option);
  }
  languageTo = toLanguageInput.value;
}

function populateLanguagesFrom(def="es-US") {
  // only choosing some languages the rest is at the bottom
  const languages = [
    { name: "Deutsch", code: "de-DE" },
    { name: "English", code: "es-US" },
    { name: "Español", code: "es-MX" },
    { name: "Italiano", code: "it-IT" },
    { name: "Português", code: "pt-BR" },
    { name: "한국어", code: "ko-KR" },
    { name: "中文", code: "cmn-Hans-CN" },
    { name: "日本語", code: "ja-JP" },
  ];
  for (let lang of languages) {
    const option = document.createElement("option");
    option.setAttribute("value", lang.code);
    option.innerHTML = lang.name;

    if (lang.code == def) option.selected = true;

    fromLanguageInput.appendChild(option);
  }
  languageFrom = fromLanguageInput.value;
  recognition.lang = fromLanguageInput.value;
}

// const langs =
// [['Afrikaans',       ['af-ZA']],
//  ['Bahasa Indonesia',['id-ID']],
//  ['Bahasa Melayu',   ['ms-MY']],
//  ['Català',          ['ca-ES']],
//  ['Čeština',         ['cs-CZ']],
//  ['Deutsch',         ['de-DE']],
//  ['English',         ['en-AU', 'Australia'],
//                      ['en-CA', 'Canada'],
//                      ['en-IN', 'India'],
//                      ['en-NZ', 'New Zealand'],
//                      ['en-ZA', 'South Africa'],
//                      ['en-GB', 'United Kingdom'],
//                      ['en-US', 'United States']],
//  ['Español',         ['es-AR', 'Argentina'],
//                      ['es-BO', 'Bolivia'],
//                      ['es-CL', 'Chile'],
//                      ['es-CO', 'Colombia'],
//                      ['es-CR', 'Costa Rica'],
//                      ['es-EC', 'Ecuador'],
//                      ['es-SV', 'El Salvador'],
//                      ['es-ES', 'España'],
//                      ['es-US', 'Estados Unidos'],
//                      ['es-GT', 'Guatemala'],
//                      ['es-HN', 'Honduras'],
//                      ['es-MX', 'México'],
//                      ['es-NI', 'Nicaragua'],
//                      ['es-PA', 'Panamá'],
//                      ['es-PY', 'Paraguay'],
//                      ['es-PE', 'Perú'],
//                      ['es-PR', 'Puerto Rico'],
//                      ['es-DO', 'República Dominicana'],
//                      ['es-UY', 'Uruguay'],
//                      ['es-VE', 'Venezuela']],
//  ['Euskara',         ['eu-ES']],
//  ['Français',        ['fr-FR']],
//  ['Galego',          ['gl-ES']],
//  ['Hrvatski',        ['hr_HR']],
//  ['IsiZulu',         ['zu-ZA']],
//  ['Íslenska',        ['is-IS']],
//  ['Italiano',        ['it-IT', 'Italia'],
//                      ['it-CH', 'Svizzera']],
//  ['Magyar',          ['hu-HU']],
//  ['Nederlands',      ['nl-NL']],
//  ['Norsk bokmål',    ['nb-NO']],
//  ['Polski',          ['pl-PL']],
//  ['Português',       ['pt-BR', 'Brasil'],
//                      ['pt-PT', 'Portugal']],
//  ['Română',          ['ro-RO']],
//  ['Slovenčina',      ['sk-SK']],
//  ['Suomi',           ['fi-FI']],
//  ['Svenska',         ['sv-SE']],
//  ['Türkçe',          ['tr-TR']],
//  ['български',       ['bg-BG']],
//  ['Pусский',         ['ru-RU']],
//  ['Српски',          ['sr-RS']],
//  ['한국어',            ['ko-KR']],
//  ['中文',             ['cmn-Hans-CN', '普通话 (中国大陆)'],
//                      ['cmn-Hans-HK', '普通话 (香港)'],
//                      ['cmn-Hant-TW', '中文 (台灣)'],
//                      ['yue-Hant-HK', '粵語 (香港)']],
//  ['日本語',           ['ja-JP']],
//  ['Lingua latīna',   ['la']]];