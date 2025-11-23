import React, { useEffect, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const MessageThread = ({ 
  activeConversation, 
  messages, 
  currentUser,
  onMobileMenuOpen 
}) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef?.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatMessageTime = (timestamp) => {
    return new Date(timestamp)?.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const renderMessageStatus = (message) => {
    if (message?.senderId === currentUser?.id) {
      return (
        <div className="flex items-center space-x-1 mt-1">
          {message?.status === 'sent' && (
            <Icon name="Check" size={14} className="text-gray-400" />
          )}
          {message?.status === 'delivered' && (
            <div className="flex">
              <Icon name="Check" size={14} className="text-gray-400" />
              <Icon name="Check" size={14} className="text-gray-400 -ml-2" />
            </div>
          )}
          {message?.status === 'read' && (
            <div className="flex">
              <Icon name="Check" size={14} className="text-blue-600" />
              <Icon name="Check" size={14} className="text-blue-600 -ml-2" />
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  const renderMessageContent = (message) => {
    if (message?.type === 'image') {
      return (
        <div className="max-w-xs">
          <Image
            src={message?.text || message?.content}
            alt={message?.imageAlt}
            className="rounded-lg max-w-full h-auto"
          />
          {message?.caption && (
            <p className="mt-2 text-sm">{message?.caption}</p>
          )}
        </div>
      );
    }
    
    return <p className="text-sm">{message?.text || message?.content}</p>;
  };

  if (!activeConversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Icon name="MessageCircle" size={64} className="mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Welcome to ChatFlow</h3>
          <p className="text-gray-600">Select a conversation to start messaging</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-white">
        <div className="flex items-center space-x-3">
          <button
            onClick={onMobileMenuOpen}
            className="lg:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            <Icon name="Menu" size={20} />
          </button>
          
          <div className="relative">
            <Image
              src={activeConversation?.avatar}
              alt={activeConversation?.avatarAlt}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(activeConversation?.status)}`} />
          </div>
          
          <div className="flex-1">
            <h2 className="font-semibold text-gray-900">{activeConversation?.name}</h2>
            <p className="text-sm text-gray-600">
              {activeConversation?.isTyping ? (
                <span className="flex items-center">
                  <span className="typing-dots mr-2">
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                  </span>
                  typing...
                </span>
              ) : (
                <span className="capitalize">{activeConversation?.status}</span>
              )}
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
              <Icon name="Phone" size={20} />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
              <Icon name="Video" size={20} />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
              <Icon name="MoreVertical" size={20} />
            </button>
          </div>
        </div>
      </div>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages?.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="MessageCircle" size={48} className="mx-auto mb-2 text-gray-300" />
            <p className="text-gray-500">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages?.map((message) => {
            const isCurrentUser = message?.senderId === currentUser?.id;
            
            return (
              <div
                key={message?.id}
                className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${isCurrentUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  {!isCurrentUser && (
                    <Image
                      src={activeConversation?.avatar}
                      alt={activeConversation?.avatarAlt}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  )}
                  
                  <div className={`px-4 py-2 rounded-2xl ${
                    isCurrentUser 
                      ? 'bg-blue-600 text-white rounded-br-md' :'bg-gray-100 text-gray-900 rounded-bl-md'
                  }`}>
                    {renderMessageContent(message)}
                    
                    <div className={`flex items-center justify-between mt-1 ${isCurrentUser ? 'flex-row-reverse' : ''}`}>
                      <span className={`text-xs ${isCurrentUser ? 'text-blue-100' : 'text-gray-500'}`}>
                        {formatMessageTime(message?.timestamp)}
                      </span>
                      {renderMessageStatus(message)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default MessageThread;