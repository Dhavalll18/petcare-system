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

// Professional Date Formatter
const formatDate = (dateString) => {
  if (!dateString) return 'Pending';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'N/A';
  
  const now = new Date();
  const diffDays = Math.floor((date - now) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  
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

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-12 pb-20 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tighter mb-2">
            {user ? `Hello, ${user.name.split(' ')[0]}` : 'Dashboard'}
          </h1>
          <p className="text-slate-500 font-medium">Here is a summary of your pet management activities</p>
        </div>
        <div className="flex items-center gap-4">
           <Link to="/app/schedule" className="btn-primary flex items-center gap-3 px-8 py-4">
              <Plus className="w-4 h-4" /> New Booking
           </Link>
        </div>
      </div>

      {/* Global Metrics - Refined Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         {[
           { label: 'Active Pet Profiles', val: stats.pets, icon: Footprints, color: 'text-indigo-600', bg: 'bg-indigo-50' },
           { label: 'Upcoming Services', val: stats.appointments, icon: CalendarDays, color: 'text-blue-600', bg: 'bg-blue-50' },
           { label: 'Pending Care Tasks', val: stats.tasks, icon: ListChecks, color: 'text-emerald-600', bg: 'bg-emerald-50' },
         ].map((stat) => (
           <div key={stat.label} className="bg-white p-10 rounded-[2rem] border border-slate-100 shadow-soft group hover:border-primary-100 transition-all">
              <div className="flex items-center gap-6">
                 <div className={`w-16 h-16 rounded-2xl ${stat.bg} flex items-center justify-center transition-transform group-hover:scale-110`}>
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                 </div>
                 <div>
                    <p className="text-4xl font-bold text-slate-900">{stat.val}</p>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{stat.label}</p>
                 </div>
              </div>
           </div>
         ))}
      </div>

      {/* Main Content - Full Width Layout */}
      <div className="space-y-12">
        {/* Pet Profiles Hub */}
        <section className="space-y-8">
           <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em] block mb-2">Pet Management</span>
                <h2 className="text-3xl font-bold text-slate-900 tracking-tighter">Registered Profiles</h2>
              </div>
              <Link to="/app/pets" className="text-xs font-bold text-primary-600 uppercase tracking-widest hover:underline">View All Profiles →</Link>
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <Link to="/app/pets" className="aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center justify-center group hover:border-primary-300 hover:bg-primary-50 transition-all">
                 <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center mb-4 shadow-sm group-hover:bg-primary-600 group-hover:text-white transition-all">
                    <Plus className="w-6 h-6 text-slate-400 group-hover:text-white" />
                 </div>
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Add New Profile</span>
              </Link>
              {pets.slice(0, 3).map((pet) => (
                <div key={pet._id} className="aspect-square bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-soft hover:shadow-elevated transition-all group flex flex-col items-center text-center">
                   <img src={pet.avatarUrl || 'https://cdn-icons-png.flaticon.com/512/3069/3069172.png'} className="w-24 h-24 rounded-3xl object-cover border-4 border-slate-50 mb-6 group-hover:scale-105 transition-transform" alt="" />
                   <h3 className="text-xl font-bold text-slate-900 mb-1 truncate w-full">{pet.name}</h3>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{pet.species}</p>
                </div>
              ))}
           </div>
        </section>

        {/* Unified Timeline / Schedule Section */}
        <section className="bg-white rounded-[2.5rem] border border-slate-100 shadow-soft overflow-hidden">
           <div className="p-10 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tighter">Schedule Overview</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Upcoming events and medical appointments</p>
              </div>
              <Link to="/app/schedule" className="btn-secondary px-6 py-3">Full Calendar</Link>
           </div>
           <div className="divide-y divide-slate-50">
              {nextAppt ? (
                <div className="p-10 flex flex-col md:flex-row md:items-center gap-10 hover:bg-slate-50/50 transition-all">
                   <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-indigo-600/20">
                      <CalendarDays className="w-10 h-10" />
                   </div>
                   <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-4">
                         <h4 className="text-2xl font-bold text-slate-900">{nextAppt.serviceType}</h4>
                         <span className="px-3 py-1 bg-emerald-50 text-[10px] font-bold text-emerald-600 uppercase rounded-lg border border-emerald-100">Confirmed</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-8 text-xs font-bold text-slate-500 uppercase tracking-tighter">
                         <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-indigo-500" /> {nextAppt.time}</span>
                         <span className="flex items-center gap-2"><Footprints className="w-4 h-4 text-indigo-500" /> {nextAppt.pet?.name || 'Assigned Pet'}</span>
                         <span className="flex items-center gap-2"><CalendarDays className="w-4 h-4 text-indigo-500" /> {formatDate(nextAppt.date)}</span>
                      </div>
                   </div>
                   <Link to="/app/schedule" className="btn-secondary px-8 py-4">Manage</Link>
                </div>
              ) : (
                <div className="py-24 text-center">
                   <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em]">No upcoming appointments found</p>
                </div>
              )}
           </div>
        </section>

        {/* Quick Links / Resources */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden group">
              <div className="relative z-10">
                 <h3 className="text-2xl font-bold tracking-tighter mb-4">Health Hub</h3>
                 <p className="text-slate-400 text-sm mb-8 leading-relaxed">Access comprehensive health data and wellness insights for all your pet companions in one centralized location.</p>
                 <Link to="/app/health" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary-400 group-hover:gap-4 transition-all">Explore Hub →</Link>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-600/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
           </div>
           <div className="bg-indigo-600 rounded-[2.5rem] p-10 text-white relative overflow-hidden group">
              <div className="relative z-10">
                 <h3 className="text-2xl font-bold tracking-tighter mb-4">Service Center</h3>
                 <p className="text-indigo-100 text-sm mb-8 leading-relaxed">Find and book elite services including grooming, specialized medical care, and luxury boarding solutions.</p>
                 <Link to="/app/services" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white group-hover:gap-4 transition-all">Browse Services →</Link>
              </div>
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mb-16 blur-3xl"></div>
           </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
