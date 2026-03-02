import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./Practice.css";

function Practice() {

  const API_URL = process.env.REACT_APP_API_URL;
  const { noteId } = useParams();

  const [questions,setQuestions]=useState([]);
  const [current,setCurrent]=useState(0);

  const [answers,setAnswers]=useState({});
  const [review,setReview]=useState({});

  const [timeLeft,setTimeLeft]=useState(1800);
  const [submitted,setSubmitted]=useState(false);
  const [score,setScore]=useState(0);
  const [analysis,setAnalysis]=useState("");

  /* ================= FETCH QUESTIONS ================= */

  useEffect(()=>{

    axios
      .get(`${API_URL}/api/practice/${noteId}`)
      .then(res=>{
        setQuestions(res.data.questions);
      });

  },[noteId]);

  /* ================= TIMER ================= */

  useEffect(()=>{

    if(submitted) return;

    const timer=setInterval(()=>{

      setTimeLeft(prev=>{

        if(prev<=1){
          clearInterval(timer);
          submitTest();
          return 0;
        }

        return prev-1;
      });

    },1000);

    return()=>clearInterval(timer);

  },[submitted]);

  const formatTime=(t)=>{
    const m=Math.floor(t/60);
    const s=t%60;
    return `${m}:${s<10?"0":""}${s}`;
  };

  /* ================= ANSWER ================= */

  const selectOption=(opt)=>{
    setAnswers(prev=>({
      ...prev,
      [current]:opt
    }));
  };

  const saveNext=()=>{
    if(current<questions.length-1)
      setCurrent(current+1);
  };

  const markReview=()=>{
    setReview(prev=>({
      ...prev,
      [current]:true
    }));
    saveNext();
  };

  /* ================= SUBMIT ================= */

  const submitTest = async ()=>{

    if(submitted) return; // prevent double submit

    let correct=0;

    questions.forEach((q,i)=>{
      if(answers[i]===q.correctAnswer)
        correct++;
    });

    setScore(correct);
    setSubmitted(true);

    try{

      const res = await axios.post(
        `${API_URL}/api/analyze-result`,
        {
          answers,
          noteId
        }
      );

      setAnalysis(res.data.analysis);

    }catch(err){
      console.error("Analysis failed");
      setAnalysis(
        "Analysis currently unavailable."
      );
    }
  };

  /* ================= LOADING ================= */

  if(questions.length===0)
    return <div className="examPage">Loading...</div>;

  /* ================= RESULT SCREEN ================= */

  if(submitted)
    return(
      <div className="examPage">
        <div className="resultBox">

          <h2>Test Submitted ✅</h2>

          <h3>
            Score: {score}/{questions.length}
          </h3>

          <div className="analysisBox">
            <h3>AI Performance Analysis</h3>
            <p>
              {analysis || "Analyzing performance..."}
            </p>
          </div>

        </div>
      </div>
    );

  const q=questions[current];

  /* ================= EXAM UI ================= */

  return(
    <div className="examPage">

      {/* HEADER */}
      <div className="examHeader">
        <h2>CUET PG Practice</h2>
        <div className="timer">
          ⏱ {formatTime(timeLeft)}
        </div>
      </div>

      <div className="examBody">

        {/* QUESTION PANEL */}
        <div className="questionPanel">

          <h3>
            Question {current+1}
          </h3>

          <p>{q.question}</p>

          <div className="options">
            {q.options.map((opt,i)=>(
              <button
                key={i}
                className={
                  answers[current]===opt
                  ? "option selected"
                  : "option"
                }
                onClick={()=>selectOption(opt)}
              >
                {opt}
              </button>
            ))}
          </div>

          <div className="actions">
            <button onClick={saveNext}>
              Save & Next
            </button>

            <button onClick={markReview}>
              Mark for Review
            </button>
          </div>

        </div>

        {/* QUESTION PALETTE */}
        <div className="palette">

          <h4>Questions</h4>

          <div className="grid">
            {questions.map((_,i)=>{

              let cls="notVisited";

              if(answers[i]) cls="answered";
              if(review[i]) cls="review";

              return(
                <button
                  key={i}
                  className={`qbox ${cls}`}
                  onClick={()=>setCurrent(i)}
                >
                  {i+1}
                </button>
              );
            })}
          </div>

          <button
            className="submitBtn"
            onClick={submitTest}
          >
            Submit Test
          </button>

        </div>

      </div>

    </div>
  );
}

export default Practice;