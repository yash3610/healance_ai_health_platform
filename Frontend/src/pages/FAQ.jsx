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
        className="w-full py-6 flex justify-between items-center text-left focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg font-semibold text-slate-900 pr-8">{question}</span>
        {isOpen ? <ChevronUp className="text-primary-500 flex-shrink-0" /> : <ChevronDown className="text-slate-400 flex-shrink-0" />}
      </button>
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100 pb-6' : 'max-h-0 opacity-0'}`}
      >
        <p className="text-slate-600 leading-relaxed">{answer}</p>
      </div>
    </div>
  );
};

const FAQ = () => {
  return (
    <div className="pt-20 min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-slate-600">
            Everything you need to know about Healance and how we protect your health data.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 px-8 py-4">
          {faqs.map((faq, index) => (
            <FAQItem key={index} {...faq} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
