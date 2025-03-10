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
import { NavigationBarBackground } from "./NavigationBarBackground";
import { useSession, signOut } from "next-auth/react";

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
            : "border border-transparent bg-transparent text-gray-800 hover:border-gray-200/30 dark:text-white dark:hover:border-white/5"
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
                background: `radial-gradient(circle 80px at ${mouseX.get()}px ${mouseY.get()}px, rgba(255,255,255,0.2), transparent)`,
              }}
            />

            {/* Edge highlight */}
            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white opacity-20" />
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
          className="flex h-7 w-7 items-center justify-center"
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
            className="h-3.5 w-3.5 text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]"
            strokeWidth={2.5}
          />
        </motion.div>

        <div
          className="absolute -inset-1 z-[-1] opacity-40 blur-md"
          style={{
            background: `radial-gradient(circle, ${ThemeColors.accent}60 0%, transparent 70%)`,
          }}
        />
      </div>

      <div className="flex flex-col">
        <motion.span
          className="text-sm font-bold tracking-tight text-gray-800 dark:text-white"
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
          className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.15em] text-gray-600 dark:text-gray-300"
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
      <div className="absolute inset-0 bg-white/5 backdrop-blur-sm dark:bg-black/70" />
      <NavigationBarBackground />
      <div className="absolute inset-0">
        <motion.div
          className="absolute bottom-0 h-[1px] w-full"
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
  const { data: session } = useSession();

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
      className={`fixed left-0 right-0 top-0 z-[100] transition-all ${
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
      {scrolled && <NavBackground />}

      <div className="container relative z-10 mx-auto max-w-6xl px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <LogoSection />

            {/* Desktop Navigation */}
            <motion.nav
              className="hidden items-center gap-4 pl-6 sm:flex"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <div className="flex items-center gap-2 border-l border-white/5 pl-6">
                {navItems.map((item, index) => (
                  <NavItem
                    key={item.href}
                    icon={item.icon}
                    label={item.label}
                    href={item.href}
                    isActive={pathname === item.href}
                    index={index}
                  />
                ))}

                {/* Integrate auth section into nav items */}
                {session ? (
                  <motion.button
                    onClick={() => void signOut()}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="ml-2 flex items-center gap-2 px-4 py-1.5 text-xs font-medium tracking-wide"
                    style={{
                      clipPath:
                        "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
                      backgroundColor: `${ThemeColors.accent}15`,
                      color: ThemeColors.accent,
                    }}
                  >
                    <span className="mr-2 text-sm text-gray-600 dark:text-gray-300">
                      {session.user?.email?.split("@")[0]}
                    </span>
                    <span>SIGN OUT</span>
                  </motion.button>
                ) : (
                  <Link href="/auth" className="ml-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center gap-2 px-4 py-1.5 text-xs font-medium tracking-wide"
                      style={{
                        clipPath:
                          "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
                        backgroundColor: ThemeColors.accent,
                        color: "#ffffff",
                      }}
                    >
                      <span>SIGN IN</span>
                      <ArrowRight size={12} />
                    </motion.button>
                  </Link>
                )}
              </div>
            </motion.nav>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="p-1.5 sm:hidden"
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

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              className="mt-2 sm:hidden"
              style={{
                clipPath:
                  "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
                backdropFilter: "blur(12px)",
                background: "rgba(255,255,255,0.85) dark:rgba(0,0,0,0.75)",
                border: `1px solid ${ThemeColors.accent}15`,
                boxShadow:
                  "0 8px 16px -4px rgba(0,0,0,0.1), inset 0 0 0 1px rgba(255,255,255,0.05)",
              }}
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
            >
              <div className="relative z-10 p-2">
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
                  <li className="mt-1 pt-2">
                    <div
                      className="mb-2 h-[1px] w-full"
                      style={{
                        background: `linear-gradient(90deg, transparent, ${ThemeColors.accent}15, transparent)`,
                      }}
                    />
                    {session ? (
                      <motion.button
                        onClick={() => void signOut()}
                        className="flex w-full items-center justify-center gap-2 px-3 py-1.5"
                        style={{
                          clipPath:
                            "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
                          backgroundColor: `${ThemeColors.accent}15`,
                          color: ThemeColors.accent,
                        }}
                        whileHover={{ scale: 1.01, y: -1 }}
                        whileTap={{ scale: 0.99, y: 1 }}
                      >
                        <span className="text-xs font-semibold tracking-widest">
                          SIGN OUT ({session.user?.email?.split("@")[0]})
                        </span>
                      </motion.button>
                    ) : (
                      <Link href="/auth" className="block w-full">
                        <motion.div
                          className="flex items-center justify-center gap-2 px-3 py-1.5 text-white"
                          style={{
                            clipPath:
                              "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
                            backgroundColor: ThemeColors.accent,
                            boxShadow: `0 0 15px ${ThemeColors.accent}33, inset 0 1px 0 rgba(255,255,255,0.1)`,
                          }}
                          whileHover={{ scale: 1.01, y: -1 }}
                          whileTap={{ scale: 0.99, y: 1 }}
                        >
                          <motion.span
                            className="text-xs font-semibold tracking-widest"
                            initial={{ x: -5, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                          >
                            SIGN IN
                          </motion.span>
                          <motion.div
                            initial={{ x: -3, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                          >
                            <ArrowRight size={12} />
                          </motion.div>
                        </motion.div>
                      </Link>
                    )}
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
