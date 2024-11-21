import React, { useState } from "react";
import axios from "axios";
import Select from "react-select";
import "./App.css";

const App = () => {
  const [apiInput, setApiInput] = useState("");
  const [response, setResponse] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [error, setError] = useState(null);

  const filterOptions = [
    { value: "alphabets", label: "Alphabets" },
    { value: "numbers", label: "Numbers" },
    { value: "highest_lowercase_alphabet", label: "Highest Lowercase Alphabet" },
  ];

  const handleSubmit = async () => {
    setError(null); // Reset any previous error

    try {
      const parsedJson = JSON.parse(apiInput); // Validate JSON input

      // Call your Django backend
      const response = await axios.post("https://bajaj-flpw.onrender.com/bfhl/", parsedJson); // Adjust the URL to match your backend endpoint
      setResponse(response.data); // Set the API response
    } catch (err) {
      // Error handling for invalid JSON or API issues
      if (err.response) {
        setError(`API Error: ${err.response.data.message || "Something went wrong"}`);
      } else if (err instanceof SyntaxError) {
        setError("Invalid JSON format. Please try again.");
      } else {
        setError("Unable to connect to the backend.");
      }
    }
  };

  const getFilteredResponse = () => {
    if (!response || selectedFilters.length === 0) return null;

    const filtered = selectedFilters.map((filter) => {
      const key = filter.value;
      return `${filter.label}: ${response[key]?.join(",") || "N/A"}`;
    });

    return filtered.join(" | ");
  };

  return (
    <div className="app-container">
      <textarea
        className="json-input"
        placeholder='Enter JSON Input (e.g., {"data": ["M", "1", "334", "4", "B"]})'
        value={apiInput}
        onChange={(e) => setApiInput(e.target.value)}
      />
      <button className="submit-button" onClick={handleSubmit}>
        Submit
      </button>
      {error && <p className="error">{error}</p>}
      {response && (
        <div>
          <Select
            isMulti
            options={filterOptions}
            className="multi-select"
            placeholder="Multi Filter"
            onChange={(selected) => setSelectedFilters(selected || [])}
          />
          <div className="filtered-response">
            <h3>Filtered Response</h3>
            <p>{getFilteredResponse()}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
