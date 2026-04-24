import { motion } from 'framer-motion';
import { Stethoscope, Scissors, Home, Activity, Footprints, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const servicesList = [
  { icon: Stethoscope, title: 'Medical Diagnostics', description: 'Advanced health assessments including blood panels and genetic screening.', price: 'Starts ₹2,999', color: 'from-blue-600 to-indigo-600' },
  { icon: Scissors, title: 'Elite Grooming', description: 'Certified styling and therapeutic spa treatments for show-quality results.', price: 'Starts ₹1,499', color: 'from-rose-600 to-pink-600' },
  { icon: Home, title: 'Luxury Boarding', description: 'Climate-controlled suites with 24/7 digital monitoring and personal care.', price: 'Starts ₹1,999/night', color: 'from-violet-600 to-purple-600' },
  { icon: Activity, title: 'Tactical Training', description: 'Specialized obedience and cognitive enhancement programs by master trainers.', price: 'Starts ₹4,499', color: 'from-amber-600 to-orange-600' },
  { icon: Footprints, title: 'Urban Concierge', description: 'Premium exercise routines with full GPS telemetry and health reporting.', price: 'Starts ₹899', color: 'from-emerald-600 to-teal-600' },
  { icon: Heart, title: 'Daycare Elite', description: 'Social integration in high-security, ultra-clean environments.', price: 'Starts ₹1,299/day', color: 'from-indigo-600 to-blue-600' },
];

const Services = () => {
  const isDashboard = window.location.pathname.startsWith('/app');

  return (
    <section id="services" className={`${isDashboard ? 'py-10' : 'py-20'} bg-transparent`}>
      <div className={`${isDashboard ? '' : 'container mx-auto px-4 lg:px-8'}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8"
        >
          <div className="max-w-2xl">
            <span className="text-[10px] font-bold text-primary-600 uppercase tracking-[0.4em] mb-4 block">Service Catalog</span>
            <h2 className="text-4xl md:text-6xl font-display font-bold text-slate-900 tracking-tighter leading-tight uppercase">
              Elite Care <br />For Your <span className="text-primary-600">Companion</span>
            </h2>
          </div>
          <p className="text-slate-500 font-medium max-w-sm leading-relaxed mb-2">
            Access our network of certified specialists and world-class facilities through a single unified interface.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesList.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="group bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 hover:shadow-2xl hover:border-primary-100 transition-all duration-500"
            >
              <div className="p-10">
                <div className={`w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center mb-8 shadow-sm group-hover:bg-primary-600 transition-all duration-500`}>
                  <service.icon className="w-7 h-7 text-primary-600 group-hover:text-white transition-all duration-500" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight uppercase">{service.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed font-medium mb-8">{service.description}</p>
                <div className="flex items-center justify-between pt-8 border-t border-slate-100">
                  <span className="text-sm font-bold text-slate-900 uppercase tracking-widest">{service.price}</span>
                  <Link 
                    to={isDashboard ? `/app/schedule?service=${service.title}` : '/register'} 
                    className="flex items-center gap-2 text-[10px] font-bold text-primary-600 uppercase tracking-widest group-hover:gap-4 transition-all"
                  >
                    Initialize →
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
