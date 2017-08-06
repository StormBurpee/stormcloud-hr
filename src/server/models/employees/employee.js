var Model = require('../model');

class Employee extends Model {
  constructor(redisClient) {
    super(redisClient);
    this.employee = {
      email: "",
      firstname: "",
      lastname: "",
      employeecode: "",
      parentcompany: "",
      employmenttype: "",
      startdate: "",
      jobtitle: "",
      probationlength: "",
      primarymanager: "",
      secondarymanager: "",
      location: "",
      teams: [],
      payrate: {
        type: "",
        rate: ""
      },
      manager: false
    }
  }

  exportEmployee() {
    return this.employee;
  }

  saveEmployee() {
    return new Promise((resolve, reject) => {
      let employee = this;
      this.checkIfModelExists(this.employee.parentcompany.name+":employee:"+this.employee.email).then(function(resp){
        if(resp == null) {
          employee.saveModel(employee.employee.parentcompany.name+":emploee:"+employee.employee.email, employee.employee);
          resolve (1);
        } else {
          resolve (0);
        }
      });
    });
  }

  setEmployeeValue(key, value) {
    this.employee[key] = value;
  }

  updateEmployeeValue(key, value) {

  }

  newEmployee(email, firstname, lastname, employeecode, parentcompany, employmenttype, startdate, jobtitle, probationlength, primarymanager, secondarymanager, location, teams, payrate, manager) {
    this.employee = {
      email: email,
      firstname: firstname,
      lastname: lastname,
      employeecode: employeecode,
      parentcompany: parentcompany,
      employmenttype: employmenttype,
      startdate: startdate,
      jobtitle: jobtitle,
      probationlength: probationlength,
      primarymanager: primarymanager,
      secondarymanager: secondarymanager,
      location: location,
      teams:  teams,
      payrate: payrate,
      manager: manager
    };
    this.saveEmployee();
  }

  findEmployee(email, companyname) {
    return new Promise((resolve, reject) => {
      let employee = this;
      this.findModel(companyname+":employee:"+email).then(function(response) {
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
