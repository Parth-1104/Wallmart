import React, { useEffect, useState, useRef } from 'react';
import { Mic, MessageCircle } from 'lucide-react';
import Papa from 'papaparse';
import rawCsv from '../../components/chatbot/database/data.csv?raw';

const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
const GEMINI_API_KEY = 'AIzaSyC5SRkt1aEwH95h1Qn8tuBB4hXKyRpjL4A'; // Replace with your actual API key

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [csvDataFormatted, setCsvDataFormatted] = useState<string>('');
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Parse and format CSV once
  useEffect(() => {
    const parsed = Papa.parse(rawCsv, { header: true });
    const structured = parsed.data
      .map((row: any) =>
        Object.entries(row)
          .map(([key, value]) => `${key.trim()}: ${String(value).trim()}`)
          .join(', ')
      )
      .join('\n');
    setCsvDataFormatted(structured);
  }, []);

  // Text-to-speech
  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 1;
    window.speechSynthesis.speak(utterance);
  };

  // Start voice recognition
  const startListening = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Your browser does not support voice input.');
      return;
    }

    if (!recognitionRef.current) {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        sendMessage(transcript);
      };

      recognition.onerror = () => setListening(false);
      recognition.onend = () => setListening(false);

      recognitionRef.current = recognition;
    }

    recognitionRef.current.start();
    setListening(true);
  };

  // Stop voice recognition
  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setListening(false);
    }
  };

  // Send message to Gemini
  const sendMessage = async (prompt?: string) => {
    const question = prompt || input;
    if (!question.trim()) return;

    const userMessage: Message = { sender: 'user', text: question };
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
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `You are a helpful assistant for a grocery store. Only answer based on the following store data. If asked something unrelated, politely decline.

Store Inventory:
${csvDataFormatted}`,
                },
              ],
            },
            {
              role: 'user',
              parts: [{ text: question }],
            },
          ],
        }),
      });

      const data = await response.json();
      console.log('Gemini API response:', data);

      let botText = 'Sorry, I could not understand.';
      if (data?.candidates?.length > 0) {
        const parts = data.candidates[0]?.content?.parts;
        if (parts && parts.length > 0 && typeof parts[0].text === 'string') {
          botText = parts[0].text;
        }
      }

      setMessages((prev) => [...prev, { sender: 'bot', text: botText }]);
      speak(botText);
    } catch (error) {
      console.error('Gemini error:', error);
      setMessages((prev) => [...prev, { sender: 'bot', text: 'Error contacting Gemini API.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-0 bg-white/80 rounded-2xl shadow-2xl border border-blue-100 backdrop-blur-md"
      style={{ background: 'linear-gradient(135deg, #f0f4ff 0%, #e0e7ff 100%)' }}
    >
      <div className="flex items-center gap-2 px-4 py-3 border-b border-blue-100 bg-blue-50 rounded-t-2xl">
        <MessageCircle className="w-6 h-6 text-blue-500" />
        <h2 className="text-lg font-bold text-blue-800">Store Assistant</h2>
      </div>

      {/* Message history */}
      <div className="h-80 overflow-y-auto border-x border-b border-blue-100 p-4 bg-white/60 rounded-b-2xl scroll-smooth transition-all duration-300 scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-blue-50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex mb-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.sender === 'bot' && (
              <div className="flex-shrink-0 w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center mr-2">
                <MessageCircle className="w-5 h-5 text-blue-600" />
              </div>
            )}
            <span className={`inline-block px-4 py-2 rounded-2xl shadow text-base max-w-xs break-words ${msg.sender === 'user' ? 'bg-blue-500 text-white rounded-br-md' : 'bg-gray-100 text-gray-900 rounded-bl-md animate-fade-in'}`}>
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
      </div>

      {/* Input controls */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
        className="flex gap-2 px-4 py-3 bg-blue-50 rounded-b-2xl border-t border-blue-100"
      >
        <input
          className="flex-1 border-none outline-none rounded-full px-4 py-2 bg-white/80 shadow-inner focus:ring-2 focus:ring-blue-300 transition"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about a product or deal..."
          disabled={loading}
        />
        <button
          type="button"
          onMouseDown={startListening}
          onMouseUp={stopListening}
          onTouchStart={startListening}
          onTouchEnd={stopListening}
          className={`relative p-2 rounded-full transition ${
            listening ? 'bg-blue-200 animate-ping-once' : 'bg-blue-100 hover:bg-blue-200'
          }`}
          title="Hold to Speak"
        >
          <Mic className="w-5 h-5 text-blue-600" />
          {listening && (
            <div className="absolute -inset-1 rounded-full border-2 border-blue-400 animate-ping z-0"></div>
          )}
        </button>
        <button
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-5 py-2 rounded-full shadow font-semibold hover:from-blue-600 hover:to-blue-700 transition disabled:opacity-50"
          type="submit"
          disabled={loading || !input.trim()}
        >
          Send
        </button>
      </form>

      <style>{`
        @keyframes ping-once {
          0% { transform: scale(1); opacity: 1; }
          75%, 100% { transform: scale(1.5); opacity: 0; }
        }

        .animate-ping-once {
          position: relative;
          animation: ping-once 1s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Chatbot;
