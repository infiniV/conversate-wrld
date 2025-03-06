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
  const firstLetterRef = useRef<HTMLSpanElement>(null);
  const circleOverlayRef = useRef<HTMLDivElement>(null);
  const { theme, systemTheme } = useTheme();

  // Determine the current theme
  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";

  // Improved function to position circle overlay exactly over the C letter
  const positionCircleOverlay = () => {
    if (firstLetterRef.current && circleOverlayRef.current) {
      const rect = firstLetterRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Set position as transform translate for better performance
      circleOverlayRef.current.style.transform = `translate(-50%, -50%) translate(${centerX}px, ${centerY}px)`;
    }
  };

  // Initialize animations
  useEffect(() => {
    // Only run on client
    if (typeof window === "undefined") return;

    // Start assets loading
    const preloadAssets = async () => {
      // Simulate asset loading (replace with actual asset loading logic)
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Reduced loading time
      setAssetsLoaded(true);
    };

    preloadAssets();

    // Custom text reveal animation without SplitText plugin
    if (textRef.current && firstLetterRef.current) {
      // Get all characters as spans
      const chars = textRef.current.querySelectorAll(
        ".char:not(.first-letter)"
      );
      const firstLetter = firstLetterRef.current;

      // Create animation timeline
      const tl = gsap.timeline();

      // Animate first letter 'C' with improved animation
      tl.fromTo(
        firstLetter,
        {
          opacity: 0,
          scale: 1.5,
          y: -20,
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.8,
          ease: "back.out(1.7)",
        }
      )
        // Animate remaining letters with improved timing
        .fromTo(
          chars,
          {
            opacity: 0,
            y: 15,
            rotationX: -20,
          },
          {
            opacity: 1,
            y: 0,
            rotationX: 0,
            stagger: 0.03, // Faster stagger
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.4" // Start sooner
        );
    }

    // Make sure the circle is positioned correctly on window resize
    window.addEventListener("resize", positionCircleOverlay);
    return () => {
      window.removeEventListener("resize", positionCircleOverlay);
    };
  }, []);

  // Handle transition when assets are loaded
  useEffect(() => {
    if (
      assetsLoaded &&
      !isRevealed &&
      firstLetterRef.current &&
      circleOverlayRef.current
    ) {
      // Position the overlay circle
      positionCircleOverlay();

      // Use a different transition approach for smoother effect
      const tl = gsap.timeline({
        onComplete: () => {
          setTimeout(() => {
            setIsRevealed(true);
            onRevealComplete();
          }, 100);
        },
      });

      // Show the circle overlay first
      tl.to(circleOverlayRef.current, {
        opacity: 1,
        duration: 0.2,
      })
        // Then expand it to fill the screen
        .to(
          circleOverlayRef.current,
          {
            scale: 100,
            duration: 0.8,
            ease: "power2.inOut",
          },
          "+=0.1"
        )
        // Fade out the letter C at the same time
        .to(
          firstLetterRef.current,
          {
            opacity: 0,
            duration: 0.3,
          },
          "-=0.7"
        );

      // Fade out the other letters slightly after
      const otherLetters = textRef.current?.querySelectorAll(
        ".char:not(.first-letter)"
      );
      if (otherLetters) {
        tl.to(
          otherLetters,
          {
            opacity: 0,
            stagger: 0.02,
            duration: 0.3,
          },
          "-=0.6"
        );
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

  // Helper function to wrap each letter in a span with improved alignment
  const wrapLettersInSpans = (
    text: string,
    className: string,
    isFirstPart: boolean
  ) => {
    return text.split("").map((letter, i) => {
      // Only set firstLetterRef on the very first letter when it's the first part
      const isActualFirstLetter = isFirstPart && i === 0;

      return (
        <span
          key={i}
          ref={isActualFirstLetter ? firstLetterRef : undefined}
          className={`${className} char ${
            isActualFirstLetter ? "first-letter" : ""
          }`}
          style={{
            display: "inline-block",
            transformOrigin: isActualFirstLetter
              ? "center center"
              : "center bottom",
            position: isActualFirstLetter ? "relative" : "static",
          }}
        >
          {letter}
        </span>
      );
    });
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 ${
        isDark ? "bg-[#09090B]" : "bg-[#FAFAFA]"
      } overflow-hidden`}
      ref={revealContainerRef}
      style={{
        viewTransitionName: "reveal-transition",
      }}
    >
      {/* Circle overlay with improved positioning */}
      <div
        ref={circleOverlayRef}
        className="fixed rounded-full bg-[#FF3D71] w-12 h-12 opacity-0"
        style={{
          transformOrigin: "center center",
          zIndex: 30,
          pointerEvents: "none",
          left: 0, // Will be positioned with transform
          top: 0, // Will be positioned with transform
        }}
      />
      <div className="relative" ref={textRef}>
        <h1
          className={`text-7xl md:text-8xl lg:text-9xl font-bold ${
            isDark ? "text-white" : "text-gray-900"
          } relative z-10`}
        >
          <span className="inline-block">
            {wrapLettersInSpans("Convers", "", true)}{" "}
            {/* Capitalize C and mark as first part */}
          </span>
          <span className="inline-block text-[#FF3D71]">
            {wrapLettersInSpans("ate", "", false)}{" "}
            {/* Mark as not the first part */}
          </span>
        </h1>
        <div
          className="absolute -inset-10 blur-3xl rounded-full opacity-30"
          style={{
            background: `radial-gradient(circle, ${ThemeColors.accent}60 0%, transparent 70%)`,
            viewTransitionName: "reveal-glow",
          }}
        />
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
          transform: translateZ(0);
          will-change: transform, opacity;
        }

        .first-letter {
          position: relative;
          z-index: 20;
          color: #ff3d71 !important; /* Make the first letter the accent color */
          transform-origin: center !important;
          display: inline-flex !important;
          justify-content: center;
          align-items: center;
        }

        .char:not(.first-letter) {
          position: relative;
          z-index: 10;
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
