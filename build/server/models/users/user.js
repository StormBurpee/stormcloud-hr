var Model         = require('../model');
var passwordHash  = require('password-hash');

//Here a user is defined as someone who has registered to be with
//StormCloud HR
//A user is not an employee of a given company
//An employee of a company can be found in the employee model

class User extends Model {
  constructor(redisClient) {
    super(redisClient);
    this.email = "";
    this.username = "";
    this.password = "";
  }

  saveUser() {
    return new Promise((resolve, reject) => {
      let user = this;
      this.checkIfModelExists("user:"+this.username).then(function(resp){
        if(resp == null) {
          user.saveModel("user:"+user.username, {
            "username": user.username,
            "email":    user.email
          });
          user.saveModel("userpassword:"+user.username, {
            "password": user.password
          });
          resolve(1);
        } else {
          resolve(0);
        }
      });
    });
  }

  verifyPassword() {
    return new Promise((resolve, reject) => {
      let user = this;
      this.getKeyValue("userpassword:"+this.username).then(function(resp){
        console.log(resp);
        if(resp)
          resolve(passwordHash.verify(user.password, resp.password));
        else {
          resolve("failed");
        }
      });
    })
  }

  login(username, password) {
    return new Promise((resolve, reject) => {
      let user = this;
      this.username = username;
      this.password = password;
      this.checkIfModelExists("user:"+this.username).then(function(resp) {
        if(resp != null) {
          user.verifyPassword().then(resp => {
            if(resp == true) {
              resolve(1); // password correct
            } else {
              resolve(-1); // password incorrect;
            }
          });
        } else {
            resolve (0);
        }
      });
    });
  }

  deleteUser() {
    this.deleteModel("user:"+this.username);
    this.deleteModel("userpassword:"+this.username);
  }

  registerUser(email, username, password) {
    this.email = email;
    this.username = username;
    this.password = passwordHash.generate(password);
    return this.saveUser();
  }

  findUser(username) {
    return new Promise((resolve, reject) => {
      let thisUser = this;
      this.findModel("user:"+username).then(function(response){
        let user = response;
        if(user && user != 0) {
          thisUser.email = user.email;
          thisUser.username = user.username;
          resolve( user );
        } else {
          resolve({user: "not-found", error: 1});
        }
      });
    });
  }
}

module.exports = User;
