import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {

  const API_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

  const [papers,setPapers]=useState([]);

  /* ================= FETCH PAPERS ================= */

  useEffect(()=>{

    axios.get(`${API_URL}/api/notes`,{
      params:{
        exam:"CUET PG"
      }
    })
    .then(res=>{
      const pyqs =
        res.data.notes.filter(
          n=>n.type==="pyq" && n.extracted
        );

      setPapers(pyqs);
    });

  },[API_URL]);

  return(
    <div className="dashboardPage">

      <h1>CUET PG Dashboard</h1>

      {/* TOP CARDS */}
      <div className="dashboardCards">

        <div className="card">
          <h3>📄 Previous Papers</h3>
          <p>Practice real CUET PYQs</p>
        </div>

        <div className="card">
          <h3>🧪 Mock Tests</h3>
          <p>AI generated tests</p>
        </div>

        <div className="card">
          <h3>📊 Performance</h3>
          <p>Track accuracy</p>
        </div>

        <div className="card">
          <h3>▶ Resume Test</h3>
          <p>Continue last exam</p>
        </div>

      </div>

      {/* PAPERS */}
      <h2 className="sectionTitle">
        Available Papers
      </h2>

      <div className="papers">

        {papers.map(paper=>(
          <div
            key={paper._id}
            className="paperCard"
          >

            <h3>{paper.title}</h3>

            <p>
              {paper.subject} • {paper.year}
            </p>

            <button
              onClick={()=>
                navigate(
                  `/practice/${paper._id}`
                )
              }
            >
              Start Practice
            </button>

          </div>
        ))}

      </div>

    </div>
  );
}

export default Dashboard;