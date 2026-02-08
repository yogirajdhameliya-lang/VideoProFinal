
import React, { useState, useEffect, useCallback } from 'react';
import { analyzeVideoUrl } from './services/geminiService';
import { DownloadItem, VideoQuality, VideoMetadata } from './types';
import Header from './components/Header';
import UrlInput from './components/UrlInput';
import DownloadManager from './components/DownloadManager';
import QualitySelector from './components/QualitySelector';

const App: React.FC = () => {
  const [url, setUrl] = useState('');
  const [metadata, setMetadata] = useState<VideoMetadata | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const [selectedQuality, setSelectedQuality] = useState<VideoQuality>('1080p');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAnalyze = async (inputUrl: string) => {
    if (!inputUrl) return;
    setIsAnalyzing(true);
    setUrl(inputUrl);
    setMetadata(null);
    const result = await analyzeVideoUrl(inputUrl);
    setMetadata(result);
    setIsAnalyzing(false);
  };

  const startDownload = useCallback(() => {
    if (!metadata) return;

    const isPlaylist = url.includes('list=') || url.includes('playlist');
    const newDownload: DownloadItem = {
      id: Math.random().toString(36).substr(2, 9),
      url: url,
      title: metadata.title,
      thumbnail: metadata.thumbnail,
      quality: selectedQuality,
      status: 'pending',
      progress: 0,
      size: selectedQuality.includes('Audio') ? '12.4 MB' : selectedQuality === '4K' ? '1.8 GB' : '450.2 MB',
      timeRemaining: 0,
      isPlaylist: isPlaylist,
      playlistCount: isPlaylist ? 24 : undefined,
    };

    setDownloads(prev => [newDownload, ...prev]);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
    
    // Clear analyzer to allow next link
    setMetadata(null);
    setUrl('');
  }, [metadata, url, selectedQuality]);

  // High-performance download simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setDownloads(prev => prev.map(item => {
        if (item.status === 'pending') return { ...item, status: 'processing' };
        if (item.status === 'processing') {
            if (item.progress >= 10) return { ...item, status: 'downloading' };
            return { ...item, progress: item.progress + 5 };
        }
        if (item.status === 'downloading') {
          if (item.progress >= 100) return { ...item, status: 'completed', progress: 100 };
          
          // Realistic speeds: Audio is instant, 4K takes a bit of time
          const step = item.quality === '4K' ? 1.2 : item.quality.includes('Audio') ? 10 : 5;
          return { ...item, progress: Math.min(100, item.progress + step) };
        }
        return item;
      }));
    }, 400);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen pb-32 selection:bg-blue-500/30">
      <Header />
      
      {showSuccess && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-4 fade-in duration-300">
          <div className="bg-green-500 text-white px-6 py-3 rounded-full font-black text-sm shadow-2xl shadow-green-500/40 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
            ADDED TO QUEUE
          </div>
        </div>
      )}

      <main className="max-w-4xl mx-auto px-4 mt-16 md:mt-24 space-y-12">
        <div className={`text-center space-y-6 transition-all duration-700 ${metadata ? 'scale-90 opacity-80' : 'scale-100'}`}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold tracking-widest uppercase mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            PYJTech Pro Downloader
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight">
            Download in <span className="gradient-text">4K Ultra HD</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-xl mx-auto leading-relaxed">
            The world's fastest YouTube playlist and video downloader. Paste, Process, and Save to your device.
          </p>
        </div>

        <div className="max-w-2xl mx-auto space-y-8">
          <UrlInput 
            onAnalyze={handleAnalyze} 
            isLoading={isAnalyzing} 
          />

          {metadata && !isAnalyzing && (
            <div className="glass-card rounded-[2.5rem] p-8 animate-in fade-in zoom-in-95 duration-500 shadow-2xl border-blue-500/20">
              <div className="space-y-8">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="w-full md:w-56 aspect-video rounded-2xl overflow-hidden relative group shadow-2xl border border-white/5">
                      <img src={metadata.thumbnail} alt="Thumbnail" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <div className="absolute bottom-3 right-3 bg-blue-600/90 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-black border border-blue-400/30">
                          {metadata.duration}
                      </div>
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    <h3 className="text-2xl font-black leading-tight text-white">{metadata.title}</h3>
                    <div className="flex items-center gap-3 text-sm font-bold text-gray-500">
                      <span className="text-blue-400">{metadata.author}</span>
                      <span className="w-1 h-1 rounded-full bg-gray-800" />
                      <span>{metadata.views}</span>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
                
                <div className="space-y-6">
                  <QualitySelector 
                    selected={selectedQuality} 
                    onChange={setSelectedQuality} 
                    isPlaylist={url.includes('list=')}
                  />

                  <button 
                    onClick={startDownload}
                    className="w-full py-5 rounded-2xl bg-blue-600 hover:bg-blue-500 transition-all font-black text-xl shadow-[0_20px_50px_-10px_rgba(37,99,235,0.5)] active:scale-[0.97] flex items-center justify-center gap-3 group overflow-hidden relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download Now
                  </button>
                  <div className="flex justify-center gap-6 text-[10px] text-gray-600 font-black uppercase tracking-[0.2em]">
                    <span>High Fidelity</span>
                    <span>No Limits</span>
                    <span>Device Secure</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <DownloadManager downloads={downloads} />
      </main>

      <footer className="fixed bottom-0 left-0 right-0 py-6 glass-card border-t border-white/5 z-[60]">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center px-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-xs font-black text-white shadow-lg shadow-blue-500/20">P</div>
            <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest">
                Official <span className="text-white">PYJTech</span> Pro Interface
            </p>
          </div>
          <div className="flex gap-8 text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">
            <span className="text-blue-500/50">4K Engine v3.1</span>
            <a href="#" className="hover:text-blue-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
