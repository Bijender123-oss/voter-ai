import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { askGemini } from '../utils/gemini';
import { Send, Mic, MicOff, User, Sparkles, RefreshCw, Volume2, VolumeX, Bot } from 'lucide-react';

const SUGGESTED = [
  "How do I register as a voter?",
  "What documents do I need to vote?",
  "How does the election process work?",
  "What is EVM and VVPAT?",
];

// Reusing your MarkdownText but making it look a bit cleaner for chat
function MarkdownText({ text }) {
  const formatted = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^### (.*)/gm, '<h3 class="font-semibold mt-2 mb-1">$1</h3>')
    .replace(/^## (.*)/gm, '<h2 class="font-bold mt-3 mb-1 text-lg">$1</h2>')
    .replace(/^# (.*)/gm, '<h1 class="font-bold mt-3 mb-1 text-xl">$1</h1>')
    .replace(/^\d+\. (.*)/gm, '<li class="ml-4 list-decimal marker:text-teal-400">$1</li>')
    .replace(/^- (.*)/gm, '<li class="ml-4 list-disc marker:text-teal-400">$1</li>')
    .replace(/^> (.*)/gm, '<blockquote class="border-l-2 border-current pl-3 italic my-2 opacity-80">$1</blockquote>')
    .replace(/\n/g, '<br/>');
  return <div className="prose-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: formatted }} />;
}

export default function ChatPage({ userProfile }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'model',
      content: `Namaste ${userProfile?.name ? userProfile.name : ''}! 🙏 I'm **VoteSmart AI**, your friendly election guide.\n\nI can help you with:\n- 🗳️ How to vote step-by-step\n- 📋 Required documents\n- 📝 Voter registration\n- 🏛️ Election process\n\nHow can I help you today? Ask me anything in **Hindi** or **English**!`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Voice Input Setup
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = userProfile?.language === 'hi' ? 'hi-IN' : 'en-IN';
      recognitionRef.current.onresult = (e) => {
        setInput(e.results[0][0].transcript);
        setListening(false);
      };
      recognitionRef.current.onend = () => setListening(false);
      recognitionRef.current.onerror = () => setListening(false);
    }
  }, [userProfile?.language]);

  const toggleVoice = () => {
    if (!recognitionRef.current) return;
    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      recognitionRef.current.start();
      setListening(true);
    }
  };

  const speakText = (text) => {
    if (!ttsEnabled || !window.speechSynthesis) return;
    window.speechSynthesis.cancel(); // stop current speaking
    
    // Clean text for speaking (remove markdown chars and emojis if possible, but basic clean is fine)
    const cleanText = text.replace(/[*#]/g, '').replace(/<[^>]*>?/gm, '');
    
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = userProfile?.language === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    
    // Try to find a good female/natural voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.lang.includes(utterance.lang) && v.name.toLowerCase().includes('female'));
    if (preferredVoice) utterance.voice = preferredVoice;

    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    }
  };

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput('');
    stopSpeaking(); // Stop any active speech

    const userMsg = { id: Date.now(), role: 'user', content: msg, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    const history = messages.map(m => ({ role: m.role, content: m.content }));
    try {
      const reply = await askGemini(msg, history);
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'model', content: reply, timestamp: new Date() }]);
      if (ttsEnabled) speakText(reply);
    } catch {
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'model', content: "Sorry, I couldn't process that. Please try again.", timestamp: new Date() }]);
    }
    setLoading(false);
  };

  const clearChat = () => {
    stopSpeaking();
    setMessages([{
      id: Date.now(), role: 'model',
      content: "Chat cleared! I'm ready for your questions. 🗳️",
      timestamp: new Date(),
    }]);
  };

  return (
    <div className="flex flex-col h-full max-h-full bg-[url('https://i.imgur.com/3q1E3eA.png')] bg-repeat bg-center" style={{ backgroundSize: '400px', backgroundColor: '#0f172a', backgroundBlendMode: 'overlay' }}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 md:p-4 bg-slate-900/90 backdrop-blur-md border-b border-white/10 flex-shrink-0 z-10 shadow-md">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="relative">
            {speaking && (
              <>
                <motion.div animate={{ scale: [1, 1.5], opacity: [0.5, 0] }} transition={{ repeat: Infinity, duration: 1 }} className="absolute inset-0 bg-teal-400 rounded-full z-0" />
                <motion.div animate={{ scale: [1, 1.5], opacity: [0.5, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.3 }} className="absolute inset-0 bg-emerald-400 rounded-full z-0" />
              </>
            )}
            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shadow-lg overflow-hidden border-2 relative z-10 ${speaking ? 'border-teal-400' : 'border-teal-500/50'}`}>
               <motion.img 
                  animate={speaking ? { 
                    scale: [1, 1.05, 1, 1.02, 1], 
                    y: [0, -2, 0, -1, 0],
                    rotate: [0, 1, -1, 0]
                  } : {}}
                  transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut" }}
                  src="https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=150&auto=format&fit=crop" 
                  alt="AI Avatar" 
                  className="w-full h-full object-cover" 
               />
            </div>
            <span className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-slate-900 rounded-full z-20 ${speaking ? 'bg-green-400 animate-pulse' : 'bg-emerald-500'}`}></span>
          </div>
          <div>
            <h2 className="font-bold text-white leading-tight">VoteSmart Assistant</h2>
            <p className="text-xs text-emerald-400 font-medium">
              {loading ? 'typing...' : speaking ? 'speaking...' : 'Online'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 md:gap-2">
          <button 
            onClick={() => {
              setTtsEnabled(!ttsEnabled);
              if (ttsEnabled) stopSpeaking();
            }} 
            className={`p-2 rounded-full transition-all ${ttsEnabled ? 'text-teal-400 hover:bg-teal-500/10' : 'text-slate-500 hover:bg-white/10'}`} 
            title={ttsEnabled ? "Disable Voice" : "Enable Voice"}
          >
            {ttsEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
          <button onClick={clearChat} className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-all" title="Clear chat">
            <RefreshCw size={20} />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 min-h-0">
        <AnimatePresence initial={false}>
          {messages.map(msg => (
            <motion.div 
              key={msg.id} 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3 }}
              className={`flex items-end gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar next to message */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mb-1 overflow-hidden border border-teal-500/30 ${
                msg.role === 'user'
                  ? 'bg-gradient-to-br from-slate-600 to-slate-700 hidden md:flex'
                  : 'shadow-md'
              }`}>
                {msg.role === 'user' ? (
                  <User size={16} className="text-white" />
                ) : (
                   <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=150&auto=format&fit=crop" alt="AI" className="w-full h-full object-cover" />
                )}
              </div>
              
              {/* Message Bubble WhatsApp Style */}
              <div className={`relative max-w-[85%] md:max-w-[75%] px-4 py-3 shadow-md ${
                msg.role === 'user' 
                  ? 'bg-teal-600 text-white rounded-2xl rounded-br-sm' 
                  : 'bg-slate-800/90 backdrop-blur-sm text-slate-100 border border-slate-700 rounded-2xl rounded-bl-sm'
              }`}>
                <MarkdownText text={msg.content} />
                <div className={`text-[10px] mt-1.5 flex items-center gap-1 ${msg.role === 'user' ? 'text-teal-200 justify-end' : 'text-slate-400 justify-end'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  {msg.role === 'user' && <CheckCircle size={10} className="inline" />}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {loading && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-end gap-2"
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mb-1 shadow-md overflow-hidden border border-teal-500/30">
              <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=150&auto=format&fit=crop" alt="AI" className="w-full h-full object-cover" />
            </div>
            <div className="bg-slate-800/90 backdrop-blur-sm border border-slate-700 px-4 py-4 rounded-2xl rounded-bl-sm shadow-md">
              <div className="flex gap-1.5 items-center">
                <motion.span animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-2 h-2 bg-teal-400 rounded-full" />
                <motion.span animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-2 h-2 bg-teal-400 rounded-full" />
                <motion.span animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-2 h-2 bg-teal-400 rounded-full" />
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} className="h-2" />
      </div>

      {/* Suggested Questions (only if short history) */}
      <AnimatePresence>
        {messages.length <= 2 && !loading && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="px-4 pb-2 flex-shrink-0"
          >
            <div className="flex overflow-x-auto pb-2 gap-2 hide-scrollbar">
              {SUGGESTED.map((s, i) => (
                <motion.button 
                  key={s} 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => sendMessage(s)}
                  className="text-xs whitespace-nowrap px-4 py-2 bg-slate-800/80 border border-slate-700 hover:border-teal-500 hover:bg-slate-700 rounded-full text-slate-300 transition-all shadow-sm"
                >
                  {s}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Area */}
      <div className="p-3 md:p-4 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 flex-shrink-0 shadow-[0_-4px_10px_rgba(0,0,0,0.1)]">
        <div className="flex items-end gap-2 max-w-4xl mx-auto">
          <div className="flex-1 relative bg-slate-800 border border-slate-700 rounded-2xl flex items-center shadow-inner overflow-hidden">
            <button onClick={toggleVoice}
              className={`p-3 transition-all flex-shrink-0 ${listening ? 'text-red-400 bg-red-400/10' : 'text-slate-400 hover:text-teal-400'}`}
              title="Voice input">
              {listening ? <MicOff size={20} className="animate-pulse" /> : <Mic size={20} />}
            </button>
            <textarea
              className="w-full bg-transparent text-white placeholder-slate-400 px-2 py-3.5 outline-none resize-none max-h-32 min-h-[50px] font-sans text-sm md:text-base"
              placeholder={listening ? "Listening..." : "Type a message..."}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              rows={1}
              disabled={loading}
            />
          </div>
          <button 
            onClick={() => sendMessage()} 
            disabled={!input.trim() || loading}
            className="w-12 h-12 bg-teal-500 hover:bg-teal-400 text-white rounded-full flex items-center justify-center flex-shrink-0 disabled:opacity-50 disabled:scale-100 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-teal-500/20"
          >
            <Send size={20} className="ml-1" />
          </button>
        </div>
      </div>
      
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
