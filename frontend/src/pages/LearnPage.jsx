import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';

const ELECTION_STEPS = [
  {
    id: 1,
    phase: "Announcement",
    icon: "📢",
    color: "from-blue-500 to-indigo-600",
    badge: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    duration: "~2 months before",
    description: "The Election Commission of India (ECI) announces the election schedule, dates, and activates the Model Code of Conduct (MCC).",
    details: [
      "ECI sets election dates after consulting with stakeholders",
      "Model Code of Conduct (MCC) comes into force immediately",
      "Ruling party cannot announce new welfare schemes",
      "Government machinery cannot be used for campaigning",
      "ECI appoints Returning Officers for each constituency",
    ],
    keyFact: "India's ECI is an independent constitutional body established under Article 324.",
  },
  {
    id: 2,
    phase: "Nomination",
    icon: "📄",
    color: "from-purple-500 to-violet-600",
    badge: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    duration: "~6 weeks before",
    description: "Candidates file nomination papers with the Returning Officer and pay a security deposit. Scrutiny and withdrawal period follows.",
    details: [
      "Candidates file Form 2A with Returning Officer",
      "Security deposit: ₹25,000 (General) / ₹12,500 (SC/ST) for Lok Sabha",
      "Nomination scrutiny by Returning Officer",
      "Last date for withdrawal of candidature",
      "Final list of candidates published",
    ],
    keyFact: "A candidate forfeits deposit if they get less than 1/6th of valid votes polled.",
  },
  {
    id: 3,
    phase: "Campaigning",
    icon: "🎤",
    color: "from-orange-500 to-amber-600",
    badge: "bg-orange-500/20 text-orange-300 border-orange-500/30",
    duration: "14 days",
    description: "Political parties and candidates campaign through rallies, door-to-door visits, advertisements, and social media. MCC governs all activities.",
    details: [
      "Parties can hold public meetings and rallies (with police permission)",
      "No caste/religion-based appeals allowed",
      "Campaign expenditure limits strictly enforced",
      "'Silent period' 48 hours before polling – no campaigning",
      "Paid news and surrogate advertising banned",
    ],
    keyFact: "Lok Sabha candidate spending limit: ₹95 lakh (large states) / ₹75 lakh (small states/UTs).",
  },
  {
    id: 4,
    phase: "Voting Day",
    icon: "🗳️",
    color: "from-teal-500 to-emerald-600",
    badge: "bg-teal-500/20 text-teal-300 border-teal-500/30",
    duration: "7 AM – 6 PM",
    description: "Registered voters visit their assigned polling booths to cast votes on Electronic Voting Machines (EVMs). VVPAT provides transparency.",
    details: [
      "Polling hours: Usually 7 AM to 6 PM (may vary by area)",
      "Show Voter ID or any of 12 valid alternative IDs",
      "Indelible ink applied on left index finger",
      "Press EVM button next to chosen candidate/party symbol",
      "VVPAT slip visible for 7 seconds for verification",
    ],
    keyFact: "India's EVMs are 'stand-alone' machines – not connected to internet, making them tamper-proof.",
  },
  {
    id: 5,
    phase: "Counting & Results",
    icon: "📊",
    color: "from-rose-500 to-red-600",
    badge: "bg-rose-500/20 text-rose-300 border-rose-500/30",
    duration: "After polls close",
    description: "EVM results are counted at designated counting centres under tight security. Results declared round-by-round. Winner gets Certificate of Election.",
    details: [
      "Counting begins after all polling in that phase is complete",
      "Counting agents of all candidates present",
      "EVMs opened round by round in front of candidates/observers",
      "Trends updated on ECI website in real-time",
      "Winning candidate issued Certificate of Election by RO",
    ],
    keyFact: "In a multi-party contest, First-Past-The-Post (FPTP) system is used – highest votes wins.",
  },
];

