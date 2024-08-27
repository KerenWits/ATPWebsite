import { AppAuthProvider } from "/auth/provider/firebase_auth_provider.js";
import {MyAuthProvider, AuthParams} from "/auth/provider/auth_provider.js";

class AuthService extends MyAuthProvider {
  constructor(provider) {
    super();
    this.provider = provider;
  }

  static firebase() {
    return new AuthService(AppAuthProvider.instance);
  }

  async getCurrentUser() {
    return this.provider.getCurrentUser();
  }

  async initialize() {
    return this.provider.initialize();
  }

  async logIn(authParams) {
    if (!(authParams instanceof AuthParams)) {
      throw new Error("authParams must be an instance of AuthParams");
    }
    return this.provider.logIn(authParams);
  }

  async logOut() {
    return this.provider.logOut();
  }

  async register(authParams) {
    if (!(authParams instanceof AuthParams)) {
      throw new Error("authParams must be an instance of AuthParams");
    }
    return this.provider.register(authParams);
  }

  async resetPassword(authParams) {
    if (!(authParams instanceof AuthParams)) {
      throw new Error("authParams must be an instance of AuthParams");
    }
    return this.provider.resetPassword(authParams);
  }

  async verification() {
    return this.provider.verification();
  }
}

export default AuthService;