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
  const [transitionActive, setTransitionActive] = useState(false);
  const revealContainerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
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
    if (assetsLoaded && !isRevealed && !transitionActive) {
      // Set transition active to prevent double triggering
      setTransitionActive(true);

      // Pre-render hero hidden for smooth transition
      setTimeout(() => {
        // Only proceed if View Transitions API is available
        if (document.startViewTransition) {
          const transition = document.startViewTransition(async () => {
            // Set up for the transparent characters animation
            if (textRef.current) {
              const chars = textRef.current.querySelectorAll(".char");

              gsap.to(chars, {
                opacity: 0,
                y: -15,
                scale: 1.2,
                stagger: 0.02,
                duration: 0.7,
                ease: "power2.in",
                delay: 0.2,
              });
            }

            // Mark as revealed halfway through the animation
            setTimeout(() => {
              setIsRevealed(true);
              onRevealComplete();
            }, 600); // Half of transition duration
          });

          // Handle container scaling
          transition.ready.then(() => {
            if (revealContainerRef.current) {
              gsap.to(revealContainerRef.current, {
                scale: 1.2,
                opacity: 0,
                duration: 1.2,
                ease: "power3.inOut",
              });
            }
          });
        } else {
          // Fallback for browsers without View Transitions API
          if (textRef.current) {
            const chars = textRef.current.querySelectorAll(".char");
            gsap.to(chars, {
              opacity: 0,
              y: -15,
              scale: 1.2,
              stagger: 0.02,
              duration: 0.7,
              ease: "power2.in",
            });
          }

          if (revealContainerRef.current) {
            gsap.to(revealContainerRef.current, {
              scale: 1.2,
              opacity: 0,
              duration: 1.2,
              ease: "power3.inOut",
              onComplete: () => {
                setIsRevealed(true);
                onRevealComplete();
              },
            });
          }
        }
      }, 300);
    }
  }, [assetsLoaded, isRevealed, onRevealComplete, transitionActive]);

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
    <>
      {/* Always render the hero but initially hidden for smooth transition */}
      <div
        ref={heroRef}
        className={`absolute inset-0 z-40 ${
          isRevealed ? "opacity-100" : "opacity-0"
        }`}
        style={{
          viewTransitionName: "hero-content",
          transition: "opacity 0.5s ease-in-out",
        }}
      >
        {isRevealed && <LandingHero />}
      </div>

      <div
        className={`fixed inset-0 flex items-center justify-center z-50 ${
          isDark ? "bg-[#09090B]" : "bg-[#FAFAFA]"
        } ${isRevealed ? "pointer-events-none" : ""}`}
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
          transition: opacity 0.3s ease-out, transform 0.4s ease-out;
        }

        @keyframes view-transition-reveal-animation {
          from {
            opacity: 1;
            transform: scale(1);
          }
          to {
            opacity: 0;
            transform: scale(1.1);
          }
        }

        ::view-transition {
          animation-duration: 1.2s;
          animation-timing-function: cubic-bezier(0.76, 0, 0.24, 1);
        }

        ::view-transition-old(reveal-transition) {
          animation: 1.2s cubic-bezier(0.76, 0, 0.24, 1) both fade-out;
          animation-delay: 0s;
          mix-blend-mode: normal;
        }

        ::view-transition-new(hero-content) {
          animation: 1.2s cubic-bezier(0.22, 1, 0.36, 1) both fade-in;
          animation-delay: 0.5s; /* Start halfway through */
        }

        ::view-transition-old(reveal-glow) {
          animation: 1s cubic-bezier(0.76, 0, 0.24, 1) both glow-out;
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.96);
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

        @keyframes glow-out {
          from {
            opacity: 0.3;
            transform: scale(1);
            filter: blur(3xl);
          }
          to {
            opacity: 0;
            transform: scale(2);
            filter: blur(5xl);
          }
        }
      `}</style>
    </>
  );
}
