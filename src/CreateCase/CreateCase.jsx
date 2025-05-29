import { useState } from 'react';
import styles from './CreateCase.module.css';
import TextEditor from "../TextEditor/TextEditor.jsx";
import { createCase } from '../api/caseApi';

/**
 * @component
 * Form page for creating a new case with subject, category, and rich text details.
 * Handles input changes, form submission, and displays feedback messages.
 *
 * @returns The CreateCase component.
 */
function CreateCase() {
  const [inputs, setInputs] = useState({
    subject: '',
    category: '',
    details: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  /**
   * Handles input changes for both standard form fields and the custom text editor.
   *
   * @function
   * @param {Event|string} eventOrHtml - Event from input/select or HTML string from the text editor.
   * @param {string} maybeFieldName - Optional field name used for rich text input.
   * @author Nikola Deja
   */
  const handleChange = (eventOrHtml, maybeFieldName) => {
    if (typeof eventOrHtml === 'string' && maybeFieldName) {
      setInputs(values => ({ ...values, [maybeFieldName]: eventOrHtml }));
    } else {
      const { name, value } = eventOrHtml.target;
      setInputs(values => ({ ...values, [name]: value }));
    }
  };

  /**
   * Handles form submission to create a new case via the API.
   *
   * Sends the form data, resets input fields on success,
   * and displays feedback messages based on the result.
   *
   * @function
   * @param event - The form submission event.
   * @returns {Promise<void>}
   * @author Stine Skroder
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const responseData = await createCase({
        subject: inputs.subject,
        details: inputs.details,
      });
      
      console.log("Sak opprettet:", responseData);

      setInputs({
        subject: '',
        category: '',
        details: ''
      });

      console.log("Full API response:", responseData);
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
                onChange={(html) => handleChange(html, 'details')}
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