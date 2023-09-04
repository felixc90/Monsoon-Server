const User = require('./models/User');

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
async function fetchSpotifyData(method, route, body, userId=undefined, accessToken=undefined) {
  if (!accessToken && userId) {
    user = await User.findOne({id : userId})
    accessToken = await getAccessToken(user.refreshToken)
  }


  // use the access token to access the Spotify Web API
  options = {
    method: method,
    headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + accessToken}
  }

  if (body) {
    options = {...options, body: body}
  }

  return fetch('https://api.spotify.com/v1' + route, options).then(res => res.json());
}

async function get(route, userId, accessToken) {
  return await fetchSpotifyData('get', route, undefined, userId, accessToken);
}

async function post(route, body, accessToken, userId) {
  return await fetchSpotifyData('post', route, body, userId, accessToken);
}

async function put(route, body, accessToken, userId) {
  return await fetchSpotifyData('put', route, body, userId, accessToken);
}

async function del(route, body, accessToken, userId) {
  return await fetchSpotifyData('delete', route, body, userId, accessToken);
}

async function getAccessToken(refreshToken) {
  const params = new URLSearchParams();
  params.append("grant_type", "refresh_token");
  params.append("refresh_token", refreshToken);
  params.append("client_id", process.env.CLIENT_ID);
  params.append("client_secret",  process.env.CLIENT_SECRET);

  return await fetch('https://accounts.spotify.com/api/token', {
    method: 'post',
    body: params,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Accept": "application/json"
    }
  })
  .then(res => res.json())
  .then(body => {
    console.log(body)
    return body.access_token})
};


module.exports = {
  get: get,
  post: post,
  put: put,
  del: del
}