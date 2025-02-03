import { Manage } from '@/lib/entities/Manage';
import { AppDataSource } from '@/lib/data-source';
import { NextResponse } from 'next/server';
const initialize = async () => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
};
// Initialize repository
const blockedDaysRepository = AppDataSource.getRepository(Manage);

// Handle GET requests
export async function GET() {
  try {
    await initialize();
    const blockedDays = await blockedDaysRepository.find();
    return NextResponse.json(blockedDays, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error fetching blocked days.', error }, { status: 500 });
  }
}

// Handle POST requests
export async function POST(req: Request) {
  try {
    await initialize();
    const body = await req.json();
    const newBlockedDays: Manage = body;
    const savedBlockedDays = await blockedDaysRepository.save(newBlockedDays);
    return NextResponse.json(savedBlockedDays, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error saving blocked days.', error }, { status: 500 });
  }
}

// Handle PUT requests
export async function PUT(req: Request) {
  try {
    await initialize();
    const body = await req.json();
    const updatedBlockedDays: Manage = body;

    if (!updatedBlockedDays.id) {
      return NextResponse.json({ message: 'ID is required for updating blocked days.' }, { status: 400 });
    }

    const existingBlockedDays = await blockedDaysRepository.findOneBy({ id: updatedBlockedDays.id });
    if (!existingBlockedDays) {
      return NextResponse.json({ message: 'Blocked days not found.' }, { status: 404 });
    }

    await blockedDaysRepository.update(updatedBlockedDays.id, updatedBlockedDays);
    return NextResponse.json({ message: 'Blocked days updated successfully.' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error updating blocked days.', error }, { status: 500 });
  }
}

// Handle DELETE requests
export async function DELETE(req: Request) {
  try {
    await initialize();
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ message: 'ID is required for deletion.' }, { status: 400 });
    }

    const result = await blockedDaysRepository.delete(id);
    if (result.affected === 0) {
      return NextResponse.json({ message: 'Blocked days not found.' }, { status: 404 });
    }

    return NextResponse.json(null, { status: 204 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error deleting blocked days.', error }, { status: 500 });
  }
}
