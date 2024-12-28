// src/Chatboat.js
import React, { useState } from 'react';
import { FaComments } from 'react-icons/fa';

const Chatboat = () => {
  const [isChatVisible, setChatVisible] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const toggleChatBox = () => {
    setChatVisible((prev) => !prev);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (input.trim()) {
      setMessages([...messages, input]);
      setInput('');
    }
  };

  return (
    <div>
      <div className="fixed bottom-4 right-6 z-50">
        <button
          className="bg-[#538d2dfd] text-white rounded-full p-3 shadow-lg transition-transform transform hover:scale-105"
          aria-label="Chat with us"
          onClick={toggleChatBox}
        >
          <FaComments className="h-10 w-10" />
        </button>
      </div>

      {isChatVisible && (
        <div className="fixed bottom-16 right-8 w-80 bg-white shadow-lg rounded-lg border border-gray-300 z-50">
          <div className="p-4 flex justify-between items-center border-b">
            <h2 className="text-lg font-semibold">Chat</h2>
            <button onClick={toggleChatBox} className="text-gray-500">X</button>
          </div>
          <div className="p-4 h-64 overflow-y-auto">
            {messages.length === 0 ? (
              <p className="text-gray-500 text-center">No messages yet.</p>
            ) : (
              messages.map((msg, index) => (
                <div key={index} className="my-2 p-2 bg-gray-200 rounded">
                  {msg}
                </div>
              ))
            )}
          </div>
          <form onSubmit={handleSendMessage} className="p-4 border-t">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="border rounded w-full p-2"
              placeholder="Type a message..."
            />
            <button type="submit" className="mt-2 bg-[#538d2dfd] text-white rounded w-full p-2">
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatboat;
