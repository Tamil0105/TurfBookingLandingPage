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
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
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
          <motion.div
      variants={textVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <p className="text-gray-600 text-lg text-center md:text-start md:text-xl">
        At Turf Booking, we aim to provide seamless and affordable access to
        high-quality sports turfs for players, teams, and event organizers. We
        prioritize your needs and satisfaction through transparent pricing with
        no hidden fees, offering only the best turfs and facilities. Our 24/7
        booking and support ensure accessibility for all. Our passionate team
        of sports enthusiasts and tech experts is dedicated to making turf
        booking simple, efficient, and enjoyable for everyone while promoting
        an active lifestyle and fostering a sense of community through sports.
      </p>
    </motion.div>
        </motion.div>
      </div>
    </section>
  );
}