import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "kama-session";
export const SESSION_DURATION_DAYS = 7;

// ── Password ─────────────────────────────────────────────────────────────

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// ── Session ──────────────────────────────────────────────────────────────

export async function createSession(adminId: string): Promise<string> {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_DURATION_DAYS);

  const session = await prisma.session.create({
    data: { adminId, expiresAt },
  });

  return session.id;
}

export async function verifySession(
  request: Request
): Promise<{ id: string; username: string } | null> {
  const cookieHeader = request.headers.get("cookie") || "";
  const sessionId = parseCookie(cookieHeader, SESSION_COOKIE);

  if (!sessionId) return null;

  try {
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: { admin: true },
    });

    if (!session) return null;
    if (session.expiresAt < new Date()) {
      // Clean up expired session
      await prisma.session.delete({ where: { id: sessionId } });
      return null;
    }

    return { id: session.admin.id, username: session.admin.username };
  } catch {
    return null;
  }
}

export async function deleteSession(sessionId: string): Promise<void> {
  try {
    await prisma.session.delete({ where: { id: sessionId } });
  } catch {
    // Session may already be deleted — that's fine
  }
}

// ── Server-side session (for Server Components) ──────────────────────────

export async function getServerSession(): Promise<{
  id: string;
  username: string;
} | null> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;
  if (!sessionId) return null;

  try {
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: { admin: true },
    });

    if (!session || session.expiresAt < new Date()) return null;

    return { id: session.admin.id, username: session.admin.username };
  } catch {
    return null;
  }
}

// ── Helpers ──────────────────────────────────────────────────────────────

function parseCookie(cookieHeader: string, name: string): string | null {
  const match = cookieHeader
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split("=")[1]) : null;
}
