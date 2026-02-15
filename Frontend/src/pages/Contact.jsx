import React from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import Button from '../components/ui/Button';

const Contact = () => {
  return (
    <div className="pt-20 min-h-screen bg-slate-50">
      <div className="bg-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
          <p className="text-slate-300 max-w-2xl mx-auto">
            Have questions about our AI platform? Our team is here to help you.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info Cards */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
              <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600 mb-4">
                <Mail size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">Email Us</h3>
              <p className="text-slate-500 text-sm mb-3">For general inquiries and support</p>
              <a href="mailto:support@healance.ai" className="text-primary-600 font-medium hover:underline">support@healance.ai</a>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
              <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600 mb-4">
                <Phone size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">Call Us</h3>
              <p className="text-slate-500 text-sm mb-3">Mon-Fri from 8am to 5pm</p>
              <a href="tel:+15551234567" className="text-primary-600 font-medium hover:underline">+1 (555) 123-4567</a>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
              <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600 mb-4">
                <MapPin size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">Visit Us</h3>
              <p className="text-slate-500 text-sm mb-3">Headquarters</p>
              <p className="text-slate-800">123 Innovation Dr, Tech City, CA 94043</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 h-full">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Send us a message</h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">First Name</label>
                    <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all" placeholder="John" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
                    <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all" placeholder="Doe" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                  <input type="email" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all" placeholder="john@example.com" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                  <textarea rows="5" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all" placeholder="How can we help you?"></textarea>
                </div>

                <Button className="w-full md:w-auto">
                  Send Message <Send size={18} className="ml-2" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
