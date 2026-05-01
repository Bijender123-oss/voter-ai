import { motion } from 'framer-motion';
import { CheckCircle, XCircle, FileText, AlertTriangle, ExternalLink } from 'lucide-react';

const REQUIRED_DOCS = [
  { name: "Voter ID (EPIC)", icon: "🪪", primary: true, note: "Primary document – most accepted" },
  { name: "Aadhaar Card", icon: "🆔", primary: false },
  { name: "Passport", icon: "📘", primary: false },
  { name: "Driving License", icon: "🚗", primary: false },
  { name: "PAN Card (with photo)", icon: "💳", primary: false },
  { name: "MNREGA Job Card", icon: "📋", primary: false },
  { name: "Bank Passbook (photo)", icon: "🏦", primary: false },
  { name: "Health Insurance Smart Card", icon: "🏥", primary: false },
  { name: "Pension Document (photo)", icon: "👴", primary: false },
  { name: "Govt. Employee Service ID", icon: "👮", primary: false },
  { name: "MP/MLA Official ID Card", icon: "🏛️", primary: false },
  { name: "Disability ID (UDID)", icon: "♿", primary: false },
];

const VOTING_STEPS = [
  { step: 1, title: "Verify Your Name", desc: "Check your name on Electoral Roll at voters.eci.gov.in or call 1950.", icon: "🔍" },
  { step: 2, title: "Know Your Booth", desc: "Find your polling booth from your Voter Slip or ECI website.", icon: "🗺️" },
  { step: 3, title: "Carry Valid ID", desc: "Bring Voter ID (EPIC) or any one of the 12 alternative photo IDs.", icon: "🪪" },
  { step: 4, title: "Reach on Time", desc: "Polling is from 7 AM to 6 PM. Avoid peak hours for shorter queues.", icon: "⏰" },
  { step: 5, title: "Join the Queue", desc: "Stand in the correct queue (sometimes separate for men & women).", icon: "👥" },
  { step: 6, title: "Get Ink Mark", desc: "Officer checks your ID & applies indelible ink on your left index finger.", icon: "✍️" },
  { step: 7, title: "Enter Booth", desc: "Enter the voting compartment. The EVM shows candidate names & symbols.", icon: "🚪" },
  { step: 8, title: "Cast Your Vote", desc: "Press the button on EVM next to your chosen candidate's name/symbol.", icon: "🗳️" },
  { step: 9, title: "Verify on VVPAT", desc: "Check the VVPAT glass window – your choice visible for 7 seconds.", icon: "✅" },
];

const DOS = [
  "Carry your Voter ID or any valid alternative photo ID",
  "Check your name on the Electoral Roll before election day",
  "Vote during polling hours (7 AM – 6 PM)",
  "Follow instructions from Presiding Officer",
  "Maintain secrecy of your vote",
  "Report any malpractice to the Presiding Officer",
  "Your employer must give you paid leave to vote",
];

