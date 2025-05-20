import React, { useEffect, useState } from "react";
import styles from "./Message.module.css";
import TextEditor from "../TextEditor/TextEditor.jsx";

const endpoint = "https://app06.itxnorge.no";

function Message() {
  const [message, setMessage] = useState("");
  const [caseEactId, setCaseEactId] = useState("");
  const [replyToEactId, setReplyToEactId] = useState("");
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const temp = document.createElement("div");
    temp.innerHTML = message;
    const plainText = temp.innerText.trim();

    if (!plainText) {
      setError("Meldingen kan ikke være tom!");
      return;
    }

    const data = {
      direction: 2,
      subject: "Reklamasjon",
      body: message,
      createCase: false,
      caseEactId: 3453451,
      replyToEactId: 3453465,
    };

    const jsonBlob = new Blob([JSON.stringify(data)], {
      type: "application/json",
    });

    const formData = new FormData();
    formData.append("data", jsonBlob);

    try {
      const response = await fetch(`${endpoint}/rest/itxems/message`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const responseData = await response.json();
      console.log("Sent:", responseData);
      setMessage(""); // clear editor after send
      setError("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    setCaseEactId(3453451);
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!caseEactId) return;
      try {
        const response = await fetch(`${endpoint}/rest/itxems/message/search`, {
          method: "POST",
          credentials: "include",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            getConversations: false,
            getContent: true,
            draft: false,
            conversationEactId: 3453453
          })
        });

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        setMessages(data.length ? data : []);

      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [caseEactId]);

return (
  <div className={styles.rightContainer}>
    <h3>Meldinger {caseEactId}</h3>

    {/* Gruppér meldinger etter subject */}
    {Object.entries(
      messages.reduce((acc, msg) => {
        const subject = msg.subject || "(uten tittel)";
        if (!acc[subject]) acc[subject] = [];
        acc[subject].push(msg);
        return acc;
      }, {})
    ).map(([subject, msgs]) => (
      <div key={subject} className={styles.messageGroup}>
        <h4>{subject}</h4>
        <ul>
          {msgs.map((msg) => (
            <li key={msg.eactId}>
              <div dangerouslySetInnerHTML={{ __html: msg.body }} />
            </li>
          ))}
        </ul>
      </div>
    ))}

    <form onSubmit={handleSubmit} className={styles.messageForm}>
      <p>Skriv inn din melding her</p>
      <TextEditor
        className={styles.textEditor}
        value={message}
        onChange={setMessage}
      />
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button type="submit">Send</button>
    </form>
  </div>
);

}

export default Message;