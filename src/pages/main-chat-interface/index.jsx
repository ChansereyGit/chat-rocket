import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { mockConversations, mockUsers, mockMessages } from '../../lib/mockData';
import Sidebar from './components/Sidebar';
import MessageThread from './components/MessageThread';
import MessageInput from './components/MessageInput';
import ToastNotification from './components/ToastNotification';

const MainChatInterface = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, userProfile, loading } = useAuth();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [users, setUsers] = useState([]);
  const [loadingConversations, setLoadingConversations] = useState(false);

  // Current user from auth context
  const currentUser = userProfile ? {
    id: userProfile.id,
    name: userProfile.username || userProfile.fullName || 'You',
    avatar: userProfile.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(userProfile.username || 'User')}&background=random`,
    avatarAlt: `${userProfile.username}'s avatar`,
    status: userProfile.status || 'online'
  } : null;

  // Check authentication
  useEffect(() => {
    if (!loading && !user) {
      navigate('/authentication');
    }
  }, [user, loading, navigate]);

  // Load conversations from API when currentUser is available
  useEffect(() => {
    if (currentUser) {
      loadConversations();
      loadFriends();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.id]); // Run when currentUser becomes available

  const loadConversations = async (silent = false) => {
    if (!silent) setLoadingConversations(true);
    try {
      const { messageAPI } = await import('../../services/api');
      const apiConversations = await messageAPI.getConversations();
      
      console.log('Loaded conversations:', apiConversations);
      
      // Transform API conversations to match UI format
      const transformedConversations = (apiConversations || []).map(conv => ({
        id: conv.friend.id,
        name: conv.friend.fullName || conv.friend.username,
        avatar: conv.friend.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(conv.friend.fullName || conv.friend.username)}&background=random`,
        avatarAlt: `${conv.friend.username}'s avatar`,
        lastMessage: conv.lastMessage?.content || 'No messages yet',
        timestamp: conv.lastMessage?.createdAt ? formatTimestamp(conv.lastMessage.createdAt) : 'Now',
        lastMessageTime: conv.lastMessage?.createdAt,
        unreadCount: conv.unreadCount || 0,
        status: conv.friend.isOnline ? 'online' : 'offline',
        isOnline: conv.friend.isOnline,
        friendData: conv.friend
      }));
      
      setConversations(transformedConversations);
    } catch (error) {
      console.error('Error loading conversations:', error);
      if (!silent) setConversations([]);
    } finally {
      if (!silent) setLoadingConversations(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  // Handle friend selection from navigation state
  useEffect(() => {
    if (location.state?.selectedFriend && currentUser) {
      const friend = location.state.selectedFriend;
      
      // Check if conversation already exists
      let existingConversation = conversations.find(conv => 
        conv.id === friend.id || conv.name === friend.name
      );

      if (!existingConversation) {
        // Create new conversation for this friend
        existingConversation = {
          id: friend.id,
          name: friend.name,
          avatar: friend.avatar,
          avatarAlt: `${friend.name}'s avatar`,
          lastMessage: 'Start a conversation',
          timestamp: 'Now',
          unreadCount: 0,
          status: friend.status || 'offline',
          isOnline: friend.status === 'online',
          friendData: friend
        };

        // Add to conversations list
        setConversations(prev => [existingConversation, ...prev]);
      }

      // Set as active conversation
      setActiveConversation(existingConversation);

      // Clear navigation state
      navigate(location.pathname, { replace: true, state: {} });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state?.selectedFriend]); // Only depend on selectedFriend

  // Load conversation messages when active conversation changes
  useEffect(() => {
    if (!activeConversation || !currentUser) return;
    
    loadMessages(activeConversation.id);
    markConversationAsRead(activeConversation.id);
    setIsMobileSidebarOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeConversation?.id]); // Only depend on conversation ID, not the whole object

  // Poll for new messages in active conversation
  useEffect(() => {
    if (!activeConversation || !currentUser) return;

    const pollInterval = setInterval(() => {
      loadMessages(activeConversation.id);
    }, 3000); // Poll every 3 seconds

    return () => clearInterval(pollInterval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeConversation?.id]);

  // Poll for conversation updates (new messages from other users)
  useEffect(() => {
    if (!currentUser) return;

    const pollInterval = setInterval(() => {
      loadConversations(true); // Silent reload (no loading spinner)
      loadFriends(); // Also refresh friends list for online status
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(pollInterval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.id]);

  const loadMessages = async (friendId) => {
    try {
      const { messageAPI } = await import('../../services/api');
      const apiMessages = await messageAPI.getConversationMessages(friendId);
      
      console.log('Loaded messages:', apiMessages);
      
      // Transform API messages to match UI format
      const transformedMessages = (apiMessages || []).map(msg => ({
        id: msg.id,
        text: msg.content,
        senderId: msg.senderId,
        timestamp: new Date(msg.createdAt),
        createdAt: msg.createdAt, // Keep original timestamp string for sorting
        status: msg.isRead ? 'read' : 'delivered',
        type: msg.messageType || 'text'
      }));
      
      // Sort messages by timestamp, then by ID to ensure correct order
      transformedMessages.sort((a, b) => {
        const timeA = new Date(a.createdAt).getTime();
        const timeB = new Date(b.createdAt).getTime();
        
        // If timestamps are the same, sort by ID
        if (timeA === timeB) {
          return a.id - b.id;
        }
        
        return timeA - timeB; // Ascending order (oldest first)
      });
      
      setMessages(transformedMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
      setMessages([]);
    }
  };

  const markConversationAsRead = async (friendId) => {
    try {
      const { messageAPI } = await import('../../services/api');
      await messageAPI.markConversationAsRead(friendId);
      
      // Update the unread count in the conversations list
      setConversations(prev => prev.map(conv => 
        conv.id === friendId
          ? { ...conv, unreadCount: 0 }
          : conv
      ));
    } catch (error) {
      console.error('Error marking conversation as read:', error);
    }
  };

  // Load friends for Users tab
  const loadFriends = async () => {
    try {
      const { friendshipAPI } = await import('../../services/api');
      const friends = await friendshipAPI.getFriends();
      
      // Transform friends to match UI format
      const transformedUsers = (friends || []).map(friendship => ({
        id: friendship.friend.id,
        name: friendship.friend.fullName || friendship.friend.username,
        avatar: friendship.friend.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(friendship.friend.fullName || friendship.friend.username)}&background=random`,
        avatarAlt: `${friendship.friend.username}'s avatar`,
        status: friendship.friend.isOnline ? 'online' : 'offline',
        isOnline: friendship.friend.isOnline
      }));
      
      setUsers(transformedUsers);
    } catch (error) {
      console.error('Error loading friends:', error);
      setUsers([]);
    }
  };



  // Search users (for Users tab)
  const handleSearchUsers = (query) => {
    if (!query.trim()) {
      loadFriends(); // Reload all friends
      return;
    }

    // Filter current users list
    const filtered = users.filter(user =>
      user.name.toLowerCase().includes(query.toLowerCase())
    );
    setUsers(filtered);
  };



  // Auto-dismiss notifications
  useEffect(() => {
    notifications?.forEach((notification) => {
      setTimeout(() => {
        setNotifications((prev) =>
        prev?.filter((n) => n?.id !== notification?.id)
        );
      }, 5000);
    });
  }, [notifications]);

  const handleConversationSelect = (conversation) => {
    setActiveConversation(conversation);
  };

  const handleSendMessage = async (messageData) => {
    if (!activeConversation || !currentUser) return;

    // Extract message content (could be 'text' or 'content')
    const messageContent = messageData.text || messageData.content;
    
    if (!messageContent || !messageContent.trim()) return;

    // Optimistically add message to UI first
    const tempMessage = {
      id: `temp-${Date.now()}`,
      text: messageContent.trim(),
      senderId: currentUser.id,
      timestamp: new Date(),
      status: 'sending',
      type: messageData.type || 'text'
    };
    setMessages((prev) => [...prev, tempMessage]);

    try {
      const { messageAPI } = await import('../../services/api');
      
      // Send message to API
      const sentMessage = await messageAPI.sendMessage(
        activeConversation.id,
        messageContent.trim(),
        messageData.type || 'text'
      );

      // Update the temp message with real data
      setMessages((prev) => {
        const updated = prev.map(msg => 
          msg.id === tempMessage.id 
            ? {
                id: sentMessage.id,
                text: sentMessage.content,
                senderId: currentUser.id,
                timestamp: new Date(sentMessage.createdAt),
                createdAt: sentMessage.createdAt,
                status: 'sent',
                type: sentMessage.messageType
              }
            : msg
        );
        
        // Sort to ensure correct order (by timestamp, then by ID)
        return updated.sort((a, b) => {
          const timeA = a.createdAt ? new Date(a.createdAt).getTime() : a.timestamp.getTime();
          const timeB = b.createdAt ? new Date(b.createdAt).getTime() : b.timestamp.getTime();
          
          // If timestamps are the same, sort by ID
          if (timeA === timeB) {
            // Handle temp IDs (strings) vs real IDs (numbers)
            const idA = typeof a.id === 'string' ? 999999999 : a.id;
            const idB = typeof b.id === 'string' ? 999999999 : b.id;
            return idA - idB;
          }
          
          return timeA - timeB;
        });
      });

      // Update conversation list (but don't reload everything)
      setConversations(prev => prev.map(conv => 
        conv.id === activeConversation.id
          ? { ...conv, lastMessage: messageContent.trim(), timestamp: 'Just now' }
          : conv
      ));
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Mark message as error
      setMessages((prev) => prev.map(msg => 
        msg.id === tempMessage.id 
          ? { ...msg, status: 'error' }
          : msg
      ));
    }
  };

  const handleTyping = (isTyping) => {
    console.log('Typing status:', isTyping);
  };

  const handleNotificationDismiss = (notificationId) => {
    setNotifications((prev) =>
    prev?.filter((notification) => notification?.id !== notificationId)
    );
  };

  const handleNotificationClick = (notification) => {
    const conversation = conversations?.find((conv) => conv?.id === notification?.conversationId);
    if (conversation) {
      setActiveConversation(conversation);
    }
  };

  // Show loading state
  if (loading || !currentUser) {
    return (
      <div className="h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        conversations={conversations}
        users={users}
        activeConversation={activeConversation}
        onConversationSelect={handleConversationSelect}
        onSearchUsers={handleSearchUsers}
        currentUser={currentUser}
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
        loading={loadingConversations}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-0 lg:ml-80">
        <MessageThread
          activeConversation={activeConversation}
          messages={messages}
          currentUser={currentUser}
          onMobileMenuOpen={() => setIsMobileSidebarOpen(true)}
        />

        <MessageInput
          onSendMessage={handleSendMessage}
          onTyping={handleTyping}
          activeConversation={activeConversation}
        />
      </div>

      {/* Toast Notifications */}
      <ToastNotification
        notifications={notifications}
        onDismiss={handleNotificationDismiss}
        onNotificationClick={handleNotificationClick}
      />
    </div>
  );
};

export default MainChatInterface;