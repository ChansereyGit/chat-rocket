import React from 'react';
import Icon from '../../../components/AppIcon';

const AuthHeader = ({ isLogin }) => {
  return (
    <div className="text-center mb-8">
      <div className="flex justify-center mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Icon name="MessageCircle" size={24} color="white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">ChatFlow</h1>
        </div>
      </div>
      
      <h2 className="text-xl font-semibold text-slate-900 mb-2">
        {isLogin ? 'Welcome back' : 'Create your account'}
      </h2>
      
      <p className="text-slate-600">
        {isLogin 
          ? 'Sign in to continue your conversations' :'Join ChatFlow to start messaging instantly'
        }
      </p>
    </div>
  );
};

export default AuthHeader;