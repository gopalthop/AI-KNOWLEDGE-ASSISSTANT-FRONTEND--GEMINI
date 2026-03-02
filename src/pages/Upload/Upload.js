import React, { useState } from "react";
import axios from "axios";
import "./Upload.css";

function Upload() {

  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [exam, setExam] = useState("");
  const [subject, setSubject] = useState("");
  const [type, setType] = useState("");
  const [year, setYear] = useState("");

  const [loading, setLoading] = useState(false);
  const [fileLoading, setFileLoading] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL;

  /* ===========================
     TEXT UPLOAD
  =========================== */
  const handleTextUpload = async () => {

    if (!text || !exam || !type) {
      alert("Please fill required fields");
      return;
    }

    setLoading(true);

    try {
      await axios.post(`${API_URL}/api/upload`, {
        title,
        text,
        exam,
        subject,
        type,
        year
      });

      alert("Knowledge saved ✅");

      setText("");
      setTitle("");

    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }

    setLoading(false);
  };

  /* ===========================
     FILE UPLOAD
  =========================== */
  const handleFileUpload = async (e) => {

    const file = e.target.files[0];
    if (!file) return;

    if (!exam || !type) {
      alert("Select Exam & Type first");
      return;
    }

    setFileLoading(true);

    const formData = new FormData();

    formData.append("file", file);
    formData.append("title", file.name);
    formData.append("exam", exam);
    formData.append("subject", subject);
    formData.append("type", type);
    formData.append("year", year);

    try {

      await axios.post(
        `${API_URL}/api/upload-pdf`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      alert("File uploaded successfully ✅");

    } catch (err) {
      console.error(err);
      alert("File upload failed");
    }

    setFileLoading(false);
  };

  return (
    <div className="uploadPage">

      <section className="pageCenter">

        <h1 className="pageTitle">Upload Knowledge</h1>

        <div className="glassBox">

          {/* ---------- METADATA ---------- */}

          <h3>Document Details</h3>

          <input
            placeholder="Title"
            value={title}
            onChange={(e)=>setTitle(e.target.value)}
          />

          <select onChange={(e)=>setExam(e.target.value)}>
            <option value="">Select Exam *</option>
            <option value="CUET PG">CUET PG</option>
          </select>

          <select onChange={(e)=>setSubject(e.target.value)}>
            <option value="">Select Subject</option>
            <option value="Custom">
              Custom
            </option>
          </select>

          <select onChange={(e)=>setType(e.target.value)}>
            <option value="">Content Type *</option>
            <option value="notes">Notes</option>
            <option value="pyq">PYQ</option>
            <option value="mock">Mock Test</option>
          </select>

          <input
            type="number"
            placeholder="Year (optional)"
            value={year}
            onChange={(e)=>setYear(e.target.value)}
          />

          <hr />

          {/* ---------- TEXT ---------- */}

          <h3>Paste Text</h3>

          <textarea
            className="textArea"
            placeholder="Paste notes or questions..."
            value={text}
            onChange={(e)=>setText(e.target.value)}
          />

          <button
            className="primaryBtn"
            onClick={handleTextUpload}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Text"}
          </button>

          <hr />

          {/* ---------- FILE ---------- */}

          <h3>Upload PDF / Excel</h3>

          <input
            type="file"
            accept=".pdf,.xlsx,.xls"
            onChange={handleFileUpload}
          />

          {fileLoading && <p>Processing file...</p>}

        </div>

      </section>
    </div>
  );
}

export default Upload;