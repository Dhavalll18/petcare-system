import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, PawPrint, Send, Lightbulb } from 'lucide-react';
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
      if (res.data.tips?.length === 0) toast('No specific tips available yet', { icon: '💡' });
    } catch { toast.error('Could not fetch tips'); }
    finally { setLoading(false); }
  };

  const selectedPetData = pets.find(p => p._id === selectedPet);

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-display font-bold text-slate-800 flex items-center gap-3">
          <Sparkles className="w-7 h-7 text-accent-500" />
          AI Health Advisor
        </h1>
        <p className="text-slate-500 mt-1">Get personalized care recommendations powered by AI.</p>
      </div>

      {/* Pet Selector */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-soft p-6 mb-8">
        <h3 className="font-display font-bold text-slate-800 mb-4">Select a Pet</h3>
        {pets.length === 0 ? (
          <p className="text-slate-500 text-sm">Add a pet first to get AI recommendations.</p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {pets.map(pet => (
              <button
                key={pet._id}
                onClick={() => setSelectedPet(pet._id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 transition-all duration-200 text-sm font-medium
                  ${selectedPet === pet._id
                    ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-md'
                    : 'border-slate-200 text-slate-600 hover:border-primary-200 hover:bg-slate-50'
                  }`}
              >
                <PawPrint className="w-4 h-4" />
                {pet.name}
                <span className="text-xs text-slate-400">({pet.species})</span>
              </button>
            ))}
          </div>
        )}

        {selectedPet && (
          <button onClick={getTips} disabled={loading} className="btn-primary mt-4 flex items-center gap-2 text-sm">
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <Send className="w-4 h-4" />
            )}
            {loading ? 'Analyzing...' : 'Get AI Recommendations'}
          </button>
        )}
      </div>

      {/* Pet Summary Card */}
      {selectedPetData && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-2xl border border-primary-100 p-6 mb-8">
          <h3 className="font-display font-bold text-slate-800 mb-3">Pet Profile Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div><p className="text-xs text-slate-500">Name</p><p className="font-semibold text-slate-800">{selectedPetData.name}</p></div>
            <div><p className="text-xs text-slate-500">Species</p><p className="font-semibold text-slate-800">{selectedPetData.species}</p></div>
            <div><p className="text-xs text-slate-500">Breed</p><p className="font-semibold text-slate-800">{selectedPetData.breed || 'Unknown'}</p></div>
            <div><p className="text-xs text-slate-500">Age</p><p className="font-semibold text-slate-800">{selectedPetData.age} years</p></div>
          </div>
          {selectedPetData.allergies?.length > 0 && (
            <div className="mt-3 pt-3 border-t border-primary-200">
              <p className="text-xs text-red-500 font-semibold">⚠️ Allergies: {selectedPetData.allergies.join(', ')}</p>
            </div>
          )}
        </motion.div>
      )}

      {/* AI Tips Results */}
      {tips.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h3 className="font-display font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            AI Recommendations for {selectedPetData?.name}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tips.map((tip, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl border border-slate-100 shadow-soft p-5 hover:shadow-card transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-sm font-bold text-primary-600">{i + 1}</span>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed">{tip}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default HealthAdvisor;
