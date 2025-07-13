import React from 'react';
import { X, AlertCircle } from 'lucide-react';

interface BuyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BuyModal({ isOpen, onClose }: BuyModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 w-full max-w-sm sm:max-w-md shadow-2xl">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center gap-2">
            <AlertCircle className="w-5 sm:w-6 h-5 sm:h-6 text-orange-500" />
            Analysis Limit Reached
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 sm:w-6 h-5 sm:h-6" />
          </button>
        </div>

        <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
          You have reached your analysis limit. Upgrade to continue receiving professional forex & gold insights.
        </p>

        <button
          onClick={onClose}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 sm:py-3 rounded-lg font-semibold transition-colors text-sm sm:text-base"
        >
          Close
        </button>
      </div>
    </div>
  );
}