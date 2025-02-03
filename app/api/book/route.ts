import { B } from '@/lib/entities/Booking';
import { AppDataSource } from '@/lib/data-source';
import { NextResponse } from 'next/server';

// Ensure the data source is initialized
const initialize = async () => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
};

export async function POST(req: Request) {
  await initialize();

  const body = await req.json(); // Parse the JSON body
  const { date, startTime, endTime, amount, paymentStatus, orderId, userLocation, userName, peopleCount, phoneNumber, userEmail } = body;

  console.log(date, startTime, endTime, userLocation, userName, phoneNumber, userEmail);

  // Validate the request body
  if (!date || !startTime || !endTime || !userName || !userEmail || !phoneNumber) {
    return NextResponse.json({ error: 'Date, startTime, endTime, userName, and userEmail are required' }, { status: 400 });
  }

  try {
    // Parse the date
    const parsedDate = new Date(date);

    // Create a new booking instance
    const booking = new B();
    booking.date = parsedDate.toISOString().split('T')[0]; // Store date in YYYY-MM-DD format
    booking.startTime = startTime; // Store only the time
    booking.endTime = endTime; // Store only the time
    booking.userName = userName; // Store user name
    booking.userEmail = userEmail; // Store user email
    booking.userLocation = userLocation; // Store user location
    booking.phoneNumber = phoneNumber; // Store phone number
    booking.peopleCount = peopleCount; // Store people count
    booking.amount = amount; // Store amount
    booking.orderId = orderId; // Store order ID
    booking.paymentStatus = paymentStatus; // Store payment status

    // Save the booking
    await AppDataSource.getRepository(B).save(booking);

    return NextResponse.json({ message: 'Slot booked successfully', booking }, { status: 201 });
  } catch (error) {
    console.error('Error booking slot:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}