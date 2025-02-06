"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { VenueCard } from "@/components/booking/venue-card";
import { TimeSlotPicker } from "@/components/booking/time-slot-picker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { addDays } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { DatePicker } from "@/components/date-sticker";
import moment from "moment";
import dayjs from "dayjs";

// Sample data
const sampleTurfs = [
  {
    id: 1,
    name: "Pitch@37",
    address: "10/11, Amman Kulam Rd, Pudur, Coimbatore",
    openingTime: "6:00 AM",
    closingTime: "11:00 PM",
    image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=1200&auto=format&fit=crop",
    pricePerHour: 1000,
    type: "Cricket",
  },
  {
    id: 2,
    name: "Urban Kicks",
    address: "123 Sports Complex, RS Puram, Coimbatore",
    openingTime: "5:00 AM",
    closingTime: "10:00 PM",
    image: "https://images.unsplash.com/photo-1459865264687-595d652de67e?q=80&w=1200&auto=format&fit=crop",
    pricePerHour: 800,
    type: "Football",
  },
  {
    id: 3,
    name: "Elite Sports Arena",
    address: "45 Stadium Road, Peelamedu, Coimbatore",
    openingTime: "6:00 AM",
    closingTime: "11:00 PM",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1200&auto=format&fit=crop",
    pricePerHour: 1200,
    type: "Multi-sport",
  },
];

const timeSlots = [
  "6:00 AM", "6:30 AM", "7:00 AM", "7:30 AM", "8:00 AM", "8:30 AM", "9:00 AM",
  "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM",
  "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM",
  "4:30 PM", "5:00 PM", "5:30 PM", "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM"
];

const nets = [
  "Nets 1", "Nets 2", "Nets 3", "Nets 4", "Nets 5", "Nets 6", "Nets 7",
  "Bowling Machine 1"
];

const disabledDates = [
  addDays(new Date(), 2),
  addDays(new Date(), 5),
  addDays(new Date(), 7)
].map(date => date.toISOString());

export default function Home() {
  const router = useRouter();
  
  const [date, setDate] = useState<Date>(new Date());
  const [selectedCourt, setSelectedCourt] = useState<string | null>(null);
  const [selectedStartTime, setSelectedStartTime] = useState<string | null>(null);
  const [selectedEndTime, setSelectedEndTime] = useState<string | null>(null);
  const [step, setStep] = useState(1);

  const [availableSlots, setAvailableSlots] = useState<any[]>([]);

  const [selectedTurf, setSelectedTurf] = useState(sampleTurfs[0]);

  const handleTimeSelect = (start: string, end: string) => {
    console.log(end,"pp")
    setSelectedStartTime(start);
    setSelectedEndTime(end);
    setStep(3);
  };

  console.log(selectedEndTime,selectedStartTime,"==============>")
  
useEffect(() => {
    console.log("useEffect triggered");
    const fetchAvailableSlots = async () => {

  
      if (selectedTurf && date) {
        try {
          const apiUrl = `api/slots?date=${date.toISOString()}&userLocation=${encodeURIComponent(selectedTurf.name)}`;
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
  }, [selectedTurf, date]);
  const handleContinue = () => {
    if (!selectedCourt || !selectedStartTime || !selectedEndTime) {
      return;
    }

    // Calculate booking amount (example calculation)
    const amount = calculateAmount(selectedStartTime, selectedEndTime);

    // Create temporary booking
    const bookingId = Date.now().toString();
    const bookingDetails = {
      date,
      court: selectedCourt,
      startTime: selectedStartTime,
      endTime: selectedEndTime,
      amount,
    };

    // Store booking details temporarily
    localStorage.setItem(`booking_${bookingId}`, JSON.stringify(bookingDetails));

    // Navigate to booking details page
    router.push(`/booking/${bookingId}`);
  };

  const calculateAmount = (startTime: string, endTime: string) => {
    const start = new Date(`1970/01/01 ${startTime}`);
    const end = new Date(`1970/01/01 ${endTime}`);
    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    return hours * selectedTurf.pricePerHour;
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="relative h-[400px] overflow-hidden bg-black">
        <Carousel className="w-full h-full">
          <CarouselContent>
            {sampleTurfs.map((turf) => (
              <CarouselItem key={turf.id}>
                <div className="relative h-[400px] w-full">
                  <img
                    src={turf.image}
                    alt={turf.name}
                    className="w-full h-full object-cover brightness-50"
                  />
                  <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-8">
                    <h2 className="text-4xl font-bold mb-4">{turf.name}</h2>
                    <p className="text-xl mb-2">{turf.type}</p>
                    <p className="text-lg opacity-90">{turf.address}</p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => setSelectedTurf(turf)}
                    >
                      Select This Turf
                    </Button>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 -mt-20">
        <VenueCard
          name={selectedTurf.name}
          address={selectedTurf.address}
          openingTime={selectedTurf.openingTime}
          closingTime={selectedTurf.closingTime}
          image={selectedTurf.image}
        />

        <div className="grid gap-6">
          {step >= 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Select Date</CardTitle>
              </CardHeader>
              <CardContent>
                <DatePicker 
                  selected={date} 
                  onSelect={(newDate) => {
                    setDate(newDate);
                    setStep(2);
                  }}
                  disabledDates={disabledDates}
                  minDate={new Date()}
                  maxDate={addDays(new Date(), 90)}
                />
              </CardContent>
            </Card>
          )}

          {step >= 2 && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Select Net</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {nets.map((net) => (
                      <div key={net} className="flex items-center space-x-2">
                        <Checkbox 
                          id={net}
                          checked={selectedCourt === net}
                          onCheckedChange={() => setSelectedCourt(net)}
                        />
                        <label
                          htmlFor={net}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {net}
                        </label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Select Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                    {availableSlots.map((slot) => (
                      <TimeSlotPicker
                        key={slot}
                        startTime={slot}
                        onTimeSelect={handleTimeSelect}
                        availableSlots={availableSlots}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
{/* 
              {selectedStartTime && selectedEndTime && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Selected Time</span>
                        <span>{dayjs((moment.tz(selectedStartTime, "Asia/Kolkata")).toDate()).format("hh:mm A") } - {dayjs((moment.tz(selectedEndTime, "Asia/Kolkata")).toDate()).format("hh:mm A") }</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Amount</span>
                        <span>₹{calculateAmount(selectedStartTime, selectedEndTime)}</span>
                      </div>
                      <Button onClick={handleContinue} className="w-full">
                        Continue
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )} */}
            </>
          )}
        </div>
      </div>

      <div className="fixed bottom-4 right-4">
        <Button variant="outline" asChild>
          <a href="/admin">Admin Panel</a>
        </Button>
      </div>
    </main>
  );
}