import React, { useContext, useEffect, useState } from "react";
import { BsEnvelope } from "react-icons/bs";
import DOMPurify from "dompurify";

import styles from "./Message.module.css";
import TextEditor from "../TextEditor/TextEditor.jsx";
import MessageDetails from "./MessageDetails.jsx";
import { CaseContext } from "../SelectedCase.jsx";
import { postMessage, getMessages } from "../api/messageApi.js";

function Message() {
  const [message, setMessage] = useState("");
  const replyToEactId = ""; // or useState("") if you need it to change
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");
  const { caseId, caseSubject } = useContext(CaseContext);

  const loadMessages = async () => {
    if (!caseId) return;
    try {
      const data = await getMessages(caseId);
      setMessages(data);
    } catch (err) {
      console.error("Feil ved henting av meldinger:", err);
    }
  };

  const handleSendMessage = async (event) => {
    event.preventDefault();

    try {
      await postMessage({ message, caseId, caseSubject, replyToEactId });
      setMessage("");
      setError("");
      await loadMessages();
    } catch (err) {
      setError(err.message || "Feil ved sending av melding");
    }
  };

  useEffect(() => {
    loadMessages();
  }, [caseId]);

  return (
    <div className={styles.chatContainer}>
      {caseId ? (
        <>
          {messages.length > 0 && (
            <h3 className={styles.subjectline}>
              {messages[0].subject || caseSubject || "(uten tittel)"}
            </h3>
          )}
          <ul className={styles.messageList}>
            {messages.map((msg) => (
              <li key={msg.eactId} className={styles.messageItem}>
                <div
                  className={`${styles.messageBubble} ${
                    msg.direction === 2 ? styles.outgoing : styles.incoming
                  }`}
                >
                  <div
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(msg.body),
                    }}
                  />
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
