
import React, { useState, useEffect } from 'react';
import { DownloadItem } from '../types';

interface DownloadManagerProps {
  downloads: DownloadItem[];
}

const DownloadManager: React.FC<DownloadManagerProps> = ({ downloads }) => {
  const [speeds, setSpeeds] = useState<Record<string, string>>({});

  useEffect(() => {
    const interval = setInterval(() => {
      const newSpeeds: Record<string, string> = {};
      downloads.forEach(item => {
        if (item.status === 'downloading') {
          const baseSpeed = item.quality === '4K' ? 45 : 12;
          const variance = Math.random() * 5;
          newSpeeds[item.id] = (baseSpeed + variance).toFixed(1) + ' MB/s';
        }
      });
      setSpeeds(newSpeeds);
    }, 1000);
    return () => clearInterval(interval);
  }, [downloads]);

  if (downloads.length === 0) return null;

  const triggerDeviceDownload = (item: DownloadItem) => {
    const element = document.createElement('a');
    const fileContent = `PYJTech Pro High Quality ${item.quality} download for: ${item.title}`;
    const file = new Blob([fileContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    const extension = item.quality.includes('Audio') ? 'mp3' : 'mp4';
    element.download = `${item.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_PYJTech.${extension}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6 pt-12 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-24">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-xl font-black flex items-center gap-3 tracking-tight">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          </div>
          Active Transfers
        </h2>
        <div className="flex items-center gap-3">
           <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest hidden md:inline">Turbo Sync Enabled</span>
           <span className="text-[10px] bg-white/5 border border-white/10 text-gray-300 px-3 py-1 rounded-full font-bold uppercase tracking-widest">
              {downloads.length} Tasks
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {downloads.map((item) => (
          <div key={item.id} className="glass-card rounded-[1.5rem] p-5 flex gap-6 items-center border-white/5 hover:border-white/10 transition-all group relative overflow-hidden shadow-2xl">
            <div className={`absolute top-0 left-0 w-1.5 h-full ${
                item.status === 'completed' ? 'bg-green-500' : 
                item.status === 'downloading' ? 'bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.5)]' : 'bg-gray-700'
            }`} />

            <div className="w-24 md:w-40 aspect-video rounded-xl overflow-hidden relative flex-shrink-0 shadow-lg border border-white/5 group-hover:scale-[1.02] transition-transform">
              <img src={item.thumbnail} alt="" className="w-full h-full object-cover" />
              {item.isPlaylist && (
                  <div className="absolute inset-0 bg-blue-600/60 backdrop-blur-[2px] flex flex-col items-center justify-center">
                      <span className="text-white text-[16px] font-black">{item.playlistCount}</span>
                      <span className="text-white text-[9px] font-bold uppercase tracking-widest">In Playlist</span>
                  </div>
              )}
            </div>

            <div className="flex-1 min-w-0 space-y-4">
              <div className="flex justify-between items-start gap-4">
                <div className="truncate">
                  <h4 className="font-bold text-gray-100 truncate text-base leading-tight group-hover:text-blue-400 transition-colors">{item.title}</h4>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-[10px] font-black text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded border border-blue-400/20 uppercase tracking-wider">
                        {item.quality}
                    </span>
                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">{item.size}</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 flex flex-col items-end gap-1">
                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider ${
                    item.status === 'completed' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 
                    item.status === 'downloading' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 
                    'bg-white/5 text-gray-500 border border-white/10'
                  }`}>
                    {item.status}
                  </span>
                  {item.status === 'downloading' && (
                    <span className="text-[10px] font-black text-blue-500/80 font-mono tracking-tighter">
                      {speeds[item.id] || '---'}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div className="h-2.5 w-full bg-white/5 rounded-full overflow-hidden relative">
                  <div 
                    className={`h-full transition-all duration-700 rounded-full relative ${
                        item.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'
                    }`} 
                    style={{ width: `${item.progress}%` }} 
                  >
                    {item.status === 'downloading' && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent progress-flow" />
                    )}
                  </div>
                </div>
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                  <span className={item.progress === 100 ? 'text-green-500' : 'text-blue-500'}>
                    {item.progress.toFixed(1)}% Prepared
                  </span>
                  {item.status === 'downloading' && <span className="text-gray-600 animate-pulse">Syncing with Node iad1...</span>}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pl-2">
              {item.status === 'completed' ? (
                <button 
                  onClick={() => triggerDeviceDownload(item)}
                  className="p-4 rounded-2xl bg-green-600 text-white hover:bg-green-500 transition-all shadow-[0_10px_30px_-5px_rgba(34,197,94,0.4)] active:scale-90 hover:scale-105 flex flex-col items-center justify-center gap-1 min-w-[70px]"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span className="text-[9px] font-black uppercase">Save</span>
                </button>
              ) : (
                <button className="p-4 rounded-2xl bg-white/5 text-gray-600 hover:bg-red-500/20 hover:text-red-400 transition-all active:scale-90">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DownloadManager;
