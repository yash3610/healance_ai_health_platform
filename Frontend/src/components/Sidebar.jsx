import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Activity, 
  MessageSquare, 
  Accessibility, 
  Target, 
  Footprints, 
  CloudSun, 
  FileText, 
  Phone,
  LogOut,
  Settings,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, end: true },
    { name: 'Risk Prediction', path: '/dashboard/risk-prediction', icon: Activity },
    { name: 'AI Chatbots', path: '/dashboard/chatbots', icon: MessageSquare },
    { name: 'Body Explorer', path: '/dashboard/body-explorer', icon: Accessibility },
    { name: 'Reverse Planner', path: '/dashboard/reverse-planner', icon: Target },
    { name: 'Walk & Earn', path: '/dashboard/walk-and-earn', icon: Footprints },
    { name: 'Forecast', path: '/dashboard/forecast', icon: CloudSun },
    { name: 'Blogs', path: '/dashboard/blogs', icon: FileText },
    { name: 'Contact Us', path: '/dashboard/contact', icon: Phone },
  ];

  const handleNavClick = () => {
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={cn(
        "w-64 bg-white border-r border-slate-200 flex flex-col fixed h-full z-40 transition-transform duration-300 ease-in-out",
        "lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="bg-gradient-to-br from-primary-500 to-secondary-500 p-1.5 rounded-lg">
            <Activity className="text-white h-5 w-5" />
          </div>
          <span className="text-xl font-bold text-slate-800">Healance</span>
        </div>
        {/* Mobile close button */}
        <button 
          onClick={onClose}
          className="lg:hidden p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = item.end 
            ? location.pathname === item.path
            : location.pathname.startsWith(item.path);

          return (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={handleNavClick}
              className={({ isActive }) => cn(
                "flex items-center px-4 py-3 rounded-xl font-medium transition-colors",
                isActive 
                  ? "text-primary-600 bg-primary-50" 
                  : "text-slate-600 hover:bg-slate-50"
              )}
            >
              <item.icon size={20} className="mr-3 flex-shrink-0" />
              <span className="truncate">{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <div className="flex items-center p-3 rounded-xl bg-slate-50 mb-3">
          <img src={user?.avatar || "https://via.placeholder.com/40"} alt="User" className="w-10 h-10 rounded-full flex-shrink-0" />
          <div className="ml-3 overflow-hidden flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-900 truncate">{user?.name}</p>
            <p className="text-xs text-slate-500">Free Plan</p>
          </div>
        </div>
        <button 
          onClick={logout}
          className="flex items-center w-full px-4 py-2 text-sm text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut size={16} className="mr-2 flex-shrink-0" /> Sign Out
        </button>
      </div>
    </aside>
    </>
  );
};

export default Sidebar;
