import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Activity, Shield, Brain, HeartPulse, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useScrollProgress } from '../hooks/useScrollProgress';
import Button from '../components/ui/Button';

const FeatureCard = ({ icon: Icon, title, description }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="p-6 bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100"
  >
    <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mb-4 text-primary-600">
      <Icon size={24} />
    </div>
    <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
    <p className="text-slate-600 leading-relaxed">{description}</p>
  </motion.div>
);

const StepCard = ({ number, title, description }) => (
  <div className="relative flex flex-col items-center text-center p-6">
    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 text-white flex items-center justify-center text-2xl font-bold mb-4 shadow-lg shadow-primary-500/30 z-10">
      {number}
    </div>
    <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
    <p className="text-slate-600">{description}</p>
  </div>
);

const Home = () => {
  const { openAuthModal } = useAuth();
  const hasScrolledPast = useScrollProgress(40);
  
  // Trigger auth modal on scroll (once per session logic handled in context or here)
  useEffect(() => {
    const hasSeenModal = sessionStorage.getItem('hasSeenScrollModal');
    if (hasScrolledPast && !hasSeenModal) {
      openAuthModal();
      sessionStorage.setItem('hasSeenScrollModal', 'true');
    }
  }, [hasScrolledPast, openAuthModal]);

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 bg-slate-50">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-[30%] -right-[10%] w-[70%] h-[70%] rounded-full bg-gradient-to-br from-primary-200/30 to-secondary-200/30 blur-3xl" />
          <div className="absolute top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-gradient-to-tr from-blue-200/30 to-purple-200/30 blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-white border border-slate-200 text-sm font-medium text-primary-600 mb-6 shadow-sm">
                <span className="flex h-2 w-2 rounded-full bg-primary-500 mr-2 animate-pulse"></span>
                AI-Powered Health Analytics
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 leading-tight mb-6">
                Your Health, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-500">
                  Intelligently Decoded
                </span>
              </h1>
              <p className="text-lg text-slate-600 mb-8 max-w-lg leading-relaxed">
                Experience the future of personal wellness with Healance. Our AI analyzes your vitals to provide actionable insights and personalized health plans.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={openAuthModal} size="lg" className="shadow-xl shadow-primary-500/20">
                  Start Your Journey
                </Button>
                <Button onClick={openAuthModal} variant="secondary" size="lg">
                  Go To Dashboard
                </Button>
              </div>
              
              <div className="mt-10 flex items-center gap-6 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-500" />
                  <span>HIPAA Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-500" />
                  <span>24/7 AI Monitoring</span>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative z-10 bg-white/40 backdrop-blur-xl rounded-3xl p-4 border border-white/50 shadow-2xl animate-float">
                <img 
                  src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
                  alt="AI Health Analytics" 
                  className="rounded-2xl w-full h-auto shadow-sm"
                />
                
                {/* Floating Cards */}
                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl border border-slate-100 flex items-center gap-3">
                  <div className="bg-red-100 p-2 rounded-full text-red-500">
                    <HeartPulse size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Heart Rate</p>
                    <p className="font-bold text-slate-800">72 BPM</p>
                  </div>
                </div>

                <div className="absolute -top-6 -right-6 bg-white p-4 rounded-xl shadow-xl border border-slate-100 flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-full text-green-500">
                    <Activity size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Health Score</p>
                    <p className="font-bold text-slate-800">98/100</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Complete Health Intelligence</h2>
            <p className="text-slate-600">Advanced algorithms working 24/7 to keep you healthy, happy, and informed.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              icon={Brain}
              title="AI Prediction"
              description="Predict potential health risks before they happen using our advanced ML models."
            />
            <FeatureCard 
              icon={Activity}
              title="Smart Analysis"
              description="Upload your medical reports and get instant, easy-to-understand summaries."
            />
            <FeatureCard 
              icon={HeartPulse}
              title="Vitals Tracking"
              description="Connect with wearables to track heart rate, sleep, and activity in real-time."
            />
            <FeatureCard 
              icon={Shield}
              title="Secure Data"
              description="Your health data is encrypted and protected with enterprise-grade security."
            />
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">How Healance Works</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector Line */}
            <div className="hidden md:block absolute top-14 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-primary-200 via-secondary-200 to-primary-200 border-t-2 border-dashed border-slate-300 z-0" />
            
            <StepCard 
              number="1"
              title="Connect Data"
              description="Sync your wearable device or upload medical reports manually."
            />
            <StepCard 
              number="2"
              title="AI Analysis"
              description="Our AI engine processes your data to find patterns and anomalies."
            />
            <StepCard 
              number="3"
              title="Get Insights"
              description="Receive personalized recommendations to improve your lifestyle."
            />
          </div>
        </div>
      </section>

      {/* Blog Preview */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Latest Health Insights</h2>
              <p className="text-slate-600">Expert articles on wellness and technology.</p>
            </div>
            <Button variant="ghost" className="hidden sm:flex">View all articles <ArrowRight size={16} className="ml-2" /></Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-2xl mb-4">
                  <img 
                    src={`https://images.unsplash.com/photo-${i === 1 ? '1576091160550-21733e99db29' : i === 2 ? '1505751172876-fa1923c5c528' : '1559757609-f3109038c656'}?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80`} 
                    alt="Blog" 
                    className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-primary-700">
                    Wellness
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-primary-600 transition-colors">
                  The Future of AI in Personal Healthcare
                </h3>
                <p className="text-slate-600 line-clamp-2">
                  Discover how artificial intelligence is revolutionizing the way we track and improve our daily health metrics.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-2xl">
            <h2 className="text-4xl font-bold text-white mb-6">Ready to take control of your health?</h2>
            <p className="text-xl text-slate-300 mb-8">
              Join thousands of users who are already using Healance to live healthier, longer lives.
            </p>
            <Button size="lg" onClick={openAuthModal}>
              Start Your Free Assessment
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
