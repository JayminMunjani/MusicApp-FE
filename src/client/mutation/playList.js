import { gql } from "@apollo/client";

export const CREATE_PLAYLIST_MUTATION = gql`
  mutation CreatePlaylist($input: PlaylistInput) {
    createPlaylist(input: $input) {
      id
      name
      description
      userId
      tracks {
        id
        title
        artist
        duration
        url
      }
      isDeleted
    }
  }
`;

export const UPDATE_PLAYLIST = gql`
  mutation UpdatePlaylist($input: UpdatePlaylistInput) {
    updatePlaylist(input: $input) {
      id
      name
      description
      userId
      tracks {
        id
        title
        artist
        duration
        url
      }
      isDeleted
    }
  }
`;

export const DELETE_PLAYLIST = gql`
  mutation DeletePlaylist($playlistId: ID!) {
    deletePlaylist(id: $playlistId)
  }
`;

export const ADD_TRACK_TO_PLAYLIST = gql`
  mutation AddTrackToPlaylist($playlistId: ID!, $track: TrackInput) {
    addTrackToPlaylist(playlistId: $playlistId, track: $track) {
      id
      name
      description
      userId
      tracks {
        id
        title
        artist
        duration
        url
      }
      isDeleted
    }
  }
`;

export const REMOVE_TRACK_FROM_PLAYLIST = gql`
	mutation RemoveTrackFromPlaylist($playlistId: ID!, $trackId: ID!) {
		removeTrackFromPlaylist(playlistId: $playlistId, trackId: $trackId) {
			id
			name
			description
			userId
			tracks {
				id
				title
				artist
				duration
				url
			}
			isDeleted
		}
	}
`;