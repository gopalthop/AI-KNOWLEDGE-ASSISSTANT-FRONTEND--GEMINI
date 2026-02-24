import React, { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm"; // Enables tables, strikethrough, etc.
import { useEffect, useRef } from "react";
import "./Chat.css";





function Chat() {
  // Store current question input
  const [question, setQuestion] = useState("");

  // Store all chat messages (user + AI)
  const [messages, setMessages] = useState([]);

  // Loading state for API request
  const [loading, setLoading] = useState(false);

  // Demo usage counter (limit 5)
  const [questionCount, setQuestionCount] = useState(0);

  // Function to send message to backend
  const sendMessage = async () => {
    // Prevent empty messages
    if (!question.trim()) return;

    // Demo limit check
    if (questionCount >= 5) {
      alert("Demo limit reached. Please try later.");
      return;
    }

    // Increase demo counter
    setQuestionCount((prev) => prev + 1);

    // Add user message to chat
    const userMsg = { type: "user", text: question };
    setMessages((prev) => [...prev, userMsg]);

    setLoading(true);

    // Save current question before clearing input
    const currentQuestion = question;
    setQuestion("");

    try {
      // Send request to backend
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/chat`,
        { question: currentQuestion }
      );

      // Add AI response to chat
      const aiMsg = {
        type: "ai",
        text: res.data.answer || "No response from AI.",
      };

      setMessages((prev) => [...prev, aiMsg]);

    }catch (err) {
  const errorMessage =
    err.response?.data?.error || "Something went wrong.";

  setMessages((prev) => [
    ...prev,
    { type: "ai", text: errorMessage },
  ]);
}
    setLoading(false);
  };

  const chatEndRef = useRef(null);

useEffect(() => {
  chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
}, [messages]);

  return (
    <div className="chatPage">
      <section className="pageCenter">

        {/* Page Title */}
        <h1 className="pageTitle">Ask AI Assistant</h1>

        {/* Subtitle */}
        <p className="pageSubtitle">
          Ask any question and get intelligent answers
        </p>

        {/* CHAT MESSAGE AREA */}
        <div className="chatBox">
          <div ref={chatEndRef}></div>

          {/* Loop through all messages */}
          {messages.map((msg, i) => (
            <div
              key={i}
              className={msg.type === "user" ? "userMsg" : "aiMsg"}
            >
              {msg.type === "ai" ? (
                // Render AI response as Markdown (with table support)
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {msg.text}
                </ReactMarkdown>
              ) : (
                // Render user message as plain text
                msg.text
              )}
            </div>
          ))}

          {/* Show typing indicator while waiting */}
          {loading && (
            <div className="aiMsg">
              <em>AI is typing...</em>
            </div>
          )}
        </div>

        {/* INPUT AREA */}
        <div className="chatInput">

          {/* Question Input */}
          <input
            placeholder="Type your question..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            disabled={loading}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
          />

          {/* Send Button */}
          <button
            className="primaryBtn"
            onClick={sendMessage}
            disabled={loading}
          >
            {loading ? "..." : "Send"}
          </button>
        </div>

        {/* Demo Counter */}
        <p style={{ opacity: 0.6, marginTop: "10px" }}>
          Demo usage: {questionCount}/5 questions
        </p>

      </section>
    </div>
  );
}

export default Chat;