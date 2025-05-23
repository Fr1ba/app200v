import { useState } from 'react';
import styles from './CreateCase.module.css';
import TextEditor from "../TextEditor/TextEditor.jsx";

const endpoint = "https://app06.itxnorge.no";

function CreateCase() {
  const [inputs, setInputs] = useState({
    subject: '',
    category: '',
    details: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  /*const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs(values => ({ ...values, [name]: value }));
  };*/
  const handleChange = (eventOrHtml, maybeFieldName) => {
    if (typeof eventOrHtml === 'string' && maybeFieldName) {
      setInputs(values => ({ ...values, [maybeFieldName]: eventOrHtml }));
    } else {
      const { name, value } = eventOrHtml.target;
      setInputs(values => ({ ...values, [name]: value }));
    }
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {

      const formData = new FormData();

      const messageData = {
        direction: 2,
        subject: inputs.subject,
        body: inputs.details, 
        createCase: true 
      };

      const jsonBlob = new Blob([JSON.stringify(messageData)], {
        type: 'application/json'
      });

      formData.append('data',jsonBlob);
      
      
      const response = await fetch(`${endpoint}/rest/itxems/message`, {
        method: 'POST',
        credentials: 'include',
        body: formData
      });


      if (!response.ok) {
        throw new Error(`API-forespørselen mislyktes med status ${response.status}`);
      }


    const responseData = await response.json();
    console.log("Sak opprettet:", responseData);


    setInputs({
      subject: '',
      category: '',
      details: ''
    });

    setSuccess(true);
  } catch (error) {
    console.error("Feil ved opprettelse av sak:", error);
    setError(error.message || "Kunne ikke opprette sak. Vennligst prøv igjen.");
  } finally {
    setIsSubmitting(false);
  }
};

 return (
    <div className={styles.pageContainer}>
      <div className={styles.wrapper}>
        <div className={styles.title}>
          <h1>Opprett ny sak</h1>
        </div>
        
        {error && <div className={styles.errorMessage}>{error}</div>}
        {success && <div className={styles.successMessage}>Saken din er opprettet!</div>}
        
        <div className={styles.contentContainer}>
          <form onSubmit={handleSubmit}>
            <div className={styles.formRow}>
              <div className={styles.inputField}>
                <label className={styles.inputLabel}>Emne:</label>
                <input
                  type="text"
                  name="subject"
                  value={inputs.subject}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className={styles.inputField}>
                <label className={styles.inputLabel}>Kategori:</label>
                <select
                  name="category"
                  value={inputs.category}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled hidden>Velg kategori...</option>
                  <option value="Return">Retur</option>
                  <option value="Claim">Reklamasjon</option>
                </select>
              </div>
            </div>
            
            <div className={styles.inputField}>
              <label className={styles.inputLabel}>Detaljer:</label>
              <TextEditor
                name="details"
                value={inputs.details}
                onChange={handleChange}
                required
                className={styles.textareaField}
              />
            </div>
            
            <div className={styles.buttonContainer}>
              <button
                type="submit"
                className={styles.SubmitButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Oppretter..." : "Opprett sak"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateCase;