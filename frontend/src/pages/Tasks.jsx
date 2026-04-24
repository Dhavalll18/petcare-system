import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, CheckCircle, Trash2, ListChecks, Utensils, Activity, Stethoscope, Heart, Scissors, Clock, Footprints } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';

// Professional Date Formatter (Crash-Proof)
const formatTaskDate = (dateString) => {
  if (!dateString) return 'No due date';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Invalid Date';
  
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
  
  try {
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
  } catch {
    return date.toLocaleDateString();
  }
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
      setTasks(Array.isArray(taskRes.data) ? taskRes.data : []);
      setPets(Array.isArray(petRes.data) ? petRes.data : []);
    } catch { 
      toast.error('Sync failure: Could not retrieve objectives'); 
      setTasks([]);
    }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchTasks(); }, []);

  const safeTasks = Array.isArray(tasks) ? tasks : [];
  const completedTasks = safeTasks.filter(t => t.completed);
  const pendingTasks = safeTasks.filter(t => !t.completed);
  const progress = safeTasks.length > 0 ? (completedTasks.length / safeTasks.length) * 100 : 0;

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

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-fade-in pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
           <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black text-primary-600 uppercase tracking-[0.3em] bg-primary-50 px-2 py-0.5 rounded-md border border-primary-100">Task Matrix</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
           </div>
           <h1 className="text-4xl font-display font-black text-slate-900 tracking-tighter uppercase">Objectives</h1>
           <p className="text-slate-400 font-medium mt-1">Operationalize daily care and wellness routines.</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center justify-center gap-2 px-8 py-4 text-xs font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-primary-500/25">
           <Plus className="w-4 h-4" /> Initialize Task
        </button>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <div className="md:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-soft flex flex-col justify-between">
            <div>
               <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Completion Index</h3>
                  <span className="text-2xl font-black text-primary-600">{Math.round(progress)}%</span>
               </div>
               <div className="h-4 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 1 }} className="h-full bg-gradient-to-r from-primary-500 to-indigo-600" />
               </div>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-6">System Efficiency: Optimal</p>
         </div>
         <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white flex items-center justify-between shadow-xl">
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Tasks</p>
               <p className="text-3xl font-black">{pendingTasks.length}</p>
            </div>
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
               <ListChecks className="w-6 h-6 text-primary-400" />
            </div>
         </div>
      </div>

      {/* Add Task Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-[2.5rem] border-2 border-primary-100 p-8 sm:p-12 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-50 rounded-full blur-3xl -mr-32 -mt-32"></div>
            <h3 className="text-2xl font-black text-slate-900 mb-8 tracking-tight flex items-center gap-3 relative z-10">
               <Plus className="w-6 h-6 text-primary-500" />
               DEFINE OBJECTIVE
            </h3>
            <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Task Title</label>
                  <input type="text" placeholder="e.g., Morning Nutritional Load" className="input-field py-4 text-sm font-bold" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Classification</label>
                  <select className="input-field py-4 text-sm font-bold" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                    {categories.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Priority Protocol</label>
                  <select className="input-field py-4 text-sm font-bold" value={form.priority} onChange={e => setForm({...form, priority: e.target.value})}>
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Low">Low Priority</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Execution Date</label>
                  <input type="date" className="input-field py-4 text-sm font-bold" value={form.dueDate} onChange={e => setForm({...form, dueDate: e.target.value})} />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Assigned Profile</label>
                  <select className="input-field py-4 text-sm font-bold" value={form.pet} onChange={e => setForm({...form, pet: e.target.value})}>
                    <option value="">Select Pet Profile</option>
                    {pets.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                  </select>
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
        {pendingTasks.length > 0 && (
          <div className="space-y-6">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] px-2 flex items-center gap-2">
               Active Objectives
               <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
            </h3>
            <div className="grid gap-4">
              {pendingTasks.map(task => {
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

        {completedTasks.length > 0 && (
          <div className="space-y-6">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] px-2 flex items-center gap-2 opacity-50">
               Archived Success
            </h3>
            <div className="grid gap-4 opacity-60 grayscale-[0.5]">
              {completedTasks.map(task => {
                const category = categories.find(c => c.name === task.category) || categories[4];
                const meta = priorityMeta[task.priority] || priorityMeta.Medium;
                return (
                  <div key={task._id} className="bg-slate-50 rounded-3xl border border-slate-100 p-5 flex items-center gap-6">
                    <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                    <div className={`w-14 h-14 rounded-2xl ${category.bg} flex items-center justify-center`}>
                      <category.icon className={`w-6 h-6 ${category.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-black text-slate-400 line-through truncate">{task.title}</p>
                      <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">Completed via System Protocol</p>
                    </div>
                    <button onClick={() => deleteTask(task._id)} className="p-3 text-slate-300 hover:text-rose-400 transition-all">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {!loading && safeTasks.length === 0 && (
          <div className="py-32 bg-white rounded-[3rem] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-center space-y-4">
             <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-200">
                <ListChecks className="w-10 h-10" />
             </div>
             <div>
                <h3 className="text-xl font-black text-slate-900">Zero Objectives</h3>
                <p className="text-slate-400 text-sm font-medium">All systems operational. No pending tasks detected.</p>
             </div>
             <button onClick={() => setShowForm(true)} className="text-primary-600 font-black text-xs uppercase tracking-widest hover:underline">Manual Initialization</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;
