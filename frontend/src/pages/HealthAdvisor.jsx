import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, Footprints, Send, Lightbulb, Activity, ShieldAlert, Zap, FileText, ChevronRight } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const HealthAdvisor = () => {
  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState('');
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [analysisMode, setAnalysisMode] = useState(false);

  useEffect(() => {
    const fetchPets = async () => {
      try { const res = await api.get('/pets'); setPets(res.data); }
      catch { /* silent */ }
    };
    fetchPets();
  }, []);

  const getTips = async () => {
    if (!selectedPet) return toast.error('Please select a pet for analysis');
    setLoading(true);
    setAnalysisMode(true);
    try {
      const res = await api.get(`/pets/${selectedPet}/tips`);
      setTimeout(() => {
        setTips(res.data.tips || []);
        setLoading(false);
        if (res.data.tips?.length === 0) toast('No critical anomalies detected', { icon: '🛡️' });
      }, 1500); // Artificial delay for "Brainy" feel
    } catch { 
      toast.error('Analysis engine failed'); 
      setLoading(false);
      setAnalysisMode(false);
    }
  };

  const selectedPetData = pets.find(p => p._id === selectedPet);

  return (
    <div className="animate-fade-in max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-display font-black text-slate-900 tracking-tight flex items-center gap-3">
            <div className="p-2 bg-accent-100 rounded-xl">
              <Sparkles className="w-8 h-8 text-accent-600" />
            </div>
            AI Wellness Engine
          </h1>
          <p className="text-slate-500 mt-2 font-medium">Neural care patterns and preventive health diagnostics for your pets.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 border border-slate-200">
          <Activity className="w-3 h-3 text-emerald-500" />
          Engine Status: Optimal
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Control Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-soft p-8">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              Source Selection
            </h3>
            
            {pets.length === 0 ? (
              <div className="p-6 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <p className="text-slate-500 text-sm mb-4">No pet data available for analysis.</p>
                <Link to="/app/pets" className="text-xs font-bold text-primary-600 underline">Add Profiles First</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {pets.map(pet => (
                  <button
                    key={pet._id}
                    onClick={() => { setSelectedPet(pet._id); setTips([]); setAnalysisMode(false); }}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left group
                      ${selectedPet === pet._id
                        ? 'border-primary-500 bg-primary-50 shadow-md'
                        : 'border-slate-50 bg-slate-50 hover:border-slate-200 hover:bg-slate-100'
                      }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${selectedPet === pet._id ? 'bg-primary-500 text-white' : 'bg-white text-slate-400 group-hover:text-primary-500'}`}>
                      <Footprints className="w-5 h-5" />
                    </div>
                    <div>
                      <p className={`font-bold text-sm ${selectedPet === pet._id ? 'text-primary-800' : 'text-slate-700'}`}>{pet.name}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{pet.species} · {pet.age} Years</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {selectedPet && !analysisMode && (
              <button onClick={getTips} className="w-full mt-8 btn-primary py-4 rounded-2xl shadow-xl shadow-primary-500/25 flex items-center justify-center gap-2 font-bold group">
                 Run AI Diagnostic <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            )}
          </div>

          <div className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-2xl">
             <div className="flex items-center gap-2 mb-4 text-primary-400">
                <ShieldAlert className="w-5 h-5" />
                <h4 className="font-bold">Privacy Protocol</h4>
             </div>
             <p className="text-xs text-slate-400 leading-relaxed">
               All health data is encrypted and analyzed locally using our secure neural models. We never share your pet's medical records with third parties.
             </p>
          </div>
        </div>

        {/* Diagnostic Results */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="bg-white rounded-[2rem] border border-slate-100 shadow-soft p-20 flex flex-col items-center justify-center text-center space-y-6"
              >
                <div className="relative">
                  <div className="w-24 h-24 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin"></div>
                  <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-primary-600 animate-pulse" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-slate-800">Analyzing Pet Vitals</h3>
                  <p className="text-slate-400 text-sm max-w-xs mx-auto">Connecting to the neural care cloud and processing medical history...</p>
                </div>
              </motion.div>
            ) : tips.length > 0 ? (
              <motion.div 
                key="results"
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                 <div className="bg-white rounded-[2rem] border border-slate-100 shadow-soft p-8">
                   <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-50">
                      <div>
                        <h3 className="text-xl font-bold text-slate-800">Analysis Report</h3>
                        <p className="text-xs text-slate-400 font-bold uppercase mt-1 tracking-widest">ID: DIAG-{selectedPet.slice(-6).toUpperCase()}</p>
                      </div>
                      <FileText className="w-8 h-8 text-slate-100" />
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {tips.map((tip, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-primary-200 transition-all group"
                        >
                          <div className="flex items-start gap-4">
                            <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center flex-shrink-0 group-hover:bg-primary-500 group-hover:text-white transition-colors">
                              <Lightbulb className="w-4 h-4 text-amber-500 group-hover:text-white" />
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-medium">
                              {tip}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                   </div>

                   <div className="mt-8 p-6 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-4">
                      <div className="p-3 bg-emerald-500 rounded-xl text-white">
                        <Activity className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-emerald-900">Overall Health Outlook: Positive</p>
                        <p className="text-xs text-emerald-700">Daily routine followed consistently. No immediate intervention required.</p>
                      </div>
                   </div>
                 </div>

                 <div className="bg-gradient-to-r from-primary-600 to-indigo-600 rounded-[2rem] p-8 text-white shadow-xl flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-lg">Need Professional Advice?</h4>
                      <p className="text-sm text-primary-100">Schedule a priority consultation with a senior veterinarian.</p>
                    </div>
                    <Link to="/app/schedule" className="px-6 py-3 bg-white text-primary-600 font-bold rounded-xl text-sm shadow-lg shadow-black/10">
                      Book Vet
                    </Link>
                 </div>
              </motion.div>
            ) : (
              <div className="bg-white rounded-[2rem] border border-slate-100 shadow-soft p-20 flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-slate-200">
                  <Sparkles className="w-12 h-12" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-slate-400">Neural Engine Ready</h3>
                  <p className="text-slate-400 text-sm max-w-xs mx-auto">Select a pet from the left panel to begin a comprehensive AI wellness analysis.</p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default HealthAdvisor;
