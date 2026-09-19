import React, { useState } from 'react';
import {
  Building,
  Mail,
  Phone,
  MapPin,
  Lock,
  User,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Home
} from 'lucide-react';

interface Props {
  onRegisterSuccess: (ngoName: string, licenseNumber: string) => void;
  onNavigateToLogin: () => void;
}

export const NgoRegisterView: React.FC<Props> = ({
  onRegisterSuccess,
  onNavigateToLogin
}) => {
  const [name, setName] = useState('');
  const [regNumber, setRegNumber] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [adminName, setAdminName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    const generatedLicense = `NGO-${state.slice(0, 2).toUpperCase() || 'OD'}-${Math.floor(1000 + Math.random() * 9000)}`;
    onRegisterSuccess(name.trim() || 'New Blood Bank NGO', generatedLicense);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Brand Header */}
      <div className="max-w-2xl mx-auto text-center mb-6 z-10 relative">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 text-white shadow-xl mb-2">
          <i className="fa-solid fa-droplet text-xl"></i>
        </div>
        <h1 className="text-2xl font-black text-white tracking-tight">
          Register NGO & Blood Bank Entity
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Join the LifeFlow National Real-Time Blood Logistics Network
        </p>
      </div>

      <div className="max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-3xl shadow-2xl border border-slate-200 z-10 relative">
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* NGO Name */}
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                NGO / Blood Bank Official Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Samarpan Blood Care Mission"
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-red-500 focus:outline-hidden"
                required
              />
            </div>

            {/* Registration Number */}
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Organization Registration Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={regNumber}
                onChange={(e) => setRegNumber(e.target.value)}
                placeholder="e.g. REG-DL-2024-9102"
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-red-500 focus:outline-hidden"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Official Entity Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="director@ngo.org"
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-red-500 focus:outline-hidden"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Official Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-red-500 focus:outline-hidden"
                required
              />
            </div>

            {/* Physical Address */}
            <div className="sm:col-span-2">
              <label className="font-bold text-slate-700 block mb-1">
                Operating Facility Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street address, Medical district"
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-red-500 focus:outline-hidden"
                required
              />
            </div>

            {/* City */}
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Bhubaneswar / Cuttack"
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-red-500 focus:outline-hidden"
                required
              />
            </div>

            {/* State */}
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                State <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="Odisha"
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-red-500 focus:outline-hidden"
                required
              />
            </div>

            {/* PIN Code */}
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                PIN Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="110001"
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-red-500 focus:outline-hidden"
                required
              />
            </div>

            {/* Administrator Name */}
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Authorized Administrator Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                placeholder="Dr. S. K. Roy"
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-red-500 focus:outline-hidden"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Account Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:outline-hidden"
                required
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:outline-hidden"
                required
              />
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-600 flex items-center gap-2 mt-4">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>
              New registrations are provisioned with <strong>Verified Organization</strong> accreditation in this evaluation build.
            </span>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-red-200 mt-4"
          >
            <span>Complete Registration & Open Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="pt-3 text-center">
            <button
              type="button"
              onClick={onNavigateToLogin}
              className="text-xs font-semibold text-slate-600 hover:text-red-700 underline"
            >
              Already registered? Sign In to Portal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
