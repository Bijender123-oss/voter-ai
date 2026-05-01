import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Vote, Shield, BookOpen, MapPin, Zap, ChevronRight, Globe2 } from 'lucide-react';

export default function OnboardingPage({ onComplete }) {
  const { saveProfile, continueAsGuest } = useAuth();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ name: '', age: '', state: '', isFirstVoter: null, language: 'en' });
  const [loading, setLoading] = useState(false);

  const states = [
    'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana',
    'Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur',
    'Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana',
    'Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Delhi','Jammu & Kashmir','Ladakh',
    'Puducherry','Chandigarh','Other'
  ];

  const handleNext = () => {
    if (step < 3) setStep(s => s + 1);
    else handleComplete();
  };

  const handleComplete = async () => {
    setLoading(true);
    const profile = {
      ...form,
      age: parseInt(form.age),
      isFirstVoter: form.isFirstVoter === 'yes',
      onboardingDone: true,
    };
    await saveProfile(profile);
    onComplete(profile);
  };

  const steps = [
    { icon: Vote, title: "Welcome to VoteSmart AI", subtitle: "Your AI-powered election education companion for India 🇮🇳" },
    { icon: Shield, title: "Let's personalize your guide", subtitle: "What should we call you?" },
    { icon: BookOpen, title: "Voting experience", subtitle: "So we can guide you better" },
    { icon: Globe2, title: "Choose your Language", subtitle: "We support English & Hindi" },
  ];

  const currentStep = steps[step];
  const Icon = currentStep.icon;

  const cardVariants = {
    hidden: { opacity: 0, x: 50, scale: 0.95 },
    visible: { opacity: 1, x: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 30 } },
    exit: { opacity: 0, x: -50, scale: 0.95, transition: { duration: 0.2 } }
  };

  return (
    <div className="min-h-screen bg-dark bg-grid flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient glows */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
        className="absolute top-1/4 -left-32 w-96 h-96 bg-teal-500 rounded-full blur-[100px]" 
      />
      <motion.div 
        animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ repeat: Infinity, duration: 10, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-1/4 -right-32 w-96 h-96 bg-emerald-500 rounded-full blur-[100px]" 
      />

      <div className="w-full max-w-lg relative z-10">
        {/* Progress Dots */}
        <div className="flex justify-center gap-3 mb-8">
          {steps.map((_, i) => (
            <div key={i} className={`h-2 rounded-full transition-all duration-500 ${
              i === step ? 'w-8 bg-teal-400' : 
              i < step ? 'w-2 bg-teal-600' : 'w-2 bg-slate-700'
            }`} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div 
            key={step}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="glass-card p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-slate-700/50"
          >
            {/* Icon */}
            <motion.div 
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
              className="flex justify-center mb-6"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(20,184,166,0.3)]">
                <Icon size={36} className="text-white" />
              </div>
            </motion.div>

            <h1 className="text-2xl md:text-3xl font-bold text-center text-white mb-2">{currentStep.title}</h1>
            <p className="text-slate-400 text-center mb-8">{currentStep.subtitle}</p>

            {/* Step 0: Welcome */}
            {step === 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-5">
                <div className="grid grid-cols-3 gap-3 mb-8">
                  {[
                    { icon: '🤖', label: 'AI Chat' },
                    { icon: '📱', label: 'Simulations' },
                    { icon: '🗺️', label: 'Find Booths' },
                  ].map((f, i) => (
                    <motion.div whileHover={{ y: -5 }} key={f.label} className="bg-slate-800/50 border border-slate-700 rounded-xl p-3 text-center">
                      <div className="text-3xl mb-2">{f.icon}</div>
                      <div className="text-xs font-medium text-slate-300">{f.label}</div>
                    </motion.div>
                  ))}
                </div>
                <button onClick={() => setStep(1)} className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-2">
                  Get Started <ChevronRight size={20} />
                </button>
                <button onClick={async () => { await continueAsGuest(); onComplete({ onboardingDone: true }); }}
                  className="w-full text-center text-sm text-slate-400 hover:text-white transition-colors">
                  Skip for now
                </button>
              </motion.div>
            )}

            {/* Step 1: Name & Age */}
            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-1.5 block">Your Name</label>
                  <input className="input-field bg-slate-800/50 border-slate-700 focus:border-teal-400" placeholder="e.g. Rahul Sharma" value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))} autoFocus />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-300 mb-1.5 block">Age</label>
                    <input className="input-field bg-slate-800/50 border-slate-700 focus:border-teal-400" type="number" placeholder="18+" min="18" max="100"
                      value={form.age} onChange={e => setForm(f => ({ ...f, age: e.target.value }))} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-300 mb-1.5 block">State</label>
                    <select className="input-field bg-slate-800/50 border-slate-700 focus:border-teal-400 text-white" value={form.state}
                      onChange={e => setForm(f => ({ ...f, state: e.target.value }))}>
                      <option value="" className="text-slate-500">Select...</option>
                      {states.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <button onClick={handleNext} disabled={!form.name || !form.age || !form.state}
                  className="btn-primary w-full py-4 text-lg disabled:opacity-50 flex items-center justify-center gap-2 mt-4">
                  Continue <ChevronRight size={20} />
                </button>
              </div>
            )}

            {/* Step 2: First voter */}
            {step === 2 && (
              <div className="space-y-4">
                {[
                  { val: 'yes', label: '✅ Yes, I have voted before', desc: 'I know the basics' },
                  { val: 'no', label: '🌟 No, this is my first time', desc: 'Guide me step-by-step' },
                ].map(opt => (
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    key={opt.val}
                    onClick={() => { setForm(f => ({ ...f, isFirstVoter: opt.val === 'no' ? 'yes' : 'no' })); }}
                    className={`w-full p-5 rounded-xl border-2 text-left transition-all ${
                      form.isFirstVoter === (opt.val === 'no' ? 'yes' : 'no')
                        ? 'border-teal-500 bg-teal-500/10 text-white shadow-[0_0_15px_rgba(20,184,166,0.2)]'
                        : 'border-slate-700 bg-slate-800/50 text-slate-300 hover:border-slate-500'
                    }`}>
                    <div className="font-bold text-lg">{opt.label}</div>
                    <div className="text-sm text-slate-400 mt-1">{opt.desc}</div>
                  </motion.button>
                ))}
                <button onClick={handleNext} disabled={!form.isFirstVoter}
                  className="btn-primary w-full py-4 text-lg disabled:opacity-50 flex items-center justify-center gap-2 mt-6">
                  Continue <ChevronRight size={20} />
                </button>
              </div>
            )}

            {/* Step 3: Language */}
            {step === 3 && (
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { code: 'en', label: 'English', subtitle: 'Hello', emoji: 'A' },
                    { code: 'hi', label: 'हिन्दी', subtitle: 'नमस्ते', emoji: 'अ' },
                  ].map(lang => (
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      key={lang.code}
                      onClick={() => setForm(f => ({ ...f, language: lang.code }))}
                      className={`p-6 rounded-xl border-2 text-center transition-all ${
                        form.language === lang.code
                          ? 'border-teal-500 bg-teal-500/10 shadow-[0_0_15px_rgba(20,184,166,0.2)]'
                          : 'border-slate-700 bg-slate-800/50 hover:border-slate-500'
                      }`}>
                      <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center text-xl font-bold mb-3 ${form.language === lang.code ? 'bg-teal-500 text-white' : 'bg-slate-700 text-slate-300'}`}>
                        {lang.emoji}
                      </div>
                      <div className="font-bold text-lg text-white">{lang.label}</div>
                      <div className="text-xs text-slate-400">{lang.subtitle}</div>
                    </motion.button>
                  ))}
                </div>
                <button onClick={handleComplete} disabled={loading}
                  className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-2 mt-4 relative overflow-hidden group">
                  {loading ? (
                    <span className="animate-spin"><RefreshCw /></span>
                  ) : (
                    <>
                      <Zap size={20} className="group-hover:animate-pulse" />
                      <span className="font-bold">Launch VoteSmart</span>
                    </>
                  )}
                  {/* Button shine effect */}
                  <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shimmer" />
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
