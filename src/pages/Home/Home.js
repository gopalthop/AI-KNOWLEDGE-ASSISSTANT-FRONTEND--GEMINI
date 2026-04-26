import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Home.css";

function Home() {
  const [stats, setStats] = useState({ totalNotes: 0 });

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/home/stats`)
      .then((res) => setStats(res.data))
      .catch(() => {});
  }, []);

  return (
    <div className="home">
      {/* HERO */}
      <h1>CUET PG Practice Platform</h1>

      <p>
        AI-powered knowledge system with CUET PG practice and document
        intelligence.
      </p>

      <p className="department">
        Govt. Degree College Hayathnagar — Department of Computer Science
      </p>

      <p className="credit">Student Innovation Project</p>

      <div className="cta">
        <Link to="/pyq" className="btn primary">
          Start your Exam Practice
        </Link>

        <Link to="/chat" className="btn secondary">
          AI Chat
        </Link>

        <Link to="/upload" className="btn secondary">
          Upload Knowledge
        </Link>

        <Link to="/library" className="btn secondary">
          Library
        </Link>
      </div>

      {/* TECH STACK */}
      <section className="tech">
        <h2>Built With</h2>

        <div className="techRow">
          <TechBadge name="React" />
          <TechBadge name="Node" />
          <TechBadge name="MongoDB" />
          <TechBadge name="Gemini" />
          <TechBadge name="CS DEPARTMENT" />
        </div>
      </section>

      {/* STATS */}
      <section className="stats">
        <div>
          Documents: <span>{stats.totalNotes}</span>
        </div>

        <div>
          Tests Taken: <span>{stats.totalAttempts}</span>
        </div>
      </section>

      <footer className="footer">© 2026 AI Knowledge Assistant</footer>
    </div>
  );
}

function TechBadge({ name }) {
  return <div className="techBadge">{name}</div>;
}

export default Home;
