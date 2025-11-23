import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Bell, Shield, Eye, Globe, LogOut, Trash2, Download, AlertTriangle } from 'lucide-react';

const SettingsTab = ({ userProfile }) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    notifications: {
      messages: true,
      friendRequests: true,
      appUpdates: false,
      emailNotifications: true
    },
    privacy: {
      profileVisibility: 'friends', // public, friends, private
      phoneVisibility: 'friends',
      lastSeenVisibility: 'friends',
      readReceipts: true
    },
    appearance: {
      theme: 'light', // light, dark, system
      language: 'en',
      compactMode: false
    }
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleSettingChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev?.[category],
        [setting]: value
      }
    }));
    
    // Here you would typically save to backend
    console.log(`Updated ${category}.${setting} to:`, value);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/authentication');
    } catch (error) {
      console.error('Logout error:', error);
    }
    setShowLogoutConfirm(false);
  };

  const handleDeleteAccount = () => {
    // This would handle account deletion
    console.log('Delete account requested');
    setShowDeleteConfirm(false);
  };

  const handleExportData = () => {
    // This would export user data
    console.log('Export data requested');
  };

  const privacyOptions = [
    { value: 'public', label: 'Public', description: 'Visible to everyone' },
    { value: 'friends', label: 'Friends Only', description: 'Visible to your friends' },
    { value: 'private', label: 'Private', description: 'Only visible to you' }
  ];

  const themeOptions = [
    { value: 'light', label: 'Light', description: 'Light theme' },
    { value: 'dark', label: 'Dark', description: 'Dark theme' },
    { value: 'system', label: 'System', description: 'Follow system preference' }
  ];

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Español' },
    { value: 'fr', label: 'Français' },
    { value: 'de', label: 'Deutsch' },
    { value: 'zh', label: '中文' }
  ];

  return (
    <div className="max-w-3xl space-y-8">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-2">Settings & Preferences</h2>
        <p className="text-slate-600">Customize your app experience and privacy settings.</p>
      </div>

      {/* Notifications Section */}
      <div className="bg-slate-50 p-6 rounded-lg">
        <div className="flex items-center gap-3 mb-4">
          <Bell className="h-5 w-5 text-slate-600" />
          <h3 className="text-lg font-medium text-slate-900">Notifications</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-900">Message Notifications</p>
              <p className="text-sm text-slate-600">Get notified when you receive new messages</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings?.notifications?.messages}
                onChange={(e) => handleSettingChange('notifications', 'messages', e?.target?.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-900">Friend Requests</p>
              <p className="text-sm text-slate-600">Get notified about new friend requests</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings?.notifications?.friendRequests}
                onChange={(e) => handleSettingChange('notifications', 'friendRequests', e?.target?.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-900">Email Notifications</p>
              <p className="text-sm text-slate-600">Receive notifications via email</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings?.notifications?.emailNotifications}
                onChange={(e) => handleSettingChange('notifications', 'emailNotifications', e?.target?.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Privacy Section */}
      <div className="bg-slate-50 p-6 rounded-lg">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="h-5 w-5 text-slate-600" />
          <h3 className="text-lg font-medium text-slate-900">Privacy & Security</h3>
        </div>
        
        <div className="space-y-6">
          <div>
            <p className="font-medium text-slate-900 mb-2">Profile Visibility</p>
            <p className="text-sm text-slate-600 mb-3">Who can see your profile information</p>
            <div className="space-y-2">
              {privacyOptions?.map((option) => (
                <label key={option?.value} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="profileVisibility"
                    value={option?.value}
                    checked={settings?.privacy?.profileVisibility === option?.value}
                    onChange={(e) => handleSettingChange('privacy', 'profileVisibility', e?.target?.value)}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <div>
                    <p className="text-sm font-medium text-slate-900">{option?.label}</p>
                    <p className="text-xs text-slate-600">{option?.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-900">Read Receipts</p>
              <p className="text-sm text-slate-600">Let others know when you've read their messages</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings?.privacy?.readReceipts}
                onChange={(e) => handleSettingChange('privacy', 'readReceipts', e?.target?.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Appearance Section */}
      <div className="bg-slate-50 p-6 rounded-lg">
        <div className="flex items-center gap-3 mb-4">
          <Eye className="h-5 w-5 text-slate-600" />
          <h3 className="text-lg font-medium text-slate-900">Appearance & Display</h3>
        </div>
        
        <div className="space-y-6">
          <div>
            <p className="font-medium text-slate-900 mb-2">Theme</p>
            <div className="space-y-2">
              {themeOptions?.map((option) => (
                <label key={option?.value} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="theme"
                    value={option?.value}
                    checked={settings?.appearance?.theme === option?.value}
                    onChange={(e) => handleSettingChange('appearance', 'theme', e?.target?.value)}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <div>
                    <p className="text-sm font-medium text-slate-900">{option?.label}</p>
                    <p className="text-xs text-slate-600">{option?.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <p className="font-medium text-slate-900 mb-2">Language</p>
            <select
              value={settings?.appearance?.language}
              onChange={(e) => handleSettingChange('appearance', 'language', e?.target?.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              {languageOptions?.map((option) => (
                <option key={option?.value} value={option?.value}>
                  {option?.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-900">Compact Mode</p>
              <p className="text-sm text-slate-600">Use a more compact interface layout</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings?.appearance?.compactMode}
                onChange={(e) => handleSettingChange('appearance', 'compactMode', e?.target?.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Data & Account Section */}
      <div className="bg-slate-50 p-6 rounded-lg">
        <div className="flex items-center gap-3 mb-4">
          <Globe className="h-5 w-5 text-slate-600" />
          <h3 className="text-lg font-medium text-slate-900">Data & Account</h3>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={handleExportData}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            Export My Data
          </button>

          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>

          <div className="border-t border-slate-300 pt-4">
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              Delete Account
            </button>
            <p className="text-xs text-slate-500 mt-2 text-center">
              This action cannot be undone. All your data will be permanently deleted.
            </p>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Confirm Sign Out
            </h3>
            <p className="text-slate-600 mb-6">
              Are you sure you want to sign out of your account?
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 px-4 py-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <h3 className="text-lg font-semibold text-slate-900">
                Delete Account
              </h3>
            </div>
            
            <p className="text-slate-600 mb-6">
              This action cannot be undone. This will permanently delete your account and all associated data including messages, friends, and profile information.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsTab;