import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowRight, Activity, Shield, Brain, HeartPulse, Play } from 'lucide-react';
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

const HeroStat = ({ value, suffix, label }) => {
  const statRef = useRef(null);
  const isInView = useInView(statRef, { once: true, margin: '-40px' });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const duration = 1400;
    let animationId;
    let startTime;

    const animateValue = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setDisplayValue(Math.floor(progress * value));

      if (progress < 1) {
        animationId = window.requestAnimationFrame(animateValue);
      }
    };

    animationId = window.requestAnimationFrame(animateValue);
    return () => window.cancelAnimationFrame(animationId);
  }, [isInView, value]);

  return (
    <div ref={statRef}>
      <p className="text-2xl font-semibold tracking-tight text-white sm:text-3xl lg:text-4xl">
        {displayValue.toLocaleString()}
        {suffix}
      </p>
      <p className="mt-1 text-xs text-white/85 sm:text-sm">{label}</p>
    </div>
  );
};

const Home = () => {
  const { openAuthModal } = useAuth();
  const hasScrolledPast = useScrollProgress(40);
  const [showCursorEffect, setShowCursorEffect] = useState(false);
  const [isCursorHovering, setIsCursorHovering] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const smoothX = useSpring(cursorX, { stiffness: 220, damping: 28, mass: 0.25 });
  const smoothY = useSpring(cursorY, { stiffness: 220, damping: 28, mass: 0.25 });
  const ringX = useTransform(smoothX, (value) => value - 18);
  const ringY = useTransform(smoothY, (value) => value - 18);
  const dotX = useTransform(smoothX, (value) => value - 5);
  const dotY = useTransform(smoothY, (value) => value - 5);
  const heroStats = [
    { value: 20, suffix: '+', label: 'Years of experience' },
    { value: 95, suffix: '+', label: 'Patient satisfaction rating' },
    { value: 5000, suffix: '+', label: 'Patients served annually' },
    { value: 10, suffix: '+', label: 'Healthcare providers on staff' },
  ];
  
  // Trigger auth modal on scroll (once per session logic handled in context or here)
  useEffect(() => {
    const hasSeenModal = sessionStorage.getItem('hasSeenScrollModal');
    if (hasScrolledPast && !hasSeenModal) {
      openAuthModal();
      sessionStorage.setItem('hasSeenScrollModal', 'true');
    }
  }, [hasScrolledPast, openAuthModal]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const shouldEnableCursor = () => {
      const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
      setShowCursorEffect(hasFinePointer && window.innerWidth >= 1024);
    };

    const handleMouseMove = (event) => {
      cursorX.set(event.clientX);
      cursorY.set(event.clientY);
    };

    const handlePointerOver = (event) => {
      const targetElement = event.target instanceof Element ? event.target : null;
      const interactiveElement = targetElement?.closest('button, a, input, textarea, select, [role="button"]');
      setIsCursorHovering(Boolean(interactiveElement));
    };

    shouldEnableCursor();
    window.addEventListener('resize', shouldEnableCursor);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handlePointerOver);

    return () => {
      window.removeEventListener('resize', shouldEnableCursor);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handlePointerOver);
    };
  }, [cursorX, cursorY]);

  return (
    <div className="overflow-x-hidden">
      {showCursorEffect && (
        <>
          <motion.div
            aria-hidden="true"
            className="pointer-events-none fixed left-0 top-0 z-30 h-9 w-9 rounded-full bg-primary-300/35 shadow-[0_0_12px_rgba(125,211,252,0.30)]"
            style={{
              x: ringX,
              y: ringY,
              scale: isCursorHovering ? 1.25 : 1,
              opacity: isCursorHovering ? 0.95 : 0.8,
            }}
            transition={{ duration: 0.18 }}
          />
          <motion.div
            aria-hidden="true"
            className="pointer-events-none fixed left-0 top-0 z-30 h-2.5 w-2.5 rounded-full bg-primary-400/90 shadow-[0_0_8px_rgba(56,189,248,0.35)]"
            style={{
              x: dotX,
              y: dotY,
              scale: isCursorHovering ? 1.15 : 1,
            }}
            transition={{ duration: 0.15 }}
          />
        </>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 lg:pt-24">
        <div className="relative min-h-[88vh] lg:min-h-[92vh]">
          <img
            src="https://images.pexels.com/photos/7579831/pexels-photo-7579831.jpeg?auto=compress&cs=tinysrgb&w=2000"
            alt="Healthcare team"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/75 via-slate-900/45 to-primary-100/10" />

          <div className="relative z-10 mx-auto flex min-h-[88vh] max-w-7xl items-center px-4 pb-44 pt-16 sm:px-6 lg:min-h-[92vh] lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl"
            >
              <p className="mb-6 inline-block border-b border-white/60 pb-2 text-xl font-medium text-white/90">Healance AI</p>
              <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-7xl">
                Smarter care,
                <br />
                healthier outcomes.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/85 sm:text-2xl/10">
                Healance combines expert medical guidance with AI-powered health insights to deliver personalized care, early risk detection, and better day-to-day wellness decisions.
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Button onClick={openAuthModal} size="lg" className="w-full sm:w-auto">
                  Book Appointment
                </Button>
                <button
                  type="button"
                  onClick={openAuthModal}
                  className="inline-flex items-center gap-3 text-lg font-medium text-white transition hover:text-primary-200"
                >
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/70">
                    <Play size={18} className="ml-0.5" />
                  </span>
                  See how we work
                </button>
              </div>
            </motion.div>
          </div>

          <div className="absolute right-4 top-28 z-20 rounded-2xl border border-white/50 bg-white/95 px-4 py-3 shadow-xl shadow-slate-900/10 sm:right-8 sm:px-5 lg:right-16">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                <img src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200" alt="patient" className="h-9 w-9 rounded-full border-2 border-white object-cover" />
                <img src="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=200" alt="patient" className="h-9 w-9 rounded-full border-2 border-white object-cover" />
                <img src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200" alt="patient" className="h-9 w-9 rounded-full border-2 border-white object-cover" />
              </div>
              <div>
                <p className="text-2xl font-bold leading-none text-slate-800">10K+</p>
                <p className="text-xs font-medium text-slate-500">Active Users</p>
              </div>
            </div>
          </div>

          <div className="absolute inset-x-4 bottom-5 z-20 overflow-hidden rounded-3xl border border-white/30 bg-slate-900/35 p-5 backdrop-blur-md sm:inset-x-8 lg:left-1/2 lg:right-auto lg:w-[72%] lg:-translate-x-1/2 lg:p-6">

            <div className="relative z-10 grid grid-cols-2 gap-5 lg:grid-cols-4">
              {heroStats.map((stat) => (
                <HeroStat
                  key={stat.label}
                  value={stat.value}
                  suffix={stat.suffix}
                  label={stat.label}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">Complete Health Intelligence</h2>
            <p className="text-slate-600 text-sm sm:text-base">Advanced algorithms working 24/7 to keep you healthy, happy, and informed.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
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
      <section className="py-16 sm:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">How Healance Works</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 relative">
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
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8 sm:mb-12">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Latest Health Insights</h2>
              <p className="text-slate-600 text-sm sm:text-base">Expert articles on wellness and technology.</p>
            </div>
            <Button variant="ghost" className="hidden sm:flex">View all articles <ArrowRight size={16} className="ml-2" /></Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              { id: 1, image: "https://images.pexels.com/photos/8439093/pexels-photo-8439093.jpeg?auto=compress&cs=tinysrgb&w=800", category: "Technology", title: "AI in Healthcare: The Next Frontier", excerpt: "How artificial intelligence is transforming diagnosis and patient care." },
              { id: 2, image: "https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=800", category: "Wellness", title: "5 Simple Habits for Heart Health", excerpt: "Cardiologist-approved daily habits to keep your heart strong." },
              { id: 3, image: "https://images.pexels.com/photos/3807517/pexels-photo-3807517.jpeg?auto=compress&cs=tinysrgb&w=800", category: "Mental Health", title: "Mental Health in the Digital Age", excerpt: "Managing stress and anxiety in our always-connected world." }
            ].map((blog) => (
              <div key={blog.id} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-2xl mb-4">
                  <img 
                    src={blog.image} 
                    alt={blog.title} 
                    className="w-full h-48 sm:h-64 object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-primary-700">
                    {blog.category}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-primary-600 transition-colors">
                  {blog.title}
                </h3>
                <p className="text-slate-600 line-clamp-2">
                  {blog.excerpt}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/7089620/pexels-photo-7089620.jpeg?auto=compress&cs=tinysrgb&w=2000')] bg-cover bg-center opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-2xl">
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4 sm:mb-6">Ready to take control of your health?</h2>
            <p className="text-base sm:text-xl text-slate-300 mb-6 sm:mb-8">
              Join thousands of users who are already using Healance to live healthier, longer lives.
            </p>
            <Button size="lg" onClick={openAuthModal} className="w-full sm:w-auto">
              Start Your Free Assessment
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
