// SendMessage.jsx
import React, { useEffect, useState } from "react";

const endpoint = "https://app06.itxnorge.no";

function SendMessage() {
  const [message, setMessage] = useState("");
  const [caseEactId, setCaseEactId] = useState("");
  const [replyToEactId, setReplyToEactId] = useState("");
  const [messages, setMessages] = useState([]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = {
      direction: 2,
      subject: "Reklamasjon",
      body: message,
      createCase: false,
      caseEactId: 3453451,
      replyToEactId: 3453465
    };

    const formData = new FormData();
    const jsonBlob = new Blob([JSON.stringify(data)], {
      type: "application/json",
    });

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

  // Lese meldinger
useEffect(() => {

  const fetchMessages = async () => {
    if (!caseEactId) return;

    try {
      const response = await fetch(`${endpoint}/rest/itxems/message/case/${caseEactId}`, {
        method: "POST",
        credentials: "include",
        header: {
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

        if(data.length === 0) {
          console.log("Ingen meldinger"); 
        } else {
          setMessages(data);
          console.log(data);
        }

      }catch (error) {
        console.error("Error fetching messages:", error);
      }
  };

  fetchMessages();
}, []);




  return (
    <><form onSubmit={handleSubmit}>
      <label>
        Melding
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)} />
      </label>
      <button type="submit">Send</button>
    </form>

    <h3>Alle meldinger i sak {caseEactId}</h3>
      <ul>
        {messages.map((msg) => (
          <li key={msg.eactId}>
            <strong>{msg.subject || "(uten tittel)"}</strong><br />
            <em>{msg.body}</em>
          </li>
        ))}
      </ul>
      </>
  
  );
}


export default Message;
