import React, { useContext, useEffect, useState } from "react";
import styles from "./Message.module.css";
import TextEditor from "../TextEditor/TextEditor.jsx";
import MessageDetails from "./MessageDetails.jsx";
import { CaseContext } from "../SelectedCase.jsx";
import { BsEnvelope } from "react-icons/bs";
import { postMessage, getMessages } from "../api/messageApi.js";

function Message() {
  const [message, setMessage] = useState("");
  const [replyToEactId] = useState(""); // <- useState, not plain string
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");
  const { caseId, caseSubject } = useContext(CaseContext);

const loadMessages = async () => {
  if (!caseId) return;
  try {
    const data = await getMessages(caseId); // use the imported one
    setMessages(data);
  } catch (err) {
    console.error("Feil ved henting av meldinger:", err);
  }
};

  const handleSendMessage = async (event) => {
    event.preventDefault();

    try {
      await postMessage({ message, caseId, caseSubject, replyToEactId });
      setMessage(""); // clear editor after send
      setError("");
      await loadMessages(); // refresh messages
    } catch (err) {
      setError(err.message || "Feil ved sending av melding");
    }
  };

useEffect(() => {
  loadMessages();
});

  return (
    <div className={styles.chatContainer}>
      {caseId ? (
        <>
          <MessageDetails />
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
              <h3 className={styles.subjectline}>{subject}</h3>
              <ul className={styles.messageList}>
                {msgs.map((msg) => (
                  <li key={msg.eactId} className={styles.messageItem}>
                    <div
                      className={`${styles.messageBubble} ${
                        msg.direction === 2 ? styles.outgoing : styles.incoming
                      }`}
                    >
                      <div dangerouslySetInnerHTML={{ __html: msg.body }} />
                    </div>
                    <div className={styles.timestamp}>
                      {new Date(msg.timestamp).toLocaleString("nb-NO", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <form onSubmit={handleSendMessage} className={styles.messageForm}>
            <TextEditor value={message} onChange={setMessage} />
            {error && <p style={{ color: "red" }}>{error}</p>}
            <button type="submit">Send</button>
          </form>
        </>
      ) : (
        <div className={styles.emptyState}>
          <BsEnvelope className={styles.emptyIcon} />
          <p className={styles.emptyText}>Ingen sak er valgt</p>
        </div>
      )}
    </div>
  );
}

export default Message;
