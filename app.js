require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('express-jwt');
const path = require('path');
const app = express();
const routes = require('./routes');

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URL);
mongoose.Promise = require('bluebird');

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

const jwtCheck = jwt({
  secret: process.env.AUTH0_SECRET,
  audience: process.env.AUTH0_CLIENT,
});

const errorCheck = (err, req, res, next) => {
  if (err && err.name === 'UnauthorizedError') {
    return res.status(401).send({
      result: 'Unauthorized.',
    });
  }
  next();
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials');
	res.header('Access-Control-Allow-Credentials', 'true');
	next();
});

app.get('/', (req, res) => res.sendFile(path.resolve(__dirname, 'index.html')));

app.use(
	'/api',
	jwtCheck,
  errorCheck,
	routes
);
