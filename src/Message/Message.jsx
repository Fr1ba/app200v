// SendMessage.jsx
import React, { useEffect, useState } from "react";
import styles from "./Message.module.css";

const endpoint = "https://app06.itxnorge.no";

function Message() {
  const [message, setMessage] = useState("");
  const [caseEactId, setCaseEactId] = useState("");
  const [replyToEactId, setReplyToEactId] = useState("");
  const [messages, setMessages] = useState([]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Send messages
    
    // Have temporarily hardcoded the caseEactId and replyToEactId
    // This will be changed to the actual caseEactId and replyToEactId
    // when the user clicks on a case
    const data = {
      direction: 2,
      subject: "Reklamasjon",
      body: message,
      createCase: false,
      caseEactId: 3453451,
      replyToEactId: 3453465
    };

    // Convert the data object to a JSON string 
    // and then embed that into a FormData object
    // I think this is needed because the data is in JSON format,
    // but the endpoint is expecting a FormData object
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
      console.log(responseData);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Read messages
  useEffect(() => {
    setCaseEactId(3453451); // Set it here
  }, []);
  
  useEffect(() => {
    const fetchMessages = async () => {
      if (!caseEactId) return;
  
      try {
        const response = await fetch(`${endpoint}/rest/itxems/message/search`, {
          method: "POST",
          credentials: "include",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            getConversations: false,
            getContent: true,
            draft: false,
            conversationEactId: 3453453
          })
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);  
        }
  
        const data = await response.json();
        console.log("Messages:", data);
  
        if (data.length === 0) {
          console.log("Ingen meldinger");
        } else {
          setMessages(data);
        }
  
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
  
    fetchMessages();
  }, [caseEactId]);
  




  return (
    <>
      <div className={styles.rightContainer}>
        <h3>Meldinger{caseEactId}</h3>
          <ul>
            {messages.map((msg) => (
              <li key={msg.eactId}>
                <strong>{msg.subject || "(uten tittel)"}</strong><br />
                <em>{msg.body}</em>
              </li>
            ))}
          </ul>

        <form onSubmit={handleSubmit} className={styles.messageForm}>
          <label>
            Skriv inn din melding her
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)} />
          </label>
          <button type="submit">Send</button>
        </form>
      </div>
    </>
  
  );
}


export default Message;
