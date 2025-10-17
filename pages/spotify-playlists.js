import { useState, useEffect } from 'react';
import {
  Search,
  Music,
  Users,
  ExternalLink,
  Mail,
  Instagram,
  Twitter,
  Globe,
  Loader2,
  Download,
  Filter,
  ChevronRight,
  ListMusic,
  CheckCircle
} from 'lucide-react';

// Genre categories
const MUSIC_GENRES = [
  'Indie Pop',
  'Indie Rock',
  'Alternative Rock',
  'Electronic',
  'Hip Hop',
  'R&B',
  'Folk',
  'Jazz',
  'Pop',
  'Rock',
  'Country',
  'House',
  'Techno',
  'Ambient'
];

// Strategic keywords that help find specific types of playlists
const STRATEGIC_KEYWORDS = [
  // Discovery & Exposure
  'New Music',
  'Emerging Artists',
  'Underground',
  'Rising Stars',
  'Fresh Finds',
  'Discovery',
  'Hidden Gems',
  'Undiscovered',

  // Submission-Friendly
  'Submit',
  'Submissions',
  'Open for Submissions',
  'Send Music',
  'Demo Submission',
  'Artist Submission',

  // Mood & Context
  'Chill',
  'Upbeat',
  'Relaxing',
  'Study Music',
  'Workout',
  'Coffee Shop',
  'Road Trip',
  'Night Vibes',

  // Time-Based
  '2024',
  '2025',
  'Weekly',
  'Monthly',
  'Latest',
  'Current',

  // Size & Reach
  'Viral',
  'Trending',
  'Popular',
  'Hit',
  'Chart',
  'Mainstream',

  // Specific Contexts
  'Spotify Editorial',
  'Playlist Curator',
  'Music Blog',
  'Radio Ready',
  'Festival',
  'Live Session'
];

