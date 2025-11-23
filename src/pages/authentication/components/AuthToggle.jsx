import React from 'react';

const AuthToggle = ({ isLogin, onToggle }) => {
  return (
    <div className="flex bg-slate-100 rounded-lg p-1 mb-6">
      <button
        type="button"
        onClick={() => onToggle(true)}
        className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-200 ${
          isLogin
            ? 'bg-white text-slate-900 shadow-sm'
            : 'text-slate-600 hover:text-slate-900'
        }`}
      >
        Login
      </button>
      <button
        type="button"
        onClick={() => onToggle(false)}
        className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-200 ${
          !isLogin
            ? 'bg-white text-slate-900 shadow-sm'
            : 'text-slate-600 hover:text-slate-900'
        }`}
      >
        Register
      </button>
    </div>
  );
};

export default AuthToggle;