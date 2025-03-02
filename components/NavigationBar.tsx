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
        className={`flex items-center gap-3 px-4 py-2 ${
          isActive
            ? "text-white shadow-[0_0_0_1px_rgba(255,255,255,0.15),0_4px_10px_rgba(0,0,0,0.2)]"
            : "text-gray-800 dark:text-white bg-transparent border border-transparent hover:border-gray-200/40 dark:hover:border-white/10"
        } transition-all`}
        style={{
          clipPath:
            "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
        }}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{
          duration: 0.3,
          delay: index * 0.1,
          ease: [0.23, 1, 0.32, 1],
        }}
        whileHover={{
          scale: 1.02,
          backgroundColor: isActive ? undefined : "rgba(255, 255, 255, 0.05)",
          y: -1,
        }}
        whileTap={{ scale: 0.97, y: 1 }}
        onMouseMove={handleMouseMove}
      >
        <span className="text-[15px]">{icon}</span>
        <span className="text-[13px] font-medium tracking-wide">{label}</span>

        {isActive && (
          <motion.div
            className="absolute inset-0 z-[-1] overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              clipPath:
                "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
            }}
          >
            {/* Solid background instead of gradient */}
            <div
              className="absolute inset-0"
              style={{ backgroundColor: ThemeColors.accent }}
            />

            {/* Animated light effect */}
            <motion.div
              className="absolute inset-0 opacity-60"
              style={{
                background: `radial-gradient(circle 100px at ${mouseX}px ${mouseY}px, rgba(255,255,255,0.2), transparent)`,
              }}
            />

            {/* Edge highlight */}
            <div className="absolute inset-0 opacity-30 bg-gradient-to-t from-transparent via-transparent to-white" />
          </motion.div>
        )}

        {isActive && (
          <motion.span
            className="absolute right-3 opacity-60"
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 0.6, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <ChevronRight size={14} />
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
      <div className="relative mr-3">
        <motion.div
          className="w-9 h-9 flex items-center justify-center"
          style={{
            clipPath:
              "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
            backgroundColor: ThemeColors.accent,
            boxShadow: `0 0 15px ${ThemeColors.accent}4D, inset 0 0 0 1px rgba(255,255,255,0.15)`,
          }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          <Zap
            className="w-4 h-4 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]"
            strokeWidth={2.5}
          />
        </motion.div>

        {/* Simple ambient glow */}
        <div
          className="absolute -inset-1 blur-md z-[-1] opacity-50"
          style={{
            background: `radial-gradient(circle, ${ThemeColors.accent}80 0%, transparent 70%)`,
          }}
        />
      </div>

      <div className="flex flex-col">
        <motion.span
          className="font-bold text-base tracking-tight dark:text-white text-gray-800"
          initial={{ letterSpacing: "0.1em" }}
          animate={{ letterSpacing: "0.02em" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          CONVERSATE
        </motion.span>

        <div className="flex items-center mt-0.5">
          <motion.div
            className="h-[1px] w-full"
            style={{
              backgroundColor: ThemeColors.accent,
            }}
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          />

          {/* Animated dot on line */}
          <motion.div
            className="absolute h-[3px] w-[3px] rounded-full z-10"
            style={{ background: ThemeColors.accent }}
            animate={{
              x: ["0%", "100%", "0%"],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              repeatDelay: 1,
            }}
          />
        </div>

        <motion.span
          className="text-[10px] uppercase tracking-[0.15em] mt-0.5 dark:text-gray-300 text-gray-600 font-medium"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.7 }}
        >
          AI Customer Care
        </motion.span>
      </div>
    </motion.div>
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
        scrolled ? "py-3" : "py-5"
      }`}
      style={{
        backdropFilter: scrolled ? "blur(12px)" : "none",
        background: scrolled ? "rgba(0,0,0,0.4)" : "transparent",
        boxShadow: scrolled ? "0 1px 0 rgba(255,255,255,0.05)" : "none",
      }}
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
    >
      {/* Animated background lines */}
      {/* {scrolled && (
        <div className="absolute inset-0 overflow-hidden z-[-1] opacity-30">
          <svg className="w-full h-full">
            <motion.line
              x1="0%"
              y1="100%"
              x2="100%"
              y2="0%"
              stroke={ThemeColors.accent}
              strokeWidth="1"
              strokeDasharray="1,30"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            />
            <motion.line
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
              stroke={ThemeColors.secondaryAccents.cyan}
              strokeWidth="1"
              strokeDasharray="1,30"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "linear",
                delay: 0.5,
              }}
            />
          </svg>
        </div>
      )} */}

      <div className="container mx-auto px-6 max-w-6xl">
        <div className="flex justify-between items-center">
          <LogoSection />

          <div className="flex items-center gap-4">
            {/* CTA Button */}
            {/* <motion.a
              href="/get-started"
              className="hidden sm:flex items-center text-xs font-semibold text-white px-5 py-2.5 gap-2"
              style={{
                clipPath:
                  "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
                backgroundColor: ThemeColors.accent,
                boxShadow:
                  "0 0 20px rgba(255,61,113,0.35), inset 0 1px 0 rgba(255,255,255,0.15)",
              }}
              whileHover={{
                scale: 1.03,
                y: -1,
                boxShadow:
                  "0 0 25px rgba(255,61,113,0.45), inset 0 1px 0 rgba(255,255,255,0.2)",
              }}
              whileTap={{ scale: 0.98, y: 1 }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.4 }}
            >
              <span className="tracking-widest">GET STARTED</span>
              <motion.div
                initial={{ x: -3, opacity: 0.7 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{
                  duration: 0.3,
                  repeat: Infinity,
                  repeatType: "reverse",
                  repeatDelay: 0.5,
                }}
              >
                <ArrowRight size={14} />
              </motion.div>
            </motion.a> */}

            {/* Desktop Navigation */}
            <motion.nav
              className="hidden sm:block border-l border-white/10 pl-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <ul className="flex space-x-3">
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
              className="sm:hidden p-2"
              style={{
                clipPath:
                  "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
                backgroundColor: mobileMenuOpen
                  ? ThemeColors.accent
                  : "rgba(255,255,255,0.05)",
                boxShadow: mobileMenuOpen
                  ? "0 0 15px rgba(255,61,113,0.3), inset 0 1px 0 rgba(255,255,255,0.1)"
                  : "none",
              }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              whileHover={{ scale: 1.05, y: -1 }}
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
                    <X size={16} className="text-white" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu size={16} className="text-gray-800 dark:text-white" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              className="sm:hidden mt-4"
              style={{
                clipPath:
                  "polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))",
                backdropFilter: "blur(16px)",
                background: "rgba(0,0,0,0.75)",
                border: `1px solid ${ThemeColors.accent}33`,
                boxShadow:
                  "0 10px 25px -5px rgba(0,0,0,0.3), inset 0 0 0 1px rgba(255,255,255,0.05)",
              }}
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            >
              {/* Ambient glow in menu */}
              <motion.div
                className="absolute top-[10%] right-[10%] w-[100px] h-[100px] rounded-full blur-[80px] z-[-1]"
                style={{ background: `${ThemeColors.accent}4D` }}
                animate={{
                  opacity: [0.2, 0.4, 0.2],
                  x: [0, 10, 0],
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              <div className="p-4">
                <ul className="flex flex-col space-y-3">
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
                  <li className="pt-3 mt-1">
                    {/* Change gradient separator to solid color */}
                    <div
                      className="h-[1px] w-full mb-3"
                      style={{ backgroundColor: `${ThemeColors.accent}33` }}
                    />
                    <Link href="/get-started" className="w-full block">
                      <motion.div
                        className="flex items-center justify-center gap-2 text-white px-4 py-2.5"
                        style={{
                          clipPath:
                            "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
                          backgroundColor: ThemeColors.accent,
                          boxShadow:
                            "0 0 20px rgba(255,61,113,0.25), inset 0 1px 0 rgba(255,255,255,0.1)",
                        }}
                        whileHover={{ scale: 1.01, y: -1 }}
                        whileTap={{ scale: 0.99, y: 1 }}
                      >
                        <span className="text-xs font-semibold tracking-widest">
                          GET STARTED
                        </span>
                        <motion.div
                          initial={{ x: -3, opacity: 0.7 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{
                            duration: 0.3,
                            repeat: Infinity,
                            repeatType: "reverse",
                            repeatDelay: 0.5,
                          }}
                        >
                          <ArrowRight size={14} />
                        </motion.div>
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