export default function SpotifyPlaylists() {
  const [searchGenre, setSearchGenre] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState('');
  const [totalResults, setTotalResults] = useState(0);

  // Handle search
  const handleSearch = async () => {
    if (!searchGenre.trim()) return;

    setIsSearching(true);
    setError('');
    setResults([]);

    try {
      const response = await fetch('/api/scrape-playlists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          genre: searchGenre.trim()
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch playlists');
      }

      const data = await response.json();
      setResults(data.playlists || []);
      setTotalResults(data.total || 0);
      setHasSearched(true);

    } catch (err) {
      setError(err.message || 'An error occurred while searching');
    } finally {
      setIsSearching(false);
    }
  };

  // Handle genre pill click
  const handleGenreClick = (genre) => {
    setSearchGenre(current => {
      if (!current.trim()) {
        // If empty, just set the genre
        return genre;
      } else {
        // If has content, check if genre already exists
        const currentGenres = current.split(',').map(g => g.trim().toLowerCase());
        const newGenre = genre.trim().toLowerCase();

        if (currentGenres.includes(newGenre)) {
          // Genre already exists, don't add it again
          return current;
        } else {
          // Add genre with comma separation
          return current + ', ' + genre;
        }
      }
    });
  };

  // Export results to CSV
  const exportToCSV = () => {
    if (results.length === 0) return;

    const headers = [
      'Playlist Name',
      'Curator Name',
      'Description',
      'Song Count',
      'Followers',
      'Spotify URL',
      'Contact Email',
      'Instagram',
      'Twitter',
      'Website'
    ];

    const csvContent = [
      headers.join(','),
      ...results.map(playlist => [
        `"${playlist.name}"`,
        `"${playlist.curator}"`,
        `"${playlist.description || ''}"`,
        playlist.songCount || 0,
        playlist.followers || 0,
        playlist.spotifyUrl || '',
        playlist.contactEmail || '',
        playlist.instagram || '',
        playlist.twitter || '',
        playlist.website || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `spotify-playlists-${searchGenre.toLowerCase().replace(/\s+/g, '-')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #1DD1A1, #B91372);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #1DD1A1, #B91372);
          opacity: 0.8;
        }
      `}</style>

      {/* Background gradient */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#1DD1A1] rounded-full filter blur-[200px] opacity-10" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-[#B91372] rounded-full filter blur-[200px] opacity-10" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#1DD1A1]/30 to-[#B91372]/30 rounded-full border border-white/30 mb-6">
            <ListMusic className="w-5 h-5 text-[#1DD1A1]" />
            <span className="text-sm font-semibold text-white">Playlist Discovery</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold mb-6 text-white">
            Find Spotify Playlists
          </h1>

          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-4">
            Discover curated playlists with curator contact details to pitch your music
          </p>

          <div className="bg-gradient-to-r from-[#1DD1A1]/20 to-[#B91372]/20 rounded-2xl border border-white/20 p-4 max-w-4xl mx-auto mb-8">
            <p className="text-sm text-gray-200">
              💡 <strong>Pro Tip:</strong> Combine genres with strategic keywords like "Indie Pop + Submissions" or "Electronic + New Music" to find playlists actively seeking your type of music.
            </p>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-black/80 backdrop-blur-xl rounded-3xl border border-white/20 p-8 mb-8">
          {/* Search Input */}
          <div className="mb-8">
            <label className="block text-white text-lg font-semibold mb-4">
              Build your search query
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchGenre}
                onChange={(e) => setSearchGenre(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="e.g., Indie Pop, New Music, Submissions, Electronic, Chill..."
                className="w-full px-6 py-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-[#1DD1A1] focus:bg-white/10 transition-all text-lg"
              />
              <button
                onClick={handleSearch}
                disabled={isSearching || !searchGenre.trim()}
                className="absolute right-2 top-2 bottom-2 px-6 bg-gradient-to-r from-[#1DD1A1] to-[#B91372] rounded-xl font-semibold transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-white"
              >
                {isSearching ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    Search
                  </>
                )}
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              💡 Combine multiple keywords for better results. Each click adds to your search.
            </p>
          </div>

          {/* Two Category Sections */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Music Genres */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Music className="w-5 h-5 text-[#1DD1A1]" />
                <h3 className="text-lg font-semibold text-white">Music Genres</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {MUSIC_GENRES.map((genre) => (
                  <button
                    key={genre}
                    onClick={() => handleGenreClick(genre)}
                    className="px-3 py-2 bg-[#1DD1A1]/10 hover:bg-[#1DD1A1]/20 border border-[#1DD1A1]/30 hover:border-[#1DD1A1] rounded-full text-sm text-gray-300 hover:text-white transition-all"
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>

            {/* Strategic Keywords */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-5 h-5 text-[#B91372]" />
                <h3 className="text-lg font-semibold text-white">Strategic Keywords</h3>
              </div>
              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                {STRATEGIC_KEYWORDS.map((keyword) => (
                  <button
                    key={keyword}
                    onClick={() => handleGenreClick(keyword)}
                    className="px-3 py-2 bg-[#B91372]/10 hover:bg-[#B91372]/20 border border-[#B91372]/30 hover:border-[#B91372] rounded-full text-sm text-gray-300 hover:text-white transition-all whitespace-nowrap"
                  >
                    {keyword}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-3">
                Keywords to find submission-friendly, discovery-focused, and niche playlists
              </p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-2xl p-4 mb-8">
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {/* Results Header */}
        {hasSearched && !isSearching && (
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold text-white">
                Results for "{searchGenre}"
              </h2>
              {totalResults > 0 && (
                <span className="px-3 py-1 bg-[#1DD1A1]/20 text-[#1DD1A1] rounded-full text-sm font-semibold">
                  {totalResults} playlists found
                </span>
              )}
            </div>

            {results.length > 0 && (
              <button
                onClick={exportToCSV}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white transition-all"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            )}
          </div>
        )}

        {/* Loading State */}
        {isSearching && (
          <div className="text-center py-12">
            <div className="inline-flex items-center gap-3 px-6 py-4 bg-white/5 rounded-2xl border border-white/20">
              <Loader2 className="w-6 h-6 animate-spin text-[#1DD1A1]" />
              <span className="text-white text-lg">Searching playlists...</span>
            </div>
            <p className="text-gray-400 text-sm mt-4">
              This may take a few moments as we scan thousands of playlists
            </p>
          </div>
        )}

        {/* No Results */}
        {hasSearched && !isSearching && results.length === 0 && !error && (
          <div className="text-center py-12">
            <div className="bg-white/5 rounded-2xl border border-white/20 p-8">
              <Music className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No playlists found</h3>
              <p className="text-gray-400">
                Try searching for a different genre or check your spelling
              </p>
            </div>
          </div>
        )}

        {/* Results Grid */}
        {results.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {results.map((playlist, index) => (
              <PlaylistCard key={index} playlist={playlist} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Individual Playlist Card Component
function PlaylistCard({ playlist }) {
  const hasContact = playlist.contactEmail || playlist.instagram || playlist.twitter || playlist.website;

  return (
    <div className="bg-black/80 backdrop-blur-sm rounded-3xl border border-white/10 p-6 hover:border-white/30 transition-all hover:bg-black/90 group">
      {/* Playlist Header */}
      <div className="mb-4">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-white group-hover:text-[#1DD1A1] transition-colors line-clamp-2">
            {playlist.name}
          </h3>
          {playlist.spotifyUrl && (
            <a
              href={playlist.spotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-3 py-1 bg-[#1DB954] hover:bg-[#1ed760] rounded-full text-white text-xs font-medium transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              Spotify
            </a>
          )}
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{playlist.curator}</span>
          </div>

          {playlist.songCount && (
            <div className="flex items-center gap-1">
              <Music className="w-4 h-4" />
              <span>{playlist.songCount} songs</span>
            </div>
          )}
        </div>

        {playlist.followers && (
          <div className="flex items-center gap-1 text-sm text-gray-400 mb-3">
            <CheckCircle className="w-4 h-4" />
            <span>{playlist.followers.toLocaleString()} followers</span>
          </div>
        )}

        {playlist.description && (
          <p className="text-gray-300 text-sm line-clamp-3 mb-4">
            {playlist.description}
          </p>
        )}
      </div>

      {/* Contact Information */}
      {hasContact ? (
        <div className="border-t border-white/10 pt-4">
          <p className="text-[#1DD1A1] text-sm font-semibold mb-3">Contact Info:</p>
          <div className="space-y-2">
            {playlist.contactEmail && (
              <a
                href={`mailto:${playlist.contactEmail}`}
                className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4" />
                {playlist.contactEmail}
              </a>
            )}

            {playlist.instagram && (
              <a
                href={playlist.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors"
              >
                <Instagram className="w-4 h-4" />
                Instagram
              </a>
            )}

            {playlist.twitter && (
              <a
                href={playlist.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors"
              >
                <Twitter className="w-4 h-4" />
                Twitter
              </a>
            )}

            {playlist.website && (
              <a
                href={playlist.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors"
              >
                <Globe className="w-4 h-4" />
                Website
              </a>
            )}
          </div>
        </div>
      ) : (
        <div className="border-t border-white/10 pt-4">
          <p className="text-gray-500 text-sm">No contact information available</p>
        </div>
      )}
    </div>
  );
}