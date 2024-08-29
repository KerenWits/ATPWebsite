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

  async updateQuote({ quote, returnNewQuote = false, rethrowError = false }) {
    try {
      if (!quote instanceof Quote) {
        throw new Error("Invalid quote data");
      }
      if (returnNewQuote) {
        let updatedQuote = await this.quoteFs.getNewUpdatedDocument({
          docID: quote.id,
          data: quote.toJson(),
        });
        console.log("Quote updated in QuoteDA");
        return updatedQuote;
      } else {
        await this.quoteFs.updateDocument({
          docID: quote.id,
          data: quote.toJson(),
          rethrowError: rethrowError,
        });
        console.log("Quote updated in QuoteDA");
        return true;
      }
    } catch (e) {
      console.log("Error updating quote in QuoteDA:", e);
      return false;
    }
  }

  async getAllQuotesAdmin({ rethrowError = false }) {
    try {
      let querySnapshot = await this.quoteFs.getDocuments({
        rethrowError: rethrowError,
      });

      let allServices = JSON.parse(localStorage.getItem("allServices"));
      // console.log("All services fetched in QuoteDA", allServices);

      let allQuotes = [];
      let requestedQ = [];
      let quotedQ = [];
      let acceptedQ = [];
      let rejectedQ = [];
      let inProgressQ = [];
      let completedQ = [];
      let reviewedQ = [];

      querySnapshot.forEach((doc) => {
        let quote = Quote.fromJson({ docID: doc.id, json: doc.data() });
        if (allServices) {
          for (let i = 0; i < allServices.length; i++) {
            const service = allServices[i];
            if (quote.serviceId === service.id) {
              // console.log("Service found in QuoteDA", service);
              quote.service = service;
              break;
            }
          }
        }
        switch (quote.status) {
          case Quote.sStatusRequested:
            requestedQ.push(quote);
            break;
          case Quote.sStatusQuoted:
            quotedQ.push(quote);
            break;
          case Quote.sStatusAccepted:
            acceptedQ.push(quote);
            break;
          case Quote.sStatusRejected:
            rejectedQ.push(quote);
            break;
          case Quote.sStatusInProgress:
            inProgressQ.push(quote);
            break;
          case Quote.sStatusCompleted:
            completedQ.push(quote);
            break;
          case Quote.sStatusReviewed:
            reviewedQ.push(quote);
            break;
        }
      });
      allQuotes.push(requestedQ);
      allQuotes.push(quotedQ);
      allQuotes.push(acceptedQ);
      allQuotes.push(rejectedQ);
      allQuotes.push(inProgressQ);
      allQuotes.push(completedQ);
      allQuotes.push(reviewedQ);
      // console.log("All quotes fetched in QuoteDA");
      return allQuotes;
    } catch (e) {
      if (rethrowError) throw e;
      console.error("Error fetching quotes in QuoteDA:", e);
      return [];
    }
  }
}

export default QuoteDA;
