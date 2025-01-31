"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Wallpaper as Soccerball, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

gsap.registerPlugin(ScrollTrigger);

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    gsap.from(".logo", {
      opacity: 0,
      y: -50,
      duration: 1,
      ease: "power3.out",
    });
  }, []);

  // Block scroll when sidebar is open
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isSidebarOpen]);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Features", path: "/#features" },
    // { name: "Book Now", path: "/book" },
    { name: "Testimonials", path: "/#testimonials" },
    { name: "Contact", path: "/#contact" },
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
       pathname==='/book'|| isScrolled || isSidebarOpen
          ? "bg-primary/90 backdrop-blur-md shadow-sm py-2" // Primary color with blur
          : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            {/* <Soccerball className={`h-8 w-8 ${
                isScrolled || isSidebarOpen ? "text-white" : "text-secondary"
              }`} /> */}
            <span
              className={`text-xl font-bold ${
                isScrolled || isSidebarOpen ? "text-white" : "text-secondary"
              }`}
            >
              TurfBook
            </span>
          </Link>
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <motion.div
                key={item.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href={item.path}
                  className={`hover:text-secondary transition-colors ${
                    isScrolled || isSidebarOpen ? "text-white" : "text-primary"
                  } ${
                    pathname === item.path
                      ? "text-secondary font-semibold"
                      : "text-slate-300"
                  }`}
                >
                  {item.name}
                </Link>
              </motion.div>
            ))}
          </nav>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="hidden md:block"
          >
            <Link
              href="/book"
              className="bg-secondary text-primary px-6 py-2 rounded-full hover:bg-secondary/90 transition-colors"
            >
              Book Now
            </Link>
          </motion.div>
          <button onClick={toggleSidebar} className="md:hidden p-2">
            {isSidebarOpen ? (
              <X className="h-6 w-6 text-white" />
            ) : (
              <Menu className="h-6 w-6 text-white" />
            )}
          </button>
        </div>
      </div>
      {/* Sidebar for mobile view */}
      <div
        className={`fixed top-14 right-0 w-full h-full bg-primary/90 backdrop-blur-md transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        } md:hidden`}
      >
        <nav className="flex flex-col space-y-4 p-4  bg-primary/90">
          {navItems.map((item) => (
            <motion.div
              key={item.name}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href={item.path}
                className={`text-white hover:text-secondary transition-colors ${
                  pathname === item.path ? "text-secondary font-semibold" : ""
                }`}
              >
                {item.name}
              </Link>
            </motion.div>
          ))}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/book"
              className="bg-secondary text-primary px-6 py-2 rounded-full hover:bg-secondary/90 transition-colors"
            >
              Book Now
            </Link>
          </motion.div>
        </nav>
      </div>
    </header>
  );
}