import MyUser from "/classes/users/my_user.js";
// import { db } from "/firebase/firebase.js";

class Client extends MyUser {
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
    // console.log("Creating a client from JSON:", docID, json);
    return new Client({
      id: docID,
      FCMToken: json[MyUser.sFCMtoken],
      firstName: json[MyUser.sFirstName],
      middleName: json[MyUser.sMiddleName] ?? null,
      lastName: json[MyUser.sLastName],
      dateCreated: new Date(json[MyUser.sDateCreated].seconds * 1000),
      userType: json[MyUser.sUserType],
      email: json[MyUser.sEmail],
      isVerified: json[MyUser.sIsVerified],
      countryISOCode: json[MyUser.sCountryISOCode] ?? null,
      countryCode: json[MyUser.sCountryCode] ?? null,
      number: json[MyUser.sNumber] ?? null,
      sex: json[MyUser.sSex] ?? null,
      address: json[MyUser.sAddress] ?? null,
      displayName: json[MyUser.sDisplayName] ?? null,
      profilePicUrl: json[MyUser.sProfilePicUrl] ?? null,
      status: json[MyUser.sStatus] ?? MyUser.sStatusActive,
    });
  }

  static unStringify(parsedClient) {
    if (typeof parsedClient === "string") {
      parsedClient = JSON.parse(parsedClient);
    }
    parsedClient[MyUser.sDateCreated] = new Date(parsedClient.dateCreated);
    let client = new Client(parsedClient);
    return client;
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
    return `Client { 
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
      ${MyUser.sStatus}: ${this.status}
    }`;
  }

  equals(other) {
    if (!(other instanceof Client)) {
      return false;
    }
    return this.id === other.id;
  }

  get hashCode() {
    return this.id.hashCode(); // Assuming id has a hashCode method
  }
}

export default Client;
