"use client";

import { motion } from "framer-motion";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "../ui/button";
import { FloatButton } from "antd";
import { CustomerServiceOutlined, PhoneFilled, WhatsAppOutlined } from '@ant-design/icons';

export default function Footer() {
  const socialLinks = [
    { icon: Facebook, href: "#" },
    { icon: Instagram, href: "#" },
    { icon: Twitter, href: "#" },
  ];

  const contactInfo = [
    { icon: Mail, text: "contact@turfbook.com" },
    { icon: Phone, text: "+1 (555) 123-4567" },
    { icon: MapPin, text: "123 Sports Avenue, NY 10001" },
  ];

  return (
    <footer className="bg-primary text-white py-16" id="contact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3 className="text-2xl font-bold mb-6">TurfBook</h3>
            <p className="text-gray-400 mb-6">
              Book your perfect turf anytime, anywhere. Experience seamless booking and premium facilities.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={index}
                    href={social.href}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <Icon className="h-6 w-6" />
                  </motion.a>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-6">Contact Us</h3>
            <div className="space-y-4">
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <div key={index} className="flex items-center space-x-3">
                    <Icon className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-400">{info.text}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-6">Get In Touch</h3>
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full p-3 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <input
                type="email"
                placeholder="Your Email"
                className="w-full p-3 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <textarea
                placeholder="Your Message"
                rows={4}
                className="w-full p-3 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
               <Button variant={'secondary'} className="w-full">Send Message</Button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} TurfBook. All rights reserved.</p>
        </div>
      </div>
      <FloatButton
            className="text-primary hover:text-secondary hover:bg-secondary/30"
      shape="circle"
      type="default"
      style={{ insetInlineEnd: 14 }}
      icon={<PhoneFilled />}
    />
      <FloatButton
      className="text-primary hover:text-secondary hover:bg-secondary/30"
      shape="circle"
      type="default"
      style={{ insetInlineEnd: 60 }}
      icon={<WhatsAppOutlined />}
    />
    </footer>
  );
}
