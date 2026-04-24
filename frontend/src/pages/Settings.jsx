import { useState } from 'react';
import { User, Bell, Shield } from 'lucide-react';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

const Settings = () => {
  const { user } = useAuthStore();
  const [notifications, setNotifications] = useState({ email: true, push: true, sms: false });

  const handleSave = () => toast.success('Settings saved!');

  return (
    <div className="animate-fade-in max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-display font-bold text-slate-800">Settings</h1>
        <p className="text-slate-500 mt-1">Manage your account and preferences.</p>
      </div>

      <div className="space-y-6">
        {/* Profile */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-soft p-6">
          <div className="flex items-center gap-3 mb-6">
            <User className="w-5 h-5 text-primary-500" />
            <h2 className="text-lg font-display font-bold text-slate-800">Profile</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
              <input type="text" defaultValue={user?.name || ''} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <input type="email" defaultValue={user?.email || ''} className="input-field" disabled />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-soft p-6">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-display font-bold text-slate-800">Notifications</h2>
          </div>
          <div className="space-y-4">
            {[
              { key: 'email', label: 'Email Notifications', desc: 'Receive appointment reminders via email' },
              { key: 'push', label: 'Push Notifications', desc: 'Get real-time browser notifications' },
              { key: 'sms', label: 'SMS Alerts', desc: 'Receive urgent alerts via text message' },
            ].map(item => (
              <div key={item.key} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors">
                <div>
                  <p className="font-medium text-slate-800 text-sm">{item.label}</p>
                  <p className="text-xs text-slate-500">{item.desc}</p>
                </div>
                <button onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key] })}
                  className={`w-11 h-6 rounded-full transition-colors duration-200 relative ${notifications[item.key] ? 'bg-primary-500' : 'bg-slate-300'}`}>
                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${notifications[item.key] ? 'left-5' : 'left-0.5'}`}></span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Security */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-soft p-6">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-5 h-5 text-emerald-500" />
            <h2 className="text-lg font-display font-bold text-slate-800">Security</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Current Password</label>
              <input type="password" className="input-field" placeholder="••••••••" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">New Password</label>
              <input type="password" className="input-field" placeholder="••••••••" />
            </div>
          </div>
        </div>

        <button onClick={handleSave} className="btn-primary">Save Changes</button>
      </div>
    </div>
  );
};

export default Settings;
