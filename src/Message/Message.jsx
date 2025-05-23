import React, {useContext, useEffect, useState} from "react";
import styles from "./Message.module.css";
import TextEditor from "../TextEditor/TextEditor.jsx";
import MessageDetails from "./MessageDetails.jsx";
import {CaseContext} from "../SelectedCase.jsx";

const endpoint = "https://app06.itxnorge.no";

function Message() {
    const [message, setMessage] = useState("");
    const [caseEactId, setCaseEactId] = useState("");
    const [replyToEactId, setReplyToEactId] = useState("");
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState("");

    const { caseId, caseSubject } = useContext(CaseContext);

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
    subject: caseSubject, // use selected subject
    body: message,
    createCase: false,
    caseEactId: caseId,
    ...(replyToEactId && { replyToEactId })
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
            await fetchMessages();
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    useEffect(() => {
        setCaseEactId(caseId);
    }, [caseId]);

    const fetchMessages = async () => {
        if (!caseEactId) return;
        try {
            const response = await fetch(`${endpoint}/rest/itxems/message/search`, {
                method: "POST",
                credentials: "include",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    getConversations: false,
                    getContent: true,
                    draft: false,
                    caseEactId: caseId,
                }),
            });

            if (!response.ok)
                throw new Error(`HTTP error! Status: ${response.status}`);

            const data = await response.json();
            const sorted = data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
            setMessages(sorted);
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };

    useEffect(() => {
        fetchMessages(caseId);
    }, [caseEactId]);

    return (
        <div className={styles.chatContainer}>
            <MessageDetails/>
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
                        <div className={`${styles.messageBubble} ${msg.direction === 2 ? styles.outgoing : styles.incoming}`}>
                          <div dangerouslySetInnerHTML={{__html: msg.body}} />
                        </div>
                        <div className={styles.timestamp}>
                          {new Date(msg.timestamp).toLocaleString('nb-NO', {
                            dateStyle: 'short',
                            timeStyle: 'short',
                          })}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
            ))}

            <form onSubmit={handleSubmit} className={styles.messageForm}>
                <TextEditor value={message} onChange={setMessage}/>
                {error && <p style={{color: "red"}}>{error}</p>}
                <button type="submit">Send</button>
            </form>
        </div>
    );
}

export default Message;
