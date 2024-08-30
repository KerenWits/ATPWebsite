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

  async getAllEmployees() {
    let where = [MyUser.sUserType, "==", UserType.EMPLOYEE];
    let querySnapshot = await this.quoteFs.getDocuments({
      where: where,
      rethrowError: rethrowError,
    });
  }
}
