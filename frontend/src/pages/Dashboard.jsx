import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Footprints, CalendarDays, ListChecks, TrendingUp, Plus, 
  ArrowRight, Bell, Clock, Search,
  ChevronRight, Settings, Sparkles, Heart, Activity, ShieldCheck, Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import useAuthStore from '../store/authStore';

// Crash-Proof Date Formatter
const formatDate = (dateString) => {
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

const Dashboard = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({ pets: 0, appointments: 0, tasks: 0 });
  const [pets, setPets] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [petsRes, apptRes, taskRes] = await Promise.all([
          api.get('/pets'),
          api.get('/appointments'),
          api.get('/tasks'),
        ]);
        const petsData = Array.isArray(petsRes?.data) ? petsRes.data : [];
        const apptData = Array.isArray(apptRes?.data) ? apptRes.data : [];
        const taskData = Array.isArray(taskRes?.data) ? taskRes.data : [];
        
        setPets(petsData);
        setAppointments(apptData);
        setStats({
          pets: petsData.length,
          appointments: apptData.length,
          tasks: taskData.filter(t => !t.completed).length,
        });
      } catch (error) {
        console.error('Dashboard fetch error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const nextAppt = (Array.isArray(appointments) ? appointments : []).find(a => a?.status === 'Pending' || a?.status === 'Confirmed');

  return (
    <div className="max-w-[1600px] mx-auto space-y-10 pb-20 animate-fade-in">
      {/* Premium Search & Actions Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="relative group flex-1 max-w-2xl">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-500 transition-colors">
            <Search className="w-5 h-5" />
          </div>
          <input 
            type="text" 
            placeholder="Search profiles, health records, or specialists..." 
            className="w-full bg-white border border-slate-100 rounded-3xl py-5 pl-14 pr-6 text-sm font-medium shadow-soft focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-4">
           <button className="p-4 bg-white border border-slate-100 rounded-2xl text-slate-500 hover:text-primary-600 hover:shadow-elevated transition-all relative">
              <Bell className="w-6 h-6" />
              <span className="absolute top-4 right-4 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full"></span>
           </button>
           <button className="p-4 bg-white border border-slate-100 rounded-2xl text-slate-500 hover:text-primary-600 hover:shadow-elevated transition-all">
              <Settings className="w-6 h-6" />
           </button>
           <Link to="/app/schedule" className="btn-primary flex items-center gap-2 px-10 py-5 text-sm font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-primary-500/25">
              <Plus className="w-5 h-5" /> Quick Booking
           </Link>
        </div>
      </div>

      {/* Welcome Banner */}
      <div className="relative rounded-[3rem] overflow-hidden bg-slate-900 min-h-[320px] flex items-center p-8 sm:p-16 text-white group">
         <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary-600/20 to-transparent"></div>
         <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-primary-500/10 rounded-full blur-[100px]"></div>
         <div className="absolute top-10 left-10 w-2 h-2 bg-primary-400 rounded-full animate-ping"></div>
         
         <div className="relative z-10 max-w-2xl space-y-6">
            <div className="flex items-center gap-3">
               <span className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/10 rounded-lg text-[10px] font-black uppercase tracking-[0.3em] text-primary-300">
                  System Active
               </span>
               <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-display font-black tracking-tight leading-[1.1]">
               Welcome back,<br />
               <span className="bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">{user?.name?.split(' ')[0] || 'Member'}</span>
            </h1>
            <p className="text-slate-400 font-medium text-lg max-w-md leading-relaxed">
               All systems are operational. You have <span className="text-white font-bold">{stats.tasks} pending objectives</span> for today.
            </p>
         </div>

         {/* Visual Element: Floating Cards */}
         <div className="hidden xl:flex absolute right-16 top-1/2 -translate-y-1/2 flex-col gap-4 scale-90 lg:scale-100">
            <div className="bg-white/10 backdrop-blur-xl border border-white/10 p-6 rounded-3xl w-72 transform rotate-3 hover:rotate-0 transition-transform duration-500">
               <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary-500 rounded-2xl flex items-center justify-center shadow-lg">
                     <Activity className="w-6 h-6" />
                  </div>
                  <div>
                     <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Activity Level</p>
                     <p className="text-xl font-black">Optimal</p>
                  </div>
               </div>
               <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full w-4/5 bg-primary-500"></div>
               </div>
            </div>
            <div className="bg-white/10 backdrop-blur-xl border border-white/10 p-6 rounded-3xl w-72 transform -rotate-3 hover:rotate-0 transition-transform duration-500 -translate-x-8">
               <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                     <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                     <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Health Index</p>
                     <p className="text-xl font-black">98.4%</p>
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* Global Metrics Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {[
           { label: 'Active Pets', val: stats.pets, icon: Footprints, color: 'text-primary-600', bg: 'bg-primary-50', trend: '+2 this month' },
           { label: 'Pending Bookings', val: stats.appointments, icon: CalendarDays, color: 'text-amber-600', bg: 'bg-amber-50', trend: 'Next: 14:00' },
           { label: 'Critical Tasks', val: stats.tasks, icon: ListChecks, color: 'text-rose-600', bg: 'bg-rose-50', trend: '3 high priority' },
           { label: 'System Uptime', val: '99.9%', icon: Zap, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: 'All systems GO' },
         ].map((stat, i) => (
           <motion.div 
             key={stat.label}
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: i * 0.1 }}
             className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-soft hover:shadow-elevated transition-all group"
           >
              <div className="flex items-center justify-between mb-6">
                 <div className={`w-14 h-14 rounded-2xl ${stat.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <stat.icon className={`w-7 h-7 ${stat.color}`} />
                 </div>
                 <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Protocol 0{i+1}</span>
              </div>
              <p className="text-4xl font-black text-slate-900 mb-1">{stat.val}</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">{stat.label}</p>
              <div className="pt-4 border-t border-slate-50 flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.trend}</span>
              </div>
           </motion.div>
         ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
         {/* Main Content Area */}
         <div className="xl:col-span-2 space-y-10">
            {/* Horizontal Pet Selector */}
            <div className="space-y-6">
               <div className="flex items-center justify-between px-2">
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                     Live Profiles
                     <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-black text-slate-400 uppercase">{pets.length}</span>
                  </h2>
                  <Link to="/app/pets" className="text-xs font-black text-primary-600 hover:underline uppercase tracking-widest">Collection Manager →</Link>
               </div>
               <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide custom-scrollbar">
                  <Link to="/app/pets" className="flex-shrink-0 w-44 h-56 bg-white border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center group hover:border-primary-400 hover:bg-primary-50 transition-all">
                     <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4 group-hover:bg-primary-100 transition-colors">
                        <Plus className="w-6 h-6 text-slate-300 group-hover:text-primary-600" />
                     </div>
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-primary-600">Add Profile</span>
                  </Link>
                  {pets.map((pet, i) => (
                    <motion.div 
                      key={pet._id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex-shrink-0 w-44 h-56 bg-white border border-slate-100 rounded-[2.5rem] p-6 shadow-soft hover:shadow-elevated hover:-translate-y-2 transition-all group relative overflow-hidden"
                    >
                       <div className="absolute top-0 right-0 w-24 h-24 bg-primary-50 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700"></div>
                       <img src={pet.avatarUrl || 'https://cdn-icons-png.flaticon.com/512/3069/3069172.png'} className="w-20 h-20 rounded-3xl object-cover bg-slate-50 border-4 border-white shadow-md relative z-10 mb-4" alt="" />
                       <div className="relative z-10">
                          <p className="text-lg font-black text-slate-900 truncate">{pet.name}</p>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{pet.species}</p>
                       </div>
                       <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center z-10">
                          <div className="flex gap-1">
                             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-primary-600 transition-colors" />
                       </div>
                    </motion.div>
                  ))}
               </div>
            </div>

            {/* Upcoming Feed */}
            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-soft overflow-hidden">
               <div className="p-10 border-b border-slate-50 flex items-center justify-between">
                  <div>
                     <h3 className="text-xl font-black text-slate-900 tracking-tight">Timeline Hub</h3>
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Operational Queue</p>
                  </div>
                  <div className="flex items-center gap-3">
                     <span className="w-3 h-3 bg-primary-500 rounded-full animate-pulse"></span>
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Real-time Feed</span>
                  </div>
               </div>
               <div className="divide-y divide-slate-50">
                  {nextAppt ? (
                    <div className="p-10 flex flex-col md:flex-row md:items-center gap-10 group hover:bg-slate-50/50 transition-all">
                       <div className="w-20 h-20 bg-slate-900 rounded-[2rem] flex items-center justify-center text-primary-400 text-2xl font-black shadow-xl">
                          {nextAppt.serviceType?.charAt(0)}
                       </div>
                       <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-4">
                             <h4 className="text-2xl font-black text-slate-900 tracking-tight">{nextAppt.serviceType}</h4>
                             <span className="px-3 py-1 bg-primary-50 text-[10px] font-black text-primary-600 uppercase tracking-widest rounded-lg border border-primary-100">Scheduled</span>
                          </div>
                          <div className="flex flex-wrap items-center gap-8 text-xs font-bold text-slate-400 uppercase tracking-tighter">
                             <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-primary-500" /> {nextAppt.time}</span>
                             <span className="flex items-center gap-2 text-primary-600"><Footprints className="w-4 h-4" /> {nextAppt.pet?.name || 'Assigned Pet'}</span>
                             <span className="flex items-center gap-2"><CalendarDays className="w-4 h-4 text-primary-500" /> {formatDate(nextAppt.date)}</span>
                          </div>
                       </div>
                       <Link to="/app/schedule" className="px-8 py-4 bg-white border border-slate-200 rounded-2xl text-[10px] font-black text-slate-600 uppercase tracking-widest hover:bg-primary-600 hover:text-white hover:border-primary-600 transition-all">
                          Edit Reservation
                       </Link>
                    </div>
                  ) : (
                    <div className="py-24 text-center">
                       <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                          <CalendarDays className="w-10 h-10 text-slate-200" />
                       </div>
                       <p className="text-slate-400 font-black text-xs uppercase tracking-widest">No active sessions found</p>
                    </div>
                  )}
               </div>
            </div>
         </div>

         {/* Sidebar Widgets */}
         <div className="space-y-10">
            {/* Health Insights Widget */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
               <div className="relative z-10">
                  <div className="flex items-center justify-between mb-10">
                     <div className="w-14 h-14 bg-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-600/20">
                        <Activity className="w-7 h-7 text-white" />
                     </div>
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Smart Monitoring</span>
                  </div>
                  <h3 className="text-3xl font-display font-black text-white leading-tight mb-6">Health <br />Insights</h3>
                  <p className="text-slate-400 text-sm font-medium leading-relaxed mb-10">
                    "Luna's activity patterns are consistent with healthy recovery. Monitor water intake over the next 24 hours for optimal wellness."
                  </p>
                  <Link to="/app/health" className="w-full py-5 bg-white text-slate-900 font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl text-center block hover:bg-primary-50 transition-all shadow-xl">
                     View Wellness Report
                  </Link>
               </div>
            </div>

            {/* Support Hub */}
            <div className="bg-white rounded-[3rem] border border-slate-100 p-10 shadow-soft">
               <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8">Navigation Hub</h3>
               <div className="space-y-4">
                  {[
                    { label: 'Veterinary Hub', path: '/app/services', icon: Heart, color: 'text-rose-500', bg: 'bg-rose-50' },
                    { label: 'Booking Desk', path: '/app/schedule', icon: CalendarDays, color: 'text-blue-500', bg: 'bg-blue-50' },
                    { label: 'Objectives List', path: '/app/tasks', icon: ListChecks, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                  ].map(link => (
                    <Link key={link.label} to={link.path} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl group hover:bg-white hover:shadow-card hover:-translate-y-1 transition-all border border-transparent hover:border-slate-100">
                       <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl ${link.bg} flex items-center justify-center transition-transform group-hover:scale-110`}>
                             <link.icon className={`w-5 h-5 ${link.color}`} />
                          </div>
                          <span className="text-sm font-black text-slate-800 uppercase tracking-tighter">{link.label}</span>
                       </div>
                       <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-primary-600 transition-all" />
                    </Link>
                  ))}
               </div>
            </div>

            {/* Quick Tip */}
            <div className="bg-emerald-500 rounded-[2.5rem] p-8 text-white flex items-center gap-6 shadow-xl shadow-emerald-500/20">
               <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-6 h-6" />
               </div>
               <div>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">Security Verified</p>
                  <p className="text-sm font-bold">End-to-end data encryption is active.</p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Dashboard;
