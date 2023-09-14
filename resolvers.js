import { generateSpotifyAuthLink } from './utils/generateSpotifyAuthLink.js'

export const resolvers = {

  Query: {
    spotifyAuthLink: () => generateSpotifyAuthLink(),
  },
  Mutation: {
    login: async (_, { code }, { dataSources }) => {
      const userData = await dataSources.spotifyAPI.authoriseUser({ code: code });
      const user = await dataSources.mongodb.findOrCreateUser(userData);
      const playlistsData = await dataSources.spotifyAPI.getPlaylists(user);
      console.log(playlistsData[0].tracks[0].album)
      await dataSources.mongodb.updatePlaylists(user, playlistsData);

      return {
        id: 'ID GOES HERE',
        token: 'TOKEN GOES HERE'
      }
    },
  }
};
