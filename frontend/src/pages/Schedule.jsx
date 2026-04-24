import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, CalendarDays, Clock, CheckCircle, XCircle, User, Info, MapPin, Phone, Star, Footprints } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';

// Professional Date Formatter
const formatApptDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  now.setHours(0,0,0,0);
  const checkDate = new Date(date);
  checkDate.setHours(0,0,0,0);
  
  const diffTime = checkDate - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays > 1 && diffDays < 7) return `in ${diffDays} days`;
  
  return new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).format(date);
};

const Schedule = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialService = queryParams.get('service') || 'Veterinary Checkup';

  const [appointments, setAppointments] = useState([]);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(initialService !== 'Veterinary Checkup' || queryParams.get('open') === 'true');
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ 
    pet: '', 
    serviceType: initialService, 
    date: new Date().toISOString().split('T')[0], 
    time: '10:00 AM', 
    reason: initialService !== 'Veterinary Checkup' ? `Booking for ${initialService}` : '', 
    notes: '',
    provider: 'Dr. Sarah Wilson'
  });

  const timeSlots = ['09:00 AM','10:00 AM','11:00 AM','12:00 PM','02:00 PM','03:00 PM','04:00 PM','05:00 PM'];
  const serviceTypes = ['Veterinary Checkup','Grooming','Boarding','Training','Dog Walking','Pet Daycare','Other'];
  const providers = [
    { name: 'Dr. Sarah Wilson', role: 'Senior Vet', rating: '4.9', reviews: 128, img: 'https://images.unsplash.com/photo-1559839734-2b71f1536783?auto=format&fit=crop&w=100&q=80' },
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
    } catch (err) { toast.error(err.response?.data?.message || 'Transaction failed'); }
    finally { setSaving(false); }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/appointments/${id}`, { status });
      toast.success(`Booking status updated to ${status}`);
      fetchData();
    } catch { toast.error('Sync error'); }
  };

  const deleteAppt = async (id) => {
    if (!window.confirm('Cancel this operational booking?')) return;
    try { await api.delete(`/appointments/${id}`); toast.success('Booking Nullified'); fetchData(); }
    catch { toast.error('Cancellation failed'); }
  };

  const statusStyles = {
    Pending: 'bg-amber-100 text-amber-700 border-amber-200',
    Confirmed: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    Completed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    Cancelled: 'bg-rose-100 text-rose-700 border-rose-200',
  };

  const selectedProvider = providers.find(p => p.name === form.provider) || providers[0];

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20 animate-fade-in">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">Service Dispatch</p>
          <h1 className="text-4xl font-display font-black text-slate-900 tracking-tighter italic">
            BOOKING DESK<span className="text-primary-500 not-italic">.</span>
          </h1>
          <p className="text-slate-400 font-medium mt-1">Professional scheduling and resource allocation hub.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center justify-center gap-2 px-10 py-4 text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-primary-500/20 transition-all active:scale-95">
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? 'Abort Dispatch' : 'New Dispatch'}
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <form onSubmit={handleSubmit} className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 shadow-elevated p-8 sm:p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl -mr-32 -mt-32"></div>
                
                <h3 className="text-xl font-black text-slate-900 mb-10 tracking-tight flex items-center gap-3 relative z-10 italic">
                  <CalendarDays className="w-6 h-6 text-primary-500 not-italic" />
                  RESERVATION PARAMETERS
                </h3>
                
                <div className="space-y-8 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Target Pet *</label>
                      <select value={form.pet} onChange={e => setForm({...form, pet: e.target.value})} className="w-full bg-slate-50 border-2 border-transparent focus:border-primary-500 focus:bg-white rounded-2xl p-4 text-sm font-bold transition-all outline-none appearance-none">
                        <option value="">Operational target...</option>
                        {pets.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Service Classification *</label>
                      <select value={form.serviceType} onChange={e => setForm({...form, serviceType: e.target.value})} className="w-full bg-slate-50 border-2 border-transparent focus:border-primary-500 focus:bg-white rounded-2xl p-4 text-sm font-bold transition-all outline-none">
                        {serviceTypes.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Designated Professional *</label>
                      <select value={form.provider} onChange={e => setForm({...form, provider: e.target.value})} className="w-full bg-slate-50 border-2 border-transparent focus:border-primary-500 focus:bg-white rounded-2xl p-4 text-sm font-bold transition-all outline-none">
                        {providers.map(p => <option key={p.name} value={p.name}>{p.name} ({p.role})</option>)}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Dispatch Date *</label>
                        <input type="date" min={new Date().toISOString().split('T')[0]} value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="w-full bg-slate-50 border-2 border-transparent focus:border-primary-500 focus:bg-white rounded-2xl p-4 text-sm font-bold transition-all outline-none" />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Window *</label>
                        <select value={form.time} onChange={e => setForm({...form, time: e.target.value})} className="w-full bg-slate-50 border-2 border-transparent focus:border-primary-500 focus:bg-white rounded-2xl p-4 text-sm font-bold transition-all outline-none">
                          {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Primary Objective *</label>
                    <input type="text" value={form.reason} onChange={e => setForm({...form, reason: e.target.value})} className="w-full bg-slate-50 border-2 border-transparent focus:border-primary-500 focus:bg-white rounded-2xl p-4 text-sm font-bold transition-all outline-none" placeholder="Briefly describe the clinical or care requirement..." />
                  </div>

                  <div className="flex gap-4 pt-6">
                    <button type="submit" disabled={saving} className="flex-1 btn-primary py-5 rounded-[1.25rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-primary-500/25 active:scale-95 transition-all">
                      {saving ? 'Transmitting...' : 'Finalize Reservation'}
                    </button>
                    <button type="button" onClick={() => setShowForm(false)} className="px-10 py-5 bg-slate-50 text-slate-500 font-black text-xs uppercase tracking-widest rounded-[1.25rem] hover:bg-slate-100 transition-all border border-slate-100">
                      Abort
                    </button>
                  </div>
                </div>
              </form>

              {/* Professional Insight Sidebar */}
              <div className="space-y-8">
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-soft p-8 text-center sm:text-left">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Assigned Resource</h4>
                  <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
                    <img src={selectedProvider.img} alt="" className="w-24 h-24 rounded-[2rem] object-cover shadow-xl border-4 border-white ring-1 ring-slate-100" />
                    <div className="text-center sm:text-left">
                      <p className="font-black text-slate-900 text-xl leading-tight">{selectedProvider.name}</p>
                      <p className="text-xs text-primary-600 font-bold uppercase mt-1 tracking-tighter">{selectedProvider.role}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-8">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                       <div className="flex items-center gap-1 text-amber-500 mb-1">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span className="text-sm font-black text-slate-800">{selectedProvider.rating}</span>
                       </div>
                       <p className="text-[8px] font-black text-slate-400 uppercase">Rating Index</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                       <p className="text-sm font-black text-slate-800 mb-1">{selectedProvider.reviews}</p>
                       <p className="text-[8px] font-black text-slate-400 uppercase">Verifications</p>
                    </div>
                  </div>
                  <div className="space-y-4 text-[10px] font-bold text-slate-500">
                    <div className="flex items-center gap-3"><MapPin className="w-4 h-4 text-primary-400" /> Operational in Downtown Area</div>
                    <div className="flex items-center gap-3"><Phone className="w-4 h-4 text-primary-400" /> Real-time comms active</div>
                  </div>
                </div>

                <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/20 rounded-full blur-2xl"></div>
                  <div className="flex items-center gap-2 mb-4">
                    <Info className="w-5 h-5 text-primary-400" />
                    <h4 className="font-black text-xs uppercase tracking-widest">Service Protocol</h4>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                    Nullification of dispatch is permitted up to 24 hours prior to execution. Emergency deviations require direct verbal confirmation.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dispatch History Grid */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-soft overflow-hidden">
        <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
          <h2 className="text-lg font-black text-slate-900 tracking-tight italic uppercase">Dispatch Log History</h2>
          <div className="hidden sm:flex items-center gap-4">
             <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-amber-500"></div><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pending</span></div>
             <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-indigo-500"></div><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Confirmed</span></div>
          </div>
        </div>
        
        {loading ? (
          <div className="p-10 space-y-4">{[1,2,3].map(i => <div key={i} className="skeleton h-24 rounded-3xl"></div>)}</div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-32">
            <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6">
              <CalendarDays className="w-10 h-10 text-slate-200" />
            </div>
            <h3 className="text-xl font-black text-slate-800 tracking-tight italic uppercase">Log is Null</h3>
            <p className="text-slate-400 text-sm font-medium mt-2 max-w-xs mx-auto">No previous or upcoming dispatches found in the system matrix.</p>
            <button onClick={() => setShowForm(true)} className="btn-primary mt-10 px-10 py-4 text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-primary-500/20">Initialize Dispatch</button>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {safeAppts.map((appt, i) => (
              <motion.div key={appt._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                className="p-8 flex flex-col md:flex-row items-start md:items-center gap-8 hover:bg-slate-50/50 transition-all group relative"
              >
                <div className="w-20 h-20 rounded-[2rem] bg-white border border-slate-100 flex flex-col items-center justify-center shadow-soft flex-shrink-0 group-hover:border-primary-200 transition-colors border-l-4" style={{ borderLeftColor: i % 2 === 0 ? '#6366f1' : '#f59e0b' }}>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{new Date(appt.date).toLocaleString('en', { month: 'short' })}</span>
                  <span className="text-3xl font-black text-slate-900 leading-none">{new Date(appt.date).getDate()}</span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h3 className="font-black text-slate-900 text-xl tracking-tight leading-none italic uppercase">{appt.serviceType}</h3>
                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] border ${statusStyles[appt.status] || 'bg-slate-100 text-slate-600'}`}>
                      {appt.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
                    <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-primary-400" /> {appt.time}</span>
                    <span className="flex items-center gap-2 text-primary-600"><Footprints className="w-4 h-4" /> {appt.pet?.name || 'System Pet'}</span>
                    <span className="flex items-center gap-2"><User className="w-4 h-4 text-primary-400" /> {appt.provider || 'Assigned Professional'}</span>
                    <span className="flex items-center gap-2"><CalendarDays className="w-4 h-4 text-primary-400" /> {formatApptDate(appt.date)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end md:self-center">
                  {appt.status === 'Pending' && (
                    <button onClick={() => updateStatus(appt._id, 'Confirmed')} className="px-6 py-2.5 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm">
                      Validate
                    </button>
                  )}
                  {appt.status !== 'Completed' && appt.status !== 'Cancelled' && (
                    <button onClick={() => updateStatus(appt._id, 'Completed')} className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all" title="Mark as Fulfilled">
                      <CheckCircle className="w-6 h-6" />
                    </button>
                  )}
                  <button onClick={() => deleteAppt(appt._id)} className="p-3 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all" title="Nullify Log">
                    <XCircle className="w-6 h-6" />
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
