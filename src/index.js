import React from "react";
import ReactDOM from "react-dom";

function App() {
  return (
    <>
      <h1>Transcript app</h1>
      <TranscriptionContainer />
    </>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));

// find more about this in webpack
if (module.hot) {
  module.hot.accept();
}

// const recognition = new webkitSpeechRecognition();
// let recognitionListening = false;
// recognition.continuous = true;
// recognition.interimResults = true;
// recognition.lang = "en-US";
// let finalTranscript = "";
