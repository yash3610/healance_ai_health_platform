import React from 'react';
import { Mail, Phone, Clock, MapPin, UploadCloud, Send, MessageSquare, Headphones } from 'lucide-react';
import Button from '../components/ui/Button';

const DashboardContact = () => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Support Center</h2>
          <p className="text-slate-600">Need help? Submit a ticket or contact our support team directly.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Support Form */}
        <div className="lg:col-span-2">
          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm h-full">
            <h3 className="font-bold text-lg text-slate-900 mb-6 flex items-center gap-2">
              <MessageSquare size={20} className="text-primary-500" />
              Submit a Request
            </h3>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                  <input type="text" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                  <input type="email" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all" placeholder="john@example.com" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Subject</label>
                <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all">
                  <option>General Inquiry</option>
                  <option>Technical Issue</option>
                  <option>Billing Question</option>
                  <option>Feature Request</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                <textarea rows="5" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all" placeholder="Describe your issue in detail..."></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Attachments (Optional)</label>
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors cursor-pointer">
                  <div className="bg-primary-50 p-3 rounded-full text-primary-500 mb-3">
                    <UploadCloud size={24} />
                  </div>
                  <p className="text-sm font-medium text-slate-700">Click to upload or drag and drop</p>
                  <p className="text-xs text-slate-400 mt-1">SVG, PNG, JPG or PDF (max. 10MB)</p>
                </div>
              </div>

              <div className="pt-2">
                <Button className="w-full md:w-auto">
                  Submit Ticket <Send size={18} className="ml-2" />
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Contact Info & Map */}
        <div className="space-y-6">
          {/* Contact Details Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-lg text-slate-900 mb-6 flex items-center gap-2">
              <Headphones size={20} className="text-primary-500" />
              Support Details
            </h3>
            
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="bg-blue-50 p-2.5 rounded-lg text-blue-600 mt-0.5">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Email Support</p>
                  <p className="text-slate-800 font-medium">support@healance.ai</p>
                  <p className="text-xs text-slate-500">Response time: ~2 hours</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-green-50 p-2.5 rounded-lg text-green-600 mt-0.5">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Phone Support</p>
                  <p className="text-slate-800 font-medium">+1 (555) 123-4567</p>
                  <p className="text-xs text-slate-500">Mon-Fri, 9am - 6pm EST</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-purple-50 p-2.5 rounded-lg text-purple-600 mt-0.5">
                  <Clock size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Working Hours</p>
                  <p className="text-slate-800 font-medium">09:00 AM - 06:00 PM</p>
                  <p className="text-xs text-slate-500">Weekend support available for emergencies</p>
                </div>
              </div>
            </div>
          </div>

          {/* Map Card */}
          <div className="bg-white p-2 rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="bg-slate-100 rounded-xl h-48 w-full relative overflow-hidden group">
              {/* Placeholder Map Image */}
              <img 
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt="Map Location" 
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
                  <MapPin size={16} className="text-red-500" />
                  <span className="text-xs font-bold text-slate-800">Healance HQ</span>
                </div>
              </div>
            </div>
            <div className="p-3">
              <p className="text-xs text-slate-500 text-center">123 Innovation Dr, Tech City, CA 94043</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Banner */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 text-white shadow-lg flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
        <div className="relative z-10 flex-1">
          <h3 className="text-2xl font-bold mb-2">Need Medical Advice?</h3>
          <p className="text-primary-100 mb-6 max-w-xl">
            Our support team can help with platform issues, but for medical concerns, please consult with our verified doctors or visit the nearest clinic.
          </p>
          <Button variant="secondary" className="bg-white text-primary-700 hover:bg-primary-50 border-none">
            Find a Doctor
          </Button>
        </div>
        <div className="relative z-10 hidden md:block">
          <div className="bg-white/20 backdrop-blur-md p-4 rounded-full">
            <img 
              src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80" 
              alt="Doctor" 
              className="w-24 h-24 rounded-full border-4 border-white object-cover"
            />
          </div>
        </div>
        
        {/* Decorative Circles */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
      </div>
    </div>
  );
};

export default DashboardContact;
