import MyClass from "/classes/my_class.js";

class Quote extends MyClass {
  constructor({
    id,
    clientId,
    serviceId,
    status = Quote.sStatusRequested,
    data = null,
    amount = null,
    dateTime,
    comment = null,
    raAnswers,
  }) {
    super();
    this.id = id;
    this.clientId = clientId;
    this.serviceId = serviceId;
    this.status = status;
    this.data = data;
    this.amount = amount;
    this.dateTime = dateTime;
    this.comment = comment;
    this.raAnswers = raAnswers;
  }

  static fromJson({ docID, json }) {
    return new Quote({
      id: docID,
      clientId: json[Quote.sClientId],
      serviceId: json[Quote.sServiceId],
      status: json[Quote.sStatus],
      data: json[Quote.sData],
      amount: json[Quote.sAmount],
      dateTime: json[Quote.sDateTime],
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
      [Quote.sDateTime]: this.dateTime,
      [Quote.sComment]: this.comment,
      [Quote.sRaAnswers]: this.raAnswers,
    };
  }

  toString() {
    return `Quote{
        ${Quote.sId}: ${this.id},
        ${Quote.sClientId}: ${this.clientId},
        ${Quote.sServiceId}: ${this.serviceId},
        ${Quote.sStatus}: ${this.status},
        ${Quote.sData}: ${this.data},
        ${Quote.sAmount}: ${this.amount},
        ${Quote.sDateTime}: ${this.dateTime},
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
  static sDateTime = "dateTime";
  static sComment = "comment";
  static sRaAnswers = "raAnswers";

  static sStatusRequested = "requested";
  static sStatusAccepted = "accepted";
  static sStatusRejected = "rejected";
  static sStatusCompleted = "completed";
  static sStatusInProgress = "in_progress";
}

export default Quote;
