import React, { useState, useRef, useEffect } from 'react';

export default function LoginPage({ onLoginSuccess, setCurrentPage }) {
  const [stage, setStage] = useState('phone'); // 'phone' or 'otp'
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpInputsRef = useRef([]);

  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    if (phoneNumber.trim().length > 0) {
      setStage('otp');
    }
  };

  const handleOtpChange = (element, index) => {
    const value = element.value;
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next field
    if (value !== '' && index < 5) {
      otpInputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (otp[index] === '' && index > 0) {
        otpInputsRef.current[index - 1].focus();
      }
    }
  };

  const handleVerifyToken = () => {
    const token = otp.join('');
    if (token === '123456') {
      onLoginSuccess();
    } else {
      alert("Invalid OTP Token! Please use '123456' for immediate access.");
      setOtp(['', '', '', '', '', '']);
      otpInputsRef.current[0].focus();
    }
  };

  return (
    <div className="bg-background text-on-surface min-h-screen flex flex-col relative overflow-hidden bg-graph-motif">
      {/* Ambient Background Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-tertiary-container/10 blur-[100px] rounded-full pointer-events-none"></div>
      
      <main className="flex-grow flex items-center justify-center p-gutter relative z-10 w-full max-w-7xl mx-auto">
        {/* Login Card */}
        <div className="glass-panel w-full max-w-[420px] rounded-xl p-container-padding-mobile md:p-container-padding-desktop shadow-2xl flex flex-col gap-8">
          {/* Brand Header */}
          <div className="text-center flex flex-col gap-2 cursor-pointer" onClick={() => setCurrentPage('landing')}>
            <h1 className="font-display-lg text-headline-lg md:text-display-lg tracking-tighter text-on-surface">Corvus AI</h1>
            <p className="font-body-md text-body-md text-on-surface-variant">Strategic Credit Intelligence</p>
          </div>

          {/* Form Content */}
          {stage === 'phone' ? (
            <form className="flex flex-col gap-6" onSubmit={handlePhoneSubmit}>
              <div className="flex flex-col gap-6 transition-all duration-300">
                <div className="flex flex-col gap-2">
                  <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="phone">Authentication ID</label>
                  <div className="relative flex items-center bg-surface border border-outline-variant rounded-lg input-glow transition-all">
                    <span className="material-symbols-outlined absolute left-3 text-on-surface-variant">phone_iphone</span>
                    <input 
                      className="w-full bg-transparent border-none text-on-surface font-body-md text-body-md py-3 pl-10 pr-4 focus:ring-0 placeholder:text-outline" 
                      id="phone" 
                      placeholder="+1 (555) 000-0000" 
                      required 
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                  </div>
                </div>
                <button 
                  className="w-full bg-on-tertiary-container hover:bg-tertiary-container text-white font-label-md text-label-md py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2" 
                  type="submit"
                >
                  Request Access
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="flex flex-col gap-6 transition-all duration-300">
              <div className="flex flex-col gap-2">
                <label className="font-label-md text-label-md text-on-surface-variant text-center">Enter Security Token</label>
                <p className="font-label-sm text-label-sm text-outline text-center mb-2">Sent to ID ending in {phoneNumber.slice(-4) || '-0000'}</p>
                <div className="flex justify-between gap-2">
                  {otp.map((data, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength="1"
                      className="w-12 h-14 bg-surface border border-outline-variant rounded-lg text-center font-headline-md text-headline-md text-on-surface focus:border-on-tertiary-container focus:ring-1 focus:ring-on-tertiary-container transition-all"
                      value={data}
                      ref={(el) => (otpInputsRef.current[index] = el)}
                      onChange={(e) => handleOtpChange(e.target, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      autoFocus={index === 0}
                    />
                  ))}
                </div>
              </div>
              <button 
                className="w-full bg-on-tertiary-container hover:bg-tertiary-container text-white font-label-md text-label-md py-3 px-4 rounded-lg transition-colors"
                onClick={handleVerifyToken}
              >
                Verify Token
              </button>
              <button 
                className="font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface transition-colors flex items-center justify-center gap-1"
                onClick={() => setStage('phone')}
              >
                <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                Use different ID
              </button>
            </div>
          )}

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="h-px bg-outline-variant flex-grow"></div>
            <span className="font-label-sm text-label-sm text-outline">or</span>
            <div className="h-px bg-outline-variant flex-grow"></div>
          </div>

          {/* Demo Helper */}
          <div className="bg-surface-container border border-outline-variant/50 rounded-lg p-4 flex items-start gap-3">
            <span className="material-symbols-outlined text-on-surface-variant mt-0.5">info</span>
            <div className="flex flex-col gap-1">
              <p className="font-label-md text-label-md text-on-surface">Demo Environment Active</p>
              <p className="font-body-md text-body-md text-on-surface-variant text-sm">
                Use <span className="font-mono text-primary bg-surface px-1 py-0.5 rounded border border-outline-variant/30">123456</span> as your OTP token for immediate access to the Graphite Environment.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 mt-auto border-t border-outline-variant z-10 bg-surface-container-lowest">
        <div className="max-w-7xl mx-auto px-gutter text-center">
          <p className="font-body-md text-body-md text-on-surface-variant text-sm">© 2026 Corvus AI. Secure Terminal.</p>
        </div>
      </footer>
    </div>
  );
}
