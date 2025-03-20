import { useState } from 'react';
import ReactDOM from 'react-dom/client';
import styles from './createCase.module.css';

function CreateCase() {
  const [inputs, setInputs] = useState({
    emne: '',
    kategori: '',
    detaljer: ''
  });

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs(values => ({ ...values, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    alert(JSON.stringify(inputs));
  };

  return (
    <div id={styles.mainContainer}>
      <h1>Opprett en ny sak</h1>

      <form onSubmit={handleSubmit}>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label id="emneLabel">Emne:</label>
            <input 
              type="text" 
              id="emneInput"
              name="emne" 
              value={inputs.emne} 
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label id="kategoriLabel">Kategori:</label>
            <select 
              id="kategoriInput" 
              name="kategori" 
              value={inputs.kategori} 
              onChange={handleChange}
              required
            >
              <option value="" disabled hidden>Velg en kategori...</option>
              <option value="Retur">Retur</option>
              <option value="Reklamasjon">Reklamasjon</option>
            </select>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label id="detaljerLabel">Detaljer:</label>
          <textarea
            id="detaljerInput"
            name="detaljer"
            value={inputs.detaljer}
            onChange={handleChange}
            required
              />
        </div>

        <input type="submit" value="Opprett sak" id={styles.oprettKnapp} />
      </form>
    </div>
  );
}



export default CreateCase;
