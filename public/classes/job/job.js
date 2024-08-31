import MyClass from "/classes/my_class.js";

class Job extends MyClass {
  constructor({ location = null, status = Job.sStatusPending }) {
    super();
    this.location = location;
    this.status = status;
  }

  static fromJson(json) {
    return new Job({
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
        ${Job.sLocation}: ${this.location},
        ${Job.sStatus}: ${this.status},
        }`;
  }

  static sLocation = "location";
  static sStatus = "status";

  static sStatusPending = "Pending";
  static sStatusAssigned = "Assigned";
  static sStatusCompleted = "Completed";
}

export default Job;
