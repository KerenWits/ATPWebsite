import MyClass from "/classes/my_class.js";

class MyUser extends MyClass {
  // Required fields
  constructor({
    id,
    FCMToken,
    firstName,
    lastName,
    dateCreated,
    userType,
    middleName = null,
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
    if (!email && !number) {
      throw new Error("Either email or number must be provided.");
    }

    super();
    this.id = id;
    this.FCMToken = FCMToken;
    this.firstName = firstName;
    this.middleName = middleName;
    this.lastName = lastName;
    this.dateCreated = dateCreated;
    this.userType = userType;
    this.email = email;
    this.isVerified = isVerified;
    this.countryISOCode = countryISOCode;
    this.countryCode = countryCode;
    this.number = number;
    this.sex = sex;
    this.address = address;
    this.displayName = displayName;
    this.profilePicUrl = profilePicUrl;
    this.profilePic = profilePic;
    this.status = status;
  }

  static fromJson({ docID, json }) {
    return new MyUser({
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

  toJson() {
    return {
      [MyUser.sId]: this.id,
      [MyUser.sFCMtoken]: this.FCMToken,
      [MyUser.sFirstName]: this.firstName,
      [MyUser.sMiddleName]: this.middleName,
      [MyUser.sLastName]: this.lastName,
      [MyUser.sDateCreated]: this.dateCreated.toISOString(),
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

  get phoneNumber() {
    if (!this.number || !this.countryCode || !this.countryISOCode) {
      return null;
    }
    return `${this.countryCode} ${this.number}`;
  }

  get fullName() {
    return `${this.firstName}${this.middleName ? " " + this.middleName : ""} ${
      this.lastName
    }`;
  }

  toString() {
    return `MyUser(id: ${this.id}, fullName: ${this.fullName})`;
  }

  equals(other) {
    if (!(other instanceof MyUser)) {
      return false;
    }
    return this.id === other.id;
  }

  get hashCode() {
    return this.id.hashCode(); // Assuming id has a hashCode method
  }

  static sId = "id";
  static sFCMtoken = "FCMtoken";
  static sFirstName = "firstName";
  static sMiddleName = "middleName";
  static sLastName = "lastName";
  static sDateCreated = "dateCreated";
  static sUserType = "userType";
  static sEmail = "email";
  static sPassword = "password";
  static sIsVerified = "isVerified";
  static sCountryISOCode = "countryISOCode";
  static sCountryCode = "countryCode";
  static sNumber = "number";
  static sSex = "sex";
  static sAddress = "address";
  static sDisplayName = "displayName";
  static sProfilePicUrl = "profilePicUrl";
  static sStatus = "status";

  static sStatusActive = "active";
  static sStatusInactive = "inactive";
}

export default MyUser;
