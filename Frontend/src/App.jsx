import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Activity } from 'lucide-react';
import { AuthProvider } from './context/AuthContext';
import { HealthDataProvider } from './context/HealthDataContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import ProtectedRoute from './components/ProtectedRoute';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import About from './pages/About';
import RiskPrediction from './pages/RiskPrediction';
import AIChatbots from './pages/AIChatbots';
import BodyExplorer from './pages/BodyExplorer';
import ReversePlanner from './pages/ReversePlanner';
import WalkAndEarn from './pages/WalkAndEarn';
import Forecast from './pages/Forecast';
import DashboardBlogs from './pages/DashboardBlogs';
import DashboardContact from './pages/DashboardContact';
import ResetPassword from './pages/ResetPassword';

const Layout = ({ children }) => {
  const location = useLocation();
  const hasMountedRef = useRef(false);
  const [isRouteLoading, setIsRouteLoading] = useState(false);
  // Hide main navbar/footer for dashboard and auth routes
  const isDashboard = location.pathname.startsWith('/dashboard');
  const isResetPassword = location.pathname.startsWith('/reset-password');

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

    setIsRouteLoading(true);
    const timer = window.setTimeout(() => setIsRouteLoading(false), 450);

    return () => window.clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
      {isRouteLoading && (
        <div className="fixed inset-0 z-[95] flex items-center justify-center bg-white/70 backdrop-blur-[1px]">
          <div className="flex flex-col items-center gap-3">
            <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-primary-50">
              <div className="absolute inset-0 rounded-full border-2 border-primary-200 border-t-primary-500 animate-spin" />
              <Activity className="h-4 w-4 text-primary-600" />
            </div>
            <p className="text-xs font-medium tracking-wide text-slate-600">Loading page...</p>
          </div>
        </div>
      )}
      {!isDashboard && !isResetPassword && <Navbar />}
      {children}
      {!isDashboard && !isResetPassword && <Footer />}
      {!isResetPassword && <AuthModal />}
    </>
  );
};

function App() {
  const [isBootLoading, setIsBootLoading] = useState(true);

  useEffect(() => {
    const loadStartTime = Date.now();
    const minimumLoaderTime = 700;

    const hideLoader = () => {
      const elapsed = Date.now() - loadStartTime;
      const remaining = Math.max(minimumLoaderTime - elapsed, 0);
      window.setTimeout(() => setIsBootLoading(false), remaining);
    };

    if (document.readyState === 'complete') {
      hideLoader();
    } else {
      window.addEventListener('load', hideLoader, { once: true });
    }

    return () => {
      window.removeEventListener('load', hideLoader);
    };
  }, []);

  if (isBootLoading) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-5">
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-primary-50">
            <div className="absolute inset-0 rounded-full border-2 border-primary-200 border-t-primary-500 animate-spin" />
            <Activity className="h-6 w-6 text-primary-600" />
          </div>

          <div className="text-center">
            <p className="text-lg font-semibold text-slate-800">Healance</p>
            <p className="mt-1 text-sm text-slate-500">Loading...</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary-300 animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="h-2 w-2 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '120ms' }} />
            <span className="h-2 w-2 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: '240ms' }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <AuthProvider>
        <HealthDataProvider>
          <Layout>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/blogs" element={<Blog />} />
              <Route path="/blog/:id" element={<Blog />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/reset-password/:resetToken" element={<ResetPassword />} />
              <Route path="/faq" element={<About />} />
              
              {/* Protected Dashboard Routes */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="risk-prediction" element={<RiskPrediction />} />
                <Route path="chatbots" element={<AIChatbots />} />
                <Route path="body-explorer" element={<BodyExplorer />} />
                <Route path="reverse-planner" element={<ReversePlanner />} />
                <Route path="walk-and-earn" element={<WalkAndEarn />} />
                <Route path="forecast" element={<Forecast />} />
                <Route path="blogs" element={<DashboardBlogs />} />
                <Route path="contact" element={<DashboardContact />} />
              </Route>
            </Routes>
          </Layout>
        </HealthDataProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
