import FirestoreService from "/firebase/query.js";
import Quote from "/classes/quote/quote.js";
import { UserType } from "/global/enums.js";
import ClientDA from "/classes/users/client_da.js";
import { isMapStringDynamic } from "/utilities/type_checks/map_string_dynamic.js";
import UserDA from "/classes/users/userDA.js";

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
      let docID, data;

      if (quote instanceof Quote) {
        docID = quote.id;
        data = quote.toJson();
      } else if (isMapStringDynamic(quote) && quote[Quote.sId] !== null) {
        docID = quote[Quote.sId];
        data = quote;
        delete data[Quote.sId];
      } else {
        throw new Error("Invalid quote data");
      }

      if (returnNewQuote) {
        let updatedQuote = await this.quoteFs.getNewUpdatedDocument({
          docID: docID,
          data: data,
          rethrowError: rethrowError,
        });
        console.log("Quote updated in QuoteDA");
        return updatedQuote;
      } else {
        await this.quoteFs.updateDocument({
          docID: docID,
          data: data,
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

  async updateQuoteValues({
    quoteId,
    data,
    returnNewQuote = false,
    rethrowError = false,
  }) {
    try {
      if (!isMapStringDynamic(data) && quoteId) {
        throw new Error("Invalid quote data");
      }

      if (returnNewQuote) {
        let updatedQuote = await this.quoteFs.getNewUpdatedDocument({
          docID: quoteId,
          data: data,
          rethrowError: rethrowError,
        });
        // console.log("Quote updated in QuoteDA");
        return updatedQuote;
      } else {
        await this.quoteFs.updateDocument({
          docID: quoteId,
          data: data,
          rethrowError: rethrowError,
        });
        // console.log("Quote updated in QuoteDA");
        return true;
      }
    } catch (e) {
      // console.log("Error updating quote in QuoteDA:", e);
      return false;
    }
  }

  async getAllQuotesForUser({ user, rethrowError = false }) {
    try {
      let where = [];
      if (user.userType === UserType.CLIENT) {
        where = [{ field: Quote.sClientId, operator: "==", value: user.id }];
      } else if (user.userType === UserType.EMPLOYEE) {
        where = [
          { field: Quote.sTeamIds, operator: "array-contains", value: user.id },
        ];
      }

      let querySnapshot = await this.quoteFs.getDocuments({
        whereConditions: where,
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

      querySnapshot.forEach(async (doc) => {
        let data = doc.data();
        if (
          data[Quote.sStatus] === Quote.sStatusInProgress &&
          data[Quote.sEndDateTime] < Date.now()
        ) {
          doc = await this.updateQuoteValues({
            quoteId: doc.id,
            data: { [Quote.sStatus]: Quote.sStatusCompleted },
            returnNewQuote: true,
          });
          data = docSnapShot.data();
        }
        let quote = Quote.fromJson({ docID: doc.id, json: data });
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
      return null;
    }
  }

  async completeQuoteData({
    quote,
    getClient = false,
    getAssignedTeam = false,
    getJob = false,
    rethrowError,
  }) {
    console.log("Completing quote data in QuoteDA");
    try {
      if (!(quote instanceof Quote)) {
        throw new Error("Invalid quote data");
      }

      if (!quote.service) {
        console.log("Quote does not have service data");
        let allServices = JSON.parse(localStorage.getItem("allServices"));
        for (let i = 0; i < allServices.length; i++) {
          const service = allServices[i];
          if (quote.serviceId === service.id) {
            quote.service = service;
            break;
          }
        }
      }

      // Check if clientId exists and getClient is true
      if (quote.clientId && getClient && !quote.client) {
        console.log("Getting client for quote");
        let client = await ClientDA.instance.getClientByID({
          clientID: quote.clientId,
          rethrowError: rethrowError,
        });
        quote.client = client;
      }

      if (quote.teamIds && getAssignedTeam) {
        quote.team = [];
        for (const teamId of quote.teamIds) {
          let employee = await UserDA.instance.getUser({
            id: teamId,
            getProfilePic: false,
          });
          quote.team.push(employee);
        }
      }

      // if (quote.job && getJob) {
      //   let job = await JobDA.instance.getJobById({ jobId: quote.job.id });
      //   quote.job = job;
      // }

      return quote;
    } catch (e) {
      console.error("Error completing quote data:", e);
      if (rethrowError) throw e;
      return null;
    }
  }
}

export default QuoteDA;
