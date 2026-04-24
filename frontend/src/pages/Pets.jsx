import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Plus, X, Trash2, Activity, AlertTriangle, ChevronRight, Info, Heart, Footprints } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';

const speciesEmoji = { Dog: '🐕', Cat: '🐈', Bird: '🦜', Fish: '🐟', Rabbit: '🐇' };

// Advanced Age Logic
const getAgeDescriptor = (age) => {
  if (age < 1) return 'Juvenile';
  if (age < 3) return 'Young Adult';
  if (age < 7) return 'Adult';
  return 'Senior';
};

const Pets = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', species: 'Dog', breed: '', age: '', weight: '', allergies: '' });

  const fetchPets = async () => {
    try { 
      const res = await api.get('/pets'); 
      setPets(Array.isArray(res.data) ? res.data : []); 
    }
    catch { 
      toast.error('Data Sync Error: Failed to fetch profiles'); 
      setPets([]);
    }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchPets(); }, []);

  const safePets = Array.isArray(pets) ? pets : [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.age) return toast.error('Identification and Age parameters are mandatory');
    setSaving(true);
    try {
      const payload = {
        ...form, age: Number(form.age), weight: form.weight ? Number(form.weight) : 0,
        allergies: form.allergies ? form.allergies.split(',').map(a => a.trim()) : [],
      };
      await api.post('/pets', payload);
      toast.success(`${form.name} Profile Successfully Initialized`);
      setForm({ name: '', species: 'Dog', breed: '', age: '', weight: '', allergies: '' });
      setShowForm(false);
      fetchPets();
    } catch { toast.error('System Failure: Protocol could not complete'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Permanently remove ${name} from the matrix?`)) return;
    try { await api.delete(`/pets/${id}`); toast.success(`${name} Profile Terminated`); fetchPets(); }
    catch { toast.error('Authorization Error: Deletion failed'); }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-fade-in pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-1">Biological Records</p>
           <h1 className="text-4xl font-display font-bold text-slate-900 tracking-tighter uppercase">
             Pet Profiles
           </h1>
           <p className="text-slate-500 font-medium mt-1">Comprehensive biological and identification data matrix</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center justify-center gap-2 px-10 py-4 text-[10px] font-bold uppercase tracking-widest rounded-2xl shadow-xl shadow-primary-500/20 active:scale-95 transition-all">
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? 'Abort Entry' : 'Add New Profile'}
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
             <form onSubmit={handleSubmit} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-elevated p-8 sm:p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl -mr-32 -mt-32"></div>
                <h3 className="text-xl font-bold text-slate-900 mb-8 tracking-tight italic uppercase relative z-10">Manual Profile Entry</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Biological Name *</label>
                    <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-slate-50 border-2 border-transparent focus:border-primary-500 focus:bg-white rounded-2xl p-4 text-sm font-bold transition-all outline-none" placeholder="e.g. Luna" />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Species Classification *</label>
                    <select value={form.species} onChange={e => setForm({...form, species: e.target.value})} className="w-full bg-slate-50 border-2 border-transparent focus:border-primary-500 focus:bg-white rounded-2xl p-4 text-sm font-bold transition-all outline-none">
                      <option>Dog</option><option>Cat</option><option>Bird</option><option>Fish</option><option>Rabbit</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Specific Breed</label>
                    <input type="text" value={form.breed} onChange={e => setForm({...form, breed: e.target.value})} className="w-full bg-slate-50 border-2 border-transparent focus:border-primary-500 focus:bg-white rounded-2xl p-4 text-sm font-bold transition-all outline-none" placeholder="e.g. Golden Retriever" />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Age Parameters (Years) *</label>
                    <input type="number" value={form.age} onChange={e => setForm({...form, age: e.target.value})} className="w-full bg-slate-50 border-2 border-transparent focus:border-primary-500 focus:bg-white rounded-2xl p-4 text-sm font-bold transition-all outline-none" placeholder="3" />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mass / Weight (kg)</label>
                    <input type="number" value={form.weight} onChange={e => setForm({...form, weight: e.target.value})} className="w-full bg-slate-50 border-2 border-transparent focus:border-primary-500 focus:bg-white rounded-2xl p-4 text-sm font-bold transition-all outline-none" placeholder="15" />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Allergens / Medical Flags</label>
                    <input type="text" value={form.allergies} onChange={e => setForm({...form, allergies: e.target.value})} className="w-full bg-slate-50 border-2 border-transparent focus:border-primary-500 focus:bg-white rounded-2xl p-4 text-sm font-bold transition-all outline-none" placeholder="Chicken, Dairy..." />
                  </div>
                </div>
                <div className="mt-10 flex gap-4 relative z-10">
                  <button type="submit" disabled={saving} className="flex-1 btn-primary py-4 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-primary-500/25 active:scale-95 transition-all">
                    {saving ? 'Transmitting...' : 'Finalize Profile'}
                  </button>
                  <button type="button" onClick={() => setShowForm(false)} className="px-10 py-4 bg-slate-50 text-slate-500 font-bold text-xs uppercase tracking-widest rounded-2xl hover:bg-slate-100 transition-all border border-slate-100">
                    Cancel
                  </button>
                </div>
             </form>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-[2.5rem] border border-slate-100 p-8">
              <div className="skeleton w-24 h-24 rounded-[2rem] mb-6"></div>
              <div className="skeleton h-6 w-32 mb-3"></div>
              <div className="skeleton h-4 w-48"></div>
            </div>
          ))}
        </div>
      ) : pets.length === 0 ? (
        <div className="text-center py-32 bg-white rounded-[3rem] border border-slate-100 shadow-soft">
          <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6">
            <Footprints className="w-10 h-10 text-slate-200" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 tracking-tight italic uppercase">Profile Matrix Empty</h3>
          <p className="text-slate-400 text-sm font-medium mt-2 max-w-xs mx-auto">No biological profiles have been initialized in the system.</p>
          <button onClick={() => setShowForm(true)} className="btn-primary mt-10 px-10 py-4 text-[10px] font-bold uppercase tracking-widest rounded-2xl shadow-xl shadow-primary-500/20">Initialize Profile</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(Array.isArray(pets) ? pets : []).map((pet, i) => (
            <motion.div key={pet._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="group relative bg-white rounded-[2.5rem] border border-slate-100 shadow-soft hover:shadow-elevated transition-all duration-500 overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                 <button onClick={() => handleDelete(pet._id, pet.name)} className="p-3 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm">
                    <Trash2 className="w-4 h-4" />
                 </button>
              </div>

              <div className="p-10 space-y-8">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-6">
                    <div className="w-24 h-24 rounded-[2.5rem] bg-slate-50 border-4 border-white shadow-xl flex items-center justify-center text-4xl group-hover:scale-105 transition-transform duration-500">
                      {speciesEmoji[pet.species] || '🐾'}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-emerald-500 border-4 border-white rounded-full flex items-center justify-center">
                       <ShieldCheck className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 tracking-tight leading-none italic uppercase">{pet.name}</h3>
                    <p className="text-[10px] font-bold text-primary-600 uppercase tracking-widest mt-2">{pet.breed || pet.species}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">Maturity</p>
                    <p className="text-sm font-bold text-slate-800">{getAgeDescriptor(pet.age)}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">Mass (kg)</p>
                    <p className="text-sm font-bold text-slate-800">{pet.weight || '--'}</p>
                  </div>
                </div>

                {pet.allergies?.length > 0 && (
                  <div className="p-5 bg-rose-50 rounded-2xl border border-rose-100 flex items-start gap-4">
                    <AlertTriangle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                    <div className="min-w-0">
                       <p className="text-[10px] font-bold text-rose-600 uppercase tracking-widest">Medical Alert</p>
                       <p className="text-xs text-rose-700 font-bold leading-relaxed mt-1 truncate">{pet.allergies.join(', ')}</p>
                    </div>
                  </div>
                )}

                <div className="pt-4 flex items-center justify-between border-t border-slate-50">
                   <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-emerald-500" />
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Vitals Active</span>
                   </div>
                   <button className="text-xs font-bold text-primary-600 uppercase tracking-widest hover:underline flex items-center gap-1">
                      Full Report <ChevronRight className="w-3.5 h-3.5" />
                   </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

const ShieldCheck = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

export default Pets;
