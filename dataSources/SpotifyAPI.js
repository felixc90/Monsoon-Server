import { RESTDataSource } from "@apollo/datasource-rest"
import dotenv from 'dotenv';

dotenv.config();

class SpotifyAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = "https://api.spacexdata.com/v2/";
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
    
  }
}

export default SpotifyAPI;