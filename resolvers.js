import { generateSpotifyAuthLink } from './utils/generateSpotifyAuthLink.js'

export const resolvers = {
  Query: {
    spotifyAuthLink: () => generateSpotifyAuthLink(),
  },
  Mutation: {
    login: async (_, { code }, { dataSources }) => {
      return 'THIS WORKS ' + code;
    },
  }
};
