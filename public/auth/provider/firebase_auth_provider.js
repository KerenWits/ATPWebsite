import { auth } from "/firebase/firebase.js";
import { MyAuthProvider, AuthParams } from "/auth/provider/auth_provider.js";
import {
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import MyUser from "/classes/users/my_user.js";
import {
  isMapStringDynamic,
  isString,
} from "/utilities/type_checks/map_string_dynamic.js";
import UserDA from "/classes/users/userDA.js";

class AppAuthPramsLogin extends AuthParams {
  constructor(email, password) {
    super();
    this.email = email;
    this.password = password;
  }
}

class AppAuthPramsRegister extends AuthParams {
  constructor(registerUser) {
    super();
    this.registerUser = registerUser;
  }
}

class AppAuthParamsResetPassword extends AuthParams {
  constructor(toEmail) {
    super();
    this.toEmail = toEmail;
  }
}

class AppAuthProvider extends MyAuthProvider {
  static _instance = null;

  constructor() {
    super();
    if (AppAuthProvider._instance) {
      return AppAuthProvider._instance;
    }
    this.initAuthStateListener();
    AppAuthProvider._instance = this;
  }

  static get instance() {
    return AppAuthProvider._instance || new AppAuthProvider();
  }

  initAuthStateListener() {
    auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        let user = await UserDA.instance.getUser({
          id: firebaseUser.uid,
          getProfilePic: false,
        });
        localStorage.setItem("loggedInUser", JSON.stringify(user));
        console.log("User signed in:", user);
      } else {
        console.log("No user signed in");
      }
    });
  }

  async getCurrentUser() {
    let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    const firebaseUser = auth.currentUser;
    console.log("firebase user: ", firebaseUser);
    if (!firebaseUser) {
      console.log("there was no logged In user by firebase");
      // localStorage.removeItem("loggedInUser");
      return null;
    } else if (loggedInUser && firebaseUser.uid === loggedInUser.id) {
      console.log("current uid matched existing data: ", loggedInUser);
      localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
      return loggedInUser;
    }

    loggedInUser = await UserDA.instance.getUser({
      id: firebaseUser.uid,
      getProfilePic: false,
    });

    if (!loggedInUser) {
      localStorage.removeItem("loggedInUser");
      throw new Error("User not logged In exception");
    }

    console.log("current user: ", loggedInUser);
    localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
    return loggedInUser;
  }

  async initialize() {
    // we initialize firebase in the firebase.js file
    // try {
    //   await firebase.initializeApp(DefaultFirebaseOptions.currentPlatform);
    // } catch (e) {
    //   console.error("Error initializing Firebase:", e);
    // }
  }

  async logOut() {
    const user = auth.currentUser;
    if (user) {
      await signOut(auth);
      localStorage.removeItem("loggedInUser");
      console.log("User logged out");
    } else {
      throw new Error("No user is logged in");
    }
  }

  async logIn(authParams) {
    if (!(authParams instanceof AppAuthPramsLogin)) {
      throw new Error("Invalid authParams for logIn");
    }
    const email = authParams.email;
    const password = authParams.password;
    await signInWithEmailAndPassword(auth, email, password);
    console.log("finish sign in with email ", auth.currentUser.uid);
    return await this.getCurrentUser();
  }

  async register(authParams) {
    if (!(authParams instanceof AppAuthPramsRegister)) {
      throw new Error("Invalid authParams for register");
    }

    const params = authParams;
    const userData = params.registerUser;

    if (!isMapStringDynamic(userData)) {
      throw new Error("Invalid user data");
    }

    const email = userData[MyUser.sEmail];
    const password = userData[MyUser.sPassword];

    if (!isString(email) || !isString(password)) {
      throw new Error("Invalid email or password");
    }

    await createUserWithEmailAndPassword(auth, email, password);
    const user = auth.currentUser;

    if (user) {
      const userDA = UserDA.instance;
      await userDA.createUser({
        id: user.uid,
        userData: userData,
        // imgStoragePath: `${FirebaseStorageService.sImgUsers}/${user.uid}`,
        imgStoragePath: `${user.uid}`,
        uploadImage: false,
        rethrowError: true,
      });
      return await this.getCurrentUser();
      // console.log(state.loggedInUser.toString());
      // return state.loggedInUser;
    } else {
      throw new Error("Failed to register user");
    }
  }

  async resetPassword(authParams) {
    if (!(authParams instanceof AppAuthParamsResetPassword)) {
      throw new Error("Invalid authParams for resetPassword");
    }
    const toEmail = authParams.toEmail;
    await sendPasswordResetEmail(auth, toEmail);
  }

  async verification() {
    const user = auth.currentUser;
    if (user) {
      return sendEmailVerification(user);
    } else {
      throw new Error("User not found");
    }
  }
}

export {
  AppAuthPramsLogin,
  AppAuthPramsRegister,
  AppAuthParamsResetPassword,
  AppAuthProvider,
};
