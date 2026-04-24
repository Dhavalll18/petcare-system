import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Footprints, CalendarDays, ListChecks, Settings, LogOut, Heart, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { useState } from 'react';
import useAuthStore from '../store/authStore';

const menuItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/app' },
  { label: 'My Pets', icon: Footprints, path: '/app/pets' },
  { label: 'Services', icon: Heart, path: '/app/services' },
  { label: 'Schedule', icon: CalendarDays, path: '/app/schedule' },
  { label: 'Tasks', icon: ListChecks, path: '/app/tasks' },
  { label: 'AI Health', icon: Sparkles, path: '/app/health' },
  { label: 'Settings', icon: Settings, path: '/app/settings' },
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      {/* Mobile Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-3 flex items-center justify-between z-50">
        {menuItems.slice(0, 5).map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `p-2 rounded-xl transition-all ${isActive ? 'text-primary-600 bg-primary-50' : 'text-slate-400'}`}
          >
            <item.icon className="w-6 h-6" />
          </NavLink>
        ))}
      </div>

      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex ${collapsed ? 'w-20' : 'w-72'} bg-slate-900 fixed left-0 top-0 h-screen flex-col transition-all duration-300 z-50 border-r border-slate-800 shadow-2xl shadow-black/50`}>
        {/* Logo */}
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'px-8'} h-24`}>
          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-600/30">
            <Heart className="w-5 h-5 text-white" fill="white" />
          </div>
          {!collapsed && (
            <span className="ml-4 text-white font-display font-black text-xl tracking-tight">PetCare.</span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/app'}
              className={({ isActive }) => `
                flex items-center ${collapsed ? 'justify-center' : ''} gap-4 px-4 py-3 rounded-xl text-sm font-bold
                transition-all duration-200 group
                ${isActive
                  ? 'bg-primary-600 text-white shadow-xl shadow-primary-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
                }
              `}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/50">
          {!collapsed && user && (
            <div className="flex items-center gap-3 px-4 py-4 mb-2 bg-white/5 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-black text-sm">
                {user.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs font-black truncate uppercase tracking-widest">{user.name}</p>
                <p className="text-slate-500 text-[10px] truncate font-medium">{user.email}</p>
              </div>
            </div>
          )}
          <div className="flex items-center gap-2">
            <button
              onClick={handleLogout}
              className={`flex items-center ${collapsed ? 'justify-center' : ''} gap-4 flex-1 px-4 py-3 rounded-xl text-sm font-bold
                text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all duration-200`}
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>Sign Out</span>}
            </button>
            {!collapsed && (
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="p-3 text-slate-500 hover:text-white transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
