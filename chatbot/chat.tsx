import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';

// Replace with your Gemini API endpoint and key
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
const GEMINI_API_KEY = ' XYZ '; 

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

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

  return (

    <div className="max-w-md h-max-32 mx-auto p-0 bg-white/80 rounded-2xl shadow-2xl border border-blue-100 backdrop-blur-md" style={{ background: 'linear-gradient(135deg, #f0f4ff 0%, #e0e7ff 100%)' }}>
      <div className="flex items-center gap-2 px-4 py-3 border-b border-blue-100 bg-blue-50 rounded-t-2xl">
        <MessageCircle className="w-6 h-6 text-blue-500" />
        <h2 className="text-lg font-bold text-blue-800">Gemini Chatbot</h2>
      </div>
      <div className="h-80 overflow-y-auto border-x border-b border-blue-100 p-4 bg-white/60 rounded-b-2xl scroll-smooth transition-all duration-300 scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-blue-50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex mb-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.sender === 'bot' && (
              <div className="flex-shrink-0 w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center mr-2">
                <MessageCircle className="w-5 h-5 text-blue-600" />
              </div>
            )}
            <span className={`inline-block px-4 py-2 rounded-2xl shadow text-base max-w-xs break-words ${msg.sender === 'user' ? 'bg-blue-500 text-white rounded-br-md' : 'bg-gray-100 text-gray-900 rounded-bl-md animate-fade-in'}`}>{msg.text}</span>
            {msg.sender === 'user' && (
              <div className="flex-shrink-0 w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center ml-2 text-white font-bold">U</div>
            )}
          </div>
        ))}
        {loading && <div className="flex items-center gap-2 text-blue-500 animate-pulse"><MessageCircle className="w-5 h-5" /> Gemini is typing...</div>}
      </div>
      <form onSubmit={sendMessage} className="flex gap-2 px-4 py-3 bg-blue-50 rounded-b-2xl border-t border-blue-100">
        <input
          className="flex-1 border-none outline-none rounded-full px-4 py-2 bg-white/80 shadow-inner focus:ring-2 focus:ring-blue-300 transition"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={loading}
        />
        <button
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-5 py-2 rounded-full shadow font-semibold hover:from-blue-600 hover:to-blue-700 transition disabled:opacity-50"
          type="submit"
          disabled={loading || !input.trim()}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chatbot;
