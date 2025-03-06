"use client";

import { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";
import { LandingHero } from "./LandingHero";
import { useTheme } from "next-themes";
import { ThemeColors } from "./ThemeConstants";

// No need to register SplitText since we're using a custom approach

interface LandingRevealProps {
  onRevealComplete: () => void;
}

export default function LandingReveal({
  onRevealComplete,
}: LandingRevealProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const revealContainerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const { theme, systemTheme } = useTheme();

  // Determine the current theme
  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";

  // Initialize animations
  useEffect(() => {
    // Only run on client
    if (typeof window === "undefined") return;

    // Start assets loading
    const preloadAssets = async () => {
      // Simulate asset loading (replace with actual asset loading logic)
      await new Promise((resolve) => setTimeout(resolve, 2500));
      setAssetsLoaded(true);
    };

    preloadAssets();

    // Custom text reveal animation without SplitText plugin
    if (textRef.current) {
      // Get all characters as spans
      const chars = textRef.current.querySelectorAll(".char");

      // Create animation timeline
      const tl = gsap.timeline();

      // Animate each character
      tl.fromTo(
        chars,
        {
          opacity: 0,
          y: 20,
          rotationX: -90,
        },
        {
          opacity: 1,
          y: 0,
          rotationX: 0,
          stagger: 0.05,
          duration: 0.8,
          ease: "power3.out",
          onComplete: () => {
            // Add a slight pulse effect when complete
            gsap.to(textRef.current, {
              scale: 1.05,
              duration: 0.5,
              ease: "power1.inOut",
              yoyo: true,
              repeat: 1,
            });
          },
        }
      );
    }
  }, []);

  // Handle transition when assets are loaded
  useEffect(() => {
    if (assetsLoaded && !isRevealed) {
      // Only proceed if View Transitions API is available
      if (document.startViewTransition) {
        const transition = document.startViewTransition(async () => {
          // Mark as revealed to render the main content
          setIsRevealed(true);
          onRevealComplete(); // Call the callback when reveal is complete
        });

        // Add custom animation for the transition
        transition.ready.then(() => {
          if (revealContainerRef.current) {
            gsap.to(revealContainerRef.current, {
              scale: 5,
              opacity: 0,
              duration: 1.2,
              ease: "power3.inOut",
            });
          }
        });
      } else {
        // Fallback for browsers without View Transitions API
        if (revealContainerRef.current) {
          gsap.to(revealContainerRef.current, {
            scale: 5,
            opacity: 0,
            duration: 1.2,
            ease: "power3.inOut",
            onComplete: () => {
              setIsRevealed(true);
              onRevealComplete(); // Call the callback when reveal is complete
            },
          });
        }
      }
    }
  }, [assetsLoaded, isRevealed, onRevealComplete]);

  if (isRevealed) {
    return (
      <>
        <LandingHero />
      </>
    );
  }

  // Helper function to wrap each letter in a span
  const wrapLettersInSpans = (text: string, className: string) => {
    return text.split("").map((letter, i) => (
      <span
        key={i}
        className={`${className} char`}
        style={{ display: "inline-block" }}
      >
        {letter}
      </span>
    ));
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 ${
        isDark ? "bg-[#09090B]" : "bg-[#FAFAFA]"
      }`}
      ref={revealContainerRef}
      style={{
        viewTransitionName: "reveal-transition",
      }}
    >
      <div className="relative" ref={textRef}>
        <h1
          className={`text-7xl md:text-8xl lg:text-9xl font-bold ${
            isDark ? "text-white" : "text-gray-900"
          } relative z-10`}
        >
          <span className="inline-block">
            {wrapLettersInSpans("convers", "")}
          </span>
          <span className="inline-block text-[#FF3D71]">
            {wrapLettersInSpans("ate", "")}
          </span>
        </h1>
        <div
          className="absolute -inset-10 blur-3xl rounded-full opacity-30"
          style={{
            background: `radial-gradient(circle, ${ThemeColors.accent}60 0%, transparent 70%)`,
            viewTransitionName: "reveal-glow",
          }}
        />
        {assetsLoaded && (
          <div className="mt-8 flex justify-center">
            <div className="relative overflow-hidden h-1 w-48 bg-gray-200 rounded-full">
              <div
                className="absolute top-0 left-0 h-full bg-[#FF3D71] rounded-full"
                style={{
                  width: "100%",
                  animation: "progress 1s ease-out forwards",
                }}
              />
            </div>
          </div>
        )}
      </div>
      <style jsx global>{`
        @keyframes progress {
          from {
            width: 0;
          }
          to {
            width: 100%;
          }
        }

        .char {
          display: inline-block;
          transform-origin: center bottom;
        }

        @keyframes view-transition-reveal-animation {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        ::view-transition-old(reveal-transition) {
          animation: 0.7s cubic-bezier(0.76, 0, 0.24, 1) both fade-out;
        }

        ::view-transition-new(reveal-transition) {
          animation: 0.7s cubic-bezier(0.76, 0, 0.24, 1) both fade-in;
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes fade-out {
          from {
            opacity: 1;
            transform: scale(1);
          }
          to {
            opacity: 0;
            transform: scale(1.1);
          }
        }
      `}</style>
    </div>
  );
}
