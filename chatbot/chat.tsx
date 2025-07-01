import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';

// Replace with your Gemini API endpoint and key
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
const GEMINI_API_KEY = "  XYZ  "; 
interface Message {
  sender: 'user' | 'bot';
  text: string;
}

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: input }] }],
        }),
      });
      const data = await response.json();
      const botText = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not understand.';
      setMessages((prev) => [...prev, { sender: 'bot', text: botText }]);
    } catch (err) {
      setMessages((prev) => [...prev, { sender: 'bot', text: 'Error contacting Gemini API.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(e as any);
    }
  };

  return (
    <div
      className="w-[360px] max-w-full h-[500px] flex flex-col mx-auto p-0 bg-white/80 rounded-2xl shadow-2xl border border-blue-100 backdrop-blur-md"
      style={{ background: 'linear-gradient(135deg, #f0f4ff 0%, #e0e7ff 100%)' }}
    >
      <style dangerouslySetInnerHTML={{
        __html: `
          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #DBEAFE;
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #93C5FD;
            border-radius: 10px;
            border: 1px solid #DBEAFE;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #60A5FA;
          }
          .custom-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: #93C5FD #DBEAFE;
          }
        `
      }} />
      
      <div className="flex items-center gap-2 px-4 py-3 border-b border-blue-100 bg-blue-50 rounded-t-2xl">
        <MessageCircle className="w-6 h-6 text-blue-500" />
        <h2 className="text-lg font-bold text-blue-800">Gemini Chatbot</h2>
      </div>
      
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto border-x border-b border-blue-100 p-4 bg-white/60 rounded-b-2xl scroll-smooth transition-all duration-300 custom-scrollbar"
      >
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex mb-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.sender === 'bot' && (
              <div className="flex-shrink-0 w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center mr-2">
                <MessageCircle className="w-5 h-5 text-blue-600" />
              </div>
            )}
            <span className={`inline-block px-4 py-2 rounded-2xl shadow text-base max-w-xs break-words ${msg.sender === 'user' ? 'bg-blue-500 text-white rounded-br-md' : 'bg-gray-100 text-gray-900 rounded-bl-md'}`}>
              {msg.text}
            </span>
            {msg.sender === 'user' && (
              <div className="flex-shrink-0 w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center ml-2 text-white font-bold">U</div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-blue-500 animate-pulse">
            <MessageCircle className="w-5 h-5" /> 
            Gemini is typing...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="flex gap-2 px-4 py-3 bg-blue-50 rounded-b-2xl border-t border-blue-100">
        <input
          className="flex-1 border-none outline-none rounded-full px-4 py-2 bg-white/80 shadow-inner focus:ring-2 focus:ring-blue-300 transition"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          disabled={loading}
        />
        <button
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-5 py-2 rounded-full shadow font-semibold hover:from-blue-600 hover:to-blue-700 transition disabled:opacity-50"
          onClick={sendMessage}
          disabled={loading || !input.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;