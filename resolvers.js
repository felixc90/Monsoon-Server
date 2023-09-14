import { generateSpotifyAuthLink } from './utils/generateSpotifyAuthLink.js'
import { clearDatabase } from './utils/clearDatabase.js'

export const resolvers = {

  Query: {
    spotifyAuthLink: () => generateSpotifyAuthLink(),
  },
  Mutation: {
    login: async (_, { code }, { dataSources }) => {
      await clearDatabase();
      const userData = await dataSources.spotifyAPI.authoriseUser({ code: code });
      const user = await dataSources.mongodb.findOrCreateUser(userData);
      const playlistsData = await dataSources.spotifyAPI.getPlaylists(user);
      await dataSources.mongodb.addPlaylists(user, playlistsData);
      return {
        id: 'ID GOES HERE',
        token: 'TOKEN GOES HERE'
      }
    },
  }
};
