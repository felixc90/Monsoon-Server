import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs } from './schema.js';
import { resolvers } from './resolvers.js';
import { mongoose } from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();


import SpotifyAPI from './dataSources/SpotifyAPI.js'
import MongoDBDataSource from './dataSources/MongoDBDataSource.js'


// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs,
  resolvers,
  
  introspection: true
});


mongoose.connect(process.env.MONGODB_URI)
mongoose.connection.once('open', () => {
  console.log('Connected to database');
})


// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async () => {
    const { cache } = server;
    return {
      // We create new instances of our data sources with each request,
      // passing in our server's cache.
      dataSources: {
        spotifyAPI: new SpotifyAPI(),
        mongodb: new MongoDBDataSource(),
      },
    };
  },
});

console.log(`🚀  Server ready at: ${url}`);