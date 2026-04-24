import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, CalendarDays, Clock, CheckCircle2, AlertCircle, XCircle, User, Info } from 'lucide-react';
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
    { name: 'Dr. Sarah Wilson', role: 'Senior Vet', rating: '4.9' },
    { name: 'Michael Chen', role: 'Professional Groomer', rating: '4.8' },
    { name: 'Jessica Miller', role: 'Pet Trainer', rating: '5.0' },
    { name: 'David Smith', role: 'Care Specialist', rating: '4.7' },
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
      toast.success('Appointment booked!');
      setShowForm(false);
      setForm({ pet: '', serviceType: 'Veterinary Checkup', date: '', time: '10:00 AM', reason: '', notes: '' });
      fetchData();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to book'); }
    finally { setSaving(false); }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/appointments/${id}`, { status });
      toast.success(`Marked as ${status}`);
      fetchData();
    } catch { toast.error('Update failed'); }
  };

  const deleteAppt = async (id) => {
    try { await api.delete(`/appointments/${id}`); toast.success('Deleted'); fetchData(); }
    catch { toast.error('Delete failed'); }
  };

  const statusColors = {
    Pending: 'badge-warning', Confirmed: 'badge-info',
    Completed: 'badge-success', Cancelled: 'badge-danger',
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-display font-bold text-slate-800">Schedule</h1>
          <p className="text-slate-500 mt-1">Book and manage all your pet appointments.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2 text-sm">
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? 'Cancel' : 'Book Appointment'}
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-8">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-100 shadow-soft p-6">
              <h3 className="font-display font-bold text-lg text-slate-800 mb-4">New Appointment</h3>
              {pets.length === 0 ? (
                <p className="text-slate-500 text-sm">Please add a pet first before booking.</p>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Pet *</label>
                      <select value={form.pet} onChange={e => setForm({...form, pet: e.target.value})} className="select-field">
                        <option value="">Select pet...</option>
                        {pets.map(p => <option key={p._id} value={p._id}>{p.name} ({p.species})</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Service *</label>
                      <select value={form.serviceType} onChange={e => setForm({...form, serviceType: e.target.value})} className="select-field">
                        {serviceTypes.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Service Provider *</label>
                      <select value={form.provider} onChange={e => setForm({...form, provider: e.target.value})} className="select-field">
                        {providers.map(p => <option key={p.name} value={p.name}>{p.name} ({p.role})</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Date *</label>
                      <input type="date" min={new Date().toISOString().split('T')[0]} value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="input-field" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Time Slot</label>
                      <select value={form.time} onChange={e => setForm({...form, time: e.target.value})} className="select-field">
                        {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div className="lg:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Reason for Visit *</label>
                      <input type="text" value={form.reason} onChange={e => setForm({...form, reason: e.target.value})} className="input-field" placeholder="e.g. Annual vaccination or specific concern" />
                    </div>
                    <div className="lg:col-span-3">
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Additional Notes</label>
                      <textarea rows="2" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} className="input-field" placeholder="Any special instructions for the provider..." />
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-primary-50 rounded-xl border border-primary-100 flex items-start gap-3">
                    <Info className="w-5 h-5 text-primary-600 mt-0.5" />
                    <div className="text-sm text-primary-800">
                      <p className="font-bold">Booking Summary</p>
                      <p>You are booking <strong>{form.serviceType}</strong> with <strong>{form.provider}</strong> on <strong>{form.date}</strong> at <strong>{form.time}</strong>.</p>
                    </div>
                  </div>
                  <div className="mt-6 flex gap-3">
                    <button type="submit" disabled={saving} className="btn-primary text-sm">{saving ? 'Booking...' : 'Book Appointment'}</button>
                    <button type="button" onClick={() => setShowForm(false)} className="btn-secondary text-sm">Cancel</button>
                  </div>
                </>
              )}
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="skeleton h-24 rounded-2xl"></div>)}</div>
      ) : appointments.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CalendarDays className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">No appointments</h3>
          <p className="text-slate-500 mb-6">Book your first appointment to get started.</p>
          <button onClick={() => setShowForm(true)} className="btn-primary inline-flex items-center gap-2"><Plus className="w-4 h-4" /> Book Now</button>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((appt, i) => (
            <motion.div key={appt._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl border border-slate-100 shadow-soft p-5 flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-primary-50 flex flex-col items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-primary-600 uppercase">{new Date(appt.date).toLocaleString('en', { month: 'short' })}</span>
                <span className="text-lg font-bold text-primary-700">{new Date(appt.date).getDate()}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-slate-800">{appt.serviceType}</h3>
                  <span className={statusColors[appt.status] || 'badge-info'}>{appt.status}</span>
                </div>
                <p className="text-sm text-slate-500">{appt.reason} · <Clock className="w-3 h-3 inline" /> {appt.time} · Pet: {appt.pet?.name || 'N/A'}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {appt.status === 'Pending' && (
                  <button onClick={() => updateStatus(appt._id, 'Confirmed')} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg" title="Confirm">
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                )}
                {appt.status !== 'Completed' && appt.status !== 'Cancelled' && (
                  <button onClick={() => updateStatus(appt._id, 'Completed')} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="Complete">
                    <AlertCircle className="w-4 h-4" />
                  </button>
                )}
                <button onClick={() => deleteAppt(appt._id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg" title="Delete">
                  <XCircle className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Schedule;
