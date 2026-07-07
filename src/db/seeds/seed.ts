import { db, closeDatabase } from "@/db";
import { users } from "@/db/schema";

const seedUsers = [
  {
    email: "admin@example.com",
    name: "Admin User",
    password: "password123",
  },
  {
    email: "user@example.com",
    name: "Regular User",
    password: "password123",
  },
];

async function seed() {
  console.log("Seeding database...");

  for (const user of seedUsers) {
    const passwordHash = await Bun.password.hash(user.password);
    await db
      .insert(users)
      .values({
        email: user.email,
        name: user.name,
        passwordHash,
      })
      .onConflictDoNothing();

    console.log(`  Created user: ${user.email}`);
  }

  console.log("Seeding complete.");
  await closeDatabase();
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
