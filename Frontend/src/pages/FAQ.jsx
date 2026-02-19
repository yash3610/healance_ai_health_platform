import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  {
    question: "How does the AI health prediction work?",
    answer: "Our AI analyzes patterns in your vital signs, medical history, and lifestyle data using advanced machine learning algorithms. It compares this data against millions of anonymized health records to identify potential risks and trends early."
  },
  {
    question: "Is my health data secure?",
    answer: "Absolutely. We use bank-grade encryption (AES-256) for all data at rest and in transit. We are fully HIPAA compliant and never share your personal health information with third parties without your explicit consent."
  },
  {
    question: "Can I upload my past medical reports?",
    answer: "Yes! You can upload PDF or image files of your lab reports. Our OCR technology extracts the data automatically and adds it to your health timeline for analysis."
  },
  {
    question: "Is Healance a replacement for a doctor?",
    answer: "No. Healance is a wellness tool designed to help you monitor your health and provide insights. It is not a diagnostic tool and should not replace professional medical advice, diagnosis, or treatment."
  },
  {
    question: "What wearable devices are supported?",
    answer: "We currently support Apple Watch, Fitbit, Garmin, and Oura Ring. We are constantly adding support for more devices."
  }
];

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-slate-200 last:border-0">
      <button 
        className="w-full py-4 sm:py-6 flex justify-between items-center text-left focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-sm sm:text-lg font-semibold text-slate-900 pr-4 sm:pr-8">{question}</span>
        {isOpen ? <ChevronUp className="text-primary-500 flex-shrink-0 w-5 h-5" /> : <ChevronDown className="text-slate-400 flex-shrink-0 w-5 h-5" />}
      </button>
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100 pb-4 sm:pb-6' : 'max-h-0 opacity-0'}`}
      >
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">{answer}</p>
      </div>
    </div>
  );
};

const FAQ = () => {
  return (
    <div className="pt-20 min-h-screen bg-slate-50">
      {/* About Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <h1 className="text-2xl sm:text-4xl font-bold text-center mx-auto text-slate-900">About Healance</h1>
          <p className="text-sm sm:text-base text-slate-500 text-center mt-3 max-w-2xl mx-auto">
            Your AI-powered health companion - empowering you to take control of your wellness journey with intelligent insights and personalized care.
          </p>
          
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-center gap-8 lg:gap-12 px-4 md:px-0 py-12 md:py-16">
            {/* Decorative Blur Effect */}
            <div className="size-[400px] md:size-[520px] rounded-full absolute blur-[200px] md:blur-[300px] -z-10 bg-gradient-to-r from-primary-100 to-green-100 opacity-60"></div>
            
            <img 
              className="max-w-sm w-full rounded-xl h-auto shadow-2xl object-cover"
              src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=830&h=844&auto=format&fit=crop"
              alt="Healance Health Platform" 
            />
            
            <div className="max-w-xl">
              <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900">Our Latest Features</h2>
              <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
                Experience next-generation healthcare with AI-driven predictions, personalized wellness tracking, and seamless health management — all in one platform.
              </p>
          
              <div className="flex flex-col gap-8 sm:gap-10 mt-8">
                <div className="flex items-start gap-4">
                  <div className="size-10 sm:size-11 p-2 bg-primary-50 border border-primary-200 rounded-lg flex-shrink-0">
                    <img src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/aboutSection/flashEmoji.png" alt="AI Predictions" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-slate-800">AI-Powered Health Predictions</h3>
                    <p className="text-sm sm:text-base text-slate-600 mt-1">Advanced machine learning analyzes your health data to predict risks and provide early warnings.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="size-10 sm:size-11 p-2 bg-green-50 border border-green-200 rounded-lg flex-shrink-0">
                    <img src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/aboutSection/colorsEmoji.png" alt="Health Dashboard" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-slate-800">Comprehensive Health Dashboard</h3>
                    <p className="text-sm sm:text-base text-slate-600 mt-1">Track vitals, analyze trends, and visualize your wellness journey with beautiful, intuitive charts.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="size-10 sm:size-11 p-2 bg-blue-50 border border-blue-200 rounded-lg flex-shrink-0">
                    <img src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/aboutSection/puzzelEmoji.png" alt="Integration" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-slate-800">Seamless Wearable Integration</h3>
                    <p className="text-sm sm:text-base text-slate-600 mt-1">Connect with Apple Watch, Fitbit, Garmin and more to automatically sync your health data.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 mb-3 sm:mb-4">Frequently Asked Questions</h1>
          <p className="text-sm sm:text-base text-slate-600">
            Everything you need to know about Healance and how we protect your health data.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 px-4 sm:px-8 py-2 sm:py-4">
          {faqs.map((faq, index) => (
            <FAQItem key={index} {...faq} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
