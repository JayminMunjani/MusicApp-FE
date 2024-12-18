import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  TextField,
  Button,
  Box,
  useMediaQuery,
  useTheme,
  Typography,
  Container,
} from '@mui/material';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import TracksTable from '../../components/TracksTable/TracksTable';
import PlaylistSection from '../../components/PlaylistSection/PlaylistSection';
import { useQuery } from '@apollo/client';
import { GET_ALL_PLAYLISTS } from '../../client/query/playlist';

const SearchComponent = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);
  const [isSpotifyAuthenticated, setIsSpotifyAuthenticated] = useState(!!localStorage.getItem('spotifyAccessToken'));
  const [selectedPlaylist, setSelectedPlaylist] = useState(null)

  const theme = useTheme();

  const { data: playlistsData, refetch: refetchPlaylists } = useQuery(GET_ALL_PLAYLISTS);

  // Responsive breakpoint checks
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleSearch = async () => {
    const accessToken = localStorage.getItem('spotifyAccessToken');

    if (!accessToken) {
      setError('Please authenticate with Spotify first.');
      return;
    }

    try {
      setSelectedPlaylist(null);

      const url = 'https://api.spotify.com/v1/search';
      const params = {
        q: searchQuery,
        type: 'track',
        limit: '10',
        offset: '1',
        include_external: 'audio'
      };

      const response = await axios.get(url, {
        params: params,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      const data = response.data;
      const tracks = data.tracks.items;
      setSearchResults(tracks);
      setError(null);
    } catch (error) {
      setError('Failed to fetch tracks. Please try again.');
      setSearchResults([]);
      console.error('Error:', error);
    }
  };

  const handleSpotifyLogin = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BE_URL}/api/auth/signin`);

      if (response.data && response.data.authUrl) {
        window.location.href = response.data.authUrl;
      }
    } catch (error) {
      console.error('Login failed:', error);
      setError('Login failed. Please try again.');
    }
  }

  useEffect(() => {
    const url = new URL(window.location.href);
    const accessToken = url.searchParams.get('access_token') || '';
    if (accessToken) {
      localStorage.setItem('spotifyAccessToken', accessToken);
      setIsSpotifyAuthenticated(true);
      url.searchParams.delete('access_token');
      console.log(url.toString());
      window.history.replaceState({}, '', url.toString());
    }
  }, [window.location.href]);

  useEffect(() => {
    if (playlistsData?.getAllPlaylists?.length && selectedPlaylist) {
      const playlist = playlistsData?.getAllPlaylists?.find(playlist => playlist.id === selectedPlaylist?.id);
      if (!playlist) {
        setSelectedPlaylist(playlistsData?.getAllPlaylists[0]);
      } else setSelectedPlaylist(playlist);
    }
  }, [playlistsData?.getAllPlaylists]);

  return (
    <Container maxWidth="xl" sx={{
      padding: {
        xs: 1,
        sm: 2,
        md: 3
      }
    }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'start',
          width: '100%'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            flexDirection: isMobile ? 'column' : 'row',
            gap: 2,
            marginBottom: 2
          }}
        >
          {
            !isSpotifyAuthenticated && (
              <Button
                variant="contained"
                startIcon={<MusicNoteIcon />}
                sx={{
                  marginBottom: 2,
                  backgroundColor: '#1DB954',
                  color: '#FFFFFF',
                  fontWeight: 'bold',
                  padding: '12px 24px',
                  borderRadius: '25px',
                  textTransform: 'none',
                  fontSize: '16px',
                  '&:hover': {
                    backgroundColor: '#1ed760'
                  }
                }}
                onClick={handleSpotifyLogin}
              >
                Login with Spotify
              </Button>
            )
          }
          <TextField
            fullWidth
            variant="outlined"
            label="Search Songs"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            sx={{
              flex: 1,
              marginBottom: isMobile ? 1 : 0
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSearch}
            sx={{
              width: isMobile ? '100%' : 'auto',
              height: '56px'
            }}
          >
            Search
          </Button>
        </Box>

        {error && (
          <Typography
            color="error"
            sx={{
              width: '100%',
              textAlign: 'center',
              marginBottom: 2
            }}
          >
            {error}
          </Typography>
        )}

        {searchResults.length > 0 && (
          <Typography
            variant="h5"
            sx={{
              mb: 3,
              color: 'text.primary',
              alignSelf: 'start'
            }}
          >
            Search Results
          </Typography>
        )}

        <Box sx={{ display: 'flex', gap: 4, width: '100%' }}>
          <TracksTable
            searchResults={searchResults}
            selectedPlaylist={selectedPlaylist}
            playlists={playlistsData?.getAllPlaylists}
            refetchPlaylists={refetchPlaylists}
            setError={setError}
          />

          <PlaylistSection
            playlists={playlistsData?.getAllPlaylists}
            setError={setError}
            refetchPlaylists={refetchPlaylists}
            selectedPlaylist={selectedPlaylist}
            setSelectedPlaylist={(v) => { setSelectedPlaylist(v); setSearchResults([]); setSearchQuery(); }}
          />
        </Box>
      </Box>
    </Container>
  );
};

export default SearchComponent;