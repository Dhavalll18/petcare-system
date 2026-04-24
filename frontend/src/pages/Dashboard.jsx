import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Footprints, CalendarDays, ListChecks, TrendingUp, Plus, 
  ArrowRight, Sparkles, Bell, Clock, 
  ChevronRight, Settings, Activity
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import useAuthStore from '../store/authStore';

// Professional Date Formatter
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = Math.floor((date - now) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays > 1 && diffDays < 7) return `in ${diffDays} days`;
  
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
};

const Dashboard = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({ pets: 0, appointments: 0, tasks: 0 });
  const [pets, setPets] = useState([]);
  const [appointments, setAppointments] = useState([]);
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
        setStats({
          pets: petsRes.data.length,
          appointments: apptRes.data.length,
          tasks: taskRes.data.filter(t => !t.completed).length,
        });
      } catch (error) {
        console.error('Dashboard fetch error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const nextAppt = appointments.find(a => a.status === 'Pending' || a.status === 'Confirmed');

  return (
    <div className="space-y-10 pb-10">
      {/* Premium Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
             <span className="text-[10px] font-black text-primary-600 uppercase tracking-[0.3em] bg-primary-50 px-2 py-0.5 rounded-md border border-primary-100">Verified System</span>
             <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <h1 className="text-4xl font-display font-black text-slate-900 tracking-tighter">
            Dashboard<span className="text-primary-500">.</span>
          </h1>
          <p className="text-slate-400 font-medium mt-1">Hello, {user?.name}. Managing your pet ecosystem made simple.</p>
        </div>
        <div className="flex items-center gap-3">
           <button className="hidden sm:flex items-center gap-2 p-3.5 bg-white border border-slate-200 rounded-2xl text-slate-500 hover:text-primary-600 hover:shadow-soft transition-all">
              <Settings className="w-5 h-5" />
           </button>
           <button className="p-3.5 bg-white border border-slate-200 rounded-2xl text-slate-500 hover:text-primary-600 hover:shadow-soft transition-all relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-3.5 right-3.5 w-2 h-2 bg-primary-500 border-2 border-white rounded-full"></span>
           </button>
           <Link to="/app/schedule" className="btn-primary flex items-center gap-2 px-8 py-4 text-xs font-black uppercase tracking-widest rounded-[1.25rem] shadow-xl shadow-primary-500/25">
              <Plus className="w-4 h-4" /> New Booking
           </Link>
        </div>
      </div>

      {/* Hero: Central Insight */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 relative group">
           <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-indigo-600 rounded-[2.5rem] blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
           <div className="relative bg-white rounded-[2.5rem] border border-slate-100 p-8 sm:p-12 flex flex-col md:flex-row md:items-center justify-between gap-10 shadow-soft overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-primary-50 rounded-full blur-3xl -mr-32 -mt-32"></div>
              
              <div className="relative z-10 space-y-6 flex-1">
                 <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Operational Status</p>
                    <h2 className="text-3xl sm:text-4xl font-display font-black text-slate-900 leading-tight tracking-tight">
                       {nextAppt ? (
                         <>Upcoming <span className="text-primary-600">{nextAppt.serviceType}</span> for {nextAppt.pet?.name}</>
                       ) : (
                         <>Everything is <span className="text-emerald-500">Optimal</span></>
                       )}
                    </h2>
                 </div>
                 
                 {nextAppt && (
                   <div className="flex flex-wrap gap-4">
                      <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                         <CalendarDays className="w-4 h-4 text-primary-500" />
                         <span className="text-xs font-bold text-slate-700">{formatDate(nextAppt.date)}</span>
                      </div>
                      <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                         <Clock className="w-4 h-4 text-primary-500" />
                         <span className="text-xs font-bold text-slate-700">{nextAppt.time}</span>
                      </div>
                   </div>
                 )}

                 <div className="pt-2 flex gap-4">
                    <Link to="/app/schedule" className="px-8 py-3 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20">
                       Manage Hub
                    </Link>
                    <Link to="/app/health" className="px-8 py-3 border-2 border-slate-100 text-slate-900 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-slate-50 transition-all">
                       AI Scanner
                    </Link>
                 </div>
              </div>

              <div className="hidden md:block relative z-10">
                 <div className="w-48 h-48 rounded-full border-[12px] border-slate-50 flex flex-col items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-primary-500/5"></div>
                    <span className="text-4xl font-black text-slate-900 leading-none">98<span className="text-sm font-bold text-slate-400">%</span></span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Health</span>
                 </div>
              </div>
           </div>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-soft flex flex-col justify-between">
           <div>
              <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center justify-between">
                 Activity Center
                 <TrendingUp className="w-5 h-5 text-emerald-500" />
              </h3>
              <div className="space-y-6">
                 {[
                   { label: 'Registered Profiles', val: stats.pets, color: 'bg-primary-500' },
                   { label: 'Pending Bookings', val: stats.appointments, color: 'bg-amber-500' },
                   { label: 'Critical Tasks', val: stats.tasks, color: 'bg-rose-500' },
                 ].map(item => (
                   <div key={item.label} className="space-y-2">
                      <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                         <span>{item.label}</span>
                         <span className="text-slate-800">{item.val}</span>
                      </div>
                      <div className="h-1.5 bg-slate-50 rounded-full overflow-hidden">
                         <motion.div initial={{ width: 0 }} animate={{ width: `${(item.val / 10) * 100}%` }} className={`h-full ${item.color}`} />
                      </div>
                   </div>
                 ))}
              </div>
           </div>
           <Link to="/app/tasks" className="mt-8 flex items-center justify-center gap-2 text-[10px] font-black text-primary-600 uppercase tracking-[0.2em] hover:text-primary-700 transition-colors">
              Full System Diagnostics <ArrowRight className="w-4 h-4" />
           </Link>
        </div>
      </div>

      {/* Pixel-Perfect Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         {/* My Pets Grid */}
         <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between px-2">
               <h2 className="text-xl font-bold text-slate-900 tracking-tight">Active Pet Profiles</h2>
               <Link to="/app/pets" className="text-xs font-bold text-primary-600 hover:underline flex items-center gap-1">
                  View Collection <ChevronRight className="w-4 h-4" />
               </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
               {pets.length > 0 ? pets.slice(0, 4).map(pet => (
                 <div key={pet._id} className="group relative bg-white p-6 rounded-[2rem] border border-slate-100 shadow-soft hover:shadow-elevated transition-all duration-300">
                    <div className="flex items-center gap-5">
                       <div className="relative">
                          <img src={pet.avatarUrl || 'https://cdn-icons-png.flaticon.com/512/3069/3069172.png'} className="w-20 h-20 rounded-[1.75rem] object-cover bg-slate-50 border-4 border-white shadow-sm" alt="" />
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 border-4 border-white rounded-full"></div>
                       </div>
                       <div className="flex-1 min-w-0">
                          <p className="text-lg font-black text-slate-900 truncate group-hover:text-primary-600 transition-colors">{pet.name}</p>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{pet.species}</p>
                       </div>
                    </div>
                    <div className="mt-6 flex items-center gap-2 overflow-hidden">
                       <span className="px-3 py-1 bg-slate-50 text-[10px] font-black text-slate-500 uppercase tracking-tighter rounded-lg border border-slate-100">{pet.breed || 'Unique'}</span>
                       <span className="px-3 py-1 bg-emerald-50 text-[10px] font-black text-emerald-600 uppercase tracking-tighter rounded-lg border border-emerald-100">Healthy</span>
                    </div>
                 </div>
               )) : (
                 <div className="col-span-full py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100 flex flex-col items-center text-center">
                    <Footprints className="w-12 h-12 text-slate-200 mb-4" />
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Matrix Empty</p>
                    <Link to="/app/pets" className="text-primary-600 font-black text-xs uppercase tracking-widest mt-4 underline">Initialize Profile</Link>
                 </div>
               )}
            </div>
         </div>

         {/* AI & Tips */}
         <div className="space-y-8">
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary-600/20 to-transparent"></div>
               <Sparkles className="w-10 h-10 text-primary-400 mb-8" />
               <h3 className="text-2xl font-display font-black text-white leading-tight mb-4">Neural <br />Optimization</h3>
               <p className="text-slate-400 text-sm font-medium leading-relaxed mb-8 italic">
                 "Our AI engine suggests increasing the fiber content in Luna's diet based on recent activity logs. Maintain current routine."
               </p>
               <Link to="/app/health" className="w-full py-4 bg-white text-slate-900 font-black text-[10px] uppercase tracking-[0.2em] rounded-xl text-center block hover:bg-slate-50 transition-all">
                  Run Diagnostic
               </Link>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-soft">
               <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">Quick Link Hub</h3>
               <div className="space-y-4">
                  {[
                    { label: 'Service Center', path: '/app/services', icon: Heart },
                    { label: 'Booking Desk', path: '/app/schedule', icon: CalendarDays },
                    { label: 'Action List', path: '/app/tasks', icon: ListChecks },
                  ].map(link => (
                    <Link key={link.label} to={link.path} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl group hover:bg-primary-50 transition-all">
                       <div className="flex items-center gap-3">
                          <link.icon className="w-4 h-4 text-slate-400 group-hover:text-primary-600" />
                          <span className="text-sm font-bold text-slate-800 group-hover:text-primary-800">{link.label}</span>
                       </div>
                       <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 group-hover:text-primary-600 transition-all" />
                    </Link>
                  ))}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Dashboard;
