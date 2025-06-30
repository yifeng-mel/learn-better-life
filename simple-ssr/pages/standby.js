import React, { useEffect, useRef } from "react";
import { Box, GlobalStyles } from "@mui/material";
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
    <>
      {/* Removes white margins and sets dark background */}
      <GlobalStyles
        styles={{
          html: { margin: 0, padding: 0, backgroundColor: "#121212" },
          body: { margin: 0, padding: 0, backgroundColor: "#121212" },
        }}
      />

      {/* Full screen background */}
      <Box
        sx={{
          width: "100vw",
          height: "100vh",
          backgroundColor: "#121212",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Clock face */}
        <Box
          sx={{
            width: 300,
            height: 300,
            borderRadius: "50%",
            border: "6px solid #444",
            position: "relative",
            background: `
              radial-gradient(circle at center, #222 30%, #000 100%),
              linear-gradient(145deg, #1a1a1a, #000)
            `,
            boxShadow: `
              0 0 20px rgba(0, 0, 0, 0.7),
              inset 0 0 15px rgba(255, 255, 255, 0.05)
            `,
          }}
        >
          {/* Hour hand */}
          <Box
            ref={hourRef}
            sx={{
              position: "absolute",
              width: 4,
              height: 70,
              bgcolor: "#fff",
              borderRadius: 2,
              top: 80,
              left: "50%",
              transform: "translateX(-50%)",
              transformOrigin: "bottom",
              zIndex: 2,
            }}
          />
          {/* Minute hand */}
          <Box
            ref={minuteRef}
            sx={{
              position: "absolute",
              width: 3,
              height: 100,
              bgcolor: "#ccc",
              borderRadius: 2,
              top: 50,
              left: "50%",
              transform: "translateX(-50%)",
              transformOrigin: "bottom",
              zIndex: 2,
            }}
          />
          {/* Second hand */}
          <Box
            ref={secondRef}
            sx={{
              position: "absolute",
              width: 2,
              height: 120,
              bgcolor: "#f44336",
              borderRadius: 2,
              top: 30,
              left: "50%",
              transform: "translateX(-50%)",
              transformOrigin: "bottom",
              zIndex: 1,
            }}
          />

          {/* Center dot */}
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: 12,
              height: 12,
              bgcolor: "#fff",
              borderRadius: "50%",
              transform: "translate(-50%, -50%)",
              boxShadow: "0 0 5px rgba(255, 255, 255, 0.8)",
              zIndex: 3,
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
                  color: "#eee",
                  fontSize: 16,
                  fontWeight: 400,
                  textShadow: "0 0 4px rgba(255, 255, 255, 0.2)",
                }}
              >
                {num}
              </Box>
            );
          })}
        </Box>
      </Box>
    </>
  );
}
