const dotenv = require('dotenv')
const User = require('./models/User');
const Playlist = require('./models/Playlist');
const Artist = require('./models/Artist');
const Album = require('./models/Album');
const Song = require('./models/Song');
const { get, put, post, del } = require('./helpers');

async function createUser(accessToken, userData) {
  playlistPromises = []
  data = await get('/me/playlists', undefined, accessToken)
  for (playlist of data.items) {
    url = playlist.href.slice('https://api.spotify.com/v1'.length)
    playlistPromises.push(
      get(url, undefined, accessToken)
      .then(res => createPlaylist(res))
    )
    // break
  }

  const playlistIds = await Promise.all(playlistPromises)
  userData = {
    ...userData,
    'playlistIds' : playlistIds,
    'songIds' : [],
  }
  user = new User(userData)
  await user.save()

  return user
}

async function createPlaylist(playlistObject) {
  count = 0
  songPromises = []
  for (item of playlistObject.tracks.items) {
    if (count == 1) {
      break;
    }
    songPromises.push(createSong(item.track))
    // count += 1
  }
  const songIds = await Promise.all(songPromises)
  const playlist = new Playlist({
    'name' : playlistObject.name,
    'id' : playlistObject.id,
    'image' : playlistObject.images[0].url,
    'userId': playlistObject.owner.id,
    'songIds' : songIds
  })
  await playlist.save()
  return playlist.id
}

async function createSong(songObject) {
  if (await Song.findOne({id: songObject.id})) {
    return songObject.id
  }

  const artistIds = await Promise.all(songObject.artists.map(artist => createArtist(artist)))

  const song = new Song({
    'id' : songObject.id,
    'artistIds' : artistIds,
    'albumId' : await createAlbum(songObject.album),
    'duration' : songObject.duration_ms,
    'name' : songObject.name,
    'popularity' : songObject.popularity,
  })
  await song.save()
  return songObject.id
}

async function createArtist(artistObject) {
  if (await Artist.findOne({id: artistObject.id})) {
    return artistObject.id
  }
  const artist = new Artist({
    'id' : artistObject.id,
    'genres' : artistObject.genres,
    'name' : artistObject.name,
    'popularity' : artistObject.popularity
  })
  await artist.save();
  return artistObject.id
}


async function createAlbum(albumObject) {
  if (await Album.findOne({id: albumObject.id})) {
    return albumObject.id
  }

  const artistIds = await Promise.all(albumObject.artists.map(artist => createArtist(artist)))
  const album = new Album({
    'id' : albumObject.id,
    'artistIds' : artistIds,
    'image' : albumObject.images[0].url,
    'name' : albumObject.name,
    'releaseDate' : albumObject.release_date
  })
  await album.save();
  return albumObject.id
}

module.exports = {
  createUser: createUser
}