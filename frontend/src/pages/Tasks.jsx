import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, X, CheckCircle, Circle, Trash2, ListChecks } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', priority: 'Medium' });

  const fetchTasks = async () => {
    try { const res = await api.get('/tasks'); setTasks(res.data); }
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
      setForm({ title: '', description: '', priority: 'Medium' });
      setShowForm(false);
      fetchTasks();
    } catch { toast.error('Failed to create task'); }
    finally { setSaving(false); }
  };

  const toggleComplete = async (task) => {
    try {
      await api.put(`/tasks/${task._id}`, { completed: !task.completed });
      fetchTasks();
    } catch { toast.error('Update failed'); }
  };

  const deleteTask = async (id) => {
    try { await api.delete(`/tasks/${id}`); toast.success('Deleted'); fetchTasks(); }
    catch { toast.error('Delete failed'); }
  };

  const priorityColor = { High: 'text-red-500', Medium: 'text-amber-500', Low: 'text-emerald-500' };
  const completed = tasks.filter(t => t.completed);
  const pending = tasks.filter(t => !t.completed);

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-display font-bold text-slate-800">Tasks</h1>
          <p className="text-slate-500 mt-1">Daily care checklist for your pets.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2 text-sm">
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? 'Cancel' : 'Add Task'}
        </button>
      </div>

      {showForm && (
        <motion.form initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-slate-100 shadow-soft p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Title *</label>
              <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="input-field" placeholder="Walk the dog" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
              <input type="text" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="input-field" placeholder="30 min walk in park" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Priority</label>
              <select value={form.priority} onChange={e => setForm({...form, priority: e.target.value})} className="select-field">
                <option>High</option><option>Medium</option><option>Low</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <button type="submit" disabled={saving} className="btn-primary text-sm">{saving ? 'Saving...' : 'Add Task'}</button>
          </div>
        </motion.form>
      )}

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="skeleton h-16 rounded-xl"></div>)}</div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ListChecks className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">No tasks yet</h3>
          <p className="text-slate-500 mb-6">Create daily care tasks for your pets.</p>
          <button onClick={() => setShowForm(true)} className="btn-primary inline-flex items-center gap-2"><Plus className="w-4 h-4" /> Add Task</button>
        </div>
      ) : (
        <div className="space-y-6">
          {pending.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Pending ({pending.length})</h3>
              <div className="space-y-2">
                {pending.map(task => (
                  <motion.div key={task._id} layout className="bg-white rounded-xl border border-slate-100 p-4 flex items-center gap-4 group hover:shadow-soft transition-all">
                    <button onClick={() => toggleComplete(task)} className="text-slate-300 hover:text-primary-500 transition-colors"><Circle className="w-5 h-5" /></button>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-800">{task.title}</p>
                      {task.description && <p className="text-sm text-slate-500 truncate">{task.description}</p>}
                    </div>
                    <span className={`text-xs font-semibold ${priorityColor[task.priority] || 'text-slate-400'}`}>{task.priority}</span>
                    <button onClick={() => deleteTask(task._id)} className="opacity-0 group-hover:opacity-100 p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
          {completed.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Completed ({completed.length})</h3>
              <div className="space-y-2">
                {completed.map(task => (
                  <div key={task._id} className="bg-slate-50 rounded-xl border border-slate-100 p-4 flex items-center gap-4 group">
                    <button onClick={() => toggleComplete(task)} className="text-emerald-500"><CheckCircle className="w-5 h-5" /></button>
                    <p className="flex-1 text-slate-400 line-through">{task.title}</p>
                    <button onClick={() => deleteTask(task._id)} className="opacity-0 group-hover:opacity-100 p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
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
