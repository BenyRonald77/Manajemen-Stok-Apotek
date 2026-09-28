"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSessionToken, SESSION_COOKIE_NAME, SESSION_MAX_AGE } from "@/lib/session";

export type LoginState = {
  error?: string;
};

export async function loginAction(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const redirectTo = String(formData.get("redirectTo") ?? "/");

  if (!username || !password) {
    return { error: "Username dan kata sandi wajib diisi." };
  }

  const admin = await prisma.admin.findUnique({ where: { username } });

  // Pesan error sengaja dibuat sama untuk username tidak ditemukan maupun
  // password salah, agar tidak membocorkan username mana yang valid.
  const genericError = "Username atau kata sandi salah.";

  if (!admin) {
    return { error: genericError };
  }

  const valid = await bcrypt.compare(password, admin.passwordHash);
  if (!valid) {
    return { error: genericError };
  }

  const token = await createSessionToken({ sub: admin.id, username: admin.username });
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });

  redirect(redirectTo && redirectTo.startsWith("/") ? redirectTo : "/");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  redirect("/login");
}
