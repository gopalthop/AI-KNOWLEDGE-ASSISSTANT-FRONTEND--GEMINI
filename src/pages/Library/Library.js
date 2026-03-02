import React, {
  useEffect,
  useState,
  useCallback
} from "react";

import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Library.css";

function Library() {

  const navigate = useNavigate();

  const API_URL =
    process.env.REACT_APP_API_URL;

  const [notes, setNotes] = useState([]);
  const [exam, setExam] = useState("");
  const [subject, setSubject] = useState("");
  const [extractingId, setExtractingId] =
    useState(null);

  /* ================= FETCH NOTES ================= */

  const fetchNotes = useCallback(async () => {
    try {

      const res = await axios.get(
        `${API_URL}/api/notes`,
        {
          params: { exam, subject }
        }
      );

      setNotes(res.data.notes);

    } catch (err) {
      console.error(err);
    }
  }, [API_URL, exam, subject]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  /* ================= DELETE ================= */

  const deleteNote = async (id) => {
    try {
      await axios.delete(
        `${API_URL}/api/notes/${id}`
      );

      fetchNotes();

    } catch (err) {
      console.error(err);
    }
  };

  /* ================= EXTRACT ================= */

  const extractQuestions = async (noteId) => {

    try {

      setExtractingId(noteId);

      const res = await axios.post(
        `${API_URL}/api/extract/${noteId}`
      );

      alert(
        `✅ ${res.data.total} questions extracted`
      );

      fetchNotes();

    } catch (err) {

      console.error(err);
      alert("Extraction failed");

    } finally {
      setExtractingId(null);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="libraryPage">

      <div className="libraryContainer">

        <h1 className="title">
          Knowledge Library
        </h1>

        {/* FILTERS */}
        <div className="filters">

          <select
            value={exam}
            onChange={(e)=>
              setExam(e.target.value)
            }
          >
            <option value="">
              All Exams
            </option>
            <option value="CUET PG">
              CUET PG
            </option>
          </select>

          <select
            value={subject}
            onChange={(e)=>
              setSubject(e.target.value)
            }
          >
            <option value="">
              All Subjects
            </option>
            <option value="Computer Science">
              Computer Science
            </option>
          </select>

        </div>

        {/* EMPTY STATE */}
        {notes.length === 0 && (
          <p className="empty">
            No documents found.
          </p>
        )}

        {/* NOTES */}
        {notes.map((note) => (

          <div
            key={note._id}
            className="noteCard"
          >

            <h3>
              {note.title || "Untitled"}
            </h3>

            <div className="meta">
              {note.exam && <span>{note.exam}</span>}
              {note.subject && <span>{note.subject}</span>}
              {note.type && <span>{note.type}</span>}
              {note.year && <span>{note.year}</span>}
            </div>

            <p className="preview">
              {note.text?.slice(0,200)}...
            </p>

            {/* ===== PYQ ACTIONS ===== */}
            {note.type === "pyq" && (

              <div className="actionGroup">

                {/* EXTRACT */}
                <button
                  className="extractBtn"
                  disabled={
                    extractingId === note._id
                    || note.extracted
                  }
                  onClick={() =>
                    extractQuestions(note._id)
                  }
                >
                  {note.extracted
                    ? "Extracted ✅"
                    : extractingId === note._id
                    ? "Extracting..."
                    : "Extract Questions"}
                </button>

                {/* ADD MANUAL */}
                <button
                  onClick={() =>
                    navigate(
                      `/add-question/${note._id}`
                    )
                  }
                >
                  Add Question
                </button>

                {/* MANAGE */}
                <button
                  onClick={() =>
                    navigate(
                      `/manage/${note._id}`
                    )
                  }
                >
                  Manage Questions
                </button>

                {/* PRACTICE */}
                <button
                  className="practiceBtn"
                  disabled={!note.extracted}
                  onClick={() =>
                    navigate(
                      `/practice/${note._id}`
                    )
                  }
                >
                  {note.extracted
                    ? "Start Practice"
                    : "Extract First"}
                </button>

              </div>
            )}

            {/* DELETE */}
            <button
              className="deleteBtn"
              onClick={() =>
                deleteNote(note._id)
              }
            >
              Delete
            </button>

          </div>

        ))}

      </div>
    </div>
  );
}

export default Library;