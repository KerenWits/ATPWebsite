// import MyUser from './my_user.ts'; // Adjust the path if necessary

// interface CustomerConstructorParams {
//   id: string;
//   FCMToken: string;
//   imageIDUrl: string;
//   imageID: string;
//   firstName: string;
//   middleName?: string | null;
//   lastName: string;
//   dateCreated: Date;
//   userType: string;
//   email?: string | null;
//   isVerified?: boolean | null;
//   countryISOCode?: string | null;
//   countryCode?: string | null;
//   number?: string | null;
//   sex?: string | null;
//   address?: string | null;
//   displayName?: string | null;
//   profilePicUrl?: string | null;
//   profilePic?: string | null;
//   selfRef?: string | null;
// }

// class Customer extends MyUser {
//   static sId = 'id';
//   static sFCMtoken = 'FCMtoken';
//   static sImageIDUrl = 'imageIDUrl';
//   static sFirstName = 'firstName';
//   static sMiddleName = 'middleName';
//   static sLastName = 'lastName';
//   static sDateCreated = 'dateCreated';
//   static sUserType = 'userType';
//   static sEmail = 'email';
//   static sPassword = 'password';
//   static sIsVerified = 'isVerified';
//   static sCountryISOCode = 'countryISOCode';
//   static sCountryCode = 'countryCode';
//   static sNumber = 'number';
//   static sSex = 'sex';
//   static sAddress = 'address';
//   static sDisplayName = 'displayName';
//   static sProfilePicUrl = 'profilePicUrl';

//   selfRef: string | null;

//   constructor({
//     id,
//     FCMToken,
//     imageIDUrl,
//     imageID,
//     firstName,
//     middleName = null,
//     lastName,
//     dateCreated,
//     userType,
//     email = null,
//     isVerified = null,
//     countryISOCode = null,
//     countryCode = null,
//     number = null,
//     sex = null,
//     address = null,
//     displayName = null,
//     profilePicUrl = null,
//     profilePic = null,
//     selfRef = null,
//   }: CustomerConstructorParams) {
//     super({
//       id,
//       FCMToken,
//       imageIDUrl,
//       imageID,
//       firstName,
//       middleName,
//       lastName,
//       dateCreated,
//       userType,
//       email,
//       isVerified,
//       countryISOCode,
//       countryCode,
//       number,
//       sex,
//       address,
//       displayName,
//       profilePicUrl,
//       profilePic,
//     });
//     this.selfRef = selfRef;
//   }

//   static fromJson({ docID, json }: { docID: string; json: any }): Customer {
//     return new Customer({
//       id: docID,
//       FCMToken: json[Customer.sFCMtoken],
//       imageIDUrl: json[Customer.sImageIDUrl],
//       imageID: json[Customer.sImageID],
//       firstName: json[Customer.sFirstName],
//       middleName: json[Customer.sMiddleName],
//       lastName: json[Customer.sLastName],
//       dateCreated: new Date(json[Customer.sDateCreated].seconds * 1000),
//       userType: json[Customer.sUserType],
//       email: json[Customer.sEmail],
//       isVerified: json[Customer.sIsVerified],
//       countryISOCode: json[Customer.sCountryISOCode],
//       countryCode: json[Customer.sCountryCode],
//       number: json[Customer.sNumber],
//       sex: json[Customer.sSex],
//       address: json[Customer.sAddress],
//       displayName: json[Customer.sDisplayName],
//       profilePicUrl: json[Customer.sProfilePicUrl],
//       profilePic: json[Customer.sProfilePic],
//       selfRef: json.selfRef,
//     });
//   }

//   toJson(): any {
//     return {
//       [Customer.sId]: this.id,
//       [Customer.sFCMtoken]: this.FCMToken,
//       [Customer.sImageIDUrl]: this.imageIDUrl,
//       [Customer.sFirstName]: this.firstName,
//       [Customer.sMiddleName]: this.middleName,
//       [Customer.sLastName]: this.lastName,
//       [Customer.sDateCreated]: this.dateCreated.toISOString(),
//       [Customer.sUserType]: this.userType,
//       [Customer.sEmail]: this.email,
//       [Customer.sIsVerified]: this.isVerified,
//       [Customer.sCountryISOCode]: this.countryISOCode,
//       [Customer.sCountryCode]: this.countryCode,
//       [Customer.sNumber]: this.number,
//       [Customer.sSex]: this.sex,
//       [Customer.sAddress]: this.address,
//       [Customer.sDisplayName]: this.displayName,
//       [Customer.sProfilePicUrl]: this.profilePicUrl,
//       selfRef: this.selfRef,
//     };
//   }

//   toString(): string {
//     return `Customer { 
//       ${Customer.sId}: ${this.id}, 
//       ${Customer.sFCMtoken}: ${this.FCMToken}, 
//       ${Customer.sImageIDUrl}: ${this.imageIDUrl}, 
//       ${Customer.sFirstName}: ${this.firstName}, 
//       ${Customer.sMiddleName}: ${this.middleName ?? 'N/A'}, 
//       ${Customer.sLastName}: ${this.lastName}, 
//       ${Customer.sDateCreated}: ${this.dateCreated}, 
//       ${Customer.sUserType}: ${this.userType}, 
//       ${Customer.sEmail}: ${this.email ?? 'N/A'}, 
//       ${Customer.sIsVerified}: ${this.isVerified ?? 'N/A'}, 
//       ${Customer.sCountryISOCode}: ${this.countryISOCode ?? 'N/A'}, 
//       ${Customer.sCountryCode}: ${this.countryCode ?? 'N/A'}, 
//       ${Customer.sNumber}: ${this.number ?? 'N/A'}, 
//       ${Customer.sSex}: ${this.sex ?? 'N/A'}, 
//       ${Customer.sAddress}: ${this.address ?? 'N/A'}, 
//       ${Customer.sDisplayName}: ${this.displayName ?? 'N/A'}, 
//       ${Customer.sProfilePicUrl}: ${this.profilePicUrl ?? 'N/A'}, 
//       selfRef: ${this.selfRef ?? 'N/A'}, 
//     }`;
//   }

//   displayString(): string {
//     return this.fullName;
//   }

//   equals(other: any): boolean {
//     if (!(other instanceof Customer)) {
//       return false;
//     }
//     return this.id === other.id;
//   }

//   get hashCode(): number {
//     return this.id.hashCode(); // Assuming id has a hashCode method
//   }
// }

// export default Customer;