import MyUser from "/classes/users/my_user.js";
import { UserType } from "/global/enums.js";

class Employee extends MyUser {
  constructor({
    id,
    FCMToken,
    firstName,
    middleName = null,
    lastName,
    dateCreated,
    userType,
    email = null,
    isVerified = null,
    countryISOCode = null,
    countryCode = null,
    number = null,
    sex = null,
    address = null,
    displayName = null,
    profilePicUrl = null,
    profilePic = null,
    status = MyUser.sStatusActive,
  }) {
    super({
      id,
      FCMToken,
      firstName,
      middleName,
      lastName,
      dateCreated,
      userType,
      email,
      isVerified,
      countryISOCode,
      countryCode,
      number,
      sex,
      address,
      displayName,
      profilePicUrl,
      profilePic,
      status,
    });
  }

  static fromJson({ docID, json }) {
    return new Employee({
      id: docID,
      FCMToken: json[MyUser.sFCMtoken],
      firstName: json[MyUser.sFirstName],
      middleName: json[MyUser.sMiddleName],
      lastName: json[MyUser.sLastName],
      dateCreated: new Date(json[MyUser.sDateCreated].seconds * 1000),
      userType: json[MyUser.sUserType],
      email: json[MyUser.sEmail],
      isVerified: json[MyUser.sIsVerified],
      countryISOCode: json[MyUser.sCountryISOCode],
      countryCode: json[MyUser.sCountryCode],
      number: json[MyUser.sNumber],
      sex: json[MyUser.sSex],
      address: json[MyUser.sAddress],
      displayName: json[MyUser.sDisplayName],
      profilePicUrl: json[MyUser.sProfilePicUrl],
      status: json[MyUser.sStatus],
    });
  }

  static unStringify(parsedEmployee) {
    if (typeof parsedEmployee === UserType.EMPLOYEE) {
      parsedEmployee = JSON.parse(parsedClient);
    }
    parsedEmployee[MyUser.sDateCreated] = new Date(parsedEmployee.dateCreated);
    let employee = new Employee(parsedEmployee);
    return employee;
  }

  toJson() {
    return {
      [MyUser.sId]: this.id,
      [MyUser.sFCMtoken]: this.FCMToken,
      [MyUser.sFirstName]: this.firstName,
      [MyUser.sMiddleName]: this.middleName,
      [MyUser.sLastName]: this.lastName,
      [MyUser.sDateCreated]: this.dateCreated,
      [MyUser.sUserType]: this.userType,
      [MyUser.sEmail]: this.email,
      [MyUser.sIsVerified]: this.isVerified,
      [MyUser.sCountryISOCode]: this.countryISOCode,
      [MyUser.sCountryCode]: this.countryCode,
      [MyUser.sNumber]: this.number,
      [MyUser.sSex]: this.sex,
      [MyUser.sAddress]: this.address,
      [MyUser.sDisplayName]: this.displayName,
      [MyUser.sProfilePicUrl]: this.profilePicUrl,
      [MyUser.sStatus]: this.status,
    };
  }

  toString() {
    return `Employee { 
      ${MyUser.sId}: ${this.id}, 
      ${MyUser.sFCMtoken}: ${this.FCMToken}, 
      ${MyUser.sFirstName}: ${this.firstName}, 
      ${MyUser.sMiddleName}: ${this.middleName ?? "N/A"}, 
      ${MyUser.sLastName}: ${this.lastName}, 
      ${MyUser.sDateCreated}: ${this.dateCreated}, 
      ${MyUser.sUserType}: ${this.userType}, 
      ${MyUser.sEmail}: ${this.email ?? "N/A"}, 
      ${MyUser.sIsVerified}: ${this.isVerified ?? "N/A"}, 
      ${MyUser.sCountryISOCode}: ${this.countryISOCode ?? "N/A"}, 
      ${MyUser.sCountryCode}: ${this.countryCode ?? "N/A"}, 
      ${MyUser.sNumber}: ${this.number ?? "N/A"}, 
      ${MyUser.sSex}: ${this.sex ?? "N/A"}, 
      ${MyUser.sAddress}: ${this.address ?? "N/A"}, 
      ${MyUser.sDisplayName}: ${this.displayName ?? "N/A"}, 
      ${MyUser.sProfilePicUrl}: ${this.profilePicUrl ?? "N/A"}, 
      ${MyUser.sStatus}: ${this.status},
    }`;
  }

  displayString() {
    return this.fullName;
  }

  equals(other) {
    if (!(other instanceof Employee)) {
      return false;
    }
    return this.id === other.id;
  }

  get hashCode() {
    return this.id.hashCode(); // Assuming id has a hashCode method
  }
}

export default Employee;
