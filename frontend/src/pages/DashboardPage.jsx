import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, BookOpen, MapPin, HelpCircle, Star, ChevronRight, ExternalLink, Vote, Zap, ClipboardList } from 'lucide-react';

const STATS = [
  { label: 'Total Voters (2024)', value: '96.8 Cr', icon: '🗳️', color: 'from-teal-500 to-emerald-600' },
  { label: 'Lok Sabha Seats', value: '543', icon: '🏛️', color: 'from-blue-500 to-indigo-600' },
  { label: 'Polling Booths', value: '10.5L+', icon: '📍', color: 'from-purple-500 to-violet-600' },
  { label: 'States & UTs', value: '36', icon: '🗺️', color: 'from-orange-500 to-amber-600' },
];

const FIRST_VOTER_STEPS = [
  { step: 1, title: "Check Eligibility", desc: "18+ years old, Indian citizen", done: false },
  { step: 2, title: "Register Online", desc: "Fill Form 6 on voters.eci.gov.in", done: false },
  { step: 3, title: "Get Voter ID", desc: "Receive EPIC card or download e-EPIC", done: false },
  { step: 4, title: "Find Your Booth", desc: "Use our Booth Locator tool", done: false },
  { step: 5, title: "Cast Your Vote", desc: "Vote on election day with confidence!", done: false },
];

