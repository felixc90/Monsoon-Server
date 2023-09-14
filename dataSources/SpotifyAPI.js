import { RESTDataSource } from "@apollo/datasource-rest"
import dotenv from 'dotenv';

dotenv.config();

class SpotifyAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = "https://api.spotify.com/v1/";
  }

  authoriseUser({ code }) {
    const params = new URLSearchParams();
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", process.env.REDIRECT_URI);
    params.append("client_id", process.env.CLIENT_ID);
    params.append("client_secret",  process.env.CLIENT_SECRET);
  
    return fetch('https://accounts.spotify.com/api/token', {
      method: 'post',
      body: params,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept": "application/json"
      }
    })
    .then(res => res.json())
    .then(async (json) => {
      let expiresAt = new Date();
      expiresAt.setSeconds(expiresAt.getSeconds() + json.expires_in);
      const user = await this.get('me', {
        headers: {
          'Content-Type': 'application/json', 
          'Authorization': 'Bearer ' + json.access_token
        }
      });

      const playlist = await this.get('me/playlists', {
        headers: {
          'Content-Type': 'application/json', 
          'Authorization': 'Bearer ' + json.access_token
        }
      });
      return {
        id: user.id,
        name: user.display_name,
        oauth2Token: {
          refreshToken: json.refresh_token,
          accessToken: json.access_token,
          expiresAt: expiresAt
        }
      }
    })
  }

  getPlaylists({ oauth2Token }) {
    return this.get('me/playlists', {
      headers: {
        'Content-Type': 'application/json', 
        'Authorization': 'Bearer ' + oauth2Token.accessToken
      }
    })
    .then(res => {
      const playlistPromises = []
      for (let item of res.items) {
        playlistPromises.push(
          this.get(`playlists/${item.id}`, { headers: {
            'Content-Type': 'application/json', 
            'Authorization': 'Bearer ' + oauth2Token.accessToken
          }})
        )
      }
      return Promise.all(playlistPromises)
      .then(playlists => playlists
        .map(playlist => this.playlistReducer(playlist)))
    });
  }

  playlistReducer(playlist) {
    return {
      'name' : playlist.name,
      'id' : playlist.id,
      'ownerId': playlist.owner.id,
      'images' : playlist.images,
      'tracks' : playlist.tracks.items.map(track => this.trackReducer(track))
    }
  }

  trackReducer(track) {
    const addedAt = track.added_at;
    track = track.track
    return {
      id: track.id,
      artists: track.artists.map(artist => this.artistReducer(artist)),
      album: this.albumReducer(track.album),
      duration: track.duration_ms,
      name: track.name,
      popularity: track.popularity,
      addedAt: addedAt
    };
  }

  artistReducer(artist) {
    return {
      'id' : artist.id,
      'name' : artist.name,
    }
  }

  albumReducer(album) {
    return {
      'artists': album.artists.map(artist => this.artistReducer(artist)),
      'id': album.id,
      'images': album.images,
      'name': album.name,
      'releaseDate': album.releaseDate
    };
  }

}

export default SpotifyAPI;