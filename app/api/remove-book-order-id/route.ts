
import { B } from '@/lib/entities/Booking';
import { AppDataSource } from '@/lib/data-source';
import { NextResponse, NextRequest } from 'next/server';

// Ensure the data source is initialized
const initialize = async () => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
};

export async function DELETE(req: NextRequest) {
  await initialize();

  // Extract the orderId from the URL
  const { searchParams  } = req.nextUrl ;
  const orderId = searchParams.get('orderId') as string;

  // Validate the request query
  if (!orderId) {
    return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
  }

  try {
    const bookingRepository = AppDataSource.getRepository(B);

    // Check if the booking exists
    const booking = await bookingRepository.findOneBy({ orderId });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Delete the booking
    await bookingRepository.remove(booking);

    return NextResponse.json({ message: 'Booking deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting booking:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}