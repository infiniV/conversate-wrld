"use client";

import { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";
import { LandingHero } from "./LandingHero";
import { useTheme } from "next-themes";
import { ThemeColors } from "./ThemeConstants";

interface LandingRevealProps {
  onRevealComplete: () => void;
}

export default function LandingReveal({
  onRevealComplete,
}: LandingRevealProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const revealContainerRef = useRef<HTMLDivElement>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const { theme, systemTheme } = useTheme();

  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";

  // Refined flip animations with precise timing
  useEffect(() => {
    if (typeof window === "undefined") return;

    const preloadAssets = async () => {
      await new Promise((resolve) => setTimeout(resolve, 400)); // Reduced delay for snappier start
      setAssetsLoaded(true);
    };

    preloadAssets();

    const letters = letterRefs.current.filter(Boolean);
    const tl = gsap.timeline({ defaults: { ease: "power1.inOut" } }); // Default easing

    // Initial state for all letters
    gsap.set(letters, {
      opacity: 0,
      rotationX: -90,
      y: 0,
      transformStyle: "preserve-3d",
    });

    // Sequential flip animation
    tl.to(letters, {
      opacity: 1,
      rotationX: 0,
      duration: 0.35,
      stagger: {
        each: 0.035,
        ease: "none",
      },
    });
  }, []);

  // Polished exit animation
  useEffect(() => {
    if (assetsLoaded && !isRevealed) {
      const letters = letterRefs.current.filter(Boolean);
      const tl = gsap.timeline({
        onComplete: () => {
          gsap.delayedCall(0.1, () => {
            setIsRevealed(true);
            onRevealComplete();
          });
        },
      });

      // Color transition with precise timing
      tl.to(letters, {
        color: ThemeColors.accent,
        duration: 0.25,
        stagger: {
          each: 0.02,
          ease: "none",
          from: "center",
        },
      })
        // Clean flip out
        .to(
          letters,
          {
            rotationX: 90,
            opacity: 0,
            duration: 0.25,
            stagger: {
              each: 0.02,
              ease: "power1.in",
              from: "center",
            },
          },
          "+=0.1"
        );
    }
  }, [assetsLoaded, isRevealed, onRevealComplete]);

  if (isRevealed) {
    return <LandingHero />;
  }

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 ${
        isDark ? "bg-[#09090B]" : "bg-[#FAFAFA]"
      }`}
      ref={revealContainerRef}
    >
      <h1
        className={`text-7xl md:text-8xl lg:text-[10rem] font-bold select-none ${
          isDark ? "text-white" : "text-gray-900"
        } [perspective:3000px]`}
        style={{
          willChange: "transform",
          fontFamily: "var(--font-display, var(--font-sans))",
        }}
      >
        {"conversate".split("").map((letter, i) => (
          <span
            key={i}
            ref={(el) => {
              letterRefs.current[i] = el;
            }}
            className="inline-block transform-gpu"
            style={{
              transformOrigin: "50% 50%",
              transformStyle: "preserve-3d",
              backfaceVisibility: "hidden",
              WebkitFontSmoothing: "antialiased",
              letterSpacing: "-0.02em",
            }}
          >
            {letter}
          </span>
        ))}
      </h1>
    </div>
  );
}
