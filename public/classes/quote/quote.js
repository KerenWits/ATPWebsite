import MyClass from "/classes/my_class.js";
import { Timestamp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

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
  }

  static unStringify(strQuote) {
    let quote = new Quote(strQuote);
    quote.startDateTime = new Date(quote.startDateTime);
    quote.endDateTime = new Date(quote.endDateTime);
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
      startDateTime:
        json[Quote.sStartDateTime] instanceof Timestamp
          ? json[Quote.sStartDateTime].toDate()
          : null,
      endDateTime:
        json[Quote.sEndDateTime] instanceof Timestamp
          ? json[Quote.sEndDateTime].toDate()
          : null,
      comment: json[Quote.sComment],
      raAnswers: json[Quote.sRaAnswers],
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

  static sStatusRequested = "requested";
  static sStatusQuoted = "quoted";
  static sStatusAccepted = "accepted";
  static sStatusRejected = "rejected";
  static sStatusInProgress = "in_progress";
  static sStatusCompleted = "completed";
  static sStatusReviewed = "reviewed";
}

export default Quote;
