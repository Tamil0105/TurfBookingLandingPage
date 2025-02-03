import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken'; // Import jwt
import { AppDataSource, initializeDatabase } from '@/lib/data-source';
import { Manage } from '@/lib/entities/Manage';

const JWT_SECRET = 'your_jwt_secret_key'; // Replace with a secure key

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: 'Email and password are required' },
      { status: 400 }
    );
  }

  // Initialize database before using it
  if (!AppDataSource.isInitialized) {
    await initializeDatabase();
  }

  try {
    const userRepository = AppDataSource.getRepository(Manage);

    const user = await userRepository.findOneBy({ email });

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Validate password
    const isValidPassword = password === user.password; // Replace with bcrypt comparison if hashed
    // const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email }, // Payload
      JWT_SECRET, // Secret key
      { expiresIn: '1h' } // Token expiration
    );

    // Successful login
    return NextResponse.json({
      message: 'Login successful',
      token, // Return token
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error('Error querying database:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
