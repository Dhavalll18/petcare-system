import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, CalendarDays, Clock, CheckCircle2, AlertCircle, XCircle, User, Info, MapPin, Phone, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';

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
      setAppointments(apptRes.data);
      setPets(petRes.data);
    } catch { toast.error('Failed to load data'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.pet || !form.date || !form.reason) return toast.error('Please fill required fields');
    setSaving(true);
    try {
      await api.post('/appointments', form);
      toast.success('Booking Successful!', { icon: '📅' });
      setShowForm(false);
      fetchData();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to book'); }
    finally { setSaving(false); }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/appointments/${id}`, { status });
      toast.success(`Appointment ${status}`);
      fetchData();
    } catch { toast.error('Update failed'); }
  };

  const deleteAppt = async (id) => {
    if (!window.confirm('Cancel this appointment?')) return;
    try { await api.delete(`/appointments/${id}`); toast.success('Appointment Cancelled'); fetchData(); }
    catch { toast.error('Cancellation failed'); }
  };

  const statusStyles = {
    Pending: 'bg-amber-100 text-amber-700',
    Confirmed: 'bg-blue-100 text-blue-700',
    Completed: 'bg-emerald-100 text-emerald-700',
    Cancelled: 'bg-rose-100 text-rose-700',
  };

  const selectedProvider = providers.find(p => p.name === form.provider) || providers[0];

  return (
    <div className="animate-fade-in max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-display font-bold text-slate-800">Booking Center</h1>
          <p className="text-slate-500 mt-1">Professional care services for your beloved pets.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2 text-sm px-6">
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? 'Close Form' : 'New Booking'}
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <form onSubmit={handleSubmit} className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-elevated p-8">
                <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <CalendarDays className="w-5 h-5 text-primary-500" />
                  Reservation Details
                </h3>
                
                {pets.length === 0 ? (
                  <div className="p-10 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                    <p className="text-slate-500 mb-4 font-medium">You need to add a pet profile before booking a service.</p>
                    <Link to="/app/pets" className="btn-primary py-2 text-sm">Add Pet Now</Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1.5">Select Pet *</label>
                        <select value={form.pet} onChange={e => setForm({...form, pet: e.target.value})} className="select-field bg-slate-50 border-transparent focus:bg-white transition-all">
                          <option value="">Which pet is this for?</option>
                          {pets.map(p => <option key={p._id} value={p._id}>{p.name} ({p.species})</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1.5">Service Type *</label>
                        <select value={form.serviceType} onChange={e => setForm({...form, serviceType: e.target.value})} className="select-field bg-slate-50 border-transparent focus:bg-white transition-all">
                          {serviceTypes.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1.5">Choose Provider *</label>
                        <select value={form.provider} onChange={e => setForm({...form, provider: e.target.value})} className="select-field bg-slate-50 border-transparent focus:bg-white transition-all">
                          {providers.map(p => <option key={p.name} value={p.name}>{p.name} ({p.role})</option>)}
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1.5">Date *</label>
                          <input type="date" min={new Date().toISOString().split('T')[0]} value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="input-field bg-slate-50 border-transparent focus:bg-white transition-all" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1.5">Time *</label>
                          <select value={form.time} onChange={e => setForm({...form, time: e.target.value})} className="select-field bg-slate-50 border-transparent focus:bg-white transition-all">
                            {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1.5">Main Reason for Booking *</label>
                      <input type="text" value={form.reason} onChange={e => setForm({...form, reason: e.target.value})} className="input-field bg-slate-50 border-transparent focus:bg-white transition-all" placeholder="Briefly describe what your pet needs..." />
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button type="submit" disabled={saving} className="btn-primary flex-1 py-4 shadow-lg shadow-primary-500/30">
                        {saving ? 'Processing...' : 'Confirm Reservation'}
                      </button>
                      <button type="button" onClick={() => setShowForm(false)} className="px-6 py-4 rounded-xl border border-slate-200 text-slate-500 font-bold hover:bg-slate-50 transition-all">
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </form>

              {/* Provider Preview Sidebar */}
              <div className="space-y-6">
                <div className="bg-white rounded-3xl border border-slate-100 shadow-soft p-6">
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Selected Professional</h4>
                  <div className="flex items-center gap-4 mb-6">
                    <img src={selectedProvider.img} alt={selectedProvider.name} className="w-16 h-16 rounded-2xl object-cover shadow-md" />
                    <div>
                      <p className="font-bold text-slate-800 text-lg">{selectedProvider.name}</p>
                      <p className="text-sm text-primary-600 font-medium">{selectedProvider.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl mb-6">
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="font-bold text-slate-800">{selectedProvider.rating}</span>
                    </div>
                    <span className="text-xs text-slate-400 font-medium">{selectedProvider.reviews} verified reviews</span>
                  </div>
                  <div className="space-y-3 text-sm text-slate-500">
                    <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /> 2.4 miles away (Downtown)</div>
                    <div className="flex items-center gap-2"><Phone className="w-4 h-4" /> Available for messaging</div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 text-white shadow-xl">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-white/10 rounded-lg"><Info className="w-4 h-4" /></div>
                    <h4 className="font-bold">Booking Policy</h4>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Free cancellation up to 24 hours before the appointment. For emergency changes, please contact the provider directly.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-soft overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
          <h2 className="font-bold text-slate-800">Appointment History</h2>
          <div className="flex gap-2">
             <span className="text-xs font-medium text-slate-400 flex items-center gap-1"><Circle className="w-2 h-2 fill-amber-500 text-amber-500" /> Pending</span>
             <span className="text-xs font-medium text-slate-400 flex items-center gap-1"><Circle className="w-2 h-2 fill-blue-500 text-blue-500" /> Confirmed</span>
          </div>
        </div>
        
        {loading ? (
          <div className="p-8 space-y-4">{[1,2,3].map(i => <div key={i} className="skeleton h-24 rounded-2xl"></div>)}</div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <CalendarDays className="w-10 h-10 text-slate-200" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">No bookings found</h3>
            <p className="text-slate-500 mb-8 max-w-sm mx-auto">Your upcoming and past care appointments will appear here once you make your first booking.</p>
            <button onClick={() => setShowForm(true)} className="btn-primary px-10 py-3 shadow-lg shadow-primary-500/20">Book a Service</button>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {appointments.map((appt, i) => (
              <motion.div key={appt._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                className="p-6 flex flex-col md:flex-row items-start md:items-center gap-6 hover:bg-slate-50/50 transition-all group">
                <div className="w-16 h-16 rounded-2xl bg-white border border-slate-100 flex flex-col items-center justify-center shadow-soft flex-shrink-0 group-hover:border-primary-200 transition-colors">
                  <span className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">{new Date(appt.date).toLocaleString('en', { month: 'short' })}</span>
                  <span className="text-2xl font-black text-slate-800 leading-none">{new Date(appt.date).getDate()}</span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1.5">
                    <h3 className="font-bold text-slate-800 text-lg leading-none">{appt.serviceType}</h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${statusStyles[appt.status] || 'bg-slate-100 text-slate-600'}`}>
                      {appt.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
                    <span className="flex items-center gap-1.5 font-medium"><Clock className="w-3.5 h-3.5" /> {appt.time}</span>
                    <span className="flex items-center gap-1.5 font-medium text-primary-600"><PawPrint className="w-3.5 h-3.5" /> {appt.pet?.name || 'My Pet'}</span>
                    <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> {appt.provider || 'Assigned Professional'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center">
                  {appt.status === 'Pending' && (
                    <button onClick={() => updateStatus(appt._id, 'Confirmed')} className="px-4 py-2 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-xl hover:bg-emerald-600 hover:text-white transition-all">
                      Confirm
                    </button>
                  )}
                  {appt.status !== 'Completed' && appt.status !== 'Cancelled' && (
                    <button onClick={() => updateStatus(appt._id, 'Completed')} className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all" title="Mark as Completed">
                      <CheckCircle2 className="w-5 h-5" />
                    </button>
                  )}
                  <button onClick={() => deleteAppt(appt._id)} className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all" title="Cancel Booking">
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
