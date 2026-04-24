import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Footprints, CalendarDays, ListChecks, TrendingUp, Plus, ArrowRight, Sparkles, Bell, Clock, ShieldCheck, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import useAuthStore from '../store/authStore';

const Dashboard = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({ pets: 0, appointments: 0, tasks: 0 });
  const [pets, setPets] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [petsRes, apptRes, taskRes] = await Promise.all([
          api.get('/pets'),
          api.get('/appointments'),
          api.get('/tasks'),
        ]);
        setPets(petsRes.data);
        setAppointments(apptRes.data);
        setTasks(taskRes.data);
        setStats({
          pets: petsRes.data.length,
          appointments: apptRes.data.length,
          tasks: taskRes.data.length,
        });
      } catch (error) {
        console.error('Dashboard fetch error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statCards = [
    { label: 'Registered Pets', value: stats.pets, icon: Footprints, color: 'from-blue-500 to-indigo-600', link: '/app/pets' },
    { label: 'Upcoming Bookings', value: stats.appointments, icon: CalendarDays, color: 'from-amber-400 to-orange-500', link: '/app/schedule' },
    { label: 'Pending Tasks', value: stats.tasks, icon: ListChecks, color: 'from-emerald-400 to-teal-600', link: '/app/tasks' },
    { label: 'Overall Wellness', value: '94%', icon: ShieldCheck, color: 'from-rose-400 to-pink-600', link: '/app/health' },
  ];

  const nextAppointment = appointments.find(a => a.status === 'Confirmed' || a.status === 'Pending');

  return (
    <div className="animate-fade-in max-w-7xl mx-auto space-y-8 pb-12">
      {/* SaaS Welcome Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl lg:text-4xl font-display font-black text-slate-900 tracking-tight">
              Hello, {user?.name?.split(' ')[0]}
            </h1>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm border border-amber-200">
              <Sparkles className="w-3 h-3 fill-current" />
              Pro Member
            </div>
          </div>
          <p className="text-slate-500 font-medium">Your pet care ecosystem is healthy and up-to-date.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-primary-600 hover:shadow-soft transition-all relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full"></span>
          </button>
          <Link to="/app/services" className="btn-primary py-3.5 px-8 rounded-2xl shadow-xl shadow-primary-500/25 flex items-center gap-2 text-sm font-bold">
            <Plus className="w-4 h-4" /> Book a Service
          </Link>
        </div>
      </div>

      {/* Hero: Next Appointment & Quick Insight */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-400 mb-4 block">Next Scheduled Event</span>
              {nextAppointment ? (
                <div className="space-y-4">
                  <h2 className="text-3xl font-display font-bold leading-tight">
                    {nextAppointment.serviceType} for <span className="text-primary-400">{nextAppointment.pet?.name || 'your pet'}</span>
                  </h2>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl backdrop-blur-md">
                      <CalendarDays className="w-4 h-4 text-primary-300" />
                      <span className="text-sm font-semibold">{new Date(nextAppointment.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl backdrop-blur-md">
                      <Clock className="w-4 h-4 text-primary-300" />
                      <span className="text-sm font-semibold">{nextAppointment.time}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <h2 className="text-3xl font-display font-bold">No upcoming appointments</h2>
                  <p className="text-slate-400 max-w-sm">Stay proactive! Book a health checkup or grooming session for your pets.</p>
                </div>
              )}
            </div>
            <div className="mt-8">
              <Link to="/app/schedule" className="inline-flex items-center gap-2 text-sm font-bold text-primary-400 hover:text-primary-300 transition-colors">
                Manage Schedule <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Care Distribution Card (Simulated Chart) */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-soft">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Care Distribution</h3>
          <div className="space-y-6">
            {[
              { label: 'Nutrition', val: 85, color: 'bg-emerald-500' },
              { label: 'Activity', val: 62, color: 'bg-blue-500' },
              { label: 'Medical', val: 45, color: 'bg-amber-500' },
              { label: 'Grooming', val: 30, color: 'bg-rose-500' },
            ].map((item) => (
              <div key={item.label} className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-500 uppercase">{item.label}</span>
                  <span className="font-black text-slate-800">{item.val}%</span>
                </div>
                <div className="h-2 bg-slate-50 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${item.val}%` }}
                    className={`h-full ${item.color}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, i) => (
          <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Link to={card.link} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-soft hover:shadow-elevated transition-all group">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-3xl font-black text-slate-900">{loading ? '...' : card.value}</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">{card.label}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Pets Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-soft overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">My Pet Profiles</h2>
              <Link to="/app/pets" className="text-sm font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1">
                View Gallery <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="p-8">
              {pets.length === 0 ? (
                <div className="text-center py-10">
                   <p className="text-slate-400 font-medium mb-6">No pet profiles found in your account.</p>
                   <Link to="/app/pets" className="btn-primary py-3 px-8 text-sm inline-flex items-center gap-2">
                     <Plus className="w-4 h-4" /> Add Your Pet
                   </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pets.slice(0, 4).map((pet) => (
                    <div key={pet._id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-4 hover:bg-white hover:shadow-card transition-all cursor-pointer group">
                      <img src={pet.avatarUrl || 'https://cdn-icons-png.flaticon.com/512/3069/3069172.png'} alt={pet.name} className="w-14 h-14 rounded-2xl object-cover shadow-sm bg-white" />
                      <div className="flex-1">
                        <p className="font-bold text-slate-800 group-hover:text-primary-600 transition-colors">{pet.name}</p>
                        <p className="text-xs text-slate-500">{pet.species} · {pet.breed || 'Unique'}</p>
                      </div>
                      <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-soft p-8">
             <h2 className="text-xl font-bold text-slate-800 mb-8">System Activity</h2>
             <div className="space-y-8 relative before:absolute before:left-6 before:top-2 before:bottom-2 before:w-px before:bg-slate-100">
                {tasks.length > 0 ? (
                  tasks.slice(0, 3).map((task) => (
                    <div key={task._id} className="flex gap-6 relative z-10">
                       <div className={`w-12 h-12 rounded-2xl ${task.completed ? 'bg-emerald-50' : 'bg-blue-50'} flex items-center justify-center shadow-sm flex-shrink-0`}>
                          {task.completed ? <ShieldCheck className="w-6 h-6 text-emerald-500" /> : <Clock className="w-6 h-6 text-blue-500" />}
                       </div>
                       <div className="pt-1">
                          <p className="text-sm font-bold text-slate-800">{task.title}</p>
                          <p className="text-xs text-slate-500 mt-1">{task.completed ? 'Task was successfully finalized' : 'Task is currently awaiting attention'}</p>
                       </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-slate-400 py-10 italic">No activity logged yet.</p>
                )}
             </div>
          </div>
        </div>

        {/* Sidebar: AI + Tips */}
        <div className="space-y-8">
          <div className="bg-gradient-to-br from-primary-600 to-indigo-700 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
            <div className="relative z-10">
              <Sparkles className="w-10 h-10 mb-6 text-primary-300" />
              <h3 className="text-2xl font-display font-bold mb-4">AI Wellness <br />Insight</h3>
              <p className="text-sm text-primary-100 leading-relaxed mb-6">
                Based on your pet's recent activity, we recommend increasing hydration and scheduled playtime.
              </p>
              <Link to="/app/health" className="w-full py-3 bg-white text-primary-700 font-bold rounded-2xl text-center block text-sm hover:bg-primary-50 transition-colors">
                Run Full Analysis
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-soft">
             <h3 className="text-lg font-bold text-slate-800 mb-6">Community Tips</h3>
             <div className="space-y-4">
                {[
                  'Daily exercise reduces anxiety in large breeds.',
                  'Switch to wet food for better hydration in cats.',
                  'Regular dental checks prevent gum diseases.'
                ].map((tip, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600 font-medium leading-relaxed">
                    "{tip}"
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
