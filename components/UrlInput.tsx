
import React, { useState } from 'react';

interface UrlInputProps {
  onAnalyze: (url: string) => void;
  isLoading: boolean;
}

const UrlInput: React.FC<UrlInputProps> = ({ onAnalyze, isLoading }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onAnalyze(inputValue.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative group max-w-2xl mx-auto">
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-[2rem] blur opacity-20 group-focus-within:opacity-40 transition duration-700"></div>
      <div className="relative flex items-center bg-[#0a0f1e] rounded-[1.5rem] border border-white/10 overflow-hidden p-1.5 focus-within:border-blue-500/50 shadow-2xl transition-all">
        <div className="absolute left-6 text-gray-500">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.826a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        </div>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Paste video or playlist URL..."
          className="w-full pl-14 pr-40 py-5 bg-transparent border-none outline-none text-lg md:text-xl font-medium placeholder:text-gray-600 text-white"
        />
        <button
          type="submit"
          disabled={isLoading || !inputValue}
          className="absolute right-1.5 px-8 py-4 bg-blue-600 rounded-[1.1rem] font-black text-sm uppercase tracking-wider hover:bg-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center min-w-[120px]"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            'Process'
          )}
        </button>
      </div>
    </form>
  );
};

export default UrlInput;
