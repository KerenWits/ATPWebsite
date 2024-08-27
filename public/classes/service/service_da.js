import Question from "/classes/service/question.js";
import Service from "/classes/service/service.js";
import FirestoreService from "/firebase/query.js";

class ServiceDA {
  static _instance = null;

  static get instance() {
    return this._instance || new ServiceDA();
  }

  constructor() {
    if (ServiceDA._instance) {
      return ServiceDA._instance;
    }
    this.serviceFs = new FirestoreService("services");
    ServiceDA._instance = this;
  }

  async createService({ service, rethrowError = false }) {
    try {
      let serviceJson = service.toJson();
      let createdService = await this.serviceFs.getCreatedDocument({
        data: serviceJson,
        rethrowError: rethrowError,
      });
      console.log("Service created in ServiceDA:", createdService.toString());
      return createdService;
    } catch (e) {
      if (rethrowError) throw e;
      console.log("Error creating service in ServiceDA:", e);
      return false;
    }
  }

  async getServiceByID({ serviceID, rethrowError = false }) {
    try {
      let docSnap = await this.serviceFs.readDocument({ docID: serviceID });
      let data = docSnap.data();
      let service = Service.fromJson({ docID: docSnap.id, json: data });
      return service;
    } catch (e) {
      if (rethrowError) throw e;
      console.log("Error creating service in ServiceDA:", e);
      return false;
    }
  }

  async addAQuestionWithID({ serviceID, question, rethrowError = false }) {
    try {
      if (!(question instanceof Question)) {
        throw new Error("Invalid question");
      }
      let service = await this.getServiceByID({ serviceID: serviceID });
      console.log(
        "Service:",
        service.toString(),
        "Question:",
        question.toString()
      );
      if (service) {
        service.riskAnalysis.push(question);
        service.status = Service.sStatusActive;
        let updatedService = await this.updateService({ service: service });
        return updatedService;
      } else {
        throw new Error("Service not found in ServiceDA");
      }
    } catch (e) {
      //   console.log("I caught the error and then rethrow", e);
      if (rethrowError) throw e;
      console.log("Error adding a question in ServiceDA:", e);
      return false;
    }
  }

  async updateService({ service, rethrowError = false }) {
    try {
      let serviceJson = service.toJson();
      let updatedService = await this.serviceFs.getNewUpdatedDocument({
        docID: service.id,
        data: serviceJson,
        rethrowError: rethrowError,
      });
      //   console.log("Service updated in ServiceDA:", updatedService.toString());
      return updatedService;
    } catch (e) {
      if (rethrowError) throw e;
      console.log("Error updating service in ServiceDA:", e);
      return false;
    }
  }

  async getAllServices({ rethrowError = false }) {
    try {
      let querySnap = await this.serviceFs.getDocuments({});
      let services = [];
      querySnap.forEach((docSnap) => {
        let docID = docSnap.id;
        let data = docSnap.data();
        let service = Service.fromJson({ docID: docID, json: data });
        services.push(service);
      });
      return services;
    } catch (e) {
      if (rethrowError) throw e;
      console.log("Error creating service in ServiceDA:", e);
      return false;
    }
  }
}

export default ServiceDA;
