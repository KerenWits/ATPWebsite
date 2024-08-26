import MyClass from "/classes/my_class.js";

class Job extends MyClass {
  constructor({ id, location = null, status = Job.sStatusPending }) {
    super();
    this.id = id;
    this.location = location;
    this.status = status;
  }

  static fromJson({ docID, json }) {
    return new Job({
      id: docID,
      location: json[Job.sLocation],
      status: json[Job.sStatus],
    });
  }

  toJson() {
    return {
      [Job.sLocation]: this.location,
      [Job.sStatus]: this.status,
    };
  }

  toString() {
    return `Job{
        ${Job.sId}: ${this.id},
        ${Job.sLocation}: ${this.location},
        ${Job.sStatus}: ${this.status},
        }`;
  }

  static sId = "id";
  static sLocation = "location";
  static sStatus = "status";

  static sStatusPending = "Pending";
  static sStatusAssigned = "Assigned";
  static sStatusCompleted = "Completed";
}

export default Job;
