const transcriptContainer = document.getElementById("transcript-container");
const micOn = document.getElementById("mic-on");
const micOff = document.getElementById("mic-off");

// temp begin
const sidebar = document.getElementById("sidebar");
const sidebarToggler = document.getElementById("sidebar-toggler");
const blurDiv = document.getElementById("blur");
let sidebarActive = false;

sidebarToggler.onclick = () => {
  if (sidebarActive) {
    sidebarToggler.style.transform = "";
    blurDiv.style.backdropFilter = "";
    sidebar.style.left = "-180px";
    sidebarActive = false;
  } else {
    sidebarToggler.style.transform = "rotateZ(180deg)";
    blurDiv.style.backdropFilter = "blur(1px)";
    sidebar.style.left = "0";
    sidebarActive = true;
  }
};

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
    displayTranscript(e.results[i][0], e.results[i].isFinal);
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

function displayTranscript(result, isFinal) {
  let space = "";

  if (transcriptContainer.textContent.length > 0) space = " ";

  if (isFinal) {
    translate(result.transcript, "es").then((translation) => {
      transcriptContainer.textContent = space + finalTranscript + translation;
      updateFinalTranscript();
    });
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

async function translate(text, language) {
  const response = await fetch("http://localhost:3000/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text: text,
      language: language,
    }),
  });

  const translation = await response.text();

  return translation;
}
