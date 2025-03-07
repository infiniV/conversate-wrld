"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue } from "framer-motion";
import Link from "next/link";
import {
  MessageSquare,
  Sparkles,
  Menu,
  X,
  Zap,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { ThemeColors } from "./ThemeConstants";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  isActive: boolean;
  index: number;
}

const NavItem = ({ icon, label, href, isActive, index }: NavItemProps) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  return (
    <Link href={href} className="relative">
      <motion.div
        className={`flex items-center gap-2 px-3 py-1.5 ${
          isActive
            ? "text-white shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_2px_6px_rgba(0,0,0,0.15)]"
            : "text-gray-800 dark:text-white bg-transparent border border-transparent hover:border-gray-200/30 dark:hover:border-white/5"
        } transition-all`}
        style={{
          clipPath:
            "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
        }}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{
          duration: 0.3,
          delay: index * 0.1,
          ease: [0.23, 1, 0.32, 1],
        }}
        whileHover={{
          scale: 1.01,
          backgroundColor: isActive ? undefined : "rgba(255, 255, 255, 0.03)",
          y: -1,
        }}
        whileTap={{ scale: 0.97, y: 1 }}
        onMouseMove={handleMouseMove}
      >
        <span className="text-[14px]">{icon}</span>
        <span className="text-[12px] font-medium tracking-wide">{label}</span>

        {isActive && (
          <motion.div
            className="absolute inset-0 z-[-1] overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              clipPath:
                "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
            }}
          >
            {/* Solid background instead of gradient */}
            <div
              className="absolute inset-0"
              style={{ backgroundColor: ThemeColors.accent }}
            />

            {/* Animated light effect */}
            <motion.div
              className="absolute inset-0 opacity-40"
              style={{
                background: `radial-gradient(circle 80px at ${mouseX}px ${mouseY}px, rgba(255,255,255,0.2), transparent)`,
              }}
            />

            {/* Edge highlight */}
            <div className="absolute inset-0 opacity-20 bg-gradient-to-t from-transparent via-transparent to-white" />
          </motion.div>
        )}

        {isActive && (
          <motion.span
            className="absolute right-2 opacity-60"
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 0.6, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <ChevronRight size={12} />
          </motion.span>
        )}
      </motion.div>
    </Link>
  );
};

