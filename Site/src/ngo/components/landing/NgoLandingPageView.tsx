import React from 'react';
import {
  Boxes,
  QrCode,
  Building2,
  Siren,
  Truck,
  BarChart3,
  ShieldCheck,
  ArrowRight,
  Droplet,
  Radio,
  CheckCircle,
  Activity,
  HeartHandshake
} from 'lucide-react';

interface Props {
  onNgoLogin: () => void;
  onHospitalLogin: () => void;
  onGetStarted: () => void;
}

export const NgoLandingPageView: React.FC<Props> = ({
  onNgoLogin,
  onHospitalLogin,
  onGetStarted
}) => {
  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-red-500 selection:text-white">
      {/* Top Promotional Header */}
      <header className="border-b border-slate-100 bg-white/95 backdrop-blur-xs sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <a href="/index.html" className="flex items-center hover:opacity-85 transition-opacity" title="Life Flow Blood Network">
            <img src="/lifeflow-logo.png" alt="Life Flow" className="h-12 w-auto object-contain" />
          </a>

          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="index.html"
              className="hidden sm:inline-flex px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Main Gateway
            </a>
            <button
              onClick={onHospitalLogin}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl border border-slate-200 transition"
            >
              Hospital Login
            </button>
            <button
              onClick={onNgoLogin}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition shadow-sm shadow-red-200"
            >
              NGO Portal Login
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION (Requirement #29) */}
      <section className="relative overflow-hidden pt-16 pb-20 bg-gradient-to-b from-red-50/40 via-white to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100/70 text-red-800 text-xs font-bold mb-6">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
            Real-Time State Blood Transfusion Federation
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight max-w-4xl mx-auto">
            Connecting Blood Banks, NGOs & Hospitals — <span className="text-red-600 underline decoration-red-300">In Real Time.</span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Track blood inventory, coordinate emergency requests, manage shipments and respond faster when every minute matters.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onGetStarted}
              className="px-6 py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold text-sm shadow-lg shadow-red-300 transition flex items-center gap-2"
            >
              <span>Get Started as NGO</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onNgoLogin}
              className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-sm transition"
            >
              NGO Login
            </button>

            <button
              onClick={onHospitalLogin}
              className="px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-2xl font-bold text-sm transition"
            >
              Hospital Login
            </button>
          </div>
        </div>
      </section>

      {/* CORE OPERATIONAL PILLARS GRID */}
      <section className="py-16 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-red-600 mb-1">
              Mission-Critical Capabilities
            </h2>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
              End-to-End Clinical Blood Supply Orchestration
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 1. Real-Time Inventory */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
                <Boxes className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Real-Time Inventory</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Live monitoring of all 8 blood groups (A+, A-, B+, B-, AB+, AB-, O+, O-) with automated thresholds that turn stock green, yellow, or red dynamically.
              </p>
            </div>

            {/* 2. Barcode Tracking */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <QrCode className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Barcode Scanning</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Dual camera & laser simulation with ISBT-128 barcode validation, duplicate bag detection, and instant cold chain logging.
              </p>
            </div>

            {/* 3. Hospital Network */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Building2 className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Connected Hospitals</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Seamless digital links with hospitals to intake requisitions (#REQ-10492), assess clinical urgency, and approve dispatches in seconds.
              </p>
            </div>

            {/* 4. Emergency SOS */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <Siren className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900">🚨 SOS Emergency Alerts</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                One-touch multi-hospital emergency broadcast protocol that bridges blood shortages during trauma surgeries and mass casualties.
              </p>
            </div>

            {/* 5. Shipment Tracking */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Truck className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900">5-Step Shipment Logistics</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Comprehensive 5-step custody transfer workflow from cold storage crate packing to driver assignment and GPS route tracking.
              </p>
            </div>

            {/* 6. Analytics */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Analytics & Spoilage Prevention</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Comprehensive monthly collection trends, demand forecasting, and early expiration prioritization (7, 14, 30 days) to eliminate biological waste.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 border-t border-slate-200 text-center text-xs text-slate-500">
        <p>© 2026 LifeFlow Blood Network. Built for NGOs, Blood Banks, and Emergency Hospital Coordination.</p>
      </footer>
    </div>
  );
};
