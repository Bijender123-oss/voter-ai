import { useState } from 'react';
import {
  LayoutDashboard, MessageSquare, BookOpen, MapPin, FileText,
  HelpCircle, Menu, X, Vote, LogOut, ChevronRight, Globe, ClipboardList
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'chat', label: 'AI Assistant', icon: MessageSquare },
  { id: 'learn', label: 'Learn Elections', icon: BookOpen },
  { id: 'booth', label: 'Booth Locator', icon: MapPin },
  { id: 'guide', label: 'Voter Guide', icon: FileText },
  { id: 'quiz', label: 'Awareness Score', icon: HelpCircle },
  { id: 'mock-vote', label: 'Mock Voting', icon: Vote },
  { id: 'register', label: 'Registration Tracker', icon: ClipboardList },
];

function SidebarContent({ active, onNavigate, userProfile, onClose }) {
  const { logout } = useAuth();
  return (
    <>
      {/* Logo */}
      <div className="p-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl flex items-center justify-center glow flex-shrink-0">
            <Vote size={22} className="text-white" />
          </div>
          <div>
            <h1 className="font-black text-white text-lg leading-none">VoteSmart</h1>
            <p className="text-teal-400 text-xs font-medium">AI Election Assistant</p>
          </div>
        </div>
      </div>

      {/* User Profile */}
      {userProfile?.name && (
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center text-sm font-bold text-white">
              {userProfile.name[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{userProfile.name}</p>
              <p className="text-xs text-slate-400 truncate">{userProfile.state || 'India'}</p>
            </div>
            {userProfile.isFirstVoter && (
              <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full flex-shrink-0">1st</span>
            )}
          </div>
        </div>
      )}

      {/* Nav Links */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(item => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button key={item.id}
              onClick={() => { onNavigate(item.id); onClose?.(); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-teal-500/20 to-emerald-500/10 text-teal-400 border-r-2 border-teal-400'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}>
              <Icon size={18} className={isActive ? 'text-teal-400' : ''} />
              {item.label}
              {isActive && <ChevronRight size={14} className="ml-auto" />}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10 space-y-2">
        <a href="https://www.eci.gov.in/" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 text-xs text-slate-500 hover:text-teal-400 transition-colors px-2 py-1">
          <Globe size={14} /> Election Commission of India
        </a>
        <button onClick={logout}
          className="w-full flex items-center gap-2 text-xs text-slate-500 hover:text-red-400 transition-colors px-2 py-1">
          <LogOut size={14} /> Sign Out
        </button>
        <p className="text-xs text-slate-600 px-2">© 2024 VoteSmart AI · Made for India 🇮🇳</p>
      </div>
    </>
  );
}

export default function Layout({ active, onNavigate, userProfile, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-dark overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 flex-shrink-0 bg-slate-900/80 border-r border-white/10 backdrop-blur-sm">
        <SidebarContent active={active} onNavigate={onNavigate} userProfile={userProfile} />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-slate-900 border-r border-white/10 flex flex-col z-10">
            <SidebarContent active={active} onNavigate={onNavigate} userProfile={userProfile} onClose={() => setSidebarOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Top Bar */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-white/10 bg-slate-900/80 backdrop-blur-sm flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <Vote size={16} className="text-white" />
            </div>
            <span className="font-bold text-white text-sm">VoteSmart AI</span>
          </div>
          <button onClick={() => setSidebarOpen(true)} className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-all">
            <Menu size={20} />
          </button>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}
