const graphql = require('graphql');
const User = require('../models/User');
const Playlist = require('../models/Playlist');
const Song = require('../models/Song');
const TaggedSong = require('../models/TaggedSong');

const { 
  GraphQLObjectType, 
  GraphQLString, 
  GraphQLID,
  GraphQLList,
  GraphQLSchema,
  GraphQLInt
} = graphql;

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: {type: GraphQLID},
    name: {type: GraphQLString},
    playlists: {
      type: new GraphQLList(PlaylistType),
      resolve(parent, args) {
        return Playlist.find({userId: parent.id})
      }
    }
  })
})

const PlaylistType = new GraphQLObjectType({
  name : 'Playlist',
  fields: () => ({
    id: {type: GraphQLID},
    name: {type: GraphQLString},
    image: {type: GraphQLString},
    songs: {
      type: new GraphQLList(TaggedSongType),
      resolve(parent, args) {
        const promises = parent.taggedSongIds.map(songId => {
          return TaggedSong.findOne({ id: songId})
        })
        return Promise.all(promises)
      }
    }
  })
})

const TaggedSongType = new GraphQLObjectType({
  name : 'TaggedSong',
  fields: () => ({
    id: {type: GraphQLID},
    song: {
      type: SongType,
      resolve(parent, args) {
        return Song.findOne({id: parent.songId})
      }
    }
  })
})

const SongType = new GraphQLObjectType({
  name: 'Song',
  fields: () => ({
    id: {type: GraphQLID},
    name: {type: GraphQLString},
    duration: {type: GraphQLInt},
    popularity: {type: GraphQLInt},
    // 'artistIds' : [String],
    // 'albumId' : String,
  })
})


const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      args: {id: {type: GraphQLID}},
      resolve(parent, args) {
        return User.findOne({id: args.id})
      }
    },
    playlist: {
      type: PlaylistType,
      args: {id: {type: GraphQLID}},
      resolve(parent, args) {
        return Playlist.findOne({id: args.id})
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery
})