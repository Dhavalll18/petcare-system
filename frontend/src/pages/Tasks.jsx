import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, CheckCircle, Circle, Trash2, ListChecks, Utensils, Activity, Stethoscope, Heart, Scissors, Calendar, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';

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
      const [taskRes, petRes] = await Promise.all([
        api.get('/tasks'),
        api.get('/pets')
      ]);
      setTasks(taskRes.data);
      setPets(petRes.data);
    }
    catch { /* silent */ }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchTasks(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title) return toast.error('Title is required');
    setSaving(true);
    try {
      await api.post('/tasks', form);
      toast.success('Task created!');
      setForm({ 
        title: '', 
        description: '', 
        priority: 'Medium', 
        category: 'Food', 
        pet: '',
        dueDate: new Date().toISOString().split('T')[0]
      });
      setShowForm(false);
      fetchTasks();
    } catch { toast.error('Failed to create task'); }
    finally { setSaving(false); }
  };

  const toggleComplete = async (task) => {
    try {
      await api.put(`/tasks/${task._id}`, { completed: !task.completed });
      if (!task.completed) toast.success('Great job!', { icon: '🎉' });
      fetchTasks();
    } catch { toast.error('Update failed'); }
  };

  const deleteTask = async (id) => {
    try { await api.delete(`/tasks/${id}`); toast.success('Deleted'); fetchTasks(); }
    catch { toast.error('Delete failed'); }
  };

  const priorityColor = { High: 'bg-red-100 text-red-600', Medium: 'bg-amber-100 text-amber-600', Low: 'bg-emerald-100 text-emerald-600' };
  const completed = tasks.filter(t => t.completed);
  const pending = tasks.filter(t => !t.completed);
  const progress = tasks.length > 0 ? (completed.length / tasks.length) * 100 : 0;

  return (
    <div className="animate-fade-in max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-display font-bold text-slate-800">Care Checklist</h1>
          <p className="text-slate-500 mt-1">Daily tasks to keep your pets happy and healthy.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2 text-sm">
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? 'Cancel' : 'Add New Task'}
        </button>
      </div>

      {/* Progress Bar */}
      {tasks.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-soft mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-slate-600">Daily Completion</span>
            <span className="text-sm font-bold text-primary-600">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-gradient-to-r from-primary-500 to-accent-500"
            />
          </div>
        </div>
      )}

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="mb-8">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-100 shadow-elevated p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4">New Task</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Task Title *</label>
                  <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="input-field" placeholder="e.g. Feed Luna morning meal" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Pet</label>
                  <select value={form.pet} onChange={e => setForm({...form, pet: e.target.value})} className="select-field">
                    <option value="">No specific pet</option>
                    {pets.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Category</label>
                  <div className="grid grid-cols-5 gap-2">
                    {categories.map(cat => (
                      <button 
                        key={cat.name}
                        type="button"
                        onClick={() => setForm({...form, category: cat.name})}
                        className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${form.category === cat.name ? 'border-primary-500 bg-primary-50 text-primary-600' : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200'}`}
                        title={cat.name}
                      >
                        <cat.icon className="w-5 h-5" />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Priority</label>
                  <select value={form.priority} onChange={e => setForm({...form, priority: e.target.value})} className="select-field">
                    <option>High</option><option>Medium</option><option>Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Due Date</label>
                  <input type="date" value={form.dueDate} onChange={e => setForm({...form, dueDate: e.target.value})} className="input-field" />
                </div>
                <div className="lg:col-span-3">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Notes (Optional)</label>
                  <input type="text" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="input-field" placeholder="Add some details..." />
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <button type="submit" disabled={saving} className="btn-primary text-sm px-8">{saving ? 'Saving...' : 'Create Task'}</button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary text-sm">Cancel</button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="skeleton h-20 rounded-2xl"></div>)}</div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-soft">
          <div className="w-20 h-20 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ListChecks className="w-10 h-10 text-primary-500" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">Checklist is empty</h3>
          <p className="text-slate-500 mb-6 max-w-xs mx-auto">Stay on top of your pet's needs by creating daily care tasks.</p>
          <button onClick={() => setShowForm(true)} className="btn-primary inline-flex items-center gap-2 px-8">
            <Plus className="w-4 h-4" /> Start Your Checklist
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {pending.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider">Required Today ({pending.length})</h3>
              </div>
              <div className="space-y-3">
                {pending.map(task => {
                  const category = categories.find(c => c.name === task.category) || categories[4];
                  return (
                    <motion.div key={task._id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-4 group hover:shadow-soft transition-all border-l-4"
                      style={{ borderLeftColor: task.priority === 'High' ? '#ef4444' : task.priority === 'Medium' ? '#f59e0b' : '#10b981' }}
                    >
                      <button 
                        onClick={() => toggleComplete(task)} 
                        className="w-6 h-6 rounded-full border-2 border-slate-200 flex items-center justify-center text-transparent hover:border-primary-500 hover:text-primary-500 transition-all"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <div className={`w-10 h-10 rounded-xl ${category.bg} flex items-center justify-center flex-shrink-0`}>
                        <category.icon className={`w-5 h-5 ${category.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-slate-800">{task.title}</p>
                          {task.pet && <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase">{task.pet.name}</span>}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                          {task.description && <span className="truncate">{task.description}</span>}
                          {task.dueDate && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(task.dueDate).toLocaleDateString()}</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${priorityColor[task.priority]}`}>{task.priority}</span>
                        <button onClick={() => deleteTask(task._id)} className="opacity-0 group-hover:opacity-100 p-2 text-red-400 hover:bg-red-50 rounded-xl transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {completed.length > 0 && (
            <div className="opacity-60">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Completed</h3>
              </div>
              <div className="space-y-3">
                {completed.map(task => (
                  <div key={task._id} className="bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 p-4 flex items-center gap-4 group">
                    <button onClick={() => toggleComplete(task)} className="text-emerald-500"><CheckCircle className="w-6 h-6" /></button>
                    <div className="flex-1">
                      <p className="font-medium text-slate-400 line-through">{task.title}</p>
                      <p className="text-xs text-slate-400">Completed recently</p>
                    </div>
                    <button onClick={() => deleteTask(task._id)} className="opacity-0 group-hover:opacity-100 p-2 text-red-400 hover:bg-red-50 rounded-xl transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Tasks;
