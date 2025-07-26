import React, { useState, useEffect, useRef } from 'react';
import { Send, Phone, Video, MoreVertical, Check, CheckCheck } from 'lucide-react';
import { collection, addDoc, query, onSnapshot, orderBy, serverTimestamp, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../contexts/AuthContext';

const ChatWindow = ({ 
  chatId, 
  otherUser, 
  packageInfo, 
  isOpen, 
  onClose,
  className = "" 
}) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [typing] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!chatId || !isOpen) return;

    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messageList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      }));
      
      setMessages(messageList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [chatId, isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    const messageData = {
      text: newMessage.trim(),
      senderId: user.uid,
      senderName: user.displayName || 'User',
      createdAt: serverTimestamp(),
      read: false
    };

    try {
      const messagesRef = collection(db, 'chats', chatId, 'messages');
      await addDoc(messagesRef, messageData);
      setNewMessage('');
      
      // Update chat last message
      const chatRef = doc(db, 'chats', chatId);
      await updateDoc(chatRef, {
        lastMessage: newMessage.trim(),
        lastMessageTime: serverTimestamp(),
        [`unreadCount_${otherUser.id}`]: 1
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date) => {
    const today = new Date();
    const messageDate = new Date(date);
    
    if (messageDate.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (messageDate.toDateString() === new Date(today - 86400000).toDateString()) {
      return 'Yesterday';
    } else {
      return messageDate.toLocaleDateString();
    }
  };

  const renderMessage = (message, index) => {
    const isOwn = message.senderId === user?.uid;
    const prevMessage = messages[index - 1];
    const showDate = !prevMessage || 
      formatDate(message.createdAt) !== formatDate(prevMessage.createdAt);

    return (
      <div key={message.id}>
        {showDate && (
          <div className="flex justify-center my-4">
            <span className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-xs">
              {formatDate(message.createdAt)}
            </span>
          </div>
        )}
        
        <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-2`}>
          <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
            isOwn 
              ? 'bg-blue-500 text-white rounded-br-none' 
              : 'bg-gray-200 text-gray-800 rounded-bl-none'
          }`}>
            <p className="text-sm">{message.text}</p>
            <div className={`flex items-center justify-end mt-1 space-x-1 ${
              isOwn ? 'text-blue-100' : 'text-gray-500'
            }`}>
              <span className="text-xs">{formatTime(message.createdAt)}</span>
              {isOwn && (
                <div className="text-xs">
                  {message.read ? (
                    <CheckCheck className="h-3 w-3" />
                  ) : (
                    <Check className="h-3 w-3" />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${className}`}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md h-96 flex flex-col">
        {/* Header */}
        <div className="bg-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center">
              {otherUser?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <h3 className="font-medium">{otherUser?.name || 'User'}</h3>
              <p className="text-xs text-blue-100">
                {packageInfo ? `Package: ${packageInfo.title}` : 'Chat'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-blue-700 rounded-full transition-colors">
              <Phone className="h-4 w-4" />
            </button>
            <button className="p-2 hover:bg-blue-700 rounded-full transition-colors">
              <Video className="h-4 w-4" />
            </button>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-blue-700 rounded-full transition-colors"
            >
              <MoreVertical className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                  <Send className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-sm">No messages yet</p>
                <p className="text-xs mt-1">Start the conversation!</p>
              </div>
            </div>
          ) : (
            messages.map((message, index) => renderMessage(message, index))
          )}
          {typing && (
            <div className="flex justify-start">
              <div className="bg-gray-200 rounded-lg px-4 py-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={sendMessage} className="border-t p-4">
          <div className="flex space-x-2">
            <input
              ref={inputRef}
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
