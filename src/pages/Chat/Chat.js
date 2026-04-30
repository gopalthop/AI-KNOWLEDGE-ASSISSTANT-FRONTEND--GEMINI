import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./Chat.css";

function Chat() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);

  const chatEndRef = useRef(null);

  // Auto-scroll logic
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]); // Also scroll when loading state changes

  const sendMessage = async () => {
    if (!question.trim() || loading) return;

    if (questionCount >= 5) {
      alert("Demo limit reached.");
      return;
    }

    const currentQuestion = question;
    setQuestion("");
    setQuestionCount((prev) => prev + 1);
    setMessages((prev) => [...prev, { type: "user", text: currentQuestion }]);
    setLoading(true);

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/chat`,
        { question: currentQuestion }
      );

      setMessages((prev) => [
        ...prev,
        { type: "ai", text: res.data.answer || "No response from AI." },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { type: "ai", text: err.response?.data?.error || "Error connecting to AI." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatPage">
      <section className="pageCenter">
        <h1 className="pageTitle">AI Assistant</h1>
        <p className="pageSubtitle">Ask any question and get intelligent answers</p>

        <div className="chatBox">
          {messages.length === 0 && !loading && (
            <div className="emptyChat">
              <p>How can I help you today?</p>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={msg.type === "user" ? "userMsg" : "aiMsg"}>
              {msg.type === "ai" ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {msg.text}
                </ReactMarkdown>
              ) : (
                msg.text
              )}
            </div>
          ))}

          {loading && (
            <div className="aiMsg">
              <span className="typing">AI is thinking</span>
            </div>
          )}
          
          {/* CRITICAL: Anchor must be at the very bottom */}
          <div ref={chatEndRef} style={{ float: "left", clear: "both" }} />
        </div>

        <div className="chatInput">
          <input
            placeholder="Type your question..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            disabled={loading}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button className="primaryBtn" onClick={sendMessage} disabled={loading}>
            {loading ? "..." : "Send"}
          </button>
        </div>

        <p style={{ opacity: 0.6, marginTop: "10px", fontSize: "0.8rem" }}>
          Usage: {questionCount}/5 messages
        </p>
      </section>
    </div>
  );
}

export default Chat;