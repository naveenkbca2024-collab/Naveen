import { useState } from "react";
import { Menu, X, Music, Search, Home, Library, User, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface NavigationProps {
  currentView: 'home' | 'library' | 'favorites';
  onViewChange: (view: 'home' | 'library' | 'favorites') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  searchFilter: string;
  onSearchFilterChange: (filter: string) => void;
}

const Navigation = ({ 
  currentView, 
  onViewChange, 
  searchQuery, 
  onSearchChange, 
  searchFilter, 
  onSearchFilterChange 
}: NavigationProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-glass-border">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-primary">
              <Music className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-bold">
              <span className="gradient-text">Rhythmic</span>
              <span className="text-white ml-1">Tunes</span>
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Button 
              variant="ghost" 
              className={`text-white hover:bg-white/10 ${currentView === 'home' ? 'bg-white/10' : ''}`}
              onClick={() => onViewChange('home')}
            >
              <Home className="h-4 w-4 mr-2" />
              Home
            </Button>
            <Button 
              variant="ghost" 
              className={`text-white hover:bg-white/10 ${currentView === 'library' ? 'bg-white/10' : ''}`}
              onClick={() => onViewChange('library')}
            >
              <Library className="h-4 w-4 mr-2" />
              Library
            </Button>
            <Button 
              variant="ghost" 
              className={`text-white hover:bg-white/10 ${currentView === 'favorites' ? 'bg-white/10' : ''}`}
              onClick={() => onViewChange('favorites')}
            >
              <User className="h-4 w-4 mr-2" />
              Favorites
            </Button>
          </div>

          {/* Search Bar */}
          <div className="hidden lg:flex items-center gap-2">
            <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2 min-w-[300px]">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search songs, artists, albums..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="border-0 bg-transparent focus-visible:ring-0 text-white placeholder:text-muted-foreground"
              />
            </div>
            <Select value={searchFilter} onValueChange={onSearchFilterChange}>
              <SelectTrigger className="w-20 bg-white/10 border-0 text-white">
                <Filter className="h-4 w-4" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="artist">Artist</SelectItem>
                <SelectItem value="album">Album</SelectItem>
                <SelectItem value="genre">Genre</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden text-white hover:bg-white/10"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 space-y-2 border-t border-glass-border pt-4">
            <Button 
              variant="ghost" 
              className={`w-full justify-start text-white hover:bg-white/10 ${currentView === 'home' ? 'bg-white/10' : ''}`}
              onClick={() => onViewChange('home')}
            >
              <Home className="h-4 w-4 mr-2" />
              Home
            </Button>
            <Button 
              variant="ghost" 
              className={`w-full justify-start text-white hover:bg-white/10 ${currentView === 'library' ? 'bg-white/10' : ''}`}
              onClick={() => onViewChange('library')}
            >
              <Library className="h-4 w-4 mr-2" />
              Library
            </Button>
            <Button 
              variant="ghost" 
              className={`w-full justify-start text-white hover:bg-white/10 ${currentView === 'favorites' ? 'bg-white/10' : ''}`}
              onClick={() => onViewChange('favorites')}
            >
              <User className="h-4 w-4 mr-2" />
              Favorites
            </Button>
            <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search music..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="border-0 bg-transparent focus-visible:ring-0 text-white placeholder:text-muted-foreground"
              />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;