import FirestoreService from "/firebase/query.js";
import Client from "/classes/users/client.js";

class ClientDA {
  static _instance = null;

  static get instance() {
    return this._instance || new ClientDA();
  }

  constructor() {
    if (ClientDA._instance) {
      return ClientDA._instance;
    }
    this.clientFs = new FirestoreService("users");
    ClientDA._instance = this;
  }

  async getClientByID({ clientID, rethrowError = false }) {
    try {
      let doc = await this.clientFs.readDocument({
        docID: clientID,
        rethrowError: rethrowError,
      });
      let client = Client.fromJson({ docID: doc.id, json: doc.data() });
      console.log("Client retrieved in ClientDA");
      return client;
    } catch (e) {
      if (rethrowError) throw e;
      console.log("Error getting client in ClientDA:", e);
      return null;
    }
  }
}

export default ClientDA;
