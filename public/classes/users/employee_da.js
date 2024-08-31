import FirestoreService from "/firebase/query.js";
import Employee from "/classes/users/employee.js";
import MyUser from "/classes/users/my_user.js";
import { UserType } from "/global/enums.js";

class EmployeeDA {
  static _instance = null;

  static get instance() {
    return this._instance || new EmployeeDA();
  }

  constructor() {
    if (EmployeeDA._instance) {
      return EmployeeDA._instance;
    }
    this.employeeFs = new FirestoreService("users");
    EmployeeDA._instance = this;
  }

  async getAllEmployees({ rethrowError = false }) {
    let where = [
      { field: MyUser.sUserType, operator: "==", value: UserType.EMPLOYEE },
    ];
    let querySnapshot = await this.employeeFs.getDocuments({
        whereConditions: where,
      rethrowError: rethrowError,
    });

    let employees = [];
    querySnapshot.forEach((doc) => {
      let employee = Employee.fromJson({ docID: doc.id, json: doc.data() });
      employees.push(employee);
    });
    return employees;
  }
}

export default EmployeeDA;
