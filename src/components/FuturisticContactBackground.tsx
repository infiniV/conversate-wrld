"use client";

import React, { useRef, useEffect } from "react";
import { ThemeColors } from "./ThemeConstants";
import { useTheme } from "next-themes";

export const FuturisticContactBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas to full width/height
    const updateCanvasSize = () => {
      const pixelRatio = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * pixelRatio;
      canvas.height = rect.height * pixelRatio;
      ctx.scale(pixelRatio, pixelRatio);
    };

    window.addEventListener("resize", updateCanvasSize);
    updateCanvasSize();

    // Create particle system
    const particles: Particle[] = [];
    const particleCount = Math.min(50, window.innerWidth / 20); // Responsive count

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      opacity: number;

      constructor() {
        // Using non-null assertion since we've already checked canvas exists
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.color =
          Math.random() > 0.5
            ? ThemeColors.accent
            : ThemeColors.secondaryAccents.amber;
        this.opacity = Math.random() * 0.5 + 0.1;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Fixed: Using non-null assertion here since we checked above
        if (this.x > canvas!.width) this.x = 0;
        else if (this.x < 0) this.x = canvas!.width;

        if (this.y > canvas!.height) this.y = 0;
        else if (this.y < 0) this.y = canvas!.height;
      }

      draw() {
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx!.fillStyle =
          this.color +
          Math.floor(this.opacity * 255)
            .toString(16)
            .padStart(2, "0");
        ctx!.fill();
      }
    }

    // Create connection lines between particles
    function connectParticles() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i; j < particles.length; j++) {
          const dx = particles[i]!.x - particles[j]!.x;
          const dy = particles[i]!.y - particles[j]!.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx!.beginPath();
            ctx!.strokeStyle = `${ThemeColors.accent}${Math.floor(
              (1 - distance / 150) * 30,
            )
              .toString(16)
              .padStart(2, "0")}`;
            ctx!.lineWidth = 0.5;
            ctx!.moveTo(particles[i]!.x, particles[i]!.y);
            ctx!.lineTo(particles[j]!.x, particles[j]!.y);
            ctx!.stroke();
          }
        }
      }
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // Animation frame
    let animationId: number;
    function animate() {
      // Fixed: Add non-null assertions since we've checked these values
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

      // Draw the light gradient in the center-top
      const gradient = ctx!.createRadialGradient(
        canvas!.width / 2,
        canvas!.height / 4,
        0,
        canvas!.width / 2,
        canvas!.height / 4,
        canvas!.height / 1.5,
      );
      gradient.addColorStop(0, `${ThemeColors.accent}15`);
      gradient.addColorStop(1, "transparent");

      ctx!.fillStyle = gradient;
      ctx!.fillRect(0, 0, canvas!.width, canvas!.height);

      // Update and draw particles
      for (const particle of particles) {
        particle.update();
        particle.draw();
      }

      connectParticles();
      animationId = requestAnimationFrame(animate);
    }

    animate();

    // Cleanup
    return () => {
      window.removeEventListener("resize", updateCanvasSize);
      cancelAnimationFrame(animationId);
    };
  }, [isDark]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 -z-10 h-full w-full"
      style={{ opacity: 0.8 }}
    />
  );
};

export default FuturisticContactBackground;
