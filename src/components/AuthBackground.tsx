"use client";

import { useTheme } from "next-themes";
import { useEffect, useRef } from "react";
import { ThemeColors } from "./ThemeConstants";

export const AuthBackground = () => {
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };

    const drawPolygon = (
      x: number,
      y: number,
      size: number,
      rotation: number,
    ) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.beginPath();
      ctx.moveTo(size, 0);
      for (let i = 1; i < 6; i++) {
        const angle = (Math.PI * 2 * i) / 6;
        ctx.lineTo(size * Math.cos(angle), size * Math.sin(angle));
      }
      ctx.closePath();
      ctx.restore();
    };

    let frame: number;
    let rotation = 0;

    const animate = () => {
      rotation += 0.001;
      frame = requestAnimationFrame(animate);
      draw();
    };

    const draw = () => {
      resizeCanvas();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Create gradient patterns
      const patterns = [
        {
          x: canvas.width * 0.2,
          y: canvas.height * 0.3,
          size: canvas.width * 0.15,
          color: ThemeColors.accent,
        },
        {
          x: canvas.width * 0.8,
          y: canvas.height * 0.7,
          size: canvas.width * 0.2,
          color: "#06b6d4",
        },
      ];

      patterns.forEach((pattern) => {
        const gradient = ctx.createRadialGradient(
          pattern.x,
          pattern.y,
          0,
          pattern.x,
          pattern.y,
          pattern.size,
        );

        gradient.addColorStop(0, `${pattern.color}10`);
        gradient.addColorStop(0.5, `${pattern.color}05`);
        gradient.addColorStop(1, "transparent");

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw hexagonal patterns
        ctx.strokeStyle = `${pattern.color}${isDark ? "20" : "10"}`;
        ctx.lineWidth = 0.5;

        for (let i = 0; i < 6; i++) {
          drawPolygon(
            pattern.x,
            pattern.y,
            pattern.size * (0.3 + i * 0.1),
            rotation + (i * Math.PI) / 3,
          );
          ctx.stroke();
        }
      });
    };

    animate();
    return () => cancelAnimationFrame(frame);
  }, [isDark]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      style={{
        opacity: isDark ? 0.6 : 0.4, // Use number instead of string
        mixBlendMode: isDark ? "color-dodge" : "multiply", // Correct property name
      }}
    />
  );
};
