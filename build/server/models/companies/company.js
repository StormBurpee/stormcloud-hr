var Model = require('../model');

class Company extends Model {
  constructor(redisClient) {
    super(redisClient);
    this.company = {
      name: "",
      owner: owner
    }
  }

  exportCompany() {
    return this.company;
  }

  saveCompany() {
    return new Promise((resolve, reject) => {
      let company = this;
      this.checkIfModelExists("company:"+this.company.name).then(function(resp){
        if(resp == null) {
          company.saveModel("company:"+this.company.name, company.company);
          resolve (1);
        } else {
          resolve (0);
        }
      });
    });
  }

  setCompanyValue(key, value) {
    this.company[key] = value;
  }

  updateCompanyValue(key, value) {

  }

  newCompany(name, owner) {
    this.company = {
      name: name,
      owner: owner
    };
    this.saveCompany();
  }

  findCompany(companyname) {
    return new Promise((resolve, reject) => {
      let company = this;
      this.findModel("company:"+companyname).then(function(response) {
        let e = response;
        if(e && e != 0) {
          resolve(e);
        } else {
          resolve({user: "not-found", error: 1});
        }
      });
    });
  }
}
