import { drizzle } from 'drizzle-orm/mysql2';
import { migrate } from 'drizzle-orm/mysql2/migrator';
import { setupCreation, endConnection } from '@/utils/db';

async function main() {
  console.log('Running your migrations...');

  const connection = await setupCreation();

  const db = drizzle(connection);

  await migrate(db, { migrationsFolder: 'drizzle' });
  console.log('Woohoo! Migrations completed!');
  return;
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    process.exit();
    await endConnection();
  });
