"use client";

import { useTheme } from "next-themes";
import { useEffect, useRef } from "react";

export const FooterBackground = () => {
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

    const createPolygon = (
      x: number,
      y: number,
      size: number,
      sides: number
    ) => {
      ctx.beginPath();
      for (let i = 0; i < sides; i++) {
        const angle = (Math.PI * 2 * i) / sides;
        const pointX = x + size * Math.cos(angle);
        const pointY = y + size * Math.sin(angle);
        if (i === 0) ctx.moveTo(pointX, pointY);
        else ctx.lineTo(pointX, pointY);
      }
      ctx.closePath();
    };

    const drawBackground = () => {
      resizeCanvas();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Create gradient based on theme
      const baseColor = isDark
        ? `rgba(255, 61, 113, 0.05)`
        : `rgba(255, 61, 113, 0.03)`;

      const accentColor = isDark
        ? `rgba(6, 182, 212, 0.05)`
        : `rgba(6, 182, 212, 0.03)`;

      // Draw polygons
      const polygons = [
        { x: canvas.width * 0.2, y: canvas.height * 0.3, size: 80, sides: 6 },
        { x: canvas.width * 0.8, y: canvas.height * 0.2, size: 120, sides: 6 },
        { x: canvas.width * 0.15, y: canvas.height * 0.8, size: 100, sides: 6 },
        { x: canvas.width * 0.75, y: canvas.height * 0.85, size: 90, sides: 6 },
        { x: canvas.width * 0.5, y: canvas.height * 0.5, size: 150, sides: 8 },
      ];

      polygons.forEach((poly, index) => {
        const gradient = ctx.createRadialGradient(
          poly.x,
          poly.y,
          0,
          poly.x,
          poly.y,
          poly.size * 1.5
        );

        gradient.addColorStop(0, index % 2 === 0 ? baseColor : accentColor);
        gradient.addColorStop(1, "transparent");

        ctx.fillStyle = gradient;
        createPolygon(poly.x, poly.y, poly.size, poly.sides);
        ctx.fill();

        ctx.strokeStyle = `rgba(255, 61, 113, ${isDark ? 0.1 : 0.05})`;
        ctx.lineWidth = 0.5;
        createPolygon(poly.x, poly.y, poly.size, poly.sides);
        ctx.stroke();
      });
    };

    drawBackground();

    window.addEventListener("resize", drawBackground);
    return () => window.removeEventListener("resize", drawBackground);
  }, [isDark]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{
        pointerEvents: "none",
        opacity: 0.7,
        mixBlendMode: isDark ? "lighten" : "multiply",
      }}
    />
  );
};
