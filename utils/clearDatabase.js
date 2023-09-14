import User from '../models/User.js'
import Playlist from '../models/Playlist.js'
import Artist from '../models/Artist.js'
import Album from '../models/Album.js'
import Song from '../models/Song.js'

export const clearDatabase = () => {
  return Promise.all([
    User.deleteMany({}),
    Playlist.deleteMany({}),
    Artist.deleteMany({}),
    Album.deleteMany({}),
    Song.deleteMany({})
  ])
}