import { useState } from 'react';
import styles from './CreateCase.module.css';

function CreateCase() {
  const [inputs, setInputs] = useState({
    subject: '',
    category: '',
    details: ''
  });

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs(values => ({ ...values, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    alert(`A new ${inputs.category.toLowerCase()} "${inputs.subject}" is opened and is pending.`);
  };

  return (
    <div id={styles.mainContainer}>
      <h1>Create a New Case</h1>
      <form onSubmit={handleSubmit}>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label id={styles.subjectLabel}>Subject:</label>
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
            <label id={styles.categoryLabel}>Category:</label>
            <select
              id={styles.categoryInput}
              name="category"
              value={inputs.category}
              onChange={handleChange}
              required
            >
              <option value="" disabled hidden>Select a category...</option>
              <option value="Return">Return</option>
              <option value="Claim">Claim</option>
            </select>
          </div>
        </div>
        <div className={styles.formGroup}>
          <label id={styles.detailsLabel}>Details:</label>
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
          value="Create Case" 
          id={styles.createButton} 
        />
      </form>
    </div>
  );
}

export default CreateCase;
