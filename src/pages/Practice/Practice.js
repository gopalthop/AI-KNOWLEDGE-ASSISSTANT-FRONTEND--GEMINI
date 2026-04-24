import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./Practice.css";

function Practice() {
  const API_URL = process.env.REACT_APP_API_URL;
  const { noteId } = useParams();

  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [review, setReview] = useState({});
  const [timeLeft, setTimeLeft] = useState(5400);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Refs to access latest state inside the timer interval without triggering re-renders
  const stateRef = useRef({ answers, questions, submitted });
  useEffect(() => {
    stateRef.current = { answers, questions, submitted };
  }, [answers, questions, submitted]);

  /* ================= FETCH QUESTIONS ================= */
  useEffect(() => {
    axios
      .get(`${API_URL}/api/practice/${noteId}`)
      .then((res) => setQuestions(res.data.questions))
      .catch(err => console.error("Fetch error:", err));
  }, [noteId, API_URL]);

  /* ================= SUBMIT LOGIC ================= */
  const submitTest = useCallback(async () => {
    const { answers: finalAnswers, questions: qList, submitted: isDone } = stateRef.current;
    
    if (isDone) return;

    let correct = 0;
    qList.forEach((q, i) => {
      if (finalAnswers[i] === q.correctAnswer) correct++;
    });

    setScore(correct);
    setSubmitted(true);

    try {
      await axios.post(`${API_URL}/api/analyze-result`, {
        answers: finalAnswers,
        noteId,
      });
    } catch (err) {
      console.error("Stats update failed", err);
    }
  }, [API_URL, noteId]);

  const handleManualSubmit = () => {
    if (window.confirm("Are you sure you want to submit the test?")) {
      submitTest();
    }
  };

  /* ================= FIXED TIMER ================= */
  useEffect(() => {
    if (submitted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          submitTest(); // Auto-submit on timeout
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [submitted, submitTest]); // Removed answers/questions dependency

  /* ================= HELPERS ================= */
  const formatTime = (t) => {
    const m = Math.floor(t / 60);
    const s = t % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const selectOption = (opt) => {
    setAnswers((prev) => ({ ...prev, [current]: opt }));
  };

  const clearResponse = () => {
    setAnswers((prev) => {
      const newAns = { ...prev };
      delete newAns[current];
      return newAns;
    });
  };

  /* ================= NAVIGATION ================= */
  const nextQ = () => { if (current < questions.length - 1) setCurrent(current + 1); };
  const prevQ = () => { if (current > 0) setCurrent(current - 1); };

  const markReview = () => {
    setReview((prev) => ({ ...prev, [current]: !prev[current] }));
  };

  if (questions.length === 0) return <div className="examPage">Loading...</div>;

  if (submitted) {
    return (
      <div className="examPage">
        <div className="resultBox">
          <h2>Test Submitted ✅</h2>
          <h3>Score: {score}/{questions.length}</h3>
          <div className="resultReview">
            {questions.map((q, i) => {
              const isCorrect = answers[i] === q.correctAnswer;
              return (
                <div key={i} className={`reviewCard ${isCorrect ? "correct" : "wrong"}`}>
                  <h4>Question {i + 1}</h4>
                  <p>{q.question}</p>
                  <p><strong>Your Answer:</strong> {answers[i] || "Not Attempted"}</p>
                  {!isCorrect && <p><strong>Correct:</strong> {q.correctAnswer}</p>}
                  {q.explanation && <p className="explanation"><strong>Why:</strong> {q.explanation}</p>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  const q = questions[current];

  return (
    <div className="examPage">
      <div className="examHeader">
        <h2>CUET PG Practice</h2>
        <div className="timer">⏱ {formatTime(timeLeft)}</div>
      </div>

      <div className="examBody">
        <div className="questionPanel">
          <h3>Question {current + 1}</h3>
          <p className="questionText">{q.question}</p>

          <div className="options">
            {q.options.map((opt, i) => (
              <button
                key={i}
                className={`option ${answers[current] === opt ? "selected" : ""}`}
                onClick={() => selectOption(opt)}
              >
                {opt}
              </button>
            ))}
          </div>

          <div className="actions">
            <button onClick={prevQ} disabled={current === 0}>Previous</button>
            <button className="reviewBtn" onClick={markReview}>
              {review[current] ? "Unmark Review" : "Mark for Review"}
            </button>
            <button onClick={clearResponse}>Clear</button>
            <button onClick={nextQ} disabled={current === questions.length - 1}>Save & Next</button>
          </div>
        </div>

        <div className="palette">
          <h4>Question Palette</h4>
          <div className="grid">
            {questions.map((_, i) => {
              let status = "notVisited";
              if (answers[i]) status = "answered";
              if (review[i]) status = "review";
              return (
                <button
                  key={i}
                  className={`qbox ${status} ${current === i ? "active" : ""}`}
                  onClick={() => setCurrent(i)}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
          <button className="submitBtn" onClick={handleManualSubmit}>Submit Test</button>
        </div>
      </div>
    </div>
  );
}

export default Practice;