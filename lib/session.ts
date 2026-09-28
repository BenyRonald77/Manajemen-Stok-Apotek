// Sesi login admin sederhana: cookie berisi payload yang ditandatangani (HMAC-SHA256)
// menggunakan Web Crypto API agar bisa diverifikasi di middleware (edge runtime)
// maupun di server component/API route (node runtime), tanpa dependensi tambahan.

export const SESSION_COOKIE_NAME = "apotek_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8; // 8 jam

export type SessionPayload = {
  sub: string; // id admin
  username: string;
  exp: number; // unix timestamp (detik)
};

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error(
      "SESSION_SECRET belum diatur. Salin .env.example menjadi .env dan isi nilainya."
    );
  }
  return secret;
}

function base64UrlEncode(bytes: Uint8Array): string {
  let str = "";
  for (const b of bytes) str += String.fromCharCode(b);
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(input: string): Uint8Array {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/");
  const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
  const str = atob(padded + pad);
  const bytes = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i++) bytes[i] = str.charCodeAt(i);
  return bytes;
}

async function getKey(secret: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export async function createSessionToken(data: {
  sub: string;
  username: string;
}): Promise<string> {
  const secret = getSecret();
  const payload: SessionPayload = {
    ...data,
    exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS,
  };
  const payloadStr = base64UrlEncode(new TextEncoder().encode(JSON.stringify(payload)));
  const key = await getKey(secret);
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payloadStr));
  const sigStr = base64UrlEncode(new Uint8Array(sig));
  return `${payloadStr}.${sigStr}`;
}

export async function verifySessionToken(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null;
  const [payloadStr, sigStr] = token.split(".");
  if (!payloadStr || !sigStr) return null;

  try {
    const secret = getSecret();
    const key = await getKey(secret);
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      base64UrlDecode(sigStr) as BufferSource,
      new TextEncoder().encode(payloadStr)
    );
    if (!valid) return null;

    const payload = JSON.parse(
      new TextDecoder().decode(base64UrlDecode(payloadStr))
    ) as SessionPayload;

    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

export const SESSION_MAX_AGE = SESSION_MAX_AGE_SECONDS;
