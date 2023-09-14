import { DataSource } from 'apollo-datasource'

import User from '../models/User.js'
import Playlist from '../models/Playlist.js'
import Artist from '../models/Artist.js'
import Album from '../models/Album.js'
import Song from '../models/Song.js'

class MongoDBDataSource extends DataSource {

  async findOrCreateUser({ id, name, oauth2Token }) {
    let user = await User.findOne({id: id});
    if (user) {
      user = {
        ...user,
        oauth2Token: oauth2Token
      }
      return user;
    }
    
    user = new User({
      id: id,
      name: name,
      oauth2Token: oauth2Token,
      'playlistIds' : [],
      'taggedSongIds' : []
    })
    await user.save();
    return user;
  }

  // currently just replaces playlists
  async addPlaylists(user, playlistsData) {

    const taggedSongIds = [];
    const playlistPromises = [];

    for (let playlistObj of playlistsData) {
      const songPromises = playlistObj.tracks.map(track => this.createSong(track));
      const playlistPromise = Promise.all(songPromises)
        .then(songs => {
          console.log('1', playlistObj.id)
          console.log('2', songs[0])
          const playlist = new Playlist({
            'name' : playlistObj.name,
            'id' : playlistObj.id,
            'ownerId': playlistObj.ownerId,
            'image' : playlistObj.images,
            'taggedSongIds' : songs.map(song => song.id)
          })
          return playlist.save()
        })
      playlistPromises.push(playlistPromise)
      break;
    }

    const playlists = await Promise.all(playlistPromises);
    
    console.log('3', playlists[0]);
    user.playlistIds = playlists.map(playlist => playlist.id);
    user.taggedSongIds = taggedSongIds;

    await user.save()
    console.log(user);
    return user
  }

  async createSong(songObj) {
    const artists = await Promise.all(songObj.artists.map(artist => this.createArtist(artist)))
    const album = await this.createAlbum(songObj.album);
    console.log('4', songObj.id)
    console.log('5', artists[0])
    console.log('6', album.id)
    const song = new Song({
      id: songObj.id,
      artistIds: artists.map(artist => artist.id),
      albumId: album.id,
      duration: songObj.duration,
      name: songObj.name,
      popularity: songObj.popularity,
      addedAt: songObj.addedAt
    })

    return song.save();
  }

  async createArtist(artistObj) {
    console.log('8', artistObj.id)
    const artist = new Artist({
      id: artistObj.id,
      name: artistObj.name
    })

    return artist.save();
  }

  async createAlbum(albumObj) {
    const artists = await Promise.all(albumObj.artists.map(artist => this.createArtist(artist)))
    console.log('10', albumObj.artists)
    console.log('11', albumObj.id)
    const album = new Album({
      'artistIds': albumObj.artists.map(artist => artist.id),
      'id': albumObj.id,
      'images': albumObj.images,
      'name': albumObj.name,
      'releaseDate': albumObj.releaseDate
    });
    return album.save();
  }

}

export default MongoDBDataSource;