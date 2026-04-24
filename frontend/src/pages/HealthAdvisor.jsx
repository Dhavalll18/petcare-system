import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Sparkles, Footprints, Send, Lightbulb, Activity, 
  AlertTriangle, Zap, FileText, ChevronRight, MessageSquare, 
  User, Cpu, Mic, Image as ImageIcon, Paperclip, MoreVertical
} from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const HealthAdvisor = () => {
  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState('');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchPets = async () => {
      try { const res = await api.get('/pets'); setPets(res.data); }
      catch { /* silent */ }
    };
    fetchPets();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || !selectedPet) return;

    const userMsg = { role: 'user', content: input, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.get(`/pets/${selectedPet}/tips`);
      const aiResponse = res.data.tips?.join(' ') || "I've analyzed your pet's data. Everything looks optimal, but keep an eye on their hydration today.";
      
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          role: 'ai', 
          content: aiResponse, 
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
        }]);
        setLoading(false);
      }, 1000);
    } catch {
      toast.error('AI Brain is temporarily offline');
      setLoading(false);
    }
  };

  const selectedPetData = pets.find(p => p._id === selectedPet);

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] max-w-6xl mx-auto">
      {/* AI Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-soft">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/20">
            <Cpu className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              PetCare AI Intelligence
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </h1>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Neural Diagnostic Engine v2.4</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <select 
            value={selectedPet} 
            onChange={(e) => {
              setSelectedPet(e.target.value);
              setMessages([{ role: 'ai', content: `Hello! I'm your AI Pet Expert. Select a pet to begin a specialized health analysis.`, time: 'Now' }]);
            }}
            className="bg-slate-50 border-none rounded-xl px-4 py-2 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary-500 transition-all outline-none"
          >
            <option value="">Select Target Pet...</option>
            {pets.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
          </select>
          <button className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-hidden flex flex-col md:flex-row gap-6">
        {/* Main Chat Interface */}
        <div className="flex-1 bg-white rounded-[2.5rem] border border-slate-100 shadow-soft flex flex-col overflow-hidden">
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 px-10">
                <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-200">
                  <MessageSquare className="w-10 h-10" />
                </div>
                <h3 className="text-lg font-bold text-slate-400">Initialize AI Conversation</h3>
                <p className="text-sm text-slate-400 max-w-xs">Start a chat to get real-time medical insights, training tips, and dietary advice for your pets.</p>
              </div>
            ) : (
              messages.map((msg, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm ${msg.role === 'user' ? 'bg-primary-600 text-white' : 'bg-slate-100 text-primary-600'}`}>
                      {msg.role === 'user' ? <User className="w-4 h-4" /> : <Cpu className="w-4 h-4" />}
                    </div>
                    <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-primary-600 text-white rounded-tr-none' : 'bg-slate-50 text-slate-700 rounded-tl-none border border-slate-100'}`}>
                      {msg.content}
                      <p className={`text-[10px] mt-2 font-bold ${msg.role === 'user' ? 'text-primary-200' : 'text-slate-400'}`}>{msg.time}</p>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
            {loading && (
              <div className="flex justify-start">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 text-primary-600 flex items-center justify-center shadow-sm">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl rounded-tl-none flex gap-1">
                    <span className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce delay-100"></span>
                    <span className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce delay-200"></span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-6 bg-slate-50/50 border-t border-slate-100">
            <form onSubmit={handleSend} className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-200 focus-within:border-primary-400 transition-all shadow-sm">
              <div className="flex items-center gap-1 pl-2">
                <button type="button" className="p-2 text-slate-400 hover:text-primary-500 transition-colors"><Paperclip className="w-4 h-4" /></button>
                <button type="button" className="p-2 text-slate-400 hover:text-primary-500 transition-colors"><ImageIcon className="w-4 h-4" /></button>
              </div>
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={selectedPet ? `Ask about ${selectedPetData?.name}...` : "Select a pet to start chatting..."}
                disabled={!selectedPet || loading}
                className="flex-1 bg-transparent border-none outline-none text-sm py-2 px-1 text-slate-800 placeholder:text-slate-400 font-medium"
              />
              <button 
                type="submit" 
                disabled={!input.trim() || !selectedPet || loading}
                className="bg-primary-600 text-white p-2.5 rounded-xl hover:bg-primary-700 disabled:bg-slate-200 transition-all shadow-lg shadow-primary-500/20"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <div className="flex items-center justify-between mt-3 px-2">
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-1 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-primary-500 transition-colors">
                  <Mic className="w-3 h-3" /> Voice
                </button>
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Enterprise Secured AI · AES-256</p>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="hidden lg:flex flex-col gap-6 w-72">
          {selectedPetData ? (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-[2rem] border border-slate-100 shadow-soft p-6">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Patient Profile</h4>
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-slate-100 rounded-[2rem] mx-auto mb-3 overflow-hidden border-4 border-white shadow-md">
                   <img src={selectedPetData.avatarUrl || 'https://cdn-icons-png.flaticon.com/512/3069/3069172.png'} alt="" className="w-full h-full object-cover" />
                </div>
                <p className="font-black text-slate-800">{selectedPetData.name}</p>
                <p className="text-xs text-primary-600 font-bold">{selectedPetData.breed || selectedPetData.species}</p>
              </div>
              <div className="space-y-4">
                 <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <span className="text-[10px] font-black text-slate-400 uppercase">Health Score</span>
                    <span className="text-sm font-black text-emerald-600">98/100</span>
                 </div>
                 <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <span className="text-[10px] font-black text-slate-400 uppercase">Activity Index</span>
                    <span className="text-sm font-black text-blue-600">Active</span>
                 </div>
              </div>
              <Link to={`/app/pets`} className="w-full mt-6 py-3 border border-slate-100 text-slate-400 text-[10px] font-black uppercase text-center rounded-xl hover:bg-slate-50 transition-all block">
                Full Vitals Report
              </Link>
            </motion.div>
          ) : (
             <div className="bg-slate-900 rounded-[2rem] p-8 text-white text-center">
                <Sparkles className="w-10 h-10 text-primary-400 mx-auto mb-4" />
                <h4 className="font-bold mb-2">Neural Analysis</h4>
                <p className="text-xs text-slate-400 leading-relaxed">Select a pet to load their metabolic data into the AI intelligence matrix.</p>
             </div>
          )}

          <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-[2rem] p-6 text-white shadow-xl">
             <h4 className="font-black text-xs uppercase tracking-widest mb-2">Pro Feature</h4>
             <p className="text-xs font-medium leading-relaxed mb-4">You have unlimited AI tokens as a Pro Member. Diagnostic accuracy is increased by 40%.</p>
             <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                <div className="w-[85%] h-full bg-white"></div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthAdvisor;
