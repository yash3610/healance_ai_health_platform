import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import Button from '../../shared/ui/Button';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.message) {
      setError('Please fill in all fields');
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(`${API_URL}/contact`, formData);
      
      if (response.data.success) {
        setSuccess(true);
        setFormData({ firstName: '', lastName: '', email: '', message: '' });
      } else {
        setError(response.data.message || 'Something went wrong');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-20 min-h-screen bg-slate-50">
      <div className="bg-slate-900 text-white py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl sm:text-4xl font-bold mb-3 sm:mb-4">Get in Touch</h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
            Have questions about our AI platform? Our team is here to help you.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-16 pb-16 sm:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Contact Info Cards */}
          <div className="lg:col-span-1 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4 sm:gap-6">
            <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-slate-100">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600 mb-3 sm:mb-4">
                <Mail size={20} className="sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1">Email Us</h3>
              <p className="text-slate-500 text-xs sm:text-sm mb-2 sm:mb-3">For general inquiries and support</p>
              <a href="mailto:support@healance.ai" className="text-sm sm:text-base text-primary-600 font-medium hover:underline break-all">support@healance.ai</a>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-slate-100">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600 mb-3 sm:mb-4">
                <Phone size={20} className="sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1">Call Us</h3>
              <p className="text-slate-500 text-xs sm:text-sm mb-2 sm:mb-3">Mon-Fri from 9am to 6pm</p>
              <a href="tel:+912212345678" className="text-sm sm:text-base text-primary-600 font-medium hover:underline">+91 22 1234 5678</a>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-slate-100">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600 mb-3 sm:mb-4">
                <MapPin size={20} className="sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1">Visit Us</h3>
              <p className="text-slate-500 text-xs sm:text-sm mb-2 sm:mb-3">Headquarters</p>
              <p className="text-sm sm:text-base text-slate-800">Bandra Kurla Complex, Bandra East, Mumbai, Maharashtra 400051</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-5 sm:p-8 rounded-2xl shadow-lg border border-slate-100">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 sm:mb-6">Send us a message</h2>
              
              {/* Success Message */}
              {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3">
                  <CheckCircle size={20} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-green-800">Message sent successfully!</p>
                    <p className="text-sm text-green-700">We'll get back to you within 24 hours.</p>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                  <AlertCircle size={20} className="text-red-500 mt-0.5 flex-shrink-0" />
                  <p className="text-red-700">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5 sm:mb-2">First Name</label>
                    <input 
                      type="text" 
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all" 
                      placeholder="John" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5 sm:mb-2">Last Name</label>
                    <input 
                      type="text" 
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all" 
                      placeholder="Doe" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5 sm:mb-2">Email Address</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all" 
                    placeholder="john@example.com" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5 sm:mb-2">Message</label>
                  <textarea 
                    rows="4" 
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all resize-none" 
                    placeholder="How can we help you?"
                  ></textarea>
                </div>

                <Button type="submit" className="w-full md:w-auto" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 size={18} className="mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message <Send size={18} className="ml-2" />
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Google Map - Mumbai, Maharashtra */}
            <div className="mt-6 sm:mt-8 bg-white p-2 rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
              <div className="rounded-xl overflow-hidden">
                <iframe
                  title="Healance Office Location - Mumbai"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.0252776517986!2d72.86546731490255!3d19.063280087096446!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c8e123bfffff%3A0xf1d9a6de0ebaaf38!2sBandra%20Kurla%20Complex%2C%20Bandra%20East%2C%20Mumbai%2C%20Maharashtra%20400051!5e0!3m2!1sen!2sin!4v1708000000000!5m2!1sen!2sin"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full"
                ></iframe>
              </div>
              <div className="p-3 sm:p-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-600">
                  <MapPin size={16} className="text-primary-600" />
                  <span className="text-sm font-medium">Bandra Kurla Complex, Mumbai</span>
                </div>
                <a 
                  href="https://www.google.com/maps/place/Bandra+Kurla+Complex,+Bandra+East,+Mumbai,+Maharashtra+400051/@19.0632801,72.8654673,17z"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary-600 font-medium hover:underline"
                >
                  Get Directions
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
