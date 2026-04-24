import { motion } from 'framer-motion';
import { Heart, Calendar, Brain, Shield, Bell, BarChart3 } from 'lucide-react';

const features = [
  {
    icon: Heart,
    title: 'Medical Records',
    description: 'Secure, encrypted storage for vaccination, medical history, and clinical documentation.',
    color: 'text-rose-500',
    bg: 'bg-rose-500/5',
  },
  {
    icon: Calendar,
    title: 'Smart Scheduling',
    description: 'Effortless booking system for veterinary services, grooming, and specialized care.',
    color: 'text-blue-500',
    bg: 'bg-blue-500/5',
  },
  {
    icon: Brain,
    title: 'Care Suggestions',
    description: 'Data-driven wellness tips personalized for your pet\'s specific breed and age.',
    color: 'text-violet-500',
    bg: 'bg-violet-500/5',
  },
  {
    icon: Shield,
    title: 'Secure Privacy',
    description: 'Professional encryption standards ensuring your pet\'s sensitive data remains private.',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/5',
  },
  {
    icon: Bell,
    title: 'Active Reminders',
    description: 'Automated notification system for upcoming checkups and daily care routines.',
    color: 'text-amber-500',
    bg: 'bg-amber-500/5',
  },
  {
    icon: BarChart3,
    title: 'Wellness Tracking',
    description: 'Detailed visualization of your pet\'s health trends and historical care data.',
    color: 'text-cyan-500',
    bg: 'bg-cyan-500/5',
  },
];

const Features = () => {
  return (
    <section id="features" className="py-32 bg-slate-50">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <span className="text-[10px] font-black text-primary-600 uppercase tracking-[0.4em] mb-4 block">System Capabilities</span>
          <h2 className="text-4xl md:text-6xl font-display font-black text-slate-900 tracking-tighter leading-tight">
            Engineered for <br /><span className="text-primary-600">Total Pet Wellness</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group p-10 rounded-[2.5rem] bg-white border border-slate-100 
                       hover:shadow-2xl hover:shadow-primary-500/10 hover:-translate-y-2
                       transition-all duration-500"
            >
              <div className={`w-16 h-16 rounded-2xl ${feature.bg} flex items-center justify-center mb-8
                           group-hover:scale-110 transition-transform duration-500`}>
                <feature.icon className={`w-8 h-8 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-4 tracking-tight">{feature.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
