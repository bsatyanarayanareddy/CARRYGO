import React, { useState, useEffect, useRef } from 'react';
import { Send, Phone, Video, X, Check, CheckCheck } from 'lucide-react';
import { collection, addDoc, query, onSnapshot, orderBy, serverTimestamp, where } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../contexts/AuthContext';

const EnhancedChatWindow = ({ 
  isOpen, 
  onClose, 
  partnerId, 
  partnerName, 
  packageId,
  isDemo = false 
}) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isDemo) {
      setMessages([
        {
          id: 'demo1',
          senderId: partnerId,
          senderName: partnerName,
          text: 'Hi! I\'m interested in your package delivery. When would be the best time to pick it up?',
          timestamp: new Date(Date.now() - 120000),
          status: 'delivered'
        },
        {
          id: 'demo2',
          senderId: user?.uid || 'current-user',
          senderName: 'You',
          text: 'Hello! I\'m available for pickup between 2-5 PM today. Would that work for you?',
          timestamp: new Date(Date.now() - 60000),
          status: 'delivered'
        },
        {
          id: 'demo3',
          senderId: partnerId,
          senderName: partnerName,
          text: 'Perfect! I\'ll be ready at 3 PM. The package is well-packed and ready to go.',
          timestamp: new Date(Date.now() - 30000),
          status: 'read'
        }
      ]);
      return;
    }

    if (!user || !partnerId || !packageId) return;

    const chatId = [user.uid, partnerId].sort().join('_');
    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const q = query(
      messagesRef,
      where('packageId', '==', packageId),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate()
      }));
      setMessages(messagesData);
    });

    return unsubscribe;
  }, [user, partnerId, packageId, isDemo, partnerName]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    if (isDemo) {
      const demoMessage = {
        id: `demo-${Date.now()}`,
        senderId: user?.uid || 'current-user',
        senderName: 'You',
        text: newMessage,
        timestamp: new Date(),
        status: 'sent'
      };
      setMessages(prev => [...prev, demoMessage]);
      setNewMessage('');
      
      // Simulate partner typing and response
      setTimeout(() => setIsTyping(true), 500);
      setTimeout(() => {
        setIsTyping(false);
        const response = {
          id: `demo-response-${Date.now()}`,
          senderId: partnerId,
          senderName: partnerName,
          text: 'Thanks for the message! This is a demo response.',
          timestamp: new Date(),
          status: 'delivered'
        };
        setMessages(prev => [...prev, response]);
      }, 2000);
      return;
    }

    setSending(true);
    try {
      const chatId = [user.uid, partnerId].sort().join('_');
      const messagesRef = collection(db, 'chats', chatId, 'messages');
      
      await addDoc(messagesRef, {
        senderId: user.uid,
        senderName: user.displayName || 'User',
        text: newMessage,
        timestamp: serverTimestamp(),
        packageId: packageId,
        status: 'sent'
      });

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    return timestamp.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getMessageStatus = (status) => {
    switch (status) {
      case 'sent':
        return <Check className="h-3 w-3 text-gray-400" />;
      case 'delivered':
        return <CheckCheck className="h-3 w-3 text-gray-400" />;
      case 'read':
        return <CheckCheck className="h-3 w-3 text-blue-500" />;
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full h-[500px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-primary-600 font-semibold">
                {partnerName?.charAt(0)?.toUpperCase()}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">{partnerName}</h3>
              <p className="text-sm text-gray-600">
                {isDemo ? 'Demo Chat' : 'Package Chat'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {!isDemo && (
              <>
                <button className="p-2 text-gray-600 hover:text-primary-600 rounded-lg hover:bg-gray-100">
                  <Phone className="h-4 w-4" />
                </button>
                <button className="p-2 text-gray-600 hover:text-primary-600 rounded-lg hover:bg-gray-100">
                  <Video className="h-4 w-4" />
                </button>
              </>
            )}
            <button 
              onClick={onClose}
              className="p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => {
            const isCurrentUser = message.senderId === (user?.uid || 'current-user');
            
            return (
              <div
                key={message.id}
                className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    isCurrentUser
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <div className={`flex items-center justify-end space-x-1 mt-1 ${
                    isCurrentUser ? 'text-primary-200' : 'text-gray-500'
                  }`}>
                    <span className="text-xs">{formatTime(message.timestamp)}</span>
                    {isCurrentUser && getMessageStatus(message.status)}
                  </div>
                </div>
              </div>
            );
          })}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 px-4 py-2 rounded-lg">
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

        {/* Message Input */}
        <form onSubmit={sendMessage} className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={isDemo ? "Try typing a demo message..." : "Type a message..."}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              disabled={sending}
            />
            <button
              type="submit"
              disabled={!newMessage.trim() || sending}
              className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EnhancedChatWindow;
