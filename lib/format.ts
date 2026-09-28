const rupiahFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

export function formatRupiah(value: number): string {
  return rupiahFormatter.format(value);
}

const tanggalFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export function formatTanggal(value: Date | string): string {
  return tanggalFormatter.format(new Date(value));
}

const tanggalWaktuFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export function formatTanggalWaktu(value: Date | string): string {
  return tanggalWaktuFormatter.format(new Date(value));
}

/** Selisih hari dari sekarang (00:00) ke tanggal target. Bisa negatif jika sudah lewat. */
export function selisihHari(target: Date | string): number {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const targetDate = new Date(target);
  const startOfTarget = new Date(
    targetDate.getFullYear(),
    targetDate.getMonth(),
    targetDate.getDate()
  );
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.round((startOfTarget.getTime() - startOfToday.getTime()) / msPerDay);
}

export type TingkatUrgensi = "kritis" | "waspada" | "perhatian";

export function tingkatUrgensi(hariTersisa: number): TingkatUrgensi {
  if (hariTersisa <= 7) return "kritis";
  if (hariTersisa <= 30) return "waspada";
  return "perhatian";
}
