import React, { useState } from 'react';
import { Send, Bot, Pill, User, Info, Loader2 } from 'lucide-react';
import Button from '../components/ui/Button';
import { chatbotService } from '../services/api';

const AIChatbots = () => {
  const [activeTab, setActiveTab] = useState('health');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'Hello! I am your AI Health Assistant. How can I help you today?', botType: 'health' },
    { type: 'bot', text: 'I can provide detailed information about medicines using FDA database. Just type the medicine name (e.g., aspirin, ibuprofen, metformin).', botType: 'medicine' }
  ]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const userMessage = input.trim();
    const newMessages = [...messages, { type: 'user', text: userMessage, botType: activeTab }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      // Call backend API to get real FDA data
      const response = await chatbotService.sendMessage({
        message: userMessage,
        botType: activeTab,
        sessionId: sessionId
      });

      if (response.success) {
        // Update session ID if this is the first message
        if (!sessionId && response.sessionId) {
          setSessionId(response.sessionId);
        }

        // Add bot response
        setMessages(prev => [...prev, { 
          type: 'bot', 
          text: response.response, 
          botType: activeTab 
        }]);
      } else {
        throw new Error(response.message || 'Failed to get response');
      }
    } catch (error) {
      console.error('Chatbot error:', error);
      // Show error message
      setMessages(prev => [...prev, { 
        type: 'bot', 
        text: `Sorry, I encountered an error: ${error.message}. Please try again.`, 
        botType: activeTab 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const filteredMessages = messages.filter(m => m.botType === activeTab);

  // Simple markdown-like text renderer for medicine info
  const renderMessage = (text) => {
    if (typeof text !== 'string') return text;
    
    // Split by lines and format
    const lines = text.split('\n').map((line, idx) => {
      // Check for bold markers
      const hasBold = line.includes('**');
      
      if (hasBold) {
        // Split and render bold text
        const parts = line.split('**');
        return (
          <div key={idx} className={line.startsWith('━') ? 'text-slate-400' : ''}>
            {parts.map((part, i) => 
              i % 2 === 1 ? <strong key={i} className="font-bold text-slate-900">{part}</strong> : part
            )}
          </div>
        );
      } else if (line.startsWith('•')) {
        // Bullet point
        return <div key={idx} className="ml-2">{line}</div>;
      } else if (line.startsWith('✓') || line.startsWith('❌')) {
        // Special markers
        return <div key={idx} className="font-medium">{line}</div>;
      } else if (line.trim() === '') {
        // Empty line
        return <div key={idx} className="h-2"></div>;
      } else {
        // Regular line
        return <div key={idx}>{line}</div>;
      }
    });
    
    return <div className="space-y-1 font-mono text-sm leading-relaxed">{lines}</div>;
  };

  return (
    <div className="h-[calc(100vh-10rem)] sm:h-[calc(100vh-8rem)] flex flex-col bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-slate-100">
        <button 
          onClick={() => setActiveTab('health')}
          className={`flex-1 py-3 sm:py-4 text-xs sm:text-sm font-medium flex items-center justify-center gap-1.5 sm:gap-2 transition-colors ${activeTab === 'health' ? 'bg-primary-50 text-primary-600 border-b-2 border-primary-500' : 'text-slate-600 hover:bg-slate-50'}`}
        >
          <Bot size={16} className="sm:w-[18px] sm:h-[18px]" /> <span className="hidden xs:inline">Health</span> Assistant
        </button>
        <button 
          onClick={() => setActiveTab('medicine')}
          className={`flex-1 py-3 sm:py-4 text-xs sm:text-sm font-medium flex items-center justify-center gap-1.5 sm:gap-2 transition-colors ${activeTab === 'medicine' ? 'bg-primary-50 text-primary-600 border-b-2 border-primary-500' : 'text-slate-600 hover:bg-slate-50'}`}
        >
          <Pill size={16} className="sm:w-[18px] sm:h-[18px]" /> <span className="hidden xs:inline">Medicine</span> Info
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 p-3 sm:p-6 overflow-y-auto space-y-3 sm:space-y-4 bg-slate-50/50">
        {filteredMessages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[90%] sm:max-w-[85%] gap-2 sm:gap-3 ${msg.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.type === 'user' ? 'bg-slate-200' : 'bg-primary-100 text-primary-600'}`}>
                {msg.type === 'user' ? <User size={14} /> : (activeTab === 'health' ? <Bot size={14} /> : <Pill size={14} />)}
              </div>
              <div className={`p-3 sm:p-4 rounded-2xl text-xs sm:text-sm ${msg.type === 'user' ? 'bg-primary-600 text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none shadow-sm'}`}>
                {renderMessage(msg.text)}
              </div>
            </div>
          </div>
        ))}
        
        {/* Loading indicator */}
        {loading && (
          <div className="flex justify-start">
            <div className="flex max-w-[80%] gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-primary-100 text-primary-600">
                {activeTab === 'health' ? <Bot size={16} /> : <Pill size={16} />}
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200 rounded-tl-none shadow-sm">
                <Loader2 size={16} className="animate-spin text-primary-600" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-3 sm:p-4 bg-white border-t border-slate-100">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !loading && handleSend()}
            placeholder={activeTab === 'health' ? "Ask about symptoms..." : "Enter medicine name..."}
            disabled={loading}
            className={`flex-1 px-3 sm:px-4 py-2.5 sm:py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          />
          <Button onClick={handleSend} disabled={loading} className="px-3 sm:px-4">
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AIChatbots;
