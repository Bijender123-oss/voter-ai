import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Trophy, RefreshCw, ChevronRight, Star, TrendingUp } from 'lucide-react';

// Selected 5 most important questions for Awareness Score
const QUESTIONS = [
  {
    id: 1, category: "Eligibility",
    question: "What is the minimum age to vote in India?",
    options: ["16 years", "18 years", "21 years", "25 years"],
    correct: 1,
    explanation: "The voting age in India is 18 years, lowered from 21 by the 61st Amendment.",
  },
  {
    id: 2, category: "EVM",
    question: "What does VVPAT do?",
    options: [
      "Prints a receipt you can take home",
      "Shows a printed slip for 7 seconds to verify your vote",
      "Registers you as a voter automatically",
      "Counts the votes digitally",
    ],
    correct: 1,
    explanation: "VVPAT shows a printed slip of your vote for 7 seconds through a glass window for verification before dropping it in a sealed box.",
  },
  {
    id: 3, category: "Registration",
    question: "Which form is used for new voter registration?",
    options: ["Form 6", "Form 7", "Form 8", "Form 2A"],
    correct: 0,
    explanation: "Form 6 is the standard form used to enroll as a new voter on the Electoral Roll.",
  },
  {
    id: 4, category: "Rights",
    question: "If your name is missing from the voter list on election day, can you still vote using your Aadhaar card?",
    options: [
      "Yes, Aadhaar is enough",
      "Yes, if I show proof of address",
      "No, my name MUST be on the Electoral Roll",
      "Yes, by paying a fine",
    ],
    correct: 2,
    explanation: "You CANNOT vote if your name is not on the Electoral Roll, even if you have valid ID cards.",
  },
  {
    id: 5, category: "Awareness",
    question: "What is the toll-free Voter Helpline number in India?",
    options: ["100", "112", "1950", "1800"],
    correct: 2,
    explanation: "1950 is ECI's toll-free National Voter Helpline for all election-related queries.",
  },
];

