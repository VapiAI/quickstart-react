import "./index.css";

import React from "react";
import ReactDOM from "react-dom/client";
import vapi from "@vapi-ai/web";

// call basics
function App() {
  const startCallInline = () => {
    console.log(vapi);
  };

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={startCallInline}>start call</button>
        <a
          className="App-link"
          href="https://docs.vapi.ai"
          target="_blank"
          rel="noopener noreferrer"
        >
          return to docs
        </a>
      </header>
    </div>
  );
}

// render application
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
