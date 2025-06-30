import React, { useEffect, useRef } from "react";
import { Box } from "@mui/material";
import dayjs from "dayjs";

export default function AnalogClock() {
  const hourRef = useRef(null);
  const minuteRef = useRef(null);
  const secondRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = dayjs();
      const hour = now.hour();
      const minute = now.minute();
      const second = now.second();

      if (hourRef.current)
        hourRef.current.style.transform = `translateX(-50%) rotate(${(hour % 12) * 30 + minute / 2}deg)`;
      if (minuteRef.current)
        minuteRef.current.style.transform = `translateX(-50%) rotate(${minute * 6}deg)`;
      if (secondRef.current)
        secondRef.current.style.transform = `translateX(-50%) rotate(${second * 6}deg)`;
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const numbers = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <Box
      sx={{
        width: 300,
        height: 300,
        borderRadius: "50%",
        border: "6px solid #ccc",
        position: "relative",
        background: "radial-gradient(circle, #111 40%, #000 100%)",
        mx: "auto",
      }}
    >
      {/* Hands */}
      <Box
        ref={hourRef}
        sx={{
          position: "absolute",
          width: 4,
          height: 70,
          bgcolor: "white",
          borderRadius: 2,
          top: 80,
          left: "50%",
          transform: "translateX(-50%)",
          transformOrigin: "bottom",
          zIndex: 2,
        }}
      />
      <Box
        ref={minuteRef}
        sx={{
          position: "absolute",
          width: 3,
          height: 100,
          bgcolor: "white",
          borderRadius: 2,
          top: 50,
          left: "50%",
          transform: "translateX(-50%)",
          transformOrigin: "bottom",
          zIndex: 2,
        }}
      />
      <Box
        ref={secondRef}
        sx={{
          position: "absolute",
          width: 2,
          height: 120,
          bgcolor: "red",
          borderRadius: 2,
          top: 30,
          left: "50%",
          transform: "translateX(-50%)",
          transformOrigin: "bottom",
          zIndex: 1,
        }}
      />

      {/* Numbers */}
      {numbers.map((num) => {
        const angle = ((num - 3) * 30 * Math.PI) / 180;
        const radius = 130;
        const x = 150 + radius * Math.cos(angle);
        const y = 150 + radius * Math.sin(angle);
        return (
          <Box
            key={num}
            sx={{
              position: "absolute",
              top: y,
              left: x,
              transform: "translate(-50%, -50%)",
              color: "#ddd",
              fontSize: 14,
              fontWeight: 300,
            }}
          >
            {num}
          </Box>
        );
      })}
    </Box>
  );
}
