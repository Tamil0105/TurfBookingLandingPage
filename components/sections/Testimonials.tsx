"use client";

import {  useRef } from "react";
import { motion } from "framer-motion";
import SliderSectionForTestimonials from "../sliderForTestimonials/main";


export default function Testimonials() {
  const containerRef = useRef<HTMLDivElement>(null);

  

  return (
    <section className="py-24 bg-gray-50" id="testimonials" ref={containerRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it - hear from our satisfied customers.
          </p>
        </motion.div>
        <SliderSectionForTestimonials/>
      </div>
    </section>
  );
}