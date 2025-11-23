import React, { useState, useRef } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { Camera, Save, User, Phone, Mail, MessageCircle } from 'lucide-react';

const ProfileTab = ({ userProfile }) => {
  const { user, updateProfile } = useAuth();
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    fullName: userProfile?.fullName || '',
    username: userProfile?.username || '',
    phoneNumber: userProfile?.phoneNumber || '',
    status: userProfile?.status || 'offline'
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(userProfile?.avatar_url || null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');

  const statusOptions = [
    { value: 'online', label: 'Online', color: 'bg-green-500' },
    { value: 'busy', label: 'Busy', color: 'bg-red-500' },
    { value: 'away', label: 'Away', color: 'bg-yellow-500' },
    { value: 'offline', label: 'Offline', color: 'bg-gray-400' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors when user starts typing
    if (errors?.[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleAvatarChange = (e) => {
    const file = e?.target?.files?.[0];
    if (file) {
      if (file?.size > 2 * 1024 * 1024) { // 2MB limit
        setErrors(prev => ({
          ...prev,
          avatar: 'Image size must be less than 2MB'
        }));
        return;
      }
      
      const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
      if (!validTypes?.includes(file?.type)) {
        setErrors(prev => ({
          ...prev,
          avatar: 'Please select a valid image file (JPEG, PNG, WebP)'
        }));
        return;
      }

      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
      setErrors(prev => ({
        ...prev,
        avatar: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.fullName?.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData?.username?.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData?.username?.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (formData?.phoneNumber && !/^\+?[\d\s-()]+$/?.test(formData?.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});
    setSuccess('');

    try {
      let avatarUrl = userProfile?.avatarUrl;

      // TODO: Implement avatar upload to Java backend
      // For now, we'll use a placeholder service like UI Avatars
      if (avatarFile) {
        // In a real implementation, you would upload to your Java backend
        // For now, we'll just use the preview URL
        console.log('Avatar upload not yet implemented');
      }

      // Update profile
      const updates = {
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        status: formData.status,
        avatarUrl: avatarUrl
      };

      const { error } = await updateProfile(updates);

      if (error) {
        setErrors({ general: error?.message });
      } else {
        setSuccess('Profile updated successfully!');
        setAvatarFile(null);
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (error) {
      setErrors({ general: 'An unexpected error occurred' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-2">Profile Information</h2>
        <p className="text-slate-600">Update your personal information and avatar.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Success/Error Messages */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-600">
            {success}
          </div>
        )}
        
        {errors?.general && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600">
            {errors?.general}
          </div>
        )}

        {/* Avatar Section */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="h-20 w-20 rounded-full bg-slate-200 overflow-hidden">
              {avatarPreview || userProfile?.avatarUrl ? (
                <img
                  src={avatarPreview || userProfile?.avatarUrl}
                  alt="Profile avatar"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center">
                  <User className="h-8 w-8 text-slate-400" />
                </div>
              )}
            </div>
            
            <button
              type="button"
              onClick={() => fileInputRef?.current?.click()}
              className="absolute -bottom-2 -right-2 h-8 w-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
            >
              <Camera className="h-4 w-4" />
            </button>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>
          
          <div>
            <h3 className="font-medium text-slate-900">Profile Photo</h3>
            <p className="text-sm text-slate-600">
              Upload a new avatar. Max size: 2MB
            </p>
            {errors?.avatar && (
              <p className="text-sm text-red-600 mt-1">{errors?.avatar}</p>
            )}
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                name="fullName"
                value={formData?.fullName}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors?.fullName ? 'border-red-300' : 'border-slate-300'
                }`}
                placeholder="Enter your full name"
              />
            </div>
            {errors?.fullName && (
              <p className="text-sm text-red-600 mt-1">{errors?.fullName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Username
            </label>
            <div className="relative">
              <MessageCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                name="username"
                value={formData?.username}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors?.username ? 'border-red-300' : 'border-slate-300'
                }`}
                placeholder="Choose a username"
              />
            </div>
            {errors?.username && (
              <p className="text-sm text-red-600 mt-1">{errors?.username}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-500"
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">Email cannot be changed</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="tel"
                name="phoneNumber"
                value={formData?.phoneNumber}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors?.phoneNumber ? 'border-red-300' : 'border-slate-300'
                }`}
                placeholder="+1 (555) 123-4567"
              />
            </div>
            {errors?.phoneNumber && (
              <p className="text-sm text-red-600 mt-1">{errors?.phoneNumber}</p>
            )}
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Status
          </label>
          <div className="flex gap-3">
            {statusOptions?.map((option) => (
              <button
                key={option?.value}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, status: option?.value }))}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                  formData?.status === option?.value
                    ? 'border-blue-300 bg-blue-50 text-blue-700' :'border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className={`h-2 w-2 rounded-full ${option?.color}`}></div>
                <span className="text-sm">{option?.label}</span>
              </button>
            ))}
          </div>
        </div>



        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Save className="h-4 w-4" />
            )}
            <span>{loading ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileTab;