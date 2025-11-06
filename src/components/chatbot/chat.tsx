import React, { useEffect, useState, useRef } from 'react';
import { Mic, MessageCircle, X, ShoppingCart, ChefHat, Search, Sparkles } from 'lucide-react';
import Papa from 'papaparse';
import rawCsv from '../../components/chatbot/database/data.csv?raw';


const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
const GEMINI_API_KEY = 'AIzaSyBKvcXVPQ09IIp3P4QBfvAj2E6YDPxhWKM'; // Replace with your actual API key

// Sample CSV data for demonstration

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
  const [isOpen, setIsOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
    // Stop any current speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 1;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  };

  // Stop speech
  const stopSpeech = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
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
                  text: `You are an AI assistant for a grocery store, here to help customers with their shopping. Your primary goal is to provide accurate and helpful information *strictly* based on the provided "Store Inventory, Do no tell the coordinates of the item" data.

Here are your guidelines:

* **Information Source:** Only use the "Store Inventory" data to answer questions. Do not bring in external information or make assumptions.
* **Customer Interaction:**
    * Maintain a friendly and interactive tone.
    * When answering a question, use clear and concise bullet points.
    * If a customer asks about an item not in stock, suggest an alternate if available in the inventory, or inform them that the item will be available in 2-3 days.
    * Always mention the location of an item if it's available in the inventory.
* **Deals and Promotions:** If asked about deals, present them in a clear, easy-to-read table format. Ensure the table is well-structured and displays all relevant deal information from the "Store Inventory."
* **Formatting Rules:**
    * Do not use any asterisks (*) or hyphens (-) for bullet points or emphasis. Use standard bullet points.
    * Do not bold any text in your responses.
    * Do not include any introductory or concluding conversational fillers unless it's a direct response to a question (e.g., "Sure, I can help with that!").
* **Out-of-Scope Questions:** If a question is unrelated to the store's inventory, products, or deals, politely decline to answer. For example, you could say: "I apologize, but my purpose is to assist with grocery store-related inquiries only."

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

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const quickActions = [
    { icon: Search, text: "May I help you find your items?", action: () => sendMessage("Help me find items") },
    { icon: ChefHat, text: "Make a meal in budget", action: () => sendMessage("Help me make a meal in budget") },
    { icon: ShoppingCart, text: "Show me today's deals", action: () => sendMessage("What deals do you have today?") },
    { icon: Sparkles, text: "Suggest something special", action: () => sendMessage("What do you recommend?") }
  ];

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {/* Floating Icon */}
      {!isOpen && (
        <div className="relative group">
          {/* Pulsing background effect */}
          <div className="absolute inset-0 w-20 h-20 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full animate-pulse opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
          
          {/* Main floating button */}
          <button
            onClick={toggleChatbot}
            className="relative w-20 h-20 bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-700 hover:from-violet-600 hover:via-purple-700 hover:to-indigo-800 text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 active:scale-95 group border-4 border-white/20 hover:border-white/30"
            style={{
              boxShadow: '0 20px 40px rgba(124, 58, 237, 0.4), 0 10px 20px rgba(124, 58, 237, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
            }}
          >
            {/* Animated message icon */}
            <div className="relative">
              <MessageCircle className="w-10 h-10 group-hover:animate-bounce" />
              {/* Floating dots animation */}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-300 rounded-full animate-ping"></div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full"></div>
            </div>
            
            {/* Shine effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
          
          {/* Notification badge */}
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white animate-bounce">
            <span className="text-white text-sm font-bold">?</span>
          </div>
          
          {/* Floating text hint */}
          <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 -translate-x-full opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
            <div className="bg-gray-900 text-white px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap shadow-lg">
              Need help shopping?
              <div className="absolute top-1/2 -right-1 w-2 h-2 bg-gray-900 transform rotate-45 -translate-y-1/2"></div>
            </div>
          </div>
        </div>
      )}

      {/* Chat Interface */}
      {isOpen && (
        <div className="w-96 h-[32rem] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden transform transition-all duration-300 animate-in slide-in-from-bottom-4">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold">Store Assistant</h2>
                <p className="text-sm text-emerald-100">Here to help you shop!</p>
              </div>
            </div>
            <button
              onClick={toggleChatbot}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="h-80 overflow-y-auto p-4 bg-gray-50">
            {messages.length === 0 && (
              <div className="space-y-4">
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShoppingCart className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Welcome to FreshMart!</h3>
                  <p className="text-gray-600 text-sm">I'm here to help you with your shopping needs</p>
                </div>
                
                <div className="space-y-2">
                  {quickActions.map((action, idx) => (
                    <button
                      key={idx}
                      onClick={action.action}
                      className="w-full flex items-center gap-3 p-3 text-left bg-white hover:bg-emerald-50 rounded-lg border border-gray-200 hover:border-emerald-300 transition-all duration-200 group"
                    >
                      <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                        <action.icon className="w-4 h-4 text-emerald-600" />
                      </div>
                      <span className="text-gray-700 group-hover:text-emerald-700 font-medium">{action.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex mb-4 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.sender === 'bot' && (
                  <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center mr-3">
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                  </div>
                )}
                <div className={`max-w-xs px-4 py-2 rounded-2xl shadow-sm ${
                  msg.sender === 'user' 
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-br-md' 
                    : 'bg-white text-gray-800 rounded-bl-md border border-gray-200'
                }`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  {msg.sender === 'bot' && isSpeaking && (
                    <button
                      onClick={stopSpeech}
                      className="mt-2 text-xs text-emerald-600 hover:text-emerald-700 underline"
                    >
                      Stop speaking
                    </button>
                  )}
                </div>
                {msg.sender === 'user' && (
                  <div className="flex-shrink-0 w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center ml-3">
                    <span className="text-white text-xs font-bold">U</span>
                  </div>
                )}
              </div>
            ))}
            
            {loading && (
              <div className="flex items-center gap-3 text-emerald-600 mb-4">
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 animate-pulse" />
                </div>
                <div className="bg-white px-4 py-2 rounded-2xl border border-gray-200">
                  <div className="flex items-center gap-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-sm text-gray-600">Typing...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-gray-200">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  className="w-full border border-gray-300 rounded-full px-4 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about products, deals, or recipes..."
                  disabled={loading}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      sendMessage();
                    }
                  }}
                />
                <button
                  type="button"
                  onMouseDown={startListening}
                  onMouseUp={stopListening}
                  onTouchStart={startListening}
                  onTouchEnd={stopListening}
                  className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 rounded-full transition-all duration-200 ${
                    listening 
                      ? 'bg-red-100 text-red-600 animate-pulse' 
                      : 'bg-gray-100 hover:bg-emerald-100 text-gray-600 hover:text-emerald-600'
                  }`}
                  title="Hold to speak"
                >
                  <Mic className="w-4 h-4" />
                </button>
              </div>
              
              {/* Stop Speech Button */}
              {isSpeaking && (
                <button
                  onClick={stopSpeech}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full font-medium transition-all duration-200 transform hover:scale-105 active:scale-95"
                  title="Stop speaking"
                >
                  Stop
                </button>
              )}
              <button
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-6 py-2 rounded-full font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                onClick={sendMessage}
                disabled={loading || !input.trim()}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
