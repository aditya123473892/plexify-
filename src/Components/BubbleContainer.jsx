// BubbleContainer.js
import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";

// Keyframe animations for bubble float
const bubbleFloat = keyframes`
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
  100% {
    transform: translateY(0);
  }
`;

// Styled components for Bubble and BubbleContainer
const Bubble = styled.div`
  position: absolute;
  border-radius: 50%;
  opacity: 0.6;
  pointer-events: none;
  animation: ${bubbleFloat} ${(props) => props.duration}s infinite ease-in-out;
  background: ${(props) => props.color};
`;

const BubbleContainerStyle = styled.div`
  position: relative;
`;

const BubbleContainer = () => {
  const [bubbles, setBubbles] = useState([]);

  const generateBubbles = () => {
    const newBubbles = [];
    const bubbleCount = window.innerWidth > 700 ? 7 : 4; // Adjust bubble count based on screen width
    const bubbleColor = window.innerWidth > 700 ? "rgba(255, 255, 255, 0.8)" : "#385723"; // Change color based on screen width

    for (let i = 0; i < bubbleCount; i++) {
      const size = Math.random() * 200 + 130; // Random size between 130px and 330px
      const left = Math.random() * 90; // Random horizontal position (0% to 90%)
      const top = Math.random() * 90; // Random vertical position (0% to 90%)
      const duration = Math.random() * 3 + 2; // Random animation duration between 2s and 5s

      newBubbles.push(
        <Bubble
          key={i}
          size={size}
          left={left}
          top={top}
          duration={duration}
          color={bubbleColor}
          style={{
            width: `${size}px`,
            height: `${size}px`,
            left: `${left}vw`,
            top: `${top}vh`,
          }}
        />
      );
    }
    setBubbles(newBubbles);
  };

  useEffect(() => {
    generateBubbles();

    // Update bubbles on window resize
    const handleResize = () => generateBubbles();
    window.addEventListener("resize", handleResize);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <BubbleContainerStyle>{bubbles}</BubbleContainerStyle>;
};

export default BubbleContainer;
