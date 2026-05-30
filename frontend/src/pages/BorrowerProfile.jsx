import { useState } from 'react';
import { saveProfile } from '../lib/api';

export default function BorrowerProfile({ setCurrentPage, user, onProfileSaved }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    age: user?.age || '',
    city: user?.city || '',
    monthlyIncome: user?.monthly_income || '',
    monthlyEmi: user?.monthly_emi || '',
    employmentType: user?.employment_type || 'Salaried',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleNextStep = async () => {
    if (step < 3) {
      setStep(step + 1);
      return;
    }
    if (!user?.id) {
      setError('Missing session. Please log in again.');
      return;
    }

    setIsSaving(true);
    setError('');
    try {
      const response = await saveProfile(user.id, {
        name: formData.fullName,
        age: Number(formData.age || 0),
        city: formData.city,
        monthly_income: Number(formData.monthlyIncome || 0),
        monthly_emi: Number(formData.monthlyEmi || 0),
        employment_type: formData.employmentType,
      });
      onProfileSaved?.(response.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
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

          <div className="space-y-8 pb-12">
            <div className="relative">
              <div className="absolute left-3 top-3 bottom-3 w-[1px] bg-outline-variant -z-10"></div>
              {[
                ['Identity Baseline', 'Name, Age, Location', 'person'],
                ['Financial Vectors', 'Income, Employment, EMI', 'account_balance_wallet'],
                ['Profile Synthesis', 'Graph initialization', 'hub'],
              ].map(([title, copy, icon], index) => {
                const current = index + 1;
                const active = step === current;
                const complete = step > current;
                return (
                  <div key={title} className={`flex items-start gap-4 ${index < 2 ? 'mb-8' : ''} transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-60'}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-1 transition-all ${
                      active
                        ? 'bg-primary text-on-primary shadow-[0_0_12px_rgba(197,198,204,0.3)]'
                        : complete
                          ? 'bg-tertiary text-white'
                          : 'bg-surface-container-high border border-outline-variant'
                    }`}>
                      <span className="material-symbols-outlined text-[14px]">{complete ? 'check' : icon}</span>
                    </div>
                    <div>
                      <h3 className="font-label-md text-label-md text-on-surface">{title}</h3>
                      <p className="font-body-md text-body-md text-on-surface-variant text-sm mt-1">{copy}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>

        <section className="md:col-span-8 flex items-center">
          <div className="glass-panel rounded-xl w-full p-8 md:p-12 relative overflow-hidden shadow-2xl">
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

            <form onSubmit={(e) => e.preventDefault()} className="space-y-8 relative z-10">
              {step === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2 space-y-2">
                    <label className="block font-label-md text-label-md text-on-surface" htmlFor="fullName">Legal Full Name</label>
                    <input className="w-full h-12 px-4 rounded-lg input-field font-body-md text-body-md" id="fullName" type="text" value={formData.fullName} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <label className="block font-label-md text-label-md text-on-surface" htmlFor="age">Age</label>
                    <input className="w-full h-12 px-4 rounded-lg input-field font-body-md text-body-md" id="age" max="120" min="18" type="number" value={formData.age} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <label className="block font-label-md text-label-md text-on-surface" htmlFor="city">Primary Residence (City)</label>
                    <input className="w-full h-12 px-4 rounded-lg input-field font-body-md text-body-md" id="city" type="text" value={formData.city} onChange={handleChange} />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block font-label-md text-label-md text-on-surface" htmlFor="employmentType">Employment Type</label>
                    <select className="w-full h-12 px-4 rounded-lg input-field font-body-md text-body-md" id="employmentType" value={formData.employmentType} onChange={handleChange}>
                      <option>Salaried</option>
                      <option>Self-Employed Professional</option>
                      <option>Business Owner</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block font-label-md text-label-md text-on-surface" htmlFor="monthlyIncome">Gross Monthly Income</label>
                    <input className="w-full h-12 px-4 rounded-lg input-field font-body-md text-body-md" id="monthlyIncome" type="number" value={formData.monthlyIncome} onChange={handleChange} />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="block font-label-md text-label-md text-on-surface" htmlFor="monthlyEmi">Existing Monthly EMIs</label>
                    <input className="w-full h-12 px-4 rounded-lg input-field font-body-md text-body-md" id="monthlyEmi" type="number" value={formData.monthlyEmi} onChange={handleChange} />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6 text-center py-6">
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
                    <p><span className="text-on-surface-variant">Income:</span> ₹{parseInt(formData.monthlyIncome || 0, 10).toLocaleString()}</p>
                  </div>
                </div>
              )}

              {error && <div className="bg-red-500/10 border border-red-400/20 rounded-lg p-4 text-sm text-red-200">{error}</div>}

              <div className="pt-8 border-t border-outline-variant/30 flex justify-between items-center">
                {step > 1 ? (
                  <button onClick={handlePrevStep} className="font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors px-4 py-2 flex items-center gap-1" type="button">
                    <span className="material-symbols-outlined text-sm">arrow_back</span>
                    Back
                  </button>
                ) : (
                  <button onClick={() => setCurrentPage('cockpit')} className="font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors px-4 py-2" type="button">
                    Cancel
                  </button>
                )}

                <button
                  onClick={handleNextStep}
                  className="bg-primary text-on-primary font-label-md text-label-md px-8 py-3 rounded-lg hover:bg-white transition-colors shadow-[0_4px_14px_rgba(197,198,204,0.15)] flex items-center gap-2 font-semibold disabled:opacity-60"
                  type="button"
                  disabled={isSaving}
                >
                  {step === 3 ? (isSaving ? 'Saving...' : 'Initialize Workspace') : 'Continue'}
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
