import React from "react";

const AssistantSpeechIndicator = ({ isSpeaking }) => {
  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
      <div
        style={{
          width: "20px",
          height: "20px",
          backgroundColor: isSpeaking ? "green" : "red",
          marginRight: "10px",
          borderRadius: "4px",
        }}
      />
      <p style={{ color: "white", margin: 0 }}>
        {isSpeaking ? "Assistant speaking" : "Assistant not speaking"}
      </p>
    </div>
  );
};

export default AssistantSpeechIndicator;
