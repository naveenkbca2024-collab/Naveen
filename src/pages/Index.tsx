import { useState } from "react";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import SongList, { songs, Song } from "@/components/SongList";
import MusicPlayer from "@/components/MusicPlayer";
import { useMusicPlayer } from "@/hooks/useMusicPlayer";
import { useSearch } from "@/hooks/useSearch";

const Index = () => {
  const [currentView, setCurrentView] = useState<'home' | 'library' | 'favorites'>('home');
  
  const musicPlayer = useMusicPlayer();
  const search = useSearch(songs);

  // Get songs based on current view and search
  const getDisplayedSongs = () => {
    let baseSongs = songs;
    
    if (currentView === 'favorites') {
      baseSongs = songs.filter(song => musicPlayer.likedSongs.has(song.id));
    }
    
    return search.searchQuery ? search.filteredSongs : baseSongs;
  };

  const getViewTitle = () => {
    switch (currentView) {
      case 'favorites':
        return 'Your Favorites';
      case 'library':
        return 'Music Library';
      default:
        return 'Featured Tracks';
    }
  };

  const displayedSongs = getDisplayedSongs();

  return (
    <div className="min-h-screen bg-background">
      <Navigation 
        currentView={currentView}
        onViewChange={setCurrentView}
        searchQuery={search.searchQuery}
        onSearchChange={search.setSearchQuery}
        searchFilter={search.searchFilter}
        onSearchFilterChange={search.setSearchFilter}
      />
      <main className="pt-20 pb-24">
        {currentView === 'home' && <Hero />}
        <SongList 
          songs={displayedSongs}
          currentSong={musicPlayer.currentSong}
          isPlaying={musicPlayer.isPlaying}
          likedSongs={musicPlayer.likedSongs}
          title={getViewTitle()}
          onSongSelect={musicPlayer.handleSongSelect}
          onTogglePlay={musicPlayer.handleTogglePlay}
          onLikeToggle={musicPlayer.handleLikeToggle}
        />
      </main>
      <MusicPlayer 
        currentSong={musicPlayer.currentSong}
        isPlaying={musicPlayer.isPlaying}
        currentTime={musicPlayer.currentTime}
        volume={musicPlayer.volume}
        isMuted={musicPlayer.isMuted}
        isShuffled={musicPlayer.isShuffled}
        repeatMode={musicPlayer.repeatMode}
        likedSongs={musicPlayer.likedSongs}
        onTogglePlay={musicPlayer.handleTogglePlay}
        onNextSong={musicPlayer.handleNextSong}
        onPrevSong={musicPlayer.handlePrevSong}
        onSeek={musicPlayer.handleSeek}
        onVolumeChange={musicPlayer.handleVolumeChange}
        onMuteToggle={musicPlayer.handleMuteToggle}
        onShuffleToggle={musicPlayer.handleShuffleToggle}
        onRepeatToggle={musicPlayer.handleRepeatToggle}
        onLikeToggle={musicPlayer.handleLikeToggle}
        getDurationInSeconds={musicPlayer.getDurationInSeconds}
      />
    </div>
  );
};

export default Index;