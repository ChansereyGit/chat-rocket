import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { friendshipAPI } from '../../../services/api';
import { Search, UserPlus, Check, X, Users, Clock, MessageCircle } from 'lucide-react';

const FriendsTab = ({ userProfile }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('friends');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [friendsList, setFriendsList] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      loadFriends();
      loadPendingRequests();
    }
  }, [user]);

  const loadFriends = async () => {
    setLoading(true);
    try {
      const friends = await friendshipAPI.getFriends();
      setFriendsList(friends || []);
    } catch (error) {
      console.error('Error loading friends:', error);
      setErrors({ general: 'Failed to load friends' });
    } finally {
      setLoading(false);
    }
  };

  const loadPendingRequests = async () => {
    try {
      const requests = await friendshipAPI.getPendingRequests();
      setPendingRequests(requests || []);
    } catch (error) {
      console.error('Error loading pending requests:', error);
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    
    if (!query?.trim()) {
      setSearchResults([]);
      return;
    }

    setSearchLoading(true);
    try {
      const results = await friendshipAPI.searchUsers(query);
      setSearchResults(results || []);
    } catch (error) {
      console.error('Error searching users:', error);
      setErrors({ search: 'Failed to search users' });
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSendFriendRequest = async (userId) => {
    try {
      await friendshipAPI.sendFriendRequest(userId);
      setSuccess('Friend request sent!');
      setTimeout(() => setSuccess(''), 3000);
      
      // Refresh search results
      if (searchQuery) {
        handleSearch(searchQuery);
      }
    } catch (error) {
      console.error('Error sending friend request:', error);
      setErrors({ general: 'Failed to send friend request' });
      setTimeout(() => setErrors({}), 3000);
    }
  };

  const handleAcceptRequest = async (friendshipId) => {
    try {
      await friendshipAPI.acceptFriendRequest(friendshipId);
      setSuccess('Friend request accepted!');
      setTimeout(() => setSuccess(''), 3000);
      
      // Reload friends and pending requests
      loadFriends();
      loadPendingRequests();
    } catch (error) {
      console.error('Error accepting friend request:', error);
      setErrors({ general: 'Failed to accept friend request' });
      setTimeout(() => setErrors({}), 3000);
    }
  };

  const handleRejectRequest = async (friendshipId) => {
    try {
      await friendshipAPI.rejectFriendRequest(friendshipId);
      setSuccess('Friend request rejected');
      setTimeout(() => setSuccess(''), 3000);
      
      // Reload pending requests
      loadPendingRequests();
    } catch (error) {
      console.error('Error rejecting friend request:', error);
      setErrors({ general: 'Failed to reject friend request' });
      setTimeout(() => setErrors({}), 3000);
    }
  };

  const handleRemoveFriend = async (friendshipId) => {
    if (!window.confirm('Are you sure you want to remove this friend?')) {
      return;
    }

    try {
      await friendshipAPI.removeFriend(friendshipId);
      setSuccess('Friend removed');
      setTimeout(() => setSuccess(''), 3000);
      
      // Reload friends list
      loadFriends();
    } catch (error) {
      console.error('Error removing friend:', error);
      setErrors({ general: 'Failed to remove friend' });
      setTimeout(() => setErrors({}), 3000);
    }
  };

  const handleMessageFriend = (friend) => {
    // Navigate to chat interface with friend data
    navigate('/main-chat-interface', {
      state: {
        selectedFriend: {
          id: friend.id,
          name: friend.fullName || friend.username,
          username: friend.username,
          avatar: friend.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(friend.fullName || friend.username)}&background=random`,
          status: friend.isOnline ? 'online' : 'offline',
          email: friend.email
        }
      }
    });
  };

  const getAvatarUrl = (user) => {
    return user?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.username || user?.fullName || 'User')}&background=random`;
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-2">Friends & Connections</h2>
        <p className="text-slate-600">Manage your friends and find new connections.</p>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-600">
          {success}
        </div>
      )}
      
      {errors?.general && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600">
          {errors?.general}
        </div>
      )}

      {/* Section Tabs */}
      <div className="flex gap-2 mb-6 border-b border-slate-200">
        <button
          onClick={() => setActiveSection('friends')}
          className={`px-4 py-2 text-sm font-medium transition-colors relative ${
            activeSection === 'friends'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>My Friends ({friendsList.length})</span>
          </div>
        </button>
        
        <button
          onClick={() => setActiveSection('pending')}
          className={`px-4 py-2 text-sm font-medium transition-colors relative ${
            activeSection === 'pending'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>Requests ({pendingRequests.length})</span>
            {pendingRequests.length > 0 && (
              <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {pendingRequests.length}
              </span>
            )}
          </div>
        </button>
        
        <button
          onClick={() => setActiveSection('search')}
          className={`px-4 py-2 text-sm font-medium transition-colors relative ${
            activeSection === 'search'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            <span>Find Friends</span>
          </div>
        </button>
      </div>

      {/* My Friends Section */}
      {activeSection === 'friends' && (
        <div>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-slate-600 mt-2">Loading friends...</p>
            </div>
          ) : friendsList.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-600 mb-2">No friends yet</p>
              <p className="text-sm text-slate-500">
                Search for users to add as friends
              </p>
              <button
                onClick={() => setActiveSection('search')}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Find Friends
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {friendsList.map((friend) => (
                <div
                  key={friend.id}
                  className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={getAvatarUrl(friend)}
                      alt={friend.username}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-medium text-slate-900">
                        {friend.fullName || friend.username}
                      </h3>
                      <p className="text-sm text-slate-600">@{friend.username}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className={`h-2 w-2 rounded-full ${
                          friend.status === 'online' ? 'bg-green-500' :
                          friend.status === 'away' ? 'bg-yellow-500' :
                          'bg-gray-400'
                        }`}></div>
                        <span className="text-xs text-slate-500 capitalize">
                          {friend.status || 'offline'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleMessageFriend(friend.friend)}
                      className="px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span className="text-sm">Message</span>
                    </button>
                    <button
                      onClick={() => handleRemoveFriend(friend.id)}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Pending Requests Section */}
      {activeSection === 'pending' && (
        <div>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-slate-600 mt-2">Loading requests...</p>
            </div>
          ) : pendingRequests.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="h-12 w-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-600 mb-2">No pending requests</p>
              <p className="text-sm text-slate-500">
                Friend requests will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingRequests.map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={getAvatarUrl(request.friend)}
                      alt={request.friend.username}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-medium text-slate-900">
                        {request.friend.fullName || request.friend.username}
                      </h3>
                      <p className="text-sm text-slate-600">@{request.friend.username}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        {request.isRequester ? 'Sent by you' : 'Wants to be your friend'}
                      </p>
                    </div>
                  </div>
                  
                  {!request.isRequester && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleAcceptRequest(request.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Check className="h-4 w-4" />
                        <span>Accept</span>
                      </button>
                      <button
                        onClick={() => handleRejectRequest(request.id)}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                  
                  {request.isRequester && (
                    <button
                      onClick={() => handleRejectRequest(request.id)}
                      className="px-4 py-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      Cancel Request
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Find Friends Section */}
      {activeSection === 'search' && (
        <div>
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search by username, name, email, or phone number..."
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Search Results */}
          {searchLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-slate-600 mt-2">Searching...</p>
            </div>
          ) : searchQuery && searchResults.length === 0 ? (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-600">No users found</p>
              <p className="text-sm text-slate-500 mt-1">
                Try searching with a different term
              </p>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="space-y-3">
              {searchResults.map((searchUser) => (
                <div
                  key={searchUser.id}
                  className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={getAvatarUrl(searchUser)}
                      alt={searchUser.username}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-medium text-slate-900">
                        {searchUser.fullName || searchUser.username}
                      </h3>
                      <p className="text-sm text-slate-600">@{searchUser.username}</p>
                      {searchUser.email && (
                        <p className="text-xs text-slate-500">{searchUser.email}</p>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        <div className={`h-2 w-2 rounded-full ${
                          searchUser.isOnline ? 'bg-green-500' : 'bg-gray-400'
                        }`}></div>
                        <span className="text-xs text-slate-500">
                          {searchUser.isOnline ? 'Online' : 'Offline'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {searchUser.isFriend ? (
                    <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-lg">
                      <Check className="h-4 w-4" />
                      <span>Friends</span>
                    </div>
                  ) : searchUser.friendshipStatus === 'PENDING' ? (
                    <div className="flex items-center gap-2 px-4 py-2 bg-yellow-50 text-yellow-600 rounded-lg">
                      <Clock className="h-4 w-4" />
                      <span>Pending</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleSendFriendRequest(searchUser.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <UserPlus className="h-4 w-4" />
                      <span>Add Friend</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-600">Search for users to add as friends</p>
              <p className="text-sm text-slate-500 mt-1">
                Enter a username, name, or email to get started
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FriendsTab;
