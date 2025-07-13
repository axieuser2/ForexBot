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
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 w-full max-w-sm sm:max-w-lg shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h3 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">🔐 Premium Access</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 transition-colors p-1 hover:bg-red-50 rounded-full"
          >
            <X className="w-5 sm:w-6 h-5 sm:h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-5">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password Token"
            className="w-full px-3 sm:px-5 py-3 sm:py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-lg"
            autoFocus
          />
          
          {error && (
            <div className="text-red-600 text-xs sm:text-sm bg-red-50 p-3 sm:p-4 rounded-xl border border-red-200 font-medium">{error}</div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 sm:py-4 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg text-sm sm:text-base"
          >
            Submit
          </button>
        </form>

        <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
          <h4 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 text-center">💳 Don't have credits? Buy now!</h4>
          
          <div className="space-y-2 sm:space-y-3">
            <button
              onClick={() => openStripeLink('https://buy.stripe.com/aFa3cuagabhb78k4bacQU03')}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 sm:py-4 rounded-xl font-semibold transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2 sm:gap-3 shadow-lg text-xs sm:text-sm"
            >
              <CreditCard className="w-4 sm:w-5 h-4 sm:h-5" />
              🚀 Pro Analysis (30 Credits)
              <ExternalLink className="w-3 sm:w-4 h-3 sm:h-4" />
            </button>
            
            <button
              onClick={() => openStripeLink('https://buy.stripe.com/bJe3cu5ZU0Cx50c5fecQU04')}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-3 sm:py-4 rounded-xl font-semibold transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2 sm:gap-3 shadow-lg text-xs sm:text-sm"
            >
              <CreditCard className="w-4 sm:w-5 h-4 sm:h-5" />
              💎 Elite Analysis (50 Credits)
              <ExternalLink className="w-3 sm:w-4 h-3 sm:h-4" />
            </button>
          </div>
          
          <button
            onClick={onClose}
            className="w-full mt-3 sm:mt-4 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 sm:py-3 rounded-xl font-medium transition-all duration-200 text-sm sm:text-base"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}