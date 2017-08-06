var redis = require('redis');

class Model {
  constructor(redisClient) {
    this.redisClient = redisClient;
  }

  saveModel(key, model) {
    key = "hr:"+key;
    this.redisClient.hmset(key, model);
  }

  deleteModel(key) {

  }

  checkIfModelExists(key) {
    key = "hr:"+key;
    return new Promise((resolve, reject) => {
      this.redisClient.hgetall(key, function(err, reply){
        resolve(reply);
      });
    })
  }

  getKeyValue(key) {
    key = "hr:"+key;
    return new Promise((resolve, reject) => {
      this.redisClient.hgetall(key, function(err, reply) {
        resolve(reply);
      });
    });
  }

  findModel(key) {
    return new Promise((resolve, reject) => {
      this.checkIfModelExists(key).then(function(resp) {
        resolve(resp);
      })
    });
  }
}

module.exports = Model;
