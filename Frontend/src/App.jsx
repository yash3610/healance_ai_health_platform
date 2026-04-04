import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { HealthDataProvider } from './context/HealthDataContext';
import WebsiteLayout from './website/components/Layout';
import AuthModal from './website/components/AuthModal';
import ProtectedRoute from './shared/components/ProtectedRoute';

// Layouts
import DashboardLayout from './dashboard/layouts/DashboardLayout';

// Website Pages
import HomePage from './website/pages/HomePage';
import ContactPage from './website/pages/ContactPage';
import AboutPage from './website/pages/AboutPage';
import ServicesPage from './website/pages/ServicesPage';
import ServiceSinglePage from './website/pages/ServiceSinglePage';
import BlogPage from './website/pages/BlogPage';
import BlogSinglePage from './website/pages/BlogSinglePage';
import DoctorsPage from './website/pages/DoctorsPage';
import DoctorPage from './website/pages/DoctorPage';
import DoctorSinglePage from './website/pages/DoctorSinglePage';
import CaseStudyPage from './website/pages/CaseStudyPage';
import CaseStudySinglePage from './website/pages/CaseStudySinglePage';
import ImageGalleryPage from './website/pages/ImageGalleryPage';
import VideoGalleryPage from './website/pages/VideoGalleryPage';
import FaqsPage from './website/pages/FaqsPage';
import BookAppointmentPage from './website/pages/BookAppointmentPage';
import ProjectsPage from './website/pages/ProjectsPage';
import IndexImagePage from './website/pages/IndexImagePage';
import Error404Page from './website/pages/Error404Page';

// Dashboard Pages
import Dashboard from './dashboard/pages/Dashboard';
import RiskPrediction from './dashboard/pages/RiskPrediction';
import HeartDiabetesPrediction from './dashboard/pages/HeartDiabetesPrediction';
import AIChatbots from './dashboard/pages/AIChatbots';
import BodyExplorer from './dashboard/pages/BodyExplorer';
import ReversePlanner from './dashboard/pages/ReversePlanner';
import Forecast from './dashboard/pages/Forecast';
import DashboardBlogs from './dashboard/pages/DashboardBlogs';
import DashboardContact from './dashboard/pages/DashboardContact';
import Profile from './dashboard/pages/Profile';
import ResetPasswordPage from './website/pages/ResetPassword';

const Layout = ({ children }) => {
  const location = useLocation();
  const isResetPassword = location.pathname.startsWith('/reset-password');

  return (
    <>
      {children}
      {!isResetPassword && <AuthModal />}
    </>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <HealthDataProvider>
          <Layout>
            <Routes>
              {/* Website Routes */}
              <Route element={<WebsiteLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/service-single" element={<ServiceSinglePage />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/blogs" element={<BlogPage />} />
                <Route path="/blog-single" element={<BlogSinglePage />} />
                <Route path="/doctors" element={<DoctorsPage />} />
                <Route path="/doctor" element={<DoctorPage />} />
                <Route path="/doctor-single" element={<DoctorSinglePage />} />
                <Route path="/case-study" element={<CaseStudyPage />} />
                <Route path="/case-study-single" element={<CaseStudySinglePage />} />
                <Route path="/image-gallery" element={<ImageGalleryPage />} />
                <Route path="/video-gallery" element={<VideoGalleryPage />} />
                <Route path="/faqs" element={<FaqsPage />} />
                <Route path="/faq" element={<FaqsPage />} />
                <Route path="/book-appointment" element={<BookAppointmentPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/index-image" element={<IndexImagePage />} />
                <Route path="/404" element={<Error404Page />} />
              </Route>

              <Route path="/reset-password/:resetToken" element={<ResetPasswordPage />} />
              
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
                <Route path="risk-prediction/heart-diabetes" element={<HeartDiabetesPrediction />} />
                <Route path="chatbots" element={<AIChatbots />} />
                <Route path="body-explorer" element={<BodyExplorer />} />
                <Route path="reverse-planner" element={<ReversePlanner />} />
                <Route path="forecast" element={<Forecast />} />
                <Route path="blogs" element={<DashboardBlogs />} />
                <Route path="contact" element={<DashboardContact />} />
                <Route path="profile" element={<Profile />} />
              </Route>

              <Route path="*" element={<Error404Page />} />
            </Routes>
          </Layout>
        </HealthDataProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
