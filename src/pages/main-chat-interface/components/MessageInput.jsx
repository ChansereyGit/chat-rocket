import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const MessageInput = ({ 
  onSendMessage, 
  onTyping, 
  disabled = false,
  activeConversation 
}) => {
  const [message, setMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const handleMessageChange = (e) => {
    const value = e?.target?.value;
    setMessage(value);

    // Handle typing indicator
    if (!isTyping && value?.trim()) {
      setIsTyping(true);
      onTyping?.(true);
    }

    // Clear existing timeout
    if (typingTimeoutRef?.current) {
      clearTimeout(typingTimeoutRef?.current);
    }

    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      onTyping?.(false);
    }, 1000);
  };

  const handleSendMessage = () => {
    if ((!message?.trim() && !selectedImage) || disabled) return;

    const messageData = {
      id: Date.now(),
      text: selectedImage ? imagePreview : message?.trim(), // Changed from 'content' to 'text'
      content: selectedImage ? imagePreview : message?.trim(), // Keep both for compatibility
      type: selectedImage ? 'image' : 'text',
      timestamp: new Date(),
      senderId: 'current-user',
      status: 'sent'
    };

    if (selectedImage) {
      messageData.imageAlt = `Image shared by user at ${new Date()?.toLocaleTimeString()}`;
      messageData.caption = message?.trim() || undefined;
    }

    onSendMessage(messageData);
    
    // Reset form
    setMessage('');
    setSelectedImage(null);
    setImagePreview(null);
    setIsTyping(false);
    onTyping?.(false);
    
    // Clear timeout
    if (typingTimeoutRef?.current) {
      clearTimeout(typingTimeoutRef?.current);
    }
  };

  const handleKeyPress = (e) => {
    if (e?.key === 'Enter' && !e?.shiftKey) {
      e?.preventDefault();
      handleSendMessage();
    }
  };

  const handleImageSelect = (e) => {
    const file = e?.target?.files?.[0];
    if (file && file?.type?.startsWith('image/')) {
      setSelectedImage(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e?.target?.result);
      };
      reader?.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef?.current) {
      fileInputRef.current.value = '';
    }
  };

  if (!activeConversation) {
    return null;
  }

  return (
    <div className="border-t border-gray-200 bg-white p-4">
      {/* Image Preview */}
      {imagePreview && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-start space-x-3">
            <div className="relative">
              <Image
                src={imagePreview}
                alt="Selected image preview for sharing"
                className="w-20 h-20 object-cover rounded-lg"
              />
              <button
                onClick={removeImage}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <Icon name="X" size={12} />
              </button>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Image selected</p>
              <p className="text-xs text-gray-500">{selectedImage?.name}</p>
            </div>
          </div>
        </div>
      )}
      {/* Input Area */}
      <div className="flex items-end space-x-3">
        {/* Attachment Button */}
        <button
          onClick={() => fileInputRef?.current?.click()}
          disabled={disabled}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Icon name="Paperclip" size={20} />
        </button>

        {/* Message Input */}
        <div className="flex-1 relative">
          <textarea
            value={message}
            onChange={handleMessageChange}
            onKeyPress={handleKeyPress}
            placeholder={selectedImage ? "Add a caption..." : "Type a message..."}
            disabled={disabled}
            className="w-full px-4 py-3 border border-gray-300 rounded-2xl resize-none focus:ring-2 focus:ring-blue-600 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            rows={1}
            style={{
              minHeight: '44px',
              maxHeight: '120px',
              height: 'auto'
            }}
            onInput={(e) => {
              e.target.style.height = 'auto';
              e.target.style.height = Math.min(e?.target?.scrollHeight, 120) + 'px';
            }}
          />
        </div>

        {/* Send Button */}
        <Button
          onClick={handleSendMessage}
          disabled={(!message?.trim() && !selectedImage) || disabled}
          variant="default"
          size="icon"
          className="w-11 h-11 rounded-full"
        >
          <Icon name="Send" size={18} />
        </Button>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          className="hidden"
        />
      </div>
      {/* File Size Warning */}
      <p className="text-xs text-gray-500 mt-2 text-center">
        Images up to 10MB • Press Enter to send, Shift+Enter for new line
      </p>
    </div>
  );
};

export default MessageInput;