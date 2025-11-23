import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthHeader from './components/AuthHeader';
import AuthToggle from './components/AuthToggle';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import SocialLogin from './components/SocialLogin';

const Authentication = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    const user = localStorage.getItem('chatflow_user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        if (userData?.isAuthenticated) {
          navigate('/main-chat-interface');
        }
      } catch (error) {
        localStorage.removeItem('chatflow_user');
      }
    }
  }, [navigate]);

  const handleToggle = (loginMode) => {
    setIsLogin(loginMode);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
          <AuthHeader isLogin={isLogin} />
          
          <AuthToggle isLogin={isLogin} onToggle={handleToggle} />
          
          <div className="mb-6">
            {isLogin ? <LoginForm /> : <RegisterForm />}
          </div>
          
          <SocialLogin />
          
          <div className="mt-8 text-center text-xs text-slate-500">
            <p>
              By continuing, you agree to our{' '}
              <button className="text-blue-600 hover:text-blue-700 underline">
                Terms of Service
              </button>{' '}
              and{' '}
              <button className="text-blue-600 hover:text-blue-700 underline">
                Privacy Policy
              </button>
            </p>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-600">
            Need help?{' '}
            <button className="text-blue-600 hover:text-blue-700 font-medium">
              Contact Support
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Authentication;