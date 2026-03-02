import React,{useState} from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./AddQuestion.css";

function AddQuestion(){

const API_URL =
process.env.REACT_APP_API_URL;

const { noteId } = useParams();

const [question,setQuestion]=useState("");
const [options,setOptions]=useState([
"","","",""
]);

const [correct,setCorrect]=useState("");
const [explanation,setExplanation]=useState("");

const updateOption=(i,val)=>{
const copy=[...options];
copy[i]=val;
setOptions(copy);
};

const saveQuestion=async()=>{

await axios.post(
`${API_URL}/api/questions/manual`,
{
noteId,
question,
options,
correctAnswer:correct,
explanation
}
);

alert("Question Added ✅");

setQuestion("");
setOptions(["","","",""]);
setCorrect("");
setExplanation("");
};

return(

<div className="addPage">

<h2>Add Question</h2>

<textarea
placeholder="Enter Question"
value={question}
onChange={e=>setQuestion(e.target.value)}
/>

{options.map((opt,i)=>(
<input
key={i}
placeholder={`Option ${i+1}`}
value={opt}
onChange={e=>updateOption(i,e.target.value)}
/>
))}

<select
value={correct}
onChange={e=>setCorrect(e.target.value)}
>
<option value="">
Select Correct Option
</option>

{options.map((o,i)=>(
<option key={i} value={o}>
{o || `Option ${i+1}`}
</option>
))}
</select>

<textarea
placeholder="Explanation"
value={explanation}
onChange={e=>setExplanation(e.target.value)}
/>

<button onClick={saveQuestion}>
Save Question
</button>

</div>
);
}

export default AddQuestion;