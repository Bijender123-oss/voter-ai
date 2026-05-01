import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, CheckCircle, Clock, ExternalLink, Calendar, Download, Share2 } from 'lucide-react';

const REGISTRATION_STEPS = [
  { id: 'form', label: 'Fill Form 6', desc: 'Complete voter registration form online', icon: '📝', done: false },
  { id: 'upload', label: 'Upload Documents', desc: 'Submit required identity & address proofs', icon: '📎', done: false },
  { id: 'verify', label: 'Verification', desc: 'ECI verifies your details', icon: '🔍', done: false },
  { id: 'epic', label: 'Get Voter ID', desc: 'Receive your EPIC card or download e-EPIC', icon: '🪪', done: false },
];

const DOCUMENTS_REQUIRED = [
  { name: 'Passport size photo', required: true },
  { name: 'Age proof (10th/DOB cert)', required: true },
  { name: 'Address proof (Ration/Aadhaar)', required: true },
  { name: 'Identity proof (PAN/Voter ID)', required: false },
];

export default function RegistrationTrackerPage() {
  const [registrationData, setRegistrationData] = useState({
    status: 'not_started',
    formNumber: '',
    referenceId: '',
    constituency: '',
    district: '',
    state: '',
    submittedDate: null,
    expectedCompletion: null,
    reminderDate: null,
  });
  const [reminderSet, setReminderSet] = useState(false);

  useEffect(() => {
    const local = localStorage.getItem('registrationData');
    if (local) {
      setRegistrationData(JSON.parse(local));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('registrationData', JSON.stringify(registrationData));
  }, [registrationData]);

  const handleStartRegistration = () => {
    const refId = 'ECI' + Date.now().toString().slice(-6);
    const expected = new Date();
    expected.setDate(expected.getDate() + 30);
    setRegistrationData({
      ...registrationData,
      status: 'in_progress',
      referenceId: refId,
      submittedDate: new Date().toISOString(),
      expectedCompletion: expected.toISOString(),
    });
  };

  const setReminder = () => {
    if (!reminderSet) {
      const reminder = new Date();
      reminder.setDate(reminder.getDate() + 25);
      setRegistrationData({
        ...registrationData,
        reminderDate: reminder.toISOString(),
      });
      setReminderSet(true);
    }
  };

  const steps = REGISTRATION_STEPS.map(step => ({
    ...step,
    done: registrationData.status === 'completed' || 
          (registrationData.status === 'in_progress' && step.id === 'form') ||
          (registrationData.status === 'in_progress' && step.id === 'upload' && registrationData.referenceId),
  }));

  if (registrationData.status === 'not_started') {
    return (
      <div className="p-4 md:p-6 overflow-y-auto h-full flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-8 max-w-md w-full text-center"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <FileText size={36} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Voter Registration Tracker</h2>
          <p className="text-slate-400 mb-6">Track your voter registration status and get important reminders</p>
          
          <div className="space-y-3 mb-6">
            {[
              'Monitor registration progress',
              'Get deadline reminders',
              'Track your reference number',
              'Download confirmation',
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-slate-300">
                <CheckCircle size={16} className="text-teal-400 shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>

          <button onClick={handleStartRegistration} className="btn-primary w-full py-3">
            Start Registration Tracking
          </button>

          <div className="mt-6 pt-4 border-t border-white/10">
            <a href="https://voters.eci.gov.in/" target="_blank" rel="noopener noreferrer"
              className="text-xs text-teal-400 hover:text-teal-300 flex items-center justify-center gap-1">
              Register directly on ECI website <ExternalLink size={12} />
            </a>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6 overflow-y-auto h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-title">Registration Tracker</h1>
          <p className="text-slate-400 mt-1">Track your voter registration progress</p>
        </div>
        {registrationData.referenceId && (
          <div className="glass-card px-3 py-1.5">
            <p className="text-xs text-slate-400">Ref: <span className="text-teal-400 font-mono">{registrationData.referenceId}</span></p>
          </div>
        )}
      </div>

      {/* Status Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-5 border-teal-500/30 bg-teal-500/5"
      >
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
            registrationData.status === 'completed' ? 'bg-emerald-500' : 'bg-teal-500 animate-pulse'
          }`}>
            {registrationData.status === 'completed' ? (
              <CheckCircle size={28} className="text-white" />
            ) : (
              <Clock size={28} className="text-white" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-white text-lg">
              {registrationData.status === 'completed' ? 'Registration Complete!' : 'Registration In Progress'}
            </h3>
            <p className="text-slate-400 text-sm">
              {registrationData.status === 'completed' 
                ? 'Your voter ID has been issued' 
                : `Expected completion by ${new Date(registrationData.expectedCompletion).toLocaleDateString('en-IN')}`}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Progress Steps */}
      <div className="space-y-4">
        {steps.map((step, idx) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`glass-card p-4 flex items-center gap-4 ${
              step.done ? 'border-teal-500/30' : 'border-white/10'
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${
              step.done ? 'bg-teal-500' : 'bg-white/10'
            }`}>
              {step.done ? <CheckCircle size={20} className="text-white" /> : step.icon}
            </div>
            <div className="flex-1">
              <p className={`font-medium ${step.done ? 'text-teal-300' : 'text-white'}`}>{step.label}</p>
              <p className="text-xs text-slate-400">{step.desc}</p>
            </div>
            {step.done && (
              <span className="text-xs bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded-full">
                Done
              </span>
            )}
          </motion.div>
        ))}
      </div>

      {/* Documents Checklist */}
      <div className="glass-card p-5">
        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
          <FileText size={18} className="text-teal-400" /> Required Documents
        </h3>
        <div className="space-y-2">
          {DOCUMENTS_REQUIRED.map((doc, i) => (
            <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-white/5">
              <span className="text-sm text-slate-300">{doc.name}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                doc.required ? 'bg-teal-500/20 text-teal-300' : 'bg-slate-500/20 text-slate-400'
              }`}>
                {doc.required ? 'Required' : 'Optional'}
              </span>
            </div>
          ))}
        </div>
        <button className="btn-secondary w-full mt-4 text-sm">
          <Download size={14} className="inline mr-1" /> Download Checklist PDF
        </button>
      </div>

      {/* Reminder Section */}
      <div className="glass-card p-5 bg-gradient-to-br from-amber-500/10 to-orange-500/5 border-amber-500/30">
        <div className="flex items-start gap-3">
          <Calendar size={20} className="text-amber-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-bold text-white mb-1">Set Registration Reminder</h3>
            <p className="text-sm text-slate-400 mb-3">
              Get notified about your registration status and important deadlines
            </p>
            {reminderSet ? (
              <p className="text-xs text-amber-300">
                Reminder set for {new Date(registrationData.reminderDate).toLocaleDateString('en-IN')}
              </p>
            ) : (
              <button onClick={setReminder} className="btn-primary text-sm py-1.5">
                Set Reminder
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-3">
        <a href="https://voters.eci.gov.in/" target="_blank" rel="noopener noreferrer"
          className="btn-secondary flex items-center justify-center gap-2 text-sm">
          <ExternalLink size={16} /> ECI Portal
        </a>
        <button className="btn-secondary flex items-center justify-center gap-2 text-sm"
          onClick={() => {
            navigator.clipboard.writeText(registrationData.referenceId || 'No reference ID');
          }}>
          <Share2 size={16} /> Share Reference
        </button>
      </div>

      {/* Reset Button */}
      <button
        onClick={() => {
          setRegistrationData({
            status: 'not_started',
            formNumber: '',
            referenceId: '',
            constituency: '',
            district: '',
            state: '',
            submittedDate: null,
            expectedCompletion: null,
            reminderDate: null,
          });
          setReminderSet(false);
        }}
        className="text-xs text-slate-500 hover:text-red-400 transition-colors"
      >
        Reset Registration Tracker
      </button>
    </div>
  );
}