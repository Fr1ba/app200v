import React, { useContext, useEffect, useState } from "react";
import { BsEnvelope, BsArrowLeft } from "react-icons/bs";
import DOMPurify from "dompurify";
import styles from "./Message.module.css";
import TextEditor from "../TextEditor/TextEditor.jsx";
import MessageDetails from "./MessageDetails.jsx";
import { CaseContext } from "../SelectedCase.jsx";
import { postMessage, getMessages } from "../api/messageApi.js";
function Message() {
  const [message, setMessage] = useState("");
  const replyToEactId = ""; // eller useState hvis du trenger det senere
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 991);
  const { caseId, caseSubject, setCaseId } = useContext(CaseContext);

  // Lytt til window resize events
useEffect(() => {
  const handleResize = () => {
    setIsMobile(window.innerWidth <= 991);
  };

  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);

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

  const handleBackClick = () => {
    if (isMobile) {
      // På mobile/tablet: skjul message og vis caselist
      setCaseId(null);
    } else {
      // På desktop: bare skjul message
      setIsVisible(false);
    }
  };

  useEffect(() => {
    if (caseId) {
      setIsVisible(true);
      loadMessages();
    }
  }, [caseId]);
  return (
    <div className={styles.chatContainer}>
      {caseId && isVisible ? (
        <>
          {messages.length > 0 && (
            <div className={styles.headerContainer}>
              <button
                className={styles.backButton}
                onClick={handleBackClick}
                aria-label="Tilbake"
              >
                <BsArrowLeft />
              </button>
              <h3 className={styles.subjectline}>
                {messages[0].subject || caseSubject || "(uten tittel)"}
              </h3>
              <div className={styles.details}>
                <MessageDetails />
              </div>
            </div>
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
            <button className={styles.sendButton} type="submit">Send</button>
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