export default function LearnPage() {
  const [expanded, setExpanded] = useState(1);

  return (
    <div className="p-4 md:p-6 space-y-6 overflow-y-auto h-full">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="section-title">How Elections Work in India</h1>
        <p className="text-slate-400 mt-1">Understand the complete 5-phase election process 🇮🇳</p>
      </motion.div>

      {/* Overview Cards (Timeline) */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-5 gap-2 md:gap-3 relative"
      >
        {/* Connecting line */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-800 -translate-y-1/2 z-0 hidden md:block rounded-full">
          <motion.div 
            className="h-full bg-teal-500" 
            initial={{ width: "0%" }}
            animate={{ width: `${(expanded - 1) * 25}%` }}
            transition={{ type: "spring", stiffness: 100 }}
          />
        </div>

        {ELECTION_STEPS.map((step, idx) => (
          <motion.button 
            key={step.id} 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setExpanded(step.id)}
            className={`flex flex-col items-center gap-1 p-2 md:p-3 rounded-xl border transition-all relative z-10 ${
              expanded === step.id ? 'border-teal-400 bg-teal-500/10 shadow-[0_0_15px_rgba(20,184,166,0.3)]' : 'border-slate-800 bg-slate-900 hover:border-slate-600'
            }`}
          >
            <span className="text-xl md:text-2xl mb-1">{step.icon}</span>
            <span className="text-xs text-center font-medium hidden md:block text-slate-300">{step.phase}</span>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
              expanded === step.id || expanded > step.id 
                ? `bg-gradient-to-br ${step.color} text-white`
                : 'bg-slate-800 text-slate-500'
            }`}>{step.id}</span>
          </motion.button>
        ))}
      </motion.div>

      {/* Detail Cards */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {ELECTION_STEPS.map(step => (
            expanded === step.id && (
              <motion.div 
                key={`detail-${step.id}`}
                layoutId={`card-${step.id}`}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className={`glass-card overflow-hidden ring-1 ring-teal-500/30 shadow-[0_10px_30px_-10px_rgba(20,184,166,0.2)]`}
              >
                <div className="w-full p-5 flex flex-col md:flex-row items-start md:items-center gap-4 bg-slate-800/50">
                  <div className={`w-14 h-14 flex-shrink-0 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-3xl shadow-lg`}>
                    {step.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-white text-lg">Phase {step.id}: {step.phase}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${step.badge}`}>{step.duration}</span>
                    </div>
                    <p className="text-slate-300">{step.description}</p>
                  </div>
                </div>

                <div className="p-6 bg-slate-900/50">
                  <div className="space-y-3 mb-6">
                    {step.details.map((d, i) => (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 + 0.2 }}
                        key={i} 
                        className="flex items-start gap-3"
                      >
                        <CheckCircle size={18} className="text-teal-400 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-200">{d}</span>
                      </motion.div>
                    ))}
                  </div>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 shadow-inner"
                  >
                    <p className="text-sm text-amber-300 flex items-start gap-2">
                      <span className="flex-shrink-0 mt-0.5 text-lg">💡</span>
                      <span><strong>Key Fact:</strong> {step.keyFact}</span>
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            )
          ))}
        </AnimatePresence>
      </div>

      {/* Types of elections */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass-card p-6 mt-8"
      >
        <h2 className="font-bold text-white text-xl mb-6">Types of Elections in India 🏛️</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: 'Lok Sabha', icon: '🏛️', desc: 'General elections every 5 years. 543 constituencies. Forms Central Government.', color: 'teal' },
            { title: 'Rajya Sabha', icon: '📜', desc: 'Upper house. Members elected by State legislatures every 6 years.', color: 'blue' },
            { title: 'Vidhan Sabha', icon: '🏢', desc: 'State Assembly elections every 5 years. Forms State Government.', color: 'purple' },
          ].map((e, i) => (
            <motion.div 
              whileHover={{ y: -5 }}
              key={e.title} 
              className={`bg-${e.color}-500/10 border border-${e.color}-500/30 rounded-2xl p-5 shadow-lg`}
            >
              <div className="text-3xl mb-3">{e.icon}</div>
              <h3 className="font-bold text-white mb-2 text-lg">{e.title}</h3>
              <p className="text-sm text-slate-300 leading-relaxed">{e.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
