"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Image from "next/image";

export default function AboutUs() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="py-24 bg-gray-50" id="about-us">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">About Us</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Learn more about our mission, values, and the team behind our success.
          </p>
        </div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
        >
          {/* Left Column: Image */}
          <motion.div variants={itemVariants} className="relative h-96">
            <Image
              src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1284&q=80"
              alt="About Us"
              fill
              className="rounded-2xl object-cover"
            />
          </motion.div>

          {/* Right Column: Content */}
          <motion.div variants={itemVariants} className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900">
              Our Mission
            </h3>
            <p className="text-gray-600">
              At Turf Booking, our mission is to provide seamless and affordable access to high-quality sports turfs for players, teams, and event organizers. We believe in promoting an active lifestyle and fostering a sense of community through sports.
            </p>

            <h3 className="text-2xl font-bold text-gray-900">
              Our Values
            </h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Customer-Centric: We prioritize your needs and satisfaction.</li>
              <li>Transparency: Clear pricing and no hidden fees.</li>
              <li>Quality: Only the best turfs and facilities.</li>
              <li>Accessibility: 24/7 booking and support.</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900">
              Our Team
            </h3>
            <p className="text-gray-600">
              Our team is made up of passionate sports enthusiasts and tech experts who are dedicated to making turf booking simple, efficient, and enjoyable for everyone.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}