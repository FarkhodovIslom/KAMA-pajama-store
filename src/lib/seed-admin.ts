#!/usr/bin/env tsx
/**
 * Admin user seed script.
 * Usage: npx tsx src/lib/seed-admin.ts
 */

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import * as readline from "readline";

const prisma = new PrismaClient();

function prompt(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function main() {
  console.log("[ADMIN] KAMA Admin Seed Script\n");

  const existing = await prisma.admin.count();
  if (existing > 0) {
    console.log(`ℹ️  ${existing} admin(s) already exist in the database.`);
    const overwrite = await prompt("Create another admin? (y/N): ");
    if (overwrite.toLowerCase() !== "y") {
      console.log("Aborted.");
      return;
    }
  }

  const username = await prompt("Username: ");
  if (!username) {
    console.error("[ERROR] Username cannot be empty.");
    process.exit(1);
  }

  const password = await prompt("Password: ");
  if (!password || password.length < 6) {
    console.error("[ERROR] Password must be at least 6 characters.");
    process.exit(1);
  }

  const existing_user = await prisma.admin.findUnique({ where: { username } });
  if (existing_user) {
    console.error(`[ERROR] Admin with username "${username}" already exists.`);
    process.exit(1);
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const admin = await prisma.admin.create({
    data: { username, password: hashedPassword },
  });

  console.log(`\n[SUCCESS] Admin created successfully!`);
  console.log(`   ID:       ${admin.id}`);
  console.log(`   Username: ${admin.username}`);
  console.log(`\nYou can now login at /admin/login`);
}

main()
  .catch((e) => {
    console.error("[ERROR] Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
