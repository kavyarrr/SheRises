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
      .filter(t => t.category.toLowerCase().includes(userData?.business.toLowerCase()))
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

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-pink-600 text-white p-4 shadow-md">
        <h2 className="text-xl font-semibold">{userData?.name}</h2>
        <p className="text-sm opacity-90">{userData?.business}</p>
      </div>

      {/* Chat area - limit height to upper half of the screen and make messages scrollable */}
      <div className="max-h-[55vh] w-full flex flex-col border-b border-white/50">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[75%] rounded-lg p-3 ${
                  message.type === 'user'
                    ? 'bg-pink-500 text-white'
                    : 'bg-white shadow-md'
                }`}
              >
                <p
                  className="whitespace-pre-wrap leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: message.content
                      .replace(/\n/g, '<br/>')
                      .replace(/•/g, '•&nbsp;')
                      .replace(/\*(.*?)\*/g, '<strong>$1</strong>')
                  }}
                ></p>

              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Input Area - stay at bottom of chat box */}
        <div className="border-t border-gray-200 p-4 bg-white">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your message..."
              className="flex-1 rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:border-pink-500"
            />
            <button
              onClick={handleSend}
              className="bg-pink-500 text-white rounded-full px-6 py-2 hover:bg-pink-600 transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-white/50" />

      {/* Trends section below chatbot */}
      <div className="p-4">
        <TrendChart />
      </div>
    </div>
  );
};

export default ChatBot;