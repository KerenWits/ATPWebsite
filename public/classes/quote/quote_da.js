import FirestoreService from "/firebase/query.js";
import Quote from "/classes/quote/quote.js";
import { UserType } from "/global/enums.js";

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

  async getAllQuotesForUser({ user, rethrowError = false }) {
    try {
      let where = [];
      if (user.userType === UserType.CLIENT) {
        where = [{ field: Quote.sClientId, operator: "==", value: user.id }];
      }
      let querySnapshot = await this.quoteFs.getDocuments({
        where: where,
        rethrowError: rethrowError,
      });

      let allServices = JSON.parse(localStorage.getItem("allServices"));

      let allQuotes = new Map();
      let requestedQ = new Map();
      let quotedQ = new Map();
      let acceptedQ = new Map();
      let rejectedQ = new Map();
      let inProgressQ = new Map();
      let completedQ = new Map();
      let reviewedQ = new Map();

      querySnapshot.forEach((doc) => {
        let quote = Quote.fromJson({ docID: doc.id, json: doc.data() });
        if (allServices) {
          for (let i = 0; i < allServices.length; i++) {
            const service = allServices[i];
            if (quote.serviceId === service.id) {
              quote.service = service;
              break;
            }
          }
        }
        switch (quote.status) {
          case Quote.sStatusRequested:
            requestedQ.set(quote.id, quote);
            break;
          case Quote.sStatusQuoted:
            quotedQ.set(quote.id, quote);
            break;
          case Quote.sStatusAccepted:
            acceptedQ.set(quote.id, quote);
            break;
          case Quote.sStatusRejected:
            rejectedQ.set(quote.id, quote);
            break;
          case Quote.sStatusInProgress:
            inProgressQ.set(quote.id, quote);
            break;
          case Quote.sStatusCompleted:
            completedQ.set(quote.id, quote);
            break;
          case Quote.sStatusReviewed:
            reviewedQ.set(quote.id, quote);
            break;
        }
      });

      allQuotes.set(Quote.sStatusRequested, requestedQ);
      allQuotes.set(Quote.sStatusQuoted, quotedQ);
      allQuotes.set(Quote.sStatusAccepted, acceptedQ);
      allQuotes.set(Quote.sStatusRejected, rejectedQ);
      allQuotes.set(Quote.sStatusInProgress, inProgressQ);
      allQuotes.set(Quote.sStatusCompleted, completedQ);
      allQuotes.set(Quote.sStatusReviewed, reviewedQ);

      return allQuotes;
    } catch (e) {
      if (rethrowError) throw e;
      console.error("Error fetching quotes in QuoteDA:", e);
      return new Map();
    }
  }
}

export default QuoteDA;
