import React,{useEffect,useState, useCallback} from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./QuestionManager.css";

function QuestionManager(){

const API_URL =
process.env.REACT_APP_API_URL;

const {noteId}=useParams();

const [questions,setQuestions]=useState([]);
const [editing,setEditing]=useState(null);

const fetchQuestions = useCallback(async () => {
  const res = await axios.get(
    `${API_URL}/api/questions/${noteId}`
  );
  setQuestions(res.data.questions);
}, [API_URL, noteId]);

useEffect(()=>{
fetchQuestions();
},[fetchQuestions]);



/* ===== DELETE ===== */

const deleteQuestion=async(id)=>{
await axios.delete(
`${API_URL}/api/questions/${id}`
);
fetchQuestions();
};

/* ===== UPDATE ===== */

const updateQuestion=async(q)=>{

await axios.put(
`${API_URL}/api/questions/${q._id}`,
q
);

setEditing(null);
fetchQuestions();
};

return(

<div className="managerPage">

<h2>Manage Questions</h2>

{questions.map(q=>(

<div key={q._id}
className="questionCard">

{editing===q._id ?(

<>
<textarea
value={q.question}
onChange={e=>
setQuestions(prev=>
prev.map(item=>
item._id===q._id
?{...item,
question:e.target.value}
:item
))
}
/>

{q.options.map((opt,i)=>(
<input
key={i}
value={opt}
onChange={e=>{
const copy=[...q.options];
copy[i]=e.target.value;

setQuestions(prev=>
prev.map(item=>
item._id===q._id
?{...item,
options:copy}
:item
));
}}
/>
))}

<input
value={q.correctAnswer}
onChange={e=>
setQuestions(prev=>
prev.map(item=>
item._id===q._id
?{...item,
correctAnswer:e.target.value}
:item
))
}
/>

<textarea
value={q.explanation}
onChange={e=>
setQuestions(prev=>
prev.map(item=>
item._id===q._id
?{...item,
explanation:e.target.value}
:item
))
}
/>

<button
onClick={()=>updateQuestion(q)}
>
Save
</button>

</>

):(

<>
<p>{q.question}</p>

<ul>
{q.options.map((o,i)=>
<li key={i}>{o}</li>
)}
</ul>

<p>
✅ {q.correctAnswer}
</p>

<button
onClick={()=>setEditing(q._id)}
>
Edit
</button>

<button
onClick={()=>
deleteQuestion(q._id)
}
>
Delete
</button>

</>

)}

</div>

))}

</div>

);
}

export default QuestionManager;