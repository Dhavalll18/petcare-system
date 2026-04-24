import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, Footprints, Send, Lightbulb, Activity, Zap, FileText, ChevronRight, Info } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const HealthAdvisor = () => {
  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState('');
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPets = async () => {
      try { const res = await api.get('/pets'); setPets(res.data); }
      catch { /* silent */ }
    };
    fetchPets();
  }, []);

  const getTips = async () => {
    if (!selectedPet) return toast.error('Select a pet first');
    setLoading(true);
    try {
      const res = await api.get(`/pets/${selectedPet}/tips`);
      setTips(res.data.tips || []);
      if (res.data.tips?.length === 0) toast('No specific suggestions found', { icon: '💡' });
    } catch { toast.error('Could not load suggestions'); }
    finally { setLoading(false); }
  };

  const selectedPetData = pets.find(p => p._id === selectedPet);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center md:text-left space-y-2">
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 flex flex-col md:flex-row items-center gap-3">
          <div className="p-2 bg-primary-100 rounded-xl">
            <Sparkles className="w-6 h-6 text-primary-600" />
          </div>
          Health Suggestions
        </h1>
        <p className="text-slate-500 font-medium">Simple, data-driven advice for your pet's daily well-being.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Selection Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-soft">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Target Profile</h3>
            <div className="space-y-2">
              {pets.map(pet => (
                <button
                  key={pet._id}
                  onClick={() => { setSelectedPet(pet._id); setTips([]); }}
                  className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all
                    ${selectedPet === pet._id 
                      ? 'bg-primary-50 text-primary-700 ring-2 ring-primary-500/20 shadow-sm' 
                      : 'text-slate-600 hover:bg-slate-50'
                    }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${selectedPet === pet._id ? 'bg-primary-500 text-white shadow-md' : 'bg-slate-100 text-slate-400'}`}>
                    <Footprints className="w-5 h-5" />
                  </div>
                  <div className="text-left overflow-hidden">
                    <p className="font-bold text-sm truncate">{pet.name}</p>
                    <p className="text-[10px] uppercase font-black text-slate-400 tracking-tight">{pet.species}</p>
                  </div>
                </button>
              ))}
              {pets.length === 0 && <p className="text-xs text-slate-400 italic">No pets found</p>}
            </div>

            {selectedPet && (
              <button onClick={getTips} disabled={loading} className="w-full mt-6 btn-primary py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2">
                 {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Zap className="w-4 h-4" />}
                 {loading ? 'Processing...' : 'Get Suggestions'}
              </button>
            )}
          </div>

          <div className="bg-slate-900 rounded-3xl p-6 text-white text-xs leading-relaxed">
             <div className="flex items-center gap-2 mb-3 text-primary-400">
                <Info className="w-4 h-4" />
                <span className="font-bold uppercase tracking-widest">Medical Disclaimer</span>
             </div>
             Suggestions are based on historical data patterns and should not replace professional veterinary advice.
          </div>
        </div>

        {/* Suggestion Results */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {tips.length > 0 ? (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <div className="flex items-center justify-between mb-4 px-2">
                   <h3 className="font-bold text-slate-800">Suggestions for {selectedPetData?.name}</h3>
                   <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-widest border border-emerald-100">Ready</span>
                </div>
                <div className="grid gap-4">
                  {tips.map((tip, i) => (
                    <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-soft flex items-start gap-4 group hover:border-primary-200 transition-all">
                       <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center flex-shrink-0 text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-all shadow-sm">
                          <Lightbulb className="w-5 h-5" />
                       </div>
                       <p className="text-slate-600 text-sm leading-relaxed font-medium pt-1">
                         {tip}
                       </p>
                    </div>
                  ))}
                </div>
                <div className="mt-8 p-6 bg-primary-50 rounded-2xl border border-primary-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                   <p className="text-sm font-bold text-primary-800 text-center sm:text-left">Need deeper medical insight?</p>
                   <Link to="/app/schedule" className="px-6 py-2.5 bg-primary-600 text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/20">
                     Book Specialist
                   </Link>
                </div>
              </motion.div>
            ) : (
              <div className="bg-white rounded-[2rem] border border-slate-100 shadow-soft p-16 text-center space-y-6 flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-200">
                  <FileText className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-slate-400">Analysis Engine Ready</h3>
                  <p className="text-slate-400 text-sm max-w-xs mx-auto">Select a pet and click 'Get Suggestions' to load personalized care advice.</p>
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
