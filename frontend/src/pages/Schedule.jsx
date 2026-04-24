import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, CalendarDays, Clock, CheckCircle, XCircle, User, Info, MapPin, Phone, Star, Footprints } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';

// Professional Date Formatter (Crash-Proof)
const formatApptDate = (dateString) => {
  if (!dateString) return 'Pending Date';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Invalid Date';
  
  const now = new Date();
  const diffDays = Math.floor((date - now) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays > 1 && diffDays < 7) return `in ${diffDays} days`;
  
  try {
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
  } catch {
    return date.toLocaleDateString();
  }
};

const Schedule = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const petFromQuery = queryParams.get('petId');

  const [appointments, setAppointments] = useState([]);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ 
    pet: petFromQuery || '', 
    serviceType: 'Checkup', 
    date: new Date().toISOString().split('T')[0], 
    time: '10:00', 
    reason: '',
    provider: 'Dr. Sarah Wilson'
  });

  const providers = [
    { name: 'Dr. Sarah Wilson', role: 'Chief Veterinarian', rating: '4.9', reviews: 124, img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=100&q=80' },
    { name: 'Michael Chen', role: 'Professional Groomer', rating: '4.8', reviews: 85, img: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=100&q=80' },
    { name: 'Jessica Miller', role: 'Pet Trainer', rating: '5.0', reviews: 210, img: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=100&q=80' },
    { name: 'David Smith', role: 'Care Specialist', rating: '4.7', reviews: 56, img: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=100&q=80' },
  ];

  const fetchData = async () => {
    try {
      const [apptRes, petRes] = await Promise.all([api.get('/appointments'), api.get('/pets')]);
      setAppointments(Array.isArray(apptRes.data) ? apptRes.data : []);
      setPets(Array.isArray(petRes.data) ? petRes.data : []);
    } catch { 
      toast.error('Failed to load system data'); 
      setAppointments([]);
      setPets([]);
    }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const safeAppts = Array.isArray(appointments) ? appointments : [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.pet || !form.date || !form.reason) return toast.error('Required fields must be finalized');
    setSaving(true);
    try {
      await api.post('/appointments', form);
      toast.success('Reservation Confirmed', { icon: '📅' });
      setShowForm(false);
      fetchData();
    } catch { toast.error('Scheduling Conflict: Operation failed'); }
    finally { setSaving(false); }
  };

  const cancelAppt = async (id) => {
    try { await api.delete(`/appointments/${id}`); toast.success('Reservation Voided'); fetchData(); }
    catch { toast.error('Operation failed'); }
  };

  const selectedProvider = providers.find(p => p.name === form.provider) || providers[0];

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-fade-in pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
           <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold text-primary-600 uppercase tracking-[0.3em] bg-primary-50 px-2 py-0.5 rounded-md border border-primary-100">Booking Desk</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
           </div>
           <h1 className="text-4xl font-display font-bold text-slate-900 tracking-tighter uppercase">Reservations</h1>
           <p className="text-slate-400 font-medium mt-1">Manage specialist visits and care sessions.</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center justify-center gap-2 px-8 py-4 text-xs font-bold uppercase tracking-widest rounded-2xl shadow-xl shadow-primary-500/25">
           <Plus className="w-4 h-4" /> New Reservation
        </button>
      </div>

      {/* Booking Form Interface */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-[2.5rem] border border-slate-100 p-8 sm:p-12 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl -mr-32 -mt-32"></div>
            
            <h3 className="text-xl font-bold text-slate-900 mb-10 tracking-tight flex items-center gap-3 relative z-10 italic">
              <CalendarDays className="w-6 h-6 text-primary-500 not-italic" />
              RESERVATION PARAMETERS
            </h3>
            
            <form onSubmit={handleSubmit} className="relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Subject Profile</label>
                    <select className="input-field py-4 text-sm font-bold" value={form.pet} onChange={e => setForm({...form, pet: e.target.value})}>
                      <option value="">Select Pet</option>
                      {pets.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Timeline</label>
                      <input type="date" className="input-field py-4 text-sm font-bold" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Window</label>
                      <input type="time" className="input-field py-4 text-sm font-bold" value={form.time} onChange={e => setForm({...form, time: e.target.value})} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Service Classification</label>
                    <select className="input-field py-4 text-sm font-bold" value={form.serviceType} onChange={e => setForm({...form, serviceType: e.target.value})}>
                      <option value="Checkup">Veterinary Checkup</option>
                      <option value="Grooming">Professional Grooming</option>
                      <option value="Training">Behavioral Training</option>
                      <option value="Boarding">Facility Boarding</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Assigned Specialist</label>
                    <div className="grid grid-cols-2 gap-3">
                      {providers.map(p => (
                        <button key={p.name} type="button" onClick={() => setForm({...form, provider: p.name})}
                          className={`p-4 rounded-2xl border-2 transition-all text-left relative overflow-hidden group
                            ${form.provider === p.name ? 'border-primary-500 bg-primary-50' : 'border-slate-100 hover:border-slate-200'}`}
                        >
                          <div className="flex items-center gap-3">
                            <img src={p.img} className="w-8 h-8 rounded-full object-cover" alt="" />
                            <div className="min-w-0">
                               <p className="text-[10px] font-bold text-slate-900 truncate">{p.name}</p>
                               <p className="text-[8px] font-bold text-slate-400 uppercase truncate">{p.role}</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-6">
                    <img src={selectedProvider.img} className="w-16 h-16 rounded-2xl object-cover shadow-lg" alt="" />
                    <div className="flex-1">
                       <div className="flex items-center gap-1 text-amber-500 mb-1">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span className="text-sm font-bold text-slate-800">{selectedProvider.rating}</span>
                       </div>
                       <p className="text-[8px] font-bold text-slate-400 uppercase">Rating Index</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                       <p className="text-sm font-bold text-slate-800 mb-1">{selectedProvider.reviews}</p>
                       <p className="text-[8px] font-bold text-slate-400 uppercase">Verifications</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-12 flex flex-col md:flex-row gap-4 pt-8 border-t border-slate-100">
                <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden flex-1">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/20 rounded-full blur-2xl"></div>
                  <div className="flex items-center gap-2 mb-4">
                    <Info className="w-5 h-5 text-primary-400" />
                    <h4 className="font-bold text-xs uppercase tracking-widest">Service Protocol</h4>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                    Nullification of dispatch is permitted up to 24 hours prior to execution. Emergency deviations require direct verbal confirmation.
                  </p>
                </div>
                <div className="flex flex-col gap-3 min-w-[300px]">
                  <button type="submit" disabled={saving} className="btn-primary py-5 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-primary-500/25">
                    {saving ? 'Processing...' : 'Confirm Reservation'}
                  </button>
                  <button type="button" onClick={() => setShowForm(false)} className="py-5 bg-slate-50 text-slate-500 font-bold text-xs uppercase tracking-widest rounded-2xl hover:bg-slate-100 transition-all border border-slate-100 text-center">
                    Abort
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Appointment Feed */}
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-soft overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
           <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Reservation Log</h3>
           <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Active Feed</span>
           </div>
        </div>

        {safeAppts.length === 0 ? (
          <div className="py-32 text-center flex flex-col items-center">
             <CalendarDays className="w-12 h-12 text-slate-100 mb-4" />
             <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">No Active Sessions</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {safeAppts.map((appt, i) => (
              <motion.div key={appt._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                className="p-8 flex flex-col md:flex-row items-start md:items-center gap-8 hover:bg-slate-50/50 transition-all group relative"
              >
                <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-primary-400 font-bold text-xl shadow-xl flex-shrink-0">
                  {appt.serviceType?.charAt(0)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">{appt.serviceType}</h3>
                    <span className={`px-2.5 py-1 rounded-lg text-[8px] font-bold uppercase tracking-widest border
                      ${appt.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                      {appt.status || 'Active'}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-6 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                    <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-primary-400" /> {appt.time}</span>
                    <span className="flex items-center gap-2 text-primary-600"><Footprints className="w-4 h-4" /> {appt.pet?.name || 'System Pet'}</span>
                    <span className="flex items-center gap-2"><User className="w-4 h-4 text-primary-400" /> {appt.provider || 'Assigned Professional'}</span>
                    <span className="flex items-center gap-2"><CalendarDays className="w-4 h-4 text-primary-400" /> {formatApptDate(appt.date)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button onClick={() => cancelAppt(appt._id)} className="p-4 text-rose-400 hover:bg-rose-50 rounded-2xl transition-all">
                      <XCircle className="w-5 h-5" />
                   </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Schedule;
