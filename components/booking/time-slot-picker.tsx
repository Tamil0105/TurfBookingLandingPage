"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Clock, Plus, Minus } from "lucide-react";
import moment from "moment-timezone";
import dayjs from "dayjs";
import { cashfree } from "@/utils/cashFree";

interface TimeSlotPickerProps {
  startTime: string;
  onTimeSelect: (start: string, end: string) => void;
  availableSlots: string[];
}

export function TimeSlotPicker({
  startTime,
  onTimeSelect,
  availableSlots
}: TimeSlotPickerProps) {
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [warning, setWarning] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);
  const [duration, setDuration] = useState<number>(1);
  const [showUserForm, setShowUserForm] = useState(false);
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  
  const maxDuration = 3;
  const minDuration = 1;

  const calculateEndTime = (start: string, durationHours: number) => {
    const [time, period] = start.split(" ");
    const [hours, minutes] = time.split(":").map(Number);
    const totalMinutes = hours * 60 + minutes + durationHours * 60;
    let endHours = Math.floor(totalMinutes / 60);
    const endMinutes = totalMinutes % 60;
    let endPeriod = period;

    if (endHours >= 12) {
      if (endHours > 12) endHours -= 12;
      endPeriod = "PM";
    }
    if (endHours === 0) endHours = 12;

    return `${String(endHours).padStart(2, "0")}:${String(endMinutes).padStart(2, "0")} ${endPeriod}`;
  };

  const handleDurationChange = (change: number) => {
    const newDuration = Math.min(Math.max(duration + change, minDuration), maxDuration);
    setDuration(newDuration);
  };

  const handleConfirm = () => {
    const endTime = calculateEndTime(startTime, duration);
    onTimeSelect(startTime, endTime);
    setShowUserForm(true);
  };

  const calculatePrice = (hours: number) => {
    return Math.round(hours * 500);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserDetails(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!userDetails.name) errors.name = "Name is required";
    if (!userDetails.email) errors.email = "Email is required";
    if (!userDetails.phone) errors.phone = "Phone number is required";
    return errors;
  };

  
  const initiatePayment = async () => {
    setLoading(true);
    try {
      const orderAmount = calculatePrice(duration);
      const response = await fetch("/api/payment/initiate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: "order_" + new Date().getTime(),
          orderAmount: orderAmount,
          customerDetails: {
            customer_id: `customer_${Math.random().toString(36).substr(2, 9)}`,
            customer_name: userDetails.name,
            customer_email: userDetails.email,
            customer_phone: userDetails.phone,
          },
        }),
      });

      const data = await response.json();
      const sessionId = data.data.payment_session_id;

      cashfree
        .checkout({
          paymentSessionId: sessionId,
          returnUrl: `https://slot-book-ashen.vercel.app/confirm?email=${userDetails.email}&orderId={order_id}&status={order_status}&start=${startTime}&end=${calculateEndTime(startTime, duration)}&phoneNumber=${userDetails.phone}&name=${userDetails.name}&amount=${orderAmount}`,
        })
        .then(function (result: { error: { message: unknown }; redirect: unknown }) {
          if (result.error) {
            alert(result.error.message);
          }
          if (result.redirect) {
            console.log(result);
            console.log("Redirection");
          }
        });
    } catch (error) {
      console.error("Error initiating payment:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  const handlePayment = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await initiatePayment();
    } catch (error) {
      console.error("Payment failed:", error);
      alert("Payment failed. Please try again.");
    }
  };

 

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setIsOpen(true)}
        className={cn(
          "w-full p-3 text-sm text-center rounded-lg",
          "hover:bg-primary hover:text-primary-foreground transition-colors"
        )}
      >
        {dayjs(moment.tz(startTime, "Asia/Kolkata").toDate()).format("hh:mm A") || 'Select Start Time'}
      </Button>

      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerContent>
          {!showUserForm ? (
            <>
              <DrawerHeader>
                <DrawerTitle>Select Duration</DrawerTitle>
                <DrawerDescription>
                  Starting from {dayjs(moment.tz(startTime, "Asia/Kolkata").toDate()).format("hh:mm A")}
                </DrawerDescription>
              </DrawerHeader>
              <div className="p-4 space-y-6">
                <div className="flex items-center justify-center space-x-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDurationChange(-1)}
                    disabled={duration <= minDuration}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{duration} hr</div>
                    <div className="text-sm text-muted-foreground">
                      {dayjs(moment.tz(startTime, "Asia/Kolkata").toDate()).format("hh:mm A")} - {calculateEndTime(dayjs(moment.tz(startTime, "Asia/Kolkata").toDate()).format("hh:mm A"), duration)}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDurationChange(1)}
                    disabled={duration >= maxDuration}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="text-center">
                  <div className="text-sm text-muted-foreground">Total Amount</div>
                  <div className="text-2xl font-bold">₹{calculatePrice(duration)}</div>
                </div>

                <Button className="w-full" onClick={handleConfirm}>
                  Confirm Booking
                </Button>
              </div>
            </>
          ) : (
            <div className="p-4 space-y-6">
              <DrawerHeader>
                <DrawerTitle>User Information</DrawerTitle>
              </DrawerHeader>
              <Input
                name="name"
                value={userDetails.name}
                onChange={handleInputChange}
                placeholder="Enter your name"
              />
              {errors.name && <div className="text-red-500 text-sm">{errors.name}</div>}
              <Input
                name="email"
                value={userDetails.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
              />
              {errors.email && <div className="text-red-500 text-sm">{errors.email}</div>}
              <Input
                name="phone"
                value={userDetails.phone}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
              />
              {errors.phone && <div className="text-red-500 text-sm">{errors.phone}</div>}
              <Button className="w-full" onClick={handlePayment} disabled={loading}>
                {loading ? "Processing..." : `Pay Now ₹${calculatePrice(duration)}` }
              </Button>
            </div>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}