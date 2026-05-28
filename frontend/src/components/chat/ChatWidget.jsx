import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, MessageSquare, Check, CheckCheck } from 'lucide-react';
import api from '../../services/api';

const ChatWidget = ({ bookingId, participantId, participantName, currentUserId, socket, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatId, setChatId] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [inputFocused, setInputFocused] = useState(false);
  const messagesEndRef = useRef(null);

  // Initialize Chat Room
  useEffect(() => {
    const initChat = async () => {
      try {
        const { data } = await api.post('/chat', { bookingId, participantId });
        setChatId(data._id);
        if (socket) {
          socket.emit('joinChat', data._id);
        }
        
        const msgRes = await api.get(`/chat/${data._id}`);
        setMessages(msgRes.data);
      } catch (error) {
        console.error('Error initializing chat:', error);
      }
    };
    initChat();
  }, [bookingId, participantId, socket]);

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (message) => {
      if (!chatId || message.chat !== chatId) return;
      setMessages((prev) => [...prev, message]);
    };

    const handleTyping = () => setIsTyping(true);
    const handleStopTyping = () => setIsTyping(false);

    socket.on('receiveMessage', handleReceiveMessage);
    socket.on('typing', handleTyping);
    socket.on('stopTyping', handleStopTyping);

    return () => {
      socket.off('receiveMessage', handleReceiveMessage);
      socket.off('typing', handleTyping);
      socket.off('stopTyping', handleStopTyping);
    };
  }, [socket, chatId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    if (!socket || !chatId) return;

    if (!isTyping) socket.emit('typing', chatId);
    if (typingTimeout) clearTimeout(typingTimeout);

    const timeout = setTimeout(() => socket.emit('stopTyping', chatId), 2000);
    setTypingTimeout(timeout);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !chatId) return;

    const text = newMessage;
    setNewMessage('');
    if (socket) socket.emit('stopTyping', chatId);

    try {
      const { data } = await api.post('/chat/message', { chatId, text });
      socket.emit('sendMessage', data);
      setMessages((prev) => [...prev, data]);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 30, scale: 0.95 }}
      transition={{ type: 'spring', damping: 28, stiffness: 300 }}
      className="fixed bottom-24 right-6 w-[360px] sm:w-[400px] rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col z-50 border border-white/20 dark:border-white/10"
      style={{ 
        height: '520px', 
        maxHeight: 'calc(100vh - 120px)',
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(32px) saturate(1.5)',
      }}
    >
      <div className="dark:hidden absolute inset-0 bg-white/40 pointer-events-none" />
      <div className="hidden dark:block absolute inset-0 bg-[#0c0c0c]/85 pointer-events-none" />

      {/* ── Sticky Header ────────────────────────── */}
      <div className="relative flex items-center justify-between p-4 border-b border-gray-200/50 dark:border-white/5 z-10">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white font-black text-lg shadow-inner">
            {participantName?.charAt(0) || 'U'}
          </div>
          <div>
            <h3 className="font-bold text-[15px] text-gray-900 dark:text-white leading-tight">
              {participantName || 'Driver'}
            </h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Online</span>
            </div>
          </div>
        </div>
        <button 
          onClick={onClose} 
          className="p-2.5 bg-gray-100/80 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 rounded-full transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* ── Message List ─────────────────────────── */}
      <div className="relative flex-1 overflow-y-auto p-5 space-y-5 scrollbar-none z-10">
        <div className="flex justify-center mb-6">
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 bg-gray-100/50 dark:bg-white/5 px-3 py-1 rounded-full">
            Today
          </span>
        </div>

        <AnimatePresence initial={false}>
          {messages.map((msg, i) => {
            const isMe = msg.sender === currentUserId;
            const prevMsg = messages[i - 1];
            const isConsecutive = prevMsg && prevMsg.sender === msg.sender;

            return (
              <motion.div
                key={msg._id || i}
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', damping: 25, stiffness: 400 }}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} ${isConsecutive ? 'mt-1.5' : 'mt-5'}`}
              >
                <div className="flex items-end gap-2 max-w-[80%]">
                  {!isMe && !isConsecutive && (
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-[10px] text-white font-bold flex-shrink-0 mb-1">
                      {participantName?.charAt(0) || 'U'}
                    </div>
                  )}
                  {!isMe && isConsecutive && <div className="w-6 flex-shrink-0" />}

                  <div
                    className={`px-4 py-2.5 text-[14px] leading-relaxed shadow-sm relative ${
                      isMe
                        ? 'bg-gradient-to-tr from-indigo-600 to-violet-600 text-white'
                        : 'bg-white dark:bg-[#222] text-gray-900 dark:text-gray-100 border border-gray-100 dark:border-white/5'
                    }`}
                    style={{
                      borderRadius: isMe 
                        ? (isConsecutive ? '16px 4px 4px 16px' : '16px 16px 4px 16px')
                        : (isConsecutive ? '4px 16px 16px 4px' : '16px 16px 16px 4px')
                    }}
                  >
                    {msg.text}
                  </div>
                </div>

                <div className={`flex items-center gap-1 mt-1 px-1 text-[10px] text-gray-400 dark:text-gray-500 ${isMe ? 'mr-1' : 'ml-9'}`}>
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  {isMe && <CheckCheck size={12} className="text-indigo-500 ml-0.5" />}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Typing Indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.9 }} 
              animate={{ opacity: 1, y: 0, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex items-end gap-2 mt-4"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-[10px] text-white font-bold flex-shrink-0 mb-1">
                {participantName?.charAt(0) || 'U'}
              </div>
              <div className="bg-white dark:bg-[#222] border border-gray-100 dark:border-white/5 px-4 py-3.5 rounded-2xl rounded-bl-sm shadow-sm flex items-center gap-1.5 w-16">
                <motion.span animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut" }} className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full" />
                <motion.span animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut", delay: 0.15 }} className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full" />
                <motion.span animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut", delay: 0.3 }} className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} className="h-2" />
      </div>

      {/* ── Input Footer ─────────────────────────── */}
      <div className="relative p-4 border-t border-gray-200/50 dark:border-white/5 z-10 bg-white/50 dark:bg-[#121212]/50">
        <form 
          onSubmit={handleSendMessage} 
          className={`flex items-end gap-2 p-1.5 rounded-2xl transition-all duration-300 ${
            inputFocused 
              ? 'bg-white dark:bg-[#1e1e1e] shadow-[0_0_0_2px_rgba(99,102,241,0.5)]' 
              : 'bg-gray-100 dark:bg-[#1a1a1a]'
          }`}
        >
          <input
            type="text"
            value={newMessage}
            onChange={handleTyping}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
            placeholder="Message..."
            className="flex-1 bg-transparent text-gray-900 dark:text-white text-[15px] px-3 py-2.5 focus:outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500"
          />
          <AnimatePresence>
            {newMessage.trim() ? (
              <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                whileTap={{ scale: 0.9 }}
                type="submit"
                className="p-2.5 rounded-xl bg-indigo-600 text-white shadow-md flex-shrink-0 m-0.5"
              >
                <Send size={18} className="ml-0.5" />
              </motion.button>
            ) : (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="p-2.5 text-gray-400 m-0.5"
              >
                <MessageSquare size={18} />
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
    </motion.div>
  );
};

export default ChatWidget;
