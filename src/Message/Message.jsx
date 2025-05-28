
/**
 * Message.jsx
 *
 * This component displays a threaded message view for a selected case,
 * including:
 * - Fetching and displaying messages from the server (incoming and outgoing).
 * - A rich text editor for composing and sending new messages.
 * - Conditional rendering when no case is selected.
 *
 * Key functionality includes:
 * - DOM sanitization for safe HTML rendering.
 * - API calls to load and post messages.
 *
 * @module Message
 * @author Trudy
 * @author Oda
 */

import React, { useContext, useEffect, useState} from "react";
import { BsEnvelope, BsSend } from "react-icons/bs";

import DOMPurify from "dompurify";
import styles from "./Message.module.css";
import TextEditor from "../TextEditor/TextEditor.jsx";
import MessageDetails from "./MessageDetails.jsx";
import { CaseContext } from "../SelectedCase.jsx";
import { postMessage, getMessages } from "../api/messageApi.js";

/**
 * Displays a list of messages for the current case and allows the user to send a new message.
 * Fetches the message list from the server when the component mounts and when the user sends a new message.
 * If the case ID is not set, the component is hidden.
 * If the API call fails, an error is logged to the console.
 * @function Message
 * @param {Object} props - Component props.
 * @param {string} [props.caseId] - The ID of the case to display messages for.
 */
function Message() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");
  const [isVisible, setIsVisible] = useState(true);

  const { caseId, caseSubject } = useContext(CaseContext);

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
