"use client"; // Mark this as a Client Component

import { useEffect, useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [messages, setMessages] = useState<
    { text: string; sender: "user" | "bot" }[]
  >([]);
  const [input, setInput] = useState("");
  const [chatStarted, setChatStarted] = useState(false);

  useEffect(() => {
    const fetchFun = async () => {
      // const res = await fetch("/webscraping", {
      //   method: "GET",
      // });
      const res = await fetch("/webscraping", {
        method: "POST",
        body: JSON.stringify({ url: "testt" }),
      });
      return "";
    };
    fetchFun();
  }, []);

  // Function to add a message to the chat window
  const addMessage = (text: string, sender: "user" | "bot") => {
    setMessages((prevMessages) => [...prevMessages, { text, sender }]);
  };

  // Start chat when the user enters a URL
  const startChat = () => {
    if (url.trim()) {
      setChatStarted(true);
      addMessage(`Chat started for URL: ${url}`, "bot");
    } else {
      alert("Please enter a valid URL.");
    }
  };

  // Send user message
  const sendMessage = () => {
    if (input.trim()) {
      addMessage(input, "user");
      setInput("");
      // Simulate bot response (replace with actual API call)
      setTimeout(() => {
        addMessage("I am a bot. How can I assist you?", "bot");
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center  bg-black">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl p-6">
        <h1 className="text-2xl text-black font-bold text-center mb-6">
          Support Assistant Chatbot
        </h1>
        <div className="space-y-4">
          {/* URL Input */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter a URL to start chatting..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded-lg"
              disabled={chatStarted}
            />
            <button
              onClick={startChat}
              disabled={chatStarted}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
            >
              Start Chat
            </button>
          </div>

          {/* Chat Window */}
          <div className="h-96 border border-gray-300 rounded-lg p-4 overflow-y-auto bg-gray-50">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-2 p-2 rounded-lg max-w-[70%] ${
                  message.sender === "user"
                    ? "bg-blue-500 text-white ml-auto"
                    : "bg-gray-200 text-gray-800 mr-auto"
                }`}
              >
                {message.text}
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              disabled={!chatStarted}
              className="flex-1 p-2 border border-gray-300 text-black rounded-lg"
            />
            <button
              onClick={sendMessage}
              disabled={!chatStarted}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
