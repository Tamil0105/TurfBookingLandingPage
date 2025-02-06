"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Clock, Ticket } from "lucide-react";

interface VenueCardProps {
  name: string;
  address: string;
  openingTime: string;
  closingTime: string;
  image: string;
}

export function VenueCard({
  name,
  address,
  openingTime,
  closingTime,
  image
}: VenueCardProps) {
  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="relative h-48 mb-4 overflow-hidden rounded-lg">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>
        
        <h1 className="text-2xl font-bold mb-4">{name}</h1>
        
        <div className="flex items-start gap-2 mb-3">
          <MapPin className="w-5 h-5 text-gray-500 mt-1 flex-shrink-0" />
          <p className="text-gray-600">{address}</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-gray-500" />
          <p className="text-gray-600">{openingTime} to {closingTime}</p>
          <Ticket className="w-5 h-5 text-gray-500 ml-2" />
        </div>
      </CardContent>
    </Card>
  );
}