function ScoreCard({ score, total, onRetry }) {
  const pct = Math.round((score / total) * 100);
  
  let grade = { label: 'Beginner 🌱', color: 'text-orange-400', fromColor: 'from-orange-500', toColor: 'to-amber-500', msg: "Good start! You need to read the Voter Guide to be fully prepared." };
  if (pct >= 80) grade = { label: 'Advanced 🏆', color: 'text-yellow-400', fromColor: 'from-yellow-400', toColor: 'to-amber-500', msg: "Excellent! You are a highly aware and responsible voter." };
  else if (pct >= 60) grade = { label: 'Intermediate ⭐', color: 'text-teal-400', fromColor: 'from-teal-400', toColor: 'to-emerald-500', msg: "Well done! You know the basics, but there's room to learn." };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-10 px-4 h-full"
    >
      <div className="glass-card p-8 md:p-10 max-w-md w-full text-center relative overflow-hidden">
        {/* Confetti / background effect */}
        <div className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${grade.fromColor} ${grade.toColor} rounded-full opacity-20 blur-2xl`}></div>
        <div className={`absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br ${grade.fromColor} ${grade.toColor} rounded-full opacity-20 blur-2xl`}></div>

        <motion.div 
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          className={`w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br ${grade.fromColor} ${grade.toColor} flex items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.3)] relative z-10`}
        >
          <Trophy size={40} className="text-white" />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-slate-400 font-medium uppercase tracking-widest text-sm mb-2">Awareness Level</h3>
          <h2 className={`text-4xl font-black mb-3 ${grade.color}`}>{grade.label}</h2>
          <p className="text-slate-300 mb-8 leading-relaxed">{grade.msg}</p>

          <div className="flex justify-center items-end gap-2 mb-8">
            <span className="text-6xl font-black text-white leading-none">{score}</span>
            <span className="text-2xl text-slate-500 font-bold mb-1">/ {total}</span>
          </div>

          <button onClick={onRetry} className="btn-primary w-full flex items-center justify-center gap-2 py-4 text-lg">
            <RefreshCw size={20} /> Test Again
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function QuizPage() {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const q = QUESTIONS[currentQ];

  const handleSelect = (idx) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    const correct = idx === q.correct;
    if (correct) setScore(s => s + 1);
  };

  const handleNext = () => {
    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ(c => c + 1);
      setSelected(null);
      setAnswered(false);
    } else {
      setDone(true);
    }
  };

  const retry = () => {
    setCurrentQ(0); setSelected(null); setAnswered(false);
    setScore(0); setDone(false);
  };

  if (done) return <ScoreCard score={score} total={QUESTIONS.length} onRetry={retry} />;

  return (
    <div className="p-4 md:p-6 overflow-y-auto h-full">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="section-title flex items-center gap-3">
            <TrendingUp className="text-teal-400" size={32} />
            Voter Awareness Score
          </h1>
          <p className="text-slate-400 mt-2">Answer 5 simple questions to find out your awareness level. 🇮🇳</p>
        </motion.div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-slate-400 mb-2 font-medium">
            <span>Question {currentQ + 1} of {QUESTIONS.length}</span>
            <span className="text-teal-400 flex items-center gap-1"><Star size={14} /> Score: {score}</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-teal-500 to-emerald-400"
              initial={{ width: 0 }}
              animate={{ width: `${((currentQ) / QUESTIONS.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={q.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="glass-card p-6 md:p-8 mb-6"
          >
            <span className="inline-block px-3 py-1 bg-slate-800 text-teal-400 rounded-full text-xs font-bold tracking-wider uppercase mb-4 border border-slate-700">
              {q.category}
            </span>
            <h2 className="text-xl md:text-2xl font-bold text-white mb-8 leading-tight">{q.question}</h2>

            <div className="space-y-3">
              {q.options.map((opt, idx) => {
                let cls = 'border-slate-700 bg-slate-800 hover:border-slate-500 text-slate-200';
                if (answered) {
                  if (idx === q.correct) cls = 'border-emerald-500 bg-emerald-500/20 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]';
                  else if (idx === selected && idx !== q.correct) cls = 'border-red-500 bg-red-500/20 text-red-300';
                  else cls = 'border-slate-800 bg-slate-900/50 text-slate-600 opacity-50';
                } else if (selected === idx) {
                  cls = 'border-teal-500 bg-teal-500/20 text-white';
                }

                return (
                  <motion.button 
                    whileHover={!answered ? { scale: 1.02 } : {}}
                    whileTap={!answered ? { scale: 0.98 } : {}}
                    key={idx} 
                    onClick={() => handleSelect(idx)}
                    disabled={answered}
                    className={`w-full text-left p-4 md:p-5 rounded-xl border-2 transition-all flex items-center gap-4 ${cls}`}
                  >
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                      answered && idx === q.correct ? 'border-emerald-500 bg-emerald-500 text-white'
                      : answered && idx === selected && idx !== q.correct ? 'border-red-500 bg-red-500 text-white'
                      : answered ? 'border-slate-700 text-slate-600'
                      : 'border-slate-600 text-slate-400'
                    }`}>
                      {answered && idx === q.correct ? <CheckCircle size={18} />
                       : answered && idx === selected ? <XCircle size={18} />
                       : String.fromCharCode(65 + idx)}
                    </div>
                    <span className="font-medium">{opt}</span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Explanation & Next Button */}
        <AnimatePresence>
          {answered && (
            <motion.div 
              initial={{ opacity: 0, y: 10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              className="space-y-4"
            >
              <div className="glass-card p-5 border-l-4 border-l-teal-500 bg-teal-500/5">
                <p className="text-slate-200">
                  <strong className="text-teal-400 block mb-1">💡 Did you know?</strong>
                  {q.explanation}
                </p>
              </div>

              <button 
                onClick={handleNext} 
                className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-2"
              >
                {currentQ < QUESTIONS.length - 1 ? (
                  <>Next Question <ChevronRight size={20} /></>
                ) : (
                  <><Trophy size={20} /> See My Score</>
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
