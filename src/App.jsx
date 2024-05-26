import { useEffect, useState } from "react";

import ActiveCallDetail from "./components/ActiveCallDetail";
import Button from "./components/base/Button";
import Vapi from "@vapi-ai/web";
import { isPublicKeyMissingError } from "./utils";

// Put your Vapi Public Key below.
const vapi = new Vapi("66599daf-e232-4c79-9b57-0fbb83ee78ef");

const App = () => {
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);

  const [assistantIsSpeaking, setAssistantIsSpeaking] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0);

  const { showPublicKeyInvalidMessage, setShowPublicKeyInvalidMessage } = usePublicKeyInvalid();

  // hook into Vapi events
  useEffect(() => {
    vapi.on("call-start", () => {
      setConnecting(false);
      setConnected(true);

      setShowPublicKeyInvalidMessage(false);
    });

    vapi.on("call-end", () => {
      setConnecting(false);
      setConnected(false);

      setShowPublicKeyInvalidMessage(false);
    });

    vapi.on("speech-start", () => {
      setAssistantIsSpeaking(true);
    });

    vapi.on("speech-end", () => {
      setAssistantIsSpeaking(false);
    });

    vapi.on("volume-level", (level) => {
      setVolumeLevel(level);
    });

    vapi.on("error", (error) => {
      console.error(error);

      setConnecting(false);
      if (isPublicKeyMissingError({ vapiError: error })) {
        setShowPublicKeyInvalidMessage(true);
      }
    });

    // we only want this to fire on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // call start handler
  const startCallInline = () => {
    setConnecting(true);
    vapi.start(assistantOptions);
  };
  const endCall = () => {
    vapi.stop();
  };

  return (
    <div
      style={{
        display: "flex",
        width: "100vw",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {!connected ? (
        <Button
          label="Start Interview with Nick"
          onClick={startCallInline}
          isLoading={connecting}
        />
      ) : (
        <ActiveCallDetail
          assistantIsSpeaking={assistantIsSpeaking}
          volumeLevel={volumeLevel}
          onEndCallClick={endCall}
        />
      )}

      {showPublicKeyInvalidMessage ? <PleaseSetYourPublicKeyMessage /> : null}
      <ReturnToDocsLink />
    </div>
  );
};

const assistantOptions = {
  name: "Nick Linkc at the Residency",
  firstMessage: "Nick here for the Residency Interview, how are you today?",
  transcriber: {
    provider: "deepgram",
    model: "nova-2",
    language: "en-US",
  },
  voice: {
    provider: "playht",
    voiceId: "jennifer",
  },
  model: {
    provider: "openai",
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `Welcome, Nick! As an AI Interviewer for The Residency Hacker House, your mission is to conduct insightful interviews, drawing out the best characteristics of each applicant. Your role involves asking pertinent questions, evaluating responses, and ensuring a smooth interview process. Remember, applicants can't see you, so your tone and words need to create an engaging and professional environment.

When engaging with candidates, listen carefully for cues about their confidence, enthusiasm, and experience. If an applicant asks if you're actively listening, reassure them promptly and warmly. For complex questions or topics that require detailed exploration, break down your inquiries into simple, clear segments. Your aim is to make each applicant feel valued and respected throughout the process.

**Key Instructions for Interviews:**
1. **Active Listening Confirmation:** Always confirm that you're attentively listening, especially if asked directly. Example: "Yes, I'm here and listening carefully. Ready for your next thought?"
2. **Clarity and Precision:** Use clear and precise language to avoid misunderstandings. For complex topics, simplify your questions without losing depth.
3. **Pacing:** Maintain a steady and moderate pace so applicants can comfortably respond to your questions.
4. **Empathy and Encouragement:** Inject warmth and empathy into your responses. Acknowledge the applicant's experiences, especially if they're sharing something challenging.
5. **Instructions and Guidance:** For multiple-part questions or tasks, provide step-by-step instructions, checking in with the applicant at each stage.
6. **Feedback Queries:** Occasionally ask for feedback to confirm the applicant understands or if they need further clarification.

Your role is essential in making SmartHire Solutions' interview process outstanding. Let's ensure every interaction is thorough, respectful, and beneficial for both the applicant and the company!

---

**About Our Residency Experience:**

💫 **Your curiosity sets the direction.**
⚡️ **Our support accelerates your growth.**

The Residency is designed to develop:

**Our Ideal Graduate:**

-  **Critical Thinker:** Questions new ideas, seeks truth beyond the status quo.
-  **Curious Learner:** Masters any chosen topic swiftly.
-  **Emotionally Intelligent Collaborator:** Works effectively towards common goals.
-  **Value Creator:** Envisions and realizes new opportunities.
-  **Resilient Leader:** Overcomes challenges and proceeds with imperfect information.
-  **Adaptable Futurist:** Evolves with the times while building the desired future.

**Residency Requirements:**

1. **Build a Solution:** Continuously work on solving real-world problems.
2. **Learn New Skills:** Set learning goals and achieve them with coach support.
3. **Maintain a Portfolio:** Demonstrate skills through a portfolio rather than traditional degrees.

**Supporting Residents:**

-  **Coaching:** Focus on motivation and overcoming social-emotional hurdles.
  
-  **Housing:** Live together with peers to foster a builder mindset and lifelong friendships.
  
-  **Demo Days:** Weekly presentations for feedback and accountability, culminating in a final demo day.

-  **Coworking:** Work in a shared space to enhance productivity, creativity, and networking.

-  **Community:** Participate in bonding experiences, hackathons, and networking events with peers and professionals.`,
      },
    ],
  },
};

const usePublicKeyInvalid = () => {
  const [showPublicKeyInvalidMessage, setShowPublicKeyInvalidMessage] = useState(false);

  // close public key invalid message after delay
  useEffect(() => {
    if (showPublicKeyInvalidMessage) {
      setTimeout(() => {
        setShowPublicKeyInvalidMessage(false);
      }, 3000);
    }
  }, [showPublicKeyInvalidMessage]);

  return {
    showPublicKeyInvalidMessage,
    setShowPublicKeyInvalidMessage,
  };
};

const PleaseSetYourPublicKeyMessage = () => {
  return (
    <div
      style={{
        position: "fixed",
        bottom: "25px",
        left: "25px",
        padding: "10px",
        color: "#fff",
        backgroundColor: "#f03e3e",
        borderRadius: "5px",
        boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
      }}
    >
      Is your Vapi Public Key missing? (recheck your code)
    </div>
  );
};

const ReturnToDocsLink = () => {
  return (
    <a
      href="https://docs.vapi.ai"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        position: "fixed",
        top: "25px",
        right: "25px",
        padding: "5px 10px",
        color: "#fff",
        textDecoration: "none",
        borderRadius: "5px",
        boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
      }}
    >
      return to docs
    </a>
  );
};

export default App;
