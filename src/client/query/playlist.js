import { gql } from "@apollo/client";

export const GET_ALL_PLAYLISTS = gql`
  query GetAllPlaylists {
    getAllPlaylists {
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
