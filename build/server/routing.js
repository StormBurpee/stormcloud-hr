class StormCloudHRRouting {
  constructor(router, redisClient) {
    this.router = router;
    this.redisClient = redisClient;
  }

  initializeRouting() {
    let routing = this;
    this.router.get('/', function(request, response) {
      routing.redisClient.hgetallAsync("StormCloudHR").then(function(resp) {
        response.json({message: "StormCloud - StormCloudHR API", version: resp.version});
      });
    });

    this.router.get('/users/all', function(request, response) {

    });

    this.router.post("/users", function(request, response) {
      if(request.body.email && request.body.username && request.body.password){
        user.registerUser(request.body.email, request.body.username, request.body.password).then(resp => {
          response.json({message: resp});
        });
      }
      else {
        response.json({message: "Please supply username, email and password.", error: 1});
      }
    });

    this.router.get("/user/:username", function(request, response) {
      user.findUser(request.params.username).then(resp => {
        response.json({user: resp});
      });
    });

    this.router.post("/user/login", function(request, response) {
      if(request.body.username && request.body.password) {
        user.login(request.body.username, request.body.password).then(resp => {
          response.json({loggedin: resp, username: request.body.username});
        });
      } else {
        response.json({message: "Please supply username and password", error: 1});
      }
    });
  }
}

module.exports = StormCloudHRRouting;
