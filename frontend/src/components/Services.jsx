import { motion } from 'framer-motion';
import { Stethoscope, Scissors, Home, GraduationCap, Footprints, Trees } from 'lucide-react';
import { Link } from 'react-router-dom';

const servicesList = [
  { icon: Stethoscope, title: 'Veterinary Checkup', description: 'Complete health assessments with certified veterinarians. Includes blood work, dental check, and wellness exam.', price: 'From $49', color: 'from-blue-500 to-cyan-500' },
  { icon: Scissors, title: 'Grooming', description: 'Professional grooming services including bath, haircut, nail trim, and ear cleaning for all breeds.', price: 'From $35', color: 'from-pink-500 to-rose-500' },
  { icon: Home, title: 'Boarding', description: 'Safe, comfortable overnight stays with 24/7 supervision, climate control, and webcam access.', price: 'From $45/night', color: 'from-violet-500 to-purple-500' },
  { icon: GraduationCap, title: 'Training', description: 'Certified trainers for obedience, agility, and behavioral correction programs for dogs of all ages.', price: 'From $60', color: 'from-amber-500 to-orange-500' },
  { icon: Footprints, title: 'Dog Walking', description: 'GPS-tracked walks with real-time updates, photos, and detailed walk reports sent to your phone.', price: 'From $20', color: 'from-emerald-500 to-teal-500' },
  { icon: Trees, title: 'Pet Daycare', description: 'Supervised socialization and play in a safe environment with regular feeding and rest schedules.', price: 'From $30/day', color: 'from-indigo-500 to-blue-500' },
];

const Services = () => {
  return (
    <section id="services" className="py-24 bg-slate-50">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="section-title">Premium Pet Services</h2>
          <p className="section-subtitle">
            Book trusted professionals for your pet's every need. All service providers are verified and insured.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicesList.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.5 }}
              className="bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-elevated
                       hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className={`h-2 bg-gradient-to-r ${service.color}`}></div>
              <div className="p-6">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-4 shadow-md`}>
                  <service.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">{service.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-4">{service.description}</p>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <span className="text-sm font-bold text-primary-600">{service.price}</span>
                  <Link to="/register" className="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1 group-hover:gap-2 transition-all">
                    Book Now →
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
