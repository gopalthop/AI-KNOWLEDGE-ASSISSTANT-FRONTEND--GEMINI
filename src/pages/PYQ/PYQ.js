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

{filteredPapers.map(paper=>(

<div key={paper._id} className="paperCard">

<h3>{paper.title}</h3>

<p>
{paper.subject} • {paper.year} • {paper.questionCount} Questions
</p>

<button
 onClick={()=>navigate(`/practice/${paper._id}`)}
>
Start Practice
</button>

</div>

))}

</div>

</div>

);
}

export default PYQ;