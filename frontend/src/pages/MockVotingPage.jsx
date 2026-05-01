import { useState } from 'react';
import { motion } from 'framer-motion';
import { Vote, CheckCircle, BarChart3, AlertCircle } from 'lucide-react';

const CANDIDATES = [
  { id: 1, name: "Aarav Patel", party: "Progressive Youth Party", symbol: "🌟", color: "from-blue-500 to-cyan-500" },
  { id: 2, name: "Priya Sharma", party: "United Citizens Front", symbol: "🤝", color: "from-emerald-500 to-teal-500" },
  { id: 3, name: "Vikram Singh", party: "Development Focus Alliance", symbol: "🏗️", color: "from-orange-500 to-amber-500" },
  { id: 4, name: "NOTA", party: "None of the Above", symbol: "❌", color: "from-slate-500 to-gray-500" },
];

export default function MockVotingPage() {
  const [step, setStep] = useState('instructions'); // instructions, voting, verification, results
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [votedCandidate, setVotedCandidate] = useState(null);
  const [results, setResults] = useState(
    CANDIDATES.map(c => ({ ...c, votes: Math.floor(Math.random() * 100) + 50 }))
  );

  const handleVote = () => {
    if (!selectedCandidate) return;
    setVotedCandidate(selectedCandidate);
    setStep('verification');
    
    // Simulate VVPAT duration
    setTimeout(() => {
      setResults(prev => prev.map(c => 
        c.id === selectedCandidate.id ? { ...c, votes: c.votes + 1 } : c
      ));
      setStep('results');
    }, 7000); // 7 seconds VVPAT
  };

  const totalVotes = results.reduce((acc, curr) => acc + curr.votes, 0);
  const maxVotes = Math.max(...results.map(c => c.votes));

  return (
    <div className="p-4 md:p-6 space-y-6 overflow-y-auto h-full relative">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="section-title">Mock Voting Simulation</h1>
        <p className="text-slate-400 mt-1">Experience how EVM and VVPAT work in a real election 🗳️</p>
      </motion.div>

      {step === 'instructions' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-6 md:p-8 max-w-2xl mx-auto"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-teal-500/20">
            <Vote size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-center text-white mb-6">How to Vote (Demo)</h2>
          
          <div className="space-y-4 mb-8">
            {[
              "Select your preferred candidate from the list.",
              "Click the 'Cast Vote' button (simulates the blue EVM button).",
              "Watch the VVPAT screen carefully.",
              "A paper slip will appear for 7 seconds showing your choice.",
              "The slip will then drop into the sealed box."
            ].map((text, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 border border-teal-500/30">
                  {i + 1}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">{text}</p>
              </div>
            ))}
          </div>

          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-8 flex items-start gap-3 text-sm text-amber-300">
            <AlertCircle size={20} className="shrink-0 mt-0.5" />
            <p>This is a gamified simulation for educational purposes. Your choices are not saved to any database.</p>
          </div>

          <button onClick={() => setStep('voting')} className="btn-primary w-full text-lg py-4">
            Start Simulation
          </button>
        </motion.div>
      )}

      {step === 'voting' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-3xl mx-auto"
        >
          <div className="glass-card p-6 border-slate-700 bg-[#e2e8f0]">
            {/* EVM Machine Styling */}
            <div className="bg-[#cbd5e1] p-4 rounded-xl border-4 border-[#94a3b8] shadow-inner mb-6">
              <div className="flex justify-between items-center mb-4 bg-[#0f172a] px-4 py-2 rounded text-emerald-400 font-mono text-sm tracking-widest uppercase">
                <span>EVM Ballot Unit</span>
                <span className="flex items-center gap-2">Ready <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div></span>
              </div>
              
              <div className="space-y-2">
                {CANDIDATES.map((candidate, idx) => (
                  <div key={candidate.id} className="flex items-center gap-4 bg-white p-2 rounded border border-slate-300">
                    <div className="w-12 h-12 bg-slate-100 border border-slate-300 rounded flex items-center justify-center text-2xl shrink-0">
                      {candidate.symbol}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-slate-800 uppercase text-sm">{candidate.name}</p>
                      <p className="text-xs text-slate-500 uppercase">{candidate.party}</p>
                    </div>
                    
                    <div className="shrink-0 flex items-center gap-4 pr-2">
                      <div className={`w-4 h-4 rounded-full ${selectedCandidate?.id === candidate.id ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]' : 'bg-red-900'}`}></div>
                      <button 
                        onClick={() => setSelectedCandidate(candidate)}
                        className={`w-12 h-8 rounded bg-blue-600 hover:bg-blue-500 active:bg-blue-700 active:scale-95 transition-all shadow-[0_4px_0_#1e3a8a] ${selectedCandidate?.id === candidate.id ? 'translate-y-1 shadow-[0_0px_0_#1e3a8a]' : ''}`}
                      ></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button 
              onClick={handleVote} 
              disabled={!selectedCandidate}
              className="w-full py-4 bg-slate-800 text-white font-bold text-lg rounded-xl uppercase tracking-widest hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cast Vote
            </button>
          </div>
        </motion.div>
      )}

      {step === 'verification' && votedCandidate && (
        <div className="flex flex-col items-center justify-center py-10 max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-white mb-8">VVPAT Verification</h2>
          <div className="bg-slate-800 p-8 rounded-t-lg border-x-4 border-t-4 border-slate-600 shadow-2xl relative overflow-hidden w-64 h-80 flex flex-col items-center">
            {/* Glass window effect */}
            <div className="absolute inset-0 bg-white/5 border border-white/10 m-4 rounded shadow-inner z-10 pointer-events-none"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent z-10 pointer-events-none"></div>
            
            <p className="text-xs text-slate-400 mb-2 font-mono uppercase text-center w-full border-b border-slate-700 pb-2">Glass Window</p>
            
            <motion.div
              initial={{ y: -200, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 50, damping: 15 }}
              className="bg-yellow-50 text-slate-800 w-48 p-4 mt-4 shadow-lg border border-slate-300 font-mono text-center relative z-0"
            >
              <p className="text-xs border-b border-dashed border-slate-400 pb-2 mb-2">Voter Verifiable Paper Audit Trail</p>
              <div className="text-4xl mb-4 mt-2">{votedCandidate.symbol}</div>
              <p className="font-bold text-lg leading-tight uppercase">{votedCandidate.name}</p>
              <p className="text-xs mt-1 uppercase">{votedCandidate.party}</p>
              <p className="text-[10px] mt-4 text-slate-500">Visible for 7 seconds</p>
            </motion.div>
            
            <motion.div 
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 7, ease: "linear" }}
              className="absolute bottom-0 left-0 h-1 bg-red-500 z-20"
            />
          </div>
          <div className="w-72 h-16 bg-slate-700 rounded-b-xl border-x-4 border-b-4 border-slate-600 relative overflow-hidden flex justify-center">
             <div className="w-48 h-2 bg-black absolute top-0"></div> {/* Drop slot */}
             <p className="text-slate-400 text-xs mt-6 uppercase font-bold tracking-widest opacity-50">Drop Box</p>
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-8 flex items-center gap-2 text-emerald-400 font-medium bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20"
          >
            <CheckCircle size={18} />
            Vote Recorded Successfully
          </motion.div>
        </div>
      )}

      {step === 'results' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-3xl mx-auto"
        >
          <div className="glass-card p-6 md:p-8">
            <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <BarChart3 className="text-teal-400" /> Election Results
              </h2>
              <span className="bg-teal-500/20 text-teal-300 px-3 py-1 rounded-full text-sm border border-teal-500/30">
                {totalVotes} Total Votes
              </span>
            </div>

            <div className="space-y-6">
              {results.sort((a,b) => b.votes - a.votes).map((candidate, idx) => {
                const percentage = ((candidate.votes / totalVotes) * 100).toFixed(1);
                const isWinner = idx === 0;
                
                return (
                  <div key={candidate.id}>
                    <div className="flex justify-between text-sm mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{candidate.symbol}</span>
                        <span className="font-bold text-white">{candidate.name}</span>
                        {isWinner && <span className="bg-yellow-500/20 text-yellow-300 text-xs px-2 py-0.5 rounded-full border border-yellow-500/30 ml-2 animate-pulse">Winner</span>}
                      </div>
                      <div className="text-slate-300">
                        <span className="font-bold text-white">{candidate.votes}</span> votes ({percentage}%)
                      </div>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-4 border border-white/10 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1.5, ease: "easeOut", delay: idx * 0.2 }}
                        className={`h-full bg-gradient-to-r ${candidate.color} relative`}
                      >
                        <div className="absolute inset-0 bg-white/20" style={{ backgroundImage: 'linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent)', backgroundSize: '1rem 1rem' }}></div>
                      </motion.div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-10 pt-6 border-t border-white/10 flex justify-center">
              <button onClick={() => {
                setStep('instructions');
                setSelectedCandidate(null);
                setVotedCandidate(null);
              }} className="btn-secondary">
                Restart Simulation
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
