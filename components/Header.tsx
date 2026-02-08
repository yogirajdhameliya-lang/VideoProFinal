
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full glass-card border-b border-white/5 py-4 px-6 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
          <span className="text-white font-black text-xl">P</span>
        </div>
        <div className="flex flex-col">
            <span className="font-bold text-lg tracking-tight leading-none">PYJTech</span>
            <span className="text-[10px] text-blue-400 font-bold tracking-widest uppercase">Video Pro</span>
        </div>
      </div>
      
      <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
        <a href="#" className="hover:text-white transition-colors">Converter</a>
        <a href="#" className="hover:text-white transition-colors">Cloud Sync</a>
        <a href="#" className="hover:text-white transition-colors">Pricing</a>
        <button className="bg-white/10 px-4 py-2 rounded-full hover:bg-white/20 transition-all text-white">
          Documentation
        </button>
      </nav>

      <div className="flex items-center gap-4">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <span className="text-xs text-gray-500 font-medium">Server Online</span>
      </div>
    </header>
  );
};

export default Header;
