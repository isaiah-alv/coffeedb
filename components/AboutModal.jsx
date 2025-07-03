"use client";

import { useState, useEffect } from 'react';
import { HiX } from 'react-icons/hi';

export default function AboutModal({ isOpen, onClose }) {
  const [isFirstLoad, setIsFirstLoad] = useState(false);

  useEffect(() => {
    // Check if this is the first time visiting
    const hasVisited = localStorage.getItem('hasVisitedBefore');
    if (!hasVisited) {
      setIsFirstLoad(true);
      localStorage.setItem('hasVisitedBefore', 'true');
    }
  }, []);

  // Show modal on first load or when explicitly opened
  const shouldShow = isOpen || isFirstLoad;

  if (!shouldShow) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-medium text-gray-800">About the_coffee_db</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <HiX size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="text-center mb-6">
            <div className="text-4xl mb-3">☕</div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">Welcome to Isaiah's Coffee Blog</h3>
          </div>
     </div>
        {/* Footer */}
        <div className="p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full py-3 px-4 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-colors"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
} 