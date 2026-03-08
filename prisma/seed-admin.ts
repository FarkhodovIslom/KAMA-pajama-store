import { prisma } from "../src/lib/db";
import bcrypt from "bcryptjs";

async function main() {
  const adminPassword = await bcrypt.hash("admin", 10);
  
  const admin = await prisma.admin.upsert({
    where: { username: "admin" },
    update: { password: adminPassword },
    create: {
      username: "admin",
      password: adminPassword,
    },
  });

  console.log("Admin user created/updated!");
  console.log(`Username: ${admin.username}`);
  console.log("Password: admin");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
