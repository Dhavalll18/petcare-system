import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, PawPrint, Trash2, Activity, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';

const speciesEmoji = { Dog: '🐕', Cat: '🐈', Bird: '🦜', Fish: '🐟', Rabbit: '🐇' };

const Pets = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', species: 'Dog', breed: '', age: '', weight: '', allergies: '' });

  const fetchPets = async () => {
    try { const res = await api.get('/pets'); setPets(res.data); }
    catch { toast.error('Failed to load pets'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchPets(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.age) return toast.error('Name and age are required');
    setSaving(true);
    try {
      const payload = {
        ...form, age: Number(form.age), weight: form.weight ? Number(form.weight) : 0,
        allergies: form.allergies ? form.allergies.split(',').map(a => a.trim()) : [],
      };
      await api.post('/pets', payload);
      toast.success(`${form.name} added!`);
      setForm({ name: '', species: 'Dog', breed: '', age: '', weight: '', allergies: '' });
      setShowForm(false);
      fetchPets();
    } catch { toast.error('Failed to add pet'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Remove ${name}?`)) return;
    try { await api.delete(`/pets/${id}`); toast.success(`${name} removed`); fetchPets(); }
    catch { toast.error('Failed to delete'); }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-display font-bold text-slate-800">My Pets</h1>
          <p className="text-slate-500 mt-1">Manage your pet profiles and health records.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2 text-sm">
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? 'Cancel' : 'Add Pet'}
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-8">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-100 shadow-soft p-6">
              <h3 className="font-display font-bold text-lg text-slate-800 mb-4">New Pet Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Pet Name *</label>
                  <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="input-field" placeholder="Buddy" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Species *</label>
                  <select value={form.species} onChange={e => setForm({...form, species: e.target.value})} className="select-field">
                    <option>Dog</option><option>Cat</option><option>Bird</option><option>Fish</option><option>Rabbit</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Breed</label>
                  <input type="text" value={form.breed} onChange={e => setForm({...form, breed: e.target.value})} className="input-field" placeholder="Golden Retriever" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Age (years) *</label>
                  <input type="number" value={form.age} onChange={e => setForm({...form, age: e.target.value})} className="input-field" placeholder="3" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Weight (kg)</label>
                  <input type="number" value={form.weight} onChange={e => setForm({...form, weight: e.target.value})} className="input-field" placeholder="15" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Allergies (comma-separated)</label>
                  <input type="text" value={form.allergies} onChange={e => setForm({...form, allergies: e.target.value})} className="input-field" placeholder="Chicken, Dairy" />
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <button type="submit" disabled={saving} className="btn-primary text-sm flex items-center gap-2">
                  {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Plus className="w-4 h-4" />}
                  {saving ? 'Saving...' : 'Add Pet'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary text-sm">Cancel</button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-2xl border border-slate-100 p-6">
              <div className="skeleton w-16 h-16 rounded-xl mb-4"></div>
              <div className="skeleton h-5 w-24 mb-2"></div>
              <div className="skeleton h-4 w-32"></div>
            </div>
          ))}
        </div>
      ) : pets.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <PawPrint className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">No pets yet</h3>
          <p className="text-slate-500 mb-6">Add your first pet to start tracking their health.</p>
          <button onClick={() => setShowForm(true)} className="btn-primary inline-flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Your First Pet
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pets.map((pet, i) => (
            <motion.div key={pet._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl border border-slate-100 shadow-soft hover:shadow-card transition-all duration-300 overflow-hidden group">
              <div className="h-2 bg-gradient-to-r from-primary-400 to-accent-400"></div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center text-2xl">
                      {speciesEmoji[pet.species] || '🐾'}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-lg">{pet.name}</h3>
                      <p className="text-sm text-slate-500">{pet.species} · {pet.breed || 'Unknown'}</p>
                    </div>
                  </div>
                  <button onClick={() => handleDelete(pet._id, pet.name)} className="opacity-0 group-hover:opacity-100 p-2 text-red-400 hover:bg-red-50 rounded-lg transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-slate-50 rounded-xl p-3">
                    <p className="text-xs text-slate-500 mb-0.5">Age</p>
                    <p className="text-sm font-semibold text-slate-800">{pet.age} years</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3">
                    <p className="text-xs text-slate-500 mb-0.5">Weight</p>
                    <p className="text-sm font-semibold text-slate-800">{pet.weight || '--'} kg</p>
                  </div>
                </div>
                {pet.allergies?.length > 0 && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 rounded-xl mb-3">
                    <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                    <p className="text-xs text-red-600 font-medium">Allergies: {pet.allergies.join(', ')}</p>
                  </div>
                )}
                {pet.vaccinations?.length > 0 && (
                  <div className="flex items-center gap-2 text-xs text-emerald-600">
                    <Activity className="w-3.5 h-3.5" />
                    <span>{pet.vaccinations.length} vaccination(s)</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Pets;
