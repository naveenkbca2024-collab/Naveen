import { useState } from "react";
import {
  Play,
  Pause,
  Heart,
  MoreHorizontal,
  Download,
  Share,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

import album1 from "@/assets/nxy3.jpg";
import album2 from "@/assets/nxy4.jpg";
import album3 from "@/assets/nxy6.jpg";
import album4 from "@/assets/nxy7.jpg";
import album5 from "@/assets/nxy8.jpg";

export interface Song {
  id: number;
  title: string;
  artist: string;
  album?: string;
  duration: string;
  albumArt: string;
  genre: string;
  audio: string;
}

interface SongListProps {
  songs: Song[];
  currentSong: Song | null;
  isPlaying: boolean;
  likedSongs: Set<number>;
  title?: string;
  onSongSelect: (song: Song) => void;
  onTogglePlay: () => void;
  onLikeToggle: (songId: number) => void;
}

const songs: Song[] = [
  {
    id: 1,
    title: "SIDU SIDU",
    artist: "SAM CS",
    album: "Divide",
    duration: "3:42",
    albumArt: album1,
    genre: "Pop",
    audio: "/music/sidu.mp3",
  },
  {
    id: 2,
    title: "KADHAL ASSAI ",
    artist: "YUVAN SHANKAR RAJA",
    album: "Storm",
    duration: "3:28",
    albumArt: album2,
    genre: "Rock",
    audio: "/music/kadhal.mp3",
  },
  {
    id: 3,
    title: "I",
    artist: "ANIRUTH RAVICHANDRAN",
    album: "Serenity",
    duration: "5:01",
    albumArt: album3,
    genre: "Ambient",
    audio: "/music/ennodu.mp3",
  },
  {
    id: 4,
    title: "KAVALA",
    artist: "ANIRUTH RAVICHANDRAN",
    album: "Future Sounds",
    duration: "3:56",
    albumArt: album4,
    genre: "Synthwave",
    audio: "/music/kavala.mp3",
  },
  {
    id: 5,
    title: "URUGUTHA MARUGUTHA",
    artist: "ILAYARAAJA",
    album: "California Dreams",
    duration: "4:23",
    albumArt: album5,
    genre: "Pop",
    audio: "/music/song5.mp3",
  },
];

const SongList = ({
  songs,
  currentSong,
  isPlaying,
  likedSongs,
  title = "Featured Tracks",
  onSongSelect,
  onTogglePlay,
  onLikeToggle,
}: SongListProps) => {
  const { toast } = useToast();

  const handleSongClick = (song: Song) => {
    if (currentSong?.id === song.id) {
      onTogglePlay();
    } else {
      onSongSelect(song);
    }
  };

  const handleMoreAction = (action: string, song: Song) => {
    switch (action) {
      case "download":
        toast({
          title: "Download Started",
          description: `${song.title} is being downloaded`,
        });
        break;
      case "share":
        if (navigator.share) {
          navigator.share({
            title: song.title,
            text: `Check out "${song.title}" by ${song.artist}`,
            url: window.location.href,
          });
        } else {
          navigator.clipboard.writeText(`${song.title} by ${song.artist}`);
          toast({
            title: "Copied to Clipboard",
            description: "Song details copied to clipboard",
          });
        }
        break;
      case "playlist":
        toast({
          title: "Added to Playlist",
          description: `${song.title} added to your playlist`,
        });
        break;
    }
  };

  return (
    <section className="py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-8">
          {title.split(" ")[0]}{" "}
          <span className="gradient-text">
            {title.split(" ").slice(1).join(" ")}
          </span>
        </h2>

        {songs.length === 0 ? (
          <Card className="glass-card p-8 text-center">
            <p className="text-muted-foreground">
              No songs found matching your criteria
            </p>
          </Card>
        ) : (
          <Card className="glass-card p-6">
            <div className="space-y-2">
              {songs.map((song, index) => (
                <div
                  key={song.id}
                  className={`flex items-center gap-4 p-3 rounded-lg transition-all duration-200 cursor-pointer group hover:bg-white/5 ${
                    currentSong?.id === song.id
                      ? "bg-primary/10 border border-primary/20"
                      : ""
                  }`}
                  onClick={() => handleSongClick(song)}
                >
                  {/* Play Button or Number */}
                  <div className="w-8 text-center">
                    {currentSong?.id === song.id ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-8 h-8 p-0 hover:bg-white/10"
                        onClick={(e) => {
                          e.stopPropagation();
                          onTogglePlay();
                        }}
                      >
                        {isPlaying ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4 ml-0.5" />
                        )}
                      </Button>
                    ) : (
                      <span className="text-muted-foreground group-hover:hidden">
                        {index + 1}
                      </span>
                    )}
                    {currentSong?.id !== song.id && (
                      <Play className="h-4 w-4 text-white hidden group-hover:block" />
                    )}
                  </div>

                  {/* Album Art */}
                  <img
                    src={song.albumArt}
                    alt={song.album}
                    className="w-12 h-12 rounded-lg object-cover"
                  />

                  {/* Title and Artist */}
                  <div className="flex-1 min-w-0">
                    <h4
                      className={`font-medium truncate ${
                        currentSong?.id === song.id
                          ? "text-primary"
                          : "text-white"
                      }`}
                    >
                      {song.title}
                    </h4>
                    <p className="text-sm text-muted-foreground truncate">
                      {song.artist}
                    </p>
                  </div>

                  {/* Album */}
                  <div className="hidden md:block flex-1 min-w-0">
                    <p className="text-sm text-muted-foreground truncate">
                      {song.album}
                    </p>
                  </div>

                  {/* Genre */}
                  <div className="hidden lg:block">
                    <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary">
                      {song.genre}
                    </span>
                  </div>

                  {/* Like Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/10"
                    onClick={(e) => {
                      e.stopPropagation();
                      onLikeToggle(song.id);
                    }}
                  >
                    <Heart
                      className={`h-4 w-4 ${
                        likedSongs.has(song.id)
                          ? "fill-red-500 text-red-500"
                          : "text-muted-foreground hover:text-red-400"
                      }`}
                    />
                  </Button>

                  {/* Duration */}
                  <div className="text-sm text-muted-foreground min-w-[40px] text-right">
                    {song.duration}
                  </div>

                  {/* More Options */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/10"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleMoreAction("download", song)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleMoreAction("share", song)}
                      >
                        <Share className="h-4 w-4 mr-2" />
                        Share
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleMoreAction("playlist", song)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add to Playlist
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </section>
  );
};

export { songs };
export default SongList;
