import { getSession } from "@/lib/auth";
import { Card, PageHeader } from "@/components/ui";

export default async function DashboardPage() {
  const session = await getSession();

  return (
    <div>
      <PageHeader
        title="Selamat datang"
        description="Kerangka aplikasi berhasil disiapkan. Modul stok, batch, dan pelaporan akan tampil di sini seiring pengembangan."
      />
      <Card className="p-5 text-sm text-[var(--color-ink-muted)]">
        Masuk sebagai <span className="font-semibold text-[var(--color-ink)]">{session?.username}</span>.
      </Card>
    </div>
  );
}
