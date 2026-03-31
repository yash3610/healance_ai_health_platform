import React, { useState, useEffect, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { UploadCloud, Menu, Activity, Bell, X, Check, Clock, Target, Heart, Loader2 } from 'lucide-react';
import Button from '../../shared/ui/Button';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Notification Panel Component
const NotificationPanel = ({ isOpen, onClose, notifications, onMarkRead, onMarkAllRead, onClearAll, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4 bg-slate-900/30 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden mt-16 mr-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-slate-100 p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Bell size={20} className="text-primary-600" />
            <h3 className="text-lg font-bold text-slate-900">Notifications</h3>
            {notifications.filter(n => !n.isRead).length > 0 && (
              <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
                {notifications.filter(n => !n.isRead).length}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={onMarkAllRead}
              className="text-xs font-medium text-primary-600 hover:text-primary-700"
            >
              Mark all read
            </button>
            <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg">
              <X size={18} className="text-slate-500" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[60vh]">
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 size={24} className="animate-spin text-primary-500" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell size={40} className="mx-auto text-slate-300 mb-3" />
              <p className="text-slate-500">No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {notifications.map((notification) => (
                <div 
                  key={notification._id} 
                  className={`p-4 hover:bg-slate-50 transition-colors ${!notification.isRead ? 'bg-blue-50/50' : ''}`}
                >
                  <div className="flex gap-3">
                    <div className={`p-2 rounded-lg flex-shrink-0 ${
                      notification.type === 'reminder' ? 'bg-blue-100' :
                      notification.type === 'achievement' ? 'bg-yellow-100' :
                      notification.type === 'health' ? 'bg-red-100' : 'bg-slate-100'
                    }`}>
                      {notification.type === 'reminder' ? <Clock size={16} className="text-blue-600" /> :
                       notification.type === 'achievement' ? <Target size={16} className="text-yellow-600" /> :
                       notification.type === 'health' ? <Heart size={16} className="text-red-600" /> :
                       <Bell size={16} className="text-slate-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="text-sm font-semibold text-slate-800 truncate">{notification.title}</h4>
                        {!notification.isRead && (
                          <button 
                            onClick={() => onMarkRead(notification._id)}
                            className="text-primary-600 hover:text-primary-700"
                          >
                            <Check size={14} />
                          </button>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 mt-1">{notification.message}</p>
                      <p className="text-[10px] text-slate-400 mt-2">
                        {new Date(notification.createdAt).toLocaleString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {notifications.length > 0 && (
          <div className="border-t border-slate-100 p-3">
            <button 
              onClick={onClearAll}
              className="w-full text-center text-sm text-red-600 hover:text-red-700 py-2"
            >
              Clear all notifications
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const DashboardLayout = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isNotificationLoading, setIsNotificationLoading] = useState(false);

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    setIsNotificationLoading(true);
    try {
      const token = localStorage.getItem('healance_token');
      const response = await axios.get(`${API_URL}/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setNotifications(response.data.notifications);
        setUnreadCount(response.data.unreadCount);
      }
    } catch (err) {
      console.error('Failed to fetch notifications');
    } finally {
      setIsNotificationLoading(false);
    }
  }, []);

  // Mark notification as read
  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem('healance_token');
      await axios.put(`${API_URL}/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchNotifications();
    } catch (err) {
      console.error('Failed to mark as read');
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('healance_token');
      await axios.put(`${API_URL}/notifications/read-all`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchNotifications();
    } catch (err) {
      console.error('Failed to mark all as read');
    }
  };

  // Clear all notifications
  const clearAllNotifications = async () => {
    try {
      const token = localStorage.getItem('healance_token');
      await axios.delete(`${API_URL}/notifications/clear-all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchNotifications();
    } catch (err) {
      console.error('Failed to clear notifications');
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

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
<button 
            onClick={() => setIsNotificationOpen(true)}
            className="relative p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Bell size={20} className="text-slate-600" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
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
              <button 
                onClick={() => setIsNotificationOpen(true)}
                className="relative p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <Bell size={20} className="text-slate-600" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
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

        {/* Notification Panel */}
        <NotificationPanel
          isOpen={isNotificationOpen}
          onClose={() => setIsNotificationOpen(false)}
          notifications={notifications}
          onMarkRead={markAsRead}
          onMarkAllRead={markAllAsRead}
          onClearAll={clearAllNotifications}
          isLoading={isNotificationLoading}
        />
      </main>
    </div>
  );
};

export default DashboardLayout;
