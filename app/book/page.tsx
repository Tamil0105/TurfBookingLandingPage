"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { DatePicker, Form, Input, Select, Button, Card } from "antd";
import { siteConfig } from "@/lib/config";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import SliderSectionForTurfCard from "@/components/sliderForTurfCard/main";

const { Option } = Select;

export default function BookingPage() {
  const [form] = Form.useForm();

  const containerVariants = {
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

  const onFinish = (values: any) => {
    console.log("Form values:", values);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-24 pb-16">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Book Your Turf</h1>
            <p className="text-xl text-gray-600">Select your preferred turf and time slot</p>
          </div>


<SliderSectionForTurfCard/>
          {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {siteConfig.gallery.map((turf, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                className="rounded-lg overflow-hidden shadow-lg"
              >
                <Card
                  cover={
                    <img
                      alt={turf.title}
                      src={turf.image}
                      className="h-48 w-full object-cover"
                    />
                  }
                  className="h-full"
                >
                  <Card.Meta
                    title={turf.title}
                    description="Available for booking"
                  />
                </Card>
              </motion.div>
            ))}
          </div> */}

          <div className="max-w-2xl mx-auto">
            <Card className="shadow-lg">
              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                className="space-y-6"
              >
                <Form.Item
                  label="Select Turf"
                  name="turf"
                  rules={[{ required: true, message: "Please select a turf" }]}
                >
                  <Select placeholder="Choose your preferred turf">
                    {siteConfig.gallery.map((turf, index) => (
                      <Option key={index} value={turf.title}>
                        {turf.title}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  label="Date"
                  name="date"
                  rules={[{ required: true, message: "Please select a date" }]}
                >
                  <DatePicker className="w-full" />
                </Form.Item>

                <Form.Item
                  label="Time Slot"
                  name="timeSlot"
                  rules={[{ required: true, message: "Please select a time slot" }]}
                >
                  <Select placeholder="Choose your preferred time">
                    {Array.from({ length: 12 }, (_, i) => i + 8).map((hour) => (
                      <Option key={hour} value={`${hour}:00`}>
                        {`${hour}:00 ${hour < 12 ? "AM" : "PM"}`}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  label="Duration (hours)"
                  name="duration"
                  rules={[{ required: true, message: "Please select duration" }]}
                >
                  <Select placeholder="Select duration">
                    <Option value="1">1 Hour</Option>
                    <Option value="2">2 Hours</Option>
                    <Option value="3">3 Hours</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  label="Full Name"
                  name="name"
                  rules={[{ required: true, message: "Please enter your name" }]}
                >
                  <Input placeholder="Enter your full name" />
                </Form.Item>

                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    { required: true, message: "Please enter your email" },
                    { type: "email", message: "Please enter a valid email" },
                  ]}
                >
                  <Input placeholder="Enter your email address" />
                </Form.Item>

                <Form.Item
                  label="Phone"
                  name="phone"
                  rules={[{ required: true, message: "Please enter your phone number" }]}
                >
                  <Input placeholder="Enter your phone number" />
                </Form.Item>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="w-full h-12 bg-primary hover:bg-primary/90"
                  >
                    Book Now
                  </Button>
                </motion.div>
              </Form>
            </Card>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}