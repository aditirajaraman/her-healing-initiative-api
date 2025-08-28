// include configs
require("dotenv").config();
require("../config/appConfig");

const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');

// Connect to your MongoDB database
mongoose.connect('mongodb://127.0.0.1:27017/her-healing-initiative', { useNewUrlParser: true, useUnifiedTopology: true });

// Configure session store
const SessionStore = MongoStore.create({
  mongoUrl: 'mongodb://127.0.0.1:27017/her-healing-initiative',
  collectionName: 'sessions', // collection to store session data
});

// Set up your S3 client using environment variables
// It's recommended to configure credentials and region this way
// for production applications.
// Create S3 service object


export { SessionStore };