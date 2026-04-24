import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import useAuthStore from '../store/authStore';

const DashboardLayout = () => {
  const { user } = useAuthStore();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-slate-50/50">
      <Sidebar />
      {/* 
          ml-0 on mobile because Sidebar is hidden/absolute
          lg:ml-72 on desktop to make room for the fixed sidebar
          pb-24 on mobile for the bottom navigation bar
      */}
      <main className="flex-1 lg:ml-72 transition-all duration-300 pb-24 lg:pb-0">
        <div className="p-4 sm:p-6 lg:p-10 max-w-[1600px] mx-auto min-h-screen">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
