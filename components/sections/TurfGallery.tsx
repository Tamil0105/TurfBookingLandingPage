"use client";

// import { motion } from "framer-motion";
// import { siteConfig } from "@/lib/config"; // Assuming you have your images in siteConfig
// import SliderSection from "../sliderImageGalllery/main"

export default function TurfImageGallery() {
  const turfs = [
    {
      id: 1,
      name: 'Tennis Court',
      location: 'City Sports Complex',
      image: 'https://media.istockphoto.com/id/520999573/photo/indoor-soccer-football-field.jpg?s=612x612&w=0&k=20&c=X2PinGm51YPcqCAFCqDh7GvJxoG2WnJ19aadfRYk2dI=',
    },
    {
      id: 2,
      name: 'Cricket Turf',
      location: 'Greenfield Stadium',
      image: 'https://media.istockphoto.com/id/520999573/photo/indoor-soccer-football-field.jpg?s=612x612&w=0&k=20&c=X2PinGm51YPcqCAFCqDh7GvJxoG2WnJ19aadfRYk2dI=',
    },
    {
      id: 3,
      name: 'Football Turf',
      location: 'Riverside Arena',
      image: 'https://media.istockphoto.com/id/520999573/photo/indoor-soccer-football-field.jpg?s=612x612&w=0&k=20&c=X2PinGm51YPcqCAFCqDh7GvJxoG2WnJ19aadfRYk2dI=',
    },
    {
        id: 4,
        name: 'Football Turf',
        location: 'Riverside Arena',
        image: 'https://media.istockphoto.com/id/520999573/photo/indoor-soccer-football-field.jpg?s=612x612&w=0&k=20&c=X2PinGm51YPcqCAFCqDh7GvJxoG2WnJ19aadfRYk2dI=',
      },
  ];
  return (
    <div className="max-w-full mx-auto bg-slate-50 py-16 px-14">
    <h2 className="text-3xl font-bold text-center mb-8">Turf Details</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {turfs.map((turf) => (
        <div key={turf.id} className="bg-white shadow-lg rounded-lg overflow-hidden">
          <img
            src={turf.image}
            alt={turf.name}
            className="w-full h-48 object-cover"
          />
          <div className="p-6">
            <h3 className="text-xl font-bold mb-2">{turf.name}</h3>
            <p className="text-gray-600 mb-4">Located at {turf.location}</p>
            <a
              href="/book"
              className="bg-primary text-secondary px-6 py-2 rounded-full font-semibold hover:bg-secondary-foreground transition duration-300"
            >
              Book Now
            </a>
          </div>
        </div>
      ))}
    </div>
  </div>
    // <section className="turf-gallery relative overflow-hidden py-10">
    //   <motion.div
    //     className="flex space-x-4 overflow-x-auto"
    //     initial={{ x: 0 }}
    //     animate={{ x: 0 }}
    //     transition={{ type: "spring", stiffness: 100 }}
    //   >

    //     <SliderSection images={[...siteConfig.gallery,...siteConfig.gallery]}/>
    //     {/* {[...siteConfig.gallery,...siteConfig.gallery].map((image, index) => (
    //       <motion.div
    //         key={index}
    //         className="turf-image-container flex-shrink-0"
    //         whileHover={{ scale: 1.05 }}
    //         transition={{ duration: 0.3 }}
    //       >
    //         <motion.img
    //           src={image.image}
    //           alt={`Turf Image ${index + 1}`}
    //           className="turf-image w-64 h-40 object-cover rounded-lg"
    //           whileTap={{ scale: 0.95 }}
    //         />
    //       </motion.div>
    //     ))} */}
    //   </motion.div>
    // </section>
  );
}