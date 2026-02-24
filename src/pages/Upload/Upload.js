import React, { useState } from "react";
import axios from "axios";
import "./Upload.css";

function Upload() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  // ✅ Use environment variable for backend URL
  const API_URL =
    process.env.REACT_APP_API_URL ;

  // 1️⃣ TEXT NOTE UPLOAD
  const handleTextUpload = async () => {
    if (!text.trim()) {
      alert("Please enter some text");
      return;
    }

    setLoading(true);

    try {
      await axios.post(`${API_URL}/api/upload`, { text });

      alert("Knowledge saved successfully!");
      setText("");

    } catch (err) {
      console.error(err);
      alert("Error saving knowledge");
    }

    setLoading(false);
  };

  // 2️⃣ FILE UPLOAD (PDF + Excel)
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPdfLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post(
        `${API_URL}/api/upload-pdf`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("File uploaded successfully!");

    } catch (err) {
      console.error(err);
      alert("File upload failed");
    }

    setPdfLoading(false);
  };

  return (
    <div className="uploadPage">
      <section className="pageCenter">
        <h1 className="pageTitle">Upload Knowledge</h1>

        <p className="pageSubtitle">
          Save notes or upload documents (PDF/Excel) for AI reference
        </p>

        <div className="glassBox">

          {/* TEXT UPLOAD */}
          <h3>Enter Text Notes</h3>

          <textarea
            className="textArea"
            placeholder="Type or paste your notes here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <button
            className="primaryBtn"
            onClick={handleTextUpload}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Knowledge"}
          </button>

          <hr style={{ margin: "30px 0", opacity: 0.2 }} />

          {/* FILE UPLOAD */}
          <h3>Upload File (PDF or Excel)</h3>

          <input
            type="file"
            accept=".pdf,.xlsx,.xls"
            onChange={handleFileUpload}
          />

          {pdfLoading && <p>Processing file...</p>}

          <p className="helperText">
            Uploaded content will be stored and used by the AI assistant.
          </p>

        </div>
      </section>
    </div>
  );
}

export default Upload;