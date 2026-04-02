// server/utils/MongooseUtil.js

const mongoose = require('mongoose');
const MyConstants = require('./MyConstants');

const uri =
`mongodb://${MyConstants.DB_USER}:${MyConstants.DB_PASS}@ac-oygbk1m-shard-00-00.8wrx3ze.mongodb.net:27017,ac-oygbk1m-shard-00-01.8wrx3ze.mongodb.net:27017,ac-oygbk1m-shard-00-02.8wrx3ze.mongodb.net:27017/${MyConstants.DB_DATABASE}?ssl=true&replicaSet=atlas-75wi98-shard-0&authSource=admin&retryWrites=true&w=majority`;

mongoose.connect(uri)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

mongoose.set('strictQuery', true);