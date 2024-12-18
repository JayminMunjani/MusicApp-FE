import React, { useState } from 'react'
import { Box, Button, IconButton, Typography, Modal, TextField, Tooltip } from '@mui/material'
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import { CREATE_PLAYLIST_MUTATION, UPDATE_PLAYLIST, DELETE_PLAYLIST } from '../../client/mutation/playList';
import { useMutation } from '@apollo/client';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import DeleteSweepOutlinedIcon from '@mui/icons-material/DeleteSweepOutlined';

function PlaylistSection({ playlists = [], setError, refetchPlaylists, selectedPlaylist, setSelectedPlaylist }) {
    const [openModal, setOpenModal] = useState(false)
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [playlistToDelete, setPlaylistToDelete] = useState(null);
    const [playlistData, setPlaylistData] = useState({
        id: '',
        name: '',
        description: ''
    })

    // * mutataions
    const [createPlaylist] = useMutation(CREATE_PLAYLIST_MUTATION);
    const [updatePlaylist] = useMutation(UPDATE_PLAYLIST);
    const [deletePlaylist] = useMutation(DELETE_PLAYLIST);

    const handlePlaylistClick = (playlist) => {
        setSelectedPlaylist(playlist)
    }

    const handleModalOpen = () => setOpenModal(true)
    const handleModalClose = () => {
        setOpenModal(false)
        setPlaylistData({ name: '', description: '' })
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setPlaylistData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleCreatePlaylist = () => {
        createPlaylist({
            variables: {
                input: {
                    ...playlistData
                }
            }
        }).then(() => {
            refetchPlaylists();
            setError();
        }).catch(err => {
            console.log(err)
            setError(err.message);
        })
        handleModalClose()
    }

    const handleEditPlaylistSubmit = () => {
        updatePlaylist({
            variables: {
                input: {
                    ...playlistData
                }
            }
        }).then(() => {
            refetchPlaylists();
            setError();
        }).catch(err => {
            console.log(err)
            setError(err.message);
        })
        handleModalClose()
    }

    const handleEditPlaylist = (playlist) => {
        setPlaylistData({
            id: playlist.id,
            name: playlist.name,
            description: playlist.description
        })
        handleModalOpen();
    }

    const handleDeletePlaylist = (playlistId) => {
        setPlaylistToDelete(playlistId);
        setDeleteConfirmOpen(true);
    }

    const confirmDelete = async () => {
        try {
            await deletePlaylist({
                variables: { playlistId: playlistToDelete }
            });
            setDeleteConfirmOpen(false);
            setPlaylistToDelete(null);
            refetchPlaylists();
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <Box sx={{ flex: '0 0 25%' }}>
            <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
                Your Playlists
            </Typography>
            <Button
                variant="contained"
                onClick={handleModalOpen}
                sx={{
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    color: 'white',
                    boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                    '&:hover': {
                        background: 'linear-gradient(45deg, #1976D2 30%, #00BCD4 90%)',
                    },
                    width: '100%',
                    padding: "20px"
                }}
            >
                <AddCircleOutlineOutlinedIcon fontSize="inherit" style={{ marginRight: '10px', width: '20px', height: '20px' }} />
                Create Playlist
            </Button>

            <Modal
                open={openModal}
                onClose={handleModalClose}
                aria-labelledby="create-playlist-modal"
                aria-describedby="modal-to-create-new-playlist"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    boxShadow: 24,
                    p: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2
                }}>
                    <Typography variant="h6" component="h2">
                        Create New Playlist
                    </Typography>
                    <TextField
                        fullWidth
                        label="Playlist Name"
                        name="name"
                        value={playlistData.name}
                        onChange={handleInputChange}
                        variant="outlined"
                    />
                    <TextField
                        fullWidth
                        label="Description"
                        name="description"
                        value={playlistData.description}
                        onChange={handleInputChange}
                        variant="outlined"
                        multiline
                        rows={4}
                    />
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                        <Button onClick={handleModalClose} variant="outlined">
                            Cancel
                        </Button>
                        <Button
                            onClick={() => {
                                playlistData?.id ? handleEditPlaylistSubmit() : handleCreatePlaylist()
                            }}
                            variant="contained"
                            disabled={!playlistData?.name.trim()}
                        >
                            {playlistData?.id ? 'Edit' : 'Create'}
                        </Button>
                    </Box>
                </Box>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                open={deleteConfirmOpen}
                onClose={() => setDeleteConfirmOpen(false)}
                aria-labelledby="delete-confirm-modal"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2
                }}>
                    <Typography variant="h6" component="h2">
                        Delete Playlist
                    </Typography>
                    <Typography sx={{ mt: 2 }}>
                        Are you sure you want to delete this playlist? This action cannot be undone.
                    </Typography>
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
                        <Button onClick={confirmDelete} color="error" variant="contained">
                            Delete
                        </Button>
                    </Box>
                </Box>
            </Modal>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, marginTop: 2 }}>
                {playlists.map((playlist) => (
                    <Box
                        key={playlist._id}
                        onClick={() => handlePlaylistClick(playlist)}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            p: 1,
                            borderRadius: 1,
                            backgroundColor: selectedPlaylist?.id === playlist.id ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                            '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                cursor: 'pointer'
                            }
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'space-between', width: '100%' }}>
                            <Box>
                                <Typography variant="body1" sx={{ color: 'text.primary' }}>
                                    {playlist.name}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    {playlist.description}
                                </Typography>
                            </Box>
                            <Box>
                                <Tooltip title="Edit playlist">
                                    <IconButton>
                                        <EditNoteOutlinedIcon sx={{ width: '20px', height: '20px' }} onClick={() => handleEditPlaylist(playlist)} />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete playlist">
                                    <IconButton>
                                        <DeleteSweepOutlinedIcon sx={{ width: '20px', height: '20px' }} onClick={() => handleDeletePlaylist(playlist._id)} />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Box>
                    </Box>
                ))}
            </Box>
        </Box>
    )
}

export default PlaylistSection