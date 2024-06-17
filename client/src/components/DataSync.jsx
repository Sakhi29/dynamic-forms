import React from "react";
import axios from "axios";
import "../App.css";

const DataSync = () => {
  const handleRefresh = async () => {
    try {
      const response = await axios.get("http://localhost:3000/data");
      const data = response.data;

      console.log("Data from SQL:", data);
      alert("Data synchronized with the Excel sheet");
    } catch (error) {
      console.error("Error syncing data:", error);
      alert("Failed to sync data");
    }
  };

  return (
    <div className="data-sync">
      <h2>Data Synchronization</h2>
      <button onClick={handleRefresh}>Refresh</button>
    </div>
  );
};

export default DataSync;
