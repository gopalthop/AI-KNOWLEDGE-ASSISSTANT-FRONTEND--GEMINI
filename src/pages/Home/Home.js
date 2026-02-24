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
      <section className="hero">
      <h1>AI System – Govt. Degree College Hayathnagar</h1>

<p>AI-Based Knowledge Retrieval & Document Assistance System</p>

<p className="department">
  Department of Computer Science
</p>

<p className="credit">
  Developed by Students under the Guidance of Faculty
</p>
        

        <div className="cta">
          <Link to="/upload" className="btn primary">
            Upload Knowledge
          </Link>

          <Link to="/chat" className="btn secondary">
            Try AI Chat →
          </Link>
          <Link to="/library" className="btn secondary">
             Library
           </Link>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features">
        <FeatureCard
          title="AI Powered Answers"
          desc="Get intelligent answers from your documents"
        />
        <FeatureCard
          title="Knowledge Storage"
          desc="Store and manage your notes securely"
        />
        <FeatureCard
          title="RAG Based Search"
          desc="Advanced retrieval augmented generation"
        />
      </section>

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
        Total Notes: <span>{stats.totalNotes}</span>
      </section>

      <footer className="footer">
        © 2026 AI Knowledge Assistant
      </footer>
    </div>
  );
}

function FeatureCard({ title, desc }) {
  return (
    <div className="featureCard">
      <h3>{title}</h3>
      <p>{desc}</p>
    </div>
  );
}

function TechBadge({ name }) {
  return <div className="techBadge">{name}</div>;
}

export default Home;