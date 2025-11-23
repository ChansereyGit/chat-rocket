import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Input from '../../../components/ui/Input';

const Sidebar = ({ 
  conversations, 
  users, 
  activeConversation, 
  onConversationSelect, 
  onSearchUsers,
  currentUser,
  isMobileOpen,
  onMobileClose,
  loading
}) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('conversations');

  const filteredConversations = conversations?.filter(conv =>
    conv?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    conv?.lastMessage?.toLowerCase()?.includes(searchQuery?.toLowerCase())
  );

  const filteredUsers = users?.filter(user =>
    user?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInHours = (now - messageTime) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return messageTime?.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    } else {
      return messageTime?.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onMobileClose}
        />
      )}
      {/* Sidebar - Fixed, no scrolling */}
      <div className={`
        fixed inset-y-0 left-0 z-50
        w-80 bg-white border-r border-gray-200 flex flex-col
        transform transition-transform duration-300 ease-in-out lg:transform-none
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header - Fixed height */}
        <div className="flex-shrink-0 p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold text-gray-900">ChatFlow</h1>
            <button
              onClick={onMobileClose}
              className="lg:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <Icon name="X" size={20} />
            </button>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Input
              type="search"
              placeholder={activeTab === 'conversations' ? 'Search conversations...' : 'Search users...'}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e?.target?.value);
                if (activeTab === 'users' && onSearchUsers) {
                  onSearchUsers(e?.target?.value);
                }
              }}
              className="pl-10"
            />
            <Icon 
              name="Search" 
              size={16} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
          </div>
        </div>

        {/* Tabs - Fixed height */}
        <div className="flex-shrink-0 flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('conversations')}
            className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'conversations' ?'border-blue-600 text-blue-600' :'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Conversations
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'users' ?'border-blue-600 text-blue-600' :'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Users
          </button>
        </div>

        {/* Content - Scrollable area */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {activeTab === 'conversations' ? (
            <div className="p-2">
              {filteredConversations?.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Icon name="MessageCircle" size={48} className="mx-auto mb-2 text-gray-300" />
                  <p>No conversations found</p>
                </div>
              ) : (
                filteredConversations?.map((conversation) => (
                  <button
                    key={conversation?.id}
                    onClick={() => onConversationSelect(conversation)}
                    className={`w-full p-3 rounded-lg text-left hover:bg-gray-50 transition-colors mb-1 ${
                      activeConversation?.id === conversation?.id ? 'bg-blue-50 border border-blue-200' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <Image
                          src={conversation?.avatar}
                          alt={conversation?.avatarAlt}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(conversation?.status)}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-gray-900 truncate">{conversation?.name}</h3>
                          <span className="text-xs text-gray-500">{formatTime(conversation?.lastMessageTime)}</span>
                        </div>
                        <p className="text-sm text-gray-600 truncate">{conversation?.lastMessage}</p>
                        {conversation?.unreadCount > 0 && (
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs text-gray-500">
                              {conversation?.isTyping ? (
                                <span className="flex items-center">
                                  <span className="typing-dots">
                                    <span className="typing-dot"></span>
                                    <span className="typing-dot"></span>
                                    <span className="typing-dot"></span>
                                  </span>
                                  <span className="ml-2">typing...</span>
                                </span>
                              ) : (
                                ''
                              )}
                            </span>
                            <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                              {conversation?.unreadCount}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          ) : (
            <div className="p-2">
              {filteredUsers?.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Icon name="Users" size={48} className="mx-auto mb-2 text-gray-300" />
                  <p>No users found</p>
                </div>
              ) : (
                filteredUsers?.map((user) => (
                  <button
                    key={user?.id}
                    onClick={() => onConversationSelect(user)}
                    className="w-full p-3 rounded-lg text-left hover:bg-gray-50 transition-colors mb-1"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <Image
                          src={user?.avatar}
                          alt={user?.avatarAlt}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(user?.status)}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{user?.name}</h3>
                        <p className="text-sm text-gray-600 capitalize">{user?.status}</p>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Current User Profile - Fixed at bottom, NOT scrollable */}
        <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-white z-10">
          <button
            onClick={() => navigate('/user-profile-settings')}
            className="w-full flex items-center space-x-3 hover:bg-gray-50 rounded-lg p-2 transition-colors"
          >
            <div className="relative flex-shrink-0">
              <Image
                src={currentUser?.avatar}
                alt={currentUser?.avatarAlt}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(currentUser?.status)}`} />
            </div>
            <div className="flex-1 min-w-0 text-left">
              <h3 className="font-medium text-gray-900 truncate">{currentUser?.name}</h3>
              <p className="text-sm text-gray-600 capitalize">{currentUser?.status}</p>
            </div>
            <Icon name="Settings" size={20} className="text-gray-400 flex-shrink-0" />
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;