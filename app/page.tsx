import { redirect } from "next/navigation";
import Link from "next/link";
import { FileText, Zap, LayoutTemplate, Clock, Share2, Smartphone, Globe } from "lucide-react";

interface Props {
  searchParams: Promise<{ i?: string }>;
}

export default async function Home({ searchParams }: Props) {
  const params = await searchParams;
  if (params.i) redirect(`/app?i=${params.i}`);

  return (
    <div style={{ background: "#080808", minHeight: "100vh", color: "#fff", fontFamily: "var(--font-geist-sans)" }}>
      {/* Nav */}
      <nav style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "0 24px" }}>
        <div style={{ maxWidth: "1080px", margin: "0 auto", height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "linear-gradient(135deg, #10b981, #0d9488)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <FileText size={15} color="#fff" />
            </div>
            <span style={{ fontWeight: 600, fontSize: "17px", letterSpacing: "-0.02em" }}>
              Invoice<span style={{ background: "linear-gradient(90deg,#10b981,#06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Simple</span>
            </span>
          </div>
          <Link
            href="/app"
            style={{
              background: "linear-gradient(135deg, #10b981, #0d9488)",
              color: "#fff",
              padding: "8px 20px",
              borderRadius: "8px",
              fontWeight: 600,
              fontSize: "13px",
              textDecoration: "none",
              letterSpacing: "-0.01em",
            }}
          >
            Open App →
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ maxWidth: "760px", margin: "0 auto", padding: "96px 24px 80px", textAlign: "center" }}>
        <div style={{ display: "inline-block", background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.25)", borderRadius: "20px", padding: "4px 14px", fontSize: "12px", color: "#10b981", fontWeight: 600, marginBottom: "28px", letterSpacing: "0.04em" }}>
          100% FREE · NO SIGN-UP REQUIRED
        </div>
        <h1 style={{ fontSize: "clamp(40px, 7vw, 72px)", fontWeight: 900, lineHeight: 1.1, letterSpacing: "-0.04em", margin: "0 0 24px" }}>
          Professional invoices,{" "}
          <span style={{ background: "linear-gradient(135deg, #10b981, #06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            created in seconds
          </span>
        </h1>
        <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.5)", lineHeight: 1.6, maxWidth: "540px", margin: "0 auto 40px" }}>
          Design, preview, and download PDF invoices instantly. No account, no watermarks, no limits — just beautiful invoices.
        </p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            href="/app"
            style={{
              background: "linear-gradient(135deg, #10b981, #0d9488)",
              color: "#fff",
              padding: "14px 32px",
              borderRadius: "10px",
              fontWeight: 700,
              fontSize: "15px",
              textDecoration: "none",
              letterSpacing: "-0.01em",
              boxShadow: "0 0 40px rgba(16,185,129,0.3)",
            }}
          >
            Create Invoice — Free
          </Link>
          <Link
            href="/app"
            style={{
              background: "rgba(255,255,255,0.06)",
              color: "rgba(255,255,255,0.7)",
              padding: "14px 32px",
              borderRadius: "10px",
              fontWeight: 600,
              fontSize: "15px",
              textDecoration: "none",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            See Demo
          </Link>
        </div>
      </section>

      {/* Mock invoice preview */}
      <section style={{ maxWidth: "680px", margin: "0 auto 96px", padding: "0 24px" }}>
        <div style={{ background: "#fff", borderRadius: "16px", padding: "40px 44px", boxShadow: "0 40px 80px rgba(0,0,0,0.6)", color: "#111" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px" }}>
            <div>
              <div style={{ width: "48px", height: "6px", background: "#10b981", borderRadius: "3px", marginBottom: "12px" }} />
              <div style={{ fontWeight: 700, fontSize: "16px", color: "#111" }}>Your Company Name</div>
              <div style={{ fontSize: "12px", color: "#888", marginTop: "4px" }}>hello@yourcompany.com</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "22px", fontWeight: 900, letterSpacing: "0.1em", color: "#111" }}>INVOICE</div>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "#10b981", marginTop: "4px" }}>INV-001</div>
            </div>
          </div>
          <div style={{ borderTop: "2px solid #111", marginBottom: "20px" }} />
          {[
            ["Web Design", "1", "$2,400.00"],
            ["SEO Optimization", "3", "$600.00"],
            ["Hosting Setup", "1", "$150.00"],
          ].map(([desc, qty, amt]) => (
            <div key={desc} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f0f0f0", fontSize: "13px", color: "#444" }}>
              <span>{desc}</span>
              <span style={{ display: "flex", gap: "40px" }}>
                <span style={{ color: "#888" }}>{qty}</span>
                <span style={{ fontWeight: 600, color: "#111", minWidth: "80px", textAlign: "right" }}>{amt}</span>
              </span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
            <div style={{ width: "200px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#888", marginBottom: "8px" }}>
                <span>Subtotal</span><span>$3,150.00</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "15px", fontWeight: 900, color: "#111", paddingTop: "8px", borderTop: "1px solid #ddd" }}>
                <span>Total Due</span><span style={{ color: "#10b981" }}>$3,150.00</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section style={{ maxWidth: "1080px", margin: "0 auto", padding: "0 24px 96px" }}>
        <h2 style={{ textAlign: "center", fontSize: "clamp(28px,5vw,42px)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "12px" }}>
          Everything you need
        </h2>
        <p style={{ textAlign: "center", fontSize: "16px", color: "rgba(255,255,255,0.4)", marginBottom: "56px" }}>
          Professional features, zero cost.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
          {[
            { icon: <Zap size={20} />, title: "Instant PDF Export", desc: "Download pixel-perfect PDFs in one click. Print-ready, every time." },
            { icon: <LayoutTemplate size={20} />, title: "3 Beautiful Templates", desc: "Simple, Modern, and Minimal designs. Switch with a single click." },
            { icon: <Clock size={20} />, title: "Invoice History", desc: "Automatically saves up to 30 invoices locally. Duplicate, delete, reload." },
            { icon: <Share2 size={20} />, title: "Shareable Links", desc: "Share a pre-filled invoice link with clients in one click." },
            { icon: <Smartphone size={20} />, title: "Works Offline", desc: "Install as an app on your phone or desktop. No internet required." },
            { icon: <Globe size={20} />, title: "Multi-language", desc: "UI available in English, Spanish, French, German, and more." },
          ].map(({ icon, title, desc }) => (
            <div
              key={title}
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "14px",
                padding: "28px 28px 24px",
              }}
            >
              <div style={{ color: "#10b981", marginBottom: "14px" }}>{icon}</div>
              <div style={{ fontWeight: 700, fontSize: "15px", marginBottom: "8px" }}>{title}</div>
              <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ textAlign: "center", padding: "0 24px 96px" }}>
        <div style={{ maxWidth: "560px", margin: "0 auto", background: "rgba(16,185,129,0.07)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: "20px", padding: "56px 32px" }}>
          <h2 style={{ fontSize: "clamp(24px,4vw,36px)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "12px" }}>
            Ready to send your first invoice?
          </h2>
          <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.45)", marginBottom: "28px" }}>
            No account needed. Start now, download in seconds.
          </p>
          <Link
            href="/app"
            style={{
              display: "inline-block",
              background: "linear-gradient(135deg, #10b981, #0d9488)",
              color: "#fff",
              padding: "14px 36px",
              borderRadius: "10px",
              fontWeight: 700,
              fontSize: "15px",
              textDecoration: "none",
              boxShadow: "0 0 40px rgba(16,185,129,0.25)",
            }}
          >
            Create Free Invoice →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "24px", textAlign: "center", fontSize: "12px", color: "rgba(255,255,255,0.2)" }}>
        © {new Date().getFullYear()} InvoiceSimple · Free forever · No sign-up
      </footer>
    </div>
  );
}
