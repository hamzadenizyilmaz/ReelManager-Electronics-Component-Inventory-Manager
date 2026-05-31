"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CircuitBoard,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Database,
  QrCode,
  BarChart3
} from "lucide-react";
import { useAuthStore } from "../../store/auth.store";
import { useUI } from "../../components/providers/Providers";

export default function LoginPage() {
  const router = useRouter();

  const { login, loading, token, hydrate } = useAuthStore();
  const { t, toast, lang, setLang } = useUI();

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    email: "admin@example.com",
    password: "Admin123!"
  });

  const isTr = lang === "tr";

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (token) {
      router.replace("/dashboard");
    }
  }, [token, router]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    try {
      await login(form);

      toast(
        isTr ? "Giriş başarılı" : "Login successful",
        "success"
      );

      router.replace("/dashboard");
    } catch (err) {
      const message = isTr
        ? "E-posta veya şifreyi kontrol ediniz."
        : "Please check your email or password.";

      setError(message);
      toast(message, "error");
    }
  }

  return (
    <main className="min-h-screen bg-[#0B1120] text-slate-100">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative hidden overflow-hidden border-r border-slate-800/80 bg-slate-950 lg:block">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('/images/login-electronic.png')"
            }}
          />

          <div className="absolute inset-0 bg-slate-950/78" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/58" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/55" />

          <div className="relative flex min-h-screen flex-col justify-between p-12 xl:p-14">
            <div>
              <div className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/55 px-4 py-3 shadow-2xl shadow-black/30 backdrop-blur-md">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-950/30">
                  <CircuitBoard size={22} />
                </div>

                <div>
                  <p className="text-sm font-semibold tracking-wide text-white">
                    Reel Manager v2.1.0
                  </p>
                  <p className="text-xs text-slate-400">
                    {isTr
                      ? "Komponent Stok Yönetimi"
                      : "Component Inventory Management"}
                  </p>
                </div>
              </div>

              <div className="mt-16 max-w-2xl">
                <h1 className="max-w-2xl text-4xl font-semibold leading-tight tracking-[-0.035em] text-white xl:text-5xl">
                  {isTr
                    ? "Elektronik komponent stoklarınızı tek merkezden yönetin."
                    : "Centralized control for your electronic component inventory."}
                </h1>

                <p className="mt-6 max-w-xl text-base leading-7 text-slate-300">
                  {isTr
                    ? "Reel, kutu, lokasyon, BOM, datasheet ve etiket süreçlerini güvenli bir kurumsal panel üzerinden takip edin. ReelManager; üretim, prototip ve Ar-Ge stok operasyonları için hazırlanmış profesyonel bir yönetim alanıdır."
                    : "Track reels, boxes, locations, BOM records, datasheets and label operations from a secure enterprise workspace. ReelManager is built for production, prototyping and R&D inventory operations."}
                </p>

                <div className="mt-10 grid max-w-xl grid-cols-3 gap-3">
                  <InfoCard
                    icon={Database}
                    title={isTr ? "Stok" : "Stock"}
                    text={isTr ? "Canlı kayıt" : "Live records"}
                  />

                  <InfoCard
                    icon={QrCode}
                    title={isTr ? "Etiket" : "Labels"}
                    text={isTr ? "QR destekli" : "QR enabled"}
                  />

                  <InfoCard
                    icon={BarChart3}
                    title="BOM"
                    text={isTr ? "Proje bazlı" : "Project based"}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>
                © {new Date().getFullYear()} Reel Manager v2.1.0 - Hamza Deniz Yılmaz
              </span>
              <span>
                {isTr ? "Güvenli erişim noktası" : "Secure access point"}
              </span>
            </div>
          </div>
        </section>

        <section className="flex min-h-screen items-center justify-center bg-[#0B1120] px-5 py-10 sm:px-8">
          <div className="w-full max-w-[440px]">
            <div className="mb-8 flex items-center justify-between lg:hidden">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white">
                  <CircuitBoard size={22} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-white">
                    Reel Manager
                  </p>
                  <p className="text-xs text-slate-400">
                    {isTr ? "Stok Yönetimi" : "Inventory Platform"}
                  </p>
                </div>
              </div>

              <LanguageSwitch lang={lang} setLang={setLang} />
            </div>

            <div className="hidden justify-end lg:flex">
              <LanguageSwitch lang={lang} setLang={setLang} />
            </div>

            <div className="mt-8 rounded-[28px] border border-white/10 bg-white/[0.045] p-2 shadow-2xl shadow-black/30 backdrop-blur-xl">
              <div className="rounded-[22px] border border-white/8 bg-[#111827]/95 p-8">
                <div className="mb-8">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 text-blue-300">
                    <Lock size={22} />
                  </div>

                  <h2 className="text-2xl font-semibold tracking-[-0.025em] text-white">
                    {isTr ? "Hesabınıza giriş yapın" : "Sign in to your account"}
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {isTr
                      ? "Komponent stokları, projeler, datasheet kayıtları ve etiket işlemleri için güvenli oturum açın."
                      : "Sign in securely to manage component stock, projects, datasheet records and label operations."}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      {isTr ? "E-posta adresi" : "Email address"}
                    </label>

                    <div className="relative">
                      <Mail
                        size={18}
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                      />

                      <input
                        type="email"
                        value={form.email}
                        onChange={(event) =>
                          setForm((prev) => ({
                            ...prev,
                            email: event.target.value
                          }))
                        }
                        className="h-12 w-full rounded-2xl border border-white/10 bg-[#0B1120] pl-12 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-400/60 focus:ring-4 focus:ring-blue-500/10"
                        placeholder="admin@example.com"
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      {isTr ? "Şifre" : "Password"}
                    </label>

                    <div className="relative">
                      <Lock
                        size={18}
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                      />

                      <input
                        type={showPassword ? "text" : "password"}
                        value={form.password}
                        onChange={(event) =>
                          setForm((prev) => ({
                            ...prev,
                            password: event.target.value
                          }))
                        }
                        className="h-12 w-full rounded-2xl border border-white/10 bg-[#0B1120] pl-12 pr-12 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-400/60 focus:ring-4 focus:ring-blue-500/10"
                        placeholder="••••••••"
                        autoComplete="current-password"
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword((value) => !value)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-200"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {error ? (
                    <div className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                      {error}
                    </div>
                  ) : null}

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex h-12 w-full items-center justify-center rounded-2xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-lg shadow-blue-950/30 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading
                      ? isTr
                        ? "Oturum açılıyor..."
                        : "Signing in..."
                      : isTr
                        ? "Giriş yap"
                        : "Sign in"}
                  </button>
                </form>
              </div>
            </div>

            <p className="mt-6 text-center text-xs text-slate-600">
              {isTr
                ? "Bu alan yalnızca yetkili kullanıcılar içindir. Yetkisiz erişim kayıt altına alınabilir."
                : "This area is restricted to authorized users. Unauthorized access may be logged."}
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

function LanguageSwitch({ lang, setLang }) {
  return (
    <div className="inline-flex rounded-xl border border-white/10 bg-white/[0.04] p-1">
      <button
        type="button"
        onClick={() => setLang("tr")}
        className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${lang === "tr"
            ? "bg-white text-slate-950"
            : "text-slate-400 hover:text-white"
          }`}
      >
        TR
      </button>

      <button
        type="button"
        onClick={() => setLang("en")}
        className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${lang === "en"
            ? "bg-white text-slate-950"
            : "text-slate-400 hover:text-white"
          }`}
      >
        EN
      </button>
    </div>
  );
}

function InfoCard({ icon: Icon, title, text }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-4 shadow-xl shadow-black/20 backdrop-blur-md">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-blue-200 ring-1 ring-white/10">
        <Icon size={18} />
      </div>

      <p className="text-sm font-semibold text-white">{title}</p>
      <p className="mt-1 text-xs text-slate-400">{text}</p>
    </div>
  );
}