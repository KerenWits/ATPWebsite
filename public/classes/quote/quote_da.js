import MyUser from "/classes/users/my_user.js";
import FirestoreService from "/firebase/query.js";
import Quote from "/classes/quote/quote.js";
import {
  isMapStringDynamic,
  isString,
} from "/utilities/type_checks/map_string_dynamic.js";
import { UserType } from "/global/enums.js";
import Client from "/classes/users/client.js";
import Employee from "/classes/users/employee.js";
import ServiceDA from "/classes/service/service_da.js";

class QuoteDA {
  static _instance = null;

  static get instance() {
    return this._instance || new QuoteDA();
  }

  constructor() {
    if (QuoteDA._instance) {
      return QuoteDA._instance;
    }
    this.quoteFs = new FirestoreService("quotes");
    QuoteDA._instance = this;
  }

  async createQuote({ quote }) {
    try {
      if (!quote instanceof Quote) {
        throw new Error("Invalid quote data");
      }
      let createdQuote = await this.quoteFs.getCreatedDocument({
        data: quote.toJson(),
      });
      console.log("Quote created in QuoteDA");
      return createdQuote;
    } catch (e) {
      console.log("Error creating quote in QuoteDA:", e);
      return false;
    }
  }
}

export default QuoteDA;
