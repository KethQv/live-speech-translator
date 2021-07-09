const transcriptContainer = document.getElementById("transcript-container");
const micOn = document.getElementById("mic-on");
const micOff = document.getElementById("mic-off");

const recognition = new webkitSpeechRecognition();
let recognitionListening = false;
recognition.continuous = true;
recognition.interimResults = true;
recognition.lang = "en-US";
let finalTranscript = "";

document.addEventListener("keypress", (e) => {
  if (e.key === " ") recognitionListen();
});

recognition.addEventListener("start", (e) => {
  console.log("listening");
  recognitionListening = true;
});

recognition.addEventListener("end", (e) => {
  console.log("not listening");
  recognitionListening = false;
});

recognition.addEventListener("result", (e) => {
  for (let i = e.resultIndex; i < e.results.length; i++) {
    displayTranscript(e.results[i][0]);
  }
});

function recognitionListen() {
  micOff.classList.toggle("hide");
  micOn.classList.toggle("hide");

  if (recognitionListening) {
    recognition.stop();
  } else {
    recognition.start();
  }
}

function displayTranscript(result) {
  let space = "";

  if (transcriptContainer.textContent.length > 0) space = " ";

  if (result.isFinal) {
    transcriptContainer.textContent =
      space + finalTranscript + result.transcript;
    updateFinalTranscript();
  } else if (result.confidence > 0.5) {
    transcriptContainer.textContent =
      space + finalTranscript + result.transcript;
  } else if (result.confidence > 0.35) {
    transcriptContainer.textContent +=
      space + finalTranscript + result.transcript;
  }
}

function updateFinalTranscript() {
  finalTranscript = transcriptContainer.textContent;
}
