import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, MessageSquare, CheckCheck, User } from 'lucide-react';
import api from '../../services/api';
import IconButton from '../ui/IconButton';
import { formatTime } from '../../utils/formatters';

const ChatWidget = ({
  bookingId,
  participantId,
  participantName,
  currentUserId,
  socket,
  onClose,
}) => {
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
        setMessages(msgRes.data || []);
      } catch (error) {
        console.error('Error initializing chat room:', error);
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

  // Auto-scroll
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

    const text = newMessage.trim();
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
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 24, scale: 0.96 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100vw-32px)] sm:w-[380px] h-[520px] max-h-[calc(100vh-100px)] rounded-2xl shadow-overlay overflow-hidden flex flex-col z-[1050] bg-surface border border-border"
    >
      {/* ── Sticky Header ────────────────────────── */}
      <div className="flex items-center justify-between p-4 border-b border-border z-10 flex-shrink-0 bg-surface">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary-subtle text-primary flex items-center justify-center font-bold text-sm shrink-0">
            {participantName?.charAt(0) || <User size={16} />}
          </div>
          <div>
            <h3 className="font-semibold text-sm text-text-primary leading-tight">
              {participantName || 'Trip Participant'}
            </h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-xs text-text-muted">Active</span>
            </div>
          </div>
        </div>

        <IconButton
          icon={X}
          variant="ghost"
          size="sm"
          ariaLabel="Close chat"
          onClick={onClose}
        />
      </div>

      {/* ── Message List ─────────────────────────── */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3 bg-background">
        <div className="flex justify-center mb-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-text-muted bg-surface border border-border px-2.5 py-0.5 rounded-full">
            Trip Messaging
          </span>
        </div>

        {messages.length === 0 && (
          <div className="py-12 text-center text-text-muted">
            <MessageSquare size={22} className="mx-auto mb-2 text-text-muted" />
            <p className="text-xs font-semibold text-text-primary">Start the conversation</p>
            <p className="text-[11px] text-text-muted mt-0.5">Coordinate pickup details directly</p>
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg, i) => {
            const isMe = msg.sender === currentUserId;

            return (
              <motion.div
                key={msg._id || i}
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`px-3.5 py-2 text-xs leading-relaxed max-w-[82%] rounded-xl shadow-subtle ${
                    isMe
                      ? 'bg-primary text-white rounded-br-xs'
                      : 'bg-surface text-text-primary border border-border rounded-bl-xs'
                  }`}
                >
                  {msg.text}
                </div>

                <div className="flex items-center gap-1 mt-1 px-1 text-[10px] text-text-muted">
                  <span>
                    {msg.createdAt ? formatTime(msg.createdAt) : ''}
                  </span>
                  {isMe && <CheckCheck size={12} className="text-primary" />}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Typing indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 text-xs text-text-muted italic pt-1"
            >
              <span>{participantName} is typing…</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} className="h-2" />
      </div>

      {/* ── Message Composer ─────────────────────── */}
      <div className="p-3 border-t border-border bg-surface flex-shrink-0">
        <form
          onSubmit={handleSendMessage}
          className={`flex items-center gap-2 p-1 rounded-lg border transition-all ${
            inputFocused
              ? 'border-primary ring-2 ring-primary/20 bg-surface'
              : 'border-border bg-background'
          }`}
        >
          <input
            type="text"
            value={newMessage}
            onChange={handleTyping}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
            placeholder="Type a message…"
            className="flex-1 bg-transparent text-text-primary text-xs px-2.5 py-1.5 focus:outline-none placeholder:text-text-muted"
          />

          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="p-2 rounded-md bg-primary text-white hover:bg-primary-hover disabled:opacity-40 transition-colors flex-shrink-0"
            aria-label="Send message"
          >
            <Send size={14} />
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default ChatWidget;
