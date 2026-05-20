import React, { useState } from 'react';

export default function BorrowerProfile({ setCurrentPage }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    city: '',
    monthlyIncome: '',
    monthlyEmi: '',
    employmentType: 'Salaried',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleNextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      setCurrentPage('ingest');
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center p-container-padding-mobile md:p-container-padding-desktop min-h-screen bg-grid-pattern">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-12 gap-8 relative z-10 my-8">
        
        {/* Left Panel: Context & Trust (md: 4 cols) */}
        <aside className="md:col-span-4 flex flex-col justify-between hidden md:flex">
          <div className="space-y-6">
            <div className="font-display-lg text-headline-md tracking-tighter text-on-surface cursor-pointer" onClick={() => setCurrentPage('cockpit')}>
              Corvus AI
            </div>
            <div className="pt-8">
              <h1 className="font-headline-lg text-headline-lg text-on-surface mb-4">Establish Profile</h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant">
                We are configuring your Strategic Credit Intelligence workspace. Your data helps generate a more accurate trust profile.
              </p>
            </div>
          </div>
          
          {/* High-end Progress Indicator */}
          <div className="space-y-8 pb-12">
            <div className="relative">
              {/* Connecting Line */}
              <div className="absolute left-3 top-3 bottom-3 w-[1px] bg-outline-variant -z-10"></div>
              
              {/* Step 1 Indicator */}
              <div className={`flex items-start gap-4 mb-8 transition-opacity duration-300 ${step === 1 ? 'opacity-100' : 'opacity-60'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-1 transition-all ${
                  step === 1 
                    ? 'bg-primary text-on-primary shadow-[0_0_12px_rgba(197,198,204,0.3)]' 
                    : step > 1 ? 'bg-tertiary text-white' : 'bg-surface-container-high border border-outline-variant'
                }`}>
                  <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {step > 1 ? 'check' : 'person'}
                  </span>
                </div>
                <div>
                  <h3 className="font-label-md text-label-md text-on-surface">Identity Baseline</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant text-sm mt-1">Name, Age, Location</p>
                </div>
              </div>

              {/* Step 2 Indicator */}
              <div className={`flex items-start gap-4 mb-8 transition-opacity duration-300 ${step === 2 ? 'opacity-100' : 'opacity-60'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-1 transition-all ${
                  step === 2 
                    ? 'bg-primary text-on-primary shadow-[0_0_12px_rgba(197,198,204,0.3)]' 
                    : step > 2 ? 'bg-tertiary text-white' : 'bg-surface-container-high border border-outline-variant'
                }`}>
                  <span className="material-symbols-outlined text-[14px]">
                    {step > 2 ? 'check' : 'account_balance_wallet'}
                  </span>
                </div>
                <div>
                  <h3 className="font-label-md text-label-md text-on-surface">Financial Vectors</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant text-sm mt-1">Income, Employment, EMI</p>
                </div>
              </div>

              {/* Step 3 Indicator */}
              <div className={`flex items-start gap-4 transition-opacity duration-300 ${step === 3 ? 'opacity-100' : 'opacity-60'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-1 transition-all ${
                  step === 3 
                    ? 'bg-primary text-on-primary shadow-[0_0_12px_rgba(197,198,204,0.3)]' 
                    : 'bg-surface-container-high border border-outline-variant'
                }`}>
                  <span className="material-symbols-outlined text-[14px]">hub</span>
                </div>
                <div>
                  <h3 className="font-label-md text-label-md text-on-surface">Profile Synthesis</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant text-sm mt-1">Graph initialization</p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Right Panel: The Form Flow */}
        <section className="md:col-span-8 flex items-center">
          <div className="glass-panel rounded-xl w-full p-8 md:p-12 relative overflow-hidden shadow-2xl">
            {/* Subtle AI Background Motif in Card */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 opacity-5 pointer-events-none">
              <svg fill="none" height="400" viewBox="0 0 400 400" width="400" xmlns="http://www.w3.org/2000/svg">
                <circle cx="200" cy="200" r="199" stroke="white" strokeDasharray="4 12" strokeWidth="2"></circle>
                <circle cx="200" cy="200" r="140" stroke="white" strokeWidth="1"></circle>
                <path d="M200 0V400" stroke="white" strokeDasharray="4 8" strokeWidth="1"></path>
                <path d="M0 200H400" stroke="white" strokeDasharray="4 8" strokeWidth="1"></path>
              </svg>
            </div>

            {/* Mobile Header (Visible only on mobile) */}
            <div className="md:hidden mb-8">
              <div className="font-display-lg text-headline-md tracking-tighter text-on-surface mb-2" onClick={() => setCurrentPage('cockpit')}>
                Corvus AI
              </div>
              <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">
                {step === 1 && 'Identity Baseline'}
                {step === 2 && 'Financial Vectors'}
                {step === 3 && 'Profile Synthesis'}
              </h2>
              <div className="h-1 w-full bg-surface-container-highest mt-4 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: `${(step / 3) * 100}%` }}></div>
              </div>
            </div>

            {/* Form steps */}
            <form onSubmit={(e) => e.preventDefault()} className="space-y-8 relative z-10">
              {step === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 transition-all duration-300">
                  <div className="md:col-span-2 space-y-2">
                    <label className="block font-label-md text-label-md text-on-surface" htmlFor="fullName">Legal Full Name</label>
                    <input 
                      className="w-full h-12 px-4 rounded-lg input-field font-body-md text-body-md" 
                      id="fullName" 
                      placeholder="Enter as appears on official IDs" 
                      type="text"
                      value={formData.fullName}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block font-label-md text-label-md text-on-surface" htmlFor="age">Age</label>
                    <input 
                      className="w-full h-12 px-4 rounded-lg input-field font-body-md text-body-md" 
                      id="age" 
                      max="120" 
                      min="18" 
                      placeholder="e.g. 34" 
                      type="number"
                      value={formData.age}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block font-label-md text-label-md text-on-surface" htmlFor="city">Primary Residence (City)</label>
                    <div className="relative">
                      <input 
                        className="w-full h-12 pl-10 pr-4 rounded-lg input-field font-body-md text-body-md" 
                        id="city" 
                        placeholder="Start typing..." 
                        type="text"
                        value={formData.city}
                        onChange={handleChange}
                      />
                      <span className="material-symbols-outlined absolute left-3 top-3 text-on-surface-variant">location_on</span>
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 transition-all duration-300">
                  <div className="space-y-2">
                    <label className="block font-label-md text-label-md text-on-surface" htmlFor="employmentType">Employment Type</label>
                    <select 
                      className="w-full h-12 px-4 rounded-lg input-field font-body-md text-body-md" 
                      id="employmentType"
                      value={formData.employmentType}
                      onChange={handleChange}
                    >
                      <option>Salaried</option>
                      <option>Self-Employed Professional</option>
                      <option>Business Owner</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block font-label-md text-label-md text-on-surface" htmlFor="monthlyIncome">Gross Monthly Income</label>
                    <input 
                      className="w-full h-12 px-4 rounded-lg input-field font-body-md text-body-md" 
                      id="monthlyIncome" 
                      placeholder="₹ e.g. 150000" 
                      type="number"
                      value={formData.monthlyIncome}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="block font-label-md text-label-md text-on-surface" htmlFor="monthlyEmi">Existing Monthly EMIs</label>
                    <input 
                      className="w-full h-12 px-4 rounded-lg input-field font-body-md text-body-md" 
                      id="monthlyEmi" 
                      placeholder="₹ Enter 0 if none" 
                      type="number"
                      value={formData.monthlyEmi}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6 text-center py-6 transition-all duration-300">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary border border-primary/20 shadow-lg">
                    <span className="material-symbols-outlined text-[32px]">hub</span>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-headline-md text-headline-md text-on-surface">Verification Dossier Ready</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant max-w-md mx-auto">
                      All inputs gathered. We are ready to initialize the credit graph workspace for <strong className="text-on-surface">{formData.fullName || 'New Entity'}</strong>.
                    </p>
                  </div>
                  <div className="bg-surface-container-lowest p-4 rounded-lg border border-outline-variant/35 text-left max-w-sm mx-auto text-sm space-y-1 font-mono">
                    <p><span className="text-on-surface-variant">Entity:</span> {formData.fullName || 'Apex Co'}</p>
                    <p><span className="text-on-surface-variant">Age:</span> {formData.age || '34'}</p>
                    <p><span className="text-on-surface-variant">Region:</span> {formData.city || 'Mumbai'}</p>
                    <p><span className="text-on-surface-variant">Income:</span> ₹{parseInt(formData.monthlyIncome || 0).toLocaleString()}</p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-8 border-t border-outline-variant/30 flex justify-between items-center">
                {step > 1 ? (
                  <button 
                    onClick={handlePrevStep}
                    className="font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors px-4 py-2 flex items-center gap-1"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-sm">arrow_back</span>
                    Back
                  </button>
                ) : (
                  <button 
                    onClick={() => setCurrentPage('cockpit')}
                    className="font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors px-4 py-2"
                    type="button"
                  >
                    Cancel
                  </button>
                )}

                <button 
                  onClick={handleNextStep}
                  className="bg-primary text-on-primary font-label-md text-label-md px-8 py-3 rounded-lg hover:bg-white transition-colors shadow-[0_4px_14px_rgba(197,198,204,0.15)] flex items-center gap-2 font-semibold"
                  type="button"
                >
                  {step === 3 ? 'Initialize Workspace' : 'Continue'}
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              </div>
            </form>
          </div>
        </section>

      </div>
    </div>
  );
}
