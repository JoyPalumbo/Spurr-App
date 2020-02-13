/* eslint no-console: ["error", { allow: ["warn", "error"] }] */
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();
const reqTo = require('./server/router.js');

// const socketIo = require('socket.io');

const passport = require('passport');
const rp = require('request-promise');
// const LocalStrategy = require('passport-local').Strategy;
require('./config/passport')(passport);
require('./dbConnection');
//add twilio client to send secret texts
const client = require('twilio')(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);

const app = express();

//web socket config
// const server = require('http').createServer(app);
// const io = socketIo.listen(server);

// app.use(express.static(__dirname + '/bower_components'));

// app.get('/', function (req, res, next) {
//   res.sendFile(__dirname + '/client/index.html');
// });

// io.on('connection', function (socket) {
//   console.log('a user connected');
// });


app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, '/client')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

// this is listened to by the post form in index.html
app.post('/api/users/signup', passport.authenticate('local-signup'), (req, res) => {
  res.json(req.body.username);
});
app.post('/api/users/signin', passport.authenticate('local-login'), (req, res) => {
  res.json(req.body.username);
});

//twilio api for messages
app.post('/api/text', (req, res) => {
  console.log('body', req.body);
  client.messages
  .create({
    from: '+14088444148',
    body: req.body.body,
    to: `+1${req.body.to}`
   })
  .then(message => console.log(message.sid))
  .catch(err => console.log('text error', err))
})

app.get('/api/imagequery',
(req, res, next) => {
  const parameters = {
    method: 'POST',
    url: 'https://connect.gettyimages.com/oauth2/token',
    body: `grant_type=client_credentials&client_id=${process.env.GETTY_KEY}&client_secret=${process.env.GETTY_SECRET}`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };
  rp(parameters)
    .then((token) => {
      const parseToken = JSON.parse(token).access_token;
      process.env.GETTY_TOKEN = parseToken;
      next();
    })
    .catch(err => console.err('ERROR:', err));
}
, (req, res) => {
  const parameters = {
    url: `https://api.gettyimages.com/v3/search/images?phrase=${req.query.data}`,
    headers: {
      'Api-Key': process.env.GETTY_KEY,
      Authorization: `Bearer ${process.env.GETTY_TOKEN}`,
    },
    method: 'GET',
  };
  rp(parameters)
    .then((images) => {
      const parsedImages = JSON.parse(images).images;
      const uris = parsedImages.reduce((accum, image) => {
        accum.push({
          id: image.id,
          url: image.display_sizes[0].uri,
        });
        return accum;
      }, []);
      res.send(uris);
    })
    .catch(err => console.err('ERROR:', err));
});

app.get('/#!/signout', (req, res) => {
  req.logout();
  res.redirect('/signin');
});

app.post('/api/spurrs', reqTo.postSpurr);

app.get('/api/spurrs', reqTo.getSpurr);

app.post('/api/savedSpurrs', reqTo.saveSpurr);

app.get('/api/savedSpurrs', reqTo.getSavedSpurrs);

app.delete('/api/savedSpurrs', reqTo.delSavedSpurrs);

module.exports = app;
