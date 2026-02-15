import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
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
import FAQ from './pages/FAQ';
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
  // Hide main navbar/footer for dashboard and auth routes
  const isDashboard = location.pathname.startsWith('/dashboard');
  const isResetPassword = location.pathname.startsWith('/reset-password');

  return (
    <>
      {!isDashboard && !isResetPassword && <Navbar />}
      {children}
      {!isDashboard && !isResetPassword && <Footer />}
      {!isResetPassword && <AuthModal />}
    </>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/blogs" element={<Blog />} />
            <Route path="/blog/:id" element={<Blog />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/reset-password/:resetToken" element={<ResetPassword />} />
            <Route path="/faq" element={<FAQ />} />
            
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
      </AuthProvider>
    </Router>
  );
}

export default App;
