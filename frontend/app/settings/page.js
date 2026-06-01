"use client";
import Link from "next/link";
import { Database, FileText, Globe2, Palette, Route, Shield, Users, HardDrive, Printer, Activity } from "lucide-react";
import AppShell from "../../components/layout/AppShell";
import PageHeader from "../../components/ui/PageHeader";

const sections = [
  { href: "/settings/general", icon: Database, title: "Genel Sistem", desc: "Firma adı, stok varsayılanları, SKU ve operasyon tercihleri." },
  { href: "/settings/routes", icon: Route, title: "Yol Seçme", desc: "Kullanıcı login olduğunda açılacak varsayılan sayfayı belirleyin." },
  { href: "/users", icon: Users, title: "Kullanıcılar", desc: "Kullanıcı, rol, durum ve erişim düzenlemeleri." },
  { href: "/settings/security", icon: Shield, title: "Güvenlik", desc: "Oturum süresi, rate limit, parola ve yetki politikaları." },
  { href: "/settings/localization", icon: Globe2, title: "Dil & Veri", desc: "Türkçe / English veri yönetimi ve otomatik çeviri davranışları." },
  { href: "/settings/datasheets", icon: FileText, title: "Datasheet API", desc: "Nexar, DigiKey, Mouser anahtarları ve provider öncelik sırası." },
  { href: "/settings/printers", icon: Printer, title: "Yazıcı & Etiket", desc: "USB / Serial yazıcı seçimi, etiket profili ve ZPL tercihleri." },
  { href: "/settings/appearance", icon: Palette, title: "Tasarım", desc: "Tema, renk, font boyutu, kart radius ve yoğunluk ayarları." },
  { href: "/settings/backup", icon: HardDrive, title: "Yedekleme", desc: "Database dışa aktarma, FTP/SFTP hedefleri ve yedek planı." },
  { href: "/activity", icon: Activity, title: "Detaylı Loglar", desc: "Tüm istekler, kullanıcı işlemleri ve kritik değişiklik kayıtları." }
];

export default function SettingsPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="ReelManager - Yönetim Merkezi"
        title="Sistem Ayarları"
        description="ReelManager kurulumunuzun güvenlik, datasheet, yedekleme, etiket yazıcı, kullanıcı ve arayüz davranışlarını tek merkezden yönetin."
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Link key={section.href} href={section.href} className="page-card group p-5 transition hover:-translate-y-0.5 hover:shadow-lg">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-600 ring-1 ring-brand-500/10 dark:text-brand-300">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-semibold tracking-[-0.02em] text-slate-950 dark:text-white">{section.title}</h2>
              <p className="mt-2 text-[15px] leading-7 text-slate-600 dark:text-slate-300">{section.desc}</p>
              <div className="mt-4 text-sm font-semibold text-brand-600 opacity-0 transition group-hover:opacity-100 dark:text-brand-300">Ayarları aç →</div>
            </Link>
          );
        })}
      </div>
    </AppShell>
  );
}
