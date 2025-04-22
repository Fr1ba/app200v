// SendMessage.jsx
import React, { useState } from "react";

const endpoint = "https://app06.itxnorge.no";

function SendMessage() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [caseEachId, setCaseEachId] = useState(""); 
  const [conversationEachId, setConversationEachId] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      direction: 2,
      subject,
      body: message,
      createCase: false,
    };

    if (caseEachId) payload.caseEactId = Number(caseEachId);
    if (conversationEachId) payload.replyToEactId = Number(conversationEachId);

    const formData = new FormData();
    const jsonBlob = new Blob([JSON.stringify(payload)], {
      type: "application/json",
    });

    formData.append("data", jsonBlob);

    try {
      const response = await fetch(`${endpoint}/rest/itxems/message`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Subjekt
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
      </label>
      <label>
        Melding
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </label>

     {/* Will remove these in future, but have them here to connect the message to a case for now */}

      <label>
        caseEactId
        <input
          type="text"
          value={caseEachId}
          onChange={(e) => setCaseEachId(e.target.value)}
        />
      </label>
      <label>
        replyToEactId
        <input
          type="text"
          value={conversationEachId}
          onChange={(e) => setConversationEachId(e.target.value)}
        />
      </label>
      <button type="submit">Send</button>
    </form>
  );
}

export default SendMessage;
