const User = require('./models/User');

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
async function fetchSpotifyData(method, route, body, accessToken=undefined, userId=undefined) {
  if (!accessToken && userId) {
    user = await User.findOne({id : userId}, { accessToken: 1 })
    accessToken = user.accessToken
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
  return await fetchSpotifyData('get', route, undefined, accessToken, userId);
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

// function getAccessToken(userId) {
//   const authOptions = {
//     url: 'https://accounts.spotify.com/api/token',
//     headers: { 'Authorization': 'Basic ' + (new Buffer(process.env.CLIENT_ID + ':' + process.env.clie).toString('base64')) },
//     form: {
//       grant_type: 'refresh_token',
//       refresh_token: refresh_token
//     },
//     json: true
//   };

//   request.post(authOptions, function(error, response, body) {
//     if (!error && response.statusCode === 200) {
//       const access_token = body.access_token;
//       res.send({
//         'access_token': access_token
//       });
//     }
//   });
// });


module.exports = {
  get: get,
  post: post,
  put: put,
  del: del
}