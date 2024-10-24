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
  background: rgba(255, 255, 255, 0.8);
  opacity: 0.6;
  pointer-events: none;
  animation: ${bubbleFloat} ${(props) => props.duration}s infinite ease-in-out;
`;

const BubbleContainerStyle = styled.div`
  position: relative;

`;

const BubbleContainer = () => {
  const [bubbles, setBubbles] = useState([]);

  useEffect(() => {
    const generateBubbles = () => {
      const newBubbles = [];
      const bubbleCount = 7; // Number of bubbles
      for (let i = 0; i < bubbleCount; i++) {
        const size = Math.random() * 200 + 130; // Random size between 30px and 130px
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

    generateBubbles();
  }, []);

  return <BubbleContainerStyle>{bubbles}</BubbleContainerStyle>;
};

export default BubbleContainer;
