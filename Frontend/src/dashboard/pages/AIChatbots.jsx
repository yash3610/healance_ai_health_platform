import React, { useState } from 'react';
import { Send, Bot, Pill, User, Info, Loader2 } from 'lucide-react';
import Button from '../../shared/ui/Button';
import { chatbotService } from '../../services/api';

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
      const response = await chatbotService.sendMessage({
        message: userMessage,
        botType: activeTab,
        sessionId: sessionId
      });

      if (response.success) {
        if (!sessionId && response.sessionId) {
          setSessionId(response.sessionId);
        }

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

  const renderMessage = (text) => {
    if (typeof text !== 'string') return text;

    const lines = text.split('\n').map((line, idx) => {
      const hasBold = line.includes('**');

      if (hasBold) {
        const parts = line.split('**');
        return (
          <div key={idx} className={line.startsWith('━') ? 'text-[#6a7283]' : ''}>
            {parts.map((part, i) =>
              i % 2 === 1 ? <strong key={i} className="font-bold text-[#0b1030]">{part}</strong> : part
            )}
          </div>
        );
      } else if (line.startsWith('•')) {
        return <div key={idx} className="ml-2">{line}</div>;
      } else if (line.startsWith('✓') || line.startsWith('❌')) {
        return <div key={idx} className="font-medium">{line}</div>;
      } else if (line.trim() === '') {
        return <div key={idx} className="h-2"></div>;
      } else {
        return <div key={idx}>{line}</div>;
      }
    });

    return <div className="space-y-1 font-mono text-sm leading-relaxed">{lines}</div>;
  };

  return (
    <div className="h-[calc(100vh-10rem)] sm:h-[calc(100vh-8rem)] flex flex-col dash-card-static overflow-hidden !p-0">
      {/* Tabs */}
      <div className="flex border-b border-[#e8eaf9]">
        <button
          onClick={() => setActiveTab('health')}
          className={`flex-1 py-3 sm:py-4 text-xs sm:text-sm font-medium flex items-center justify-center gap-1.5 sm:gap-2 transition-colors ${activeTab === 'health' ? 'bg-[#f0f1fc] text-[#506cd7] border-b-2 border-[#506cd7]' : 'text-[#5f697a] hover:bg-[#f0f1fc]'}`}
        >
          <Bot size={16} className="sm:w-[18px] sm:h-[18px]" /> <span className="hidden xs:inline">Health</span> Assistant
        </button>
        <button
          onClick={() => setActiveTab('medicine')}
          className={`flex-1 py-3 sm:py-4 text-xs sm:text-sm font-medium flex items-center justify-center gap-1.5 sm:gap-2 transition-colors ${activeTab === 'medicine' ? 'bg-[#f0f1fc] text-[#506cd7] border-b-2 border-[#506cd7]' : 'text-[#5f697a] hover:bg-[#f0f1fc]'}`}
        >
          <Pill size={16} className="sm:w-[18px] sm:h-[18px]" /> <span className="hidden xs:inline">Medicine</span> Info
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 p-3 sm:p-6 overflow-y-auto scrollbar-hide space-y-3 sm:space-y-4 bg-[#f3f3ff]">
        {filteredMessages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[90%] sm:max-w-[85%] gap-2 sm:gap-3 ${msg.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.type === 'user' ? 'bg-[#e8eaf9]' : 'bg-[#f0f1fc] text-[#506cd7]'}`}>
                {msg.type === 'user' ? <User size={14} /> : (activeTab === 'health' ? <Bot size={14} /> : <Pill size={14} />)}
              </div>
              <div className={`p-3 sm:p-4 text-xs sm:text-sm ${msg.type === 'user' ? 'bg-primary-600 text-white rounded-2xl rounded-tr-none' : 'bg-white border border-[#e8eaf9] text-[#5f697a] rounded-[16px] rounded-tl-none'}`} style={msg.type !== 'user' ? { boxShadow: '0 10px 35px rgba(2, 6, 23, 0.08)' } : {}}>
                {renderMessage(msg.text)}
              </div>
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {loading && (
          <div className="flex justify-start">
            <div className="flex max-w-[80%] gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-[#f0f1fc] text-[#506cd7]">
                {activeTab === 'health' ? <Bot size={16} /> : <Pill size={16} />}
              </div>
              <div className="p-4 rounded-[16px] bg-white border border-[#e8eaf9] rounded-tl-none" style={{ boxShadow: '0 10px 35px rgba(2, 6, 23, 0.08)' }}>
                <Loader2 size={16} className="animate-spin text-[#506cd7]" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-3 sm:p-4 bg-white border-t border-[#e8eaf9]">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !loading && handleSend()}
            placeholder={activeTab === 'health' ? "Ask about symptoms..." : "Enter medicine name..."}
            disabled={loading}
            className={`flex-1 dash-input ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
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