const NEWS_HIGHLIGHTS = [
  { title: "Voter Helpline 1950 Available 24x7", tag: "ECI Update", color: "bg-teal-500/20 text-teal-300 border-teal-500/30" },
  { title: "e-EPIC Now Available for Download", tag: "New Feature", color: "bg-blue-500/20 text-blue-300 border-blue-500/30" },
  { title: "Special Summary Revision Period Open", tag: "Registration", color: "bg-orange-500/20 text-orange-300 border-orange-500/30" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function DashboardPage({ onNavigate, userProfile }) {
  const { logout } = useAuth();
  const isFirstVoter = userProfile?.isFirstVoter === true;
  const name = userProfile?.name || 'Voter';

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-4 md:p-6 space-y-6 overflow-y-auto h-full"
    >
      {/* Welcome banner */}
      <motion.div variants={itemVariants} className="relative glass-card p-6 overflow-hidden border-slate-700">
        <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
        <div className="absolute bottom-0 left-1/3 w-32 h-32 bg-emerald-500/10 rounded-full translate-y-1/2 blur-2xl" />
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-teal-400 text-sm font-medium mb-1">
                Welcome back 👋
              </motion.p>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{name}</h1>
              {userProfile?.state && <p className="text-slate-400 text-sm flex items-center gap-1"><MapPin size={14}/> {userProfile.state}</p>}
              
              {isFirstVoter && (
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="inline-block mt-3 text-xs px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full font-medium"
                >
                  🌟 First-Time Voter
                </motion.div>
              )}
            </div>
            <motion.div 
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="text-6xl hidden md:block drop-shadow-2xl"
            >
              🇮🇳
            </motion.div>
          </div>
          <p className="text-slate-400 text-sm mt-4 max-w-lg leading-relaxed">
            Your voice matters. Every vote counts in shaping India's democracy.
            {isFirstVoter ? " We've prepared a special guide just for you!" : " Stay informed and vote wisely."}
          </p>
        </div>
      </motion.div>

      {/* First Voter Guide (conditional) */}
      {isFirstVoter && (
        <motion.div variants={itemVariants} className="glass-card p-6 border-amber-500/30 bg-amber-500/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl"></div>
          <h2 className="font-bold text-white text-xl mb-6 flex items-center gap-2 relative z-10">
            <Star className="text-amber-400" size={24} fill="currentColor" /> First-Time Voter Checklist
          </h2>
          <div className="space-y-4 relative z-10">
            {FIRST_VOTER_STEPS.map((step, idx) => (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + (idx * 0.1) }}
                key={step.step} 
                className="flex items-center gap-4 bg-slate-900/50 p-3 rounded-xl border border-slate-800"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-sm font-bold text-white flex-shrink-0 shadow-lg shadow-amber-500/20">
                  {step.step}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-white">{step.title}</p>
                  <p className="text-xs text-slate-400">{step.desc}</p>
                </div>
                <ChevronRight size={18} className="text-slate-500" />
              </motion.div>
            ))}
          </div>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigate('guide')} 
            className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-sm shadow-lg shadow-amber-500/20 flex justify-center items-center gap-2"
          >
            View Full Voter Guide <ChevronRight size={16} />
          </motion.button>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Quick Actions */}
          <motion.div variants={itemVariants}>
            <h2 className="font-bold text-white text-lg mb-4 flex items-center gap-2"><Zap className="text-teal-400" size={20}/> Quick Actions</h2>
<div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
               {[
                 { icon: MessageSquare, label: 'Ask AI', desc: 'Chat with VoteSmart', nav: 'chat', color: 'from-teal-400 to-emerald-500' },
                 { icon: Vote, label: 'Mock Vote', desc: 'Simulate EVM', nav: 'mock-vote', color: 'from-red-500 to-rose-600' },
                 { icon: BookOpen, label: 'Learn', desc: 'Election process', nav: 'learn', color: 'from-blue-500 to-indigo-600' },
                 { icon: MapPin, label: 'Find Booth', desc: 'Locate polling booth', nav: 'booth', color: 'from-purple-500 to-violet-600' },
                 { icon: HelpCircle, label: 'Score', desc: 'Check awareness', nav: 'quiz', color: 'from-orange-400 to-amber-500' },
                 { icon: ClipboardList, label: 'Track Reg', desc: 'Registration status', nav: 'register', color: 'from-cyan-500 to-teal-600' },
               ].map((action, i) => {
                const Ic = action.icon;
                return (
                  <motion.button 
                    whileHover={{ y: -5, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    key={action.nav} 
                    onClick={() => onNavigate(action.nav)}
                    className="glass-card p-4 md:p-5 text-left border-slate-700/50 hover:border-teal-500/50 transition-colors shadow-lg bg-slate-800/80 group"
                  >
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-shadow`}>
                      <Ic size={24} className="text-white" />
                    </div>
                    <p className="font-bold text-white text-sm group-hover:text-teal-300 transition-colors">{action.label}</p>
                    <p className="text-xs text-slate-400 mt-1">{action.desc}</p>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
          
          {/* Stats */}
          <motion.div variants={itemVariants}>
            <h2 className="font-bold text-white text-lg mb-4">India's Electoral Scale 📊</h2>
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              {STATS.map((s, i) => (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + (i * 0.1) }}
                  key={s.label} 
                  className="glass-card p-4 border-slate-700 bg-slate-800/50"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center text-lg shadow-md`}>
                      {s.icon}
                    </div>
                    <div className="text-xs text-slate-400 font-medium">{s.label}</div>
                  </div>
                  <div className="text-2xl font-black text-white">{s.value}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
        
        {/* Sidebar content */}
        <div className="space-y-6">
          {/* News / Highlights */}
          <motion.div variants={itemVariants} className="glass-card p-5 border-slate-700 bg-slate-800/80">
            <div className="flex items-center justify-between mb-5 border-b border-slate-700 pb-3">
              <h2 className="font-bold text-white">ECI Highlights</h2>
              <a href="https://www.eci.gov.in/" target="_blank" rel="noopener noreferrer"
                className="text-xs text-teal-400 hover:text-teal-300 flex items-center gap-1 bg-teal-500/10 px-2 py-1 rounded">
                Official <ExternalLink size={10} />
              </a>
            </div>
            <div className="space-y-4">
              {NEWS_HIGHLIGHTS.map((n, i) => (
                <div key={i} className="group">
                  <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full border mb-1.5 ${n.color} font-medium tracking-wide`}>
                    {n.tag}
                  </span>
                  <p className="text-sm text-slate-300 font-medium group-hover:text-white transition-colors">{n.title}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Voter Registration Banner */}
          <motion.div 
            variants={itemVariants} 
            whileHover={{ scale: 1.02 }}
            className="glass-card p-6 bg-gradient-to-br from-teal-900/60 to-emerald-900/40 border-teal-500/30 text-center relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/20 rounded-full blur-2xl"></div>
            <div className="text-5xl mb-4 relative z-10">📝</div>
            <h3 className="font-bold text-white mb-2 text-lg relative z-10">Not Registered Yet?</h3>
            <p className="text-sm text-slate-300 mb-5 relative z-10">Register as a voter online in minutes. It's free and easy!</p>
            <a href="https://voters.eci.gov.in/" target="_blank" rel="noopener noreferrer"
              className="btn-primary w-full flex items-center justify-center gap-2 text-sm relative z-10 shadow-lg shadow-teal-500/20"
            >
              Register Now <ExternalLink size={16} />
            </a>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