const LogoSection = () => {
  return (
    <motion.div
      className="flex items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
    >
      <div className="relative mr-2">
        <motion.div
          className="w-7 h-7 flex items-center justify-center"
          style={{
            clipPath:
              "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
            backgroundColor: ThemeColors.accent,
            boxShadow: `0 0 12px ${ThemeColors.accent}4D, inset 0 0 0 1px rgba(255,255,255,0.15)`,
          }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          <Zap
            className="w-3.5 h-3.5 text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]"
            strokeWidth={2.5}
          />
        </motion.div>

        <div
          className="absolute -inset-1 blur-md z-[-1] opacity-40"
          style={{
            background: `radial-gradient(circle, ${ThemeColors.accent}60 0%, transparent 70%)`,
          }}
        />
      </div>

      <div className="flex flex-col">
        <motion.span
          className="font-bold text-sm tracking-tight dark:text-white text-gray-800"
          initial={{ letterSpacing: "0.1em" }}
          animate={{ letterSpacing: "0.02em" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          CONVERSATE
        </motion.span>

        <div className="flex items-center">
          <motion.div
            className="h-[1px] w-full"
            style={{
              backgroundColor: ThemeColors.accent,
            }}
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          />
        </div>

        <motion.span
          className="text-[9px] uppercase tracking-[0.15em] mt-0.5 dark:text-gray-300 text-gray-600 font-medium"
          initial={{ opacity: 0, y: 3 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.7 }}
        >
          AI Customer Care
        </motion.span>
      </div>
    </motion.div>
  );
};

const NavBackground = () => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {/* Theme-aware background with minimal blur */}
      <div className="absolute inset-0 bg-white/5 dark:bg-black/50 backdrop-blur-sm" />

      {/* Simplified grid pattern */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px), 
          linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)`,
          backgroundSize: "20px 20px",
          opacity: 0.4,
        }}
      />

      {/* Minimal accent line */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute h-[1px] w-full bottom-0"
          style={{
            background: `linear-gradient(90deg, transparent, ${ThemeColors.accent}30, transparent)`,
          }}
          animate={{
            left: ["-100%", "100%"],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>
    </div>
  );
};

export function NavigationBar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    {
      icon: <MessageSquare className="stroke-current" size={16} />,
      label: "DEMO",
      href: "/demo",
    },
    {
      icon: <Sparkles className="stroke-current" size={16} />,
      label: "FEATURES",
      href: "/#features",
    },
  ];

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all ${
        scrolled ? "py-2" : "py-3"
      }`}
      style={{
        backdropFilter: scrolled ? "blur(10px)" : "none",
        background: scrolled
          ? "rgba(255,255,255,0.7) dark:rgba(0,0,0,0.65)"
          : "transparent",
      }}
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
    >
      {/* Only show NavBackground when scrolled */}
      {scrolled && <NavBackground />}

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="flex justify-between items-center">
          <LogoSection />

          <div className="flex items-center gap-3">
            {/* Desktop Navigation */}
            <motion.nav
              className="hidden sm:block border-l border-white/5 pl-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <ul className="flex space-x-2">
                {navItems.map((item, index) => (
                  <li key={item.href}>
                    <NavItem
                      icon={item.icon}
                      label={item.label}
                      href={item.href}
                      isActive={pathname === item.href}
                      index={index}
                    />
                  </li>
                ))}
              </ul>
            </motion.nav>

            {/* Mobile Menu Button */}
            <motion.button
              className="sm:hidden p-1.5"
              style={{
                clipPath:
                  "polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))",
                backgroundColor: mobileMenuOpen
                  ? ThemeColors.accent
                  : "rgba(255,255,255,0.03)",
                boxShadow: mobileMenuOpen
                  ? "0 0 12px rgba(255,61,113,0.2), inset 0 1px 0 rgba(255,255,255,0.1)"
                  : "none",
              }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.95, y: 1 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <AnimatePresence mode="wait">
                {mobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X size={14} className="text-white" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu size={14} className="text-gray-800 dark:text-white" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu - Simplified */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              className="sm:hidden mt-2"
              style={{
                clipPath:
                  "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
                backdropFilter: "blur(12px)",
                background: "rgba(0,0,0,0.7)",
                border: `1px solid ${ThemeColors.accent}20`,
                boxShadow:
                  "0 8px 16px -4px rgba(0,0,0,0.2), inset 0 0 0 1px rgba(255,255,255,0.05)",
              }}
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
            >
              <div className="p-2">
                <ul className="flex flex-col space-y-1">
                  {navItems.map((item, index) => (
                    <li key={item.href} className="w-full">
                      <NavItem
                        icon={item.icon}
                        label={item.label}
                        href={item.href}
                        isActive={pathname === item.href}
                        index={index}
                      />
                    </li>
                  ))}
                  <li className="pt-2 mt-1">
                    <div
                      className="h-[1px] w-full mb-2"
                      style={{ backgroundColor: `${ThemeColors.accent}20` }}
                    />
                    <Link href="/get-started" className="w-full block">
                      <motion.div
                        className="flex items-center justify-center gap-2 text-white px-3 py-1.5"
                        style={{
                          clipPath:
                            "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
                          backgroundColor: ThemeColors.accent,
                          boxShadow:
                            "0 0 15px rgba(255,61,113,0.2), inset 0 1px 0 rgba(255,255,255,0.1)",
                        }}
                        whileHover={{ scale: 1.01, y: -1 }}
                        whileTap={{ scale: 0.99, y: 1 }}
                      >
                        <span className="text-xs font-semibold tracking-widest">
                          GET STARTED
                        </span>
                        <ArrowRight size={12} />
                      </motion.div>
                    </Link>
                  </li>
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
