const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const dotenv = require('dotenv')
const User = require('./models/User');
const { get, put, post, del } = require('./helpers');
const { createUser } = require('./user');


dotenv.config()


const encodeFormData = (data) => {
  return Object.keys(data)
    .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
    .join('&');
}

function authoriseUser(req, res) {

  // your application requests refresh and access tokens
  // after checking the state parameter

  const params = new URLSearchParams();
  params.append("grant_type", "authorization_code");
  params.append("code", req.query.code);
  params.append("redirect_uri", process.env.REDIRECT_URI);
  params.append("client_id", process.env.CLIENT_ID);
  params.append("client_secret",  process.env.CLIENT_SECRET);

  fetch('https://accounts.spotify.com/api/token', {
    method: 'post',
    body: params,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Accept": "application/json"
    }
  })
  .then(res => res.json())
  .then(body => {
    if (!body.error) {
      
      const access_token = body.access_token,
      refresh_token = body.refresh_token;
      
      // use the access token to access the Spotify Web API
      get('/me', undefined, access_token)
      .then(async (body) => {
        console.log(body)
        if (body.error) {
          res.json(body)
          console.log(body.error.message)
          return;
        }
        let user = await User.findOne({id : body.id})
        if (user) {
          console.log('User already exists')
          res.send({
            'message' : 'User already exists'
          })
          return;
        }
        
        user = await createUser(access_token, {
          'id' : body.id,
          'name' : body.display_name,
          // TODO: implement this
          'accessToken' : access_token,
          'refreshToken' : refresh_token
        })
        res.send(user)
      });
      
    } else {
      res.json({ error: 'invalid_token' });
    }
  })
};

module.exports = {
  authoriseUser: authoriseUser,
};