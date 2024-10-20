import FirestoreService from "/firebase/query.js";
import Client from "/classes/users/client.js";
import MyUser from "/classes/users/my_user.js";
import { UserType } from "/global/enums.js";

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

  async getAllClients({ rethrowError = false }) {
    try {
      let where = [
        { field: MyUser.sUserType, operator: "==", value: UserType.CLIENT },
      ];
      let orderBy = [
        { field: "firstName", direction: "asc" },
        { field: "lastName", direction: "asc" },
      ];
      // console.log("Executing query with conditions:", where, orderBy);
      let querySnapshot = await this.clientFs.getDocuments({
        whereConditions: where,
        orderByFields: orderBy,
        rethrowError: rethrowError,
      });

      let clients = [];
      querySnapshot.forEach((doc) => {
        let client = Client.fromJson({ docID: doc.id, json: doc.data() });
        clients.push(client);
      });
      // console.log("Query executed successfully, clients:", clients);
      return clients;
    } catch (error) {
      console.error("Error fetching clients:", error);
      if (rethrowError) {
        throw error;
      }
      return [];
    }
  }
}

export default ClientDA;
