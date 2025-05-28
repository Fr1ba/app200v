import React, { useContext, useEffect, useState, useRef } from "react";
import { BsEnvelope, BsArrowLeft } from "react-icons/bs";
import DOMPurify from "dompurify";
import styles from "./Message.module.css";
import TextEditor from "../TextEditor/TextEditor.jsx";
import MessageDetails from "./MessageDetails.jsx";
import { CaseContext } from "../SelectedCase.jsx";
import { postMessage, getMessages } from "../api/messageApi.js";

/**
 * A component for displaying and sending messages related to a case.
 * @example
 * <Message />
 * @returns {ReactElement} The component.
 * @author Trudy
 * @author Oda
 */
function Message() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");
  const [isVisible, setIsVisible] = useState(true);

  const { caseId, caseSubject } = useContext(CaseContext);
  const textEditorRef = useRef();

  /**
   * Fetches messages for the current case and sets the state with the data.
   * If the case ID is not set, the function does nothing.
   * If the API call fails, an error is logged to the console.
   * @async
   * @function loadMessages
   *
   */
  const loadMessages = async () => {
    if (!caseId) return;
    try {
      const data = await getMessages(caseId);
      setMessages(data);
    } catch (err) {
      console.error("Feil ved henting av meldinger:", err);
    }
  };

  /**
   * Handles the event when a message is sent.
   * Prevents the default form submission behavior.
   * Attempts to send the message using the postMessage API.
   * Clears the message input and error state upon successful submission.
   * Reloads the message list to reflect the newly sent message.
   * If the API call fails, sets an error message state.
   * @async
   * @param {Event} event - The form submission event.
   */
  const handleSendMessage = async (event) => {
    event.preventDefault();

    try {
      await postMessage({ message, caseId, caseSubject, replyToEactId: "" });
      setMessage("");
      setError("");
      await loadMessages();
    } catch (err) {
      setError(err.message || "Feil ved sending av melding");
    }
  };

  useEffect(() => {
    setIsVisible(true);
    loadMessages();
  }, [caseId]);

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
              >
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
            <TextEditor ref={textEditorRef} value={message} onChange={setMessage} />
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
