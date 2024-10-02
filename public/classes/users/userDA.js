import MyUser from "/classes/users/my_user.js";
import FirestoreService from "/firebase/query.js";
import {
  isMapStringDynamic,
  isString,
} from "/utilities/type_checks/map_string_dynamic.js";
import { UserType } from "/global/enums.js";
import Client from "/classes/users/client.js";
import Employee from "/classes/users/employee.js";
import ServiceDA from "/classes/service/service_da.js";
import QuoteDA from "/classes/quote/quote_da.js";

class UserDA {
  static _instance = null;

  static get instance() {
    return this._instance || new UserDA();
  }

  constructor() {
    if (UserDA._instance) {
      return UserDA._instance;
    }
    this.userFs = new FirestoreService("users");
    UserDA._instance = this;
  }

  async createUser({
    id,
    userData,
    imgStoragePath,
    uploadImage = false,
    rethrowError = false,
  }) {
    try {
      if (!isString(id) || !isMapStringDynamic(userData)) {
        if (rethrowError) throw new Error("Invalid user data");
        console.log("Invalid user data in UserDA createUser");
      }
      if (uploadImage && userData.AbstractUser.sProfilePicUrl) {
        throw new Error("Upload image not implemented yet in UserDA");
        // const storagePath = imgStoragePath;
        // const profilePicFile = userData[MyUser.sProfilePicUrl];
        // const profilePicBytes = await profilePicFile.arrayBuffer();
        // const profilePicDownloadURL =
        //   await FirebaseStorageService.instance.uploadImage({
        //     imageBytes: new Uint8Array(profilePicBytes),
        //     storagePath: `${storagePath}/profile_pic.png`,
        //     rethrowError: rethrowError,
        //   });
        // userData[MyUser.sProfilePicUrl] = profilePicDownloadURL;
      }
      await this.userFs.createDocument({ docID: id, data: userData });
      console.log("User created in UserDA");
      return true;
    } catch (e) {
      if (rethrowError) throw e;
      console.log("Error creating user in UserDA:", e);
      return false;
    }
  }

  async updateUser({ user, rethrowError = false }) {
    try {
      if (!user || !user.id) {
        if (rethrowError) throw new Error("Invalid user data");
        console.log("Invalid user data in UserDA updateUser");
      }
      console.log("Before User update in UserDA", user);
      const docSnap = await this.userFs.getNewUpdatedDocument({
        docID: user.id,
        data: user.toJson(),
        rethrowError: rethrowError,
      });
      let updateUser;
      const userType = user.userType;
      const docID = docSnap.id;
      const userData = docSnap.data();
      if (UserType.CLIENT === userType) {
        updateUser = Client.fromJson({ docID: docID, json: userData });
      } else {
        updateUser = Employee.fromJson({ docID: docID, json: userData });
      }
      console.log("After User update in UserDA", updateUser);
      return updateUser;
    } catch (e) {
      if (rethrowError) throw e;
      console.log("Error updating user in UserDA:", e);
      return false;
    }
  }

  async createUserAndGet({
    id,
    userData,
    imgStoragePath,
    rethrowError = false,
    getProfilePic = false,
  }) {
    try {
      if (!isString(id) || !isMapStringDynamic(userData)) {
        if (rethrowError) throw new Error("Invalid user data");
        console.log("Invalid user data in UserDA createUserAndGet");
      }
      const created = await this.createUser({
        id,
        userData,
        imgStoragePath,
        rethrowError,
      });
      const user = await this.getUser({
        id,
        rethrowError,
        getProfilePic,
        rethrowError,
      });

      if (!created || !user) {
        if (rethrowError)
          throw new Error("Error creating user and getting in UserDA");
        console.log("Error creating user and getting in UserDA");
        return false;
      }
    } catch (e) {
      if (rethrowError) throw e;
      console.log("Error creating user and getting in UserDA:", e);
    }
  }

  async getUser({ id, getProfilePic, rethrowError = false }) {
    if (!isString(id)) {
      if (rethrowError) throw new Error("Invalid user ID");
      console.log("Invalid user ID in UserDA getUser");
      return false;
    }

    try {
      const docSnap = await this.userFs.readDocument({ docID: id });
      if (!docSnap.exists()) {
        if (rethrowError) throw new Error("User not found");
        console.log("User not found in UserDA getUser");
        return false;
      }

      const docID = docSnap.id;
      const userData = docSnap.data();
      const userType = userData[MyUser.sUserType];

      if (getProfilePic && user.profilePicUrl) {
        throw new Error("Get profile pic not implemented yet in UserDA");
        // user.profilePic =
        //   await FirebaseStorageService.instance.downloadImageFromURL({
        //     downloadURL: user.profilePicUrl,
        //     rethrowError: rethrowError,
        //   });
      }

      let user;
      if (UserType.CLIENT === userType) {
        user = Client.fromJson({ docID: docID, json: userData });
      } else {
        user = Employee.fromJson({ docID: docID, json: userData });
      }

      return user;
    } catch (e) {
      if (rethrowError) throw e;
      console.log("Error getting user in UserDA:", e);
    }
  }

  unstringifyUser(user) {
    if (!user.userType || !Object.values(UserType).includes(user.userType)) {
      return null;
    }

    // user[MyUser.sDateCreated] = new Date(user[MyUser.sDateCreated]);
    // console.log("in unstringifyUser:", user);

    switch (user.userType) {
      case UserType.CLIENT:
        return Client.unStringify(user);
      case UserType.GUEST:
        console.log("Guest user type is not implemented yet.");
        return null;
      default:
        return Employee.unStringify(user);
    }
  }

  async getAllUserDataGlobally({ user }) {
    // console.log("in getAllUserData:", user.toString());
    let allServices = await ServiceDA.instance.getAllServices({});
    // console.log("in getAllUserData:", allServices.toString());
    localStorage.setItem("allServices", JSON.stringify(allServices));
    // let allQuotes = await QuoteDA.instance.getAllQuotesForUser({user: user});
    // localStorage.setItem("allQuotes", JSON.stringify(allQuotes));
    // console.log("allQuotes:", allQuotes);
    // if (user.userType === UserType.ADMIN) {
    // }
  }
}

export default UserDA;
