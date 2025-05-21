import React, { useEffect, useState } from "react";

function MessageDetails() {
  const [caseDetails, setCaseDetails] = useState(null);

  const fetchCaseDetails = () => {
    const mockDetails = {
      caseWorker: "Anna Hansen",
      openedDate: "10.06.2024",
      priority: "Høy",
      category: "Retur",
    };
    setCaseDetails(mockDetails);
  };
  return (
    <div>
      <button onClick={fetchCaseDetails}>Vis saksdetaljer</button>
      {caseDetails && (
        <div className={styles.caseDetails}>
          <h4>Saksdetaljer</h4>
          <p>
            <strong>Saksbehandler:</strong> {caseDetails.caseWorker}
          </p>
          <p>
            <strong>Åpnet:</strong> {caseDetails.openedDate}
          </p>
          <p>
            <strong>Prioritet:</strong> {caseDetails.priority}
          </p>
          <p>
            <strong>Kategori:</strong> {caseDetails.category}
          </p>
        </div>
      )}
    </div>
  );
}
export default MessageDetails;
