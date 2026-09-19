import React, { useState } from 'react';
import {
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  Building,
  KeyRound,
  Eye,
  EyeOff,
  Home,
  Zap,
  Check
} from 'lucide-react';

interface Props {
  onLoginSuccess: (ngoName: string, licenseNumber: string) => void;
  onNavigateToRegister: () => void;
}

export const NgoLoginView: React.FC<Props> = ({
  onLoginSuccess,
  onNavigateToRegister
}) => {
  const [identifier, setIdentifier] = useState('NGO-OD-9021');
  const [password, setPassword] = useState('Pass@123');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPass, setShowPass] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!identifier.trim() || !password.trim()) {
      setErrorMsg('Please enter both your Email / Organization Licence ID and Password.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);

      let ngoName = 'Odisha Red Cross Society — Central Blood Bank';
      const cleanId = identifier.trim().toUpperCase();

      if (cleanId.includes('4512')) {
        ngoName = 'Ama Odisha Voluntary Blood Network';
      } else if (cleanId.includes('9904')) {
        ngoName = 'Samarpan Blood Care NGO (Cuttack)';
      } else if (cleanId.startsWith('NGO-') || cleanId.includes('@')) {
        ngoName = cleanId.includes('@') ? cleanId.split('@')[0] : 'Odisha Red Cross Society — Central Blood Bank';
      }

      onLoginSuccess(ngoName, cleanId);
    }, 450);
  };

  const handleFillDemo = (id: string, pass: string, name: string) => {
    setIdentifier(id);
    setPassword(pass);
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-rose-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 text-white shadow-xl shadow-red-500/20 mb-3">
          <i className="fa-solid fa-droplet text-2xl"></i>
        </div>
        <h1 className="text-2xl font-black text-white tracking-tight">
          LifeFlow <span className="text-red-500 font-extrabold">NGO Portal</span>
        </h1>
        <p className="mt-1 text-xs text-slate-400">
          Institutional Access for Registered Blood Banks & Relief NGOs
        </p>
      </div>

      {/* Main Login Card */}
      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4 z-10">
        <div className="bg-white py-8 px-6 sm:px-8 shadow-2xl rounded-3xl border border-slate-200">
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium animate-in fade-in">
                {errorMsg}
              </div>
            )}

            {/* Identifier (Email / Organization ID) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Email / Organization Licence ID <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. NGO-OD-9021 or director@odisharedcross.org"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-red-500 focus:outline-hidden"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter authorized password"
                  className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-red-500 focus:outline-hidden"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember & Forgot Password */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded-sm text-red-600 focus:ring-red-500"
                />
                <span>Remember Licence</span>
              </label>

              <button
                type="button"
                onClick={() => alert('Password recovery instructions sent to registered administrator email.')}
                className="font-semibold text-red-600 hover:text-red-700 hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-red-200 mt-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <i className="fa-solid fa-circle-notch fa-spin"></i>
                  <span>Authenticating Institutional Access...</span>
                </>
              ) : (
                <>
                  <span>Sign In to NGO Platform</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Fast Demo Autofill Buttons (Requirement #2 & #25) */}
            <div className="pt-4 border-t border-slate-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2 text-center">
                Instant Demo Evaluation Credentials
              </span>
              <div className="space-y-1.5">
                <button
                  type="button"
                  onClick={() => handleFillDemo('NGO-OD-9021', 'Pass@123', 'Odisha Red Cross Society')}
                  className="w-full p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-[11px] font-semibold text-slate-700 flex items-center justify-between transition"
                >
                  <span>Odisha Red Cross Society (Bhubaneswar)</span>
                  <span className="font-mono text-red-600">NGO-OD-9021</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleFillDemo('NGO-OD-4512', 'Pass@123', 'Ama Odisha Voluntary Blood Network')}
                  className="w-full p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-[11px] font-semibold text-slate-700 flex items-center justify-between transition"
                >
                  <span>Ama Odisha Blood Network (Cuttack)</span>
                  <span className="font-mono text-red-600">NGO-OD-4512</span>
                </button>
              </div>
            </div>
          </form>

          {/* Bottom Switcher */}
          <div className="mt-6 pt-4 border-t border-slate-100 text-center space-y-2">
            <p className="text-xs text-slate-500">
              Not registered yet?{' '}
              <button
                onClick={onNavigateToRegister}
                className="font-bold text-red-600 hover:text-red-700 underline"
              >
                Register NGO Facility
              </button>
            </p>

            <a
              href="index.html"
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 font-medium"
            >
              <Home className="w-3.5 h-3.5" />
              <span>← Return to LifeFlow Main Gateway</span>
            </a>
          </div>

        </div>
      </div>
    </div>
  );
};
