import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./App.css";

const API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";
const API_KEY = "AIzaSyBmR6Sb0X_pR6boJOKPalLahRwlL9AjBlM";

const fetchChatResponse = async (message) => {
  // Check if the message is asking about the owner
  if (message.toLowerCase().includes("owner")) {
    return "Dharm Patel";
  }

  try {
    console.log("Sending request with message:", message);
    const response = await axios.post(
      `${API_URL}?key=${API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: message,
              },
            ],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("API Response:", response.data);

    if (
      response.data &&
      response.data.candidates &&
      response.data.candidates[0] &&
      response.data.candidates[0].content &&
      response.data.candidates[0].content.parts &&
      response.data.candidates[0].content.parts[0]
    ) {
      return response.data.candidates[0].content.parts[0].text;
    } else {
      throw new Error("Invalid response structure");
    }
  } catch (error) {
    console.error("Error fetching chat response:", error);
    throw error;
  }
};

const Chat = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const chatWindowRef = useRef(null);

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input.trim() === "") return;

    const userMessage = { text: input, user: "You" };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      const aiResponse = await fetchChatResponse(input);
      const botMessage = { text: aiResponse, user: "Bot" };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      const errorMessage = {
        text: "Error fetching response from AI",
        user: "Bot",
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }

    setInput("");
  };

  return (
    <div className="chat">
      <h1>AI Chat Application</h1>
      <div className="scrollable-container" ref={chatWindowRef}>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.user === "Bot" ? "bot" : "user"}`}
          >
            <strong>{message.user}:</strong>
            <div className="message-box">
              <pre>{message.text}</pre>
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chat;
