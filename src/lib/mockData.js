// Mock data for the chat application

export const mockConversations = [
  {
    id: 'conv-1',
    name: 'Sarah Johnson',
    avatar: "https://images.unsplash.com/photo-1684262855358-88f296a2cfc2",
    avatarAlt: 'Professional woman with long brown hair in white blazer smiling',
    status: 'online',
    lastMessage: 'Hey! How are you doing today?',
    lastMessageTime: new Date(Date.now() - 300000),
    unreadCount: 2,
    isTyping: false
  },
  {
    id: 'conv-2',
    name: 'Mike Chen',
    avatar: "https://images.unsplash.com/photo-1629272039203-7d76fdaf1324",
    avatarAlt: 'Asian man with short black hair in navy suit jacket',
    status: 'away',
    lastMessage: 'The project looks great! 👍',
    lastMessageTime: new Date(Date.now() - 1800000),
    unreadCount: 0,
    isTyping: false
  },
  {
    id: 'conv-3',
    name: 'Emma Wilson',
    avatar: "https://images.unsplash.com/photo-1648466982925-65dac4ed0814",
    avatarAlt: 'Young woman with blonde hair in professional attire',
    status: 'online',
    lastMessage: 'Can we schedule a meeting for tomorrow?',
    lastMessageTime: new Date(Date.now() - 3600000),
    unreadCount: 1,
    isTyping: false
  },
  {
    id: 'conv-4',
    name: 'David Rodriguez',
    avatar: "https://images.unsplash.com/photo-1627729205753-52d2ddeefce1",
    avatarAlt: 'Hispanic man with beard in casual gray shirt',
    status: 'offline',
    lastMessage: 'Thanks for the help with the code review',
    lastMessageTime: new Date(Date.now() - 7200000),
    unreadCount: 0,
    isTyping: false
  },
  {
    id: 'conv-5',
    name: 'Lisa Park',
    avatar: "https://images.unsplash.com/photo-1668049221564-862149a48e10",
    avatarAlt: 'Asian woman with short black hair in professional white shirt',
    status: 'away',
    lastMessage: 'The design mockups are ready for review',
    lastMessageTime: new Date(Date.now() - 10800000),
    unreadCount: 3,
    isTyping: false
  }
];

export const mockUsers = [
  ...mockConversations,
  {
    id: 'user-6',
    name: 'John Smith',
    avatar: "https://images.unsplash.com/photo-1633332755192-727a05c4013d",
    avatarAlt: 'Man with beard in casual attire',
    status: 'online'
  },
  {
    id: 'user-7',
    name: 'Maria Garcia',
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956",
    avatarAlt: 'Woman with curly hair smiling',
    status: 'offline'
  }
];

export const mockMessages = {
  'conv-1': [
    {
      id: 'msg-1',
      content: 'Hey Sarah! I\'m doing great, thanks for asking. How about you?',
      type: 'text',
      timestamp: new Date(Date.now() - 900000),
      senderId: 'current-user',
      status: 'read'
    },
    {
      id: 'msg-2',
      content: 'I\'m doing well too! Just finished a big project at work.',
      type: 'text',
      timestamp: new Date(Date.now() - 600000),
      senderId: 'conv-1',
      status: 'delivered'
    },
    {
      id: 'msg-3',
      content: "https://images.unsplash.com/photo-1706180484689-223b2822ec7d",
      imageAlt: 'Modern office workspace with laptop and coffee on wooden desk',
      type: 'image',
      caption: 'This is my new workspace setup!',
      timestamp: new Date(Date.now() - 300000),
      senderId: 'conv-1',
      status: 'delivered'
    },
    {
      id: 'msg-4',
      content: 'Wow, that looks amazing! Very clean and organized.',
      type: 'text',
      timestamp: new Date(Date.now() - 180000),
      senderId: 'current-user',
      status: 'sent'
    }
  ],
  'conv-2': [
    {
      id: 'msg-5',
      content: 'Thanks Mike! I really appreciate your feedback on the design.',
      type: 'text',
      timestamp: new Date(Date.now() - 1800000),
      senderId: 'current-user',
      status: 'read'
    },
    {
      id: 'msg-6',
      content: 'The project looks great! 👍',
      type: 'text',
      timestamp: new Date(Date.now() - 1700000),
      senderId: 'conv-2',
      status: 'delivered'
    }
  ],
  'conv-3': [
    {
      id: 'msg-7',
      content: 'Sure Emma, what time works best for you?',
      type: 'text',
      timestamp: new Date(Date.now() - 3600000),
      senderId: 'current-user',
      status: 'read'
    },
    {
      id: 'msg-8',
      content: 'Can we schedule a meeting for tomorrow?',
      type: 'text',
      timestamp: new Date(Date.now() - 3500000),
      senderId: 'conv-3',
      status: 'delivered'
    }
  ],
  'conv-4': [
    {
      id: 'msg-9',
      content: 'No problem David! Happy to help anytime.',
      type: 'text',
      timestamp: new Date(Date.now() - 7200000),
      senderId: 'current-user',
      status: 'read'
    }
  ],
  'conv-5': [
    {
      id: 'msg-10',
      content: 'Great! I\'ll take a look at them this afternoon.',
      type: 'text',
      timestamp: new Date(Date.now() - 10800000),
      senderId: 'current-user',
      status: 'read'
    }
  ]
};
