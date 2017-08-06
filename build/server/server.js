var express               = require('express');
var bodyParser            = require('body-parser');
var redis                 = require('redis');
var bluebird              = require('bluebird');
var packageJson           = require(process.env.PWD + '/package.json');
var version               = packageJson.version;
var developer             = packageJson.author;

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

//MODELS
var Model                 = require('./models/model');
var User                  = require('./models/users/user');

//Init
var app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
var port        = process.env.PORT || 8080;
var redisPort   = 6379;
var redisClient = redis.createClient(redisPort, "127.0.0.1");

//init models
var user = new User(redisClient);

redisClient.hmset("StormCloudHR", {
  "version": version,
  "parent": "StormCloud",
  "developer": developer
});

var router = express.Router();

router.get('/', function(request, response) {
  response.json({message: "StormCloud - StormCloudHR API", version: version});
});

router.get('/users/all', function(request, response) {

});

router.post("/users", function(request, response) {
  if(request.body.email && request.body.username && request.body.password){
    user.registerUser(request.body.email, request.body.username, request.body.password).then(resp => {
      response.json({message: resp});
    });
  }
  else {
    response.json({message: "Please supply username, email and password.", error: 1});
  }
});

router.get("/user/:username", function(request, response) {
  user.findUser(request.params.username).then(resp => {
    response.json({user: resp});
  });
});

router.post("/user/login", function(request, response) {
  if(request.body.username && request.body.password) {
    user.login(request.body.username, request.body.password).then(resp => {
      response.json({loggedin: resp, username: request.body.username});
    });
  } else {
    response.json({message: "Please supply username and password", error: 1});
  }
});

app.use('/api', router);
app.listen(port);

console.log("Starting StormCloudHR Server on port %s, API Version %s", port, version);
