import React from "react";

import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {

 
  const navigate = useNavigate();

  

  /* ================= FETCH PAPERS ================= */

  return(
    <div className="dashboardPage">

      <h1>CUET PG Dashboard</h1>

      <div className="card" onClick={()=>navigate("/pyq")}>
        <h3>📄 Previous Year Papers</h3>
        <p>Practice real CUET PG PYQs</p>
      </div>

    </div> 
  );
}

export default Dashboard;