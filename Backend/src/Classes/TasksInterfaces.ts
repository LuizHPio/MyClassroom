const validAssignments = ["HOMEWORK", "ESSAY"] as const;

type ValidAssignments = typeof validAssignments[number];

export class Assignment {
  public expired: boolean;
  public assignmentType: ValidAssignments;
  public deadline: Date;

  public constructor(assignmentType: ValidAssignments, deadline: Date) {
    if (validAssignments.indexOf(assignmentType) == -1) {
      throw new Error(
        `Tried to assign invalid value to variable in constructor ${assignmentType}`
      );
    } else {
      this.assignmentType = assignmentType;
    }
    this.deadline = deadline;
    this.expired =
      Date.now() >= deadline[Symbol.toPrimitive]("number") ? true : false;
  }
}

export class Homework extends Assignment {
  public subject: string;
  public pages: string;

  public constructor(
    assignmentType: ValidAssignments,
    deadline: Date,
    subject: string,
    pages: string
  ) {
    super(assignmentType, deadline);
    this.subject = subject;
    this.pages = pages;
  }
}

export class Essay extends Assignment {
  public prompt: string;
  public genre: string;

  public constructor(
    assignmentType: ValidAssignments,
    deadline: Date,
    prompt: string,
    genre: string
  ) {
    super(assignmentType, deadline);
    this.prompt = prompt;
    this.genre = genre;
  }
}

export class Webhook {
  public url: string;
  constructor(url: string) {
    this.url = url;
  }
}
