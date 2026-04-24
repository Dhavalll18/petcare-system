import { motion } from 'framer-motion';
import { Check, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const plans = [
  {
    name: 'Starter',
    price: '₹0',
    desc: 'Perfect for new pet owners',
    features: ['1 Pet Profile', 'Basic Health Records', 'Task Reminders', 'Community Access'],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Pro',
    price: '₹799',
    desc: 'Advanced care for your pets',
    features: ['Unlimited Pets', 'AI Health Advisor', 'Premium Scheduling', 'Expense Tracking', 'Priority Support'],
    cta: 'Go Pro',
    popular: true,
  },
  {
    name: 'Family',
    price: '₹1499',
    desc: 'For multi-pet households',
    features: ['Shared Access', 'Medical Document Storage', 'Unlimited History', 'Dedicated Vet Support'],
    cta: 'Select Family',
    popular: false,
  },
];

const Pricing = () => {
  return (
    <section id="pricing" className="py-24 bg-slate-50">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="section-title">Simple, Transparent Pricing</h2>
          <p className="section-subtitle">Choose the plan that fits your pet's needs perfectly.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`bg-white rounded-3xl p-8 border-2 transition-all duration-300 relative ${
                plan.popular ? 'border-primary-500 shadow-elevated scale-105 z-10' : 'border-slate-100 hover:border-primary-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary-500 text-white text-xs font-bold px-4 py-1 rounded-full flex items-center gap-1">
                  <Zap className="w-3 h-3 fill-white" /> MOST POPULAR
                </div>
              )}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-800 mb-1">{plan.name}</h3>
                <p className="text-sm text-slate-500">{plan.desc}</p>
              </div>
              <div className="mb-8">
                <span className="text-4xl font-extrabold text-slate-800">{plan.price}</span>
                <span className="text-slate-500 ml-1">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-3 text-sm text-slate-600">
                    <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                to="/register"
                className={`w-full py-3 rounded-xl font-bold text-center block transition-all ${
                  plan.popular ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg' : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                }`}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
