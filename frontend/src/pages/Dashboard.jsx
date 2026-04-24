import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Footprints, CalendarDays, ListChecks, TrendingUp, Plus, ArrowRight, Sparkles, Bell, Clock, ChevronRight, Activity, Zap, Heart, Search } from 'lucide-react';
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

  const nextAppointment = appointments.find(a => a.status === 'Confirmed' || a.status === 'Pending');

  return (
    <div className="animate-fade-in max-w-[1600px] mx-auto space-y-8 pb-12">
      {/* Dynamic Top Bar */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
           <div className="hidden sm:flex w-16 h-16 rounded-[2rem] bg-slate-900 items-center justify-center text-white shadow-2xl">
              <Zap className="w-8 h-8 text-primary-400 fill-current" />
           </div>
           <div>
              <div className="flex items-center gap-3">
                <h1 className="text-4xl font-display font-black text-slate-900 tracking-tighter italic">
                  COMMAND CENTER
                </h1>
                <div className="px-3 py-1 bg-primary-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary-600/30">
                  v2.0 PRO
                </div>
              </div>
              <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.3em] mt-1">Operational Overview for {user?.name}</p>
           </div>
        </div>

        <div className="flex items-center gap-4">
           <div className="hidden md:flex items-center gap-2 bg-white border border-slate-100 rounded-2xl px-4 py-2.5 shadow-soft focus-within:ring-2 focus-within:ring-primary-500/20 transition-all">
              <Search className="w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Search system..." className="bg-transparent border-none outline-none text-sm font-medium text-slate-600 w-48" />
           </div>
           <button className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-primary-600 hover:shadow-elevated transition-all relative group">
              <Bell className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              <span className="absolute top-3 right-3 w-2 h-2 bg-rose-500 rounded-full animate-ping"></span>
              <span className="absolute top-3 right-3 w-2 h-2 bg-rose-500 rounded-full"></span>
           </button>
           <Link to="/app/schedule" className="btn-primary py-3.5 px-8 rounded-2xl shadow-xl shadow-primary-600/30 flex items-center gap-2 text-sm font-black italic uppercase tracking-wider">
              <Activity className="w-4 h-4" /> New Dispatch
           </Link>
        </div>
      </div>

      {/* Main Grid Interface */}
      <div className="grid grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: HERO + STATS */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
           
           {/* Cyber Hero Card */}
           <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-accent-600 rounded-[3rem] blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative bg-white rounded-[3rem] p-10 border border-slate-100 shadow-soft overflow-hidden">
                 <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-br from-primary-100/50 to-accent-100/50 rounded-full blur-3xl -mr-32 -mt-32"></div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
                    <div className="space-y-6">
                       <div>
                          <span className="px-3 py-1 bg-slate-900 text-white rounded-md text-[10px] font-black uppercase tracking-widest mb-4 inline-block">System Critical</span>
                          <h2 className="text-5xl font-display font-black text-slate-900 leading-[1.1] tracking-tighter">
                             {nextAppointment ? (
                                <>Next Appointment <br />in <span className="text-primary-600">2 Days</span></>
                             ) : (
                                <>All Systems <br /><span className="text-emerald-500">Nominal</span></>
                             )}
                          </h2>
                       </div>
                       <p className="text-slate-500 font-medium leading-relaxed max-w-sm">
                          {nextAppointment 
                            ? `Your next session with ${nextAppointment.provider} is scheduled for ${new Date(nextAppointment.date).toLocaleDateString()}. Please ensure pet vitals are updated.` 
                            : 'No pending critical actions. Your pet care ecosystem is operating at peak efficiency. Consider running an AI diagnostic.'}
                       </p>
                       <div className="flex gap-4 pt-4">
                          <Link to="/app/schedule" className="px-8 py-4 bg-slate-900 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20">
                             Manage Vitals
                          </Link>
                          <Link to="/app/health" className="px-8 py-4 border-2 border-slate-100 text-slate-800 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-slate-50 transition-all">
                             Run AI Scan
                          </Link>
                       </div>
                    </div>

                    <div className="hidden md:flex flex-col justify-center items-center">
                       <div className="relative w-64 h-64">
                          <div className="absolute inset-0 border-[16px] border-slate-50 rounded-full"></div>
                          <motion.div 
                            initial={{ strokeDashoffset: 440 }}
                            animate={{ strokeDashoffset: 440 - (440 * 0.94) }}
                            className="absolute inset-0"
                          >
                             <svg className="w-full h-full -rotate-90">
                                <circle cx="128" cy="128" r="112" fill="none" stroke="currentColor" strokeWidth="16" strokeDasharray="703.7" strokeDashoffset={703.7 * (1 - 0.94)} className="text-primary-500" strokeLinecap="round" />
                             </svg>
                          </motion.div>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                             <span className="text-5xl font-black text-slate-900">94%</span>
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Health Index</span>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           {/* High-Tech Stat Cards */}
           <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { label: 'Active Profiles', val: stats.pets, icon: Footprints, color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: 'Upcoming Tasks', val: stats.tasks, icon: ListChecks, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { label: 'Live Bookings', val: stats.appointments, icon: CalendarDays, color: 'text-amber-600', bg: 'bg-amber-50' },
              ].map((stat, i) => (
                <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                  className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-soft group hover:shadow-elevated transition-all"
                >
                   <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                      <stat.icon className="w-6 h-6" />
                   </div>
                   <h4 className="text-4xl font-black text-slate-900 mb-1">{loading ? '..' : stat.val}</h4>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                </motion.div>
              ))}
           </div>

           {/* Pet Health Matrix */}
           <div className="bg-white rounded-[3rem] border border-slate-100 shadow-soft overflow-hidden">
              <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between">
                 <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                    PET HEALTH MATRIX
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                 </h3>
                 <Link to="/app/pets" className="p-2 hover:bg-slate-50 rounded-xl transition-all">
                    <ArrowRight className="w-5 h-5 text-slate-400" />
                 </Link>
              </div>
              <div className="p-10">
                 {pets.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-[2rem]">
                       <p className="text-slate-400 font-bold text-sm">NO PROFILES LOADED IN MATRIX</p>
                    </div>
                 ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       {pets.slice(0, 4).map(pet => (
                          <div key={pet._id} className="p-6 rounded-[2rem] bg-slate-50 border border-slate-100 flex items-center gap-6 hover:bg-white hover:shadow-card transition-all group">
                             <div className="relative">
                                <img src={pet.avatarUrl || 'https://cdn-icons-png.flaticon.com/512/3069/3069172.png'} className="w-20 h-20 rounded-[2rem] object-cover shadow-md bg-white border-4 border-white" alt="" />
                                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 border-4 border-slate-50 rounded-full"></div>
                             </div>
                             <div className="flex-1 min-w-0">
                                <h4 className="font-black text-slate-900 text-lg group-hover:text-primary-600 transition-colors">{pet.name}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                   <span className="px-2 py-0.5 bg-slate-200 text-slate-500 rounded text-[10px] font-black uppercase">{pet.breed || pet.species}</span>
                                   <span className="text-[10px] font-bold text-emerald-600 uppercase">Optimal</span>
                                </div>
                             </div>
                             <div className="flex flex-col items-end gap-1">
                                <span className="text-[10px] font-black text-slate-400 uppercase">Vitals</span>
                                <div className="flex gap-0.5">
                                   <div className="w-1.5 h-4 bg-emerald-400 rounded-full"></div>
                                   <div className="w-1.5 h-6 bg-emerald-400 rounded-full"></div>
                                   <div className="w-1.5 h-3 bg-emerald-400 rounded-full"></div>
                                   <div className="w-1.5 h-5 bg-emerald-400 rounded-full"></div>
                                </div>
                             </div>
                          </div>
                       ))}
                    </div>
                 )}
              </div>
           </div>
        </div>

        {/* RIGHT COLUMN: AI + ACTIVITY */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
           
           {/* Neural Interface Card */}
           <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary-600/20 to-transparent"></div>
              <div className="relative z-10 space-y-8">
                 <div className="flex items-center justify-between">
                    <Sparkles className="w-10 h-10 text-primary-400" />
                    <div className="flex gap-1">
                       <span className="w-1 h-3 bg-white/20 rounded-full animate-pulse"></span>
                       <span className="w-1 h-5 bg-white/40 rounded-full animate-pulse delay-75"></span>
                       <span className="w-1 h-2 bg-white/20 rounded-full animate-pulse delay-150"></span>
                    </div>
                 </div>
                 <div>
                    <h3 className="text-3xl font-display font-black italic tracking-tighter mb-4 leading-none">AI CORE <br />INSIGHT</h3>
                    <p className="text-slate-400 text-sm font-medium leading-relaxed">
                       Neural engine detected a 12% drop in activity for <span className="text-white">Luna</span>. Recommend increasing hydration by 200ml and checking joint flexibility.
                    </p>
                 </div>
                 <Link to="/app/health" className="w-full py-4 bg-primary-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl text-center block shadow-lg shadow-primary-600/40 hover:bg-primary-500 transition-all">
                    Initiate Diagnosis
                 </Link>
              </div>
           </div>

           {/* System Logs */}
           <div className="bg-white rounded-[3rem] border border-slate-100 shadow-soft p-10">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-8">SYSTEM LOGS</h3>
              <div className="space-y-8">
                 {tasks.length > 0 ? (
                    tasks.slice(0, 4).map((task, i) => (
                       <div key={task._id} className="flex gap-6 items-start group">
                          <div className={`w-1 h-8 rounded-full transition-colors ${task.completed ? 'bg-emerald-500' : 'bg-primary-500 group-hover:bg-primary-600'}`}></div>
                          <div>
                             <p className={`text-sm font-bold ${task.completed ? 'text-slate-400 line-through' : 'text-slate-800'}`}>{task.title}</p>
                             <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">{new Date(task.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {task.completed ? 'RESOLVED' : 'PENDING'}</p>
                          </div>
                       </div>
                    ))
                 ) : (
                    <p className="text-slate-400 text-sm font-bold uppercase tracking-widest text-center py-10 italic">No events logged</p>
                 )}
              </div>
              <Link to="/app/tasks" className="w-full mt-10 py-4 bg-slate-50 text-slate-500 font-black text-[10px] uppercase tracking-widest rounded-2xl text-center block hover:bg-slate-100 transition-all">
                 View All System Events
              </Link>
           </div>

           {/* Pro Badge */}
           <div className="bg-gradient-to-br from-amber-400 to-orange-600 rounded-[2.5rem] p-8 text-white shadow-xl flex items-center gap-6 group">
              <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0 group-hover:rotate-12 transition-transform">
                 <ShieldCheck className="w-8 h-8 text-white" />
              </div>
              <div>
                 <p className="font-black text-lg leading-none mb-1">PRO ACCOUNT</p>
                 <p className="text-xs text-white/80 font-bold uppercase tracking-tighter">Enterprise Encryption Active</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const ShieldCheck = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

export default Dashboard;
