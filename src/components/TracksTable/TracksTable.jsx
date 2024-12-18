import React, { useState } from 'react';
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    IconButton,
    Menu,
    MenuItem,
    Fade,
    Tooltip
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined';
import { ADD_TRACK_TO_PLAYLIST, REMOVE_TRACK_FROM_PLAYLIST } from '../../client/mutation/playList';
import { useMutation } from '@apollo/client';

const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds.padStart(2, '0')}`;
};

const TracksTable = ({ searchResults = [], playlists = [], selectedPlaylist = [], refetchPlaylists, setError }) => {
    console.log(searchResults)
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedTrack, setSelectedTrack] = useState(null);

    // mutations
    const [addTrackToPlaylist] = useMutation(ADD_TRACK_TO_PLAYLIST);
    const [removeTrackFromPlaylist] = useMutation(REMOVE_TRACK_FROM_PLAYLIST);

    const handleAddToPlaylist = (track, event) => {
        setSelectedTrack(track);
        setAnchorEl(event?.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedTrack(null);
    };

    const handlePlaylistSelect = (playlistId) => {
        debugger
        if (selectedTrack) {
            addTrackToPlaylist({
                variables: {
                    playlistId,
                    track: {
                        id: selectedTrack?.id,
                        title: selectedTrack?.name,
                        artist: selectedTrack?.artists?.map(artist => artist?.name)?.join(', '),
                        duration: selectedTrack?.duration_ms,
                        url: selectedTrack?.album?.images?.[0]?.url,
                    }
                }
            });
            handleMenuClose();
        }
    };

    const handleRemoveFromPlaylist = (trackId) => {
        removeTrackFromPlaylist({
            variables: {
                playlistId: selectedPlaylist?.id,
                trackId
            }
        }).then(() => {
            refetchPlaylists();
            setError();
        }).catch(err => {
            console.log(err)
            setError(err.message);
        })
    }


    return (
        <Box sx={{ width: "100%", maxWidth: "70%" }}>
            <TableContainer>
                <Table sx={{ minWidth: 650 }} aria-label="music table">
                    <TableHead>
                        <TableRow sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                            <TableCell sx={{ width: '4%', color: 'text.secondary' }}>#</TableCell>
                            <TableCell sx={{ width: '40%', color: 'text.secondary' }}>Title</TableCell>
                            <TableCell sx={{ width: '30%', color: 'text.secondary' }}>Album</TableCell>
                            <TableCell sx={{ width: '0%', color: 'text.secondary' }}></TableCell>
                            <TableCell sx={{ width: '11%', color: 'text.secondary' }} align="right">
                                <AccessTimeIcon fontSize="small" />
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {selectedPlaylist?.tracks?.length ?
                            selectedPlaylist?.tracks?.map((track, index) => (
                                <TableRow
                                    key={track?.id}
                                    sx={{
                                        '&:hover': {
                                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                        },
                                        '& td': {
                                            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                                            position: 'relative'
                                        },
                                        '& .action-buttons': {
                                            opacity: 0,
                                            transition: 'opacity 0.2s',
                                        },
                                        '&:hover .action-buttons': {
                                            opacity: 1
                                        }
                                    }}
                                >
                                    <TableCell sx={{ color: 'text.secondary' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Typography sx={{
                                                opacity: 1,
                                                transition: 'opacity 0.2s',
                                                '..TableRow:hover &': { opacity: 0 }
                                            }}>
                                                {index + 1}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <img
                                                src={track?.url || '/default-album.png'}
                                                alt={track?.album?.name}
                                                style={{
                                                    width: 40,
                                                    height: 40,
                                                    borderRadius: '4px',
                                                    objectFit: 'cover'
                                                }}
                                            />
                                            <Box>
                                                <Typography variant="body1" sx={{ color: 'text.primary' }}>
                                                    {track?.title}
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                    {track?.artist}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell sx={{ color: 'text.secondary' }}>{track?.album}</TableCell>
                                    <TableCell sx={{ color: 'text.secondary' }}>
                                        <Tooltip title="Remove from playlist">
                                            <IconButton
                                                size="small"
                                                aria-label="remove track from playlist"
                                                onClick={(event) => handleRemoveFromPlaylist(track?.id, event)}
                                            >
                                                <RemoveCircleOutlineOutlinedIcon fontSize="inherit" />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell sx={{ color: 'text.secondary' }} align="right">
                                        {formatDuration(track?.duration)}
                                    </TableCell>
                                </TableRow>
                            ))
                            : searchResults.map((track, index) => (
                                <TableRow
                                    key={track?.id}
                                    sx={{
                                        '&:hover': {
                                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                        },
                                        '& td': {
                                            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                                            position: 'relative'
                                        },
                                        '& .action-buttons': {
                                            opacity: 0,
                                            transition: 'opacity 0.2s',
                                        },
                                        '&:hover .action-buttons': {
                                            opacity: 1
                                        }
                                    }}
                                >
                                    <TableCell sx={{ color: 'text.secondary' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Typography sx={{
                                                opacity: 1,
                                                transition: 'opacity 0.2s',
                                                '..TableRow:hover &': { opacity: 0 }
                                            }}>
                                                {index + 1}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <img
                                                src={track?.album?.images?.[0]?.url || '/default-album.png'}
                                                alt={track?.album?.name}
                                                style={{
                                                    width: 40,
                                                    height: 40,
                                                    borderRadius: '4px',
                                                    objectFit: 'cover'
                                                }}
                                            />
                                            <Box>
                                                <Typography variant="body1" sx={{ color: 'text.primary' }}>
                                                    {track?.name}
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                    {track?.artists?.map(artist => artist?.name)?.join(', ')}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell sx={{ color: 'text.secondary' }}>{track?.album?.name}</TableCell>
                                    <TableCell sx={{ color: 'text.secondary' }}>
                                        <Tooltip title="Add to playlist">
                                            <IconButton
                                                size="small"
                                                aria-label="add track to playlist"
                                                onClick={(event) => handleAddToPlaylist(track, event)}
                                            >
                                                <AddCircleOutlineOutlinedIcon fontSize="inherit" />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell sx={{ color: 'text.secondary' }} align="right">
                                        {formatDuration(track?.duration_ms)}
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                TransitionComponent={Fade}
                sx={{
                    '& .MuiPaper-root': {
                        backgroundColor: '#282828',
                        color: 'white',
                        minWidth: 200,
                        boxShadow: '0 16px 24px rgba(0,0,0,0.3)'
                    }
                }}
            >
                {playlists.map((playlist) => (
                    <MenuItem
                        key={playlist?._id}
                        onClick={() => handlePlaylistSelect(playlist?.id)}
                        sx={{
                            '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.1)'
                            }
                        }}
                    >
                        {playlist.name}
                    </MenuItem>
                ))}
                {playlists.length === 0 && (
                    <MenuItem disabled>
                        No playlists available
                    </MenuItem>
                )}
            </Menu>


        </Box>
    )
}

export default TracksTable