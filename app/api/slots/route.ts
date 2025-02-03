// import { B } from "@/entities/Booking";
// import { Manage } from "@/entities/Manage";
// import { AppDataSource } from "@/lib/data-source";
// import moment from "moment";
// import { NextRequest, NextResponse } from "next/server";

// interface TimeRange {
//   start: string; // ISO 8601 date string
//   end: string; // ISO 8601 date string
// }

// interface DateRange {
//   start: string; // ISO 8601 date string
//   end: string; // ISO 8601 date string
// }

// interface BlockedDays {
//   id: number; // Unique identifier
//   timeRanges: TimeRange[]; // Array of time ranges
//   isWeekendDisabled: boolean; // Flag indicating if weekends are disabled
//   blockedDays: string[]; // Array of blocked days (ISO 8601 date strings)
//   dateRange: DateRange; // Object containing start and end date range
// }

// // Ensure the data source is initialized
// const initialize = async () => {
//   if (!AppDataSource.isInitialized) {
//     await AppDataSource.initialize();
//   }
// };

// export async function GET(req: NextRequest) {
//   await initialize();

//   const { searchParams } = new URL(req.url);
//   const date = searchParams.get("date");
//   const userLocation = searchParams.get("userLocation");

//   // Validate the query parameter
//   if (!date || typeof date !== "string") {
//     return NextResponse.json({ error: "Valid date is required" }, { status: 400 });
//   }

//   try {
//     // Parse the date using Moment.js
//     const parsedDate = moment(date, moment.ISO_8601, true);
//     if (!parsedDate.isValid()) {
//       return NextResponse.json({ error: "Invalid date format" }, { status: 400 });
//     }

//     // Define all slots
//     const allSlots = Array.from({ length: 11 }, (_, i) => moment(parsedDate).hour(8 + i).minute(0).second(0));

//     // Fetch bookings for the given date
//     const bookings = await AppDataSource.getRepository(B).find({
//       where: { date, userLocation: userLocation as string },
//     });

//     // Fetch manage days
//     const manage_days = (await AppDataSource.getRepository(Manage).find()) as BlockedDays[];

//     // Check if the date is blocked
//     if (!manage_days[0].blockedDays.some((d) => moment(d).isSame(parsedDate, "day"))) {
//       const availableSlots = allSlots.map((slotMoment) => {
//         const slotStart = moment(slotMoment);
//         const slotEnd = moment(slotMoment).add(1, "hour");

//         // Check if the slot is blocked by manage_days
//         const isBlockedByManageDays = manage_days.some((manageDay) => {
//           return manageDay.timeRanges.some((timeRange) => {
//             const rangeStart = moment(`${timeRange.start.slice(0, 7)}-${date.slice(8, 10)}T${timeRange.start.slice(11)}`);
//             const rangeEnd = moment(`${timeRange.end.slice(0, 7)}-${date.slice(8, 10)}T${timeRange.end.slice(11)}`);
//             // Check if the slot is within or equal to the blocked time range
//             return (
//               slotStart.isSameOrAfter(rangeStart) &&
//               slotEnd.isBefore(rangeEnd)
//             ) || (
//               slotStart.isBetween(rangeStart, rangeEnd, "minute", "[)") ||
//               slotEnd.isBetween(rangeStart, rangeEnd, "minute", "(]")
//             );
//           });
//         });

//         const isFutureSlot = slotStart.isAfter(moment());
//         return {
//           startTime: slotStart.toISOString(),
//           endTime: slotEnd.toISOString(),
//           available: !bookings.some((booking) => {
//             const bookingStartTime = new Date(booking.startTime);
//             const bookingEndTime = new Date(booking.endTime);

//             return (
//               (slotStart.toDate() >= bookingStartTime && slotStart.toDate() < bookingEndTime) ||
//               (slotEnd.toDate() > bookingStartTime && slotEnd.toDate() <= bookingEndTime) ||
//               (slotStart.toDate() <= bookingStartTime && slotEnd.toDate() >= bookingEndTime)
//             );
//           }) && !isBlockedByManageDays && isFutureSlot,
//         };
//       });

//       // Filter out unavailable slots
//       const filteredAvailableSlots = availableSlots.filter(
//         (slot) => slot.available
//       );

//       return NextResponse.json(filteredAvailableSlots, { status: 200 });
//     } else {
//       return NextResponse.json([], { status: 200 });
//     }
//   } catch (error) {
//     console.error("Error fetching available slots:", error);
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   }
// }
import { Booking } from "../../../lib/entities/Booking";
import { Manage } from "../../../lib/entities/Manage";
import { AppDataSource } from "@/lib/data-source";
import moment from "moment-timezone"; // Import moment-timezone
import { NextResponse } from "next/server";

