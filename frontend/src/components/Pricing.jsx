import { motion } from 'framer-motion';
import { Check, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';


const plans = [
  {
    name: 'Starter',
    price: '₹0',
    desc: 'Core features for new pet owners',
    features: ['1 Pet Profile', 'Basic Health Records', 'Task Reminders', 'Community Access'],
    cta: 'Initialize Free',
    popular: false,
  },
  {
    name: 'Enterprise Pro',
    price: '₹799',
    desc: 'The complete care ecosystem',
    features: ['Unlimited Pets', 'AI Health Advisor', 'Premium Scheduling', 'Expense Tracking', 'Priority Support'],
    cta: 'Upgrade to Pro',
    popular: true,
  },
  {
    name: 'Corporate Family',
    price: '₹1499',
    desc: 'Full-stack multi-pet solution',
    features: ['Shared Access', 'Medical Document Storage', 'Unlimited History', 'Dedicated Vet Support'],
    cta: 'Select Corporate',
    popular: false,
  },
];

const Pricing = () => {
  return (
    <section id="pricing" className="py-32 bg-slate-50">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-24"
        >
          <span className="text-[10px] font-black text-primary-600 uppercase tracking-[0.4em] mb-4 block">Scalable Tiers</span>
          <h2 className="text-4xl md:text-6xl font-display font-black text-slate-900 tracking-tighter leading-tight">
            Plans for Every <br /><span className="text-primary-600">Requirement</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`bg-white rounded-[2.5rem] p-10 border-2 transition-all duration-500 relative flex flex-col ${
                plan.popular ? 'border-primary-500 shadow-2xl shadow-primary-500/10 scale-105 z-10' : 'border-slate-100 hover:border-primary-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-black px-6 py-2 rounded-xl flex items-center gap-2 shadow-xl uppercase tracking-widest">
                  <Zap className="w-3.5 h-3.5 text-primary-400 fill-current" /> Most Popular
                </div>
              )}
              <div className="mb-10 text-center md:text-left">
                <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight uppercase">{plan.name}</h3>
                <p className="text-sm font-medium text-slate-500 leading-relaxed italic">"{plan.desc}"</p>
              </div>
              <div className="mb-10 text-center md:text-left">
                <span className="text-6xl font-black text-slate-900 tracking-tighter">{plan.price}</span>
                <span className="text-slate-400 font-bold ml-2 text-sm uppercase tracking-widest">/cycle</span>
              </div>
              <ul className="space-y-5 mb-12 flex-1">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-4 text-sm font-medium text-slate-600">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                       <Check className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                to="/register"
                className={`w-full py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] text-center block transition-all ${
                  plan.popular ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-xl shadow-primary-600/25' : 'bg-slate-900 text-white hover:bg-slate-800'
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
