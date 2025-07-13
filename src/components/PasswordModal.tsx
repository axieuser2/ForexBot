import React, { useState, useEffect } from 'react';
import { X, CreditCard, ExternalLink } from 'lucide-react';

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (password: string) => void;
  error: string;
}

export function PasswordModal({ isOpen, onClose, onSubmit, error }: PasswordModalProps) {
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (isOpen) {
      setPassword('');
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(password);
  };

  const openStripeLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6">
      <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 tablet:p-10 w-full max-w-sm sm:max-w-lg tablet:max-w-xl shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h3 className="text-xl sm:text-2xl tablet:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">🔐 Premium Access</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-full min-h-[48px] min-w-[48px] flex items-center justify-center"
          >
            <X className="w-6 sm:w-7 h-6 sm:h-7" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password Token"
            className="w-full px-4 sm:px-6 py-4 sm:py-5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-base sm:text-lg min-h-[48px]"
            autoFocus
          />
          
          {error && (
            <div className="text-red-600 text-sm sm:text-base bg-red-50 p-4 sm:p-5 rounded-xl border border-red-200 font-medium">{error}</div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 sm:py-5 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg text-base sm:text-lg min-h-[48px]"
          >
            Submit
          </button>
        </form>

        <div className="mt-6 sm:mt-8 tablet:mt-10 pt-6 sm:pt-8 border-t border-gray-200">
          <h4 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6 text-center">💳 Don't have credits? Buy now!</h4>
          
          <div className="space-y-3 sm:space-y-4">
            <button
              onClick={() => openStripeLink('https://buy.stripe.com/aFa3cuagabhb78k4bacQU03')}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 sm:py-5 rounded-xl font-semibold transition-all duration-200 hover:scale-105 flex items-center justify-center gap-3 sm:gap-4 shadow-lg text-sm sm:text-base min-h-[48px]"
            >
              <CreditCard className="w-5 sm:w-6 h-5 sm:h-6" />
              🚀 Pro Analysis (30 Credits)
              <ExternalLink className="w-4 sm:w-5 h-4 sm:h-5" />
            </button>
            
            <button
              onClick={() => openStripeLink('https://buy.stripe.com/bJe3cu5ZU0Cx50c5fecQU04')}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-4 sm:py-5 rounded-xl font-semibold transition-all duration-200 hover:scale-105 flex items-center justify-center gap-3 sm:gap-4 shadow-lg text-sm sm:text-base min-h-[48px]"
            >
              <CreditCard className="w-5 sm:w-6 h-5 sm:h-6" />
              💎 Elite Analysis (50 Credits)
              <ExternalLink className="w-4 sm:w-5 h-4 sm:h-5" />
            </button>
          </div>
          
          <button
            onClick={onClose}
            className="w-full mt-4 sm:mt-6 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 sm:py-4 rounded-xl font-medium transition-all duration-200 text-base sm:text-lg min-h-[48px]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}