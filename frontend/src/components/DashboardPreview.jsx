import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import api from '../utils/api';
import useAuthStore from '../store/authStore';

const DashboardPreview = () => {
  const { user } = useAuthStore();
  const [counts, setCounts] = useState({ pets: 0, appointments: 0, tasks: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (!user) return;
        const [petsRes, apptRes, taskRes] = await Promise.all([
          api.get('/pets'),
          api.get('/appointments'),
          api.get('/tasks')
        ]);
        
        setCounts({
          pets: petsRes.data.length,
          appointments: apptRes.data.length,
          tasks: taskRes.data.length
        });
      } catch (error) {
        console.error('Error fetching data', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [user]);

  if (!user) {
    return (
      <section className="container mx-auto px-4 py-10 max-w-6xl text-center">
        <p className="text-slate-500">Please login to view your dashboard summary.</p>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-10 max-w-6xl" id="dashboard">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="bg-blue-50/50 rounded-3xl p-8 md:p-12 shadow-[inset_0_2px_20px_rgba(0,0,0,0.02)] border border-blue-100 backdrop-blur-sm"
      >
        <div className="mb-10 text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3 tracking-tight">Welcome Back, {user?.name.split(' ')[0] || 'Buddy'} <span className="inline-block origin-bottom-right animate-wave">👋</span></h2>
          <p className="text-slate-500 text-lg">Here's what's going on with your pets today:</p>
        </div>
      
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <motion.div whileHover={{ y: -5 }} className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-primary hover:shadow-md transition-all">
            <h3 className="text-2xl font-bold text-primary mb-2">
              {loading ? <div className="h-8 bg-slate-200 animate-pulse rounded w-16"></div> : `${counts.pets} Pets`}
            </h3>
            <p className="text-slate-600 font-medium">All happy and healthy 🐶</p>
          </motion.div>

          <motion.div whileHover={{ y: -5 }} className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-secondary hover:shadow-md transition-all">
            <h3 className="text-2xl font-bold text-secondary-dark mb-2">
               {loading ? <div className="h-8 bg-slate-200 animate-pulse rounded w-16"></div> : `${counts.appointments} Appts`}
            </h3>
            <p className="text-slate-600 font-medium">Vet & grooming coming up 🩺</p>
          </motion.div>

          <motion.div whileHover={{ y: -5 }} className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-emerald-400 hover:shadow-md transition-all">
            <h3 className="text-2xl font-bold text-emerald-500 mb-2">
               {loading ? <div className="h-8 bg-slate-200 animate-pulse rounded w-16"></div> : `${counts.tasks} Tasks`}
            </h3>
            <p className="text-slate-600 font-medium">Feeding, walking, grooming 🐾</p>
          </motion.div>

        </div>
      </motion.div>
    </section>
  );
};

export default DashboardPreview;
