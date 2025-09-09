import { useState, useMemo } from "react";
import { Song } from "@/components/SongList";

export const useSearch = (songs: Song[]) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFilter, setSearchFilter] = useState<'all' | 'title' | 'artist' | 'album' | 'genre'>('all');

  const handleSetSearchFilter = (filter: string) => {
    setSearchFilter(filter as 'all' | 'title' | 'artist' | 'album' | 'genre');
  };

  const filteredSongs = useMemo(() => {
    if (!searchQuery.trim()) return songs;

    const query = searchQuery.toLowerCase().trim();
    
    return songs.filter(song => {
      switch (searchFilter) {
        case 'title':
          return song.title.toLowerCase().includes(query);
        case 'artist':
          return song.artist.toLowerCase().includes(query);
        case 'album':
          return song.album.toLowerCase().includes(query);
        case 'genre':
          return song.genre.toLowerCase().includes(query);
        default:
          return (
            song.title.toLowerCase().includes(query) ||
            song.artist.toLowerCase().includes(query) ||
            song.album.toLowerCase().includes(query) ||
            song.genre.toLowerCase().includes(query)
          );
      }
    });
  }, [songs, searchQuery, searchFilter]);

  return {
    searchQuery,
    setSearchQuery,
    searchFilter,
    setSearchFilter: handleSetSearchFilter,
    filteredSongs,
    hasResults: filteredSongs.length > 0,
    resultCount: filteredSongs.length
  };
};