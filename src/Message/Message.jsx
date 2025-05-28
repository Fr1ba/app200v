import React, { useContext, useEffect, useState, useRef } from "react";
import { BsEnvelope, BsArrowLeft } from "react-icons/bs";
import DOMPurify from "dompurify";
import styles from "./Message.module.css";
import TextEditor from "../TextEditor/TextEditor.jsx";
import MessageDetails from "./MessageDetails.jsx";
import ImageModal from "../TextEditor/ImageModal.jsx"; // Import the new component
import { CaseContext } from "../SelectedCase.jsx";
import { postMessage, getMessages } from "../api/messageApi.js";

function Message() {
  const [message, setMessage] = useState("");
  const replyToEactId = "";
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  
  // Image modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  
  const { caseId, caseSubject } = useContext(CaseContext);
  const textEditorRef = useRef();

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
    
    // Check for content using the enhanced validation
    const hasTextContent = message.replace(/<[^>]*>/g, '').trim().length > 0;
    const hasImages = message.includes('<img');
    
    if (!hasTextContent && !hasImages) {
      setError("Meldingen kan ikke være tom");
      return;
    }
    
    try {
      await postMessage({ message, caseId, caseSubject, replyToEactId });
      setMessage("");
      setError("");
      await loadMessages();
    } catch (err) {
      setError(err.message || "Feil ved sending av melding");
    }
  };

  // Handle image clicks using event delegation
  const handleImageClick = (imageSrc) => {
    setSelectedImage(imageSrc);
    setIsModalOpen(true);
  };

  // Use event delegation to handle image clicks
  useEffect(() => {
    const chatContainer = document.querySelector(`.${styles.chatContainer}`);
    
    const handleClick = (e) => {
      // Check if clicked element is an image inside a message bubble
      if (e.target.tagName === 'IMG' && e.target.closest(`.${styles.messageBubble}`)) {
        e.preventDefault();
        e.stopPropagation();
        handleImageClick(e.target.src);
      }
    };

    if (chatContainer) {
      chatContainer.addEventListener('click', handleClick);
      
      // Also ensure all images have pointer cursor
      const updateImageStyles = () => {
        const messageImages = chatContainer.querySelectorAll(`.${styles.messageBubble} img`);
        messageImages.forEach(img => {
          img.style.cursor = 'pointer';
        });
      };
      
      updateImageStyles();
      
      // Update styles when messages change
      const observer = new MutationObserver(updateImageStyles);
      observer.observe(chatContainer, { childList: true, subtree: true });
      
      return () => {
        chatContainer.removeEventListener('click', handleClick);
        observer.disconnect();
      };
    }
  }, [caseId]); // Depend on caseId instead of messages

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
                onClick={() => setIsVisible(false)}
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
      
      {/* Image Modal */}
      <ImageModal
        isOpen={isModalOpen}
        imageUrl={selectedImage}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

export default Message;