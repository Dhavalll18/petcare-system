import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Footprints, CalendarDays, ListChecks, Settings, LogOut, Heart, ChevronLeft, ChevronRight, Sparkles, PawPrint } from 'lucide-react';
import { useState } from 'react';
import useAuthStore from '../store/authStore';

const menuItems = [
  { label: 'Dashboard', icon: Home, path: '/app' },
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
      {/* 
          MOBILE BOTTOM NAVIGATION 
          Visible only on screens smaller than 1024px (lg)
      */}
      <div className="lg:hidden fixed bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur-xl border border-white/10 px-4 py-3 flex items-center justify-around z-[100] rounded-[2rem] shadow-2xl shadow-black/40">
        {menuItems.slice(0, 5).map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              p-3 rounded-2xl transition-all relative group
              ${isActive ? 'text-white bg-primary-600 shadow-lg shadow-primary-600/30' : 'text-slate-400 hover:text-slate-200'}
            `}
          >
            <item.icon className="w-5 h-5" />
            <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              {item.label}
            </span>
          </NavLink>
        ))}
      </div>

      {/* 
          DESKTOP SIDEBAR 
          Visible only on screens larger than 1024px (lg)
      */}
      <aside className={`hidden lg:flex fixed left-0 top-0 h-screen bg-slate-950 border-r border-slate-900 shadow-2xl transition-all duration-500 z-[100] flex-col ${collapsed ? 'w-24' : 'w-72'}`}>
        {/* Branding */}
        <div className={`h-24 flex items-center ${collapsed ? 'justify-center' : 'px-8'}`}>
          <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center shadow-lg group hover:bg-primary-500 transition-colors duration-500">
            <PawPrint className="w-6 h-6 text-white group-hover:scale-110 transition-all" />
          </div>
          {!collapsed && (
            <div className="ml-4">
              <span className="block text-white font-display font-black text-xl tracking-tighter">PETCARE <span className="text-primary-500">SYSTEM</span></span>
              <span className="block text-slate-500 text-[7px] font-black uppercase tracking-[0.5em] -mt-0.5">Core Interface</span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/app'}
              className={({ isActive }) => `
                flex items-center ${collapsed ? 'justify-center' : 'px-5'} py-3.5 rounded-2xl text-sm font-bold
                transition-all duration-300 group relative
                ${isActive
                  ? 'bg-primary-600 text-white shadow-xl shadow-primary-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
                }
              `}
            >
              <item.icon className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 group-hover:scale-110`} />
              {!collapsed && (
                <span className="ml-4 truncate tracking-tight">{item.label}</span>
              )}
              {collapsed && (
                <div className="absolute left-full ml-4 px-3 py-2 bg-slate-800 text-white text-xs rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-[200] border border-slate-700 shadow-2xl">
                  {item.label}
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User Profile & Actions */}
        <div className="p-4 bg-slate-900/30 border-t border-slate-900">
          {!collapsed && user && (
            <div className="mb-4 p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-indigo-500 flex items-center justify-center text-white font-black text-sm">
                {(user.name?.charAt(0) || 'U').toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs font-black truncate uppercase tracking-widest leading-none">{user.name}</p>
                <p className="text-slate-500 text-[10px] truncate mt-1">{user.email}</p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={handleLogout}
              className={`flex items-center ${collapsed ? 'justify-center' : 'px-5'} py-3.5 flex-1 rounded-2xl text-sm font-bold
                text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all duration-300 group`}
            >
              <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              {!collapsed && <span className="ml-4 tracking-tight">Sign Out</span>}
            </button>
            {!collapsed && (
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="p-3.5 bg-white/5 text-slate-500 hover:text-white rounded-2xl transition-all border border-white/5"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            {collapsed && (
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="w-full p-3.5 text-slate-500 hover:text-white transition-all flex justify-center"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
