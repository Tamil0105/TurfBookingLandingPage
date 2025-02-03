import { Booking, M } from '../lib/entities';
import { Manage } from '../lib/entities/Manage';
import { User } from '../lib/entities/User';
import { DataSource } from 'typeorm';


export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'aws-0-ap-south-1.pooler.supabase.com',
  port: 5432,
  username: 'postgres.xtkffjzsuuqnvdrmpdfw',
  password: 'hd3dkDgeQKqYxRQQ',
  database: 'postgres',
  synchronize: true,
  logging: true,
  ssl: {
    rejectUnauthorized: false, // Use true for stricter validation
  },
  migrations: ['src/migrations/**/*.ts'], // Path to migrations
  entities: [Booking, Manage,M,User], // Ensure these are valid entities
});

export async function initializeDatabase() {
  try {
    await AppDataSource.initialize();
    console.log('Database connection established');
  } catch (error) {
    console.error('Error during database initialization:', error);
    process.exit(1); // Exit process on failure
  }
}

// 
// # Connect to Supabase via connection pooling with Supavisor.
// DATABASE_URL="postgresql://postgres.xtkffjzsuuqnvdrmpdfw:[YOUR-PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
// 
// # Direct connection to the database. Used for migrations.
// DIRECT_URL="postgresql://postgres.xtkffjzsuuqnvdrmpdfw:hd3dkDgeQKqYxRQQ@aws-0-ap-south-1.pooler.supabase.com:5432/postgres"
// 
// 