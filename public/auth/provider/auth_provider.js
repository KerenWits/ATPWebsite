class AuthParams {
  constructor() {}
}

class MyAuthProvider {
  async initialize() {}

  async getCurrentUser() {}

  async logIn(authParams) {
    if (!(authParams instanceof AuthParams)) {
      throw new Error("authParams must be an instance of AuthParams");
    }
  }

  async register(authParams) {
    if (!(authParams instanceof AuthParams)) {
      throw new Error("authParams must be an instance of AuthParams");
    }
  }

  async logOut() {}

  async verification() {}

  async resetPassword(authParams) {
    if (!(authParams instanceof AuthParams)) {
      throw new Error("authParams must be an instance of AuthParams");
    }
  }
}

export {AuthParams, MyAuthProvider};