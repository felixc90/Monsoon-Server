const dotenv = require('dotenv')
const User = require('./models/User');
const { get, put, post, del } = require('./helpers');

function createUser(userId, userData) {
  get('/me/playlists', userId)
  .then(data => {
    for (playlist of data.items) {
      route = playlist.tracks.href.slice('https://api.spotify.com/v1'.length)
      get(route, userId)
      .then(res => {
        console.log(res)
      })
    }
  })
  user = new User(userData)
  // user.save()
  return user
}

module.exports = {
  createUser: createUser
}