interface TimeRange {
  start: string; // ISO 8601 date string
  end: string; // ISO 8601 date string
}

interface DateRange {
  start: string; // ISO 8601 date string
  end: string; // ISO 8601 date string
}

interface BlockedDays {
  id: number; // Unique identifier
  timeRanges: TimeRange[]; // Array of time ranges
  isWeekendDisabled: boolean; // Flag indicating if weekends are disabled
  blockedDays: string[]; // Array of blocked days (ISO 8601 date strings)
  dateRange: DateRange; // Object containing start and end date range
}

// Ensure the data source is initialized
const initialize = async () => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
};

export async function GET(req:any) {
  await initialize();

  console.log(1,req)
  // console.log(req,"ddddddddddddddd")
console.log(2)
  const { searchParams } = new URL(req.url);
  console.log(3)
  const date = searchParams.get("date");
  const userLocation = searchParams.get("userLocation");

  // Validate the query parameter
  if (!date || typeof date !== "string") {
    return NextResponse.json({ error: "Valid date is required" }, { status: 400 });
  }

  try {
    // Parse the date using Moment.js in IST
    const parsedDate = moment.tz(date, "Asia/Kolkata"); // Set timezone to IST
    if (!parsedDate.isValid()) {
      return NextResponse.json({ error: "Invalid date format" }, { status: 400 });
    }

    // Define all slots in IST
    const allSlots = Array.from({ length: 11 }, (_, i) =>
      moment.tz(parsedDate.toISOString(), 'Asia/Kolkata').hour(8 + i).minute(0).second(0)
    );

    // Fetch bookings for the given date
    const bookings = await AppDataSource.getRepository(Booking).find({
      where: { date, userLocation: userLocation as string },
    });

    // Fetch manage days
    const manage_days = (await AppDataSource.getRepository(Manage).find()) as BlockedDays[];

    // Check if the date is blocked
    const isBlocked = manage_days[0].blockedDays.some((d) =>
      moment.tz(d, "Asia/Kolkata").isSame(parsedDate, "day")
    );

    if (isBlocked) {
      return NextResponse.json([], { status: 200 });
    }

    const availableSlots = allSlots.map((slotMoment) => {
      const slotStart = moment.tz(slotMoment, "Asia/Kolkata");
      const slotEnd = moment.tz(slotMoment.toISOString()).add(1, "hour");

      // Check if the slot is blocked by manage_days
      const isBlockedByManageDays = manage_days.some((manageDay) => {
        return manageDay.timeRanges.some((timeRange) => {
          const rangeStart = moment.tz(
            `${timeRange.start.slice(0, 7)}-${date.slice(8, 10)}T${timeRange.start.slice(11)}`,
            "Asia/Kolkata"
          );
          const rangeEnd = moment.tz(
            `${timeRange.end.slice(0, 7)}-${date.slice(8, 10)}T${timeRange.end.slice(11)}`,
            "Asia/Kolkata"
          );

          return (
            (slotStart.isSameOrAfter(rangeStart) && slotEnd.isBefore(rangeEnd)) ||
            (slotStart.isBetween(rangeStart, rangeEnd, "minute", "[)") ||
              slotEnd.isBetween(rangeStart, rangeEnd, "minute", "(]")
            )
          );
        });
      });

      const isFutureSlot = slotStart.isAfter(moment.tz("Asia/Kolkata")); // Check against current time in IST

      return {
        startTime: slotStart.toISOString(),
        endTime: slotEnd.toISOString(),
        available: !bookings.some((booking) => {
          const bookingStartTime = moment.tz(booking.startTime, "Asia/Kolkata");
          const bookingEndTime = moment.tz(booking.endTime, "Asia/Kolkata");

          return (
            (slotStart.isBetween(bookingStartTime, bookingEndTime, null, "[]")) ||
            (slotEnd.isBetween(bookingStartTime, bookingEndTime, null, "[]")) ||
            (slotStart.isSameOrBefore(bookingStartTime) && slotEnd.isSameOrAfter(bookingEndTime))
          );
        }) && !isBlockedByManageDays && isFutureSlot,
      };
    });

    // Filter out unavailable slots
    const filteredAvailableSlots = availableSlots.filter((slot) => slot.available);

    return NextResponse.json(filteredAvailableSlots, { status: 200 });
  } catch (error) {
    console.error("Error fetching available slots:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
