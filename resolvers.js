import { generateSpotifyAuthLink } from './utils/generateSpotifyAuthLink.js'

export const resolvers = {

  Query: {
    spotifyAuthLink: () => generateSpotifyAuthLink(),
  },
  Mutation: {
    login: async (_, { code }, { dataSources }) => {
      const res = await dataSources.spotifyAPI.authoriseUser({ code: code });
      console.log(res);
      return {
        id: 'ID GOES HERE',
        token: 'TOKEN GOES HERE'
      }
    },
  }
};
