import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Footprints, CalendarDays, ListChecks, TrendingUp, Plus, ArrowRight, Sparkles, Bell, Clock, ChevronRight, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import useAuthStore from '../store/authStore';

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">
            Welcome back, {user?.name?.split(' ')[0]}
          </h1>
          <p className="text-slate-500 text-sm sm:text-base mt-1">Here's what's happening with your pets today.</p>
        </div>
        <div className="flex items-center gap-3">
           <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary-500 border-2 border-white rounded-full"></span>
           </button>
           <Link to="/app/schedule" className="btn-primary flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-xl shadow-lg shadow-primary-500/20">
              <Plus className="w-4 h-4" /> Book Service
           </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[
          { label: 'Pets', val: stats.pets, icon: Footprints, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Bookings', val: stats.appointments, icon: CalendarDays, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Tasks', val: stats.tasks, icon: ListChecks, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Score', val: '98%', icon: TrendingUp, color: 'text-violet-600', bg: 'bg-violet-50' },
        ].map((item) => (
          <div key={item.label} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-soft">
            <div className={`w-10 h-10 rounded-xl ${item.bg} ${item.color} flex items-center justify-center mb-4`}>
              <item.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-slate-900">{loading ? '...' : item.val}</p>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Next Appointment Card */}
          <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl">
             <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
             <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="space-y-4">
                   <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full w-fit">
                      <Clock className="w-3.5 h-3.5 text-primary-400" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-primary-400">Next Appointment</span>
                   </div>
                   {nextAppt ? (
                     <div>
                       <h3 className="text-2xl font-bold">{nextAppt.serviceType} for {nextAppt.pet?.name}</h3>
                       <p className="text-slate-400 mt-1 flex items-center gap-2">
                         <CalendarDays className="w-4 h-4" /> {new Date(nextAppt.date).toLocaleDateString()} at {nextAppt.time}
                       </p>
                     </div>
                   ) : (
                     <h3 className="text-2xl font-bold">No upcoming appointments</h3>
                   )}
                </div>
                <Link to="/app/schedule" className="bg-white text-slate-900 px-6 py-3 rounded-xl font-bold text-sm hover:bg-slate-100 transition-colors flex items-center justify-center gap-2">
                  View Schedule <ChevronRight className="w-4 h-4" />
                </Link>
             </div>
          </div>

          {/* Recent Pets */}
          <div className="space-y-4">
             <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-800">My Pets</h2>
                <Link to="/app/pets" className="text-sm font-bold text-primary-600 hover:underline">See All</Link>
             </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {pets.slice(0, 4).map(pet => (
                  <div key={pet._id} className="p-4 bg-white rounded-2xl border border-slate-100 shadow-soft flex items-center gap-4 hover:shadow-card transition-all">
                     <img src={pet.avatarUrl || 'https://cdn-icons-png.flaticon.com/512/3069/3069172.png'} className="w-14 h-14 rounded-xl object-cover bg-slate-50" alt="" />
                     <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-800 truncate">{pet.name}</p>
                        <p className="text-xs text-slate-500">{pet.breed || pet.species}</p>
                     </div>
                     <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  </div>
                ))}
                {pets.length === 0 && (
                  <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-dashed border-slate-200">
                     <p className="text-slate-400 font-medium">No pets added yet</p>
                     <Link to="/app/pets" className="text-primary-600 font-bold text-sm mt-2 inline-block">+ Add Pet</Link>
                  </div>
                )}
             </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
           {/* AI Insight Card */}
           <div className="bg-gradient-to-br from-primary-500 to-indigo-600 rounded-3xl p-6 text-white shadow-lg shadow-primary-500/20">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-6">
                 <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-2">AI Suggestion</h3>
              <p className="text-sm text-primary-50 leading-relaxed mb-6">
                 "Based on recent patterns, your pets might need more exercise today. A 30-minute walk is recommended."
              </p>
              <Link to="/app/health" className="w-full py-3 bg-white text-primary-600 font-bold rounded-xl text-center block text-sm hover:bg-primary-50 transition-colors">
                 Get Full Advice
              </Link>
           </div>

           {/* Quick Actions */}
           <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-soft">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                 <Link to="/app/schedule" className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-primary-50 hover:text-primary-600 transition-all group font-medium text-sm">
                    Book Grooming <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all" />
                 </Link>
                 <Link to="/app/tasks" className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-primary-50 hover:text-primary-600 transition-all group font-medium text-sm">
                    Check Tasks <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all" />
                 </Link>
                 <Link to="/app/settings" className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-primary-50 hover:text-primary-600 transition-all group font-medium text-sm">
                    System Settings <Settings className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all" />
                 </Link>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
