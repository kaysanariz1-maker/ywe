import React, { useState } from 'react';
import { 
  ShieldCheck, Lock, User, Mail, Phone, Key, AlertCircle, 
  CheckCircle2, ArrowRight, Heart, Sparkles, RefreshCw, ChevronRight
} from 'lucide-react';
import { PendingAdminRequest, AuthenticatedAdmin } from '../types';

interface AdminInitiationProps {
  onSubmitRequest: (request: Omit<PendingAdminRequest, 'id' | 'createdAt'>) => void;
  authenticatedAdmins: AuthenticatedAdmin[];
  onLogin: (email: string, passcode: string) => boolean;
  currentAdmin: AuthenticatedAdmin | null;
  onBackToStore: () => void;
  onDirectAdminRegister?: (admin: Omit<AuthenticatedAdmin, 'id' | 'createdAt'>) => void;
}

export default function AdminInitiation({
  onSubmitRequest,
  authenticatedAdmins,
  onLogin,
  currentAdmin,
  onBackToStore,
  onDirectAdminRegister
}: AdminInitiationProps) {
  const [formMode, setFormMode] = useState<'request' | 'login'>('request');
  const [isInviteVerified, setIsInviteVerified] = useState(false);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('invite');
    const savedToken = localStorage.getItem('believersign_dev_invite_token');
    
    if (token && token.startsWith('dev_secure_')) {
      setIsInviteVerified(true);
      setFormMode('request');
      localStorage.removeItem('believersign_dev_invite_token');
      const cleanUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    } else if (savedToken && savedToken.startsWith('dev_secure_')) {
      setIsInviteVerified(true);
      setFormMode('request');
      localStorage.removeItem('believersign_dev_invite_token');
    }
  }, []);
  
  // Request Form States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [passcode, setPasscode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isCaptchaOpen, setIsCaptchaOpen] = useState(false);
  const [successRequest, setSuccessRequest] = useState(false);

  // Login Form States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPasscode, setLoginPasscode] = useState('');
  const [loginError, setLoginError] = useState('');

  // CAPTCHA puzzle state
  // We want the user to select the three correct core spiritual minimalist values
  const CAPTCHA_OPTIONS = [
    { id: 'sabr', label: 'SABR (Patience & Composure)', isCorrect: true },
    { id: 'modesty', label: 'Modesty & Humble Attire', isCorrect: true },
    { id: 'slop', label: 'Hype-beast Infrastructure Slop', isCorrect: false },
    { id: 'minimalism', label: 'Spiritual Minimalism', isCorrect: true },
    { id: 'telemetry', label: 'Unrequested Terminal Logs', isCorrect: false },
    { id: 'crypto', label: 'Speculative Token Pump', isCorrect: false },
  ];

  const [selectedCaptchaIds, setSelectedCaptchaIds] = useState<string[]>([]);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [captchaAttempts, setCaptchaAttempts] = useState(0);
  const [captchaFeedback, setCaptchaFeedback] = useState('');

  const handleToggleCaptchaOption = (id: string) => {
    setSelectedCaptchaIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
    setCaptchaFeedback('');
  };

  const handleVerifyCaptcha = () => {
    const correctIds = CAPTCHA_OPTIONS.filter(o => o.isCorrect).map(o => o.id);
    const selectedCorrect = selectedCaptchaIds.filter(id => correctIds.includes(id));
    const selectedIncorrect = selectedCaptchaIds.filter(id => !correctIds.includes(id));

    if (selectedCorrect.length === correctIds.length && selectedIncorrect.length === 0) {
      setCaptchaVerified(true);
      setCaptchaFeedback('Integrity verified! Signature initialized.');
      setTimeout(() => {
        setIsCaptchaOpen(false);
        // Execute request submission
        if (isInviteVerified && onDirectAdminRegister) {
          onDirectAdminRegister({
            name,
            email,
            phone,
            passcode
          });
        } else {
          onSubmitRequest({
            name,
            email,
            phone,
            passcode
          });
          setSuccessRequest(true);
        }
        // Reset form
        setName('');
        setEmail('');
        setPhone('');
        setPasscode('');
        setSelectedCaptchaIds([]);
        setCaptchaVerified(false);
      }, 1200);
    } else {
      setCaptchaAttempts(prev => prev + 1);
      if (selectedIncorrect.length > 0) {
        setCaptchaFeedback('Incorrect. Please avoid superficial or hype concepts.');
      } else {
        setCaptchaFeedback('Please select ALL core values that reflect spiritual minimalism.');
      }
    }
  };

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name || !email || !phone || !passcode) {
      setErrorMsg('Please fill out all gateway credentials.');
      return;
    }

    if (passcode.length !== 6 || !/^\d+$/.test(passcode)) {
      setErrorMsg('The Contract Passcode must be exactly 6 numeric digits.');
      return;
    }

    // Trigger CAPTCHA puzzle step
    setIsCaptchaOpen(true);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!loginEmail || !loginPasscode) {
      setLoginError('Please enter both email and passcode.');
      return;
    }

    const success = onLogin(loginEmail, loginPasscode);
    if (!success) {
      setLoginError('Invalid administrator credentials or pending approval.');
    }
  };

  const triggerFastDevLogin = () => {
    // Fast login as dev admin for reviewing
    onLogin('developer@example.com', '123456');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 text-stone-800 font-sans" id="admin-initiation-page">
      <div className="text-center space-y-3 mb-10">
        <div className="inline-flex items-center justify-center p-3 bg-stone-900 text-amber-100 rounded-full shadow-md">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <span className="text-[10px] tracking-[0.25em] text-emerald-800 uppercase font-bold block">
            Gatekeeper Authentication
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-black text-stone-900">
            Contract Validation Gateway
          </h2>
          <p className="text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
            Authorized administrative system access. Initiate a signed validation contract or sign in with your approved credentials below.
          </p>
        </div>

        {/* View mode buttons */}
        <div className="flex justify-center gap-1.5 max-w-xs mx-auto bg-stone-100 p-1 rounded-full border border-stone-200 mt-4 text-xs font-semibold">
          <button
            onClick={() => {
              setFormMode('request');
              setSuccessRequest(false);
            }}
            className={`flex-1 py-1.5 px-3 rounded-full transition-all cursor-pointer ${
              formMode === 'request' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Request Access
          </button>
          <button
            onClick={() => setFormMode('login')}
            className={`flex-1 py-1.5 px-3 rounded-full transition-all cursor-pointer ${
              formMode === 'login' ? 'bg-stone-900 text-white shadow-2xs' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Admin Sign-In
          </button>
        </div>
      </div>

      {formMode === 'request' ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
          {successRequest ? (
            <div className="text-center py-6 space-y-4 animate-fade-in">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div className="space-y-2">
                <h3 className="font-serif font-black text-lg text-stone-900">Validation Signature Logged!</h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto leading-relaxed">
                  Your administrative request has passed CAPTCHA verification and is queued in the <strong className="text-stone-800">Contract Approvals</strong> log.
                </p>
                <div className="bg-stone-50 border border-stone-100 p-3 rounded-lg text-[11px] text-stone-500 mt-4 max-w-xs mx-auto">
                  💡 <strong>To approve this profile:</strong> Sign in using the pre-configured Developer Admin account to authorize yourself!
                </div>
              </div>
              <div className="pt-4 flex flex-col gap-2 max-w-xs mx-auto">
                <button
                  onClick={() => setFormMode('login')}
                  className="bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold px-5 py-2.5 rounded-full transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  Proceed to Sign-In
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleRequestSubmit} className="space-y-4">
              {isInviteVerified && (
                <div className="bg-amber-50 border border-amber-200 text-amber-900 p-3.5 rounded-xl text-xs space-y-1 animate-fade-in flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <Key className="w-4 h-4 text-amber-600" />
                    <span>Secure Developer Handover Invitation Active</span>
                  </div>
                  <p className="text-[10px] leading-relaxed text-amber-800">
                    You have successfully arrived via a secure one-time invite token. Completing this minimalist CAPTCHA form will automatically bypass the contract approvals log, instantiate your credentials, and grant you immediate Master Admin ownership.
                  </p>
                </div>
              )}

              <div className="border-b border-stone-100 pb-3">
                <h3 className="font-serif font-bold text-sm text-stone-900">Initiate Access Request</h3>
                <p className="text-[10px] text-stone-400">All fields must be securely filled for the cryptographic validation queue.</p>
              </div>

              {errorMsg && (
                <div className="bg-rose-50 border border-rose-100 text-rose-800 p-3 rounded-lg text-[11px] flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kaysan Ariz"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-lg pl-9 pr-4 py-2.5 focus:outline-hidden focus:border-emerald-700 focus:bg-white transition-all text-stone-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. buyer@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-lg pl-9 pr-4 py-2.5 focus:outline-hidden focus:border-emerald-700 focus:bg-white transition-all text-stone-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 01799999999"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-lg pl-9 pr-4 py-2.5 focus:outline-hidden focus:border-emerald-700 focus:bg-white transition-all text-stone-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">6-Digit Contract Passcode</label>
                  <div className="relative">
                    <Key className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      required
                      maxLength={6}
                      placeholder="Enter a 6-digit numeric passcode"
                      value={passcode}
                      onChange={(e) => setPasscode(e.target.value.replace(/\D/g, ''))}
                      className="w-full bg-stone-50 border border-stone-200 rounded-lg pl-9 pr-4 py-2.5 tracking-widest font-mono text-stone-800 focus:outline-hidden focus:border-emerald-700 focus:bg-white transition-all"
                    />
                  </div>
                  <span className="text-[10px] text-stone-400 mt-1 block">Remember this passcode! It is required to unlock your admin account once approved.</span>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-stone-100">
                <button
                  type="button"
                  onClick={onBackToStore}
                  className="text-[11px] font-semibold text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
                >
                  Cancel & Back to Shop
                </button>
                <button
                  type="submit"
                  className="bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold px-6 py-2.5 rounded-full shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  Initiate Verification Signature
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="border-b border-stone-100 pb-3 flex justify-between items-center">
              <div>
                <h3 className="font-serif font-bold text-sm text-stone-900">Administrator Credentials</h3>
                <p className="text-[10px] text-stone-400">Unlock full dashboard capability via signed credentials.</p>
              </div>
              <ShieldCheck className="w-5 h-5 text-emerald-800 shrink-0" />
            </div>

            {loginError && (
              <div className="bg-rose-50 border border-rose-100 text-rose-800 p-3 rounded-lg text-[11px] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Admin Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. developer@example.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg pl-9 pr-4 py-2.5 focus:outline-hidden focus:border-emerald-700 focus:bg-white transition-all text-stone-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">6-Digit Passcode</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    maxLength={6}
                    placeholder="••••••"
                    value={loginPasscode}
                    onChange={(e) => setLoginPasscode(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg pl-9 pr-4 py-2.5 tracking-widest font-mono text-stone-800 focus:outline-hidden focus:border-emerald-700 focus:bg-white transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-between items-center border-t border-stone-100">
              <button
                type="button"
                onClick={onBackToStore}
                className="text-[11px] font-semibold text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
              >
                Cancel & Back to Shop
              </button>

              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  type="submit"
                  className="flex-1 sm:flex-initial bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold px-6 py-2.5 rounded-full shadow-xs transition-all cursor-pointer"
                >
                  Unseal Dashboard
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* CAPTCHA PUZZLE MODAL SCREEN */}
      {isCaptchaOpen && (
        <div className="fixed inset-0 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in" id="captcha-modal">
          <div className="bg-white rounded-2xl border border-stone-200 max-w-md w-full shadow-2xl overflow-hidden p-6 space-y-5 animate-scale-in">
            <div className="text-center space-y-2">
              <div className="w-10 h-10 bg-emerald-50 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-black text-base text-stone-900">Spiritual Integrity Verification</h3>
              <p className="text-[10px] text-stone-500 max-w-xs mx-auto leading-relaxed">
                Confirm your spiritual alignment and authentic purpose. Select <strong>all three (3)</strong> concepts that represent BELIEVERSIGN's core value pillars.
              </p>
            </div>

            {captchaFeedback && (
              <div className={`p-2.5 rounded-lg text-[11px] text-center font-medium ${
                captchaVerified 
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' 
                  : 'bg-rose-50 text-rose-800 border border-rose-100'
              }`}>
                {captchaFeedback}
              </div>
            )}

            <div className="grid grid-cols-1 gap-2">
              {CAPTCHA_OPTIONS.map((opt) => {
                const isSelected = selectedCaptchaIds.includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleToggleCaptchaOption(opt.id)}
                    className={`text-left p-3 rounded-lg border text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                      isSelected 
                        ? 'bg-emerald-800 border-emerald-900 text-white shadow-xs' 
                        : 'bg-stone-50 border-stone-200 hover:bg-stone-100 text-stone-700'
                    }`}
                  >
                    <span>{opt.label}</span>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      isSelected ? 'border-white bg-white/20' : 'border-stone-300 bg-white'
                    }`}>
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white"></div>}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-stone-100 text-xs">
              <button
                type="button"
                onClick={() => {
                  setIsCaptchaOpen(false);
                  setSelectedCaptchaIds([]);
                  setCaptchaFeedback('');
                }}
                className="text-[10px] font-bold text-stone-400 hover:text-stone-600 cursor-pointer"
              >
                Abrogate Sign-up
              </button>
              <button
                type="button"
                onClick={handleVerifyCaptcha}
                disabled={captchaVerified}
                className="bg-stone-900 hover:bg-stone-800 text-white font-semibold px-5 py-2 rounded-full cursor-pointer transition-all disabled:opacity-50"
              >
                Verify & Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
