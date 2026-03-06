import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home/Home";
import Upload from "./pages/Upload/Upload";
import Chat from "./pages/Chat/Chat";
import Library from "./pages/Library/Library";
import Practice from "./pages/Practice/Practice";
import Dashboard from "./pages/Dashboard/Dashboard";
import AddQuestion from "./pages/AddQuestion/AddQuestion";
import QuestionManager from "./pages/QuestionManager/QuestionManager";
import PYQ from "./pages/PYQ/PYQ";

import Navbar from "./components/Navbar/Navbar";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/library" element={<Library />} />
        <Route path="/practice/:noteId" element={<Practice />} />
        <Route path="/add-question/:noteId" element={<AddQuestion />} />
        <Route path="/manage/:noteId" element={<QuestionManager />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/pyq" element={<PYQ />} />
      </Routes>
    </>
  );
}

export default App;