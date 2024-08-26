import MyClass from "/classes/my_class.js";

class Team extends MyClass {
  constructor({
    id,
    quoteId,
    jobId = null,
    memberCount = null,
    employeeIds = null,
    employees = null,
  }) {
    if (this.employeeIds && this.memberCount !== this.employeeIds.length) {
      throw new Error("Length of employeeIds must match memberCount.");
    }

    if (this.employees && this.memberCount !== this.employees.length) {
      throw new Error("Length of employees must match memberCount.");
    }

    super();
    this.id = id;
    this.quoteId = quoteId;
    this.jobId = jobId;
    this.memberCount = memberCount;
    this.employeeIds = employeeIds;
    this.employees = employees;
  }

  static fromJson({ docID, json }) {
    return new Team({
      id: docID,
      quoteId: json[Team.sQuoteId],
      jobId: json[Team.sJobId],
      memberCount: json[Team.sMemberCount],
      employeeIds: json[Team.sEmployeeIds],
      employees: json[Team.sEmployees],
    });
  }

  toJson() {
    return {
      [Team.sQuoteId]: this.quoteId,
      [Team.sJobId]: this.jobId,
      [Team.sMemberCount]: this.memberCount,
      [Team.sEmployeeIds]: this.employeeIds,
      [Team.sEmployees]: this.employees,
    };
  }

  toString() {
    return `Team{
        ${Team.sId}: ${this.id},
        ${Team.sQuoteId}: ${this.quoteId},
        ${Team.sJobId}: ${this.jobId},
        ${Team.sMemberCount}: ${this.memberCount},
        ${Team.sEmployeeIds}: ${this.employeeIds},
        ${Team.sEmployees}: ${this.employees},
        }`;
  }

  static sId = "id";
  static sQuoteId = "quoteId";
  static sJobId = "jobId";
  static sMemberCount = "memberCount";
  static sEmployeeIds = "employeeIds";
  static sEmployees = "employees";
}

export default Team;
