import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, CheckCircle, Circle, Trash2, ListChecks, Utensils, Activity, Stethoscope, Heart, Scissors, Calendar, AlertCircle, Clock, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';

// Professional Date Formatter
const formatTaskDate = (dateString) => {
  if (!dateString) return 'No due date';
  const date = new Date(dateString);
  const now = new Date();
  now.setHours(0,0,0,0);
  const checkDate = new Date(date);
  checkDate.setHours(0,0,0,0);
  
  const diffTime = checkDate - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';
  if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;
  if (diffDays < 7) return `in ${diffDays} days`;
  
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
};

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ 
    title: '', 
    description: '', 
    priority: 'Medium', 
    category: 'Food', 
    pet: '',
    dueDate: new Date().toISOString().split('T')[0]
  });

  const categories = [
    { name: 'Food', icon: Utensils, color: 'text-amber-500', bg: 'bg-amber-50' },
    { name: 'Exercise', icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { name: 'Health', icon: Stethoscope, color: 'text-rose-500', bg: 'bg-rose-50' },
    { name: 'Grooming', icon: Scissors, color: 'text-pink-500', bg: 'bg-pink-50' },
    { name: 'Other', icon: Heart, color: 'text-indigo-500', bg: 'bg-indigo-50' },
  ];

  const fetchTasks = async () => {
    try { 
      const [taskRes, petRes] = await Promise.all([api.get('/tasks'), api.get('/pets')]);
      setTasks(taskRes.data);
      setPets(petRes.data);
    } catch { /* silent */ }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchTasks(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title) return toast.error('Task title is required');
    setSaving(true);
    try {
      await api.post('/tasks', form);
      toast.success('Task created successfully');
      setForm({ title: '', description: '', priority: 'Medium', category: 'Food', pet: '', dueDate: new Date().toISOString().split('T')[0] });
      setShowForm(false);
      fetchTasks();
    } catch { toast.error('System error: Failed to create task'); }
    finally { setSaving(false); }
  };

  const toggleComplete = async (task) => {
    try {
      await api.put(`/tasks/${task._id}`, { completed: !task.completed });
      if (!task.completed) toast.success('Objective Completed', { icon: '🎯' });
      fetchTasks();
    } catch { toast.error('Sync failed'); }
  };

  const deleteTask = async (id) => {
    try { await api.delete(`/tasks/${id}`); toast.success('Task Removed'); fetchTasks(); }
    catch { toast.error('Operation failed'); }
  };

  const priorityMeta = { 
    High: { color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100' },
    Medium: { color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
    Low: { color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' }
  };

  const completed = tasks.filter(t => t.completed);
  const pending = tasks.filter(t => !t.completed);
  const progress = tasks.length > 0 ? (completed.length / tasks.length) * 100 : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-fade-in pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
           <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Operational Objectives</span>
           </div>
           <h1 className="text-4xl font-display font-black text-slate-900 tracking-tighter">
             Tasks<span className="text-primary-500">.</span>
           </h1>
           <p className="text-slate-400 font-medium mt-1">Daily pet care checklist and priority management.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center justify-center gap-2 px-8 py-4 text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-primary-500/20">
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? 'Abort Entry' : 'Create New Task'}
        </button>
      </div>

      {/* Progress & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="md:col-span-2 bg-white rounded-[2rem] border border-slate-100 p-8 shadow-soft">
            <div className="flex items-center justify-between mb-4">
               <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Overall Completion Index</span>
               <span className="text-lg font-black text-primary-600">{Math.round(progress)}%</span>
            </div>
            <div className="h-3 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
               <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className="h-full bg-gradient-to-r from-primary-500 to-indigo-600" />
            </div>
         </div>
         <div className="bg-slate-900 rounded-[2rem] p-8 text-white flex items-center justify-between shadow-xl">
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Tasks</p>
               <p className="text-3xl font-black">{pending.length}</p>
            </div>
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
               <ListChecks className="w-6 h-6 text-primary-400" />
            </div>
         </div>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <form onSubmit={handleSubmit} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-elevated p-8 sm:p-12">
              <h3 className="text-xl font-black text-slate-900 mb-8 tracking-tight italic uppercase">Manual Task Entry</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Objective Title *</label>
                  <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full bg-slate-50 border-2 border-transparent focus:border-primary-500 focus:bg-white rounded-2xl p-4 text-sm font-bold transition-all outline-none" placeholder="e.g. Afternoon hydration protocol" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Target Profile</label>
                  <select value={form.pet} onChange={e => setForm({...form, pet: e.target.value})} className="w-full bg-slate-50 border-2 border-transparent focus:border-primary-500 focus:bg-white rounded-2xl p-4 text-sm font-bold transition-all outline-none">
                    <option value="">System Default</option>
                    {pets.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                  </select>
                </div>
                <div className="lg:col-span-3">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Operational Category</label>
                  <div className="grid grid-cols-5 gap-3">
                    {categories.map(cat => (
                      <button key={cat.name} type="button" onClick={() => setForm({...form, category: cat.name})}
                        className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all group ${form.category === cat.name ? 'border-primary-500 bg-primary-50 text-primary-600 shadow-lg shadow-primary-500/10' : 'border-slate-50 bg-slate-50 text-slate-400 hover:border-slate-200'}`}
                      >
                        <cat.icon className="w-6 h-6 mb-2" />
                        <span className="text-[8px] font-black uppercase tracking-tighter">{cat.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Priority Level</label>
                  <select value={form.priority} onChange={e => setForm({...form, priority: e.target.value})} className="w-full bg-slate-50 border-2 border-transparent focus:border-primary-500 focus:bg-white rounded-2xl p-4 text-sm font-bold transition-all outline-none">
                    <option>High</option><option>Medium</option><option>Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Deadline</label>
                  <input type="date" value={form.dueDate} onChange={e => setForm({...form, dueDate: e.target.value})} className="w-full bg-slate-50 border-2 border-transparent focus:border-primary-500 focus:bg-white rounded-2xl p-4 text-sm font-bold transition-all outline-none" />
                </div>
              </div>
              <div className="mt-10 flex gap-4">
                <button type="submit" disabled={saving} className="flex-1 btn-primary py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary-500/25">{saving ? 'Executing...' : 'Finalize Task'}</button>
                <button type="button" onClick={() => setShowForm(false)} className="px-10 py-4 bg-slate-50 text-slate-500 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-slate-100 transition-all border border-slate-100">Cancel</button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Task List Interface */}
      <div className="space-y-12">
        {pending.length > 0 && (
          <div className="space-y-6">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] px-2 flex items-center gap-2">
               Active Objectives
               <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
            </h3>
            <div className="grid gap-4">
              {pending.map(task => {
                const category = categories.find(c => c.name === task.category) || categories[4];
                const meta = priorityMeta[task.priority] || priorityMeta.Medium;
                return (
                  <motion.div key={task._id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="bg-white rounded-3xl border border-slate-100 p-5 flex items-center gap-6 group hover:shadow-card hover:border-primary-100 transition-all cursor-pointer relative overflow-hidden"
                  >
                    <button onClick={() => toggleComplete(task)} className="w-8 h-8 rounded-full border-2 border-slate-200 flex items-center justify-center text-transparent hover:border-primary-500 hover:text-primary-500 transition-all flex-shrink-0">
                      <CheckCircle className="w-5 h-5" />
                    </button>
                    <div className={`w-14 h-14 rounded-2xl ${category.bg} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform`}>
                      <category.icon className={`w-6 h-6 ${category.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <p className="text-base font-black text-slate-800 truncate">{task.title}</p>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${meta.bg} ${meta.color} ${meta.border}`}>{task.priority}</span>
                      </div>
                      <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">
                        <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {formatTaskDate(task.dueDate)}</span>
                        {task.pet && <span className="flex items-center gap-1.5 text-primary-600 font-black"><Footprints className="w-3.5 h-3.5" /> {task.pet.name}</span>}
                      </div>
                    </div>
                    <button onClick={() => deleteTask(task._id)} className="opacity-0 group-hover:opacity-100 p-3 text-rose-400 hover:bg-rose-50 rounded-2xl transition-all">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {completed.length > 0 && (
          <div className="space-y-6 opacity-60">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] px-2">Finalized Tasks</h3>
            <div className="grid gap-4">
              {completed.map(task => (
                <div key={task._id} className="bg-slate-50/50 rounded-3xl border border-dashed border-slate-200 p-5 flex items-center gap-6 group">
                  <div className="text-emerald-500"><CheckCircle className="w-8 h-8" /></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-bold text-slate-400 line-through truncate">{task.title}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 italic">Objective Fulfilled</p>
                  </div>
                  <button onClick={() => deleteTask(task._id)} className="opacity-0 group-hover:opacity-100 p-3 text-rose-400 hover:bg-rose-50 rounded-2xl transition-all">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {tasks.length === 0 && (
          <div className="text-center py-32 bg-white rounded-[3rem] border border-slate-100 shadow-soft">
            <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6">
              <ListChecks className="w-10 h-10 text-slate-200" />
            </div>
            <h3 className="text-xl font-black text-slate-800 tracking-tight italic uppercase">Matrix Idle</h3>
            <p className="text-slate-400 text-sm font-medium mt-2 max-w-xs mx-auto">All pet care objectives have been resolved or not yet initialized.</p>
            <button onClick={() => setShowForm(true)} className="btn-primary mt-8 px-10 py-4 text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-primary-500/20">Initialize Checklist</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;
