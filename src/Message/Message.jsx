import React, { useContext, useEffect, useState, useRef } from "react";
import { BsEnvelope, BsSend } from "react-icons/bs";

import DOMPurify from "dompurify";
import styles from "./Message.module.css";
import TextEditor from "../TextEditor/TextEditor.jsx";
import MessageDetails from "./MessageDetails.jsx";
import { CaseContext } from "../SelectedCase.jsx";
import { postMessage, getMessages } from "../api/messageApi.js";

/**
 * Displays a threaded message view for a selected case.
 * Includes message fetching, displaying, and sending functionality.
 * Sanitizes message content before rendering to prevent XSS.
 *
 * @component
 * @returns {JSX.Element} The message thread UI.
 * @author Trudy
 * @author Oda
 */
function Message() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const bottomRef = useRef(null);
  const { caseId, caseSubject } = useContext(CaseContext);

  /**
   * Loads messages for the current case.
   * Does nothing if no caseId is provided.
   * Logs errors to console on failure.
   *
   * @async
   * @author Oda
   */
  const loadMessages = async () => {
    if (!caseId) return;
    try {
      const data = await getMessages(caseId);
      setMessages(data);
    } catch (err) {
    setError("Feil ved henting av meldinger: " + err.message);
  }
};

  /**
   * Handles sending a new message.
   * - Prevents default form submission behavior.
   * - Sends the message using the postMessage API.
   * - Clears the input and error state on success.
   * - Reloads messages, which triggers scroll-to-bottom via a separate effect.
   *
   * @async
   * @param {React.FormEvent<HTMLFormElement>} event - The form submission event.
   * @author Trudy
   */
  const handleSendMessage = async (event) => {
    event.preventDefault();

    const temp = document.createElement("div");
    temp.innerHTML = message;
    const plainText = temp.innerText.trim();
    const hasImage = message.includes("<img");

    if (!plainText && !hasImage) {
      setError("Meldingen kan ikke være tom.");
      return;
    }

    setError("");

    try {
      await postMessage({ message, caseId, caseSubject, replyToEactId: "" });
      setMessage("");
      setError("");
      await loadMessages();
    } catch (err) {
      setError("Feil ved sending av melding" + err.message);
    }
  };

  useEffect(() => {
    setIsVisible(true);
    loadMessages();
  }, [caseId]);

  useEffect(() => {
    if (messages.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: "auto" });
    }
  }, [messages]);

  return (
    <div className={styles.chatContainer}>
      {caseId && isVisible ? (
        <>
          {messages.length > 0 && (
            <div className={styles.headerContainer}>
              <button
                className={styles.backButton}
                onClick={() => setIsVisible(false)}
                aria-label="Tilbake"
              />
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
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(msg.body) }}
                />
                <div className={styles.timestamp}>
                  {new Date(msg.timestamp).toLocaleString("nb-NO", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </div>
              </li>
            ))}
            <div ref={bottomRef} /> {/*This is the scroll target */}
          </ul>

          <div className={styles.messageForm}>
            <form onSubmit={handleSendMessage}>
              <TextEditor value={message} onChange={setMessage} />
              <button className={styles.sendButton} type="submit" aria-label="Send melding">
                <BsSend />
              </button>
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}
          </div>
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
