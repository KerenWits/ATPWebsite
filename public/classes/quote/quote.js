import MyClass from "/classes/my_class.js";
// import { Timestamp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
import Job from "/classes/job/job.js";
import Service from "/classes/service/service.js";

class Quote extends MyClass {
  constructor({
    id,
    clientId,
    client = null,
    serviceId,
    service = null,
    status = Quote.sStatusRequested,
    data = null,
    amount = null,
    startDateTime,
    endDateTime,
    comment = null,
    raAnswers,
    job = null,
    teamIds = [],
    team = null,
    reviewRating = null,
    reviewComments = null,
  }) {
    super();
    this.id = id;
    this.clientId = clientId;
    this.client = client;
    this.serviceId = serviceId;
    this.service = service;
    this.status = status;
    this.data = data;
    this.amount = amount;
    this.startDateTime = startDateTime;
    this.endDateTime = endDateTime;
    this.comment = comment;
    this.raAnswers = raAnswers;
    this.job = job;
    this.teamIds = teamIds;
    this.team = team;
    this.reviewRating = reviewRating;
    this.reviewComments = reviewComments;
  }

  // static unStringify(strQuote) {
  //   let quote = new Quote(strQuote);
  //   console.log("Unstringifying quote before other classes", quote);
  //   quote.startDateTime = new Date(strQuote.startDateTime);
  //   quote.endDateTime = new Date(strQuote.endDateTime);
  //   console.log("Unstringifying quote", strQuote.service);
  //   quote.service = Service.unStringify(strQuote.service);
  //   return quote;
  // }

  static unStringify(strQuote) {
    // Parse the stringified JSON object back into a JavaScript object
    const parsedQuote = JSON.parse(strQuote);

    // Log the parsed object to verify the data
    // console.log("Parsed data", parsedQuote);

    // Create a new instance of Quote using the parsed object
    let quote = new Quote(parsedQuote);

    // console.log("new quote with parsed", parsedQuote);

    // Convert the stringified date back into a Date object
    quote.startDateTime = new Date(parsedQuote.startDateTime);
    quote.endDateTime = new Date(parsedQuote.endDateTime);

    // Handle the nested service object if it exists
    if (parsedQuote.service) {
      quote.service = Service.unStringify(JSON.stringify(parsedQuote.service));
    }

    // Handle the nested client object if it exists
    if (parsedQuote.client) {
      quote.client = Client.unStringify(JSON.stringify(parsedQuote.client));
    }

    return quote;
  }

  static fromJson({ docID, json }) {
    return new Quote({
      id: docID,
      clientId: json[Quote.sClientId],
      serviceId: json[Quote.sServiceId],
      status: json[Quote.sStatus],
      data: json[Quote.sData],
      amount: json[Quote.sAmount],
      // startDateTime:
      //   json[Quote.sStartDateTime] instanceof Timestamp
      //     ? json[Quote.sStartDateTime].toDate()
      //     : null,
      // endDateTime:
      //   json[Quote.sEndDateTime] instanceof Timestamp
      //     ? json[Quote.sEndDateTime].toDate()
      //     : null,
      startDateTime: new Date(json[Quote.sStartDateTime].seconds * 1000),
      endDateTime: new Date(json[Quote.sEndDateTime].seconds * 1000),
      comment: json[Quote.sComment],
      raAnswers: json[Quote.sRaAnswers],
      job: json[Quote.sJob] != null ? Job.fromJson(json[Quote.sJob]) : null,
      teamIds: json[Quote.sTeamIds] ?? [],
      reviewRating: json[Quote.sReviewRating],
      reviewComments: json[Quote.sReviewComments],
    });
  }

  toJson() {
    return {
      [Quote.sClientId]: this.clientId,
      [Quote.sServiceId]: this.serviceId,
      [Quote.sStatus]: this.status,
      [Quote.sData]: this.data,
      [Quote.sAmount]: this.amount,
      [Quote.sStartDateTime]: this.startDateTime,
      [Quote.sEndDateTime]: this.endDateTime,
      [Quote.sComment]: this.comment,
      [Quote.sRaAnswers]: this.raAnswers,
      [Quote.sJob]: this.job ? this.job.toJson() : null,
      [Quote.sTeamIds]: this.teamIds,
      [Quote.sReviewRating]: this.reviewRating,
      [Quote.sReviewComments]: this.reviewComments,
    };
  }

  toString() {
    return `Quote{
        ${Quote.sId}: ${this.id},
        ${Quote.sClientId}: ${
      this.client ? this.client.toString() : this.clientId
    },
        ${Quote.sServiceId}: ${
      this.service ? this.service.toString() : this.serviceId
    },
        ${Quote.sStatus}: ${this.status},
        ${Quote.sData}: ${this.data},
        ${Quote.sAmount}: ${this.amount},
        ${Quote.sStartDateTime}: ${this.startDateTime},
        ${Quote.sEndDateTime}: ${this.endDateTime},
        ${Quote.sComment}: ${this.comment},
        ${Quote.sRaAnswers}: ${this.raAnswers},
        ${Quote.sJob}: ${this.job ? this.job.toString() : this.job},
        ${Quote.sTeamIds}: ${this.teamIds},
        ${Quote.sReviewRating}: ${this.reviewRating},
        ${Quote.sReviewComments}: ${this.reviewComments},
        }`;
  }

  static sId = "id";
  static sClientId = "clientId";
  static sServiceId = "serviceId";
  static sStatus = "status";
  static sData = "data";
  static sAmount = "amount";
  static sStartDateTime = "startDateTime";
  static sEndDateTime = "endDateTime";
  static sComment = "comment";
  static sRaAnswers = "raAnswers";
  static sJob = "job";
  static sTeamIds = "teamIds";
  static sReviewRating = "reviewRating";
  static sReviewComments = "reviewComments";

  static sStatusRequested = "requested";
  static sStatusQuoted = "quoted";
  static sStatusAccepted = "accepted";
  static sStatusRejected = "rejected";
  static sStatusInProgress = "in_progress";
  static sStatusCompleted = "completed";
  static sStatusReviewed = "reviewed";
}

export default Quote;
