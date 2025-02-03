import { B } from "@/lib/entities/Booking";
import { AppDataSource } from "@/lib/data-source";
import { NextResponse } from "next/server";

type Slot = {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
};

type GroupedBooking = {
  id: number;
  orderId: string;
  date: string;
  userName: string;
  amount: string;
  paymentStatus: string;
  peopleCount: string;
  phoneNumber: string;
  userEmail: string;
  userLocation: string;
  slots: Slot[];
};

// Ensure the data source is initialized
const initialize = async () => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
};

export async function GET(req: Request) {
  await initialize();

  try {
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";

    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);

    if (isNaN(pageNumber) || isNaN(pageSize)) {
      return NextResponse.json({ error: "Invalid page or limit value" }, { status: 400 });
    }

    const [bookings, total] = await AppDataSource.getRepository(B)
      .createQueryBuilder("booking")
      .skip((pageNumber - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount(); // Get both data and total count

    // Transform data: Group by order_id
    const groupedData = bookings.reduce<Record<string, GroupedBooking>>((acc, booking) => {
      const {
        id,
        orderId,
        date,
        startTime,
        endTime,
        userName,
        userLocation,
        amount,
        paymentStatus,
        peopleCount,
        phoneNumber,
        userEmail,
      } = booking;
      if (!acc[orderId]) {
        acc[orderId] = {
          id,
          orderId,
          date,
          userName,
          amount,
          paymentStatus,
          peopleCount,
          phoneNumber,
          userEmail,
          userLocation,
          slots: [],
        };
      }
      acc[orderId].slots.push({
        id,
        date,
        startTime,
        endTime,
      });

      return acc;
    }, {});

    // Convert grouped data object to an array
    const result = Object.values(groupedData);

    return NextResponse.json({
      bookings: result,
      total,
      page: pageNumber,
      limit: pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error("Error fetching and grouping booked slots:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}