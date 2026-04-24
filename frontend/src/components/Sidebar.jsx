import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, PawPrint, CalendarDays, ListChecks, Settings, LogOut, Heart, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { useState } from 'react';
import useAuthStore from '../store/authStore';

const menuItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/app' },
  { label: 'My Pets', icon: PawPrint, path: '/app/pets' },
  { label: 'Schedule', icon: CalendarDays, path: '/app/schedule' },
  { label: 'Tasks', icon: ListChecks, path: '/app/tasks' },
  { label: 'AI Advisor', icon: Sparkles, path: '/app/health' },
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
    <aside className={`${collapsed ? 'w-20' : 'w-64'} bg-sidebar fixed left-0 top-0 h-screen flex flex-col transition-all duration-300 z-50`}>
      {/* Logo */}
      <div className={`flex items-center ${collapsed ? 'justify-center' : 'px-6'} h-16 border-b border-slate-700/50`}>
        <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-accent-500 rounded-xl flex items-center justify-center shadow-lg">
          <Heart className="w-5 h-5 text-white" fill="white" />
        </div>
        {!collapsed && (
          <span className="ml-3 text-white font-display font-bold text-lg tracking-tight">PetCare</span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/app'}
            className={({ isActive }) => `
              flex items-center ${collapsed ? 'justify-center' : ''} gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
              transition-all duration-200 group
              ${isActive
                ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30'
                : 'text-slate-400 hover:text-white hover:bg-sidebar-hover'
              }
            `}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User & Collapse */}
      <div className="border-t border-slate-700/50 p-3 space-y-2">
        {!collapsed && user && (
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center text-white font-bold text-sm">
              {user.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{user.name}</p>
              <p className="text-slate-500 text-xs truncate">{user.email}</p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={`flex items-center ${collapsed ? 'justify-center' : ''} gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium
            text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200`}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`flex items-center ${collapsed ? 'justify-center' : ''} gap-3 w-full px-3 py-2.5 rounded-xl text-sm
            text-slate-500 hover:bg-sidebar-hover hover:text-slate-300 transition-all duration-200`}
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <><ChevronLeft className="w-5 h-5" /><span>Collapse</span></>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
