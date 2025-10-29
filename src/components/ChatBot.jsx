import { useState, useEffect, useRef } from 'react';
import { generateAIResponse } from '../lib/ai';
import TrendChart from './TrendChart'

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [userData, setUserData] = useState(null);
  const [trends, setTrends] = useState([]);
  const [community, setCommunity] = useState([]);
  const chatEndRef = useRef(null);
  // Local storage key for AI coach conversation
  const CONVO_KEY = 'sherise_ai_conversation'
  const BOT_AVATAR = '/ai-coach.svg'
  const [model, setModel] = useState('Sherise-v1')
  const [isTyping, setIsTyping] = useState(false)

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, trendsRes, communityRes] = await Promise.all([
          fetch('/users.json'),
          fetch('/trends.json'),
          fetch('/community.json')
        ]);
        
        const users = await usersRes.json();
        const trendsData = await trendsRes.json();
        const communityData = await communityRes.json();

        setUserData(users[0]); // Using first user as current user
        setTrends(trendsData);
        setCommunity(communityData);

        // Add welcome message
        setMessages([{
          type: 'bot',
          content: `Hi ${users[0].name}! I'm your AI business coach. How can I help you grow your ${users[0].business} business today?`
        }]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // load saved conversation if present
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(CONVO_KEY) || 'null')
      if (Array.isArray(saved) && saved.length) {
        setMessages(saved)
      }
    } catch {}
  }, [])

 const buildPrompt = (message) => {
  return `
You are "Sherise", an AI mentor for women entrepreneurs. 
Be concise, empathetic, and motivational. 
Format your reply using short paragraphs and clear bullet points (use • for bullets).

User details:
- Business type: ${userData?.business}
- Bio: ${userData?.bio}

Relevant trends: ${
    trends
      .filter(t => {
        const biz = (userData?.business || '').toLowerCase()
        return (t.category || '').toLowerCase().includes(biz)
      })
      .map(t => t.name)
      .join(', ') || "None found"
  }

User query: "${message}"

Respond in under 120 words.
End with an encouraging line like “You’re doing great — let’s build this together 💪”.
`;
};


  const checkForCollaboration = (message) => {
    const collaborationKeywords = ['partner', 'hire', 'collaborate', 'team up', 'join'];
    return collaborationKeywords.some(keyword => message.toLowerCase().includes(keyword));
  };

  const handleSend = async () => {
    if (!inputMessage.trim()) return;

    const newMessages = [...messages, { type: 'user', content: inputMessage }];
    setMessages(newMessages);
    setInputMessage('');

    try {
      // Prepare response based on message content
      let response = '';

      // Check for collaboration keywords
      if (checkForCollaboration(inputMessage)) {
        const relevantPartners = community
          .filter(member => member.name !== userData?.name)
          .slice(0, 3);
        
        response = `Let me help you find potential collaborators!\n\nHere are some entrepreneurs you might want to connect with:\n\n${
          relevantPartners.map(partner => 
            `• ${partner.name} from ${partner.city} - ${partner.product}`
          ).join('\n')
        }\n\nWould you like specific advice about approaching these potential partners?`;
      } else {
        // Use the AI service for response generation
        response = await generateAIResponse(buildPrompt(inputMessage));
      }

      setMessages([...newMessages, { type: 'bot', content: response }]);
    } catch (error) {
      console.error('Error generating response:', error);
      setMessages([...newMessages, { 
        type: 'bot', 
        content: 'I apologize, but I encountered an error. Please try again.' 
      }]);
    }
  };
  
  // persist conversation on change
  useEffect(() => {
    try { localStorage.setItem(CONVO_KEY, JSON.stringify(messages)) } catch {}
  }, [messages])

  const handleClear = () => {
    setMessages([])
    try { localStorage.removeItem(CONVO_KEY) } catch {}
  }

  const quickSuggestions = [
    'How can I price my products for local markets?',
    'Ideas to grow social media with small budget',
    'How to approach a shop for wholesale?'
  ]

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm border-b">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-20 h-20 rounded-2xl bg-pastel-lavender overflow-hidden flex-shrink-0 shadow-md">
              <img src={BOT_AVATAR} alt="coach" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-slate-800">AI Business Coach</h3>
                <span className="text-xs text-slate-500">· {userData?.business || 'Your business coach'}</span>
              </div>
              <p className="text-sm text-slate-500">Concise, empathetic advice to grow your business</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select value={model} onChange={e=>setModel(e.target.value)} className="text-sm border rounded px-3 py-1">
              <option>Sherise-v1</option>
              <option>Advice-lite</option>
              <option>Strategy-pro</option>
            </select>
            <button onClick={handleClear} className="text-sm px-3 py-1 rounded bg-white border hover:bg-gray-50">New</button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto flex-1 w-full flex flex-col">
        {/* Chat area */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-slate-500 mt-8">No conversation yet — ask your coach a question to get started.</div>
              )}

              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {message.type === 'bot' && (
                    <div className="mr-4 w-14 h-14 rounded-full overflow-hidden flex-shrink-0 shadow-sm">
                      <img src={BOT_AVATAR} alt="bot" className="w-full h-full object-cover" />
                    </div>
                  )}

                  <div className={`max-w-[78%] ${message.type === 'user' ? 'rounded-2xl p-3 bg-pink-500 text-white' : 'rounded-3xl p-4 bg-white shadow-md'}`}>
                    <div className="text-base whitespace-pre-wrap leading-relaxed" dangerouslySetInnerHTML={{ __html: message.content.replace(/\n/g, '<br/>').replace(/•/g, '•&nbsp;').replace(/\*(.*?)\*/g, '<strong>$1</strong>') }} />
                    <div className="text-xs text-slate-400 mt-2 text-right">{message.ts ? new Date(message.ts).toLocaleTimeString() : ''}</div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-start">
                  <div className="mr-3 w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                    <img src="/avatar-mock.svg" alt="bot" className="w-full h-full object-cover" />
                  </div>
                  <div className="bg-white shadow-md rounded-2xl p-3">
                    <div className="flex gap-1 items-center">
                      <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse inline-block" />
                      <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse inline-block" />
                      <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse inline-block" />
                    </div>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Composer + quick suggestions */}
            <div className="border-t bg-white p-4">
              <div className="flex gap-2 mb-3 overflow-x-auto">
                {quickSuggestions.map((s, i) => (
                  <button key={i} onClick={()=>{ setInputMessage(s); setTimeout(()=>handleSend(), 120) }} className="text-sm bg-gray-100 px-3 py-1 rounded-full whitespace-nowrap hover:bg-gray-200">{s}</button>
                ))}
              </div>

              <div className="flex gap-2 items-end">
                <textarea
                  rows={2}
                  value={inputMessage}
                  onChange={(e)=>setInputMessage(e.target.value)}
                  onKeyDown={(e)=>{
                    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
                  }}
                  placeholder="Ask your coach — press Enter to send, Shift+Enter for newline"
                  className="flex-1 rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pastel-lavender resize-none"
                />
                <div className="flex-shrink-0">
                  <button onClick={handleSend} className="bg-pink-500 text-white rounded-xl px-5 py-2 hover:bg-pink-600 transition">Send</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trends section below chatbot */}
        <div className="p-4">
          <TrendChart />
        </div>
      </div>
    </div>
  )
};

export default ChatBot;