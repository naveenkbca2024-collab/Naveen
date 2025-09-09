import { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Shuffle,
  Repeat,
  Repeat1,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";

interface Song {
  id: number;
  title: string;
  artist: string;
  album: string;
  duration: string;
  albumArt: string;
  audio: string;
}

interface MusicPlayerProps {
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  volume: number;
  isMuted: boolean;
  isShuffled: boolean;
  repeatMode: "off" | "one" | "all";
  likedSongs: Set<number>;
  onTogglePlay: () => void;
  onNextSong: () => void;
  onPrevSong: () => void;
  onSeek: (value: number[]) => void;
  onVolumeChange: (value: number[]) => void;
  onMuteToggle: () => void;
  onShuffleToggle: () => void;
  onRepeatToggle: () => void;
  onLikeToggle: (songId: number) => void;
  getDurationInSeconds: (duration: string) => number;
}

const MusicPlayer = ({
  currentSong,
  isPlaying,
  currentTime,
  volume,
  isMuted,
  isShuffled,
  repeatMode,
  likedSongs,
  onTogglePlay,
  onNextSong,
  onPrevSong,
  onSeek,
  onVolumeChange,
  onMuteToggle,
  onShuffleToggle,
  onRepeatToggle,
  onLikeToggle,
  getDurationInSeconds,
}: MusicPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const durationInSeconds = currentSong ? getDurationInSeconds(currentSong.duration) : 0;
  const actualVolume = isMuted ? 0 : volume;

  // Audio Control Logic
  useEffect(() => {
    if (!audioRef.current || !currentSong) return;

    audioRef.current.src = currentSong.audio;
    audioRef.current.volume = volume / 100;

    if (isPlaying) {
      audioRef.current.play().catch((err) => {
        console.error("Playback error:", err);
      });
    } else {
      audioRef.current.pause();
    }
  }, [currentSong, isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = actualVolume / 100;
    }
  }, [actualVolume]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const getRepeatIcon = () => {
    switch (repeatMode) {
      case "one":
        return <Repeat1 className="h-4 w-4" />;
      case "all":
        return <Repeat className="h-4 w-4" />;
      default:
        return <Repeat className="h-4 w-4" />;
    }
  };

  if (!currentSong) {
    return (
      <Card className="fixed bottom-0 left-0 right-0 p-4 glass-card border-t border-glass-border">
        <div className="flex items-center justify-center text-muted-foreground">
          Select a song to start playing
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="fixed bottom-0 left-0 right-0 p-4 glass-card border-t border-glass-border backdrop-blur-xl z-50">
        <div className="flex items-center gap-4">
          {/* Album + Info */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <img
              src={currentSong.albumArt}
              alt={currentSong.album}
              className="w-14 h-14 rounded-lg object-cover glow-effect"
            />
            <div className="min-w-0">
              <h4 className="font-semibold text-white truncate">
                {currentSong.title}
              </h4>
              <p className="text-sm text-muted-foreground truncate">
                {currentSong.artist}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onLikeToggle(currentSong.id)}
              className="hover:bg-white/10"
            >
              <Heart
                className={`h-4 w-4 ${
                  likedSongs.has(currentSong.id)
                    ? "fill-red-500 text-red-500"
                    : "text-muted-foreground hover:text-red-400"
                }`}
              />
            </Button>
          </div>

          {/* Controls */}
          <div className="flex flex-col items-center gap-2 flex-1 max-w-md">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onShuffleToggle}
                className={`hover:bg-white/10 ${
                  isShuffled
                    ? "text-primary glow-effect"
                    : "text-muted-foreground hover:text-white"
                }`}
                title="Shuffle"
              >
                <Shuffle className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onPrevSong}
                className="hover:bg-white/10"
                title="Previous"
              >
                <SkipBack className="h-5 w-5" />
              </Button>
              <Button
                onClick={onTogglePlay}
                className="glass-card glow-effect w-10 h-10 rounded-full animate-pulse-glow"
                title="Play/Pause"
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5 ml-0.5" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onNextSong}
                className="hover:bg-white/10"
                title="Next"
              >
                <SkipForward className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onRepeatToggle}
                className={`hover:bg-white/10 ${
                  repeatMode !== "off"
                    ? "text-primary glow-effect"
                    : "text-muted-foreground hover:text-white"
                }`}
                title="Repeat"
              >
                {getRepeatIcon()}
              </Button>
            </div>

            {/* Progress */}
            <div className="flex items-center gap-2 w-full">
              <span className="text-xs text-muted-foreground min-w-[35px]">
                {formatTime(currentTime)}
              </span>
              <Slider
                value={[currentTime]}
                max={durationInSeconds}
                step={1}
                onValueChange={onSeek}
                className="flex-1"
              />
              <span className="text-xs text-muted-foreground min-w-[35px]">
                {currentSong.duration}
              </span>
            </div>
          </div>

          {/* Volume */}
          <div className="flex items-center gap-2 min-w-[120px]">
            <Button
              variant="ghost"
              size="sm"
              onClick={onMuteToggle}
              className="hover:bg-white/10"
              title="Mute"
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Volume2 className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
            <Slider
              value={[actualVolume]}
              max={100}
              step={1}
              onValueChange={onVolumeChange}
              className="w-20"
            />
            <span className="text-xs text-muted-foreground min-w-[30px]">
              {Math.round(actualVolume)}%
            </span>
          </div>
        </div>
      </Card>

      {/* 🔊 The actual audio element */}
      <audio ref={audioRef} />
    </>
  );
};

export default MusicPlayer;
