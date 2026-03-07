import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./PYQ.css";

function PYQ(){

const API_URL = process.env.REACT_APP_API_URL;
const navigate = useNavigate();

const [papers,setPapers] = useState([]);
const [search,setSearch] = useState("");
const [loading,setLoading] = useState(true);
const [openSubject, setOpenSubject] = useState(null);

useEffect(()=>{

 axios.get(`${API_URL}/api/notes`,{
   params:{ exam:"CUET PG" }
 })
 .then(res=>{

   const filtered = res.data.notes.filter(
     n => (n.type==="pyq" || n.type==="excel") && n.extracted
   );

   setPapers(filtered);


   setLoading(false);

 })
 .catch(err=>{
   console.error("Failed to load papers",err);
   setLoading(false);
 });

},[API_URL]);

const filteredPapers = papers.filter(p =>
 p.title.toLowerCase().includes(search.toLowerCase())
);
const groupedPapers = filteredPapers.reduce((acc, paper) => {

  const subject = paper.subject || "Other";

  if (!acc[subject]) {
    acc[subject] = [];
  }

  acc[subject].push(paper);

  return acc;

}, {});

if(loading){
  return(
    <div className="loaderPage">
      <div className="spinner"></div>
      <p>Loading papers...</p>
    </div>
  );
}

return(

<div className="pyqPage">

<h1>Previous Year Papers</h1>

<input
 type="text"
 placeholder="Search paper (example: 2022, Data Structures)"
 value={search}
 onChange={(e)=>setSearch(e.target.value)}
 className="searchBar"
/>

<div className="papers">

{Object.entries(groupedPapers).map(([subject,papers])=>(

<div key={subject} className="subjectBlock">

<button
 className={`subjectBtn ${
   openSubject === subject ? "active" : ""
 }`}
 onClick={() =>
   setOpenSubject(
     openSubject === subject ? null : subject
   )
 }
>
{subject}
</button>

{openSubject === subject && (
<div className="papers">
  

{papers
.sort((a,b)=>b.year-a.year)
.map(paper=>(

<div key={paper._id} className="paperCard">

<h3>{paper.title}</h3>

<p>
{paper.year} • {paper.questionCount} Questions
</p>

<button
 onClick={()=>navigate(`/practice/${paper._id}`)}
>
Start Practice
</button>

</div>

))}

</div>
)}

</div>

))}
</div>


</div>

);
}

export default PYQ;