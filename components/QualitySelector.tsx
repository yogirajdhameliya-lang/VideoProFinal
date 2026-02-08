
import React from 'react';
import { VideoQuality } from '../types';

interface QualitySelectorProps {
  selected: VideoQuality;
  onChange: (q: VideoQuality) => void;
  isPlaylist: boolean;
}

const QualitySelector: React.FC<QualitySelectorProps> = ({ selected, onChange, isPlaylist }) => {
  const videoQualities: VideoQuality[] = ['4K', '2K', '1080p', '720p'];
  const audioQualities: VideoQuality[] = ['Audio-HQ', 'Audio-Standard'];

  const renderButton = (q: VideoQuality, icon?: React.ReactNode) => {
    const is4K = q === '4K';
    const isSelected = selected === q;
    
    return (
      <button
        key={q}
        onClick={() => onChange(q)}
        className={`relative py-4 px-3 rounded-xl text-sm font-black transition-all border flex flex-col items-center gap-2 group overflow-hidden ${
          isSelected
            ? is4K 
              ? 'bg-blue-600/20 border-blue-400 text-blue-300 premium-glow' 
              : 'bg-blue-600/10 border-blue-500 text-blue-400 shadow-[inset_0_0_15px_rgba(59,130,246,0.1)]'
            : 'bg-white/5 border-white/5 hover:bg-white/10 text-gray-400 hover:text-gray-200'
        }`}
      >
        {is4K && (
          <div className="absolute top-1 right-1">
            <span className="flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500"></span>
            </span>
          </div>
        )}
        <div className={`p-1.5 rounded-lg transition-colors ${isSelected ? 'bg-blue-500/20' : 'bg-white/5 group-hover:bg-white/10'}`}>
          {icon}
        </div>
        <span className="flex items-center gap-1">
          {q}
          {is4K && <span className="text-[8px] bg-blue-500 text-white px-1 rounded">ULTRA</span>}
        </span>
      </button>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="text-xs font-black text-gray-500 uppercase tracking-[0.2em]">Resolution & Format</label>
        {isPlaylist && (
            <span className="text-[10px] bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-md font-black tracking-widest uppercase flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"></path></svg>
                Playlist Mode
            </span>
        )}
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {videoQualities.map((q) => renderButton(q, (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 00-2 2z" />
          </svg>
        )))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {audioQualities.map((q) => renderButton(q, (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
          </svg>
        )))}
      </div>
    </div>
  );
};

export default QualitySelector;
