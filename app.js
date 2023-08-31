const express = require('express');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const cors = require('cors');
const querystring = require('querystring');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { authoriseUser } = require('./auth');

dotenv.config()



/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
const generateRandomString = function(length) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};


const app = express();

app.use(express.static(__dirname + '/public'))
   .use(cors())
   .use(cookieParser());



const state = generateRandomString(16);

// your application requests authorization
const scope = 'user-read-private user-read-email';
console.log('https://accounts.spotify.com/authorize?' +
  querystring.stringify({
    response_type: 'code',
    client_id: process.env.CLIENT_ID,
    scope: scope,
    redirect_uri: process.env.REDIRECT_URI,
    state: state
  }));

app.get('/auth', authoriseUser)

mongoose.connect(process.env.MONGODB_CONNECT)
mongoose.connection.once('open', () => {
  console.log('Connected to database');
})

console.log('Listening on 4000');
app.listen(4000);