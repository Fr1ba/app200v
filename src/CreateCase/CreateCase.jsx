import { useState } from 'react';
import styles from './CreateCase.module.css';

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

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs(values => ({ ...values, [name]: value }));
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
      
     
      formData.append('data', JSON.stringify(messageData));
      
      
      const response = await fetch(`${endpoint}/rest/itxems/message`, {
        method: 'POST',
        credentials: 'include',
        headers: {
        
        },
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
    <div id={styles.mainContainer}>
      <h1>Opprett ny sak</h1>
      {error && <div className={styles.errorMessage}>{error}</div>}
      {success && <div className={styles.successMessage}>Saken din er opprettet!</div>}
      
      <form onSubmit={handleSubmit}>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label id={styles.subjectLabel}>Emne:</label>
            <input
              type="text"
              id={styles.subjectInput}
              name="subject"
              value={inputs.subject}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label id={styles.categoryLabel}>Kategori:</label>
            <select
              id={styles.categoryInput}
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
        <div className={styles.formGroup}>
          <label id={styles.detailsLabel}>Detaljer:</label>
          <textarea
            id={styles.detailsInput}
            name="details"
            value={inputs.details}
            onChange={handleChange}
            required
          />
        </div>
        <input
          type="submit"
          value={isSubmitting ? "Oppretter..." : "Opprett sak"}
          id={styles.createButton}
          disabled={isSubmitting}
        />
      </form>
    </div>
  );
}

export default CreateCase;