import { generateSpotifyOAuthLink } from './utils/generateSpotifyOAuthLink.js'

export const resolvers = {
  Query: {
      getSpotifyOAuthLink: () => generateSpotifyOAuthLink(),
  },
};
