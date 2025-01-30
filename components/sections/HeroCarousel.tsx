"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { siteConfig } from "@/lib/config";

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % siteConfig.hero.images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    gsap.timeline()
      .from(".hero-title", {
        opacity: 0,
        y: 100,
        duration: 1,
        ease: "power3.out",
      })
      .from(".hero-subtitle", {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power3.out",
      }, "-=0.5")
      .from(".hero-cta", {
        opacity: 0,
        y: 30,
        duration: 1,
        ease: "power3.out",
      }, "-=0.5");

    gsap.to(".hero-bg", {
      yPercent: 30,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero-section",
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
  }, []);

  return (
    <section className="hero-section relative h-screen flex items-center justify-center overflow-hidden">
      {siteConfig.hero.images.map((image, index) => (
        <motion.div
          key={index}
          className={`hero-bg absolute inset-0 z-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: index === currentSlide ? 1 : 0 }}
          transition={{ duration: 1 }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${image}')` }}
          />
          {/* <div className="absolute inset-0 bg-black/50" />  */}
        </motion.div>
      ))}
      
      <div className="relative z-10  text-center text-white px-4 sm:px-6 lg:px-8">
        <h1 className=" text-5xl md:text-7xl font-bold mb-6">
          {siteConfig.hero.title}
        </h1>
        <p className=" text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
          {siteConfig.hero.subtitle}
        </p>
        <motion.button
          whileHover={{ scale : 1.05 }}
          whileTap={{ scale: 0.95 }}
          className=" bg-primary text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-primary/90 transition-colors"
          onClick={() => document.getElementById('book-now')?.scrollIntoView({ behavior: 'smooth' })}
        >
          Book Now
        </motion.button>
      </div>
    </section>
  );
}