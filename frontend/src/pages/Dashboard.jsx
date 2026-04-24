import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Footprints, CalendarDays, ListChecks, TrendingUp, Plus, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import useAuthStore from '../store/authStore';

const Dashboard = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({ pets: 0, appointments: 0, tasks: 0 });
  const [pets, setPets] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [tips, setTips] = useState([]);
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
          tasks: taskRes.data.length,
        });

        // Get AI tips for the first pet
        if (petsRes.data.length > 0) {
          try {
            const tipsRes = await api.get(`/pets/${petsRes.data[0]._id}/tips`);
            setTips(tipsRes.data.tips || []);
          } catch { setTips([]); }
        }
      } catch (error) {
        console.error('Dashboard fetch error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statCards = [
    { label: 'My Pets', value: stats.pets, icon: Footprints, color: 'from-primary-500 to-primary-600', bg: 'bg-primary-50', link: '/app/pets' },
    { label: 'Appointments', value: stats.appointments, icon: CalendarDays, color: 'from-amber-500 to-orange-500', bg: 'bg-amber-50', link: '/app/schedule' },
    { label: 'Active Tasks', value: stats.tasks, icon: ListChecks, color: 'from-emerald-500 to-teal-500', bg: 'bg-emerald-50', link: '/app/tasks' },
    { label: 'Health Score', value: '98%', icon: TrendingUp, color: 'from-violet-500 to-purple-500', bg: 'bg-violet-50', link: '/app/pets' },
  ];

  const Skeleton = ({ className }) => <div className={`skeleton ${className}`}></div>;

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl lg:text-3xl font-display font-bold text-slate-800">
              Welcome back, {user?.name?.split(' ')[0]} <span className="inline-block animate-wave">👋</span>
            </h1>
            <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full shadow-sm">Pro Member</span>
          </div>
          <p className="text-slate-500">Premium PetCare Account · All Enterprise Features Unlocked</p>
        </div>
        <Link to="/app/services" className="btn-primary py-2.5 px-6 text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2">
          <Sparkles className="w-4 h-4" /> Discover Services
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Link to={card.link} className="stat-card flex items-center gap-4 block">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-md`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                {loading ? (
                  <Skeleton className="h-7 w-12 mb-1" />
                ) : (
                  <p className="text-2xl font-bold text-slate-800">{card.value}</p>
                )}
                <p className="text-sm text-slate-500">{card.label}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Pets */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 space-y-6"
        >
          <div className="bg-white rounded-2xl border border-slate-100 shadow-soft">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-display font-bold text-slate-800">My Pets</h2>
              <Link to="/app/pets" className="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="p-6">
              {loading ? (
                <div className="space-y-4">
                  {[1, 2].map(i => (
                    <div key={i} className="flex items-center gap-4">
                      <Skeleton className="w-12 h-12 rounded-xl" />
                      <div className="flex-1">
                        <Skeleton className="h-4 w-24 mb-2" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : pets.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Footprints className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-slate-500 mb-4">No pets added yet</p>
                  <Link to="/app/pets" className="btn-primary text-sm py-2 inline-flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Add Your First Pet
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {pets.slice(0, 4).map((pet) => (
                    <div key={pet._id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                      <img src={pet.avatarUrl || 'https://cdn-icons-png.flaticon.com/512/3069/3069172.png'} alt={pet.name} className="w-12 h-12 rounded-xl object-cover bg-slate-100" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-800 truncate">{pet.name}</p>
                        <p className="text-sm text-slate-500">{pet.species} · {pet.breed || 'Unknown breed'} · {pet.age} yrs</p>
                      </div>
                      <span className="badge-success text-xs">Healthy</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-soft overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-display font-bold text-slate-800">Recent Activity</h2>
              <button className="text-sm font-semibold text-slate-400 hover:text-slate-600">Mark all as read</button>
            </div>
            <div className="divide-y divide-slate-50">
              {appointments.length > 0 ? (
                appointments.slice(0, 3).map((appt) => (
                  <div key={appt._id} className="p-4 flex gap-4 hover:bg-slate-50 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <CalendarDays className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">
                        Appointment {appt.status === 'Confirmed' ? 'confirmed' : 'scheduled'} for {appt.pet?.name || 'your pet'}
                      </p>
                      <p className="text-xs text-slate-500">{new Date(appt.date).toLocaleDateString()} at {appt.time}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-10 text-center text-slate-400 text-sm italic">
                  No recent activity to show.
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* AI Tips + Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-soft p-6">
            <h2 className="text-lg font-display font-bold text-slate-800 mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <Link to="/app/pets" className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary-50 border border-slate-100 hover:border-primary-200 transition-all group">
                <div className="w-9 h-9 rounded-lg bg-primary-100 flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                  <Plus className="w-4 h-4 text-primary-600" />
                </div>
                <span className="text-sm font-medium text-slate-700">Add New Pet</span>
              </Link>
              <Link to="/app/schedule" className="flex items-center gap-3 p-3 rounded-xl hover:bg-amber-50 border border-slate-100 hover:border-amber-200 transition-all group">
                <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center group-hover:bg-amber-200 transition-colors">
                  <CalendarDays className="w-4 h-4 text-amber-600" />
                </div>
                <span className="text-sm font-medium text-slate-700">Book Appointment</span>
              </Link>
              <Link to="/app/tasks" className="flex items-center gap-3 p-3 rounded-xl hover:bg-emerald-50 border border-slate-100 hover:border-emerald-200 transition-all group">
                <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                  <ListChecks className="w-4 h-4 text-emerald-600" />
                </div>
                <span className="text-sm font-medium text-slate-700">Add Task</span>
              </Link>
            </div>
          </div>

          {/* AI Tips */}
          <div className="bg-gradient-to-br from-primary-600 to-accent-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5" />
              <h3 className="font-display font-bold">AI Care Tips</h3>
            </div>
            {tips.length > 0 ? (
              <ul className="space-y-2">
                {tips.slice(0, 3).map((tip, i) => (
                  <li key={i} className="text-sm text-white/90 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/60 mt-1.5 flex-shrink-0"></span>
                    {tip}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-white/80">Add your first pet to get personalized AI care recommendations!</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
