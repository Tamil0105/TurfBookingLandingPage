"use client";

import { useState, useEffect } from "react";
import dayjs, { Dayjs } from "dayjs";
import moment from "moment-timezone"; // Import moment-timezone
import { motion } from "framer-motion";
import {  Form, Input, Select, Button, Card, Steps, DatePicker } from "antd";
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { siteConfig } from "@/lib/config";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import SliderSectionForTurfCard from "@/components/sliderForTurfCard/main";

const { Option } = Select;
const { Step } = Steps;

export default function BookingPage() {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [duration, setDuration] = useState<number>(1);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [warning, setWarning] = useState<string>('');
  const [totalPayment, setTotalPayment] = useState<number>(500); // Assuming 500 is the cost for 1 hour
  const [turfPrice, setTurfPrice] = useState<number>(500); // Price per hour

  // Form state
  const [formData, setFormData] = useState<any>({
    name: '',
    email: '',
    phone: '',
    turf: '',
    date: null,
    paymentMethod: '',
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
    turf: '',
    date: '',
    paymentMethod: '',
  });

  

  // Load form data from localStorage on component mount
  useEffect(() => {
    const savedFormData = localStorage.getItem('bookingFormData');
    if (savedFormData) {
      setFormData(JSON.parse(savedFormData));
    }
  }, []);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('bookingFormData', JSON.stringify(formData));
  }, [formData]);

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

  // Handle form submission
  const onFinish = () => {
    if (currentStep === 2) {
      console.log("Form values:", formData);
      // Handle final form submission to your backend
      localStorage.removeItem('bookingFormData'); // Clear localStorage after submission
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  // Validate current step
  const validateStep = () => {
    const newErrors: any = {};
    if (currentStep === 0) {
      if (!formData.name) newErrors.name = "Please enter your name";
      if (!formData.email) {
        newErrors.email = "Please enter your email";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Please enter a valid email";
      }
      if (!formData.phone) newErrors.phone = "Please enter your phone number";
    } else if (currentStep === 1) {
      if (!formData.turf) newErrors.turf = "Please select a turf";
      if (!formData.date) newErrors.date = "Please select a date";
    } else if (currentStep === 2) {
      if (!formData.paymentMethod) newErrors.paymentMethod = "Please select a payment method";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' }); // Clear error on change
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' }); // Clear error on change
  };

  // Handle date change
  const handleDateChange = (date: any) => {
    setFormData({ ...formData, date });
    setErrors({ ...errors, date: '' }); // Clear error on change
  };

  // Fetch available slots

  useEffect(() => {
    console.log("useEffect triggered");
    const fetchAvailableSlots = async () => {
      const { turf, date } = formData;

      console.log("Turf:", turf);
      console.log("Date:", date);
  
      if (turf && date) {
        try {
          const apiUrl = `api/slots?date=${date}&userLocation=${encodeURIComponent(turf)}`;
          console.log("Fetching slots from:", apiUrl);
  
          const response = await fetch(apiUrl);
          if (!response.ok) {
            throw new Error('Failed to fetch available slots');
          }
  
          const data = await response.json();
          console.log("API Response:", data.map((item:any) =>item.startTime));
  
          setAvailableSlots(data.map((item:{startTime:string}) =>item.startTime) || []); // Ensure slots is an array
        } catch (error) {
          console.error('Error fetching available slots:', error);
          setAvailableSlots([]); // Reset slots on error
        }
      } else {
        setAvailableSlots([]); // Reset slots if turf or date is missing
      }
    };
  
    fetchAvailableSlots();
  }, [formData.turf, formData.date, currentStep]);


  // Update total payment
  useEffect(() => {
    setTotalPayment(duration * turfPrice);
  }, [duration, turfPrice]);

  // Format time display
  const formatTimeDisplay = (time: string) => {
    const hour = parseInt(time.split(':')[0]);
    return `${hour % 12 || 12} ${hour < 12 ? 'AM' : 'PM'}`;
  };

  // Get next hour
  const getNextHour = (isoTime: string): string => {
    // Parse the ISO string into a Date object
    const date = new Date(isoTime);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
        throw new Error('Invalid ISO date string');
    }

    // Increment the hour by 1
    date.setHours(date.getHours() + 1);

    // Return the new time in ISO string format
    return date.toISOString();
};

  // Calculate available duration
  const calculateAvailableDuration = (startTime: string) => {
    let maxDuration = 0;
    let currentTime = startTime;
   console.log(startTime,getNextHour(startTime))
    while (availableSlots.includes(currentTime)) {
      maxDuration++;
      currentTime = getNextHour(currentTime);
    }
    return maxDuration;
  };

  // Handle increment
  const handleIncrement = () => {
    const maxDuration = calculateAvailableDuration(selectedTime!);
    if (duration + 1 <= maxDuration) {
      setDuration(d => d + 1);
      setWarning('');
    } else {
      setWarning('Selected duration exceeds available slots');
    }
  };

  // Handle decrement
  const handleDecrement = () => {
    setDuration(d => Math.max(1, d - 1));
    setWarning('');
  };

  // Check if increment is allowed
  const canIncrement = () => {
    console.log(1)
    if (!selectedTime) return false;
    console.log(2)
    const maxDuration = calculateAvailableDuration(selectedTime);
    console.log(maxDuration)
    return duration < maxDuration;
  };

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <>
            <Form.Item
              label="Name"
              validateStatus={errors.name ? 'error' : ''}
              help={errors.name}
            >
              <Input
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </Form.Item>

            <Form.Item
              label="Email"
              validateStatus={errors.email ? 'error' : ''}
              help={errors.email}
            >
              <Input
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </Form.Item>

            <Form.Item
              label="Phone Number"
              validateStatus={errors.phone ? 'error' : ''}
              help={errors.phone}
            >
              <Input
                name="phone"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </Form.Item>
          </>
        );
      case 1:
        return (
          <>
            <Form.Item
              label="Select Turf"
              validateStatus={errors.turf ? 'error' : ''}
              help={errors.turf}
            >
              <Select
                placeholder="Choose your preferred turf"
                value={formData.turf}
                onChange={(value) => handleSelectChange('turf', value)}
              >
                {siteConfig.gallery.map((turf, index) => (
                  <Option key={index} value={turf.title}>
                    {turf.title}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Date"
              validateStatus={errors.date ? 'error' : ''}
              help={errors.date}
            >
              <DatePicker
                className="w-full"
                value={formData.date}
                onChange={handleDateChange}
              />
            </Form.Item>

            <Form.Item
              label="Time Slot"
              required
              help={warning}
              validateStatus={warning ? 'error' : ''}
            >
              <div className="flex items-center gap-4">
                <Button
                  onClick={() => setSelectedTime(null)}
                  disabled={!selectedTime}
                >
                  {dayjs((moment.tz(selectedTime, "Asia/Kolkata")).toDate()).format("hh:mm A") || 'Select Start Time'}
                </Button>

                <div className="flex items-center gap-2">
                  <Button
                    icon={<MinusOutlined />}
                    onClick={handleDecrement}
                    disabled={duration <= 1}
                  />
                  <span>{duration} hour(s)</span>
                  <Button
                    icon={<PlusOutlined />}
                    onClick={handleIncrement}
                    disabled={!canIncrement()}
                  />
                </div>
              </div>
            </Form.Item>

            <div className="grid grid-cols-4 gap-2 mb-4">
              {availableSlots.map((time) => (
                <Button
                  key={time}
                  type={selectedTime === time ? 'primary' : 'default'}
                  onClick={() => {
                    setSelectedTime(time);
                    setDuration(1);
                    setWarning('');
                  }}
                >
                  {dayjs((moment.tz(time, "Asia/Kolkata")).toDate()).format("hh:mm A")}

                  {/* {formatTimeDisplay(time)} */}
                </Button>
              ))}
            </div>
          </>
        );
      case 2:
        return (
          <>
            <Form.Item
              label="Payment Method"
              validateStatus={errors.paymentMethod ? 'error' : ''}
              help={errors.paymentMethod}
            >
              <Select
                placeholder="Select payment method"
                value={formData.paymentMethod}
                onChange={(value) => handleSelectChange('paymentMethod', value)}
              >
                <Option value="creditCard">Credit Card</Option>
                <Option value="paypal">PayPal</Option>
                <Option value="bankTransfer">Bank Transfer</Option>
              </Select>
            </Form.Item>

            <Form.Item>
              <div className="text-lg font-semibold">Estimated Payment: ₹{totalPayment}</div>
            </Form.Item>
          </>
        );
      default:
        return null;
    }
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

          <SliderSectionForTurfCard />

          <div className="max-w-2xl mx-auto">
            <Card className="shadow-lg">
              <Steps current={currentStep} className="mb-6">
                <Step title="User Details" />
                <Step title="Slots & Turf" />
                <Step title="Payment" />
              </Steps>

              <Form layout="vertical" className="space-y-6">
                {renderStepContent()}

                <div className="flex justify-between">
                  <Button
                    disabled={currentStep === 0}
                    onClick={() => setCurrentStep(currentStep - 1)}
                  >
                    Previous
                  </Button>
                  <Button
                    type="primary"
                    onClick={() => {
                      if (validateStep()) {
                        onFinish();
                      }
                    }}
                  >
                    {currentStep === 2 ? 'Submit' : 'Next'}
                  </Button>
                </div>
              </Form>
            </Card>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}