const DONTS = [
  "Don't carry mobile phones inside the voting compartment",
  "Don't share who you voted for with booth officers",
  "Don't accept money/gifts in exchange for vote",
  "Don't campaign within 100 metres of polling booth",
  "Don't damage or tamper with EVMs",
  "Don't impersonate another voter",
  "Don't bring weapons to polling booth area",
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function VoterGuidePage() {
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-4 md:p-6 space-y-8 overflow-y-auto h-full"
    >
      <motion.div variants={itemVariants}>
        <h1 className="section-title">Voter Guide</h1>
        <p className="text-slate-400 mt-1">Everything you need to know to vote confidently 🗳️</p>
      </motion.div>

      {/* Quick links */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { href: 'https://voters.eci.gov.in/', icon: '📝', label: 'Register to Vote' },
          { href: 'https://electoralsearch.eci.gov.in/', icon: '🔍', label: 'Check Voter Roll' },
          { href: 'https://nvsp.in/', icon: '📥', label: 'Download e-EPIC' },
          { href: 'https://www.eci.gov.in/', icon: '🏛️', label: 'ECI Official Site' },
        ].map((link, i) => (
          <motion.a 
            whileHover={{ y: -5, scale: 1.02 }}
            key={link.label} href={link.href} target="_blank" rel="noopener noreferrer"
            className="glass-card p-4 flex flex-col items-center gap-2 hover:border-teal-500/50 hover:bg-slate-800 transition-all group bg-slate-900/50 shadow-md">
            <span className="text-3xl mb-1">{link.icon}</span>
            <span className="text-xs font-bold text-slate-300 text-center group-hover:text-teal-300 transition-colors uppercase tracking-wide">{link.label}</span>
            <ExternalLink size={14} className="text-slate-500 group-hover:text-teal-400 transition-colors" />
          </motion.a>
        ))}
      </motion.div>

      {/* Required Documents */}
      <motion.section variants={itemVariants}>
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <FileText size={24} className="text-teal-400" /> Required Documents
        </h2>
        <div className="glass-card p-6 bg-slate-900/50 border-slate-700 shadow-lg">
          <p className="text-sm text-slate-300 mb-6">
            Carry your <strong className="text-teal-400">Voter ID (EPIC)</strong> – or any ONE of the 12 alternative IDs accepted by ECI:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {REQUIRED_DOCS.map((doc, i) => (
              <motion.div 
                whileHover={{ scale: 1.02 }}
                key={doc.name} 
                className={`flex items-center gap-4 p-4 rounded-xl shadow-sm ${
                doc.primary ? 'bg-gradient-to-r from-teal-500/20 to-emerald-500/10 border border-teal-500/40 shadow-[0_0_15px_rgba(20,184,166,0.15)]' : 'bg-slate-800 border border-slate-700'
              }`}>
                <span className="text-2xl">{doc.icon}</span>
                <span className={`text-sm font-bold ${doc.primary ? 'text-teal-300' : 'text-slate-200'}`}>{doc.name}</span>
                {doc.primary && <span className="ml-auto text-[10px] bg-teal-500 text-white px-2 py-0.5 rounded-full uppercase tracking-widest font-bold">Primary</span>}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Voting Steps */}
      <motion.section variants={itemVariants}>
        <h2 className="text-xl font-bold text-white mb-6">Step-by-Step Voting Guide 🗳️</h2>
        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-teal-500 via-emerald-500 to-teal-800 md:block hidden rounded-full" />
          <div className="space-y-6">
            {VOTING_STEPS.map((step, i) => (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.1 }}
                key={step.step} 
                className="flex gap-4 md:gap-6 items-start"
              >
                <div className="relative z-10 w-12 h-12 flex-shrink-0 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl flex items-center justify-center text-xl shadow-[0_0_20px_rgba(20,184,166,0.4)] border border-teal-400">
                  {step.icon}
                </div>
                <div className="flex-1 glass-card p-5 bg-slate-900/60 border-slate-700 hover:border-teal-500/50 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] bg-teal-500/20 text-teal-400 border border-teal-500/30 px-2 py-0.5 rounded-full font-bold tracking-widest uppercase">Step {step.step}</span>
                  </div>
                  <h3 className="font-bold text-white mb-2 text-lg">{step.title}</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Do's and Don'ts */}
      <motion.section variants={itemVariants}>
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <AlertTriangle size={24} className="text-amber-400" /> Do's & Don'ts
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card p-6 bg-emerald-900/20 border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.05)]">
            <h3 className="font-bold text-emerald-400 mb-5 flex items-center gap-2 text-lg border-b border-emerald-500/20 pb-3">
              <CheckCircle size={22} /> Do's ✅
            </h3>
            <div className="space-y-4">
              {DOS.map((d, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle size={18} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-slate-200 font-medium">{d}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="glass-card p-6 bg-red-900/20 border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.05)]">
            <h3 className="font-bold text-red-400 mb-5 flex items-center gap-2 text-lg border-b border-red-500/20 pb-3">
              <XCircle size={22} /> Don'ts ❌
            </h3>
            <div className="space-y-4">
              {DONTS.map((d, i) => (
                <div key={i} className="flex items-start gap-3">
                  <XCircle size={18} className="text-red-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-slate-200 font-medium">{d}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Voter Helpline */}
      <motion.div 
        whileHover={{ scale: 1.01 }}
        variants={itemVariants} 
        className="glass-card p-6 md:p-8 bg-gradient-to-br from-teal-900/60 to-emerald-900/40 border-teal-500/40 shadow-[0_0_30px_rgba(20,184,166,0.15)] flex flex-col md:flex-row items-center gap-6"
      >
        <div className="w-16 h-16 rounded-full bg-teal-500 flex items-center justify-center text-3xl shadow-lg shrink-0">
          📞
        </div>
        <div className="flex-1 text-center md:text-left">
          <h3 className="font-bold text-white text-xl mb-1">National Voter Helpline</h3>
          <p className="text-teal-200 text-sm mb-4">For any election-related queries or grievances</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-3">
            <a href="tel:1950" className="btn-primary flex items-center gap-2 text-sm shadow-lg">📞 Call 1950 (Toll Free)</a>
            <a href="https://www.eci.gov.in/" target="_blank" rel="noopener noreferrer"
              className="btn-secondary flex items-center gap-2 text-sm bg-slate-800/80">
              <ExternalLink size={16} /> Visit ECI Website
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
