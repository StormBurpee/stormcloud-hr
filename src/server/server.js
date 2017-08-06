var express               = require('express');
var bodyParser            = require('body-parser');
var redis                 = require('redis');
var bluebird              = require('bluebird');

//MODELS

//Init
var app = express();
app.user(bodyParser.urlencoded({extended: true}));
app.user(bodyParser.json());
var port        = process.env.PORT || 8080;
var redisPort   = 6379;
var redisClient = redis.createClient(redisPort, "127.0.0.1");

rClient.hmset("StormCloudHR", {
  "version": "0.0.0",
  "parent": "StormCloud",
  "developer", "Storm Burpee (Storm Consolidated)"
});
