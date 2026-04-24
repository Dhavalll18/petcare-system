import { motion } from 'framer-motion';
import { Heart, Calendar, Brain, Shield, Bell, BarChart3 } from 'lucide-react';

const features = [
  {
    icon: Heart,
    title: 'Health Records',
    description: 'Keep detailed vaccination, allergy, and medical history for every pet in one secure place.',
    color: 'bg-rose-100 text-rose-600',
  },
  {
    icon: Calendar,
    title: 'Smart Scheduling',
    description: 'Book vet visits, grooming sessions, and boarding with intelligent conflict-free scheduling.',
    color: 'bg-blue-100 text-blue-600',
  },
  {
    icon: Brain,
    title: 'AI Care Tips',
    description: 'Get personalized wellness recommendations powered by AI based on your pet\'s breed, age, and health data.',
    color: 'bg-violet-100 text-violet-600',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Enterprise-grade encryption protects your pet\'s data. We never share your information with third parties.',
    color: 'bg-emerald-100 text-emerald-600',
  },
  {
    icon: Bell,
    title: 'Smart Reminders',
    description: 'Never miss a vaccination date or vet appointment with automated notifications and task alerts.',
    color: 'bg-amber-100 text-amber-600',
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Visualize your pet\'s health trends, expenses, and care history with beautiful interactive charts.',
    color: 'bg-cyan-100 text-cyan-600',
  },
];

const Features = () => {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="section-title">Everything Your Pet Needs</h2>
          <p className="section-subtitle">
            A comprehensive platform designed with love to keep your furry friends healthy, happy, and well-cared for.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group p-6 rounded-2xl border border-slate-100 bg-white
                       hover:shadow-elevated hover:border-primary-100 hover:-translate-y-1
                       transition-all duration-300 cursor-default"
            >
              <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4
                           group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">{feature.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
