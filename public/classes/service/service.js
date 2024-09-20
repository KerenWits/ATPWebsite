import MyClass from "/classes/my_class.js";
import Question from "./question.js";

class Service extends MyClass {
  constructor({
    id,
    name,
    description,
    status = Service.sStatusActive,
    riskAnalysis = [],
  }) {
    super();
    this.id = id;
    this.name = name;
    this.description = description;
    this.status = status;
    this.riskAnalysis = riskAnalysis;
  }

  static fromJson({ docID, json }) {
    return new Service({
      id: docID,
      name: json[Service.sName],
      description: json[Service.sDescription],
      status: json[Service.sStatus],
      riskAnalysis: json[Service.sRiskAnalysis].map((q) =>
        Question.fromJson({ json: q })
      ),
    });
  }

  static unStringify(strService) {
    const parsedService = JSON.parse(strService);
    let service = new Service(parsedService);

    if (
      parsedService.riskAnalysis &&
      Array.isArray(parsedService.riskAnalysis)
    ) {
      service.riskAnalysis = parsedService.riskAnalysis.map((q) =>
        Question.unStringify(JSON.stringify(q))
      );
    } else {
      service.riskAnalysis = [];
    }

    return service;
  }

  static fromJsonArray(jsonArray) {
    let service = new Service(jsonArray);
    service.riskAnalysis = jsonArray.riskAnalysis.map((q) =>
      Question.fromJson({ json: q })
    );
    return service;
  }

  toJson() {
    return {
      [Service.sName]: this.name,
      [Service.sDescription]: this.description,
      [Service.sStatus]: this.status,
      [Service.sRiskAnalysis]: this.riskAnalysis.map((q) => q.toJson()),
    };
  }

  toString() {
    return `Service{
      ${Service.sId}: ${this.id},
      ${Service.sName}: ${this.name},
      ${Service.sDescription}: ${this.description},
      ${Service.sStatus}: ${this.status},
      ${Service.sRiskAnalysis}: ${this.riskAnalysis
      .map((q) => q.toString())
      .join(", ")},
      }`;
  }

  static sId = "id";
  static sName = "name";
  static sDescription = "description";
  static sStatus = "status";
  static sRiskAnalysis = "riskAnalysis";

  static sStatusActive = "active";
  static sStatusInComplete = "In-Complete";
  static sStatusInactive = "inactive";
}

export default Service;
