import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { songs, Song } from "@/components/SongList";

export const useMusicPlayer = () => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'off' | 'one' | 'all'>('off');
  const [likedSongs, setLikedSongs] = useState<Set<number>>(new Set());
  const [playlist, setPlaylist] = useState<Song[]>(songs);
  const [shuffledPlaylist, setShuffledPlaylist] = useState<Song[]>(songs);
  
  const { toast } = useToast();

  // Load saved preferences from localStorage
  useEffect(() => {
    const savedLikes = localStorage.getItem('likedSongs');
    const savedVolume = localStorage.getItem('volume');
    const savedShuffle = localStorage.getItem('isShuffled');
    const savedRepeat = localStorage.getItem('repeatMode');
    
    if (savedLikes) {
      setLikedSongs(new Set(JSON.parse(savedLikes)));
    }
    if (savedVolume) {
      setVolume(parseInt(savedVolume));
    }
    if (savedShuffle) {
      setIsShuffled(JSON.parse(savedShuffle));
    }
    if (savedRepeat) {
      setRepeatMode(JSON.parse(savedRepeat));
    }
  }, []);

  // Save preferences to localStorage
  useEffect(() => {
    localStorage.setItem('likedSongs', JSON.stringify(Array.from(likedSongs)));
  }, [likedSongs]);

  useEffect(() => {
    localStorage.setItem('volume', volume.toString());
  }, [volume]);

  useEffect(() => {
    localStorage.setItem('isShuffled', JSON.stringify(isShuffled));
  }, [isShuffled]);

  useEffect(() => {
    localStorage.setItem('repeatMode', JSON.stringify(repeatMode));
  }, [repeatMode]);

  // Create shuffled playlist
  useEffect(() => {
    if (isShuffled) {
      const shuffled = [...playlist].sort(() => Math.random() - 0.5);
      setShuffledPlaylist(shuffled);
    } else {
      setShuffledPlaylist(playlist);
    }
  }, [isShuffled, playlist]);

  // Get current playlist based on shuffle mode
  const getCurrentPlaylist = () => isShuffled ? shuffledPlaylist : playlist;

  // Song duration simulation
  const getDurationInSeconds = (duration: string) => {
    const [minutes, seconds] = duration.split(':').map(Number);
    return minutes * 60 + seconds;
  };

  // Progress simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentSong) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          const durationInSeconds = getDurationInSeconds(currentSong.duration);
          if (prev >= durationInSeconds - 1) {
            handleSongEnd();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentSong]);

  const handleSongEnd = () => {
    if (repeatMode === 'one') {
      setCurrentTime(0);
      return;
    }
    
    if (repeatMode === 'all' || getCurrentPlaylist().length > 1) {
      handleNextSong();
    } else {
      setIsPlaying(false);
      setCurrentTime(0);
    }
  };

  const handleSongSelect = useCallback((song: Song) => {
    setCurrentSong(song);
    setIsPlaying(true);
    setCurrentTime(0);
    toast({
      title: "Now Playing",
      description: `${song.title} by ${song.artist}`,
    });
  }, [toast]);

  const handleTogglePlay = useCallback(() => {
    if (!currentSong) {
      const firstSong = getCurrentPlaylist()[0];
      handleSongSelect(firstSong);
    } else {
      setIsPlaying(!isPlaying);
    }
  }, [currentSong, isPlaying, handleSongSelect]);

  const handleNextSong = useCallback(() => {
    if (!currentSong) return;
    
    const currentPlaylist = getCurrentPlaylist();
    const currentIndex = currentPlaylist.findIndex(song => song.id === currentSong.id);
    const nextIndex = (currentIndex + 1) % currentPlaylist.length;
    const nextSong = currentPlaylist[nextIndex];
    
    handleSongSelect(nextSong);
  }, [currentSong, handleSongSelect, getCurrentPlaylist]);

  const handlePrevSong = useCallback(() => {
    if (!currentSong) return;
    
    const currentPlaylist = getCurrentPlaylist();
    const currentIndex = currentPlaylist.findIndex(song => song.id === currentSong.id);
    const prevIndex = currentIndex === 0 ? currentPlaylist.length - 1 : currentIndex - 1;
    const prevSong = currentPlaylist[prevIndex];
    
    handleSongSelect(prevSong);
  }, [currentSong, handleSongSelect, getCurrentPlaylist]);

  const handleSeek = useCallback((value: number[]) => {
    setCurrentTime(value[0]);
  }, []);

  const handleVolumeChange = useCallback((value: number[]) => {
    setVolume(value[0]);
    setIsMuted(false);
  }, []);

  const handleMuteToggle = useCallback(() => {
    setIsMuted(!isMuted);
  }, [isMuted]);

  const handleShuffleToggle = useCallback(() => {
    setIsShuffled(!isShuffled);
    toast({
      title: !isShuffled ? "Shuffle On" : "Shuffle Off",
      description: !isShuffled ? "Playing songs in random order" : "Playing songs in order",
    });
  }, [isShuffled, toast]);

  const handleRepeatToggle = useCallback(() => {
    const modes: Array<'off' | 'one' | 'all'> = ['off', 'one', 'all'];
    const currentIndex = modes.indexOf(repeatMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    setRepeatMode(nextMode);
    
    const messages = {
      off: "Repeat Off",
      one: "Repeat One",
      all: "Repeat All"
    };
    
    toast({
      title: messages[nextMode],
      description: nextMode === 'off' ? "Songs will play once" : 
                  nextMode === 'one' ? "Current song will repeat" : 
                  "Playlist will repeat"
    });
  }, [repeatMode, toast]);

  const handleLikeToggle = useCallback((songId: number) => {
    const newLikedSongs = new Set(likedSongs);
    if (newLikedSongs.has(songId)) {
      newLikedSongs.delete(songId);
      toast({
        title: "Removed from Favorites",
        description: "Song removed from your liked songs",
      });
    } else {
      newLikedSongs.add(songId);
      toast({
        title: "Added to Favorites",
        description: "Song added to your liked songs",
      });
    }
    setLikedSongs(newLikedSongs);
  }, [likedSongs, toast]);

  return {
    // State
    currentSong,
    isPlaying,
    currentTime,
    volume,
    isMuted,
    isShuffled,
    repeatMode,
    likedSongs,
    playlist,
    
    // Actions
    handleSongSelect,
    handleTogglePlay,
    handleNextSong,
    handlePrevSong,
    handleSeek,
    handleVolumeChange,
    handleMuteToggle,
    handleShuffleToggle,
    handleRepeatToggle,
    handleLikeToggle,
    
    // Utilities
    getDurationInSeconds,
    setPlaylist,
  };
};