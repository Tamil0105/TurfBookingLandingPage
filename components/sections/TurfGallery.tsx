"use client";

import { motion } from "framer-motion";
import { siteConfig } from "@/lib/config"; // Assuming you have your images in siteConfig
import SliderSection from "../sliderImageGalllery/main"

export default function TurfImageGallery() {
  return (
    <section className="turf-gallery relative overflow-hidden py-10">
      <motion.div
        className="flex space-x-4 overflow-x-auto"
        initial={{ x: 0 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
      >

        <SliderSection images={[...siteConfig.gallery,...siteConfig.gallery]}/>
        {/* {[...siteConfig.gallery,...siteConfig.gallery].map((image, index) => (
          <motion.div
            key={index}
            className="turf-image-container flex-shrink-0"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <motion.img
              src={image.image}
              alt={`Turf Image ${index + 1}`}
              className="turf-image w-64 h-40 object-cover rounded-lg"
              whileTap={{ scale: 0.95 }}
            />
          </motion.div>
        ))} */}
      </motion.div>
    </section>
  );
}