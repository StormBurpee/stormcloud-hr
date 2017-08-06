var express               = require('express');
var bodyParser            = require('body-parser');
var redis                 = require('redis');
var bluebird              = require('bluebird');
var cookieParser          = require('cookie-parser');
var crypto                = require('crypto');
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
app.use(cookieParser());
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

/* -----------------
        USERS
   ----------------- */
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

router.get("/users/:username", function(request, response) {
  user.findUser(request.params.username).then(resp => {
    response.json({user: resp});
  });
});

router.post("/user/login", function(request, response) {
  if(request.body.username && request.body.password) {
    user.login(request.body.username, request.body.password).then(resp => {
      if(resp == 1) {
        let hash     = crypto.createHash("sha256");
        let userHash = hash.update(request.body.username + new Date()).digest('hex');
        let key = "hr:loggedin:"+userHash;
        //                                                      2 hours 'EX', 2*60*60
        redisClient.set(key, request.body.username);
        redisClient.expire(key, 2*60*60);
        response.cookie("user", userHash, {maxAge: 2*60*60});
        response.json({loggedin: true, username: request.body.username, hash: userHash}).send();
      } else {
        response.json({loggedin: false, error: 1, errortype: resp});
      }
    });
  } else {
    response.json({message: "Please supply username and password", error: 1});
  }
});

router.get("/user/loggedin", function(request, response) {
  if(request.cookies.user) {
    redisClient.getAsync("hr:loggedin:"+request.cookies.user).then(function(resp){
      if(resp != null)
        response.json({loggedin: true, username: resp});
      else
        response.json({loggedin: false});
    });
  } else {
    response.json({loggedin: false});
  }
});

/* -----------------
       Companies
   ----------------- */

router.get("/companies/all", function(request, response) {

});

router.post("/companies", function(request, response) {
  if(request.body.name) {

  } else {

  }
});

/* -----------------
       Employees
  ----------------- */

router.get("/companies/:company/employees", function(request, response){

});

app.use('/api', router);
app.listen(port);

console.log("Starting StormCloudHR Server on port %s, API Version %s", port, version);
