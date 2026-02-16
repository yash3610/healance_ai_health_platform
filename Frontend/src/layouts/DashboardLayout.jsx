import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Bell, UploadCloud, Menu, Activity } from 'lucide-react';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

const DashboardLayout = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className="flex-1 lg:ml-64 min-h-screen flex flex-col">
        {/* Mobile Header */}
        <div className="lg:hidden sticky top-0 z-20 bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
          >
            <Menu size={24} />
          </button>
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-br from-primary-500 to-secondary-500 p-1.5 rounded-lg">
              <Activity className="text-white h-5 w-5" />
            </div>
            <span className="text-lg font-bold text-slate-800">Healance</span>
          </div>
          <button className="p-2 text-slate-400 hover:text-slate-600 relative">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
        </div>

        <div className="p-4 sm:p-6 lg:p-8 flex-1">
          {/* Desktop Header */}
          <header className="hidden lg:flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
              <p className="text-slate-500">Here's your health overview for today.</p>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 text-slate-400 hover:text-slate-600 relative">
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-50"></span>
              </button>
              <Button size="sm">
                <UploadCloud size={16} className="mr-2" /> Upload Report
              </Button>
            </div>
          </header>

          {/* Mobile Welcome Message */}
          <div className="lg:hidden mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
            <p className="text-sm text-slate-500">Here's your health overview for today.</p>
          </div>
          
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
