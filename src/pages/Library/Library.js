import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Library.css";

function Library() {
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;

  const [notes, setNotes] = useState([]);
  const [exam, setExam] = useState("");
  const [subject, setSubject] = useState("");
  const [extractingId, setExtractingId] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Added loading state

  /* ================= FETCH SUBJECTS ================= */
  const fetchSubjects = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/api/notes`, { params: { exam } });
      const uniqueSubjects = [
        ...new Set(res.data.notes.map((n) => n.subject).filter(Boolean)),
      ];
      setSubjects(uniqueSubjects);
    } catch (err) {
      console.error("Failed to load subjects", err);
    }
  }, [API_URL, exam]);

  /* ================= FETCH NOTES ================= */
  const fetchNotes = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/notes`, {
        params: { exam, subject, page: 1 },
      });
      setNotes(res.data.notes);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [API_URL, exam, subject]);

  useEffect(() => {
    fetchNotes();
    fetchSubjects();
  }, [fetchNotes, fetchSubjects]);

  /* ================= DELETE DOCUMENT ================= */
  const deleteNote = async (id) => {
    if (!window.confirm("⚠️ Are you sure? This deletes the document and all its questions.")) return;
    try {
      await axios.delete(`${API_URL}/api/notes/${id}`);
      fetchNotes();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  /* ================= EXTRACT QUESTIONS ================= */
  const extractQuestions = async (noteId) => {
    try {
      setExtractingId(noteId);
      const res = await axios.post(`${API_URL}/api/extract/${noteId}`);
      alert(`✅ ${res.data.total} questions extracted!`);
      fetchNotes(); // Refresh to update "extracted" status and question count
    } catch (err) {
      console.error(err);
      alert("Extraction failed. Ensure the document is readable.");
    } finally {
      setExtractingId(null);
    }
  };

  return (
    <div className="libraryPage">
      <div className="libraryContainer">
        <h1 className="title">Knowledge Library</h1>

        {/* FILTERS */}
        <div className="filters">
          <select value={exam} onChange={(e) => setExam(e.target.value)}>
            <option value="">All Exams</option>
            <option value="CUET PG">CUET PG</option>
          </select>

          <select value={subject} onChange={(e) => setSubject(e.target.value)}>
            <option value="">All Subjects</option>
            {subjects.map((sub) => (
              <option key={sub} value={sub}>
                {sub.replace(/\b\w/g, (l) => l.toUpperCase())}
              </option>
            ))}
          </select>
        </div>

        {/* LOADING & EMPTY STATES */}
        {isLoading ? (
          <div className="loading">Loading your library...</div>
        ) : notes.length === 0 ? (
          <p className="empty">No documents found matching your filters.</p>
        ) : (
          <div className="notesGrid">
            {notes.map((note) => (
              <div key={note._id} className="noteCard">
                <div className="noteHeader">
                  <h3>{note.title || "Untitled Document"}</h3>
                  <span className={`badge ${note.type}`}>{note.type?.toUpperCase()}</span>
                </div>

                <div className="meta">
                  {note.exam && <span>{note.exam}</span>}
                  {note.subject && <span> {note.subject.toUpperCase()} </span>}
                  {note.questionCount > 0 && (
                    <span className="qCount">{note.questionCount} Questions</span>
                  )}
                </div>

                {/* ACTION BUTTONS */}
                <div className="actionGroup">
                  {/* Logic: Only show AI extraction for PYQs that haven't been extracted yet */}
                  {note.type === "pyq" && (
                    <button
                      className="extractBtn"
                      disabled={extractingId === note._id || note.extracted}
                      onClick={() => extractQuestions(note._id)}
                    >
                      {note.extracted
                        ? "Extracted ✅"
                        : extractingId === note._id
                        ? "Extracting..."
                        : "Extract Questions"}
                    </button>
                  )}

                  <button 
                    className="secondaryBtn"
                    onClick={() => navigate(`/add-question/${note._id}`)}
                  >
                    Add Q
                  </button>

                  <button 
                    className="manageBtn"
                    onClick={() => navigate(`/manage/${note._id}`)}
                  >
                    Manage
                  </button>

                  <button
                    className="practiceBtn"
                    disabled={!note.extracted && note.questionCount === 0}
                    onClick={() => navigate(`/practice/${note._id}`)}
                  >
                    Practice
                  </button>
                </div>

                <button className="deleteBtn" onClick={() => deleteNote(note._id)}>
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Library;