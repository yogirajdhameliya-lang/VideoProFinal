
export type VideoQuality = '4K' | '2K' | '1080p' | '720p' | '480p' | 'Audio-HQ' | 'Audio-Standard';

export interface DownloadItem {
  id: string;
  url: string;
  title: string;
  thumbnail: string;
  quality: VideoQuality;
  status: 'pending' | 'processing' | 'downloading' | 'completed' | 'failed';
  progress: number;
  size: string;
  timeRemaining: number;
  isPlaylist?: boolean;
  playlistCount?: number;
}

export interface VideoMetadata {
  title: string;
  thumbnail: string;
  duration: string;
  author: string;
  views: string;
}
