// src/VideoChat.js
import React, { useState } from "react";
import { FaVideo } from "react-icons/fa";

const VideoChat = () => {
  const [isVideoVisible, setVideoVisible] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const toggleVideoBox = () => {
    setVideoVisible((prev) => !prev);
  };

  return (
    <div>
      {/* Floating Video Chat Icon */}
      <div className="fixed bottom-28 right-6 z-50">
        <button
          className="bg-[#538d2dfd] text-white rounded-full p-3 shadow-lg transition-transform transform hover:scale-105"
          aria-label="Start a video chat"
        >
          <FaVideo className="h-10 w-10" />
        </button>
      </div>

      {/* Video Chat Box */}
      {isVideoVisible && (
        <div className="fixed bottom-40 right-8 w-80 bg-white shadow-lg rounded-lg border border-gray-300 z-50">
          <div className="p-4 flex justify-between items-center border-b">
            <h2 className="text-lg font-semibold">Video Chat</h2>
            <button onClick={toggleVideoBox} className="text-gray-500">
              X
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoChat;
