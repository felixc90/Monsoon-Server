const dotenv = require('dotenv')
const User = require('./models/User');
const Playlist = require('./models/Playlist');
const Artist = require('./models/Artist');
const Album = require('./models/Album');
const Song = require('./models/Song');
const TaggedSong = require('./models/TaggedSong');
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
    break;
  }

  const playlists = await Promise.all(playlistPromises)
  const taggedSongIds = []
  for (playlist of playlists) {
    taggedSongIds.push(...playlist.taggedSongIds)
  }

  userData = {
    ...userData,
    'playlistIds' : playlists.map(playlist => playlist.id),
    'taggedSongIds' : taggedSongIds,
    'tagIds' : []
  }
  user = new User(userData)
  await user.save()

  return user
}

async function createPlaylist(playlistObject) {
  songPromises = []
  for (item of playlistObject.tracks.items) {
    songPromises.push(createTaggedSong(item.track, playlistObject.owner.id))
  }


  const songIds = await Promise.all(songPromises)
  const playlist = new Playlist({
    'name' : playlistObject.name,
    'id' : playlistObject.id,
    'image' : playlistObject.images[0].url,
    'userId': playlistObject.owner.id,
    'taggedSongIds' : songIds
  })
  await playlist.save()
  return playlist
}

async function createTaggedSong(songObject, userId) {
  const song = await Song.findOne({id: songObject.id})

  if (!song) {
    const artistIds = await Promise.all(songObject.artists.map(artist => createArtist(artist)))
  
    const song = new Song({
      'id' : songObject.id,
      'artistIds' : artistIds,
      'albumId' : await createAlbum(songObject.album),
      'duration' : songObject.duration_ms,
      'name' : songObject.name,
      'popularity' : songObject.popularity,
    })

    await song.save();
  }

  const taggedSongId = userId + songObject.id

  const taggedSong = new TaggedSong({
    'id' : taggedSongId,
    'userId' : userId,
    'tags': [],
    'songId': songObject.id
  })

  
  await taggedSong.save();
  return taggedSongId;
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