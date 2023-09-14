import { DataSource } from 'apollo-datasource'

import User from '../models/User.js'
import Playlist from '../models/Playlist.js'

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
  async updatePlaylists(user, playlistData) {
    // const taggedSongIds = [];


    // const playlistPromises = []
    // for (let playlistObj of playlistData.items) {
    //   const playlist = new Playlist({
    //     'name' : playlistObj.name,
    //     'id' : playlistObj.id,
    //     'userId': playlistObj.owner.id,
    //     'image' : playlistObj.images,
    //     'taggedSongIds' : playlistSongIds
    //   })
    //   playlistPromises.push(playlist.save())
    // }

    // const playlists = await Promise.all(playlistPromises);
    
    // user.playlistIds = playlists.map(playlist => playlist.id);
    // user.taggedSongIds = taggedSongIds;

    // await user.save()
    // console.log(user);
    // return user
  }


  






}

export default MongoDBDataSource;