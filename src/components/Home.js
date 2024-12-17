import React, { useState } from 'react';
import { 
  TextField, 
  Button, 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Grid, 
  Container, 
  Box,
  useMediaQuery,
  useTheme
} from '@mui/material';

const SearchComponent = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);
  const theme = useTheme();
  
  // Responsive breakpoint checks
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  const handleSearch = async () => {
    const accessToken = '1POdFZRZbvb...qqillRxMr2z';

    try {
      const url = new URL('https://api.spotify.com/v1/search');
      url.searchParams.append('q', searchQuery);
      url.searchParams.append('type', 'track');
      url.searchParams.append('limit', '50');
      url.searchParams.append('offset', '1');
      url.searchParams.append('include_external', 'audio');

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Spotify API request failed');
      }

      const data = await response.json();
      const tracks = data.tracks.items;
      setSearchResults(tracks);
      setError(null);
    } catch (err) {
      console.error('Error searching tracks:', err);
      setError('Failed to fetch tracks. Please try again.');
      setSearchResults([]);
    }
  };

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
          alignItems: 'center',
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

        <Grid 
          container 
          spacing={{ 
            xs: 1, 
            sm: 2, 
            md: 3 
          }}
        >
          {searchResults.map((track) => (
            <Grid 
              item 
              xs={12} 
              sm={6} 
              md={4} 
              lg={3} 
              key={track.id}
            >
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column' 
                }}
              >
                <CardMedia
                  component="img"
                  height={isMobile ? '150' : '250'}
                  image={track.album.images[0]?.url || '/default-album.png'}
                  alt={track.album.name}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography 
                    variant={isMobile ? "subtitle1" : "h6"} 
                    noWrap
                  >
                    {track.name}
                  </Typography>
                  <Typography 
                    variant="subtitle2" 
                    color="text.secondary" 
                    noWrap
                  >
                    {track.artists.map(artist => artist.name).join(', ')}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    noWrap
                  >
                    Album: {track.album.name}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default SearchComponent;